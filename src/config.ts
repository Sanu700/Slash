console.log('🚀 import.meta.env →', import.meta.env);
console.log('🔑 VITE_RAZORPAY_KEY →', import.meta.env.VITE_RAZORPAY_KEY);

interface Config {
  supabase: {
    url: string;
    key: string;
  };
  razorpay: {
    keyId: string;
    keySecret: string;
    currency: string;
    name: string;
    description: string;
    theme: {
      color: string;
    };
  };
}

// Development credentials (only used if environment variables are not set)
const DEV_CREDENTIALS = {
  url: 'https://your-dev-supabase-url.supabase.co',
  key: 'your-dev-supabase-key'
};

export const config: Config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || DEV_CREDENTIALS.url,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY || DEV_CREDENTIALS.key
  },
  razorpay: {
    keyId: import.meta.env.VITE_RAZORPAY_KEY || '',
    keySecret: '',
    currency: 'INR',
    name: 'Slash Experiences',
    description: 'Complete your booking',
    theme: {
      color: '#F37254'
    }
  }
};