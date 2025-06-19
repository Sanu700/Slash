import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useInView } from '@/lib/animations';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavLink } from '@/components/ui/nav-link';
import { scrollToTop } from '@/lib/animations';
import AnimatedCounter from './AnimatedCounter';
import SuggestedExperiences from './SuggestedExperiences';

const Hero = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({
    threshold: 0.3
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([false, false, false]);
  const imageUrls = ['https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop&h=1200', 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=2670&auto=format&fit=crop&h=1200', 'https://images.unsplash.com/photo-1566849787933-0bab0fafa2a4?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?q=80&w=2670&auto=format&fit=crop&h=1200'];

  // Preload images - improved version with state tracking
  useEffect(() => {
    const preloadImages = async () => {
      const promises = imageUrls.map((url, index) => {
        return new Promise<void>(resolve => {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            setImagesLoaded(prev => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
            resolve();
          };
        });
      });
      await Promise.all(promises);
    };
    preloadImages();
  }, []);

  // Image transition effect with improved timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % imageUrls.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageUrls.length]);

  // Mouse parallax effect
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  const handleMouseMove = (e: React.MouseEvent) => {
    const {
      clientX,
      clientY
    } = e;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const xValue = (clientX - windowWidth / 2) / windowWidth;
    const yValue = (clientY - windowHeight / 2) / windowHeight;
    setMousePosition({
      x: xValue * 15,
      y: yValue * 15
    });
  };
  return <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        {imageUrls.map((url, index) => <div key={index} className={cn("absolute inset-0 transition-opacity duration-1500 bg-cover bg-center", index === currentImage ? "opacity-100" : "opacity-0")} style={{
        backgroundImage: `url(${url})`,
        transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px) scale(1.05)`
      }} />)}
        <div className="absolute inset-0 bg-black/70" /> {/* Darkened overlay for better text readability */}
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-24 right-10 flex space-x-2 z-10">
        {imageUrls.map((_, index) => <button key={index} className={cn("w-2 h-2 rounded-full transition-all", index === currentImage ? "bg-white w-6" : "bg-white/40")} onClick={() => setCurrentImage(index)} />)}
      </div>

      {/* Content */}
      <div className="container max-w-6xl mx-auto px-6 md:px-10 relative z-10 text-white mt-20">
        <div className="max-w-3xl">
          <div className={cn("transition-all duration-1000 transform", isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0")}>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 -ml-[0px]">
              <img src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" alt="Slash logo" className="h-4 w-4" />
              <span className="text-sm font-medium">Curated Experience Gifts</span>
            </div>
            
            <div className="-ml-[2px]">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-shadow max-w-2xl">
                Gifting Something, <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                  That Matters
                </span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl text-shadow">
              92% of all people prefer an Experience over a Material gift and 63% forget what they recieved a year back.
            </p>
            
            <div className="flex flex-col items-start space-y-6">
              <div className="flex items-center space-x-4 -ml-[-0.5px]">
                <SuggestedExperiences />
        </div>
        
              <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto transition-all duration-1000 delay-300", isInView ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0")}>
                {[{
                  value: "500+",
                  label: "Experiences"
                }, {
                  value: "50k+",
                  label: "Happy Recipients"
                }, {
                  value: "4.9",
                  label: "Average Rating"
                }, {
                  value: "100%",
                  label: "Satisfaction"
                }].map((stat, index) => (
                  <div key={index} className="backdrop-blur-sm bg-white/20 rounded-lg p-4 md:p-5 flex flex-col items-center justify-center text-center">
                    <p className="text-2xl md:text-3xl font-medium mb-1">
                      <AnimatedCounter value={stat.value} />
                    </p>
                    <p className="text-sm text-white/90">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 right-10 flex flex-col items-center animate-bounce">
        <div className="w-0.5 h-8 bg-white/30 mb-2" />
        <span className="text-white/70 text-sm">Scroll to explore</span>
      </div>
    </section>;
};
export default Hero;
