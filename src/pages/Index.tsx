import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrendingSection from '@/components/TrendingSection';
import Newsletter from '@/components/Newsletter';
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

const Index = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allExperiences, setAllExperiences] = useState<Experience[]>([]);
  const [isAllLoading, setIsAllLoading] = useState(true);

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

        {/* Featured Experiences */}
        <section id="experiences" className="py-20 md:py-28">
          <div className="container max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto px-6 md:px-10">
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
              <div className="relative overflow-visible">
                <Carousel opts={{ align: 'center', slidesToScroll: 3 }}>
                  <CarouselContent className="-ml-2">
                    {featuredExperiences.map((experience) => (
                      <CarouselItem
                        key={experience.id}
                        className="basis-full sm:basis-1/2 md:basis-1/3 pl-2"
                      >
                        <div className="w-[346.66px] h-[240px]">
                          <ExperienceCard experience={experience} />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="bg-black hover:bg-black/90 text-white -left-8 lg:-left-12" />
                  <CarouselNext className="bg-black hover:bg-black/90 text-white -right-8 lg:-right-12" />
                </Carousel>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No featured experiences available at the moment.
                </p>
              </div>
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
