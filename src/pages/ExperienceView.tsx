import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExperienceById, getSimilarExperiences } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { formatRupees, getTravelTimeMinutes } from '@/lib/formatters';
import { MapPin, Clock, Users, Calendar, ArrowLeft, Heart, ShoppingCart, Bookmark, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import useTrackExperienceView from '@/hooks/useTrackExperienceView';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { LoginModal } from '@/components/LoginModal';
import { Calendar as DatePicker } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format } from 'date-fns';
import ExperienceMap from '@/components/ExperienceMap';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CITY_COORDINATES } from '../components/CitySelector';

function getValidImgSrc(src: any) {
  if (!src) return '/placeholder.svg';
  if (Array.isArray(src)) {
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

// Accept friends and friendsLikedExperiences as optional props
interface ExperienceViewProps {
  friends?: any[];
  friendsLikedExperiences?: Record<string, any>;
}

const ExperienceView: React.FC<ExperienceViewProps> = ({ friends: propsFriends, friendsLikedExperiences: propsFriendsLikedExperiences }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarExperiences, setSimilarExperiences] = useState<Experience[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user } = useAuth();
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePopoverMain, setShowDatePopoverMain] = useState(false);
  const [showDatePopoverSidebar, setShowDatePopoverSidebar] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [wishlistLocal, setWishlistLocal] = useState<string[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('selected_city') : null));
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isSavedForLater, setIsSavedForLater] = useState(false);
  // --- Friends and their liked experiences logic (copied from Profile) ---
  // Use props if provided, otherwise use local state
  const [friends, setFriends] = useState<any[]>(propsFriends || []);
  const [friendsLikedExperiences, setFriendsLikedExperiences] = useState<Record<string, any>>(propsFriendsLikedExperiences || {});
  
  // Track experience view in database when logged in
  useTrackExperienceView(id || '');
  
  // Sync quantityInCart from localStorage or Supabase on mount and when experience changes
  useEffect(() => {
    if (!experience) return;
    if (!user) {
      // LocalStorage fallback
      let cart = localStorage.getItem('cart');
      let cartArr = cart ? JSON.parse(cart) : [];
      const item = cartArr.find((item: any) => item.experienceId === experience.id);
      setQuantityInCart(item ? item.quantity : 1); // default to 1 if not in cart
    } else {
      const cartItem = items.find(item => item.experienceId === experience.id);
      setQuantityInCart(cartItem ? cartItem.quantity : 1); // default to 1 if not in cart
    }
  }, [experience, user]);
  
  useEffect(() => {
    const fetchExperience = async () => {
      if (!id) return;
      
      try {
        // Get the experience details
        const data = await getExperienceById(id);
        
        if (!data) {
          navigate('/not-found');
          return;
        }
        
        setExperience(data);
        
        // Fetch similar experiences by category
        if (data.category) {
          try {
            const similarExps = await getSimilarExperiences(data.category, id);
            setSimilarExperiences(similarExps);
          } catch (error) {
            console.error('Error loading similar experiences:', error);
          }
        }
      } catch (error) {
        console.error('Error loading experience:', error);
        navigate('/not-found');
      } finally {
        setLoading(false);
      }
    };
    
    fetchExperience();
  }, [id, navigate]);
  
  // Always check latest wishlist state on mount or when user/experience changes
  useEffect(() => {
    if (!experience) return;
    if (!user) {
      // Guest: check localStorage
      const wishlist = localStorage.getItem('wishlist');
      let wishlistArr = wishlist ? JSON.parse(wishlist) : [];
      setIsInWishlist(wishlistArr.includes(experience.id));
    } else {
      // Logged in: fetch from Supabase
      supabase
        .from('wishlists')
        .select('experience_id')
        .eq('user_id', user.id)
        .then(({ data, error }) => {
          if (!error && data) {
            setIsInWishlist(data.some((item) => item.experience_id === experience.id));
          }
        });
    }
  }, [user, experience]);
  
  // Check if the experience is in the user's wishlist or saved for later
  useEffect(() => {
    if (!user && experience) {
      setIsInWishlist(wishlistLocal.includes(experience.id));
      // Check saved for later
      const saved = localStorage.getItem('savedExperiences');
      let savedExperiences = saved ? JSON.parse(saved) : [];
      setIsSavedForLater(!!savedExperiences.find((exp) => exp.id === experience.id));
    } else if (user && experience) {
      // Check saved for later for logged in user (localStorage fallback)
      const saved = localStorage.getItem('savedExperiences');
      let savedExperiences = saved ? JSON.parse(saved) : [];
      setIsSavedForLater(!!savedExperiences.find((exp) => exp.id === experience.id));
    }
  }, [user, experience, wishlistLocal]);
  
  // Debug log to check values at render time
  console.log('RENDER ExperienceView:', experience?.title, experience?.latitude, experience?.longitude, selectedCity);

  useEffect(() => {
    const cityCoords = selectedCity ? CITY_COORDINATES[selectedCity] : null;
    if (experience && experience.latitude && experience.longitude && cityCoords) {
      getTravelTimeMinutes(
        cityCoords.latitude,
        cityCoords.longitude,
        experience.latitude,
        experience.longitude
      ).then(mins => {
        if (mins !== null) setTravelTime(`~${mins} min drive`);
      });
    } else {
      setTravelTime(null);
    }
  }, [experience, selectedCity]);
  
  const isGuest = !user || !user.id || typeof user.id !== 'string' || user.id.length < 10;
  
  const handleAddToCart = async () => {
    if (isGuest) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedDate) {
      setShowDatePopoverMain(true);
      toast.error('Please select a date before adding to cart.');
      return;
    }

    setIsCartLoading(true);
    try {
      // Add to cart with the selected quantity
      await addToCart(experience.id, selectedDate, quantityInCart);
    } catch (e) {
      toast.error('Failed to add to cart');
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleDecreaseQuantity = async () => {
    if (quantityInCart <= 1) return; // Prevent going below 1
    if (isGuest) {
      // LocalStorage fallback ONLY
      if (!experience) return;
      let cart = localStorage.getItem('cart');
      let cartArr = cart ? JSON.parse(cart) : [];
      const idx = cartArr.findIndex((item: any) => item.experienceId === experience.id);
      let newQty = quantityInCart;
      if (idx > -1 && cartArr[idx].quantity > 1) {
        cartArr[idx].quantity -= 1;
        newQty = cartArr[idx].quantity;
        cartArr = [...cartArr]; // force new array reference
        localStorage.setItem('cart', JSON.stringify(cartArr));
        setQuantityInCart(newQty);
        toast.success('Updated quantity');
      }
      return;
    }
    setIsCartLoading(true);
    try {
      await updateQuantity(experience.id, quantityInCart - 1);
      setQuantityInCart(prev => prev - 1);
      toast.success('Updated quantity');
    } catch (e) {
      toast.error('Failed to update quantity');
    } finally {
      setIsCartLoading(false);
    }
  };

  const handleIncreaseQuantity = async () => {
    if (isGuest) {
      // LocalStorage fallback ONLY
      if (!experience) return;
      let cart = localStorage.getItem('cart');
      let cartArr = cart ? JSON.parse(cart) : [];
      const idx = cartArr.findIndex((item: any) => item.experienceId === experience.id);
      let newQty = 1;
      if (idx > -1) {
        cartArr[idx].quantity += 1;
        newQty = cartArr[idx].quantity;
        cartArr = [...cartArr]; // force new array reference
      } else {
        cartArr.push({ 
          experienceId: experience.id, 
          quantity: 1,
          selectedDate: selectedDate?.toISOString()
        });
        newQty = 1;
      }
      localStorage.setItem('cart', JSON.stringify(cartArr));
      setQuantityInCart(newQty);
      toast.success(idx > -1 ? 'Updated quantity' : 'Added to cart');
      return;
    }
    setIsCartLoading(true);
    try {
      await updateQuantity(experience.id, quantityInCart + 1);
      setQuantityInCart(prev => prev + 1);
      toast.success('Updated quantity');
    } catch (e) {
      toast.error('Failed to update quantity');
    } finally {
      setIsCartLoading(false);
    }
  };
  
  const toggleWishlist = async () => {
    if (isGuest) {
      // LocalStorage fallback ONLY
      if (!experience) return;
      let wishlist = localStorage.getItem('wishlist');
      let wishlistArr = wishlist ? JSON.parse(wishlist) : [];
      if (wishlistArr.includes(experience.id)) {
        wishlistArr = wishlistArr.filter((id: string) => id !== experience.id);
        setIsInWishlist(false);
        setWishlistLocal(wishlistArr);
        localStorage.setItem('wishlist', JSON.stringify(wishlistArr));
        toast.success('Removed from wishlist');
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        wishlistArr.push(experience.id);
        setIsInWishlist(true);
        setWishlistLocal(wishlistArr);
        localStorage.setItem('wishlist', JSON.stringify(wishlistArr));
        toast.success('Added to wishlist');
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
      return;
    }
    setIsWishlistLoading(true);
    try {
      if (isInWishlist) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('experience_id', experience.id);
        setIsInWishlist(false); // Always update state immediately
        if (error) throw error;
        toast.success('Removed from wishlist');
        window.dispatchEvent(new Event('wishlistUpdated'));
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            experience_id: experience.id
          });
        setIsInWishlist(true); // Always update state immediately
        if (error) throw error;
        toast.success('Added to wishlist');
        window.dispatchEvent(new Event('wishlistUpdated'));
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };
  
  const handleSaveForLater = () => {
    if (!experience) return;
    if (isGuest) {
      try {
        const saved = localStorage.getItem('savedExperiences');
        let savedExperiences = saved ? JSON.parse(saved) : [];
        const alreadySaved = savedExperiences.find((exp: any) => exp.id === experience.id);
        if (!alreadySaved) {
          savedExperiences.push({ ...experience });
          localStorage.setItem('savedExperiences', JSON.stringify(savedExperiences));
          setIsSavedForLater(true);
          toast.success('Saved for later!');
        } else {
          // Remove from saved
          savedExperiences = savedExperiences.filter((exp: any) => exp.id !== experience.id);
          localStorage.setItem('savedExperiences', JSON.stringify(savedExperiences));
          setIsSavedForLater(false);
          toast.info('Removed from Saved for Later');
        }
      } catch (error) {
        toast.error('Failed to update saved for later');
      }
      return;
    }
    // If logged in, you can add Supabase logic here if needed
    try {
      const saved = localStorage.getItem('savedExperiences');
      let savedExperiences = saved ? JSON.parse(saved) : [];
      const alreadySaved = savedExperiences.find((exp: any) => exp.id === experience.id);
      if (!alreadySaved) {
        savedExperiences.push({ ...experience });
        localStorage.setItem('savedExperiences', JSON.stringify(savedExperiences));
        setIsSavedForLater(true);
        toast.success('Saved for later!');
      } else {
        // Remove from saved
        savedExperiences = savedExperiences.filter((exp: any) => exp.id !== experience.id);
        localStorage.setItem('savedExperiences', JSON.stringify(savedExperiences));
        setIsSavedForLater(false);
        toast.info('Removed from Saved for Later');
      }
    } catch (error) {
      toast.error('Failed to update saved for later');
    }
  };
  
  // Gallery state for multiple images
  const imageUrls = Array.isArray(experience?.imageUrl) ? experience.imageUrl : [experience?.imageUrl].filter(Boolean);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const handlePrevImage = () => setCurrentImageIdx(idx => (idx - 1 + imageUrls.length) % imageUrls.length);
  const handleNextImage = () => setCurrentImageIdx(idx => (idx + 1) % imageUrls.length);
  
  // Add to localStorage for guests
  useEffect(() => {
    if (!user && experience) {
      // Add to viewedExperiences in localStorage
      let viewed = localStorage.getItem('viewedExperiences');
      let arr = viewed ? JSON.parse(viewed) : [];
      // Remove if already present (to re-add at front)
      arr = arr.filter((exp) => exp && exp.id !== experience.id);
      arr.unshift({ ...experience });
      // Limit to 50
      if (arr.length > 50) arr = arr.slice(0, 50);
      localStorage.setItem('viewedExperiences', JSON.stringify(arr));
    }
    // Add to Supabase for logged-in users
    if (user && experience) {
      // Upsert viewed experience in Supabase
      supabase
        .from('viewed_experiences')
        .upsert({
          user_id: user.id,
          experience_id: experience.id,
          viewed_at: new Date().toISOString(),
        }, { onConflict: 'user_id,experience_id' })
        .then(({ error, data }) => {
          if (error) {
            console.error('Error upserting viewed experience:', error);
          } else {
            console.log('Viewed experience upserted:', data);
          }
        });
    }
  }, [user, experience]);
  
  useEffect(() => {
    // For guests, use wishlistLocal
    if (!user) {
      setWishlistIds(wishlistLocal);
      return;
    }
    // For logged-in users, fetch wishlist from Supabase
    const fetchWishlist = async () => {
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('experience_id');
        if (error) throw error;
        setWishlistIds(data ? data.map((item: any) => item.experience_id) : []);
      } catch (err) {
        setWishlistIds([]);
      }
    };
    fetchWishlist();
  }, [user, wishlistLocal]);
  
  // Listen for wishlistUpdated event to re-fetch wishlist state
  useEffect(() => {
    const handler = () => {
      if (!user && experience) {
        setIsInWishlist(wishlistLocal.includes(experience.id));
      } else if (user && experience) {
        // For logged-in users, fetch from Supabase
        supabase
          .from('wishlists')
          .select('experience_id')
          .eq('user_id', user.id)
          .then(({ data, error }) => {
            if (!error && data) {
              setIsInWishlist(data.some((item: any) => item.experience_id === experience.id));
            }
          });
      }
    };
    window.addEventListener('wishlistUpdated', handler);
    return () => window.removeEventListener('wishlistUpdated', handler);
  }, [user, experience, wishlistLocal]);
  
  // Smooth scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);
  
  // Revert to previous friends and friendsLikedExperiences logic (before Profile.tsx copy)
  // Only fetch if not provided by props
  useEffect(() => {
    if (propsFriends) return;
    if (!user?.id) return;
    (async () => {
      const { data } = await supabase
        .from('connections')
        .select('from_user_id, to_user_id')
        .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
        .eq('status', 'accepted');
      if (!data) return setFriends([]);
      const friendIds = data.map(conn =>
        conn.from_user_id === user.id ? conn.to_user_id : conn.from_user_id
      );
      if (friendIds.length === 0) return setFriends([]);
      const { data: profiles } = await supabase
        .from('profiles_with_email')
        .select('id, full_name, avatar_url, username')
        .in('id', friendIds);
      setFriends(profiles || []);
    })();
  }, [user?.id, propsFriends]);

  useEffect(() => {
    if (propsFriendsLikedExperiences) return;
    async function fetchFriendsLikes() {
      if (!friends.length) {
        setFriendsLikedExperiences({});
        return;
      }
      const allLikes = {};
      for (const friend of friends) {
        const { data: wishlist } = await supabase
          .from('wishlists')
          .select('experience_id')
          .eq('user_id', friend.id);
        const expIds = (wishlist || []).map(w => w.experience_id).filter(Boolean);
        allLikes[friend.id] = expIds;
      }
      setFriendsLikedExperiences(allLikes);
    }
    fetchFriendsLikes();
  }, [friends, propsFriendsLikedExperiences]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!experience) {
    return null;
  }
  
  const friendsWhoLiked = friends.filter(friend => {
    const liked = friendsLikedExperiences[friend.id];
    if (Array.isArray(liked) && liked.length > 0) {
      if (typeof liked[0] === 'string') {
        return liked.includes(experience.id);
      } else if (typeof liked[0] === 'object' && liked[0] !== null) {
        return liked.some((exp) => typeof exp === 'object' && exp.id === experience.id);
      }
    }
    return false;
  });
  console.log('[DEBUG] friendsWhoLiked:', friendsWhoLiked, 'for experience', experience?.id, experience?.title); // DEBUG LOG
  
  // Debug logs for troubleshooting
  console.log('[DEBUG][ExperienceView] friends:', friends);
  console.log('[DEBUG][ExperienceView] friendsLikedExperiences:', friendsLikedExperiences);
  console.log('[DEBUG][ExperienceView] experience.id:', experience?.id);
  console.log('[DEBUG][ExperienceView] friendsWhoLiked:', friendsWhoLiked);
  
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

        {/* Hero Image Section */}
        <div className="relative w-full h-48 md:h-[50vh] lg:h-[60vh] z-0 mt-20">
          <img 
            src={getValidImgSrc(imageUrls[currentImageIdx])}
            alt={experience.title}
            className="h-full w-full object-cover rounded-b-2xl"
            style={{ maxHeight: '100%', maxWidth: '100%', borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
          />
          {/* Left Arrow */}
          {imageUrls.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-20"
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {/* Right Arrow */}
          {imageUrls.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 z-20"
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
          <div className="absolute top-6 left-6 z-30">
            <button
              onClick={() => navigate(-1)}
              className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          {/* Thumbnails (future support for multiple images) */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-0 w-full flex justify-center overflow-x-auto gap-2 bg-black/30 rounded-lg px-2 py-2 z-30">
              {imageUrls.map((img, idx) => (
                <img
                  key={img}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-12 h-9 md:w-16 md:h-12 object-cover rounded cursor-pointer border-2 ${currentImageIdx === idx ? 'border-primary' : 'border-transparent'} hover:border-primary flex-shrink-0`}
                  onClick={() => setCurrentImageIdx(idx)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Main Content Section */}
        <div className="container max-w-3xl mx-auto px-4 py-8 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center w-full text-center">
              <h1 className="text-3xl md:text-4xl font-medium mb-4 text-center break-words">{experience.title}</h1>
              <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center items-center">
                <Button
                  onClick={toggleWishlist}
                  className={cn(
                    "p-2 rounded-lg flex items-center gap-2 font-medium border",
                    isInWishlist
                      ? "text-white bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600"
                      : "text-gray-700 bg-gray-100 border-gray-300 hover:text-red-500 hover:border-red-400"
                  )}
                  disabled={isWishlistLoading}
                >
                  <Heart className={cn("h-5 w-5", isInWishlist ? "fill-current" : "", isInWishlist ? "text-white" : "")}
                    fill={isInWishlist ? "currentColor" : "none"} />
                  {isInWishlist ? 'Liked' : 'Like'}
                </Button>
                <Button
                  onClick={handleSaveForLater}
                  className={cn(
                    "p-2 rounded-lg flex items-center gap-2 font-medium border",
                    isSavedForLater
                      ? "text-white bg-black border-black hover:bg-gray-900 hover:border-gray-900"
                      : "text-gray-700 bg-gray-100 border-gray-300 hover:text-primary hover:border-primary"
                  )}
                >
                  <Bookmark className={cn("h-5 w-5", isSavedForLater ? "fill-current" : "", isSavedForLater ? "text-white" : "")}
                    fill={isSavedForLater ? "currentColor" : "none"} />
                  {isSavedForLater ? 'Saved' : 'Save for Later'}
                </Button>
              </div>
              {friendsWhoLiked.length > 0 && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400 font-normal">Liked by</span>
                  {friendsWhoLiked.slice(0, 5).map(friend => (
                    <div key={friend.id} className="flex items-center gap-1">
                      <img
                        src={friend.avatar_url || '/placeholder.svg'}
                        alt={friend.full_name}
                        title={friend.full_name}
                        className="h-5 w-5 rounded-full border border-gray-200 object-cover opacity-80"
                      />
                      <span className="text-xs text-gray-500 font-normal">
                        {friend.username ? `@${friend.username}` : friend.full_name}
                      </span>
                    </div>
                  ))}
                  {friendsWhoLiked.length > 5 && (
                    <span className="text-xs text-gray-400 ml-1">+{friendsWhoLiked.length - 5}</span>
                  )}
                </div>
              )}
              <div className="flex flex-wrap gap-4 mb-6 justify-center items-center text-center">
                <div className="flex items-center gap-2 text-muted-foreground text-base">
                  <MapPin className="h-5 w-5" />
                  <span>{experience.location}</span>
                  <a
                    className="underline text-sm ml-2 text-primary"
                    href={`https://www.google.com/maps/search/?api=1&query=${experience.latitude},${experience.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Show Map
                  </a>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2" />
                  {experience.duration}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Users className="h-4 w-4 mr-2" />
                  {experience.participants}
                </div>
              </div>
              <div className="prose prose-lg max-w-full sm:max-w-none mb-8 mx-auto text-center">
                <p>{experience.description}</p>
              </div>
              {/* Experience Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-primary/10 p-2 rounded-lg mb-2 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                    <h3 className="font-medium mb-1">Duration</h3>
                    <p className="text-muted-foreground text-sm">{experience.duration}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-primary/10 p-2 rounded-lg mb-2 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                    <h3 className="font-medium mb-1">Group Size</h3>
                    <p className="text-muted-foreground text-sm">{experience.participants}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-primary/10 p-2 rounded-lg mb-2 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                    <h3 className="font-medium mb-1">Date</h3>
                    <p className="text-muted-foreground text-sm">{experience.date}</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div className="bg-primary/10 p-2 rounded-lg mb-2 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                    <h3 className="font-medium mb-1">Location</h3>
                    <p className="text-muted-foreground text-sm">{experience.location}</p>
                </div>
              </div>

              {/* Similar Experiences */}
              {similarExperiences.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-medium mb-6">Similar Experiences</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                    {similarExperiences.map((exp, idx) => (
                      <ExperienceCard 
                        key={exp.id} 
                        experience={exp} 
                        index={idx} 
                        isInWishlist={wishlistIds.includes(exp.id)}
                        onWishlistChange={(experienceId, newIsInWishlist) => {
                          setWishlistIds(prev => {
                            if (newIsInWishlist) {
                              return [...prev, experienceId];
                            } else {
                              return prev.filter(id => id !== experienceId);
                            }
                          });
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  );
};

export default ExperienceView;
