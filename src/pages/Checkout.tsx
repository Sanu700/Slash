import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

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

  const loadRazorpaySdk = () =>
    new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to proceed with payment');
      return;
    }

    setIsLoading(true);
    let order: any = null;
    try {
      // Load Razorpay SDK
      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded) {
        throw new Error('Could not load Razorpay SDK');
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          total_amount: totalPrice + Math.round(totalPrice * 0.18),
          status: 'pending',
          booking_date: new Date().toISOString(),
          payment_method: 'razorpay'
        })
        .select()
        .single();

      if (orderError) throw orderError;
      order = orderData;

      // Create booking items
      const { error: itemsError } = await supabase
        .from('booking_items')
        .insert(
          items.map(item => ({
            booking_id: order.id,
            experience_id: item.experienceId,
            quantity: item.quantity,
            price_at_booking: cachedExperiences[item.experienceId]?.price || 0
          }))
        );

      if (itemsError) throw itemsError;

      // Configure Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.total_amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Slash Experiences',
        description: 'Complete your booking',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { error: verifyError } = await supabase
              .from('bookings')
              .update({
                status: 'completed',
                payment_method: 'razorpay',
                notes: `Payment ID: ${response.razorpay_payment_id}`
              })
              .eq('id', order.id);

            if (verifyError) throw verifyError;

            // Clear cart and show success
            await clearCart();
            toast.success('Payment successful!');
            navigate('/');
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed. Please contact support.');
            // Update booking status to failed
            await supabase
              .from('bookings')
              .update({
                status: 'failed',
                notes: 'Payment verification failed'
              })
              .eq('id', order.id);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || 'Customer',
          email: user.email || '',
        },
        theme: {
          color: '#F37254',
        },
        modal: {
          ondismiss: async () => {
            // Update booking status to cancelled
            await supabase
              .from('bookings')
              .update({
                status: 'cancelled',
                notes: 'Payment cancelled by user'
              })
              .eq('id', order.id);
            toast.error('Payment cancelled');
          }
        }
      };

      // Open Razorpay
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async (response: any) => {
        // Update booking status to failed
        await supabase
          .from('bookings')
          .update({
            status: 'failed',
            notes: `Payment failed: ${response.error.description}`
          })
          .eq('id', order.id);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment. Please try again.');
      // Update booking status to failed if it exists
      if (order?.id) {
        await supabase
          .from('bookings')
          .update({
            status: 'failed',
            notes: 'Payment initiation failed'
          })
          .eq('id', order.id);
      }
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