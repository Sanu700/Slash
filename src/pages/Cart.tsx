import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PaymentNotification } from '@/components/payment/PaymentNotification';
import { useAuth } from '@/lib/auth';
import { format } from 'date-fns';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, cachedExperiences, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failure'>('success');
  const [paymentMessage, setPaymentMessage] = useState('');

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
    try {
      // 0) Load the Razorpay checkout SDK
      const sdkLoaded = await loadRazorpaySdk();
      if (!sdkLoaded) {
        setPaymentStatus('failure');
        setPaymentMessage('Could not load Razorpay SDK. Please check your internet connection.');
        setShowNotification(true);
        return;
      }

      // 1) Create the order
      const response = await fetch('/.netlify/functions/createOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice + Math.round(totalPrice * 0.18), // Include tax in the amount
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Order creation failed:', errorText);
        throw new Error('Failed to create order. Please try again.');
      }

      let order;
      try {
        order = await response.json();
      } catch (e) {
        console.error('Failed to parse order response:', e);
        throw new Error('Invalid response from server');
      }

      if (!order || !order.id) {
        throw new Error('Invalid order data received');
      }

      // 2) Configure the checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Slash Experiences',
        description: 'Complete your booking',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on your backend
            const verifyResponse = await fetch('/.netlify/functions/verifyPayment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                user_id: user?.id,
                cart_items: {
                  total_amount: totalPrice + Math.round(totalPrice * 0.18),
                  items: items.map(item => ({
                    experience_id: item.experienceId,
                    quantity: item.quantity,
                    price: cachedExperiences[item.experienceId]?.price || 0
                  }))
                }
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            
            if (verifyData.verified) {
              // Clear cart and show success message
              await clearCart();
              setPaymentStatus('success');
              setPaymentMessage('Your payment has been processed successfully.');
              setShowNotification(true);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failure');
            setPaymentMessage('Payment verification failed. Please contact support.');
            setShowNotification(true);
          }
        },
        prefill: {
          name: user?.user_metadata?.full_name || 'Customer',
          email: user?.email || '',
        },
        theme: {
          color: '#F37254',
        },
      };

      // 3) Open the Razorpay popup
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Payment error:', err);
      setPaymentStatus('failure');
      setPaymentMessage(err.message || 'Payment failed. Please try again.');
      setShowNotification(true);
    }
  };

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">Add some experiences to your cart to get started!</p>
              <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cart with items
  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentNotification
        isOpen={showNotification}
        onClose={() => {
          setShowNotification(false);
          if (paymentStatus === 'success') {
            navigate('/');
          }
        }}
        status={paymentStatus}
        message={paymentMessage}
      />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const experience = cachedExperiences[item.experienceId];
                  if (!experience) return null;

                  return (
                    <Card key={item.experienceId}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={experience.imageUrl}
                            alt={experience.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{experience.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{experience.location}</p>
                            
                            {/* Date Display */}
                            {item.date && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{format(new Date(item.date), 'PPP')}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.experienceId, Math.max(1, item.quantity - 1))}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.experienceId, item.quantity + 1)}
                              >
                                +
                              </Button>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                                ₹{experience.price * item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.experienceId)}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span className="text-gray-900 dark:text-white">₹{totalPrice}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Tax (18%)</span>
                        <span className="text-gray-900 dark:text-white">₹{Math.round(totalPrice * 0.18)}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            ₹{totalPrice + Math.round(totalPrice * 0.18)}
                          </span>
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-4"
                        onClick={() => navigate('/checkout')}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

