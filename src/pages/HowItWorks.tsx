import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Gift, Search, Calendar, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { scrollToTop } from '@/lib/animations';

const HowItWorks = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [stepsRef, stepsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [faqRef, faqInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-blue-900 to-purple-800 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h1>
              <p className="text-xl mb-8">
                Discovering, gifting, and experiencing something extraordinary has never been easier.
                Follow our simple process to create unforgettable memories.
              </p>
              <Link to="/experiences" onClick={scrollToTop}>
                <Button size="lg" className="bg-white text-blue-900 hover:bg-white/90">
                  Browse Experiences
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Process Steps */}
        <section 
          ref={stepsRef}
          className="py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className={cn(
                "text-3xl md:text-4xl font-medium mb-6 transition-all duration-700",
                stepsInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                Simple Steps to an Unforgettable Experience
              </h2>
              <p className={cn(
                "text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-700 delay-100",
                stepsInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                Follow these four easy steps to discover, purchase, and enjoy extraordinary experiences
              </p>
            </div>
            
            <div className="relative">
              {/* Progress Line */}
              <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-gray-200 -translate-x-1/2 z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start mb-16 md:mb-24">
                <div className={cn(
                  "bg-primary/10 text-primary rounded-full p-5 mb-6 md:mb-0 transition-all duration-700",
                  stepsInView ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  <Search className="w-10 h-10" />
                </div>
                
                <div className="md:mx-12 text-center md:text-left md:w-1/3">
                  <div className={cn(
                    "bg-primary text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto md:mx-0 mb-4 transition-all duration-700 delay-100",
                    stepsInView ? "opacity-100" : "opacity-0"
                  )}>
                    1
                  </div>
                  <h3 className={cn(
                    "text-2xl font-medium mb-3 transition-all duration-700 delay-200",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Browse Experiences
                  </h3>
                  <p className={cn(
                    "text-muted-foreground transition-all duration-700 delay-300",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Explore our curated collection of experiences across different categories. 
                    Filter by location, price, or type to find the perfect experience.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col md:flex-row-reverse items-center md:items-start mb-16 md:mb-24">
                <div className={cn(
                  "bg-primary/10 text-primary rounded-full p-5 mb-6 md:mb-0 transition-all duration-700 delay-100",
                  stepsInView ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  <Gift className="w-10 h-10" />
                </div>
                
                <div className="md:mx-12 text-center md:text-right md:w-1/3">
                  <div className={cn(
                    "bg-primary text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto md:ml-auto md:mr-0 mb-4 transition-all duration-700 delay-200",
                    stepsInView ? "opacity-100" : "opacity-0"
                  )}>
                    2
                  </div>
                  <h3 className={cn(
                    "text-2xl font-medium mb-3 transition-all duration-700 delay-300",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Purchase or Gift
                  </h3>
                  <p className={cn(
                    "text-muted-foreground transition-all duration-700 delay-400",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Select an experience for yourself or as a gift. 
                    Personalize your gift with a message and choose digital or physical delivery.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start mb-16 md:mb-24">
                <div className={cn(
                  "bg-primary/10 text-primary rounded-full p-5 mb-6 md:mb-0 transition-all duration-700 delay-200",
                  stepsInView ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  <Calendar className="w-10 h-10" />
                </div>
                
                <div className="md:mx-12 text-center md:text-left md:w-1/3">
                  <div className={cn(
                    "bg-primary text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto md:mx-0 mb-4 transition-all duration-700 delay-300",
                    stepsInView ? "opacity-100" : "opacity-0"
                  )}>
                    3
                  </div>
                  <h3 className={cn(
                    "text-2xl font-medium mb-3 transition-all duration-700 delay-400",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Schedule
                  </h3>
                  <p className={cn(
                    "text-muted-foreground transition-all duration-700 delay-500",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Pick a date and time for your experience. 
                    The recipient can easily reschedule if needed through our booking platform.
                  </p>
                </div>
              </div>
              
              {/* Step 4 */}
              <div className="relative z-10 flex flex-col md:flex-row-reverse items-center md:items-start">
                <div className={cn(
                  "bg-primary/10 text-primary rounded-full p-5 mb-6 md:mb-0 transition-all duration-700 delay-300",
                  stepsInView ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div className="md:mx-12 text-center md:text-right md:w-1/3">
                  <div className={cn(
                    "bg-primary text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto md:ml-auto md:mr-0 mb-4 transition-all duration-700 delay-400",
                    stepsInView ? "opacity-100" : "opacity-0"
                  )}>
                    4
                  </div>
                  <h3 className={cn(
                    "text-2xl font-medium mb-3 transition-all duration-700 delay-500",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Enjoy the Experience
                  </h3>
                  <p className={cn(
                    "text-muted-foreground transition-all duration-700 delay-600",
                    stepsInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Simply show up and enjoy your experience! 
                    All details will be provided in advance so you're fully prepared.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium mb-6">Why Choose Slash Experiences</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We make discovering and enjoying extraordinary experiences simple, while ensuring quality and flexibility
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Curated Experiences</h3>
                <p className="text-muted-foreground">
                  We personally vet every experience provider to ensure quality and uniqueness.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Flexible Booking</h3>
                <p className="text-muted-foreground">
                  Easy rescheduling options and extended validity periods for most experiences.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Safe & Secure</h3>
                <p className="text-muted-foreground">
                  All transactions are encrypted and we offer a satisfaction guarantee.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section 
          ref={faqRef}
          className="py-16 md:py-24"
        >
          <div className="container max-w-4xl mx-auto px-6 md:px-10">
            <div className={cn(
              "text-center mb-12 transition-all duration-700",
              faqInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              <h2 className="text-3xl font-medium mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Got more questions? Visit our <Link to="/faq" className="text-primary hover:underline">full FAQ page</Link> or <Link to="/contact" className="text-primary hover:underline">contact us</Link>.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-100",
                faqInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-2">How long are gift certificates valid?</h3>
                <p className="text-muted-foreground">
                  Most experience gift certificates are valid for 12 months from the date of purchase. Some seasonal experiences may have different validity periods, which will be clearly noted on the experience details page.
                </p>
              </div>
              
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-200",
                faqInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-2">Can I exchange my experience for a different one?</h3>
                <p className="text-muted-foreground">
                  Yes! We offer free exchanges within 30 days of purchase as long as the experience hasn't been booked. After 30 days, exchanges are subject to a small administrative fee.
                </p>
              </div>
              
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-300",
                faqInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-2">What happens if the experience gets canceled?</h3>
                <p className="text-muted-foreground">
                  If an experience is canceled by the provider, you can either reschedule for another date or receive a full refund. If you need to cancel, our standard cancellation policy requires at least 72 hours' notice for a full refund or exchange.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
