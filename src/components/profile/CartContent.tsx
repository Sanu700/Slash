
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data';
import { ShoppingCart } from 'lucide-react';

interface CartContentProps {
  cartExperiences: Experience[];
  handleExperienceClick: (experienceId: string) => void;
}

const CartContent = ({ cartExperiences, handleExperienceClick }: CartContentProps) => {
  const navigate = useNavigate();

  return (
    <>
      {cartExperiences.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartExperiences.map(experience => {
            // Create a new experience object with onClick handler
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
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Discover unforgettable experiences and create memories</p>
          <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
        </div>
      )}
    </>
  );
};

export default CartContent;
