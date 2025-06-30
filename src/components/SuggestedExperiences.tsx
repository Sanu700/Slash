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
import { NavLink, useLocation } from 'react-router-dom';
import { scrollToTop } from '@/lib/animations';
import { calculateHaversineDistance } from '@/lib/distanceUtils';

const SuggestedExperiences = () => {
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [isAllLoading, setIsAllLoading] = useState(true);
  const [showCarousel, setShowCarousel] = useState(false);

  const routerLocation = useLocation();
  const [selectedAddress, setSelectedAddress] = useState<{ address?: string, lat?: string, lon?: string } | string | null>(null);

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

  useEffect(() => {
    // Get selected address from localStorage
    const selectedAddressRaw = localStorage.getItem('selected_address');
    let parsed = null;
    try {
      parsed = selectedAddressRaw ? JSON.parse(selectedAddressRaw) : selectedAddressRaw;
    } catch {
      parsed = selectedAddressRaw;
    }
    setSelectedAddress(parsed);
    // Do NOT auto-show carousel here
  }, [routerLocation, allExperiences]);

  const handleButtonClick = () => {
    setShowCarousel(!showCarousel);
    if (!showCarousel) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  let filteredExperiences: Experience[] = allExperiences;

  if (
    selectedAddress &&
    typeof selectedAddress === 'object' &&
    selectedAddress.lat &&
    selectedAddress.lon
  ) {
    // Filter and sort by proximity (within 10km, sorted by distance)
    const lat = parseFloat(selectedAddress.lat);
    const lon = parseFloat(selectedAddress.lon);
    
    filteredExperiences = allExperiences
      .map(exp => {
        if (typeof exp.latitude === 'number' && typeof exp.longitude === 'number') {
          const distance = calculateHaversineDistance(lat, lon, exp.latitude, exp.longitude);
          return { ...exp, _distance: distance };
        }
        return { ...exp, _distance: Infinity };
      })
      .filter(exp => exp._distance <= 10)
      .sort((a, b) => (a._distance || 0) - (b._distance || 0));
  } else if (selectedAddress && typeof selectedAddress === 'string') {
    // Filter by city name
    filteredExperiences = allExperiences.filter(exp => {
      if (!exp.location) return false;
      const locationLower = exp.location.toLowerCase();
      const cityLower = selectedAddress.toLowerCase();
      return locationLower.includes(cityLower) || locationLower === cityLower;
    });
  }

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
            {/* Location indicator */}
            {selectedAddress && (
              <div className="mb-4 text-center">
                <p className="text-sm text-gray-600">
                  Showing experiences near: <span className="font-semibold text-primary">
                    {typeof selectedAddress === 'object' ? selectedAddress.address : selectedAddress}
                  </span>
                </p>
                {typeof selectedAddress === 'object' && selectedAddress.lat && selectedAddress.lon && (
                  <p className="text-xs text-gray-500 mt-1">
                    Within 10km radius
                  </p>
                )}
              </div>
            )}
            
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
