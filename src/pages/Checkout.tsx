import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '../lib/supabase';
import { config } from '@/config';

interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

interface CartItem {
  id: string;
  experienceId: string;
  quantity: number;
  price: number;
  experience?: {
    title: string;
    price: number;
  };
}

const Checkout = () => {
  const { items, totalPrice, cachedExperiences, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const loadRazorpaySdk = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(window.Razorpay);
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        description: "Please sign in to complete your purchase",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Calculate total amount with tax
      const totalAmountWithTax = Math.round((totalPrice + Math.round(totalPrice * 0.18)) * 100);

      // Create order on your backend
      const { data: order, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { 
          amount: totalAmountWithTax,
          currency: config.razorpay.currency 
        }
      });

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      if (!order || !order.id) {
        throw new Error('Invalid order response from server');
      }

      const Razorpay = await loadRazorpaySdk();
      
      const options = {
        key: config.razorpay.keyId,
        amount: totalAmountWithTax,
        currency: order.currency,
        name: config.razorpay.name,
        description: config.razorpay.description,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment on your backend
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user.id,
                cart_items: {
                  total_amount: totalAmountWithTax / 100,
                  items: items
                }
              }
            });

            if (verifyError) {
              console.error('Payment verification error:', verifyError);
              throw new Error(`Payment verification failed: ${verifyError.message}`);
            }

            // Create booking records
            const { error: bookingError } = await supabase
              .from('bookings')
              .insert(
                items.map(item => {
                  const experience = cachedExperiences[item.experienceId];
                  return {
                    user_id: user.id,
                    experience_id: item.experienceId,
                    quantity: item.quantity,
                    total_amount: experience?.price ? experience.price * item.quantity : 0,
                    payment_id: response.razorpay_payment_id,
                    status: 'confirmed'
                  };
                })
              );

            if (bookingError) {
              console.error('Booking creation error:', bookingError);
              throw new Error(`Failed to create booking: ${bookingError.message}`);
            }

            toast({
              description: "Your experience has been booked successfully",
            });
            clearCart();
            navigate('/profile');
          } catch (error: any) {
            console.error('Payment processing error:', error);
            toast({
              variant: "destructive",
              title: "Payment Processing Error",
              description: error.message || "There was an error processing your payment. Please contact support",
            });
          }
        },
        prefill: {
          name: (user.user_metadata as UserMetadata)?.full_name || '',
          email: user.email || '',
          contact: (user.user_metadata as UserMetadata)?.phone || ''
        },
        theme: {
          color: config.razorpay.theme.color
        },
        modal: {
          ondismiss: function() {
            toast({
              description: "Payment cancelled",
            });
          }
        }
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "There was an error processing your payment. Please try again",
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
                            <p className="font-medium">{experience.title}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium">₹{experience.price * item.quantity}</p>
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