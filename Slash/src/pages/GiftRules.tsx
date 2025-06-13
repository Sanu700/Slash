
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Calendar, CheckCircle, Gift, Clock, ArrowLeftRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const GiftRules = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [rulesRef, rulesInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-rose-800 to-pink-600 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Gift Rules & Policies</h1>
              <p className="text-xl mb-8">
                Understanding our gift experience policies helps ensure a smooth and enjoyable experience for both gift-givers and recipients.
              </p>
            </div>
          </div>
        </div>
        
        {/* Gift Rules Section */}
        <section 
          ref={rulesRef}
          className="py-16 md:py-24"
        >
          <div className="container max-w-4xl mx-auto px-6 md:px-10">
            <div className={cn(
              "space-y-16 transition-all duration-700",
              rulesInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              {/* Validity Period */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-16 flex-shrink-0">
                  <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-4">Validity Period</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>
                      All gift experiences are valid for 12 months from the date of purchase unless otherwise specified on the individual experience page. The specific expiration date is always clearly displayed on the gift certificate.
                    </p>
                    <p>
                      Some seasonal experiences (such as winter sports or summer water activities) may have shorter validity periods due to their seasonal nature. These will be clearly marked before purchase.
                    </p>
                    <p>
                      We recommend that recipients book their experience well in advance of the expiration date to ensure availability.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Redemption Process */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-16 flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-4">Redemption Process</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>
                      To redeem a gift experience, the recipient needs to:
                    </p>
                    <ol>
                      <li>Visit our website and click on "Redeem Gift" in the top navigation</li>
                      <li>Enter the unique redemption code found on their gift certificate</li>
                      <li>Create an account or log in to an existing account</li>
                      <li>Select their preferred date and time (for experiences that require scheduling)</li>
                      <li>Complete the booking process and receive a confirmation email</li>
                    </ol>
                    <p>
                      Alternatively, recipients can call our customer service team who will assist with the redemption process over the phone.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Booking & Scheduling */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-16 flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-4">Booking & Scheduling</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>
                      Most experiences require advance booking, typically 2-4 weeks in advance for popular experiences, though this varies by provider.
                    </p>
                    <p>
                      Once booked, recipients will receive a confirmation email with all relevant details including:
                    </p>
                    <ul>
                      <li>Date and time of the experience</li>
                      <li>Location and directions</li>
                      <li>What to bring or wear</li>
                      <li>Contact information for the experience provider</li>
                      <li>Cancellation and rescheduling policies</li>
                    </ul>
                    <p>
                      We recommend booking as early as possible to secure preferred dates, especially for seasonal experiences or weekend slots which tend to fill up quickly.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Exchange Policy */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-16 flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                    <ArrowLeftRight className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-4">Exchange Policy</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>
                      We understand that not every gift will be the perfect match, which is why we offer a flexible exchange policy:
                    </p>
                    <ul>
                      <li>Recipients can exchange their gift for any other experience of equal or lesser value</li>
                      <li>If choosing an experience of greater value, they can pay the difference</li>
                      <li>Exchanges can be made at any time before booking and within the validity period</li>
                      <li>Once an experience has been booked, our standard cancellation policy applies</li>
                    </ul>
                    <p>
                      To make an exchange, recipients should contact our customer support team or use the exchange option in their account dashboard.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Cancellation & Rescheduling */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-16 flex-shrink-0">
                  <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-4">Cancellation & Rescheduling</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>
                      Our standard cancellation and rescheduling policies are as follows:
                    </p>
                    <ul>
                      <li>Free rescheduling with at least 72 hours notice before the scheduled experience</li>
                      <li>Cancellations with more than 7 days notice: full refund or exchange</li>
                      <li>Cancellations with 3-7 days notice: 50% refund or full exchange</li>
                      <li>Cancellations with less than 72 hours notice: no refund, but we may offer rescheduling at our discretion</li>
                    </ul>
                    <p>
                      Some experiences may have specific cancellation policies that differ from our standard policy. These will be clearly indicated on the experience page and in the booking confirmation.
                    </p>
                    <p>
                      In case of exceptional circumstances (illness, family emergency, etc.), please contact us as soon as possible, and we'll do our best to accommodate your situation.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Experience Modifications */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-16 flex-shrink-0">
                  <div className="w-12 h-12 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center">
                    <Gift className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-4">Experience Modifications</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>
                      While we strive to ensure all experiences are delivered exactly as described, sometimes unforeseen circumstances may require modifications:
                    </p>
                    <ul>
                      <li>Weather conditions may necessitate rescheduling or modifications to outdoor activities</li>
                      <li>Provider changes may occasionally affect specific details of an experience</li>
                      <li>Seasonal variations might slightly alter the experience content</li>
                    </ul>
                    <p>
                      In the rare event that an experience needs to be significantly modified or canceled by the provider, we will:
                    </p>
                    <ul>
                      <li>Notify participants as soon as possible</li>
                      <li>Offer rescheduling to a suitable alternative date</li>
                      <li>Provide an exchange for a different experience of equal value</li>
                      <li>Offer a full refund if preferred</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Special Circumstances */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="md:w-16 flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-medium mb-4">Special Circumstances</h2>
                  <div className="prose max-w-none text-muted-foreground">
                    <p>
                      <strong>Expired Gift Certificates:</strong> While we encourage redeeming within the validity period, we understand that circumstances may prevent this. Contact our customer service team if your certificate has expired, and we'll do our best to accommodate you with a modest extension fee.
                    </p>
                    <p>
                      <strong>Lost or Damaged Certificates:</strong> If a physical gift certificate is lost or damaged, we can issue a replacement if you provide the original purchaser's information and approximate purchase date.
                    </p>
                    <p>
                      <strong>Health & Safety:</strong> Some experiences have specific health, fitness, or age requirements for safety reasons. These are clearly stated in the experience details. If after purchase you discover you cannot participate due to these requirements, contact us to discuss alternatives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Need Help Section */}
        <section className="py-16 md:py-24 bg-secondary/10">
          <div className="container max-w-4xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl font-medium mb-4">Need Further Assistance?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              If you have any questions about our gift rules or need help with a specific situation, our customer service team is ready to assist you.
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

export default GiftRules;
