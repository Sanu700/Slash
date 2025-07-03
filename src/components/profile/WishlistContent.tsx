import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data';
import { Heart } from 'lucide-react';

interface WishlistContentProps {
  wishlistExperiences: Experience[];
  handleExperienceClick: (experienceId: string) => void;
  onWishlistChange?: (experienceId: string, isInWishlist: boolean) => void;
  isLoading: boolean;
}

const WishlistContent = ({ wishlistExperiences, handleExperienceClick, onWishlistChange, isLoading }: WishlistContentProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 md:px-10">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Wishlist</h1>
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (Array.isArray(wishlistExperiences) && wishlistExperiences.length > 0) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {wishlistExperiences.map((exp, idx) => (
              <ExperienceCard key={exp.id} experience={exp} index={idx} isInWishlist={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save your favorite experiences to revisit later</p>
            <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistContent;
