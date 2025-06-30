const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCoordinates() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('id, title, location, latitude, longitude')
      .order('location');
    
    if (error) throw error;
    
    console.log('Checking coordinates for all experiences:');
    console.log('==========================================');
    
    // Group by location to see if all experiences in same city have same coordinates
    const locationGroups = {};
    
    data.forEach(exp => {
      if (!locationGroups[exp.location]) {
        locationGroups[exp.location] = [];
      }
      locationGroups[exp.location].push(exp);
    });
    
    Object.keys(locationGroups).forEach(location => {
      const experiences = locationGroups[location];
      console.log(`\n📍 ${location} (${experiences.length} experiences):`);
      
      const uniqueCoords = new Set();
      experiences.forEach(exp => {
        const coord = `${exp.latitude}, ${exp.longitude}`;
        uniqueCoords.add(coord);
        console.log(`  - ${exp.title}: ${coord}`);
      });
      
      if (uniqueCoords.size === 1) {
        console.log(`  ❌ PROBLEM: All ${experiences.length} experiences have the same coordinates!`);
      } else {
        console.log(`  ✅ GOOD: ${uniqueCoords.size} different coordinate sets`);
      }
    });
    
    console.log('\n==========================================');
    console.log('Summary:');
    console.log(`Total experiences: ${data.length}`);
    console.log(`Total locations: ${Object.keys(locationGroups).length}`);
    
    const problematicLocations = Object.keys(locationGroups).filter(location => {
      const experiences = locationGroups[location];
      const uniqueCoords = new Set();
      experiences.forEach(exp => {
        uniqueCoords.add(`${exp.latitude}, ${exp.longitude}`);
      });
      return uniqueCoords.size === 1;
    });
    
    if (problematicLocations.length > 0) {
      console.log(`\n❌ Problematic locations (all experiences have same coordinates):`);
      problematicLocations.forEach(location => {
        console.log(`  - ${location}`);
      });
    } else {
      console.log('\n✅ All locations have varied coordinates!');
    }
    
  } catch (error) {
    console.error('Error checking coordinates:', error);
  }
}

checkCoordinates(); 