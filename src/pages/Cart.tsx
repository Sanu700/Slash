// src/pages/Cart.tsx
import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { config } from '@/config';
import { format } from 'date-fns';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, cachedExperiences, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpaySdk = (): Promise<typeof window.Razorpay> =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(window.Razorpay);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () =>
        window.Razorpay ? resolve(window.Razorpay) : reject(new Error('SDK load failed'));
      script.onerror = () => reject(new Error('SDK load failed'));
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please sign in to proceed.', variant: 'destructive' });
      return;
    }
    if (!config.razorpay.keyId) {
      toast({ title: 'Payment Error', description: 'Razorpay key missing. Check .env.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    try {
      const subtotal = totalPrice;
      const taxAmount = Math.round(subtotal * 0.18);
      const finalAmount = (subtotal + taxAmount) * 100;

      // Create Razorpay order via Edge Function
      const { data: order, error: orderError } = await supabase.functions.invoke(
        'create-razorpay-order',
        { body: { amount: finalAmount, currency: config.razorpay.currency } }
      );
      if (orderError) throw orderError;
      if (!order?.id) throw new Error('Invalid order response');

      // Load Razorpay SDK
      const Razorpay = await loadRazorpaySdk();

      // Configure checkout options
      const options = {
        key: config.razorpay.keyId,
        amount: finalAmount,
        currency: config.razorpay.currency,
        name: config.razorpay.name,
        description: config.razorpay.description,
        order_id: order.id,
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
          contact: user.user_metadata?.phone || '',
        },
        theme: config.razorpay.theme,
        handler: async (response: any) => {
          try {
            const { data: booking, error: bookingErr } = await supabase
              .from('bookings')
              .insert({
                user_id: user.id,
                total_amount: subtotal + taxAmount,
                status: 'confirmed',
                payment_method: 'razorpay',
              })
              .select('id')
              .single();
            if (bookingErr) throw bookingErr;

            const { error: itemsErr } = await supabase
              .from('booking_items')
              .insert(
                items.map((item) => ({
                  booking_id: booking.id,
                  experience_id: item.experienceId,
                  quantity: item.quantity,
                  price_at_booking: cachedExperiences[item.experienceId]?.price,
                }))
              );
            if (itemsErr) throw itemsErr;

            clearCart({ silent: true });
            toast({
              title: 'Payment Successful',
              description: 'Your payment was successful! Thank you for your purchase.',
              variant: 'success',
            });
            navigate('/profile');
          } catch (err: any) {
            console.error('Payment processing error:', err);
            toast({
              variant: 'destructive',
              title: 'Payment Processing Error',
              description: err.message,
            });
          }
        },
        modal: {
          ondismiss: () => toast({ title: 'Payment Cancelled', description: 'You cancelled the payment.', variant: 'warning' }),
        },
      };

      new Razorpay(options).open();
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      toast({
        title: 'Payment Error',
        description: err.message,
        variant: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const exp = cachedExperiences[item.experienceId];
                if (!exp) return null;
                return (
                  <Card key={item.experienceId} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <img src={exp.imageUrl} alt={exp.title} className="w-24 h-24 object-cover rounded-lg" />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{exp.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{exp.location}</p>
                          {item.selectedDate && <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Date: {format(item.selectedDate, 'PPP')}</p>}
                          <div className="flex items-center gap-2 mb-4">
                            <Button variant="outline" size="sm" disabled={item.quantity <= 1} onClick={() => updateQuantity(item.experienceId, item.quantity - 1)}>–</Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => updateQuantity(item.experienceId, item.quantity + 1)}>+</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">₹{exp.price * item.quantity}</span>
                            <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.experienceId)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Subtotal</span><span>₹{totalPrice}</span></div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400"><span>Taxes (18%)</span><span>₹{Math.round(totalPrice * 0.18)}</span></div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-white"><span>Total</span><span>₹{totalPrice + Math.round(totalPrice * 0.18)}</span></div>
                    </div>
                    <Button onClick={handlePayment} disabled={isLoading} className="w-full mt-6">
                      {isLoading ? 'Processing…' : 'Proceed to Payment'}
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
