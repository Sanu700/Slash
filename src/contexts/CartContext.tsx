
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getExperienceById } from '@/lib/data';
import { CartItem, Experience } from '@/lib/data';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

interface CartContextType {
  items: CartItem[];
  addToCart: (experienceId: string) => void;
  removeFromCart: (experienceId: string) => void;
  updateQuantity: (experienceId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  getExperienceById: (id: string) => Promise<Experience | null>;
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
  const [items, setItems] = useState<CartItem[]>(() => {
    const cartKey = user?.id ? `cart_${user.id}` : 'cart';
    const savedCart = localStorage.getItem(cartKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [experienceCache, setExperienceCache] = useState<Record<string, Experience>>({});
  const [totalPrice, setTotalPrice] = useState(0);
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
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

  useEffect(() => {
    const cartKey = user?.id ? `cart_${user.id}` : 'cart';
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, user]);

  useEffect(() => {
    if (user?.id) {
      const userCartKey = `cart_${user.id}`;
      const savedUserCart = localStorage.getItem(userCartKey);
      if (savedUserCart) {
        setItems(JSON.parse(savedUserCart));
      }
    }
  }, [user]);

  const addToCart = async (experienceId: string) => {
    const experience = await getExperienceById(experienceId);
    if (!experience) {
      toast.error("Unable to add item to cart");
      return;
    }
    
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
    
    // Cache the experience
    setExperienceCache(prev => ({
      ...prev,
      [experienceId]: experience
    }));
    
    toast.success(`Added ${experience.title} to cart`);
  };

  const removeFromCart = (experienceId: string) => {
    setItems(prevItems => prevItems.filter(item => item.experienceId !== experienceId));
    toast.success('Item removed from cart');
  };

  const updateQuantity = (experienceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(experienceId);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.experienceId === experienceId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
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
      getExperienceById
    }}>
      {children}
    </CartContext.Provider>
  );
};
