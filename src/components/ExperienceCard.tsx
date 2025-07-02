import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Experience } from '@/lib/data';
import { Heart, HeartIcon, MapPin, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ExperienceMap from './ExperienceMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { calculateHaversineDistance } from '@/lib/distanceUtils';
import { CITY_COORDINATES } from './CitySelector';
import { cn } from '@/lib/utils'; // Assuming classNames helper
import { formatRupees } from '@/lib/currencyUtils'; // Add if needed

function getValidImgSrc(src: any) {
  if (!src) return '/placeholder.svg';
  if (Array.isArray(src)) return getValidImgSrc(src[0]);
  if (typeof src === 'object') {
    return src.url || src.path || '/placeholder.svg';
  }
  if (typeof src === 'string' && src.startsWith('data:image/')) return src;
  if (/^[A-Za-z0-9+/=]+={0,2}$/.test(src) && src.length > 100) {
    return `data:image/jpeg;base64,${src}`;
  }
  return src;
}

interface ExperienceCardProps {
  experience: Experience;
  featured?: boolean;
  onWishlistChange?: (experienceId: string, isInWishlist: boolean) => void;
  index?: number;
}

const ExperienceCard = ({ experience, featured = false, onWishlistChange }: ExperienceCardProps) => {
  const { user } = useAuth();
  const { toggleWishlist, isProcessing } = useExperienceInteractions(user?.id);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imgSrc, setImgSrc] = useState(experience.imageUrl || '/placeholder.svg');

  const [selectedCity, setSelectedCity] = useState(() =>
    typeof window !== 'undefined' ? localStorage.getItem('selected_city') : null
  );
  const [selectedAddress, setSelectedAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('selected_address') || '{}');
      } catch {
        return null;
      }
    }
    return null;
  });

  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => {
      setSelectedCity(localStorage.getItem('selected_city'));
      try {
        setSelectedAddress(JSON.parse(localStorage.getItem('selected_address') || '{}'));
      } catch {
        setSelectedAddress(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const fromLat = selectedAddress?.lat ?? CITY_COORDINATES[selectedCity || 'Bangalore']?.latitude;
    const fromLng = selectedAddress?.lon ?? CITY_COORDINATES[selectedCity || 'Bangalore']?.longitude;
    if (experience.latitude && experience.longitude && fromLat && fromLng) {
      const dist = calculateHaversineDistance(+fromLat, +fromLng, experience.latitude, experience.longitude);
      setDistance(`${dist.toFixed(1)} km`);
      const minutes = Math.max(1, Math.round((dist / 30) * 60));
      if (minutes >= 60) {
        const hr = Math.floor(minutes / 60);
        const min = minutes % 60;
        setTravelTime(min ? `${hr} hr ${min} min` : `${hr} hr`);
      } else {
        setTravelTime(`${minutes} min`);
      }
    }
  }, [experience, selectedCity, selectedAddress]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) return setIsInWishlist(false);
      const { data } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('experience_id', experience.id)
        .single();
      setIsInWishlist(!!data);
    };
    checkWishlist();
  }, [user, experience.id]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return toast.error('Please log in to save to your wishlist');
    await toggleWishlist(experience.id, isInWishlist, { [experience.id]: experience }, () => {
      const newWishlistState = !isInWishlist;
      setIsInWishlist(newWishlistState);
      onWishlistChange?.(experience.id, newWishlistState);
    });
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl hover:shadow-xl transition-all duration-300 h-full w-full flex flex-col bg-white shadow',
        featured ? 'md:col-span-2' : ''
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl flex flex-col flex-1">
        <div className="flex-1 h-full w-full overflow-hidden">
          <img
            src={getValidImgSrc(imgSrc)}
            alt={experience.title}
            className={cn(
              'w-full h-full object-cover object-center transition-transform duration-700 ease-out',
              isHovered ? 'scale-110' : 'scale-100'
            )}
            onError={() => {
              setImgSrc('/placeholder.svg');
              setImgError(true);
            }}
          />
        </div>

        <button
          className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleToggleWishlist}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          disabled={isProcessing}
        >
          {isInWishlist ? (
            <HeartIcon className="h-5 w-5 text-red-500 fill-red-500" />
          ) : (
            <Heart className="h-5 w-5 text-gray-300 group-hover:text-red-500" />
          )}
        </button>

        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white pointer-events-none bg-gradient-to-t from-black/80 via-black/30 to-transparent">
          <h3 className="text-lg font-semibold mb-1 line-clamp-2 pointer-events-auto">{experience.title}</h3>

            {/* Location as text */}
            <div className="text-xs md:text-sm text-white/80 mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span className="truncate">{experience.location}</span>
            </div>

            {/* Location + Price */}
            <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-3">
              <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogTrigger asChild>
          <div className="flex items-center space-x-4 text-sm mb-1 pointer-events-auto">
            <span title={experience.location} className="flex items-center truncate">
              <MapPin className="h-4 w-4 mr-1" />
              {experience.location}
            </span>


            {distance && travelTime && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {travelTime} • {distance}
              </span>
            )}
          </div>

          {experience.description && (
            <p className="text-sm text-white/80 line-clamp-2 mb-2 pointer-events-auto">{experience.description}</p>
          )}

          <div className="flex items-center gap-4 text-xs pointer-events-auto">
            {experience.duration && (
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {experience.duration}
              </span>
            )}
            {experience.participants && (
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {experience.participants}
              </span>
            )}
            {experience.date && (
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {experience.date}
              </span>
            )}
          </div>

          <div className="mt-3 pointer-events-auto">
            <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-white text-black w-full mb-2">
                  Show Map
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{experience.title} - Location</DialogTitle>
                </DialogHeader>
                <ExperienceMap locationName={experience.location} />
              </DialogContent>
            </Dialog>

            <Link to={`/experience/${experience.id}`}>
              <Button size="sm" className="w-full bg-primary text-white hover:bg-primary/90">
                View Experience
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
