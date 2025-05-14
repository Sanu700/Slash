
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { ExtendedProfile } from './data/types';

export interface ProfileUpdateData {
  full_name?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
}

/**
 * Updates a user's profile in both auth metadata and profiles table
 */
export const updateUserProfile = async (userId: string, data: ProfileUpdateData) => {
  try {
    console.log("Starting profile update with data:", data);
    
    // First update the user metadata (only name and avatar)
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: data.full_name,
        avatar_url: data.avatar_url
      }
    });
    
    if (updateError) {
      console.error('Error updating auth metadata:', updateError);
      throw new Error(`Failed to update profile: ${updateError.message}`);
    }
    
    console.log('Auth metadata updated successfully');
    
    // Try the security definer function first
    try {
      const { data: fnResult, error: fnError } = await supabase.rpc('update_profile_secure', {
        user_id: userId,
        user_full_name: data.full_name,
        user_avatar_url: data.avatar_url,
        user_phone: data.phone,
        user_address: data.address,
        user_bio: data.bio
      });
      
      if (!fnError) {
        console.log('Profile updated via secure function');
        // Function succeeded, no need to try the fallback
        const { data: { session: newSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error refreshing session:', sessionError);
          throw new Error(`Failed to refresh session: ${sessionError.message}`);
        }
        
        return { success: true, session: newSession };
      }
      
      // If function fails, log the error but continue with the direct update approach
      console.warn('Secure function update failed, trying direct update:', fnError);
    } catch (fnCatchError) {
      console.warn('Error using secure function:', fnCatchError);
      // Continue with direct update as fallback
    }
    
    // Fallback: Update the profiles table directly
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        phone: data.phone,
        address: data.address,
        bio: data.bio,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (profileError) {
      console.error('Error updating profiles table:', profileError);
      throw new Error(`Failed to update profile data: ${profileError.message}`);
    }
    
    console.log('Profiles table updated successfully');
    
    // Refresh the session to get updated user data
    const { data: { session: newSession }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error refreshing session:', sessionError);
      throw new Error(`Failed to refresh session: ${sessionError.message}`);
    }
    
    return { success: true, session: newSession };
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive"
    });
    throw error;
  }
};

/**
 * Fetches a user's extended profile data
 */
export const fetchUserProfile = async (userId: string): Promise<ExtendedProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return null;
  }
};
