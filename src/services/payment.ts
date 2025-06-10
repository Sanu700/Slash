import { supabase } from '@/lib/supabase';
import { BookingFormData } from '@/types/booking';

// Load Razorpay script
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
}

export const createOrder = async (bookingData: BookingFormData): Promise<CreateOrderResponse> => {
  try {
    // First, create a booking record in pending state
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          experience_id: bookingData.experienceId,
          user_id: bookingData.userId,
          date: bookingData.date,
          number_of_participants: bookingData.numberOfParticipants,
          status: 'pending',
          payment_status: 'pending',
          total_price: bookingData.totalPrice,
          special_requests: bookingData.specialRequests,
        },
      ])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Call your backend to create a Razorpay order
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bookingId: booking.id,
        amount: bookingData.totalPrice,
        currency: 'INR',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const orderData = await response.json();
    return orderData;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const initiatePayment = async (bookingData: BookingFormData) => {
  try {
    // Load Razorpay script
    await loadRazorpay();

    // Create order
    const order = await createOrder(bookingData);

    // Initialize Razorpay
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Slash Experiences',
      description: 'Experience Booking',
      order_id: order.orderId,
      handler: async (response: any) => {
        try {
          // Verify payment on your backend
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (!verifyResponse.ok) {
            throw new Error('Payment verification failed');
          }

          // Update booking status
          const { error: updateError } = await supabase
            .from('bookings')
            .update({
              status: 'confirmed',
              payment_status: 'completed',
              payment_id: response.razorpay_payment_id,
            })
            .eq('id', bookingData.bookingId);

          if (updateError) throw updateError;

          // Trigger webhook for partner/vendor
          await fetch('/api/trigger-partner-webhook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingId: bookingData.bookingId,
              status: 'confirmed',
            }),
          });

          return { success: true };
        } catch (error) {
          console.error('Payment verification error:', error);
          return { success: false, error };
        }
      },
      prefill: {
        name: `${bookingData.firstName} ${bookingData.lastName}`,
        email: bookingData.email,
        contact: bookingData.phone,
      },
      theme: {
        color: '#6366f1',
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};

export const handlePaymentFailure = async (bookingId: string) => {
  try {
    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_status: 'failed',
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Payment failure handling error:', error);
    throw error;
  }
}; 