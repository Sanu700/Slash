import React from 'react';
import { Button } from '@/components/ui/button';
import { NavLink } from 'react-router-dom';
import { scrollToTop } from '@/lib/animations';

const SuggestedExperiences = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 mb-6">
        <NavLink to="/experiences" onClick={scrollToTop} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="bg-white text-black rounded-full font-medium text-base shadow-sm hover:bg-white/90 w-full sm:w-[245.13px] h-12"
          >
            Explore Experiences &rarr;
          </Button>
        </NavLink>
        <NavLink to="/gifting-guide" onClick={scrollToTop} className="w-full sm:w-auto">
          <Button
            size="lg"
            className="bg-white text-black rounded-full font-medium text-base shadow-sm hover:bg-white/90 w-full sm:w-[245.13px] h-12"
          >
            Gift Inspiration
          </Button>
        </NavLink>
      </div>
    </div>
  );
};

export default SuggestedExperiences;
