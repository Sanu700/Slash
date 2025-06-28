import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoordinates() {
  try {
    // First, let's see what columns exist in the experiences table
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Sample experience record structure:');
    console.log(JSON.stringify(data[0], null, 2));
    
    console.log('\nChecking for latitude/longitude fields:');
    if (data[0]) {
      const hasLat = 'latitude' in data[0];
      const hasLng = 'longitude' in data[0];
      console.log(`Has latitude field: ${hasLat}`);
      console.log(`Has longitude field: ${hasLng}`);
      
      if (hasLat && hasLng) {
        console.log(`Sample latitude: ${data[0].latitude}`);
        console.log(`Sample longitude: ${data[0].longitude}`);
      }
    }
    
    // Check all experiences for coordinates
    const { data: allData, error: allError } = await supabase
      .from('experiences')
      .select('id, title, location, latitude, longitude');
    
    if (allError) {
      console.error('Error fetching all experiences:', allError);
      return;
    }
    
    console.log('\nCoordinate analysis:');
    const withCoords = allData.filter(exp => exp.latitude && exp.longitude);
    const withoutCoords = allData.filter(exp => !exp.latitude || !exp.longitude);
    
    console.log(`Experiences with coordinates: ${withCoords.length}`);
    console.log(`Experiences without coordinates: ${withoutCoords.length}`);
    
    if (withCoords.length > 0) {
      console.log('\nSample experiences with coordinates:');
      withCoords.slice(0, 3).forEach(exp => {
        console.log(`- ${exp.title} (${exp.location}): ${exp.latitude}, ${exp.longitude}`);
      });
    }
    
    if (withoutCoords.length > 0) {
      console.log('\nSample experiences without coordinates:');
      withoutCoords.slice(0, 3).forEach(exp => {
        console.log(`- ${exp.title} (${exp.location}): No coordinates`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkCoordinates(); 