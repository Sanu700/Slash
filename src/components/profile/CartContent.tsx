
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

interface CartContentProps {
  cartExperiences: Experience[];
  handleExperienceClick: (experienceId: string) => void;
}

const CartContent = ({ cartExperiences, handleExperienceClick }: CartContentProps) => {
  const navigate = useNavigate();
  const { updateQuantity } = useCart();

  return (
    <>
      {cartExperiences.length > 0 ? (
        <div className="space-y-8">
          {cartExperiences.map(experience => {
            // Get cart item quantity from the context
            const cartItem = useCart().items.find(item => item.experienceId === experience.id);
            const quantity = cartItem ? cartItem.quantity : 0;
            
            // Create a new experience object with onClick handler
            const expWithClick = {
              ...experience,
              onClick: () => handleExperienceClick(experience.id)
            };
            
            return (
              <div key={experience.id} className="relative">
                <ExperienceCard 
                  experience={expWithClick}
                />
                <div className="absolute bottom-4 right-4 flex items-center bg-background/90 p-2 rounded-lg shadow">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(experience.id, Math.max(0, quantity - 1));
                    }}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-3 font-medium">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateQuantity(experience.id, quantity + 1);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
