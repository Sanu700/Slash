
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, MessageCircle, Clock, CalendarClock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [formRef, formInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-blue-700 to-cyan-600 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
              <p className="text-xl mb-6">
                Have questions or need assistance? We're here to help! Reach out to our team for prompt and friendly support.
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>support@slashexperiences.com</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="hidden md:block absolute right-10 bottom-10 opacity-20">
            <div className="w-48 h-48 border-2 border-white/50 rounded-full"></div>
            <div className="w-32 h-32 border-2 border-white/50 rounded-full absolute -top-10 -left-10"></div>
          </div>
        </div>
        
        {/* Contact Options */}
        <section className="py-16 md:py-20">
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* General Inquiries */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-medium mb-2">General Inquiries</h2>
                <p className="text-muted-foreground mb-4">
                  For general questions about our experiences, company information, or partnerships.
                </p>
                <div className="text-blue-600 font-medium">info@slashexperiences.com</div>
              </div>
              
              {/* Customer Support */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-medium mb-2">Customer Support</h2>
                <p className="text-muted-foreground mb-4">
                  Need help with a booking, have questions about an experience, or need to make changes?
                </p>
                <div className="text-purple-600 font-medium">support@slashexperiences.com</div>
              </div>
              
              {/* Business Hours */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-medium mb-2">Business Hours</h2>
                <p className="text-muted-foreground mb-4">
                  Our support team is available to assist you at the following times:
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 8:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">10:00 AM - 6:00 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">12:00 PM - 5:00 PM EST</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Form Section */}
        <section 
          ref={formRef}
          className="py-16 md:py-24 bg-secondary/10"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form Side */}
              <div className={cn(
                "bg-white p-8 rounded-xl shadow-sm transition-all duration-700",
                formInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h2 className="text-2xl font-medium mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium">
                        First Name
                      </label>
                      <Input id="firstName" placeholder="Enter your first name" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium">
                        Last Name
                      </label>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input id="email" type="email" placeholder="Enter your email address" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">
                      Subject
                    </label>
                    <Input id="subject" placeholder="What is your message regarding?" />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help you?" 
                      className="min-h-[120px]"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Send Message</Button>
                </form>
              </div>
              
              {/* Info Side */}
              <div className={cn(
                "transition-all duration-700 delay-200",
                formInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h2 className="text-2xl font-medium mb-6">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Office Location</h3>
                      <p className="text-muted-foreground">
                        123 Experience Street<br />
                        San Francisco, CA 94105<br />
                        United States
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Phone</h3>
                      <p className="text-muted-foreground">
                        Customer Support: +1 (555) 123-4567<br />
                        Partner Relations: +1 (555) 765-4321
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
                      <p className="text-muted-foreground">
                        General Inquiries: info@slashexperiences.com<br />
                        Support: support@slashexperiences.com<br />
                        Careers: careers@slashexperiences.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <CalendarClock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Response Time</h3>
                      <p className="text-muted-foreground">
                        We strive to respond to all inquiries within 24 business hours. For urgent matters, please call our customer support line.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Preview */}
        <section className="py-16 md:py-24">
          <div className="container max-w-4xl mx-auto px-6 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-3">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">
                Find quick answers to common questions before reaching out
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium mb-2">How do I redeem my experience gift?</h3>
                <p className="text-muted-foreground">
                  To redeem your gift, simply enter your unique code on our website under "Redeem Gift" or call our customer support team. You'll then be able to book your experience at a time that works for you.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium mb-2">What is your cancellation policy?</h3>
                <p className="text-muted-foreground">
                  Most experiences allow free rescheduling up to 72 hours before the scheduled time. Cancellation policies vary by experience, and specific details can be found on each experience page.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-medium mb-2">How long are gift vouchers valid?</h3>
                <p className="text-muted-foreground">
                  Most gift vouchers are valid for 12 months from the date of purchase. The expiration date is clearly displayed on the voucher.
                </p>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Link to="/faq">
                <Button variant="outline">View All FAQs</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContactUs;
