import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { config } from '@/config';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Users, Clock, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, cachedExperiences, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (items.length === 0) {
      navigate('/experiences');
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
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error('Razorpay SDK failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with payment.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);

      // Create order on your backend
      const { data: order, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { 
          amount: Math.round(totalPrice * 100), // Ensure amount is in paise and is an integer
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
        amount: order.amount,
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
                razorpay_signature: response.razorpay_signature
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
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          contact: user.user_metadata?.phone || ''
        },
        theme: {
          color: "#000000"
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
      console.error('Payment initialization error:', error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error.message || "There was an error initializing the payment. Please try again",
      });
    } finally {
      setIsLoading(false);
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

                // Time options (example: 9:00 AM to 8:00 PM every hour)
                const timeOptions = Array.from({ length: 12 }, (_, i) => {
                  const hour = 9 + i;
                  const label = `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
                  return { value: `${hour}:00`, label };
                });

                // State for popover
                const [showDatePopover, setShowDatePopover] = useState(false);

                return (
                  <Card key={item.experienceId} className="overflow-hidden">
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
                          <div className="space-y-4">
                            {/* Date Picker */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Select Date</span>
                              </div>
                              <Popover open={showDatePopover} onOpenChange={setShowDatePopover}>
                                <PopoverTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setShowDatePopover(true)}
                                  >
                                    {item.selectedDate ? format(new Date(item.selectedDate), 'PPP') : 'Choose Date'}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent align="end" className="w-auto p-0">
                                  <Calendar
                                    mode="single"
                                    selected={item.selectedDate ? new Date(item.selectedDate) : undefined}
                                    onSelect={date => {
                                      updateQuantity(item.experienceId, item.quantity, date, item.selectedTime);
                                      setShowDatePopover(false);
                                    }}
                                    initialFocus
                                    disabled={date => date < new Date(new Date().setHours(0,0,0,0))}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                            {/* Time Picker */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Select Time</span>
                              </div>
                              <Select
                                value={item.selectedTime || ''}
                                onValueChange={time => updateQuantity(item.experienceId, item.quantity, item.selectedDate, time)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {timeOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {/* Guests (Quantity) */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-sm">Number of People</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateQuantity(item.experienceId, Math.max(1, item.quantity - 1), item.selectedDate, item.selectedTime)}
                                  className="p-1 rounded-full hover:bg-secondary"
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateQuantity(item.experienceId, item.quantity + 1, item.selectedDate, item.selectedTime)}
                                  className="p-1 rounded-full hover:bg-secondary"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 justify-between mt-4">
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
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Taxes</span>
                      <span>₹{Math.round(totalPrice * 0.18)}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white">
                        <span>Total</span>
                        <span>₹{totalPrice + Math.round(totalPrice * 0.18)}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-6" 
                      onClick={handlePayment} 
                      disabled={isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Proceed to Payment'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

