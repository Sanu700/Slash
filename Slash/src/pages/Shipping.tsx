
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Truck, Mail, Clock, Calendar, PackageCheck, Globe, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Shipping = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [contentRef, contentInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Shipping & Delivery</h1>
              <p className="text-xl mb-8">
                Information about our gift experience packaging, delivery options, and shipping policies.
              </p>
            </div>
          </div>
        </div>
        
        {/* Gift Delivery Options */}
        <section className="py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-medium mb-12 text-center">Gift Delivery Options</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Digital Delivery */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-center">Digital Delivery</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Digital delivery is our most popular and eco-friendly option. When you choose digital delivery:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>A beautifully designed digital gift certificate is delivered via email</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>You can choose immediate delivery or schedule for a future date and time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Add a personal message to make your gift even more special</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>Recipients receive clear instructions on how to redeem their gift</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <p className="font-medium">Cost: Free</p>
                    <p>Delivery Time: Instant or scheduled for future delivery</p>
                  </div>
                </div>
              </div>
              
              {/* Physical Gift Package */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-100">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <PackageCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-center">Physical Gift Package</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    For a tangible gift-giving experience, our premium gift boxes create a memorable unboxing moment:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Elegant gift box with magnetic closure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Beautifully printed gift certificate with unique redemption code</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Personalized message card with your greeting</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span>Experience guide with details about their gift</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <p className="font-medium">Cost: $9.95 for standard shipping</p>
                    <p>Express and overnight options available at checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Shipping Information */}
        <section 
          ref={contentRef}
          className="py-16 md:py-24 bg-secondary/10"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <h2 className={cn(
              "text-3xl font-medium mb-12 text-center transition-all duration-700",
              contentInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              Shipping Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Shipping Times */}
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-100",
                contentInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Shipping Times</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>Estimated delivery times for physical gift packages:</p>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium">Standard Shipping:</span> 3-5 business days
                    </li>
                    <li>
                      <span className="font-medium">Express Shipping:</span> 2 business days
                    </li>
                    <li>
                      <span className="font-medium">Overnight Shipping:</span> Next business day (if ordered before 12pm EST)
                    </li>
                  </ul>
                  <p className="text-sm mt-4">
                    Note: Shipping times may vary during peak holiday seasons.
                  </p>
                </div>
              </div>
              
              {/* Shipping Costs */}
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-200",
                contentInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Shipping Costs</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>Our shipping rates for physical gift packages:</p>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium">Standard Shipping:</span> $9.95
                    </li>
                    <li>
                      <span className="font-medium">Express Shipping:</span> $14.95
                    </li>
                    <li>
                      <span className="font-medium">Overnight Shipping:</span> $24.95
                    </li>
                  </ul>
                  <p className="text-sm mt-4">
                    Free standard shipping on orders over $200.
                  </p>
                </div>
              </div>
              
              {/* Shipping Locations */}
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-300",
                contentInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Shipping Locations</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>We currently ship physical gift packages to:</p>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium">United States:</span> All 50 states and territories
                    </li>
                    <li>
                      <span className="font-medium">Canada:</span> All provinces and territories
                    </li>
                  </ul>
                  <p className="mt-4">
                    Digital delivery is available worldwide. For international physical shipping inquiries, please <Link to="/contact" className="text-primary hover:underline">contact our customer service team</Link>.
                  </p>
                </div>
              </div>
              
              {/* Order Processing */}
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-400",
                contentInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Order Processing</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>Our order processing timeline:</p>
                  <ul className="space-y-2">
                    <li>
                      Orders placed before 12pm EST on business days are processed the same day
                    </li>
                    <li>
                      Orders placed after 12pm EST or on weekends/holidays are processed the next business day
                    </li>
                    <li>
                      During peak holiday seasons (November-December), add 1-2 business days for processing
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Gift Options */}
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-500",
                contentInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Gift Options</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>Enhance your gift with these add-on options:</p>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium">Premium Gift Box:</span> Upgrade to our luxury presentation box (+$10)
                    </li>
                    <li>
                      <span className="font-medium">Handwritten Note:</span> We'll handwrite your personal message (+$5)
                    </li>
                    <li>
                      <span className="font-medium">Gift Wrapping:</span> Elegant wrapping with ribbon (+$7)
                    </li>
                  </ul>
                  <p className="text-sm mt-4">
                    Add these options during checkout.
                  </p>
                </div>
              </div>
              
              {/* Tracking & Delivery */}
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm transition-all duration-700 delay-600",
                contentInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-4">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Tracking & Delivery</h3>
                <div className="space-y-3 text-muted-foreground">
                  <p>Stay informed about your order:</p>
                  <ul className="space-y-2">
                    <li>
                      All physical shipments include tracking information
                    </li>
                    <li>
                      Tracking details are emailed once your order ships
                    </li>
                    <li>
                      Track orders anytime in your account dashboard
                    </li>
                    <li>
                      Signature confirmation is required for orders over $100
                    </li>
                  </ul>
                  <p className="text-sm mt-4">
                    Questions about your delivery? <Link to="/contact" className="text-primary hover:underline">Contact our support team</Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Shipping Policies */}
        <section className="py-16 md:py-24">
          <div className="container max-w-4xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-medium mb-10 text-center">Shipping Policies</h2>
            
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium mb-3">Address Verification</h3>
                <p className="text-muted-foreground">
                  We verify all shipping addresses to minimize delivery issues. Please double-check your shipping information at checkout. For undeliverable packages returned due to incorrect addresses, customers are responsible for reshipment costs.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium mb-3">Damaged or Lost Packages</h3>
                <p className="text-muted-foreground">
                  In the rare event that your package arrives damaged or gets lost in transit, please contact us within 7 days of the expected delivery date. We'll work with the shipping carrier to resolve the issue promptly and replace your order if necessary.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium mb-3">Holiday Shipping</h3>
                <p className="text-muted-foreground">
                  During peak holiday seasons (November-December), we recommend placing orders at least 10 days before your desired delivery date to ensure timely arrival. We post specific holiday shipping deadlines on our website in October each year.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium mb-3">Environmental Commitment</h3>
                <p className="text-muted-foreground">
                  We're committed to reducing our environmental impact. Our packaging is made from recycled materials and is fully recyclable. We also offer carbon-neutral shipping options at checkout for environmentally conscious customers.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Need Help Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container max-w-4xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl font-medium mb-4">Need Help with Shipping?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our customer service team is ready to assist with any questions about shipping, delivery, or special shipping requests.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/faq">View FAQs</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Shipping;
