
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Gift, CheckCircle, Clock, Heart, Image, CornerRightDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/animations';
import ExperienceCard from '@/components/ExperienceCard';
import { experiences } from '@/lib/data';

const GiftingGuide = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  
  // Get a few featured experiences for recommendations
  const featuredExperiences = experiences
    .filter(exp => exp.trending || exp.price > 30000)
    .slice(0, 3);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 md:pt-24">
        {/* Hero Section */}
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img 
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop" 
            alt="Gifting Guide"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <Link to="/" className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-4">
              <Gift className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-5xl font-medium mb-4">Experience vs. Material Gifts</h1>
            <p className="max-w-2xl text-white/80 text-lg mb-8">
              Discover why experiences make for more meaningful and memorable gifts
            </p>
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-white/90"
              onClick={() => {
                const section = document.getElementById('comparison');
                section?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore the Guide
            </Button>
          </div>
        </div>
        
        {/* Main Content */}
        <div 
          ref={ref}
          id="comparison"
          className="container max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24"
        >
          <div className={cn(
            "space-y-16 transition-all duration-700",
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
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
                <footer className="text-base text-muted-foreground mt-4 not-italic">
                  — Cesare Pavese
                </footer>
              </blockquote>
            </div>
            
            {/* Recommended Experiences */}
            <div>
              <h3 className="text-2xl font-medium mb-6 text-center">Recommended Experiences</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredExperiences.map(experience => (
                  <ExperienceCard key={experience.id} experience={experience} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/gift-personalizer">
                  <Button size="lg" className="mr-4">
                    Find the Perfect Gift
                  </Button>
                </Link>
                <Link to="/experiences">
                  <Button variant="outline" size="lg">
                    Browse All Experiences
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GiftingGuide;
