import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrendingSection from '@/components/TrendingSection';
import Newsletter from '@/components/Newsletter';
import LocationScrollMenu from '@/components/LocationScrollMenu';
import { getFeaturedExperiences, getAllExperiences } from '@/lib/data';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { MapPin, Search } from 'lucide-react';
import SuggestedExperiences from '@/components/SuggestedExperiences';

const Index = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [suggestedCity, setSuggestedCity] = useState<string>('');
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [isAllExpLoading, setIsAllExpLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<{ address?: string, lat?: string, lon?: string } | string | null>(null);

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

  useEffect(() => {
    const loadAllExperiences = async () => {
      setIsAllExpLoading(true);
      try {
        const experiences = await getAllExperiences();
        setAllExperiences(experiences);
      } catch (error) {
        console.error('Error loading all experiences:', error);
      } finally {
        setIsAllExpLoading(false);
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
    if (parsed && typeof parsed === 'object' && parsed.address) {
      setSuggestedCity(parsed.address);
    } else if (typeof parsed === 'string') {
      setSuggestedCity(parsed);
    } else {
      setSuggestedCity('');
    }
  }, [allExperiences]);

  let filteredExperiences: Experience[] = allExperiences;
  if (
    selectedAddress &&
    typeof selectedAddress === 'object' &&
    selectedAddress.lat &&
    selectedAddress.lon
  ) {
    const lat = parseFloat(selectedAddress.lat);
    const lon = parseFloat(selectedAddress.lon);
    filteredExperiences = allExperiences
      .map(exp => {
        if (typeof exp.latitude === 'number' && typeof exp.longitude === 'number') {
          const distance = Math.sqrt(
            Math.pow(lat - exp.latitude, 2) + Math.pow(lon - exp.longitude, 2)
          );
          return { ...exp, _distance: distance };
        }
        return { ...exp, _distance: Infinity };
      })
      .filter(exp => exp._distance <= 10)
      .sort((a, b) => (a._distance || 0) - (b._distance || 0));
  } else if (selectedAddress && typeof selectedAddress === 'string') {
    filteredExperiences = allExperiences.filter(exp => {
      if (!exp.location) return false;
      const locationLower = exp.location.toLowerCase();
      const cityLower = selectedAddress.toLowerCase();
      return locationLower.includes(cityLower) || locationLower === cityLower;
    });
  }
  const selectedExperiences = filteredExperiences.filter(exp => exp.featured).slice(0, 3);
  const toShow = selectedExperiences.length > 0 ? selectedExperiences : filteredExperiences.slice(0, 3);

  useEffect(() => {
    const handleSmoothScroll = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');
      if (link && link.hash && link.href.includes(window.location.pathname)) {
        e.preventDefault();
        const targetElement = document.querySelector(link.hash);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
    document.addEventListener('click', handleSmoothScroll);
    return () => document.removeEventListener('click', handleSmoothScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Navbar />

      <main>
        <Hero />

        {/* Suggested for You */}
        <section id="suggested" className="py-20 md:py-28">
          <div className="container max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium mb-4 animate-fade-in">
                {suggestedCity ? `Suggested for You in ${suggestedCity}` : 'Suggested for You'}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in">
                {suggestedCity
                  ? `Experiences recommended based on your selection: ${suggestedCity}`
                  : 'Experiences recommended based on your selected city'}
              </p>
            </div>
            {isAllExpLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-4 text-lg">Loading experiences...</span>
              </div>
            ) : (
              <>
                <div className="flex flex-row justify-center gap-6 w-full">
                  {toShow.length > 0 ? (
                    toShow.map((experience) => (
                      <div key={experience.id} className="flex justify-center">
                        <div className="w-[346.66px] h-[240px]">
                          <ExperienceCard experience={experience} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 w-full">
                      <p className="text-muted-foreground">No experiences available for the selected city.</p>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-8">
                  <a href="/experiences">
                    <Button size="lg" className="rounded-full font-medium text-base shadow-sm h-12 px-8">
                      Explore More
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>
        </section>

        <TrendingSection />
        <Newsletter />
      </main>
    </div>
  );
};

export default Index;
