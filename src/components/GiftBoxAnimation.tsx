
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useScrollProgress } from '@/lib/animations';
import { Gift } from 'lucide-react';

const GiftBoxAnimation: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress();
  
  useEffect(() => {
    // We'll use scroll progress to trigger animations when user scrolls into view
    const threshold = 0.05; // Start animation after scrolling 5%
    const maxProgress = 0.3; // Animation completes at 30% scroll
    
    const normalizedProgress = Math.min(
      1, 
      Math.max(0, (progress - threshold) / (maxProgress - threshold))
    );
    
    setScrollProgress(normalizedProgress);
  }, [progress]);
  
  const lidTransform = `translateY(${-100 * scrollProgress}px) rotateX(${90 * scrollProgress}deg)`;
  const particleOpacity = scrollProgress > 0.7 ? 1 : 0;
  const particleScale = scrollProgress > 0.7 ? 1 : 0;
  const contentTransform = `translateY(${-50 * scrollProgress}px) scale(${0.8 + (0.3 * scrollProgress)})`;

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10" ref={boxRef}>
      <div 
        className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 perspective"
        style={{opacity: progress < 0.8 ? 1 : 1 - ((progress - 0.8) * 5)}}
      >
        {/* Base/Bottom of the box */}
        <div className="absolute w-full h-full bg-gradient-to-br from-[#D946EF] to-[#8B5CF6] rounded-lg shadow-xl transform-gpu preserve-3d flex items-center justify-center">
          <div 
            className="w-full h-full flex items-center justify-center transform-gpu transition-transform"
            style={{transform: contentTransform}}
          >
            <Gift className="w-16 h-16 md:w-24 md:h-24 text-white animate-pulse" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Lid of the gift box */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-[#9b87f5] to-[#7E69AB] rounded-lg shadow-xl transform-gpu origin-top preserve-3d"
          style={{
            transform: lidTransform,
            transformOrigin: 'center top'
          }}
        >
          {/* Ribbon on top */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-6 bg-[#F97316] z-10"></div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-full bg-[#F97316] z-10"></div>
        </div>
        
        {/* Particles/confetti that appear when box opens */}
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className={cn(
              "absolute w-3 h-3 rounded-full transition-all duration-1000",
              i % 3 === 0 ? "bg-[#D946EF]" : 
              i % 3 === 1 ? "bg-[#F97316]" : "bg-[#0EA5E9]"
            )}
            style={{
              top: '50%',
              left: '50%',
              opacity: particleOpacity,
              transform: `translate(${(i - 10) * 15}px, ${(i % 5 - 10) * 15}px) scale(${particleScale})`,
              transitionDelay: `${i * 50}ms`
            }}
          />
        ))}
      </div>
      
      {/* Message that appears when box is opened */}
      <div 
        className="absolute top-full mt-12 left-1/2 transform -translate-x-1/2 text-center whitespace-nowrap"
        style={{
          opacity: scrollProgress,
          transform: `translateY(${20 - scrollProgress * 20}px)`
        }}
      >
        <p className="text-xl md:text-2xl font-medium text-primary bg-background/80 px-4 py-2 rounded-full backdrop-blur-sm">
          Discover Extraordinary Experiences
        </p>
      </div>
    </div>
  );
};

export default GiftBoxAnimation;
