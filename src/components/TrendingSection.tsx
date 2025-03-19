
import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTrendingExperiences } from '@/lib/data';
import { Experience } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/animations';
import ExperienceCard from './ExperienceCard';
import { Link } from 'react-router-dom';

const TrendingSection = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [trendingExperiences, setTrendingExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load trending experiences from Supabase
  useEffect(() => {
    const loadTrendingExperiences = async () => {
      setIsLoading(true);
      try {
        const experiences = await getTrendingExperiences();
        setTrendingExperiences(experiences);
      } catch (error) {
        console.error('Error loading trending experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingExperiences();
  }, []);

  return (
    <section 
      className="bg-secondary/10 py-20"
      ref={ref}
    >
      <div className="container max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className={cn(
            "max-w-xl mb-6 md:mb-0 transition-all duration-700",
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <h2 className="text-3xl md:text-4xl font-medium mb-4">
              Trending Now
            </h2>
            <p className="text-muted-foreground">
              The most popular experience gifts that everyone's talking about
            </p>
          </div>
          
          <Link 
            to="/experiences" 
            className={cn(
              "group inline-flex items-center transition-all duration-700 delay-100",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}
          >
            <Button variant="ghost" className="gap-2">
              View All Experiences
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : trendingExperiences.length > 0 ? (
          <div className={cn(
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children",
            isInView ? "opacity-100" : "opacity-0"
          )}>
            {trendingExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No trending experiences available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingSection;
