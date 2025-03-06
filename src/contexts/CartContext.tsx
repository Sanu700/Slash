
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Experience, experiences } from '@/lib/data';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addToCart: (experienceId: string) => void;
  removeFromCart: (experienceId: string) => void;
  updateQuantity: (experienceId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  getExperienceById: (id: string) => Experience | undefined;
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
  const [items, setItems] = useState<CartItem[]>(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  
  const totalPrice = items.reduce((total, item) => {
    const experience = experiences.find(exp => exp.id === item.experienceId);
    return total + (experience?.price || 0) * item.quantity;
  }, 0);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const getExperienceById = (id: string) => {
    return experiences.find(exp => exp.id === id);
  };

  const addToCart = (experienceId: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.experienceId === experienceId);
      if (existingItem) {
        // Increment quantity if item already exists
        return prevItems.map(item => 
          item.experienceId === experienceId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item
        return [...prevItems, { experienceId, quantity: 1 }];
      }
    });
    
    const experience = getExperienceById(experienceId);
    toast.success(`Added ${experience?.title} to cart`);
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
