import { supabase } from '@/lib/supabase';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
  key_secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req: any, res: any) => {
  try {
    const { bookingId, amount, currency } = req.body;

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `booking_${bookingId}`,
    });

    // Update booking with order ID
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_order_id: order.id,
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

export const verifyPayment = async (req: any, res: any) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    // Verify payment signature
    const generated_signature = crypto
      .createHmac('sha256', import.meta.env.VITE_RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      throw new Error('Invalid payment signature');
    }

    // Get booking from order ID
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('payment_order_id', razorpay_order_id)
      .single();

    if (bookingError) throw bookingError;

    // Update booking status
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
        payment_status: 'completed',
        payment_id: razorpay_payment_id,
      })
      .eq('id', booking.id);

    if (updateError) throw updateError;

    // Trigger webhook for partner/vendor
    await triggerPartnerWebhook(booking);

    res.json({ success: true });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
};

const triggerPartnerWebhook = async (booking: any) => {
  try {
    // Get experience details
    const { data: experience, error: experienceError } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', booking.experience_id)
      .single();

    if (experienceError) throw experienceError;

    // If experience has a webhook URL, trigger it
    if (experience.webhook_url) {
      await fetch(experience.webhook_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          booking_id: booking.id,
          experience_id: booking.experience_id,
          date: booking.date,
          number_of_participants: booking.number_of_participants,
          status: 'confirmed',
        }),
      });
    }
  } catch (error) {
    console.error('Error triggering partner webhook:', error);
    // Don't throw error as webhook failure shouldn't affect the booking
  }
}; 