import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, ChevronDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface LocationDropdownProps {
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({ value, onChange, placeholder = 'Location' }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredLocations = SORTED_LOCATIONS.filter(city =>
    city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-40 h-10 px-3 text-sm font-normal bg-white text-gray-900 border border-gray-300 shadow-sm rounded-md flex items-center gap-1 hover:bg-gray-50"
        >
          <MapPin className="h-4 w-4 text-primary mr-1" />
          <span className={cn('truncate', value ? 'font-medium' : 'text-gray-500')}>{value || placeholder}</span>
          <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44 p-0 mt-1 border border-gray-200 dark:border-gray-700 bg-white">
        <div className="p-2 border-b border-gray-100 dark:border-gray-800 bg-white">
          <Input
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="h-8 text-xs px-2 bg-white"
            autoFocus
          />
        </div>
        <div className="max-h-56 overflow-y-auto bg-white">
          <button
            className={cn(
              'w-full text-left px-3 py-1.5 text-xs hover:bg-accent',
              !value && 'font-semibold'
            )}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
          >
            {!value && <Check className="inline mr-1 h-3 w-3" />}All India
          </button>
          {filteredLocations.length === 0 && (
            <div className="px-3 py-2 text-muted-foreground text-xs">No locations found</div>
          )}
          {filteredLocations.map(city => (
            <button
              key={city}
              className={cn(
                'w-full text-left px-3 py-1.5 text-xs hover:bg-accent',
                value === city && 'font-semibold'
              )}
              onClick={() => {
                onChange(city);
                setOpen(false);
              }}
            >
              {value === city && <Check className="inline mr-1 h-3 w-3" />} {city}
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocationDropdown; 