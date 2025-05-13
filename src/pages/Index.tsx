import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CategorySection from '@/components/CategorySection';
import TrendingSection from '@/components/TrendingSection';
import CustomizeSection from '@/components/CustomizeSection';
import Newsletter from '@/components/Newsletter';
import Footer from '@/components/Footer';
import { getFeaturedExperiences } from '@/lib/data';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data/types';
import { cn } from '@/lib/utils';

const Index = () => {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredExperiences.map((experience, index) => (
                  <div key={experience.id} className="">
                    <ExperienceCard experience={experience} featured={index === 0} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No featured experiences available at the moment.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Categories Section */}
        <CategorySection />
        
        {/* Trending Section */}
        <TrendingSection />
        
        {/* Customize Section */}
        <CustomizeSection />
        
        {/* Newsletter Section */}
        <Newsletter />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
