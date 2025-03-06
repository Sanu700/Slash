
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/lib/animations';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.3 });
  const [currentImage, setCurrentImage] = useState(0);
  const imageUrls = [
    'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613324138641-1c5ffc8e7e0a?q=80&w=2670&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519708495087-ca1b71df408a?q=80&w=2670&auto=format&fit=crop'
  ];
  
  // Image transition effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % imageUrls.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [imageUrls.length]);

  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const xValue = (clientX - windowWidth / 2) / windowWidth;
    const yValue = (clientY - windowHeight / 2) / windowHeight;
    
    setMousePosition({ x: xValue * 15, y: yValue * 15 });
  };

  return (
    <section 
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {imageUrls.map((url, index) => (
          <div 
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-1500 bg-cover bg-center",
              index === currentImage ? "opacity-100" : "opacity-0"
            )}
            style={{ 
              backgroundImage: `url(${url})`,
              transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px) scale(1.05)`
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-6 md:px-10 relative z-10 text-white">
        <div className="max-w-3xl">
          <div 
            className={cn(
              "transition-all duration-1000 transform",
              isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            )}
          >
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <img 
                src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
                alt="Slash logo" 
                className="h-4 w-4" 
              />
              <span className="text-sm font-medium">Curated Experience Gifts</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium mb-6 leading-tight">
              Gifting Something, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                That Matters
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl">
              92% of all people prefer an Experience over a Material gift and 63% forget what they recieved a year back.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/#experiences">
                <Button 
                  size="lg" 
                  className="group relative overflow-hidden bg-white text-black hover:bg-white/90 text-base transition-all px-8"
                >
                  Explore Experiences
                  <div className="absolute right-4 group-hover:translate-x-1 transition-transform">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 text-base transition-all"
              >
                Gift Inspiration
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div 
          className={cn(
            "mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-4xl transition-all duration-1000 delay-300",
            isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
          )}
        >
          {[
            { value: "500+", label: "Experiences" },
            { value: "50k+", label: "Happy Recipients" },
            { value: "4.9", label: "Average Rating" },
            { value: "100%", label: "Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="backdrop-blur-sm bg-white/10 rounded-lg p-4 md:p-6">
              <p className="text-2xl md:text-3xl font-medium">{stat.value}</p>
              <p className="text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
        <div className="w-0.5 h-8 bg-white/30 mb-2" />
        <span className="text-white/70 text-sm">Scroll to explore</span>
      </div>
    </section>
  );
};

export default Hero;
