import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const ExperienceView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!experience) {
    return null;
  }
  
  return (
    <>
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
          {/* Left Column - Experience Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-medium mb-4">{experience.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {experience.location}
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
            
            <div className="prose prose-lg max-w-none mb-8">
              <p>{experience.description}</p>
            </div>
            
            {/* Experience Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Duration</h3>
                  <p className="text-muted-foreground text-sm">{experience.duration}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Group Size</h3>
                  <p className="text-muted-foreground text-sm">{experience.participants}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Date</h3>
                  <p className="text-muted-foreground text-sm">{experience.date}</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-primary/10 p-2 rounded-lg mr-4">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Location</h3>
                  <p className="text-muted-foreground text-sm">{experience.location}</p>
                </div>
              </div>
            </div>
            
            {/* Similar Experiences */}
            {similarExperiences.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-medium mb-6">Similar Experiences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {similarExperiences.map((exp) => (
                    <ExperienceCard key={exp.id} experience={exp} />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Price per person</p>
                  <p className="text-2xl font-medium">{formatRupees(experience.price)}</p>
                </div>
                <button
                  onClick={toggleWishlist}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    isInWishlist ? "text-red-500" : "text-muted-foreground hover:text-red-500"
                  )}
                >
                  <Heart className="h-6 w-6" fill={isInWishlist ? "currentColor" : "none"} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Select Date</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Choose Date
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Number of People</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleDecreaseQuantity}
                      className="p-1 rounded-full hover:bg-secondary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{quantityInCart}</span>
                    <button
                      onClick={handleIncreaseQuantity}
                      className="p-1 rounded-full hover:bg-secondary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={quantityInCart === 0}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
              
              <div className="mt-4 text-center">
                <Button variant="outline" className="w-full">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperienceView;
