import React, { useState, useEffect, useRef } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown, MapPin, Search, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CITY_COORDINATES } from './CitySelector';
import { useLocation } from 'react-router-dom';
import Fuse from 'fuse.js';

const INDIAN_LOCATIONS = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
  'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior',
  'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli-Dharwad', 'Bareilly',
  'Moradabad', 'Mysore', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal',
  'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Guntur', 'Amravati', 'Bikaner', 'Noida', 'Jamshedpur',
  'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela',
  'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar',
  'Jammu', 'Sangli-Miraj', 'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Jalgaon',
  'Udaipur', 'Maheshtala', 'Tirupur', 'Davanagere', 'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Bokaro', 'South Dumdum',
  'Bellary', 'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara', 'Panihati', 'Latur', 'Dhule',
  'Rohtak', 'Korba', 'Bhilwara', 'Berhampur', 'Muzaffarpur', 'Ahmednagar', 'Mathura', 'Kollam', 'Avadi', 'Kadapa',
  'Kamarhati', 'Bilaspur', 'Shahjahanpur', 'Satara', 'Bijapur', 'Rampur', 'Shivamogga', 'Chandrapur', 'Junagadh',
  'Thrissur', 'Alwar', 'Bardhaman', 'Kulti', 'Kakinada', 'Nizamabad', 'Parbhani', 'Tumkur', 'Hisar', 'Ozhukarai',
  'Bihar Sharif', 'Panipat', 'Darbhanga', 'Bally', 'Aizawl', 'Dewas', 'Ichalkaranji', 'Karnal', 'Bathinda', 'Jalna',
  'Eluru', 'Barasat', 'Kirari Suleman Nagar', 'Purnia', 'Satna', 'Mau', 'Sonipat', 'Farrukhabad', 'Sagar', 'Durg',
  'Imphal', 'Ratlam', 'Hapur', 'Arrah', 'Karimnagar', 'Anantapur', 'Etawah', 'Ambernath', 'North Dumdum', 'Bharatpur',
  'Begusarai', 'New Delhi', 'Gandhidham', 'Baranagar', 'Tiruvottiyur', 'Puducherry', 'Sikar', 'Thoothukkudi', 'Rewa',
  'Mirzapur', 'Raichur', 'Pali', 'Ramagundam', 'Haridwar', 'Vijayanagaram', 'Katihar', 'Nagercoil', 'Sri Ganganagar',
  'Karawal Nagar', 'Mango', 'Thanjavur', 'Bulandshahr', 'Uluberia', 'Katni', 'Sambhal', 'Singrauli', 'Nadiad',
  'Secunderabad', 'Naihati', 'Yamunanagar', 'Bidhan Nagar', 'Pallavaram', 'Bidar', 'Munger', 'Panchkula', 'Burhanpur',
  'Raurkela Industrial Township', 'Kharagpur', 'Dindigul', 'Gandhinagar', 'Hospet', 'Nangloi Jat', 'Malda', 'Ongole',
  'Deoghar', 'Chapra', 'Haldia', 'Khandwa', 'Nandyal', 'Morena', 'Amroha', 'Anand', 'Bhind', 'Bhalswa Jahangir Pur',
  'Madhyamgram', 'Bhiwani', 'Berhampore', 'Ambala', 'Fatehpur', 'Raebareli', 'Khora', 'Chittoor', 'Bhusawal', 'Orai',
  'Bahraich', 'Phusro', 'Vellore', 'Mehsana', 'Raiganj', 'Sirsa', 'Danapur', 'Serampore', 'Sultan Pur Majra', 'Guna',
  'Jaunpur', 'Panvel', 'Shivpuri', 'Surendranagar Dudhrej', 'Unnao', 'Chinsurah', 'Alappuzha', 'Kottayam', 'Machilipatnam',
  'Shimla', 'Adoni', 'Udupi', 'Tenali', 'Proddatur', 'Saharsa', 'Hindupur', 'Sasaram', 'Buxar', 'Krishnanagar',
  'Fatehpur Sikri', 'Madhubani', 'Motihari', 'Rae Bareli', 'Baharampur', 'Baripada', 'Khammam', 'Bhimavaram', 'Mandsaur',
  'Chittaranjan', 'Nalgonda', 'Baran', 'Panaji', 'Silchar', 'Haldwani', 'Gangtok', 'Shillong', 'Kohima', 'Itanagar'
];

const SORTED_LOCATIONS = [...INDIAN_LOCATIONS].sort((a, b) => a.localeCompare(b));

const fuse = new Fuse(SORTED_LOCATIONS, { threshold: 0.3 }); // Fuzzy, but not too fuzzy

interface LocationDropdownProps {
  value: string | { address: string } | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  standalone?: boolean;
  onClose?: () => void;
}

// Utility: Haversine formula to calculate distance between two lat/lon points in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ value, onChange, placeholder = 'Location', standalone = false, onClose }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [addressResults, setAddressResults] = useState<any[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showCities, setShowCities] = useState(false);
  const location = useLocation();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Add filteredCities state
  const [filteredCities, setFilteredCities] = useState(SORTED_LOCATIONS);

  const [cityResults, setCityResults] = useState<string[]>([]);

  // Store user's coordinates if available
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    // Always read the latest value from localStorage when the route changes
    const selectedAddressRaw = localStorage.getItem('selected_address');
    let parsed = null;
    try {
      parsed = selectedAddressRaw ? JSON.parse(selectedAddressRaw) : selectedAddressRaw;
    } catch {
      parsed = selectedAddressRaw;
    }
    setSelectedAddress(parsed);
    // If lat/lon available, store as userCoords
    if (parsed && parsed.lat && parsed.lon) {
      setUserCoords({ lat: parseFloat(parsed.lat), lon: parseFloat(parsed.lon) });
    }
  }, [location]);

  // Always sync address state with value prop
  useEffect(() => {
    if (typeof value === 'object' && value !== null && 'address' in value) {
      setAddress(value.address);
      setSelectedLocation(value.address);
    } else if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed === 'object' && 'address' in parsed) {
          setAddress(parsed.address);
          setSelectedLocation(parsed.address);
        } else {
          setAddress(value);
          setSelectedLocation(value);
        }
      } catch {
        setAddress(value);
        setSelectedLocation(value);
      }
    } else if (!value) {
      setAddress('');
      setSelectedLocation(null);
    }
  }, [value]);

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setError(null);
    let geoTimeout;
    if (navigator.geolocation) {
      let didRespond = false;
      geoTimeout = setTimeout(() => {
        if (!didRespond) {
          setIsGettingLocation(false);
          setError('Could not get your location. Please try again.');
        }
      }, 8000); // 8 seconds timeout
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          didRespond = true;
          clearTimeout(geoTimeout);
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lon: longitude }); // <-- update here
          let fetchTimeout;
          let didFetch = false;
          try {
            // Reverse geocode to get address
            fetchTimeout = setTimeout(() => {
              if (!didFetch) {
                setIsGettingLocation(false);
                setError('Could not resolve your address. Please try again.');
              }
            }, 5000); // 5 seconds timeout
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            );
            const data = await response.json();
            didFetch = true;
            clearTimeout(fetchTimeout);
            const addressText = data.display_name;
            setAddress(addressText);
            setSelectedLocation(addressText);
            localStorage.setItem('selected_address', JSON.stringify({
              address: addressText,
              lat: latitude.toString(),
              lon: longitude.toString()
            }));
          } catch (error) {
            setIsGettingLocation(false);
            setError('Could not resolve your address. Please try again.');
            // Fallback to coordinates
            setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setSelectedLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            localStorage.setItem('selected_address', JSON.stringify({
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              lat: latitude.toString(),
              lon: longitude.toString()
            }));
          }
          setIsGettingLocation(false);
        },
        (error) => {
          didRespond = true;
          clearTimeout(geoTimeout);
          setIsGettingLocation(false);
          setError('Could not get your location. Please try again.');
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 300000 // 5 minutes
        }
      );
    } else {
      setIsGettingLocation(false);
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Address autocomplete handler (debounced)
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAddress(val);

    // City/area suggestions from local list
    if (val.length < 1) {
      setCityResults([]);
      setAddressResults([]);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      setAddressLoading(false);
      return;
    }
    const lowerVal = val.toLowerCase();
    const cityFiltered = SORTED_LOCATIONS.filter(city => city.toLowerCase().startsWith(lowerVal));
    setCityResults(cityFiltered);

    // Debounce API call
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    setAddressLoading(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        // API address suggestions
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(val)}&addressdetails=1&limit=50&countrycodes=in`);
        let data = await res.json();
        if (!Array.isArray(data)) {
          setAddressResults([]);
          setAddressLoading(false);
          setError('No results found.');
          return;
        }
        // Show results where any word in display_name starts with the input
        let filtered = data.filter(item =>
          item.display_name
            .toLowerCase()
            .split(/[, ]+/)
            .some(part => part.trim().startsWith(lowerVal))
        );
        // If filter removes everything, fallback to all results
        if (filtered.length === 0 && data.length > 0) {
          filtered = data;
        }
        // If userCoords available, sort by distance
        if (userCoords && filtered.length > 0) {
          filtered = filtered.map(item => {
            let dist = null;
            if (item.lat && item.lon) {
              dist = haversineDistance(
                userCoords.lat,
                userCoords.lon,
                parseFloat(item.lat),
                parseFloat(item.lon)
              );
            }
            return { ...item, _distance: dist };
          });
          filtered.sort((a, b) => {
            if (a._distance == null) return 1;
            if (b._distance == null) return -1;
            return a._distance - b._distance;
          });
        }
        setAddressResults(filtered);
        setError(filtered.length === 0 ? 'No results found.' : null);
      } catch (err) {
        setAddressResults([]);
        setError('Error fetching address suggestions.');
        // For debugging
        // eslint-disable-next-line no-console
        console.error('Address autocomplete error:', err);
      } finally {
        setAddressLoading(false);
      }
    }, 400);
  };

  const handleAddressSelect = (result: any) => {
    setAddress(result.display_name);
    setAddressResults([]);
    setSelectedLocation(result.display_name);
    // Store in localStorage for later use
    localStorage.setItem('selected_address', JSON.stringify({
      address: result.display_name,
      lat: result.lat,
      lon: result.lon
    }));
  };

  if (standalone) {
    return (
      <div className="w-80 p-0 mt-1 border border-gray-200 dark:border-gray-700 bg-white rounded-lg shadow-lg">
        {/* Header with clear messaging */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Find Experiences Near You</h3>
          </div>
          <p className="text-sm text-gray-600">
            Enter your specific address for accurate proximity matching
          </p>
        </div>

        {/* Address input with autocomplete */}
        <div className="p-4 bg-white">
          <div className="space-y-3">
            {/* Current Location Button */}
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full justify-start gap-2 text-sm"
            >
              <Navigation className="h-4 w-4" />
              {isGettingLocation ? 'Getting your location...' : 'Use my current location'}
            </Button>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter your address
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="e.g., 123 Main Street, Bangalore, Karnataka"
                  value={address}
                  onChange={handleAddressChange}
                  className="pl-10 h-10 text-sm bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {addressLoading && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Searching for addresses...
              </div>
            )}

            {/* Address autocomplete results */}
            {(cityResults.length > 0 || addressResults.length > 0) && (
              <div className="max-h-48 overflow-y-auto bg-white border rounded-lg shadow-sm">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b bg-gray-50">
                  Address suggestions
                </div>
                {/* City/area suggestions from local list */}
                {cityResults.map((city, idx) => (
                  <button
                    key={city}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b last:border-b-0"
                    onClick={() => {
                      setAddress(city);
                      setSelectedLocation(city);
                      let coords = CITY_COORDINATES[city];
                      if (!coords && city.toLowerCase().includes('delhi')) {
                        coords = { latitude: 28.6139, longitude: 77.2090 };
                      }
                      if (coords) {
                        const addressData = {
                          address: city,
                          lat: coords.latitude,
                          lon: coords.longitude
                        };
                        localStorage.setItem('selected_address', JSON.stringify(addressData));
                      } else {
                        const addressData = { address: city };
                        localStorage.setItem('selected_address', JSON.stringify(addressData));
                      }
                      setCityResults([]);
                      setAddressResults([]);
                    }}
                  >
                    <div className="font-medium">{city}</div>
                  </button>
                ))}
                {/* API address suggestions */}
                {addressResults.map((result, idx) => (
                  <button
                    key={idx}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b last:border-b-0"
                    onClick={() => handleAddressSelect(result)}
                  >
                    <div className="font-medium">{result.display_name.split(',')[0]}</div>
                    <div className="text-xs text-gray-500">{result.display_name}</div>
                  </button>
                ))}
              </div>
            )}
            {/* Helper text and Show cities button */}
            <div className="flex items-end justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowCities(!showCities)}
                className="text-sm text-blue-600 hover:text-blue-800 ml-2"
              >
                {showCities ? 'Hide' : 'Show'} cities
              </button>
            </div>
            {/* City list for Show cities */}
            {showCities && (
              <div className="max-h-64 overflow-y-auto border rounded-lg mt-2 bg-white">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search city..."
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <div className="space-y-1">
                    {SORTED_LOCATIONS.filter(city => city.toLowerCase().startsWith(search.toLowerCase())).map(city => (
                      <button
                        key={city}
                        className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
                        onClick={() => {
                          setAddress(city);
                          setSelectedLocation(city);
                          let coords = CITY_COORDINATES[city];
                          if (!coords && city.toLowerCase().includes('delhi')) {
                            coords = { latitude: 28.6139, longitude: 77.2090 };
                          }
                          // Store object in localStorage, but do not use it for setSelectedLocation or onChange
                          if (coords) {
                            const addressData = {
                              address: city,
                              lat: coords.latitude,
                              lon: coords.longitude
                            };
                            localStorage.setItem('selected_address', JSON.stringify(addressData));
                          } else {
                            const addressData = { address: city };
                            localStorage.setItem('selected_address', JSON.stringify(addressData));
                          }
                          setShowCities(false);
                        }}
                      >
                        {typeof city === 'string' ? city : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Find Experiences button */}
            {selectedLocation && (
              <div className="pt-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 font-medium"
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(localStorage.getItem('selected_address') || '');
                      onChange(parsed);
                    } catch {
                      onChange(selectedLocation);
                    }
                    if (onClose) onClose();
                  }}
                >
                  Find Experiences Near This Location
                </Button>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 mt-2">{error}</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: render as dropdown
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-40 h-10 px-3 text-sm font-normal bg-white text-gray-900 border border-gray-300 shadow-sm rounded-md flex items-center gap-1 hover:bg-gray-50"
        >
          <MapPin className="h-4 w-4 text-primary mr-1" />
          <span className={cn('truncate', value ? 'font-medium' : 'text-gray-500')}>
            {typeof value === 'object' && value !== null && 'address' in value
              ? value.address
              : (typeof value === 'string' ? value : placeholder)}
          </span>
          <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 mt-1 border border-gray-200 dark:border-gray-700 bg-white rounded-lg shadow-lg">
        {/* Header with clear messaging */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Find Experiences Near You</h3>
          </div>
          <p className="text-sm text-gray-600">
            Enter your specific address for accurate proximity matching
          </p>
        </div>

        {/* Address input with autocomplete */}
        <div className="p-4 bg-white">
          <div className="space-y-3">
            {/* Current Location Button */}
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full justify-start gap-2 text-sm"
            >
              <Navigation className="h-4 w-4" />
              {isGettingLocation ? 'Getting your location...' : 'Use my current location'}
            </Button>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Enter your address
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="e.g., 123 Main Street, Bangalore, Karnataka"
                  value={address}
                  onChange={handleAddressChange}
                  className="pl-10 h-10 text-sm bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {addressLoading && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Searching for addresses...
              </div>
            )}

            {/* Address autocomplete results */}
            {(cityResults.length > 0 || addressResults.length > 0) && (
              <div className="max-h-48 overflow-y-auto bg-white border rounded-lg shadow-sm">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b bg-gray-50">
                  Address suggestions
                </div>
                {/* City/area suggestions from local list */}
                {cityResults.map((city, idx) => (
                  <button
                    key={city}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b last:border-b-0"
                    onClick={() => {
                      setAddress(city);
                      setSelectedLocation(city);
                      let coords = CITY_COORDINATES[city];
                      if (!coords && city.toLowerCase().includes('delhi')) {
                        coords = { latitude: 28.6139, longitude: 77.2090 };
                      }
                      if (coords) {
                        const addressData = {
                          address: city,
                          lat: coords.latitude,
                          lon: coords.longitude
                        };
                        localStorage.setItem('selected_address', JSON.stringify(addressData));
                      } else {
                        const addressData = { address: city };
                        localStorage.setItem('selected_address', JSON.stringify(addressData));
                      }
                      setCityResults([]);
                      setAddressResults([]);
                    }}
                  >
                    <div className="font-medium">{city}</div>
                  </button>
                ))}
                {/* API address suggestions */}
                {addressResults.map((result, idx) => (
                  <button
                    key={idx}
                    className="block w-full text-left px-3 py-2 text-sm hover:bg-blue-50 border-b last:border-b-0"
                    onClick={() => handleAddressSelect(result)}
                  >
                    <div className="font-medium">{result.display_name.split(',')[0]}</div>
                    <div className="text-xs text-gray-500">{result.display_name}</div>
                  </button>
                ))}
              </div>
            )}
            {/* Helper text and Show cities button */}
            <div className="flex items-end justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowCities(!showCities)}
                className="text-sm text-blue-600 hover:text-blue-800 ml-2"
              >
                {showCities ? 'Hide' : 'Show'} cities
              </button>
            </div>
            {/* City list for Show cities */}
            {showCities && (
              <div className="max-h-64 overflow-y-auto border rounded-lg mt-2 bg-white">
                <div className="p-2">
                  <input
                    type="text"
                    placeholder="Search city..."
                    className="w-full mb-2 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  <div className="space-y-1">
                    {SORTED_LOCATIONS.filter(city => city.toLowerCase().startsWith(search.toLowerCase())).map(city => (
                      <button
                        key={city}
                        className="block w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded"
                        onClick={() => {
                          setAddress(city);
                          setSelectedLocation(city);
                          let coords = CITY_COORDINATES[city];
                          if (!coords && city.toLowerCase().includes('delhi')) {
                            coords = { latitude: 28.6139, longitude: 77.2090 };
                          }
                          // Store object in localStorage, but do not use it for setSelectedLocation or onChange
                          if (coords) {
                            const addressData = {
                              address: city,
                              lat: coords.latitude,
                              lon: coords.longitude
                            };
                            localStorage.setItem('selected_address', JSON.stringify(addressData));
                          } else {
                            const addressData = { address: city };
                            localStorage.setItem('selected_address', JSON.stringify(addressData));
                          }
                          setShowCities(false);
                        }}
                      >
                        {typeof city === 'string' ? city : ''}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Find Experiences button */}
            {selectedLocation && (
              <div className="pt-2">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-10 font-medium"
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(localStorage.getItem('selected_address') || '');
                      onChange(parsed);
                    } catch {
                      onChange(selectedLocation);
                    }
                    setOpen(false);
                  }}
                >
                  Find Experiences Near This Location
                </Button>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 mt-2">{error}</div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationDropdown; 