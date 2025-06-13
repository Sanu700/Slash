
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';

const AboutUs = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [missionRef, missionInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [teamRef, teamInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-purple-900 to-indigo-800 text-white py-20 md:py-28"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
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
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&auto=format&fit=crop" 
                  alt="Team brainstorming" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <h2 className="text-3xl font-medium mb-6">Our Story</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Founded in 2020, Slash Experiences began with a simple idea: what if gifts could create lasting memories instead of collecting dust?
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
          className="py-16 md:py-24 bg-secondary/10"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${missionInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-3xl font-medium mb-6">Our Mission</h2>
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
        
        {/* Team Section */}
        <section 
          ref={teamRef}
          className="py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`text-center mb-12 transition-all duration-700 ${teamInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h2 className="text-3xl font-medium mb-4">Our Team</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Meet the passionate people behind Slash Experiences who work tirelessly to bring you extraordinary moments.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop"
                    alt="Sarah Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium">Sarah Johnson</h3>
                <p className="text-muted-foreground">Founder & CEO</p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&auto=format&fit=crop"
                    alt="Michael Chen" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium">Michael Chen</h3>
                <p className="text-muted-foreground">Head of Experiences</p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&auto=format&fit=crop"
                    alt="Priya Patel" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium">Priya Patel</h3>
                <p className="text-muted-foreground">Customer Experience</p>
              </div>
              
              {/* Team Member 4 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=400&h=400&auto=format&fit=crop"
                    alt="David Wilson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium">David Wilson</h3>
                <p className="text-muted-foreground">Partner Relations</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
