import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';

import TrendingSection from '@/components/TrendingSection';

import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { getFeaturedExperiences, getAllExperiences } from '@/lib/data';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data/types';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import SuggestedExperiences from '@/components/SuggestedExperiences';

const Index = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [isAllLoading, setIsAllLoading] = useState(true);

  // Load featured experiences from Supabase
  useEffect(() => {
    const loadFeaturedExperiences = async () => {
      setIsLoading(true);
      try {
        const experiences = await getFeaturedExperiences();
        setFeaturedExperiences(experiences);
      } catch (error) {
        console.error('Error loading featured experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedExperiences();
  }, []);

  // Load all experiences from Supabase
  useEffect(() => {
    const loadAllExperiences = async () => {
      setIsAllLoading(true);
      try {
        const experiences = await getAllExperiences();
        setAllExperiences(experiences);
      } catch (error) {
        console.error('Error loading all experiences:', error);
      } finally {
        setIsAllLoading(false);
      }
    };

    loadAllExperiences();
  }, []);

  // Smooth scroll for anchor links
  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.hash && link.href.includes(window.location.pathname)) {
        e.preventDefault();
        const targetElement = document.querySelector(link.hash);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    };
    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Hero />
        {/* Featured Experiences */}
        <section id="experiences" className="py-20 md:py-28">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 animate-fade-in">
                Featured Experiences
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                Discover our handpicked selection of extraordinary experiences
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : featuredExperiences.length > 0 ? (
              <div className="relative px-8 md:px-12">
                <Carousel opts={{ 
                  align: 'center', 
                  slidesToScroll: 1,
                  containScroll: 'trimSnaps'
                }}>
                  <CarouselContent>
                    {featuredExperiences.map((experience) => (
                      <CarouselItem key={experience.id} className="basis-full sm:basis-1/2 md:basis-1/3 pl-2 md:pl-4">
                        <div className="w-full h-auto min-h-[200px] md:min-h-[256px]">
                          <ExperienceCard experience={experience} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-black hover:bg-black/90 text-white -left-4 md:-left-8" />
                  <CarouselNext className="bg-black hover:bg-black/90 text-white -right-4 md:-right-8" />
                </Carousel>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No featured experiences available at the moment.</p>
              </div>
            )}
          </div>
        </section>
        
       
        
        {/* Trending Section */}
        <TrendingSection />
        
     
        
        {/* Newsletter Section */}
        <Newsletter />
      </main>
    </div>
  );
};

export default Index;
