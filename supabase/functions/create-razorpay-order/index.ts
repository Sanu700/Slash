// supabase/functions/create-razorpay-order/index.ts
// — no more sift import! 👇
// @ts-nocheck

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Razorpay   from "npm:razorpay";

const razorpay = new Razorpay({
  key_id:    Deno.env.get("RAZORPAY_KEY_ID")!,
  key_secret:Deno.env.get("RAZORPAY_KEY_SECRET")!
});

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": [
    "Content-Type",
    "Authorization",
    "X-Client-Info",
    "apikey"
  ].join(",")
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: CORS });
  }

  try {
    const { amount, currency } = await req.json();
    const order = await razorpay.orders.create({
      amount, currency, receipt: `rcpt_${Date.now()}`, payment_capture: 1
    });

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...CORS
      }
    });

  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...CORS
      }
    });
  }
});

