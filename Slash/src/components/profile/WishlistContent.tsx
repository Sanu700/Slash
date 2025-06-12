
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data';
import { Heart } from 'lucide-react';

interface WishlistContentProps {
  wishlistExperiences: Experience[];
  handleExperienceClick: (experienceId: string) => void;
}

const WishlistContent = ({ wishlistExperiences, handleExperienceClick }: WishlistContentProps) => {
  const navigate = useNavigate();

  return (
    <>
      {wishlistExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {wishlistExperiences.map(experience => {
            const expWithClick = {
              ...experience,
              onClick: () => handleExperienceClick(experience.id)
            };
            
            return (
              <ExperienceCard 
                key={experience.id} 
                experience={expWithClick}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Save your favorite experiences to revisit later</p>
          <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
        </div>
      )}
    </>
  );
};

export default WishlistContent;
