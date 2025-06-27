const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjM3MTk2MSwiZXhwIjoyMDU3OTQ3OTYxfQ.ilEAYM-uCeRDQ8lYAqeiJRLPIR7jeo8-DU4RxcdQt10';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url, {
    headers: { 'User-Agent': 'YourAppName/1.0 (your@email.com)' }
  });
  const data = await response.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }
  return null;
}

async function main() {
  // Fetch all cooking experiences (case-insensitive)
  const { data: experiences, error } = await supabase
    .from('experiences')
    .select('id, location, latitude, longitude, category')
    .ilike('category', '%cooking%');

  if (error) {
    console.error('Error fetching experiences:', error);
    return;
  }

  for (const exp of experiences) {
    if (exp.latitude && exp.longitude) {
      console.log(`Skipping ${exp.id} (already has coordinates)`);
      continue;
    }
    if (!exp.location) {
      console.log(`Skipping ${exp.id} (no location)`);
      continue;
    }
    console.log(`Geocoding: ${exp.location}`);
    const coords = await geocodeAddress(exp.location);
    if (coords) {
      // 2. Update the experience with coordinates
      const { error: updateError } = await supabase
        .from('experiences')
        .update({ latitude: coords.lat, longitude: coords.lng })
        .eq('id', exp.id);
      if (updateError) {
        console.error(`Error updating ${exp.id}:`, updateError);
      } else {
        console.log(`Updated ${exp.id} with lat=${coords.lat}, lng=${coords.lng}`);
      }
    } else {
      console.log(`Could not geocode: ${exp.location}`);
    }
    // Be nice to Nominatim: 1 request per second
    await new Promise(res => setTimeout(res, 1000));
  }
  console.log('Done!');
}

main(); 