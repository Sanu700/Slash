import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

/**
 * Hook to track when a user views an experience
 * Adds an entry to the viewed_experiences table
 * 
 * @param experienceId The ID of the experience being viewed
 */
export const useTrackExperienceView = (experienceId: string) => {
  const { user } = useAuth();
  
  useEffect(() => {
    const trackView = async () => {
      if (!user || !experienceId) return;
      
      try {
        await supabase
          .from('viewed_experiences')
          .upsert(
            { 
              user_id: user.id,
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
    
    trackView();
  }, [experienceId, user]);
};

export default useTrackExperienceView;
