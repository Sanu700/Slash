import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Experience } from '@/lib/data/types';
import ExperienceCard from '@/components/ExperienceCard';
import { toast } from 'sonner';

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user) return;

      try {
        // Get wishlist items from Supabase
        const { data: wishlistData, error: wishlistError } = await supabase
          .from('wishlists')
          .select('experience_id')
          .eq('user_id', user.id);

        if (wishlistError) throw wishlistError;

        if (wishlistData && wishlistData.length > 0) {
          // Get experience details for each wishlist item
          const { data: experiences, error: experiencesError } = await supabase
            .from('experiences')
            .select('*')
            .in('id', wishlistData.map(item => item.experience_id));

          if (experiencesError) throw experiencesError;
          setWishlistItems((experiences || []).map(exp => ({
            ...exp,
            imageUrl: exp.image_url,
            groupActivity: exp.group_activity,
            createdAt: exp.created_at,
            updatedAt: exp.updated_at
          })));
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const handleWishlistChange = (experienceId: string, isInWishlist: boolean) => {
    if (!isInWishlist) {
      // Remove the experience from the list when it's un-wishlisted
      setWishlistItems(prev => prev.filter(item => item.id !== experienceId));
    }
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-8 mt-[72px]">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 mt-[72px]">
      <h1 className="text-3xl font-bold mb-8 text-foreground">My Wishlist</h1>
      
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((experience) => (
            <ExperienceCard 
              key={experience.id} 
              experience={experience}
              onWishlistChange={handleWishlistChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-medium mb-2 text-foreground">Your wishlist is empty</h2>
          <p className="text-muted-foreground mb-6">Start adding experiences you love to your wishlist</p>
          <Button onClick={() => navigate('/experiences')}>
            Browse Experiences
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist; 