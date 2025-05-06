import React, { createContext, useContext, useState, useEffect } from 'react';
import { getExperienceById } from '@/lib/data';
import { CartItem, Experience } from '@/lib/data';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

interface CartContextType {
  items: CartItem[];
  addToCart: (experienceId: string) => Promise<void>;
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

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [experienceCache, setExperienceCache] = useState<Record<string, Experience>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  // Load cart items from Supabase when user is authenticated or from localStorage when not
  useEffect(() => {
    const loadCartItems = async () => {
      if (user) {
        // User is authenticated, fetch cart from Supabase
        try {
          const { data, error } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', user.id);
            
          if (error) {
            throw error;
          }
          
          const cartItems: CartItem[] = data.map(item => ({
            experienceId: item.experience_id,
            quantity: item.quantity
          }));
          
          setItems(cartItems);
        } catch (error) {
          console.error('Error loading cart from Supabase:', error);
          toast.error('Failed to load your cart');
        }
      } else {
        // User is not authenticated, use localStorage
        try {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
        }
      }
    };
    
    loadCartItems();
  }, [user]);
  
  // Save cart items to localStorage when not authenticated
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, user]);

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

  const addToCart = async (experienceId: string) => {
    try {
      const experience = await getExperienceById(experienceId);
      if (!experience) {
        toast.error("Unable to add item to cart");
        return;
      }
      
      // Handle authenticated users
      if (user) {
        const existingItem = items.find(item => item.experienceId === experienceId);
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        
        // Upsert to cart_items table
        const { error } = await supabase
          .from('cart_items')
          .upsert(
            { 
              user_id: user.id,
              experience_id: experienceId,
              quantity: newQuantity,
              updated_at: new Date().toISOString()
            },
            { 
              onConflict: 'user_id,experience_id'
            }
          );
          
        if (error) {
          console.error('Error adding item to cart:', error);
          toast.error('Failed to add item to cart');
          return;
        }
        
        // Update local state
        setItems(prevItems => {
          if (existingItem) {
            return prevItems.map(item => 
              item.experienceId === experienceId 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
          } else {
            return [...prevItems, { experienceId, quantity: 1 }];
          }
        });
      } 
      // Handle non-authenticated users
      else {
        setItems(prevItems => {
          const existingItem = prevItems.find(item => item.experienceId === experienceId);
          if (existingItem) {
            return prevItems.map(item => 
              item.experienceId === experienceId 
                ? { ...item, quantity: item.quantity + 1 } 
                : item
            );
          } else {
            return [...prevItems, { experienceId, quantity: 1 }];
          }
        });
      }
      
      // Cache the experience
      setExperienceCache(prev => ({
        ...prev,
        [experienceId]: experience
      }));
      
      toast.success(`Added ${experience.title} to cart`);
    } catch (error) {
      console.error('Error in addToCart:', error);
      toast.error('Failed to add item to cart');
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
    </CartContext.Provider>
  );
};
