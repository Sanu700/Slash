import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useInView } from '@/lib/animations';

const AboutUs = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [missionRef, missionInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [teamRef, teamInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <>
      {/* Hero Section */}
      <div 
        ref={heroRef}
        className="relative bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-16 md:py-28"
      >
        <div className="container max-w-6xl mx-auto px-4 md:px-10">
          <div className={`transition-all duration-700 delay-100 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Slash Experiences</h1>
            <p className="text-xl max-w-2xl">
              We're on a mission to revolutionize the way people gift experiences, creating memories that last a lifetime.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-6xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden">
              <img 
                 src="/lovable-uploads/beautiful-gift-new-year-christmas_564714-11165.avif" 
                 alt="Beautiful gift for New Year or Christmas" 
                  className="w-full h-full object-cover"
                />
            </div>
            
            <div>
              <h2 className="text-3xl font-medium mb-6">Our Story</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Founded in 2024, Slash Experiences began with a simple idea: what if gifts could create lasting memories instead of collecting dust?
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our founder, after struggling to find meaningful gifts for loved ones, realized that experiences bring more joy and connection than material possessions. This insight led to the creation of our curated experience marketplace.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, we offer hundreds of unique experiences across the country, from adrenaline-pumping adventures to serene wellness retreats, all designed to create unforgettable moments.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission Section */}
      <section 
        ref={missionRef}
        className="py-12 md:py-24 bg-secondary/10"
      >
        <div className="container max-w-6xl mx-auto px-4 md:px-10">
          <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${missionInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We believe in the power of experiences to transform lives, strengthen relationships, and create stories worth telling. Our mission is to make extraordinary experiences accessible to everyone and revolutionize the way people think about gifting.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Curate Excellence</h3>
                <p className="text-muted-foreground">We carefully select each experience for quality, uniqueness, and memorability.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Connect People</h3>
                <p className="text-muted-foreground">We create opportunities for meaningful connections through shared experiences.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-3">Inspire Joy</h3>
                <p className="text-muted-foreground">We measure our success by the memories and moments of happiness we help create.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Founders Section */}
      <section className="mt-16 mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Meet the Co-founders</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {/* Aryan Jain */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-xs">
            <img src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" alt="Aryan Jain" className="h-24 w-24 rounded-full object-cover mb-4 border-2 border-primary" />
            <h3 className="text-lg font-semibold mb-0">Aryan Jain</h3>
            <p className="text-primary text-sm font-medium mb-1">Co-founder</p>
            <p className="text-gray-600 text-center">Product visionary and passionate about creating joyful gifting experiences.</p>
          </div>
          {/* Apoorv Kakar */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-xs">
            <img src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" alt="Apoorv Kakar" className="h-24 w-24 rounded-full object-cover mb-4 border-2 border-primary" />
            <h3 className="text-lg font-semibold mb-0">Apoorv Kakar</h3>
            <p className="text-primary text-sm font-medium mb-1">Co-founder</p>
            <p className="text-gray-600 text-center">Tech lead, ensuring seamless and delightful user journeys.</p>
          </div>
          {/* Kaushal Rathi */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center w-full max-w-xs">
            <img src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" alt="Kaushal Rathi" className="h-24 w-24 rounded-full object-cover mb-4 border-2 border-primary" />
            <h3 className="text-lg font-semibold mb-0">Kaushal Rathi</h3>
            <p className="text-primary text-sm font-medium mb-1">Co-founder</p>
            <p className="text-gray-600 text-center">Operations and partnerships, making every experience possible.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
