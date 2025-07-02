import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

interface ExperienceMapProps {
  locationName: string;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const ExperienceMap: React.FC<ExperienceMapProps> = ({ locationName }) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps JS API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    if (!locationName) return;
    // Use Nominatim to geocode the location string (can be replaced with Google Geocoding API later)
    const fetchCoords = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          setError(null);
        } else {
          setError('Location not found');
        }
      } catch (err) {
        setError('Error fetching location');
      }
    };
    fetchCoords();
  }, [locationName]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!coords) return <div>Loading map...</div>;
  if (loadError) return <div className="text-red-500">Failed to load Google Maps</div>;
  if (!isLoaded) return <div>Loading Google Maps...</div>;

  // Build Google Maps navigation URL using user's chosen address as origin
  let origin = '';
  if (typeof window !== 'undefined') {
    const selectedAddressRaw = localStorage.getItem('selected_address');
    if (selectedAddressRaw) {
      try {
        const parsed = JSON.parse(selectedAddressRaw);
        if (parsed && parsed.lat && parsed.lon) {
          origin = `${parsed.lat},${parsed.lon}`;
        }
      } catch {
        // fallback: do nothing
      }
    }
  }
  const destination = coords ? `${coords.lat},${coords.lng}` : '';
  const navigationUrl = origin
    ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
    : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

  return (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coords}
        zoom={14}
        options={{
          disableDefaultUI: true,
          zoomControl: true,
          scrollwheel: false,
        }}
      >
        <Marker position={coords} />
      </GoogleMap>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <a
          href={navigationUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '0.5rem 1.5rem',
            background: '#4285F4',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '1rem',
            boxShadow: '0 1px 4px rgba(60,60,60,0.1)'
          }}
        >
          Navigate with Google Maps
        </a>
      </div>
    </div>
  );
};

export default ExperienceMap; 