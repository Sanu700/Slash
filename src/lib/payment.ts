// Removed Razorpay import and usage. This file should only contain client-side logic and API calls to your backend for payment creation/verification.

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
    const response = await fetch('/api/payment/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(details),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
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
    const response = await fetch('/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data.verified;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}; 