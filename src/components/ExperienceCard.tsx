import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Experience } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MapPin, Clock, Users, Calendar, Heart } from 'lucide-react';
import { formatRupees, getTravelTimeMinutes } from '@/lib/formatters';
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ExperienceMap from './ExperienceMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { calculateHaversineDistance } from '@/lib/distanceUtils';

import { CITY_COORDINATES } from './CitySelector';

import { TravelInfoDisplay } from './TravelInfoDisplay';


interface ExperienceCardProps {
  experience: Experience;
  featured?: boolean;
  onWishlistChange?: (experienceId: string, isInWishlist: boolean) => void;
}

const ExperienceCard = ({ experience, featured = false, onWishlistChange }: ExperienceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toggleWishlist, isProcessing } = useExperienceInteractions(user?.id);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('selected_city') : null));
  const [selectedAddress, setSelectedAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('selected_address');
      try {
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  // Debug log to check values at render time
  console.log('RENDER ExperienceCard:', experience.title, experience.latitude, experience.longitude, selectedCity);

  useEffect(() => {
    const handleStorage = () => {
      setSelectedCity(localStorage.getItem('selected_city'));
      // Also update address if changed
      const raw = localStorage.getItem('selected_address');
      try {
        setSelectedAddress(raw ? JSON.parse(raw) : null);
      } catch {
        setSelectedAddress(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    console.log('TravelTime useEffect triggered for', experience.title, {
      lat: experience.latitude,
      lng: experience.longitude,
      selectedCity,
      cityCoords: selectedCity ? CITY_COORDINATES[selectedCity] : null
    });

    // Use selected city or default to Bangalore if no city is selected
    const cityToUse = selectedCity || 'Bangalore';
    const cityCoords = CITY_COORDINATES[cityToUse];

    // Prefer address coordinates if available
    let fromLat: number | null = null;
    let fromLng: number | null = null;
    if (selectedAddress && selectedAddress.lat && selectedAddress.lon) {
      fromLat = parseFloat(selectedAddress.lat);
      fromLng = parseFloat(selectedAddress.lon);
    } else if (selectedCity && CITY_COORDINATES[selectedCity]) {
      fromLat = CITY_COORDINATES[selectedCity].latitude;
      fromLng = CITY_COORDINATES[selectedCity].longitude;
    }

    if (
      experience.latitude && experience.longitude &&
      fromLat !== null && fromLng !== null
    ) {
      getTravelTimeMinutes(
        fromLat,
        fromLng,
        experience.latitude,
        experience.longitude
      ).then(mins => {
        if (mins !== null) setTravelTime(`~${mins} min`);
      });
      // Also calculate and set distance if address is selected
      if (selectedAddress && selectedAddress.lat && selectedAddress.lon) {
        const dist = calculateHaversineDistance(fromLat, fromLng, experience.latitude, experience.longitude);
        setDistance(`${dist.toFixed(1)} km away`);
      } else {
        setDistance(null);
      }
    } else {
      setTravelTime(null);
      setDistance(null);
    }
  }, [experience.latitude, experience.longitude, experience.id, selectedCity, selectedAddress]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!user) {
        setIsInWishlist(false);
        return;
      }

      try {
        const { data } = await supabase
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

    await toggleWishlist(experience.id, isInWishlist, { [experience.id]: experience }, () => {
      const newWishlistState = !isInWishlist;
      setIsInWishlist(newWishlistState);
      onWishlistChange?.(experience.id, newWishlistState);
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-xl hover-lift transition-all duration-300 h-full w-full flex flex-col",
        featured ? "md:col-span-2" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full overflow-hidden rounded-xl flex flex-col">
        {/* Image Container with Fixed Aspect Ratio */}
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={experience.imageUrl}
            alt={experience.title}
            className={cn(
              "w-full h-full object-cover object-center transition-transform duration-700 ease-out",
              isHovered ? "scale-110" : "scale-100"
            )}
            style={{ minHeight: '200px' }}
            onError={(e) => {
              console.log(`Image failed to load for ${experience.title}:`, experience.imageUrl);
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder.svg';
            }}
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Trending Badge */}
        {experience.trending && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-sm text-black px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium">
            Trending
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleToggleWishlist}
          disabled={isProcessing}
          className={cn(
            "absolute top-2 right-2 md:top-3 md:right-3 p-1.5 md:p-2 rounded-full backdrop-blur-sm transition-all z-10",
            isInWishlist
              ? "bg-white text-red-500"
              : "bg-black/30 text-white hover:bg-black/50"
          )}
          type="button"
        >
          <Heart className={cn("h-3.5 w-3.5 md:h-4 md:w-4", isInWishlist && "fill-red-500")} />
        </button>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 md:p-4 text-white">
          <div className={cn("transition-transform duration-300", isHovered ? "translate-y-0" : "translate-y-4")}>
            {/* Title */}
            <h3 className="text-lg md:text-xl font-medium mb-2 line-clamp-2">{experience.title}</h3>

            {/* Location + Price */}
            <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-3">
              <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center text-xs md:text-sm text-white/80 cursor-pointer hover:underline bg-transparent border-none p-0 m-0"
                    style={{ background: 'none', border: 'none' }}
                  >
                    <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{experience.location}</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px]">
                  <DialogHeader>
                    <DialogTitle>{experience.title}</DialogTitle>
                  </DialogHeader>
                  <ExperienceMap locationName={experience.location} />
                </DialogContent>
              </Dialog>
              <div className="text-base md:text-lg font-medium">{formatRupees(experience.price)}</div>
            </div>

            {/* Professional Info Bar for Time and Distance */}
            {(travelTime || distance) && (
              <div className="experience-info-bar mt-2 mb-3">
                <div className="flex items-center justify-center w-full gap-4">
                  <span className="flex items-center gap-1 text-white">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{travelTime ? travelTime : 'N/A'}</span>
                  </span>
                  <span className="h-5 w-px bg-gray-300 mx-2" />
                  <span className="flex items-center gap-1 text-white">
                    <MapPin className="h-4 w-4" />
                    <span className="font-medium">{distance ? distance : 'N/A'}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Duration, Participants, Date */}
            <div className={cn(
              "grid grid-cols-3 gap-1 md:gap-2 mb-3 md:mb-4 opacity-0 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              <div className="flex items-center text-xs text-white/70">
                <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{experience.duration}</span>
              </div>
              <div className="flex items-center text-xs text-white/70">
                <Users className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{experience.participants}</span>
              </div>
              <div className="flex items-center text-xs text-white/70">
                <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{experience.date}</span>
              </div>
            </div>

            {/* Travel Information - Only show if coordinates are available */}
            {
              experience.coordinates && (
                <div className={cn(
                  "mb-3 md:mb-4 opacity-0 transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0"
                )}>
                  <TravelInfoDisplay
                    experienceLocation={experience.coordinates}
                    className="bg-white/10 backdrop-blur-sm border-white/20"
                  />
                </div>
              )
            }

            {/* Button */}
            <div className={cn(
              "transition-all duration-300 transform",
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <Link to={`/experience/${experience.id}`}>
                <Button size="sm" className="w-full bg-white text-black hover:bg-white/90 font-semibold text-xs md:text-sm py-2">
                  View Experience
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
