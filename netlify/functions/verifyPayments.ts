import { Handler } from '@netlify/functions';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, user_id, cart_items } = JSON.parse(event.body || '{}');
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    // Store payment details in the database
    const { data: paymentData, error: paymentError } = await supabase
      .from('payments')
      .insert({
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        user_id: user_id,
        status: 'success',
        amount: cart_items.total_amount,
        items: cart_items.items,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error storing payment details:', paymentError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to store payment details' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        verified: true,
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id
      }),
    };
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};