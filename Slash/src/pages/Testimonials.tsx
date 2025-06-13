
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    id: 1,
    name: "Jennifer L.",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop",
    text: "The hot air balloon ride was the perfect anniversary gift for my husband. The experience was magical and the customer service was exceptional from booking to the actual day.",
    rating: 5,
    experience: "Hot Air Balloon Ride"
  },
  {
    id: 2,
    name: "Marcus T.",
    location: "Chicago, IL",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&auto=format&fit=crop",
    text: "I gifted my parents a wine tasting experience for their 40th anniversary. They couldn't stop talking about how knowledgeable the sommelier was and how much they enjoyed the entire day.",
    rating: 5,
    experience: "Wine Tasting Experience"
  },
  {
    id: 3,
    name: "Sophia K.",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&auto=format&fit=crop",
    text: "The private yacht sunset cruise exceeded all expectations. The staff was attentive, the views were breathtaking, and it made for an unforgettable birthday celebration.",
    rating: 5,
    experience: "Private Yacht Sunset Cruise"
  },
  {
    id: 4,
    name: "James R.",
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400&h=400&auto=format&fit=crop",
    text: "The supercar track day was a dream come true for a car enthusiast like me. Professional instruction, amazing vehicles, and an adrenaline rush I won't forget!",
    rating: 5,
    experience: "Supercar Track Day"
  },
  {
    id: 5,
    name: "Emma D.",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop",
    text: "The Michelin star dining experience was absolutely divine. Every course was a masterpiece, and the service was impeccable. Perfect for our special occasion.",
    rating: 5,
    experience: "Michelin Star Dining"
  },
  {
    id: 6,
    name: "Michael P.",
    location: "Denver, CO",
    image: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&auto=format&fit=crop",
    text: "The helicopter city tour gave us perspectives of Denver we'd never seen before, despite living here for years. Amazing experience and worth every penny!",
    rating: 4,
    experience: "Helicopter City Tour"
  }
];

const Testimonials = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-amber-700 to-orange-600 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Customer Stories</h1>
              <p className="text-xl mb-8">
                Discover how our experiences have created lasting memories and brought joy to our customers. 
                These are their stories.
              </p>
              <div className="flex justify-center">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="ml-2 text-xl font-medium">4.9/5 from 800+ reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Featured Testimonial */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Side */}
                <div className="h-64 md:h-auto relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?w=800&auto=format&fit=crop"
                    alt="Hot Air Balloon Experience" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                
                {/* Content Side */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl italic text-gray-800 mb-6">
                    "The hot air balloon experience was absolutely magical. Floating above the valleys at sunrise, watching the world wake up below us—it's a memory my partner and I will cherish forever. The attention to detail, from the champagne toast to the professional crew, made this truly special."
                  </blockquote>
                  
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden w-12 h-12 mr-4">
                      <img 
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop"
                        alt="Jennifer L." 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">Jennifer L.</div>
                      <div className="text-muted-foreground text-sm">Hot Air Balloon Ride, Napa Valley</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonial Grid */}
        <section 
          ref={testimonialsRef}
          className="py-16 md:py-24 bg-secondary/10"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <h2 className={cn(
              "text-3xl font-medium mb-12 text-center transition-all duration-700",
              testimonialsInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              What Our Customers Say
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={testimonial.id}
                  className={cn(
                    "bg-white p-6 rounded-xl shadow-sm transition-all duration-700",
                    testimonialsInView ? "opacity-100" : "opacity-0 translate-y-8",
                    { "delay-100": index % 3 === 0, "delay-200": index % 3 === 1, "delay-300": index % 3 === 2 }
                  )}
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                    {[...Array(5 - testimonial.rating)].map((_, i) => (
                      <Star key={i + testimonial.rating} className="w-5 h-5 text-gray-300" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-800 mb-6">
                    "{testimonial.text}"
                  </blockquote>
                  
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden w-10 h-10 mr-3">
                      <img 
                        src={testimonial.image}
                        alt={testimonial.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-medium">{testimonial.name}</div>
                      <div className="text-muted-foreground text-sm">{testimonial.experience}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonial Video Section */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-4">See Experiences in Action</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Watch our customers share their experiences and the memories they've created
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Video Placeholder 1 */}
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video relative hover-lift">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-primary ml-1"></div>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop"
                  alt="Adventure Experience Video" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-medium">Mountain Hiking Adventure</h3>
                  <p>Sarah & John's story</p>
                </div>
              </div>
              
              {/* Video Placeholder 2 */}
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video relative hover-lift">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-primary ml-1"></div>
                  </div>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop"
                  alt="Dining Experience Video" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-medium">Fine Dining Experience</h3>
                  <p>Michael's 40th birthday celebration</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Testimonials;
