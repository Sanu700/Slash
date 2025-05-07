
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Experience } from '@/lib/data';

export const useExperienceInteractions = (userId: string | undefined) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Function to track when a user views an experience
  const trackExperienceView = async (experienceId: string) => {
    if (!userId) return;
    
    try {
      // Upsert to viewed_experiences table
      await supabase
        .from('viewed_experiences')
        .upsert(
          { 
            user_id: userId,
            experience_id: experienceId,
            viewed_at: new Date().toISOString()
          },
          { 
            onConflict: 'user_id,experience_id'
          }
        );
    } catch (error) {
      console.error('Error tracking experience view:', error);
    }
  };
  
  // Function to toggle wishlist
  const toggleWishlist = async (experienceId: string, isInWishlist: boolean, cachedExperiences: Record<string, Experience>, onSuccess?: (experiences: Experience[]) => void) => {
    if (!userId) return;
    setIsProcessing(true);
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', userId)
          .eq('experience_id', experienceId);
          
        if (error) throw error;
        
        toast.success('Removed from wishlist');
        if (onSuccess) {
          // Get updated wishlist
          const { data } = await supabase
            .from('wishlists')
            .select('experience_id')
            .eq('user_id', userId);
            
          const experiences = data 
            ? data
                .map(item => cachedExperiences[item.experience_id])
                .filter(exp => exp !== undefined)
            : [];
          
          onSuccess(experiences);
        }
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: userId,
            experience_id: experienceId,
            added_at: new Date().toISOString()
          });
          
        if (error) throw error;
        
        // Get the experience details
        const experience = cachedExperiences[experienceId];
        if (experience) {
          toast.success('Added to wishlist');
          if (onSuccess) {
            const { data } = await supabase
              .from('wishlists')
              .select('experience_id')
              .eq('user_id', userId);
              
            const experiences = data 
              ? data
                  .map(item => cachedExperiences[item.experience_id])
                  .filter(exp => exp !== undefined)
              : [];
            
            onSuccess(experiences);
          }
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Function to update cart items in Supabase
  const syncCartItems = async (experienceId: string, quantity: number) => {
    if (!userId) return false;
    
    try {
      // First check if the item exists in the cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', userId)
        .eq('experience_id', experienceId)
        .maybeSingle();
      
      if (existingItem) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('id', existingItem.id);
            
          if (deleteError) throw deleteError;
        } else {
          // Update quantity
          const { error: updateError } = await supabase
            .from('cart_items')
            .update({ quantity, updated_at: new Date().toISOString() })
            .eq('id', existingItem.id);
            
          if (updateError) throw updateError;
        }
      } else if (quantity > 0) {
        // Insert new item
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: userId,
            experience_id: experienceId,
            quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (insertError) throw insertError;
      }
      
      return true;
    } catch (error) {
      console.error('Error syncing cart items:', error);
      return false;
    }
  };
  
  // Function to create a booking from cart items
  const createBookingFromCart = async (cartItems: Array<{experienceId: string, quantity: number}>, totalAmount: number) => {
    if (!userId || cartItems.length === 0) return null;
    
    try {
      // 1. Create booking record
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: userId,
          total_amount: totalAmount,
          booking_date: new Date().toISOString(),
          status: 'confirmed'
        })
        .select()
        .single();
        
      if (bookingError) throw bookingError;
      
      // 2. Add booking items
      const bookingItems = cartItems.map(item => ({
        booking_id: bookingData.id,
        experience_id: item.experienceId,
        quantity: item.quantity,
        price_at_booking: 0 // This will be updated once we fetch the experience price
      }));
      
      // Fetch prices for each experience
      for (const item of bookingItems) {
        const { data: expData } = await supabase
          .from('experiences')
          .select('price')
          .eq('id', item.experience_id)
          .single();
          
        if (expData) {
          item.price_at_booking = expData.price;
        }
      }
      
      // Insert booking items
      const { error: itemsError } = await supabase
        .from('booking_items')
        .insert(bookingItems);
        
      if (itemsError) throw itemsError;
      
      // 3. Clear cart items after successful booking
      const { error: clearCartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
        
      if (clearCartError) throw clearCartError;
      
      return bookingData.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  };
  
  // Handle click to navigate to experience detail
  const handleExperienceClick = (experienceId: string) => {
    trackExperienceView(experienceId);
    navigate(`/experience/${experienceId}`);
  };

  return {
    trackExperienceView,
    toggleWishlist,
    handleExperienceClick,
    syncCartItems,
    createBookingFromCart,
    isProcessing
  };
};
