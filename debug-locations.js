import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugLocations() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('location, title')
      .order('location');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('All unique locations:');
    const uniqueLocations = [...new Set(data.map(item => item.location))];
    uniqueLocations.forEach(location => {
      const count = data.filter(item => item.location === location).length;
      console.log(`"${location}" - ${count} experiences`);
    });
    
    console.log('\nBangalore experiences:');
    const bangaloreExps = data.filter(item => 
      item.location && item.location.toLowerCase().includes('bangalore')
    );
    bangaloreExps.forEach(exp => {
      console.log(`- ${exp.title} (${exp.location})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugLocations(); 