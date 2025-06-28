import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

const supabaseUrl = 'https://ceqpdprcqhmkqdbgmmkn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcXBkcHJjcWhta3FkYmdtbWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNzE5NjEsImV4cCI6MjA1Nzk0Nzk2MX0.Fubqn2A_YL6gWUQDwCYgPxpAX7L-cztoT88jZ6ChmP0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'slash2-geocoder/1.0' }
  });
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon)
    };
  }
  return null;
}

async function main() {
  const { data, error } = await supabase
    .from('experiences')
    .select('id, location, latitude, longitude')
    .is('latitude', null)
    .is('longitude', null);

  if (error) {
    console.error('Error fetching experiences:', error);
    return;
  }

  for (const exp of data) {
    if (!exp.location) continue;
    console.log(`Geocoding: ${exp.location}`);
    const coords = await geocodeLocation(exp.location);
    if (coords) {
      const { error: updateError } = await supabase
        .from('experiences')
        .update({ latitude: coords.lat, longitude: coords.lon })
        .eq('id', exp.id);
      if (updateError) {
        console.error(`Failed to update ${exp.location}:`, updateError);
      } else {
        console.log(`Updated ${exp.location}: ${coords.lat}, ${coords.lon}`);
      }
    } else {
      console.warn(`Could not geocode: ${exp.location}`);
    }
    // Nominatim rate limit: 1 request/sec
    await new Promise(r => setTimeout(r, 1100));
  }
  console.log('Geocoding complete.');
}

main(); 