import React, { createContext, useContext, useState, useEffect } from 'react';
import { getExperienceById } from '@/lib/data';
import { CartItem, Experience } from '@/lib/data';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { LoginModal } from '@/components/LoginModal';

interface CartContextType {
  items: CartItem[];
  addToCart: (experienceId: string, date?: Date) => Promise<void>;
  removeFromCart: (experienceId: string) => Promise<void>;
  updateQuantity: (experienceId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
  totalPrice: number;
  getExperienceById: (id: string) => Promise<Experience | null>;
  cachedExperiences: Record<string, Experience>;
  checkout: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [experienceCache, setExperienceCache] = useState<Record<string, Experience>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      setItems(data.map(item => ({
        experienceId: item.experience_id,
        quantity: item.quantity,
        date: item.date
      })));
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  };

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      // Load from localStorage for guests
      const cart = localStorage.getItem('cart');
      if (cart) {
        setItems(JSON.parse(cart));
      }
    }
  }, [user]);
  
  // Load and cache experiences for the cart
  useEffect(() => {
    const fetchExperiencesForCart = async () => {
      const newCache: Record<string, Experience> = { ...experienceCache };
      let needsUpdate = false;
      
      for (const item of items) {
        if (!newCache[item.experienceId]) {
          const experience = await getExperienceById(item.experienceId);
          if (experience) {
            newCache[item.experienceId] = experience;
            needsUpdate = true;
          }
        }
      }
      
      if (needsUpdate) {
        setExperienceCache(newCache);
      }
      
      // Calculate total price
      const total = items.reduce((sum, item) => {
        const experience = newCache[item.experienceId];
        return sum + (experience?.price || 0) * item.quantity;
      }, 0);
      
      setTotalPrice(total);
    };
    
    fetchExperiencesForCart();
  }, [items]);

  const addToCart = async (experienceId: string, date?: Date) => {
    if (!user) {
      // Handle guest cart in localStorage
      try {
        const cart = localStorage.getItem('cart');
        const cartItems = cart ? JSON.parse(cart) : [];
        const existingItem = cartItems.find((item: CartItem) => item.experienceId === experienceId);
        
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          cartItems.push({ 
            experienceId, 
            quantity: 1,
            date: date?.toISOString()
          });
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
        setItems(cartItems);
        return;
      } catch (error) {
        console.error('Error adding to guest cart:', error);
        throw new Error('Failed to add to cart');
      }
    }

    try {
      // First check if the experience exists
      const { data: experience, error: experienceError } = await supabase
        .from('experiences')
        .select('id')
        .eq('id', experienceId)
        .single();

      if (experienceError || !experience) {
        console.error('Experience not found:', experienceError);
        throw new Error('Experience not found');
      }

      // Then check for existing cart item
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('experience_id', experienceId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching cart item:', fetchError);
        throw new Error('Failed to check cart');
      }

      if (existingItem) {
        // Update quantity if item exists
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ 
            quantity: existingItem.quantity + 1,
            date: date?.toISOString() || existingItem.date,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);

        if (updateError) {
          console.error('Error updating cart item:', updateError);
          throw new Error('Failed to update cart');
        }
      } else {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            experience_id: experienceId,
            quantity: 1,
            date: date?.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (insertError) {
          console.error('Error inserting cart item:', insertError);
          throw new Error('Failed to add to cart');
        }
      }

      // Refresh cart items
      await fetchCartItems();
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  };

  const removeFromCart = async (experienceId: string) => {
    try {
      // Handle authenticated users
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id)
          .eq('experience_id', experienceId);
          
        if (error) {
          console.error('Error removing item from cart:', error);
          toast.error('Failed to remove item from cart');
          return;
        }
      }
      
      // Update local state
      setItems(prevItems => prevItems.filter(item => item.experienceId !== experienceId));
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error in removeFromCart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  const updateQuantity = async (experienceId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(experienceId);
        return;
      }
      
      // Handle authenticated users
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id)
          .eq('experience_id', experienceId);
          
        if (error) {
          console.error('Error updating cart quantity:', error);
          toast.error('Failed to update quantity');
          return;
        }
      }
      
      // Update local state
      setItems(prevItems => 
        prevItems.map(item => 
          item.experienceId === experienceId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (error) {
      console.error('Error in updateQuantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      // Handle authenticated users
      if (user) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) {
          console.error('Error clearing cart:', error);
          toast.error('Failed to clear cart');
          return;
        }
      }
      
      // Update local state
      setItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error in clearCart:', error);
      toast.error('Failed to clear cart');
    }
  };

  /**
   * Process checkout - create booking records in the database
   * @returns boolean indicating success or failure
   */
  const checkout = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to checkout');
      return false;
    }
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }
    
    try {
      // First, calculate total amount
      const total = items.reduce((sum, item) => {
        const experience = experienceCache[item.experienceId];
        return sum + (experience?.price || 0) * item.quantity;
      }, 0);
      
      // Create booking record
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'confirmed',
          payment_method: 'credit_card', // This would come from payment form in a real app
          notes: 'Processed via web checkout'
        })
        .select('id')
        .single();
      
      if (bookingError || !bookingData) {
        console.error('Error creating booking record:', bookingError);
        return false;
      }
      
      // Create booking items
      const bookingItems = items.map(item => {
        const experience = experienceCache[item.experienceId];
        return {
          booking_id: bookingData.id,
          experience_id: item.experienceId,
          quantity: item.quantity,
          price_at_booking: experience?.price || 0
        };
      });
      
      const { error: itemsError } = await supabase
        .from('booking_items')
        .insert(bookingItems);
      
      if (itemsError) {
        console.error('Error creating booking items:', itemsError);
        return false;
      }
      
      // Clear the cart after successful checkout
      await clearCart();
      
      return true;
    } catch (error) {
      console.error('Error during checkout:', error);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      itemCount,
      totalPrice,
      getExperienceById,
      cachedExperiences: experienceCache,
      checkout
    }}>
      {children}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </CartContext.Provider>
  );
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export { CartProvider, useCart };
