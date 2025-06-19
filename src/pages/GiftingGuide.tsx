import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Gift, CheckCircle, Clock, Heart, Image, CornerRightDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '@/lib/animations';
import ExperienceCard from '@/components/ExperienceCard';
import { getTrendingExperiences, getFeaturedExperiences } from '@/lib/data';

const GiftingGuide = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const navigate = useNavigate();
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get featured experiences from Supabase
  useEffect(() => {
    const loadFeaturedExperiences = async () => {
      try {
        // Fetch experiences that are trending or high-priced
        const experiences = await getTrendingExperiences();
        setFeaturedExperiences(experiences.slice(0, 3));
      } catch (error) {
        console.error('Error loading featured experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedExperiences();
  }, []);
  
  return (
    <main className="flex-grow ml-2 mr-0.5">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[527.4px] flex items-center justify-center overflow-hidden mt-[72px]">
        <img 
          src="https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=2070"
          alt="Gift Guide Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6">
            The Ultimate Gift Guide
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            Discover the perfect experience gift for every occasion and create memories that last a lifetime
          </p>
          <Link to="/gift-personalizer">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <section ref={ref} id="comparison" className="container max-w-4xl mx-auto px-4 md:px-10 py-8 md:py-24">
        <div className={cn(
          "space-y-16 transition-all duration-700",
          isInView ? "opacity-100" : "opacity-0 translate-y-8"
        )}>
          {/* Intro Section */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Why Gift an Experience?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Research shows that experiences create stronger emotional connections and more lasting happiness than material possessions. Let's explore why.
            </p>
          </div>
          
          {/* Comparison Section */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-secondary/30 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Material Gifts</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Clock className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <span>Quick enjoyment but excitement fades over time</span>
                </li>
                <li className="flex items-start">
                  <Image className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <span>Takes up physical space and can contribute to clutter</span>
                </li>
                <li className="flex items-start">
                  <CornerRightDown className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <span>Value and appreciation often decreases with time</span>
                </li>
                <li className="flex items-start">
                  <Heart className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                  <span>Can be meaningful but often lacks personal touch</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-primary/10 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Experience Gifts</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <span>Creates lasting memories and stories to share</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <span>No physical clutter - only emotional richness</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <span>Appreciation increases over time as memories are cherished</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <span>Deepens relationships through shared moments</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-secondary/20 rounded-2xl p-8 md:p-10">
            <h3 className="text-2xl font-medium mb-6 text-center">The Science Behind Experience Gifts</h3>
            
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">78%</div>
                <p className="text-muted-foreground">of people prefer experiences over material items</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">3x</div>
                <p className="text-muted-foreground">longer lasting happiness from experiential purchases</p>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">85%</div>
                <p className="text-muted-foreground">stronger memory retention for experiences vs. objects</p>
              </div>
            </div>
          </div>
          
          {/* Quote Section */}
          <div className="relative py-8">
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="text-9xl">"</span>
            </div>
            <blockquote className="text-xl md:text-2xl text-center italic relative z-10 max-w-3xl mx-auto">
              "We don't remember days, we remember moments. The richness of life lies in memories we have forgotten."
              <div className="text-base text-muted-foreground mt-4 not-italic">
                — Cesare Pavese
              </div>
            </blockquote>
          </div>
          
          {/* Recommended Experiences */}
          <div>
            <h3 className="text-3xl md:text-4xl font-medium mb-4 text-center">Recommended Experiences</h3>
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-[1134px] h-[288px] backdrop-blur-sm bg-white/20 rounded-lg p-4">
                  <div className="flex gap-6 h-full">
                    {featuredExperiences.map(experience => (
                      <div key={experience.id} className="w-[341.34px] h-[256px]">
                        <ExperienceCard experience={experience} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="text-center mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/gift-personalizer">
                <Button size="lg" className="mr-0 sm:mr-4 w-full sm:w-auto">
                  Find the Perfect Gift
                </Button>
              </Link>
              <Link to="/experiences">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Browse All Experiences
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default GiftingGuide;
