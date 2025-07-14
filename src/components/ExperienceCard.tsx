import { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Experience } from '@/lib/data';
import { Heart, HeartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import ExperienceMap from './ExperienceMap';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { calculateHaversineDistance } from '@/lib/distanceUtils';
import { MapPin, Clock } from 'lucide-react';

import { CITY_COORDINATES } from './CitySelector';

import { TravelInfoDisplay } from './TravelInfoDisplay';

// Array of fallback images for variety
const FALLBACK_IMAGES = [
  '/placeholder.svg',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
];

function getRandomFallback() {
  return FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
}

function getValidImgSrc(src: any) {
  if (!src) return '/placeholder.svg';
  if (Array.isArray(src)) {
    // Use the first image in the array, or fallback
    return getValidImgSrc(src[0]);
  }
  if (typeof src === 'object') {
    if (src.url && typeof src.url === 'string') return src.url;
    if (src.path && typeof src.path === 'string') return src.path;
    return '/placeholder.svg';
  }
  if (typeof src !== 'string') return '/placeholder.svg';
  if (src.startsWith('data:image/')) return src;
  if (/^[A-Za-z0-9+/=]+={0,2}$/.test(src) && src.length > 100) {
    return `data:image/jpeg;base64,${src}`;
  }
  return src;
}

interface ExperienceCardProps {
  experience: Experience;
  featured?: boolean;
  onWishlistChange?: (experienceId: string, isInWishlist: boolean) => void;
  isInWishlist?: boolean;
  index?: number;
  openInNewTab?: boolean;
}

const ExperienceCard = ({ experience, featured = false, onWishlistChange, isInWishlist = false, index, openInNewTab = false }: ExperienceCardProps) => {
  const { user } = useAuth();
  const { toggleWishlist, isProcessing } = useExperienceInteractions(user?.id);
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

  // Update selectedCity and selectedAddress when localStorage changes or when the user selects a new city
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

  // Also update when selected_city or selected_address changes in localStorage (e.g., after user selects a city)
  useEffect(() => {
    setSelectedCity(localStorage.getItem('selected_city'));
    const raw = localStorage.getItem('selected_address');
    try {
      setSelectedAddress(raw ? JSON.parse(raw) : null);
    } catch {
      setSelectedAddress(null);
    }
  }, [localStorage.getItem('selected_city'), localStorage.getItem('selected_address')]);

  // Always use Bangalore as default if no city/address
  const BANGALORE_COORDS = { latitude: 12.9716, longitude: 77.5946 };

  const [isWishlisted, setIsWishlisted] = useState(isInWishlist);

  // Sync isWishlisted with localStorage/backend on mount and when experience.id changes
  useEffect(() => {
    if (!user) {
      // Guest: check localStorage
      const wishlist = localStorage.getItem('wishlist');
      let wishlistArr = wishlist ? JSON.parse(wishlist) : [];
      setIsWishlisted(wishlistArr.includes(experience.id));
    } else {
      // Logged in: fetch from backend (or use isInWishlist prop if up-to-date)
      setIsWishlisted(!!isInWishlist);
    }
  }, [user, experience.id, isInWishlist]);

  // Listen for wishlistUpdated event to re-fetch isWishlisted state
  useEffect(() => {
    const handler = () => {
      if (!user) {
        const wishlist = localStorage.getItem('wishlist');
        let wishlistArr = wishlist ? JSON.parse(wishlist) : [];
        setIsWishlisted(wishlistArr.includes(experience.id));
      } else {
        setIsWishlisted(!!isInWishlist);
      }
    };
    window.addEventListener('wishlistUpdated', handler);
    return () => window.removeEventListener('wishlistUpdated', handler);
  }, [user, experience.id, isInWishlist]);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error('Please log in to save to your wishlist');
      return;
    }
    await toggleWishlist(experience.id, isWishlisted, { [experience.id]: experience }, () => {
      setIsWishlisted((prev) => !prev);
      onWishlistChange?.(experience.id, !isWishlisted);
      window.dispatchEvent(new Event('wishlistUpdated'));
    });
  };

  // Determine if this card is in the first row (3 columns)
  const isFirstRow = (index ?? 0) < 3;

  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState(experience.imageUrl || '/placeholder.svg');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Debug log for image source and type
  console.log('ExperienceCard image:', { imgSrc, type: typeof imgSrc, experience, imageUrl: experience.imageUrl });

  const navigate = useNavigate();

  useEffect(() => {
    setDistance(null);
    setTravelTime(null);
    let fromLat: number | null = null;
    let fromLng: number | null = null;
    let showProximity = true;
    if (selectedAddress && selectedAddress.lat && selectedAddress.lon) {
      fromLat = parseFloat(selectedAddress.lat);
      fromLng = parseFloat(selectedAddress.lon);
    } else if (selectedCity && CITY_COORDINATES[selectedCity]) {
      fromLat = CITY_COORDINATES[selectedCity].latitude;
      fromLng = CITY_COORDINATES[selectedCity].longitude;
    } else {
      showProximity = false;
    }
    if (
      showProximity &&
      typeof experience.latitude === 'number' && typeof experience.longitude === 'number' &&
      fromLat !== null && fromLng !== null &&
      !isNaN(experience.latitude) && !isNaN(experience.longitude) &&
      !isNaN(fromLat) && !isNaN(fromLng)
    ) {
      const dist = calculateHaversineDistance(
        fromLat,
        fromLng,
        experience.latitude,
        experience.longitude
      );
      setDistance(`${dist.toFixed(1)} km`);
      let minutes;
      if (dist === 0) {
        minutes = 0;
      } else {
        minutes = Math.max(1, Math.round((dist / 30) * 60));
      }
      if (minutes >= 60) {
        const hr = Math.floor(minutes / 60);
        const min = minutes % 60;
        setTravelTime(min > 0 ? `${hr} hr ${min} min` : `${hr} hr`);
      } else {
        setTravelTime(`${minutes} min`);
      }
    }
  }, [experience.latitude, experience.longitude, experience.id, selectedCity, selectedAddress]);

  // If the experience image changes, reset the imgSrc
  useEffect(() => {
    setImgSrc(experience.imageUrl || '/placeholder.svg');
  }, [experience.imageUrl]);

  return (
    <>
      <div
        className="bg-white rounded-2xl shadow hover:shadow-xl transition-shadow duration-200 group relative mb-10 overflow-hidden cursor-pointer"
        onClick={e => {
          // Prevent navigation if clicking on a button or link inside the card
          const tag = (e.target as HTMLElement).tagName.toLowerCase();
          if (['button', 'a', 'svg', 'path'].includes(tag)) return;
          navigate(`/experience/${experience.id}`);
        }}
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate(`/experience/${experience.id}`);
          }
        }}
        role="button"
        aria-label={`View details for ${experience.title}`}
      >
        {/* Image section */}
        <div className="aspect-[3/2] w-full overflow-hidden rounded-t-2xl relative">
          <img
            src={getValidImgSrc(imgSrc)}
            alt={experience.title}
            className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${imgError ? 'border-4 border-red-500' : ''}`}
            onError={e => {
              e.currentTarget.onerror = null;
              setImgSrc('/placeholder.svg');
              setImgError(true);
            }}
            onLoad={() => setImgError(false)}
          />
          {/* Wishlist icon, only visible on hover */}
          <button
            className="absolute top-4 right-4 z-10 bg-white/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleToggleWishlist}
            disabled={isProcessing}
          >
            {isWishlisted ? (
              <HeartIcon className="h-5 w-5 text-red-500 fill-red-500 transition" />
            ) : (
              <Heart className="h-5 w-5 text-gray-300 group-hover:text-red-500 transition" />
            )}
          </button>
        </div>
        {/* Info section */}
        <div className="p-4 w-full max-w-full">
          {/* Proximity info: time and distance */}
          {(travelTime || distance) && (
            <div className="flex items-center gap-2 text-sm md:text-base text-gray-700 font-semibold mb-2 bg-white/80 px-3 py-1 rounded-lg shadow-sm w-full max-w-full truncate">
              {travelTime && <><Clock className="h-4 w-4 mr-1 text-primary" />{travelTime}</>}
              {travelTime && distance && <span className="mx-1">|</span>}
              {distance && <><MapPin className="h-4 w-4 mr-1 text-primary" />{distance}</>}
            </div>
          )}
          {/* Name and price row */}
          <div className="flex justify-between items-center mb-1">
            <h3 className="font-semibold text-lg truncate flex items-center" title={experience.title}>
              {experience.title}
            </h3>
            <span className="font-bold text-primary text-base ml-2 whitespace-nowrap">₹{experience.price}</span>
          </div>
          {/* Address and Show Map row */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-1 truncate">
            <div className="flex items-center truncate">
              <MapPin className="inline-block h-4 w-4 mr-1 text-gray-400" />
              <span className="truncate" title={experience.location}>{experience.location}</span>
            </div>
            <button
              className="text-primary underline text-xs ml-2"
              type="button"
              onClick={() => setIsMapOpen(true)}
              tabIndex={0}
            >
              Show Map
            </button>
          </div>
          <Dialog open={isMapOpen} onOpenChange={setIsMapOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Location Map</DialogTitle>
              </DialogHeader>
              <ExperienceMap locationName={experience.location} />
            </DialogContent>
          </Dialog>
          {/* Minimal View Experience button */}
          {openInNewTab ? (
            <a
              href={`/experience/${experience.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'block', width: '100%' }}
            >
              <Button size="sm" variant="outline" className="w-full mt-3 font-medium">
                View Experience
              </Button>
            </a>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-3 font-medium"
              onClick={() => navigate(`/experience/${experience.id}`)}
            >
              View Experience
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default ExperienceCard;