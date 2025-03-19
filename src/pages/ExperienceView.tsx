
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getExperienceById } from '@/lib/data';
import { Experience } from '@/lib/data/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users, Calendar, Heart, ArrowLeft, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import { formatRupees } from '@/lib/formatters';
import { useCart } from '@/contexts/CartContext';

const ExperienceView = () => {
  const { id } = useParams();
  const [experience, setExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Load the experience from Supabase
    const loadExperience = async () => {
      setIsLoading(true);
      try {
        if (id) {
          const experienceData = await getExperienceById(id);
          setExperience(experienceData);
        }
      } catch (error) {
        console.error('Error loading experience:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExperience();
  }, [id]);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Experience removed from your favorites" : "Experience added to your favorites",
      duration: 3000,
    });
  };
  
  const shareExperience = () => {
    if (navigator.share) {
      navigator.share({
        title: experience?.title || 'Slash Experience',
        text: experience?.description || 'Check out this amazing experience!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "Share this experience with your friends!",
        duration: 3000,
      });
    }
  };

  const handleAddToCart = () => {
    if (experience) {
      addToCart(experience.id);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!experience) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-medium mb-4">Experience not found</h2>
        <p className="text-muted-foreground mb-8">The experience you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 md:pt-24">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img 
            src={experience.imageUrl} 
            alt={experience.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <Link to="/" className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
            
            <div className="flex space-x-2">
              <button 
                onClick={shareExperience}
                className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <Share2 className="h-5 w-5 text-white" />
              </button>
              
              <button 
                onClick={toggleFavorite}
                className={cn(
                  "p-2 rounded-full backdrop-blur-sm transition-all",
                  isFavorite 
                    ? "bg-white text-red-500" 
                    : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                <Heart className={cn("h-5 w-5", isFavorite && "fill-red-500")} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="container max-w-4xl mx-auto px-6 md:px-10 py-12">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="md:w-7/12">
              <h1 className="text-3xl md:text-4xl font-medium mb-4">{experience.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{experience.location}</span>
                </div>
                <div className="text-xl font-medium">{formatRupees(experience.price)}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{experience.duration}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{experience.participants}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{experience.date}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">Description</h3>
                <p className="text-muted-foreground">{experience.description}</p>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-3">What's Included</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Professional guide and equipment</li>
                  <li>Safety briefing and instructions</li>
                  <li>Commemorative photos of your experience</li>
                  <li>Convenient booking with flexible scheduling</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Additional Information</h3>
                <p className="text-muted-foreground mb-4">
                  All experiences are fully customizable. Contact us for special requests or 
                  to accommodate specific needs.
                </p>
              </div>
            </div>
            
            <div className="md:w-5/12 bg-secondary/20 rounded-xl p-6">
              <h3 className="text-xl font-medium mb-4">Gift This Experience</h3>
              
              <div className="bg-white rounded-lg p-4 mb-6">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium">{formatRupees(experience.price)}</span>
                </div>
                
                <Button size="lg" className="w-full mb-3" onClick={handleAddToCart}>Add to Cart</Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout and instant digital delivery
                </p>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Flexible Booking</p>
                    <p className="text-muted-foreground">The recipient can choose when to enjoy their experience</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Valid for 12 Months</p>
                    <p className="text-muted-foreground">Gift certificates are valid for one year from purchase</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-1.5 rounded-full text-primary mt-0.5">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">Satisfaction Guaranteed</p>
                    <p className="text-muted-foreground">We offer refunds if the experience doesn't meet expectations</p>
                  </div>
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
