// Script to add coordinates to existing experiences for testing
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Delhi coordinates
const delhiCoords = {
  latitude: 28.7041,
  longitude: 77.1025
};

// Mumbai coordinates
const mumbaiCoords = {
  latitude: 19.0760,
  longitude: 72.8777
};

// Bangalore coordinates
const bangaloreCoords = {
  latitude: 12.9716,
  longitude: 77.5946
};

// Test coordinates for different experiences
const testCoordinates = [
  // Delhi experiences
  { location: 'Delhi', ...delhiCoords },
  { location: 'New Delhi', ...delhiCoords },
  { location: 'Delhi, India', ...delhiCoords },
  
  // Mumbai experiences
  { location: 'Mumbai', ...mumbaiCoords },
  { location: 'Bombay', ...mumbaiCoords },
  
  // Bangalore experiences
  { location: 'Bangalore', ...bangaloreCoords },
  { location: 'Bengaluru', ...bangaloreCoords },
];

async function addCoordinatesToExperiences() {
  try {
    // First, let's see what experiences we have
    const { data: experiences, error: fetchError } = await supabase
      .from('experiences')
      .select('id, title, location, latitude, longitude');
    
    if (fetchError) {
      console.error('Error fetching experiences:', fetchError);
      return;
    }
    
    console.log('Found', experiences.length, 'experiences');
    
    // Update experiences with coordinates based on their location
    for (const experience of experiences) {
      let coords = null;
      
      // Find matching coordinates based on location
      for (const testCoord of testCoordinates) {
        if (experience.location && 
            experience.location.toLowerCase().includes(testCoord.location.toLowerCase())) {
          coords = testCoord;
          break;
        }
      }
      
      if (coords && (!experience.latitude || !experience.longitude)) {
        console.log(`Updating ${experience.title} (${experience.location}) with coordinates:`, coords);
        
        const { error: updateError } = await supabase
          .from('experiences')
          .update({
            latitude: coords.latitude,
            longitude: coords.longitude
          })
          .eq('id', experience.id);
        
        if (updateError) {
          console.error(`Error updating ${experience.title}:`, updateError);
        } else {
          console.log(`Successfully updated ${experience.title}`);
        }
      } else if (experience.latitude && experience.longitude) {
        console.log(`${experience.title} already has coordinates:`, experience.latitude, experience.longitude);
      } else {
        console.log(`${experience.title} (${experience.location}) - no matching coordinates found`);
      }
    }
    
    console.log('Finished updating coordinates');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the script
addCoordinatesToExperiences(); 