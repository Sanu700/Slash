
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, Calendar, AlertCircle, ArrowLeftRight, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Returns = () => {
  const [heroRef, heroInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [policyRef, policyInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [processRef, processInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16">
        {/* Hero Section */}
        <div 
          ref={heroRef}
          className="relative bg-gradient-to-r from-teal-800 to-teal-600 text-white py-16 md:py-24"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <div className={`max-w-2xl transition-all duration-700 ${heroInView ? "opacity-100" : "opacity-0 translate-y-8"}`}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Returns & Refunds</h1>
              <p className="text-xl mb-8">
                Our fair and customer-friendly policies for exchanges, returns, and refunds of experience gifts.
              </p>
            </div>
          </div>
        </div>
        
        {/* Return Policy Overview */}
        <section 
          ref={policyRef}
          className="py-16 md:py-24"
        >
          <div className="container max-w-4xl mx-auto px-6 md:px-10">
            <h2 className={cn(
              "text-3xl font-medium mb-12 text-center transition-all duration-700",
              policyInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              Our Return Policy
            </h2>
            
            <div className="space-y-8">
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500 transition-all duration-700 delay-100",
                policyInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-3">Experience Satisfaction Guarantee</h3>
                <p className="text-muted-foreground">
                  We stand behind the quality of our experiences. If you or your gift recipient is genuinely dissatisfied with an experience due to significant discrepancies from our description or serious quality issues, please contact us within 7 days of the experience date, and we'll work with you to make it right.
                </p>
              </div>
              
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500 transition-all duration-700 delay-200",
                policyInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-3">Unused Experience Gifts</h3>
                <p className="text-muted-foreground">
                  For unused experience gifts or vouchers that haven't been scheduled or redeemed:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2 text-muted-foreground">
                  <li>Full refund within 14 days of purchase (money-back guarantee period)</li>
                  <li>Exchange for another experience or gift card of equal value within validity period</li>
                  <li>Gift recipient exchanges don't require the original purchaser's involvement</li>
                </ul>
              </div>
              
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500 transition-all duration-700 delay-300",
                policyInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-3">Booked Experiences</h3>
                <p className="text-muted-foreground">
                  For experiences that have been scheduled but not yet enjoyed:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2 text-muted-foreground">
                  <li>Free rescheduling with at least 72 hours notice</li>
                  <li>Cancellations with more than 7 days notice: full refund or exchange</li>
                  <li>Cancellations with 3-7 days notice: 50% refund or full exchange</li>
                  <li>Cancellations with less than 72 hours notice: no refund (except in cases of emergency)</li>
                </ul>
                <p className="mt-3 text-muted-foreground">
                  <strong>Note:</strong> Some experiences may have specific cancellation policies that differ from our standard policy. These are clearly indicated on the experience details page.
                </p>
              </div>
              
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500 transition-all duration-700 delay-400",
                policyInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-3">Provider Cancellations</h3>
                <p className="text-muted-foreground">
                  Sometimes experiences may need to be canceled by the provider due to weather conditions, safety concerns, or other unavoidable circumstances. In these cases, you will always be offered:
                </p>
                <ul className="list-disc ml-6 mt-3 space-y-2 text-muted-foreground">
                  <li>Priority rescheduling to a suitable alternative date</li>
                  <li>Exchange for a different experience of equal value</li>
                  <li>Full refund if preferred</li>
                </ul>
              </div>
              
              <div className={cn(
                "bg-white p-6 rounded-xl shadow-sm border-l-4 border-teal-500 transition-all duration-700 delay-500",
                policyInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <h3 className="text-xl font-medium mb-3">Exceptional Circumstances</h3>
                <p className="text-muted-foreground">
                  We understand that life is unpredictable. In cases of serious illness, injury, bereavement, or other significant extenuating circumstances that prevent participation in a booked experience, please contact us as soon as possible. We'll work with you compassionately to find the best solution, which may include rescheduling or refunding outside our standard policy timeframes.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Refund Process */}
        <section 
          ref={processRef}
          className="py-16 md:py-24 bg-secondary/10"
        >
          <div className="container max-w-6xl mx-auto px-6 md:px-10">
            <h2 className={cn(
              "text-3xl font-medium mb-12 text-center transition-all duration-700",
              processInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              Refund Process
            </h2>
            
            <div className="relative">
              {/* Process Steps */}
              <div className="hidden md:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-gray-200 -translate-x-1/2 z-0"></div>
              
              {/* Step 1 */}
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start mb-16 md:mb-24">
                <div className={cn(
                  "bg-teal-100 text-teal-600 rounded-full p-5 mb-6 md:mb-0 transition-all duration-700",
                  processInView ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  <CheckCircle className="w-10 h-10" />
                </div>
                
                <div className="md:mx-12 text-center md:text-left md:w-1/3">
                  <div className={cn(
                    "bg-teal-600 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto md:mx-0 mb-4 transition-all duration-700 delay-100",
                    processInView ? "opacity-100" : "opacity-0"
                  )}>
                    1
                  </div>
                  <h3 className={cn(
                    "text-2xl font-medium mb-3 transition-all duration-700 delay-200",
                    processInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Submit Request
                  </h3>
                  <div className={cn(
                    "text-muted-foreground transition-all duration-700 delay-300",
                    processInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    <p className="mb-3">
                      To request a refund or exchange, you can:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Log into your account and select "Request Refund" on your booking</li>
                      <li>Contact our customer support team by phone or email</li>
                      <li>Use the contact form on our website</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      Please include your booking reference or gift certificate number and the reason for your request.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative z-10 flex flex-col md:flex-row-reverse items-center md:items-start mb-16 md:mb-24">
                <div className={cn(
                  "bg-teal-100 text-teal-600 rounded-full p-5 mb-6 md:mb-0 transition-all duration-700 delay-200",
                  processInView ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  <Clock className="w-10 h-10" />
                </div>
                
                <div className="md:mx-12 text-center md:text-right md:w-1/3">
                  <div className={cn(
                    "bg-teal-600 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto md:ml-auto md:mr-0 mb-4 transition-all duration-700 delay-300",
                    processInView ? "opacity-100" : "opacity-0"
                  )}>
                    2
                  </div>
                  <h3 className={cn(
                    "text-2xl font-medium mb-3 transition-all duration-700 delay-400",
                    processInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Review Process
                  </h3>
                  <div className={cn(
                    "text-muted-foreground transition-all duration-700 delay-500",
                    processInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    <p className="mb-3">
                      Our team will review your request within 1-2 business days. During this process:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>We'll check your booking status and eligibility based on our policies</li>
                      <li>We may contact the experience provider for additional information</li>
                      <li>For special circumstances, we may request supporting documentation</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      You'll receive email updates throughout the process.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start">
                <div className={cn(
                  "bg-teal-100 text-teal-600 rounded-full p-5 mb-6 md:mb-0 transition-all duration-700 delay-400",
                  processInView ? "opacity-100" : "opacity-0 scale-75"
                )}>
                  <ArrowLeft className="w-10 h-10" />
                </div>
                
                <div className="md:mx-12 text-center md:text-left md:w-1/3">
                  <div className={cn(
                    "bg-teal-600 text-white text-xl font-bold rounded-full w-8 h-8 flex items-center justify-center mx-auto md:mx-0 mb-4 transition-all duration-700 delay-500",
                    processInView ? "opacity-100" : "opacity-0"
                  )}>
                    3
                  </div>
                  <h3 className={cn(
                    "text-2xl font-medium mb-3 transition-all duration-700 delay-600",
                    processInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    Refund Processing
                  </h3>
                  <div className={cn(
                    "text-muted-foreground transition-all duration-700 delay-700",
                    processInView ? "opacity-100" : "opacity-0 translate-y-4"
                  )}>
                    <p className="mb-3">
                      Once approved, refunds are processed as follows:
                    </p>
                    <ul className="list-disc ml-6 space-y-1 text-sm">
                      <li>Credit card refunds: 3-5 business days to appear on your statement</li>
                      <li>Store credit: Immediately available in your account</li>
                      <li>Exchange: New gift certificate sent within 24 hours</li>
                    </ul>
                    <p className="mt-3 text-sm">
                      You'll receive confirmation once your refund has been processed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Additional Information */}
        <section className="py-16 md:py-24">
          <div className="container max-w-4xl mx-auto px-6 md:px-10">
            <h2 className="text-3xl font-medium mb-12 text-center">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Gift Certificate Extensions</h3>
                <div className="text-muted-foreground">
                  <p className="mb-3">
                    If a gift certificate is approaching its expiration date, we offer the following options:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>3-month extension: $15 fee</li>
                    <li>6-month extension: $25 fee</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Extensions must be requested before the original expiration date.
                  </p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Non-Refundable Items</h3>
                <div className="text-muted-foreground">
                  <p className="mb-3">
                    The following are generally not eligible for refunds:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Shipping fees for physical gift packages</li>
                    <li>Personalization or gift wrapping fees</li>
                    <li>Experiences explicitly marked as "Non-Refundable" in their terms</li>
                    <li>Expired gift certificates (though extensions may be available)</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <ArrowLeftRight className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Price Differences in Exchanges</h3>
                <div className="text-muted-foreground">
                  <p className="mb-3">
                    When exchanging for a different experience:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>If the new experience costs more, you'll need to pay the difference</li>
                    <li>If the new experience costs less, we'll issue the difference as store credit</li>
                    <li>Price differences under $10 may be refunded as store credit only</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Gift className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium mb-3">Gift Recipient Options</h3>
                <div className="text-muted-foreground">
                  <p className="mb-3">
                    As a gift recipient, you have several options if you'd prefer not to use the specific experience gifted to you:
                  </p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Exchange for another experience without notifying the gift-giver</li>
                    <li>Transfer the gift value to your account as credit</li>
                    <li>Regift to someone else with a new personalized message</li>
                  </ul>
                  <p className="mt-3 text-sm">
                    Gift givers are not notified of exchanges or transfers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 md:py-24 bg-teal-50">
          <div className="container max-w-4xl mx-auto px-6 md:px-10 text-center">
            <h2 className="text-3xl font-medium mb-4">Need Help with a Return or Refund?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our customer service team is ready to assist with your questions or concerns about returns, exchanges, or refunds.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700" asChild>
                <Link to="/contact">Contact Support</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50" asChild>
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

export default Returns;
