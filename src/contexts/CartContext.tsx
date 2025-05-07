import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Experience } from '@/lib/data';

// Import the updated hooks
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';
import { useAuth } from '@/lib/auth';

export interface CartItem {
  experienceId: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (experienceId: string, quantity?: number) => Promise<void>;
  removeItem: (experienceId: string) => void;
  updateQuantity: (experienceId: string, quantity: number) => void;
  clearCart: () => void;
  cachedExperiences: Record<string, Experience>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Error parsing cart from localStorage:', error);
      return [];
    }
  });
  const [cachedExperiences, setCachedExperiences] = useState<Record<string, Experience>>({});
  
  // Get the authenticated user
  const { user } = useAuth();
  // Use skipNavigation=true since this component is used outside Router context
  const { syncCartItems } = useExperienceInteractions(user?.id, true);

  const loadExperiencesForCart = useCallback(async (experienceIds: string[]) => {
    if (experienceIds.length === 0) return;
    
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .in('id', experienceIds);
        
      if (error) throw error;
      
      const newExperiences = {};
      data.forEach(item => {
        newExperiences[item.id] = {
          id: item.id,
          title: item.title,
          description: item.description,
          imageUrl: item.image_url,
          price: item.price,
          location: item.location,
          duration: item.duration,
          participants: item.participants,
          date: item.date,
          category: item.category,
          nicheCategory: item.niche_category,
          trending: item.trending,
          featured: item.featured,
          romantic: item.romantic,
          adventurous: item.adventurous,
          group: item.group_activity
        } as Experience;
      });
      
      setCachedExperiences(prev => ({ ...prev, ...newExperiences }));
    } catch (error) {
      console.error('Error loading experiences:', error);
    }
  }, []);

  // Load cart items from Supabase when user is authenticated
  useEffect(() => {
    const loadCartFromSupabase = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('experience_id, quantity')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Convert Supabase data format to our CartItem format
          const cartItems = data.map(item => ({
            experienceId: item.experience_id,
            quantity: item.quantity
          }));
          
          setItems(cartItems);
          
          // Prefetch experiences data for the cart
          await loadExperiencesForCart(cartItems.map(item => item.experienceId));
        }
      } catch (error) {
        console.error('Error loading cart from Supabase:', error);
      }
    };
    
    loadCartFromSupabase();
  }, [user, loadExperiencesForCart]);

  // Function to add an item to the cart
  const addItem = useCallback(async (experienceId: string, quantity: number = 1) => {
    setItems(prevItems => {
      // Check if the item already exists in the cart
      const existingItem = prevItems.find(item => item.experienceId === experienceId);
      
      let newItems;
      if (existingItem) {
        // Update the quantity of the existing item
        newItems = prevItems.map(item =>
          item.experienceId === experienceId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add a new item
        newItems = [...prevItems, { experienceId, quantity }];
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      
      // Sync with Supabase if user is authenticated
      if (user?.id) {
        const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;
        syncCartItems(experienceId, newQuantity);
      }
      
      // Load experience data if not already cached
      if (!cachedExperiences[experienceId]) {
        loadExperiencesForCart([experienceId]);
      }
      
      return newItems;
    });
    
    toast.success('Added to cart');
  }, [cachedExperiences, user?.id, syncCartItems, loadExperiencesForCart]);

  // Function to update the quantity of an item in the cart
  const updateQuantity = useCallback(async (experienceId: string, quantity: number) => {
    if (quantity < 0) {
      return;
    }
    
    setItems(prevItems => {
      let newItems;
      
      if (quantity === 0) {
        // Remove the item if quantity is 0
        newItems = prevItems.filter(item => item.experienceId !== experienceId);
      } else {
        // Update the quantity
        newItems = prevItems.map(item =>
          item.experienceId === experienceId
            ? { ...item, quantity }
            : item
        );
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      
      // Sync with Supabase if user is authenticated
      if (user?.id) {
        syncCartItems(experienceId, quantity);
      }
      
      return newItems;
    });
  }, [user?.id, syncCartItems]);

  // Function to remove an item from the cart
  const removeItem = useCallback((experienceId: string) => {
    setItems(prevItems => {
      const newItems = prevItems.filter(item => item.experienceId !== experienceId);
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(newItems));
      
      // Sync with Supabase if user is authenticated
      if (user?.id) {
        syncCartItems(experienceId, 0); // 0 quantity will delete the item
      }
      
      return newItems;
    });
    
    toast.success('Removed from cart');
  }, [user?.id, syncCartItems]);

  // Function to clear the cart
  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cart');
  }, []);

  const totalItems = useMemo(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => {
      const experience = cachedExperiences[item.experienceId];
      return total + (experience ? experience.price * item.quantity : 0);
    }, 0);
  }, [items, cachedExperiences]);

  const cartContext = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    cachedExperiences,
    totalItems,
    totalPrice
  };

  return (
    <CartContext.Provider value={cartContext}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};
