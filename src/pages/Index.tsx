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
import { MapPin, Search, ArrowLeft, ArrowRight, Gift, CheckCircle, Clock, Heart, Image, CornerRightDown } from 'lucide-react';
import SuggestedExperiences from '@/components/SuggestedExperiences';
import { CITY_COORDINATES } from '@/components/CitySelector';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from '@/lib/animations';

const Index = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [suggestedCity, setSuggestedCity] = useState<string>('');
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [isAllExpLoading, setIsAllExpLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<{ address?: string, lat?: string, lon?: string } | string | null>(null);
  const [guideInViewRef, guideInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

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
    let city = '';
    if (parsed && typeof parsed === 'object' && parsed.address) {
      const parts = parsed.address.split(',').map(s => s.trim());
      const knownCities = Object.keys(CITY_COORDINATES);
      const indianStates = [
        'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Delhi','Jammu and Kashmir','Ladakh','Puducherry','Chandigarh','Andaman and Nicobar Islands','Dadra and Nagar Haveli and Daman and Diu','Lakshadweep'];
      // 1. Try to find a known city from right to left
      for (let i = parts.length - 1; i >= 0; i--) {
        if (knownCities.some(c => c.toLowerCase() === parts[i].toLowerCase())) {
          city = parts[i];
          break;
        }
      }
      // 2. If not found, try from left to right for a part that's not a number, not a state, and at least 3 chars
      if (!city) {
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          if (
            part.length >= 3 &&
            !/\d{3,}/.test(part) &&
            !indianStates.some(state => state.toLowerCase() === part.toLowerCase())
          ) {
            city = part;
            break;
          }
        }
      }
      // 3. Fallback: previous logic
      if (!city) {
        if (parts.length > 1) {
          city = parts[parts.length - 2];
        } else {
          city = parsed.address;
        }
      }
    } else if (typeof parsed === 'string') {
      city = parsed;
    } else {
      city = '';
    }
    setSuggestedCity(city);
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
        <section id="suggested" className="py-20 md:py-28 mt-8 md:mt-16">
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

        {/* Gifting Guide Content (moved from GiftingGuide.tsx) */}
        {/* Anchor for smooth scroll to gifting guide */}
        <span id="gifting-guide" className="block" />
        <section ref={guideInViewRef} id="comparison" className="container max-w-[1152px] mx-auto px-4 md:px-10 py-8 md:py-24">
          <div className={cn(
            "space-y-16 transition-all duration-700",
            guideInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            {/* Intro Section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-medium mb-6">Why Gift an Experience?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Research shows that experiences create stronger emotional connections and more lasting happiness than material possessions. Let's explore why.
              </p>
            </div>
            {/* Comparison Section */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="bg-secondary/30 p-8 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Gift className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Material Gifts</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <span>Quick enjoyment but excitement fades over time</span>
                  </li>
                  <li className="flex items-start">
                    <Image className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <span>Takes up physical space and can contribute to clutter</span>
                  </li>
                  <li className="flex items-start">
                    <CornerRightDown className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <span>Value and appreciation often decreases with time</span>
                  </li>
                  <li className="flex items-start">
                    <Heart className="h-5 w-5 mr-3 mt-0.5 text-muted-foreground" />
                    <span>Can be meaningful but often lacks personal touch</span>
                  </li>
                </ul>
              </div>
              <div className="bg-primary/10 p-8 rounded-2xl">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-medium mb-4">Experience Gifts</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <span>Creates lasting memories and stories to share</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <span>No physical clutter - only emotional richness</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <span>Appreciation increases over time as memories are cherished</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <span>Deepens relationships through shared moments</span>
                  </li>
                </ul>
              </div>
            </div>
            {/* Stats Section */}
            <div className="bg-secondary/20 rounded-2xl p-8 md:p-10">
              <h3 className="text-2xl font-medium mb-6 text-center">The Science Behind Experience Gifts</h3>
              <div className="grid sm:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">78%</div>
                  <p className="text-muted-foreground">of people prefer experiences over material items</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">3x</div>
                  <p className="text-muted-foreground">longer lasting happiness from experiential purchases</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">85%</div>
                  <p className="text-muted-foreground">stronger memory retention for experiences vs. objects</p>
                </div>
              </div>
            </div>
            {/* Quote Section */}
            <div className="relative py-8">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <span className="text-9xl">"</span>
              </div>
              <blockquote className="text-xl md:text-2xl text-center italic relative z-10 max-w-3xl mx-auto">
                "We don't remember days, we remember moments. The richness of life lies in memories we have forgotten."
                <div className="text-base text-muted-foreground mt-4 not-italic">
                  — Cesare Pavese
                </div>
              </blockquote>
            </div>
          </div>
        </section>

        <TrendingSection />
        <Newsletter />
      </main>
    </div>
  );
};

export default Index;
