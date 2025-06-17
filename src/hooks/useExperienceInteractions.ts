import { supabase } from '@/lib/supabase';
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
  const toggleWishlist = async (
    experienceId: string,
    isInWishlist: boolean,
    experiences: Record<string, any>,
    onSuccess?: (experiences: Record<string, any>) => void
  ) => {
    if (!userId) {
      toast.error('Please log in to manage your wishlist');
      return;
    }

    setIsProcessing(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .match({ user_id: userId, experience_id: experienceId });

        if (error) throw error;

        const updatedExperiences = { ...experiences };
        delete updatedExperiences[experienceId];
        onSuccess?.(updatedExperiences);
        toast.success('Removed from wishlist');
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

        const updatedExperiences = { ...experiences };
        updatedExperiences[experienceId] = true;
        onSuccess?.(updatedExperiences);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsProcessing(false);
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
    isProcessing
  };
};
