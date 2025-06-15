import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { config } from '@/config';

const Checkout = () => {
  const { items, totalPrice, cachedExperiences, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const loadRazorpaySdk = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        console.log('Razorpay SDK already loaded');
        resolve(window.Razorpay);
        return;
      }

      console.log('Loading Razorpay SDK...');
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay SDK loaded successfully');
        resolve(window.Razorpay);
      };
      script.onerror = (error) => {
        console.error('Failed to load Razorpay SDK:', error);
        reject(error);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to proceed with payment');
      return;
    }

    setIsLoading(true);
    let order: any = null;
    try {
      console.log('Starting payment process...');
      const Razorpay = await loadRazorpaySdk();
      
      // Create order
      console.log('Creating order...');
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: totalPrice * 100 } // Convert to paise
      });

      if (orderError) throw orderError;
      order = orderData;
      console.log('Order created:', order);

      // Configure Razorpay
      const options = {
        key: config.razorpay.keyId,
        amount: order.amount,
        currency: config.razorpay.currency,
        name: config.razorpay.name,
        description: config.razorpay.description,
        order_id: order.id,
        handler: async function (response: any) {
          console.log('Payment successful:', response);
          // Verify payment
          const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
            body: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature
            }
          });

          if (verifyError) throw verifyError;

          // Create booking
          const { error: bookingError } = await supabase
            .from('bookings')
            .insert({
              user_id: user.id,
              experience_id: experience.id,
              total_amount: totalPrice,
              payment_id: response.razorpay_payment_id,
              status: 'confirmed'
            });

          if (bookingError) throw bookingError;

          toast({
            title: "Booking Confirmed!",
            description: "Your experience has been booked successfully.",
          });
          navigate('/profile');
        },
        prefill: {
          name: user.user_metadata?.full_name,
          email: user.email,
          contact: user.user_metadata?.phone
        },
        theme: config.razorpay.theme
      };

      console.log('Initializing Razorpay with options:', options);
      const razorpay = new Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    {items.map((item) => {
                      const experience = cachedExperiences[item.experienceId];
                      if (!experience) return null;

                      return (
                        <div key={item.experienceId} className="flex justify-between items-center">
                          <div>
                            <h3 className="text-gray-900 dark:text-white">{experience.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <span className="text-gray-900 dark:text-white">
                            ₹{experience.price * item.quantity}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-900 dark:text-white">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                        <span className="text-gray-900 dark:text-white">
                          ₹{Math.round(totalPrice * 0.18)}
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-gray-900 dark:text-white">
                          ₹{totalPrice + Math.round(totalPrice * 0.18)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Payment</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Complete your purchase using Razorpay secure payment gateway
                  </p>
                  <Button
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 