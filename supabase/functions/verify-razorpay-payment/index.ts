// supabase/functions/verify-razorpay-payment/index.ts
// @ts-nocheck
// supabase/functions/verify-razorpay-payment/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Razorpay from 'npm:razorpay'

// Initialize Razorpay with your env vars (set these in your Supabase dashboard)
const razor = new Razorpay({
  key_id:     Deno.env.get('RAZORPAY_KEY_ID')!,
  key_secret: Deno.env.get('RAZORPAY_KEY_SECRET')!
})

// Helper to build CORS headers for the incoming origin
// … up top …
function corsHeaders(origin: string) {
  return {
    'Access-Control-Allow-Origin':      origin,
    'Access-Control-Allow-Methods':     'POST, OPTIONS',
    // allow Content-Type, Authorization plus apikey & x-client-info
    'Access-Control-Allow-Headers':     'Content-Type, Authorization, apikey, x-client-info',
    'Access-Control-Max-Age':           '3600',
  }
}

serve(async (req) => {
  const origin = req.headers.get('origin') || '*'

  // handle the OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(origin),
    })
  }

  // now POST-only
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders(origin),
    })
  }

  try {
    // … your JSON parsing and razorpay.utils.verifyPaymentSignature() …
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        ...corsHeaders(origin),
        'Content-Type': 'application/json',
      }
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: {
        ...corsHeaders(origin),
        'Content-Type': 'application/json',
      }
    })
  }
})
