// supabase/functions/create-razorpay-order/index.ts
// — no more sift import! 👇
// @ts-nocheck

// supabase/functions/create-razorpay-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Razorpay from "npm:razorpay";

const razorpayKeyId     = Deno.env.get("RAZORPAY_KEY_ID")!;
const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

serve(async (req: Request) => {
  // 1) CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS });
  }

  try {
    // 2) Read amount+currency from POST body
    const { amount, currency } = await req.json();

    const razorpay = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    const order = await razorpay.orders.create({ amount, currency });

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS },
    });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Unknown error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS } }
    );
  }
});
