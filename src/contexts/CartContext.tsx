// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getExperienceById, CartItem, Experience } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { LoginModal } from '@/components/LoginModal';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  cachedExperiences: Record<string, Experience>;
  addToCart: (experienceId: string, selectedDate: Date, quantity?: number) => Promise<void>;
  removeFromCart: (experienceId: string) => Promise<void>;
  updateQuantity: (experienceId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [experienceCache, setExperienceCache] = useState<Record<string, Experience>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // 1) Load from Supabase or localStorage
  useEffect(() => {
    (async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('cart_items')
          .select('experience_id, quantity, date')
          .eq('user_id', user.id);

        if (!error && data) {
          const loaded: CartItem[] = data.map((row) => ({
            experienceId: row.experience_id,
            quantity: row.quantity,
            selectedDate: row.date ? new Date(row.date) : undefined
          }));
          setItems(loaded);
        }
      } else {
        const saved = localStorage.getItem('cart');
        if (saved) setItems(JSON.parse(saved));
      }
    })();
  }, [user]);

  // 2) Persist to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  // 3) Cache experiences & compute total
  useEffect(() => {
    (async () => {
      const cache = { ...experienceCache };
      for (const item of items) {
        if (!cache[item.experienceId]) {
          const exp = await getExperienceById(item.experienceId);
          if (exp) cache[item.experienceId] = exp;
        }
      }
      setExperienceCache(cache);

      const total = items.reduce((sum, item) => {
        const price = cache[item.experienceId]?.price || 0;
        return sum + price * item.quantity;
      }, 0);
      setTotalPrice(total);
    })();
  }, [items]);

  // 4) Add (or upsert) an item — now includes required `date` column
  const addToCart = async (experienceId: string, selectedDate: Date, quantity = 1) => {
    if (!user?.id) {
      setShowLoginModal(true);
      return;
    }
    const exp = await getExperienceById(experienceId);
    if (!exp) {
      toast.error('Unable to add to cart');
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .upsert(
        [{
          user_id:       user.id,
          experience_id: experienceId,
          quantity,
          date:           selectedDate.toISOString(),
          updated_at:    new Date().toISOString(),
        }],
        { onConflict: 'user_id,experience_id' }
      );

    if (error) {
      console.error('Add to cart error:', error);
      toast.error('Failed to add to cart');
      return;
    }

    setItems(prev => {
      const exists = prev.find(i => i.experienceId === experienceId);
      if (exists) {
        return prev.map(i =>
          i.experienceId === experienceId ? { ...i, quantity, selectedDate } : i
        );
      }
      return [...prev, { experienceId, quantity, selectedDate }];
    });
    toast.success('Added to cart');
  };

  // 5) Remove
  const removeFromCart = async (experienceId: string) => {
    if (user?.id) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('experience_id', experienceId);

      if (error) {
        console.error('Remove from cart error:', error);
        toast.error('Failed to remove from cart');
        return;
      }
    }

    setItems(prev => prev.filter(i => i.experienceId !== experienceId));
    toast.success('Removed from cart');
  };

  // 6) Update quantity (preserves the existing date column)
  const updateQuantity = async (experienceId: string, quantity: number) => {
    if (user?.id) {
      const { error } = await supabase
        .from('cart_items')
        .update({
          quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .eq('experience_id', experienceId);

      if (error) {
        console.error('Update quantity error:', error);
        toast.error('Failed to update quantity');
        return;
      }
    }
    setItems(prev =>
      prev.map(i =>
        i.experienceId === experienceId ? { ...i, quantity } : i
      )
    );
  };

  // 7) Clear
  const clearCart = async () => {
    if (user?.id) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Clear cart error:', error);
        toast.error('Failed to clear cart');
        return;
      }
    }
    setItems([]);
    toast.success('Cart cleared');
  };

  // 8) Dummy checkout
  const checkout = async (): Promise<boolean> => {
    if (!user) {
      toast.error('Please log in to checkout');
      return false;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return false;
    }
    await clearCart();
    return true;
  };

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      totalPrice,
      cachedExperiences: experienceCache,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
    }}>
      {children}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </CartContext.Provider>
  );
};

// Hook to use the cart
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
