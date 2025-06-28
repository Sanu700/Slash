import React, { useEffect, useState } from 'react';
import { getAllExperiences } from '@/lib/data';
import { Experience } from '@/lib/data/types';
import ExperienceCard from '@/components/ExperienceCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '@/lib/animations';

const SuggestedExperiences = () => {
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [isAllLoading, setIsAllLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);

  useEffect(() => {
    const loadAllExperiences = async () => {
      setIsAllLoading(true);
      try {
        const experiences = await getAllExperiences();
        console.log('Loaded experiences:', experiences);
        setAllExperiences(experiences);
      } catch (error) {
        console.error('Error loading all experiences:', error);
      } finally {
        setIsAllLoading(false);
      }
    };
    loadAllExperiences();
  }, []);

  const handleButtonClick = () => {
    setShowCarousel(!showCarousel);
    if (!showCarousel) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  // Get selected city from localStorage
  const selectedCity = typeof window !== 'undefined' ? localStorage.getItem('selected_city') : null;

  // Filter experiences by selected city
  const filteredExperiences = selectedCity
    ? allExperiences.filter(exp => {
        if (!exp.location) return false;
        const locationLower = exp.location.toLowerCase();
        const cityLower = selectedCity.toLowerCase();
        return locationLower.includes(cityLower) || locationLower === cityLower;
      })
    : allExperiences;

  if (isAllLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span className="ml-4 text-lg">Loading experiences...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <Button
          onClick={handleButtonClick}
          className="bg-white text-black rounded-full font-medium text-base shadow-sm hover:bg-white/90 w-full sm:w-[245.13px] h-12"
        >
          Suggested Experiences
        </Button>
        <NavLink to="/gifting-guide" onClick={scrollToTop} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="bg-white text-black rounded-full font-medium text-base shadow-sm hover:bg-white/90 w-full sm:w-[245.13px] h-12"
          >
            Gift Inspiration
          </Button>
        </NavLink>
      </div>

      {showCarousel && (
        <div className="w-full mt-6">
          <div className="w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto backdrop-blur-sm bg-white/20 rounded-lg p-2 lg:p-4">
            {filteredExperiences.length > 0 ? (
              <div className="relative overflow-visible">
                <Carousel opts={{ align: 'center', slidesToScroll: 1 }}>
                  <CarouselContent className="-ml-2">
                    {filteredExperiences.map((experience) => (
                      <CarouselItem
                        key={experience.id}
                        className="basis-full sm:basis-1/2 md:basis-1/3 pl-2"
                      >
                        <div className="w-[346.66px] h-[240px] mx-auto">
                          <ExperienceCard experience={experience} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-white/80 hover:bg-white text-black -left-12 lg:-left-16" />
                  <CarouselNext className="bg-white/80 hover:bg-white text-black -right-12 lg:-right-16" />
                </Carousel>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No experiences available for the selected city.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedExperiences;
