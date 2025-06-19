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
import { format } from 'date-fns';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, cachedExperiences, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect away if the cart is empty
  useEffect(() => {
    if (items.length === 0) navigate('/experiences');
  }, [items, navigate]);

  // Dynamically load Razorpay's checkout.js
  const loadRazorpaySdk = (): Promise<typeof window.Razorpay> =>
    new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve(window.Razorpay);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload  = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Razorpay SDK failed to load')));
      script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed with payment.",
        variant: "destructive",
      });
      return;
    }

    // Sanity-check your key
    if (!config.razorpay.keyId) {
      toast({
        title: "Payment Error",
        description: "Razorpay key is not configured. Check your .env.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1) Calculate amount (in paise)
      const subtotal     = totalPrice;
      const taxAmount    = Math.round(subtotal * 0.18);
      const finalAmount  = (subtotal + taxAmount) * 100; // paise

      // 2) Create an order via your Supabase Edge Function
      const { data: order, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: finalAmount, currency: config.razorpay.currency }
      });
      if (orderError) throw orderError;
      if (!order?.id) throw new Error('Invalid order response');

      // 3) Load SDK & open checkout
      const Razorpay = await loadRazorpaySdk();
      const options = {
        key:        config.razorpay.keyId,
        amount:     finalAmount,
        currency:   config.razorpay.currency,
        name:       config.razorpay.name,
        description:config.razorpay.description,
        order_id:   order.id,
        theme:      { color: config.razorpay.theme.color },
        prefill: {
          name:    user.user_metadata?.full_name || '',
          email:   user.email || '',
          contact: user.user_metadata?.phone || ''
        },
        handler: async (res: any) => {
          try {
            // 4) Verify payment server-side
            const { error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_order_id:   res.razorpay_order_id,
                razorpay_signature:  res.razorpay_signature,
                user_id:             user.id,
                cart_items: {
                  total_amount: (subtotal + taxAmount),
                  items
                }
              }
            });
            if (verifyError) throw verifyError;

            // 5) Insert bookings into your table
            const { error: bookingError } = await supabase
              .from('bookings')
              .insert(items.map(item => {
                const exp = cachedExperiences[item.experienceId]!;
                return {
                  user_id:       user.id,
                  experience_id: item.experienceId,
                  quantity:      item.quantity,
                  total_amount:  exp.price * item.quantity,
                  payment_id:    res.razorpay_payment_id,
                  status:        'confirmed'
                };
              }));
            if (bookingError) throw bookingError;

            toast({ description: "Your experience has been booked successfully!" });
            clearCart();
            navigate('/profile');
          } catch (err: any) {
            console.error('Post-payment error:', err);
            toast({
              variant: "destructive",
              title: "Payment Processing Error",
              description: err.message || "Something went wrong after payment. Contact support.",
            });
          }
        },
        modal: {
          ondismiss: () => toast({ description: "Payment cancelled" })
        }
      };

      new Razorpay(options).open();
    } catch (err: any) {
      console.error('Payment init error:', err);
      toast({
        variant: "destructive",
        title: "Payment Initialization Failed",
        description: err.message || "Could not start payment. Try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* …your existing empty-cart guard, map over items, summary, etc… */}

      {/* Replace your <RazorpayPayment> with a plain button: */}
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full mt-4"
      >
        {isLoading ? 'Processing…' : 'Proceed to Payment'}
      </Button>
    </div>
  );
};

export default Cart;
