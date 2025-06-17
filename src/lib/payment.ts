import Razorpay from 'razorpay';

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
    // Convert the secret key to a Uint8Array
    const encoder = new TextEncoder();
    const keyData = encoder.encode(process.env.RAZORPAY_KEY_SECRET || '');
    
    // Import the key
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    // Create the message
    const message = `${razorpay_order_id}|${razorpay_payment_id}`;
    const messageData = encoder.encode(message);

    // Sign the message
    const signature = await crypto.subtle.sign(
      'HMAC',
      key,
      messageData
    );

    // Convert the signature to hex
    const generated_signature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    return generated_signature === razorpay_signature;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 