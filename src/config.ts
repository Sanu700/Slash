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
  google: {
    clientId: string;
    clientSecret: string;
  };
}

// Development credentials (only used if environment variables are not set)
const DEV_CREDENTIALS = {
  url: 'https://ceqpdprcqhmkqdbgmmkn.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0'
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
  },
  google: {
    clientId: '630365428319-iujdl046niv4hec0asllb3mcsluq9j3u.apps.googleusercontent.com',
    clientSecret: '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'
  }
};