import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export interface PaymentDetails {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    booking_id: string;
    user_id: string;
  };
}

export const createPayment = async (details: PaymentDetails) => {
  try {
    const order = await razorpay.orders.create({
      amount: details.amount * 100, // Razorpay expects amount in paise
      currency: details.currency,
      receipt: details.receipt,
      notes: details.notes,
    });

    return order;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const verifyPayment = async (
  razorpay_payment_id: string,
  razorpay_order_id: string,
  razorpay_signature: string
) => {
  try {
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 