import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationScrollMenuProps {
  onLocationSelect: (location: string | null) => void;
  selectedLocation: string | null;
}

// Predefined list of major Indian cities
const INDIAN_LOCATIONS = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Surat',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivali',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Guwahati',
  'Chandigarh',
  'Solapur',
  'Hubli-Dharwad',
  'Bareilly',
  'Moradabad',
  'Mysore',
  'Gurgaon',
  'Aligarh',
  'Jalandhar',
  'Tiruchirappalli',
  'Bhubaneswar',
  'Salem',
  'Warangal',
  'Mira-Bhayandar',
  'Thiruvananthapuram',
  'Bhiwandi',
  'Saharanpur',
  'Guntur',
  'Amravati',
  'Bikaner',
  'Noida',
  'Jamshedpur',
  'Bhilai',
  'Cuttack',
  'Firozabad',
  'Kochi',
  'Nellore',
  'Bhavnagar',
  'Dehradun',
  'Durgapur',
  'Asansol',
  'Rourkela',
  'Nanded',
  'Kolhapur',
  'Ajmer',
  'Akola',
  'Gulbarga',
  'Jamnagar',
  'Ujjain',
  'Loni',
  'Siliguri',
  'Jhansi',
  'Ulhasnagar',
  'Jammu',
  'Sangli-Miraj',
  'Mangalore',
  'Erode',
  'Belgaum',
  'Ambattur',
  'Tirunelveli',
  'Malegaon',
  'Gaya',
  'Jalgaon',
  'Udaipur',
  'Maheshtala',
  'Tirupur',
  'Davanagere',
  'Kozhikode',
  'Kurnool',
  'Rajpur Sonarpur',
  'Bokaro',
  'South Dumdum',
  'Bellary',
  'Patiala',
  'Gopalpur',
  'Agartala',
  'Bhagalpur',
  'Muzaffarnagar',
  'Bhatpara',
  'Panihati',
  'Latur',
  'Dhule',
  'Rohtak',
  'Korba',
  'Bhilwara',
  'Berhampur',
  'Muzaffarpur',
  'Ahmednagar',
  'Mathura',
  'Kollam',
  'Avadi',
  'Kadapa',
  'Kamarhati',
  'Bilaspur',
  'Shahjahanpur',
  'Satara',
  'Bijapur',
  'Rampur',
  'Shivamogga',
  'Chandrapur',
  'Junagadh',
  'Thrissur',
  'Alwar',
  'Bardhaman',
  'Kulti',
  'Kakinada',
  'Nizamabad',
  'Parbhani',
  'Tumkur',
  'Hisar',
  'Ozhukarai',
  'Bihar Sharif',
  'Panipat',
  'Darbhanga',
  'Bally',
  'Aizawl',
  'Dewas',
  'Ichalkaranji',
  'Karnal',
  'Bathinda',
  'Jalna',
  'Eluru',
  'Barasat',
  'Kirari Suleman Nagar',
  'Purnia',
  'Satna',
  'Mau',
  'Sonipat',
  'Farrukhabad',
  'Sagar',
  'Durg',
  'Imphal',
  'Ratlam',
  'Hapur',
  'Arrah',
  'Karimnagar',
  'Anantapur',
  'Etawah',
  'Ambernath',
  'North Dumdum',
  'Bharatpur',
  'Begusarai',
  'New Delhi',
  'Gandhidham',
  'Baranagar',
  'Tiruvottiyur',
  'Puducherry',
  'Sikar',
  'Thoothukkudi',
  'Rewa',
  'Mirzapur',
  'Raichur',
  'Pali',
  'Ramagundam',
  'Haridwar',
  'Vijayanagaram',
  'Katihar',
  'Nagercoil',
  'Sri Ganganagar',
  'Karawal Nagar',
  'Mango',
  'Thanjavur',
  'Bulandshahr',
  'Uluberia',
  'Katni',
  'Sambhal',
  'Singrauli',
  'Nadiad',
  'Secunderabad',
  'Naihati',
  'Yamunanagar',
  'Bidhan Nagar',
  'Pallavaram',
  'Bidar',
  'Munger',
  'Panchkula',
  'Burhanpur',
  'Raurkela Industrial Township',
  'Kharagpur',
  'Dindigul',
  'Gandhinagar',
  'Hospet',
  'Nangloi Jat',
  'Malda',
  'Ongole',
  'Deoghar',
  'Chapra',
  'Haldia',
  'Khandwa',
  'Nandyal',
  'Morena',
  'Amroha',
  'Anand',
  'Bhind',
  'Bhalswa Jahangir Pur',
  'Madhyamgram',
  'Bhiwani',
  'Berhampore',
  'Ambala',
  'Fatehpur',
  'Raebareli',
  'Khora',
  'Chittoor',
  'Bhusawal',
  'Orai',
  'Bahraich',
  'Phusro',
  'Vellore',
  'Mehsana',
  'Raiganj',
  'Sirsa',
  'Danapur',
  'Serampore',
  'Sultan Pur Majra',
  'Guna',
  'Jaunpur',
  'Panvel',
  'Shivpuri',
  'Surendranagar Dudhrej',
  'Unnao',
  'Chinsurah',
  'Alappuzha',
  'Kottayam',
  'Machilipatnam',
  'Shimla',
  'Adoni',
  'Udupi',
  'Tenali',
  'Proddatur',
  'Saharsa',
  'Hindupur',
  'Sasaram',
  'Buxar',
  'Krishnanagar',
  'Fatehpur Sikri',
  'Madhubani',
  'Motihari',
  'Rae Bareli',
  'Baharampur',
  'Baripada',
  'Khammam',
  'Bhimavaram',
  'Mandsaur',
  'Chittaranjan',
  'Nalgonda',
  'Baran',
  'Panaji',
  'Silchar',
  'Haldwani',
  'Gangtok',
  'Shillong',
  'Kohima',
  'Itanagar'
];

const LocationScrollMenu: React.FC<LocationScrollMenuProps> = ({
  onLocationSelect,
  selectedLocation
}) => {
  const handleLocationClick = (location: string) => {
    if (selectedLocation === location) {
      // If clicking the same location, deselect it
      onLocationSelect(null);
    } else {
      // Select the new location
      onLocationSelect(location);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Select Your Location</h3>
      </div>
      
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {/* "All Locations" button */}
          <Button
            variant={selectedLocation === null ? "default" : "outline"}
            size="sm"
            onClick={() => onLocationSelect(null)}
            className={cn(
              "whitespace-nowrap flex-shrink-0",
              selectedLocation === null && "bg-primary text-primary-foreground"
            )}
          >
            All India
          </Button>
          
          {/* Location buttons */}
          {INDIAN_LOCATIONS.map((location) => (
            <Button
              key={location}
              variant={selectedLocation === location ? "default" : "outline"}
              size="sm"
              onClick={() => handleLocationClick(location)}
              className={cn(
                "whitespace-nowrap flex-shrink-0",
                selectedLocation === location && "bg-primary text-primary-foreground"
              )}
            >
              {location}
            </Button>
          ))}
        </div>
        
        {/* Gradient overlay for better UX */}
        <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default LocationScrollMenu; 