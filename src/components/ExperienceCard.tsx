import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Experience } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Users, Calendar, Heart } from 'lucide-react';
import { formatRupees } from '@/lib/formatters';
import { useCart } from '@/contexts/CartContext';
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ExperienceCardProps {
  experience: Experience;
  featured?: boolean;
}

const ExperienceCard = ({ experience, featured = false }: ExperienceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleWishlist, isProcessing } = useExperienceInteractions(user?.id);

  // Check if experience is in wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) {
        setIsInWishlist(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('experience_id', experience.id)
          .single();
          
        setIsInWishlist(!!data);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    checkWishlist();
  }, [user, experience.id]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to save to your wishlist');
      return;
    }
    await toggleWishlist(experience.id, isInWishlist, { [experience.id]: experience }, (experiences) => {
      setIsInWishlist(!isInWishlist);
    });
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(experience.id);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-xl hover-lift transition-all duration-300",
        featured ? "md:col-span-2" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
        {/* Image */}
        <img
          src={experience.imageUrl}
          alt={experience.title}
          className={cn(
            "h-full w-full object-cover transition-transform duration-700 ease-out",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Trending Badge */}
        {experience.trending && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-black px-3 py-1 rounded-full text-xs font-medium">
            Trending
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={isProcessing}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all z-10",
            isInWishlist 
              ? "bg-white text-red-500" 
              : "bg-black/30 text-white hover:bg-black/50"
          )}
          type="button"
        >
          <Heart className={cn("h-4 w-4", isInWishlist && "fill-red-500")} />
        </button>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
          <div className={cn(
            "transition-transform duration-300",
            isHovered ? "translate-y-0" : "translate-y-4"
          )}>
            <h3 className="text-xl font-medium mb-2">{experience.title}</h3>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center text-sm text-white/80">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{experience.location}</span>
              </div>
              <div className="text-lg font-medium">{formatRupees(experience.price)}</div>
            </div>
            
            <div className={cn(
              "grid grid-cols-3 gap-2 mb-4 opacity-0 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <div className="flex items-center text-xs text-white/70">
                <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{experience.duration}</span>
              </div>
              <div className="flex items-center text-xs text-white/70">
                <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                <span>{experience.participants}</span>
              </div>
              <div className="flex items-center text-xs text-white/70">
                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{experience.date}</span>
              </div>
            </div>
            
            <div className={cn(
              "transition-all duration-300 transform",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Link to={`/experience/${experience.id}`}>
                <Button size="sm" className="w-full bg-white text-black hover:bg-white/90">
                  View Experience
                </Button>
              </Link>
              <Button size="sm" variant="outline" className="w-full mt-2 text-black" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
