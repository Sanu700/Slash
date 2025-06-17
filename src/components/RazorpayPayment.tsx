import React, { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/auth';
import { createPayment } from '@/lib/payment';
import { toast } from 'sonner';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayPaymentProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  onSuccess,
  onError,
}) => {
  const { totalPrice, checkout } = useCart();
  const { user } = useAuth();

  const initializePayment = async () => {
    try {
      if (!user) {
        toast.error('Please login to proceed with payment');
        return;
      }

      const order = await createPayment({
        amount: totalPrice,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        notes: {
          booking_id: `booking_${Date.now()}`,
          user_id: user.id,
        },
      });

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount: Number(order.amount),
        currency: order.currency,
        name: 'Slash Experiences',
        description: 'Experience Booking Payment',
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            // Handle successful payment
            const success = await checkout();
            if (success) {
              toast.success('Payment successful!');
              onSuccess?.();
            } else {
              toast.error('Payment successful but booking failed');
              onError?.(new Error('Booking failed'));
            }
          } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Error processing payment');
            onError?.(error);
          }
        },
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#6366f1',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Error initializing payment');
      onError?.(error);
    }
  };

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <button
      onClick={initializePayment}
      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
    >
      Proceed to Payment
    </button>
  );
}; 