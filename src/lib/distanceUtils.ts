// Distance and travel time calculation utilities
export interface Location {
  lat: number;
  lng: number;
}

export interface TravelInfo {
  distance: number; // in km
  duration: number; // in minutes
  mode: 'driving' | 'walking' | 'cycling' | 'transit';
}

// Haversine formula for straight-line distance (fallback)
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// OpenRouteService API for accurate distance and time
export async function getTravelInfo(
  from: Location,
  to: Location,
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<TravelInfo | null> {
  try {
    // You'll need to sign up for a free API key at https://openrouteservice.org/sign-up/
    const API_KEY = import.meta.env.VITE_OPENROUTE_API_KEY;
    
    if (!API_KEY) {
      // Fallback to Haversine calculation
      const distance = calculateHaversineDistance(from.lat, from.lng, to.lat, to.lng);
      const estimatedTime = mode === 'driving' ? distance * 2 : mode === 'walking' ? distance * 15 : distance * 5;
      
      return {
        distance: Math.round(distance * 10) / 10,
        duration: Math.round(estimatedTime),
        mode
      };
    }

    const profile = mode === 'driving' ? 'driving-car' : mode === 'walking' ? 'foot-walking' : 'cycling-regular';
    
    const response = await fetch(`https://api.openrouteservice.org/v2/matrix/driving-car`, {
      method: 'POST',
      headers: {
        'Authorization': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locations: [[from.lng, from.lat], [to.lng, to.lat]],
        metrics: ['distance', 'duration'],
        units: 'km'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch travel info');
    }

    const data = await response.json();
    
    return {
      distance: Math.round(data.distances[0][1] * 10) / 10,
      duration: Math.round(data.durations[0][1] / 60), // Convert seconds to minutes
      mode
    };
  } catch (error) {
    console.error('Error fetching travel info:', error);
    // Fallback to Haversine
    const distance = calculateHaversineDistance(from.lat, from.lng, to.lat, to.lng);
    const estimatedTime = mode === 'driving' ? distance * 2 : mode === 'walking' ? distance * 15 : distance * 5;
    
    return {
      distance: Math.round(distance * 10) / 10,
      duration: Math.round(estimatedTime),
      mode
    };
  }
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
}

// Format duration for display
export function formatDuration(duration: number): string {
  if (duration < 60) {
    return `${duration}min`;
  }
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
}

// Get user's current location
export function getUserLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
} 