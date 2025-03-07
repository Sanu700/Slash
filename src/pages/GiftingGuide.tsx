
import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Heart, Gift, Star, Award, ThumbsUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/animations';

const GiftingGuide = () => {
  const [activeTab, setActiveTab] = useState<'qualities' | 'stats'>('qualities');
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentRef1, isInView1] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [contentRef2, isInView2] = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const [contentRef3, isInView3] = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  
  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
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
            <h1 className="text-3xl md:text-5xl font-medium mb-4">The Art of Gifting</h1>
            <p className="max-w-2xl text-white/80 text-lg mb-8">
              Discover what makes a gift truly meaningful and why experiences create lasting memories
            </p>
            <Button 
              onClick={scrollToContent}
              size="lg" 
              className="bg-white text-black hover:bg-white/90"
            >
              Explore Guide
            </Button>
          </div>
        </div>
        
        <div 
          ref={contentRef}
          className="container max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24"
        >
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-lg bg-secondary/50 p-1">
              <button
                className={cn(
                  "px-6 py-3 rounded-md text-sm md:text-base font-medium transition-colors",
                  activeTab === 'qualities' ? "bg-white text-black" : "text-muted-foreground"
                )}
                onClick={() => setActiveTab('qualities')}
              >
                What Makes a Great Gift
              </button>
              <button
                className={cn(
                  "px-6 py-3 rounded-md text-sm md:text-base font-medium transition-colors",
                  activeTab === 'stats' ? "bg-white text-black" : "text-muted-foreground"
                )}
                onClick={() => setActiveTab('stats')}
              >
                Experience vs. Material Gifts
              </button>
            </div>
          </div>
          
          {/* What Makes a Great Gift Content */}
          {activeTab === 'qualities' && (
            <div ref={contentRef1} className={cn(
              "transition-all duration-700",
              isInView1 ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              <h2 className="text-3xl font-medium mb-10 text-center">The Five Qualities of Meaningful Gifts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-colors border border-gray-200/10">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Personalization</h3>
                  <p className="text-muted-foreground">
                    The best gifts reflect a deep understanding of the recipient's personality, interests, and desires. They show that you've put thought into what would truly delight them.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-colors border border-gray-200/10">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Surprise Factor</h3>
                  <p className="text-muted-foreground">
                    Unexpected gifts often create the strongest emotional reactions. A gift that surprises and delights creates an unforgettable moment that both giver and receiver will remember.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-colors border border-gray-200/10">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Quality Over Quantity</h3>
                  <p className="text-muted-foreground">
                    A single, thoughtful gift will always mean more than multiple generic items. Quality gifts show that you value the recipient enough to invest in something truly special.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-colors border border-gray-200/10">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <ThumbsUp className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Emotional Connection</h3>
                  <p className="text-muted-foreground">
                    The most treasured gifts forge an emotional bond. They may remind the recipient of a shared memory, an inside joke, or demonstrate how well you understand them.
                  </p>
                </div>
                
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 hover:bg-white/10 transition-colors border border-gray-200/10 md:col-span-2 lg:col-span-1">
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">Lasting Impact</h3>
                  <p className="text-muted-foreground">
                    Great gifts continue to bring joy long after they're given. Whether through memories created, skills learned, or experiences gained, they have enduring value.
                  </p>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                <h3 className="text-2xl font-medium mb-6">Why Experiences Make Perfect Gifts</h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                  Experience gifts excel in all five qualities of great gifts. They're highly personalized, create surprise and delight, offer premium quality, forge emotional connections, and create lasting memories that endure for years.
                </p>
                <Link to="/gift-personalizer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Find the Perfect Experience Gift
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
          
          {/* Stats Content */}
          {activeTab === 'stats' && (
            <div ref={contentRef2} className={cn(
              "transition-all duration-700",
              isInView2 ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              <h2 className="text-3xl font-medium mb-10 text-center">The Science Behind Experience Gifts</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                <div>
                  <h3 className="text-xl font-medium mb-6">Research Findings</h3>
                  
                  <div className="space-y-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10">
                      <p className="text-2xl font-medium text-primary mb-2">78%</p>
                      <p className="text-muted-foreground">of people report greater happiness from experiential purchases compared to material ones</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10">
                      <p className="text-2xl font-medium text-primary mb-2">85%</p>
                      <p className="text-muted-foreground">of experience gift recipients remembered their gift a year later versus only 53% for material gifts</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10">
                      <p className="text-2xl font-medium text-primary mb-2">3.5×</p>
                      <p className="text-muted-foreground">stronger social bonds are formed through shared experiences versus material gift exchanges</p>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-200/10">
                      <p className="text-2xl font-medium text-primary mb-2">64%</p>
                      <p className="text-muted-foreground">of millennials prefer to receive experience gifts rather than physical items</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-6">Why Experiences Win</h3>
                  
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-gray-200/10 h-full">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          No Comparison Shopping
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Unlike physical items, experiences are harder to directly compare, reducing "buyer's remorse" and increasing satisfaction.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          Part of Identity
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Experiences become part of our identity and personal narrative, while material items remain external possessions.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          Anticipation Factor
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          The excitement before an experience creates additional happiness, effectively extending the gift's enjoyment period.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          No Adaptation
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Physical gifts lose their appeal through "hedonic adaptation," while memories of experiences often become more positive over time.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                          Social Connection
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Experiences often involve social interaction, which is a fundamental human need and contributor to happiness.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-16 text-center">
                <h3 className="text-2xl font-medium mb-6">Find the Perfect Experience Gift</h3>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                  Our personalized gift finder helps you select the ideal experience based on the recipient's preferences and interests.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/gift-personalizer">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                      Try Gift Personalizer
                    </Button>
                  </Link>
                  <Link to="/experiences">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      Browse All Experiences
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Quote Section */}
        <div ref={contentRef3} className={cn(
          "bg-primary/5 py-16 md:py-24 transition-all duration-700",
          isInView3 ? "opacity-100" : "opacity-0"
        )}>
          <div className="container max-w-4xl mx-auto px-6 md:px-10 text-center">
            <div className="text-5xl font-serif mb-6">"</div>
            <p className="text-xl md:text-2xl font-medium mb-6">
              We don't remember days, we remember moments. The richness of life lies in memories we have forgotten.
            </p>
            <p className="text-md text-muted-foreground">— Cesare Pavese</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GiftingGuide;
