
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { experiences } from '@/lib/data';
import { useInView } from '@/lib/animations';
import ExperienceCard from './ExperienceCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const TrendingSection = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  
  // Only show 3 trending experiences for better performance and formatting
  const trendingExperiences = experiences
    .filter(exp => exp.trending)
    .sort((a, b) => b.price - a.price) // Sort by price descending for variety
    .slice(0, 3); // Limit to only 3 experiences
  
  return (
    <section 
      id="trending"
      ref={ref} 
      className="py-20 md:py-28 bg-secondary/50"
    >
      <div className="container max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <h2 
              className={cn(
                "text-3xl md:text-4xl font-medium mb-4 transition-all duration-700",
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}
            >
              Trending Experiences
            </h2>
            <p 
              className={cn(
                "text-lg text-muted-foreground max-w-2xl transition-all duration-700 delay-100",
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}
            >
              Our most popular experiences, loved by gift-givers and recipients alike
            </p>
          </div>
          
          <Link to="/experiences">
            <Button 
              variant="ghost" 
              className={cn(
                "group mt-4 md:mt-0 self-start transition-all duration-700 delay-200",
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}
            >
              <span>View all experiences</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div 
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-8",
            isInView ? "animate-fade-in" : "opacity-0"
          )}
        >
          {trendingExperiences.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
