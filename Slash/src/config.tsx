// Development credentials (only used if environment variables are not set)
const DEV_CREDENTIALS = {
    url: 'https://ceqpdprcqhmkqdbgmmkn.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0'
  };
  
  export const config = {
    supabase: {
      // Use environment variables in production, fall back to dev credentials in development
      url: import.meta.env.PROD ? import.meta.env.VITE_SUPABASE_URL : DEV_CREDENTIALS.url,
      key: import.meta.env.PROD ? import.meta.env.VITE_SUPABASE_KEY : DEV_CREDENTIALS.key
    }
  };