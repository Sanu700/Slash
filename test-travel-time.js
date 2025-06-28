import fetch from 'node-fetch';

async function testTravelTime() {
  const apiKey = '5b3ce3597851110001cf6248a8b5672fb44148a89cc73498624eae7b';
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}`;
  
  // Test coordinates: Bangalore center to a nearby point
  const body = {
    coordinates: [
      [77.6226, 12.9881567], // Bangalore center
      [77.6326, 12.9981567]  // Nearby point
    ]
  };
  
  try {
    console.log('Testing OpenRouteService API...');
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey
      },
      body: JSON.stringify(body)
    });
    
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API Error:', errorText);
      return;
    }
    
    const data = await res.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    const seconds = data.features?.[0]?.properties?.summary?.duration;
    if (seconds) {
      const minutes = Math.round(seconds / 60);
      console.log(`Travel time: ${minutes} minutes`);
    } else {
      console.log('No travel time found in response');
    }
    
  } catch (e) {
    console.error('Error testing API:', e);
  }
}

testTravelTime(); 