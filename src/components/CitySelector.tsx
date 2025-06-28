import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const CITIES = [
  'Bangalore', 'Delhi', 'Gurgaon', 'Mumbai', 'Pune', 'Ahmedabad', 'Gandhinagar',
  'Chennai', 'Hyderabad', 'Lucknow', 'Indore', 'Chandigarh', 'Kolkata',
  'Bhopal', 'Shimla', 'Dehradun', 'Thiruvananthpuram'
];

const SERVED_CITIES = ['Bangalore', 'Gurgaon', 'Delhi'];

const CitySelector = ({ onChange }) => {
  const [selectedCity, setSelectedCity] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('selected_city');
    if (stored) setSelectedCity(stored);
  }, []);

  const handleSelect = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    localStorage.setItem('selected_city', city);
    if (onChange) onChange(city);
    setShowWarning(!SERVED_CITIES.includes(city));
  };

  return (
    <div className="mb-4 flex flex-col items-start">
      <select
        id="city-select"
        value={selectedCity}
        onChange={handleSelect}
        className="border rounded px-3 py-2 text-base"
      >
        <option value="" disabled>Select a city...</option>
        {CITIES.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      {showWarning && selectedCity && !SERVED_CITIES.includes(selectedCity) && (
        <div className="text-red-600 mt-2">We don't currently serve these places</div>
      )}
    </div>
  );
};

// Mapping of city names to coordinates (latitude, longitude)
export const CITY_COORDINATES = {
  'Bangalore': { latitude: 12.9716, longitude: 77.5946 },
  'Delhi': { latitude: 28.6139, longitude: 77.2090 },
  'Gurgaon': { latitude: 28.4595, longitude: 77.0266 },
  'Mumbai': { latitude: 19.0760, longitude: 72.8777 },
  'Pune': { latitude: 18.5204, longitude: 73.8567 },
  'Ahmedabad': { latitude: 23.0225, longitude: 72.5714 },
  'Gandhinagar': { latitude: 23.2156, longitude: 72.6369 },
  'Chennai': { latitude: 13.0827, longitude: 80.2707 },
  'Hyderabad': { latitude: 17.3850, longitude: 78.4867 },
  'Lucknow': { latitude: 26.8467, longitude: 80.9462 },
  'Indore': { latitude: 22.7196, longitude: 75.8577 },
  'Chandigarh': { latitude: 30.7333, longitude: 76.7794 },
  'Kolkata': { latitude: 22.5726, longitude: 88.3639 },
  'Bhopal': { latitude: 23.2599, longitude: 77.4126 },
  'Shimla': { latitude: 31.1048, longitude: 77.1734 },
  'Dehradun': { latitude: 30.3165, longitude: 78.0322 },
  'Thiruvananthpuram': { latitude: 8.5241, longitude: 76.9366 }
};

export default CitySelector; 