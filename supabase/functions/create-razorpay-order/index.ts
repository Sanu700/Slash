// supabase/functions/create-razorpay-order/index.ts
// — no more sift import! 👇
// @ts-nocheck

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Razorpay from "npm:razorpay";

// Initialize Razorpay client with your secrets
const razorpay = new Razorpay({
  key_id:    Deno.env.get("RAZORPAY_KEY_ID")!,
  key_secret:Deno.env.get("RAZORPAY_KEY_SECRET")!
});

serve(async (req: Request) => {
  try {
    const { amount, currency } = await req.json();

    const order = await razorpay.orders.create({
      amount,             // in paise
      currency,           // "INR"
      receipt: `rcpt_${Date.now()}`,
      payment_capture: 1,
    });

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
