import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getExperienceById, getSimilarExperiences } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { formatRupees } from '@/lib/formatters';
import { MapPin, Clock, Users, Calendar, ArrowLeft, Heart, ShoppingCart, Bookmark, Plus, Minus } from 'lucide-react';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import useTrackExperienceView from '@/hooks/useTrackExperienceView';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

const ExperienceView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem: addToCart, items, updateQuantity } = useCart();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(true);
  const [similarExperiences, setSimilarExperiences] = useState<Experience[]>([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user } = useAuth();
  const [quantityInCart, setQuantityInCart] = useState(0);
  
  // Track experience view in database when logged in
  useTrackExperienceView(id || '');
  
  // Get current quantity in cart
  useEffect(() => {
    if (id) {
      const cartItem = items.find(item => item.experienceId === id);
      setQuantityInCart(cartItem ? cartItem.quantity : 0);
    }
  }, [id, items]);
  
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
  
  // Check if the experience is in the user's wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !id) {
        setIsInWishlist(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('id')
          .eq('user_id', user.id)
          .eq('experience_id', id)
          .single();
          
        setIsInWishlist(!!data);
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    };
    
    checkWishlist();
  }, [id, user]);
  
  const handleAddToCart = () => {
    if (experience) {
      addToCart(experience.id);
    }
  };

  const handleDecreaseQuantity = () => {
    if (experience && quantityInCart > 0) {
      updateQuantity(experience.id, quantityInCart - 1);
    }
  };

  const handleIncreaseQuantity = () => {
    if (experience) {
      updateQuantity(experience.id, quantityInCart + 1);
    }
  };
  
  const toggleWishlist = async () => {
    if (!user) {
      toast.error('Please log in to save to your wishlist');
      return;
    }
    
    if (!experience) return;
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('experience_id', experience.id);
          
        if (error) throw error;
        
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            experience_id: experience.id
          });
          
        if (error) throw error;
        
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };
  
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!experience) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-24">
        {/* Hero Image Section */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img 
            src={experience.imageUrl} 
            alt={experience.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
        
        {/* Main Content Section */}
        <div className="container max-w-6xl mx-auto px-6 md:px-10 py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left Column: Experience Details */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex justify-between items-start">
                  <h1 className="text-3xl md:text-4xl font-semibold mb-2">
                    {experience.title}
                  </h1>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={toggleWishlist}
                  >
                    <Heart 
                      className={`h-6 w-6 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                    />
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-3 text-muted-foreground mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {experience.location}
                  </div>
                  <span className="text-xs">•</span>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {experience.duration}
                  </div>
                  <span className="text-xs">•</span>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {experience.participants}
                  </div>
                  <span className="text-xs">•</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {experience.date}
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-medium mb-4">About this experience</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {experience.description}
                </p>
              </div>
              
              {/* What to expect section */}
              <div>
                <h2 className="text-xl font-medium mb-4">What to expect</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-primary text-sm font-medium">1</span>
                    </div>
                    <p>Professional guides will handle all logistics and safety briefings.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-primary text-sm font-medium">2</span>
                    </div>
                    <p>All necessary equipment and transportation included.</p>
                  </li>
                  <li className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-primary text-sm font-medium">3</span>
                    </div>
                    <p>Digital photo memories captured throughout your experience.</p>
                  </li>
                </ul>
              </div>
              
              {/* Similar experiences section */}
              {similarExperiences.length > 0 && (
                <div className="pt-4">
                  <h2 className="text-xl font-medium mb-6">You might also like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {similarExperiences.map(exp => (
                      <ExperienceCard 
                        key={exp.id} 
                        experience={exp} 
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right Column: Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg shadow-sm p-6 sticky top-28">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-sm text-muted-foreground">From</span>
                    <div className="text-3xl font-semibold">
                      {formatRupees(experience.price)}
                    </div>
                    <span className="text-sm text-muted-foreground">per person</span>
                  </div>
                  
                  {experience.trending && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                      Trending
                    </span>
                  )}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{experience.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Users className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Group Size</p>
                      <p className="text-sm text-muted-foreground">{experience.participants}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Availability</p>
                      <p className="text-sm text-muted-foreground">{experience.date}</p>
                    </div>
                  </div>
                </div>

                {quantityInCart > 0 ? (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">In Your Cart</span>
                      <span className="text-primary font-medium">{quantityInCart} {quantityInCart === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={handleDecreaseQuantity}
                        className="px-2 py-1 h-10"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="flex-1 text-center">{quantityInCart}</span>
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={handleIncreaseQuantity}
                        className="px-2 py-1 h-10"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button 
                      className="w-full mt-3"
                      onClick={() => navigate('/cart')}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      View Cart
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full mb-3"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={toggleWishlist}
                >
                  {isInWishlist ? (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Saved to Wishlist
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Save to Wishlist
                    </>
                  )}
                </Button>
                
                <div className="mt-6 text-center text-xs text-muted-foreground">
                  <p>Free cancellation up to 48 hours before the experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExperienceView;
