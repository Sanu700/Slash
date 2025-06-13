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

  return (
    <div className="flex flex-col items-center w-full">
      <NavLink to="/experiences" className="bg-white text-black px-4 sm:px-6 py-2 rounded-full font-medium text-base sm:text-lg mb-4 mx-4 sm:ml-80">
        Suggested Experiences
      </NavLink>
      <div className="flex justify-center w-full">
        <div className="w-full backdrop-blur-sm bg-white/20 rounded-lg p-4 mx-4 sm:ml-80 sm:w-[1152px] h-[300px]">
          {isAllLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : allExperiences.length > 0 ? (
            <div className="relative">
              <Carousel opts={{ align: 'start', slidesToScroll: 1, breakpoints: {
                '(min-width: 640px)': { slidesToScroll: 2 },
                '(min-width: 1024px)': { slidesToScroll: 3 }
              }}}>
                <CarouselContent>
                  {allExperiences.map((experience) => (
                    <CarouselItem key={experience.id} className="basis-full sm:basis-1/2 lg:basis-1/3 px-2 sm:px-6">
                      <div className="w-full h-[256px]">
                        <ExperienceCard experience={experience} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-white/80 hover:bg-white text-black -left-2 sm:-ml-8" />
                <CarouselNext className="bg-white/80 hover:bg-white text-black -right-2 sm:-mr-8" />
              </Carousel>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No experiences available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuggestedExperiences; 