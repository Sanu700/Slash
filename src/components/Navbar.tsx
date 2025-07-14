import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, ShoppingCart, ChevronDown, ChevronLeft, User, Settings, LogOut, Calendar, Shield, Heart, Package, CreditCard, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { getSavedExperiences } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useWishlist } from '@/contexts/WishlistContext';

import { useSearchHistory } from '@/hooks/useSearchHistory';

import CitySelector from './CitySelector';
import LocationDropdown from './LocationDropdown';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';


interface NavbarProps {
  isDarkPageProp?: boolean;
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const Navbar = ({ isDarkPageProp = false }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);
  const [supportDropdownOpen, setSupportDropdownOpen] = useState(false);
  const { itemCount, items } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [mobileLocationDialogOpen, setMobileLocationDialogOpen] = useState(false);
  const [wishlistMenuOpen, setWishlistMenuOpen] = useState(false);
  const [profileWishlistMenuOpen, setProfileWishlistMenuOpen] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('selected_address');
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          return raw;
        }
      }
      return null;
    }
    return null;
  });

  
  // Use search history hook
  const { recentSearches, addToSearchHistory, reloadSearchHistory, clearSearchHistory, removeFromSearchHistory } = useSearchHistory();

  useEffect(() => {
    if (searchOpen) {
      reloadSearchHistory();
    }
  }, [searchOpen, reloadSearchHistory]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setSelectedResultIndex(-1);
      return;
    }

    const experiences = getSavedExperiences();
    const lowercaseQuery = searchQuery.toLowerCase();

    // Get selected location from localStorage
    const selectedAddressRaw = typeof window !== 'undefined' ? localStorage.getItem('selected_address') : null;
    let selectedAddress = null;
    try {
      selectedAddress = selectedAddressRaw ? JSON.parse(selectedAddressRaw) : selectedAddressRaw;
    } catch {
      selectedAddress = selectedAddressRaw;
    }
    const isCityOnly = selectedAddress && typeof selectedAddress === 'object' &&
      (!selectedAddress.lat || !selectedAddress.lon || isNaN(Number(selectedAddress.lat)) || isNaN(Number(selectedAddress.lon)));
    const DEFAULT_RADIUS_KM = 40;
    function haversineDistance(lat1, lon1, lat2, lon2) {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371; // Earth radius in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in km
    }

    // Enhanced search with better matching logic
    let results = experiences
      .filter(exp => {
        const searchableText = [
          exp.title,
          exp.description,
          exp.location,
          exp.category,
          exp.nicheCategory || '',
          exp.duration,
          exp.participants
        ].join(' ').toLowerCase();
        // Check for exact matches first
        const exactMatch = exp.title.toLowerCase().includes(lowercaseQuery) ||
                          exp.location.toLowerCase().includes(lowercaseQuery) ||
                          exp.category.toLowerCase().includes(lowercaseQuery);
        // Check for partial matches in any field
        const partialMatch = searchableText.includes(lowercaseQuery);
        // Check for word boundary matches (better for multi-word queries)
        const words = lowercaseQuery.split(' ').filter(word => word.length > 0);
        const wordMatch = words.some(word => 
          exp.title.toLowerCase().includes(word) ||
          exp.location.toLowerCase().includes(word) ||
          exp.category.toLowerCase().includes(word)
        );
        return exactMatch || partialMatch || wordMatch;
      });

    // Location filtering for search results
    if (selectedAddress && typeof selectedAddress === 'object' && selectedAddress.lat && selectedAddress.lon && !isCityOnly) {
      // Proximity filtering (address with coordinates)
      const lat = parseFloat(selectedAddress.lat);
      const lon = parseFloat(selectedAddress.lon);
      const normalizedCity = selectedAddress.address ? selectedAddress.address.trim().toLowerCase() : null;
      results = results
        .map(exp => {
          if (typeof exp.latitude === 'number' && typeof exp.longitude === 'number') {
            const distance = haversineDistance(lat, lon, exp.latitude, exp.longitude);
            return { ...exp, _distance: distance };
          }
          return { ...exp, _distance: Infinity };
        })
        .filter(exp => exp._distance <= DEFAULT_RADIUS_KM)
        .filter(exp => {
          if (!normalizedCity) return true;
          const expLoc = (exp.location || '').trim().toLowerCase();
          return expLoc.includes(normalizedCity);
        })
        .sort((a, b) => (a._distance || 0) - (b._distance || 0));
    } else if (selectedAddress && typeof selectedAddress === 'object' && selectedAddress.address && isCityOnly) {
      // City-only selection: string match on location column
      const normalizedCity = selectedAddress.address.trim().toLowerCase();
      results = results.filter(exp => {
        const expLoc = (exp.location || '').trim().toLowerCase();
        return expLoc === normalizedCity || expLoc.includes(normalizedCity) || normalizedCity.includes(expLoc);
      });
    }

    // City strictness: if search query is a city name different from the selected city, show no results
    const CITY_LIST = [
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
    // If the search query is a city name and does not match the selected city, show no results
    const queryCity = CITY_LIST.find(city => city.toLowerCase() === searchQuery.trim().toLowerCase());
    let selectedCity = null;
    if (selectedAddress && typeof selectedAddress === 'object' && selectedAddress.address) {
      selectedCity = CITY_LIST.find(city => city.toLowerCase() === selectedAddress.address.trim().toLowerCase());
    }
    if (queryCity && selectedCity && queryCity !== selectedCity) {
      setSearchResults([]);
      setSelectedResultIndex(-1);
      return;
    }

    results = results.slice(0, 8); // Show more results for better UX
    setSearchResults(results);
    setSelectedResultIndex(-1); // Reset selection when results change
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        document.body.style.overflow = '';
      }
    };

    if (searchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If a suggestion is highlighted, add its title to history
    if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
      const selected = searchResults[selectedResultIndex];
      if (selected && selected.title) {
        addToSearchHistory(selected.title);
        setSearchOpen(false);
        navigate(`/experience/${selected.id}`);
        document.body.style.overflow = '';
        return;
      }
    }
    // Otherwise, add the typed query
    if (searchQuery.trim()) {
      addToSearchHistory(searchQuery.trim());
      navigate(`/experiences?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      document.body.style.overflow = '';
    }
  };

  const handleSearchResultClick = (id: string) => {
    // Only add the experience title to history
    const experience = searchResults.find(exp => exp.id === id);
    if (experience && experience.title) {
      addToSearchHistory(experience.title);
    }
    setSearchOpen(false);
    navigate(`/experience/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchResults.length) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedResultIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedResultIndex >= 0 && selectedResultIndex < searchResults.length) {
          handleSearchResultClick(searchResults[selectedResultIndex].id);
        } else if (searchQuery.trim()) {
          handleSearchSubmit(e as any);
        }
        break;
      case 'Escape':
        setSearchOpen(false);
        document.body.style.overflow = '';
        break;
    }
  };

  const handleSignIn = () => {
    signInWithGoogle();
  };

  const handleProfileClick = () => {
    setMobileMenuOpen(false);
    navigate('/profile');
  };

  const isDarkPage = location.pathname === '/';

  const isGiftingPage = 
    location.pathname.includes('/gifting-guide') ||
    location.pathname.includes('/gift-personalizer');

  const navbarBgClass = isDarkPage
    ? "bg-black/30 backdrop-blur-md"
    : "bg-white dark:bg-gray-900/90 backdrop-blur-md shadow-sm";
    
  const textClass = cn(
    "transition-colors",
    isDarkPage
      ? "text-white hover:text-gray-200"
      : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
  );

  const iconClass = cn(
    "transition-colors",
    isDarkPage
      ? "text-white hover:text-gray-200" 
      : "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
  );

  const handleSignOut = async () => {
    try {
      await logout();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (path: string) => {
    scrollToTop();
    setCompanyDropdownOpen(false);
    setSupportDropdownOpen(false);
    navigate(path);
    setSearchOpen(false);
    document.body.style.overflow = '';
  };

  // Add a function to get the display label for the location button
  const getLocationLabel = () => {
    if (selectedLocation) {
      // If it's an object with address property
      if (typeof selectedLocation === 'object' && selectedLocation.address) {
        return selectedLocation.address.split(',')[0];
      }
      // If it's a string
      if (typeof selectedLocation === 'string') {
        return selectedLocation.split(',')[0];
      }
    }
    const city = localStorage.getItem('selected_city');
    if (city) return city;
    return 'Select Location';
  };

  useEffect(() => {
    const handleLocationCleared = () => setSelectedLocation(null);
    window.addEventListener('locationCleared', handleLocationCleared);
    return () => window.removeEventListener('locationCleared', handleLocationCleared);
  }, []);

  const handlePopularSearchClick = (term: string) => {
    setSearchQuery(term);
    addToSearchHistory(term);
    handleNavigation(`/experiences?search=${encodeURIComponent(term)}`);
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchQuery(term);
    addToSearchHistory(term);
    handleNavigation(`/experiences?search=${encodeURIComponent(term)}`);
  };

  useEffect(() => {
    // Always read the latest value from localStorage when the route changes
    const selectedAddressRaw = localStorage.getItem('selected_address');
    let parsed = null;
    try {
      parsed = selectedAddressRaw ? JSON.parse(selectedAddressRaw) : selectedAddressRaw;
    } catch {
      parsed = selectedAddressRaw;
    }
    setSelectedLocation(parsed);
  }, [location]);

  return (
    <>
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-8 py-5', navbarBgClass)}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center space-x-3 z-10" onClick={scrollToTop}>
            <img src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" alt="Slash logo" className="h-8 w-8" />
            <span className={cn("font-medium text-xl", textClass)}>
              Slash
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 ml-4">
            <Link to="/experiences" className={cn("text-base font-medium whitespace-nowrap", textClass)}>
              All Experiences
            </Link>
            <Link to="/gift-personalizer" className={cn("text-base font-medium whitespace-nowrap", textClass)}>
              Gift Personalizer
            </Link>
            <Link to="/swipe-ai" className={cn("text-base font-medium whitespace-nowrap", textClass)}>
              Swipe AI
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("text-base font-normal flex items-center gap-1 whitespace-nowrap", textClass)}>
                  Company
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[280px] sm:w-[400px] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DropdownMenuItem onClick={() => navigate('/about-us')} className="flex flex-col items-start p-3 rounded-md hover:bg-accent cursor-pointer gap-1">
                    <div className="text-base font-medium">About Us</div>
                    <p className="text-sm text-muted-foreground">Learn more about our mission and team</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/testimonials')} className="flex flex-col items-start p-3 rounded-md hover:bg-accent cursor-pointer gap-1">
                    <div className="text-base font-medium">Testimonials</div>
                    <p className="text-sm text-muted-foreground">What our customers say about us</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/press')} className="flex flex-col items-start p-3 rounded-md hover:bg-accent cursor-pointer gap-1">
                    <div className="text-base font-medium">Press</div>
                    <p className="text-sm text-muted-foreground">Media coverage and press releases</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/privacy')} className="flex flex-col items-start p-3 rounded-md hover:bg-accent cursor-pointer gap-1">
                    <div className="text-base font-medium">Privacy Policy</div>
                    <p className="text-sm text-muted-foreground">Read our privacy policy</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("text-base font-normal flex items-center gap-1 whitespace-nowrap", textClass)}>
                  Support
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[280px] sm:w-[400px] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <DropdownMenuItem onClick={() => navigate('/contact')} className="flex flex-col items-start p-3 rounded-md hover:bg-accent cursor-pointer gap-1">
                    <div className="text-base font-medium">Contact Us</div>
                    <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/faq')} className="flex flex-col items-start p-3 rounded-md hover:bg-accent cursor-pointer gap-1">
                    <div className="text-base font-medium">FAQ</div>
                    <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn("flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-base font-normal whitespace-nowrap", textClass)}
                  aria-label="Select location"
                >
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span
                    className={cn(
                      "max-w-[120px] truncate text-base font-normal whitespace-nowrap",
                      isDarkPage ? "text-white" : "text-gray-900"
                    )}
                    style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'middle' }}
                  >
                    {getLocationLabel()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" sideOffset={0} className="w-auto min-w-[320px] max-w-[95vw] p-0 rounded-xl shadow-2xl border border-gray-200 bg-white overflow-x-hidden">
                <LocationDropdown
                  value={
                    selectedLocation && typeof selectedLocation === 'object' && 'address' in selectedLocation
                      ? selectedLocation.address
                      : typeof selectedLocation === 'string'
                        ? selectedLocation
                        : ''
                  }
                  onChange={(val) => {
                    setSelectedLocation(val);
                    window.dispatchEvent(new Event('locationChanged'));
                    if (window.location.pathname !== '/experiences') {
                      navigate('/experiences');
                    }
                  }}
                  standalone
                  onClose={() => setLocationDropdownOpen(false)}
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={toggleSearch}
              className={cn("p-2 hover:bg-white/10 rounded-full transition-colors", iconClass)}
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Wishlist/Heart Button */}
            {isAuthenticated ? (
              <DropdownMenu open={wishlistMenuOpen} onOpenChange={setWishlistMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={iconClass}
                    onClick={() => setWishlistMenuOpen(open => !open)}
                  >
                    <span className="relative">
                      <Heart className="h-5 w-5" />
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Liked
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={iconClass}
                onClick={() => {
                  toast({
                    title: 'Please log in to view your liked list.',
                    variant: 'destructive',
                  });
                }}
              >
                <span className="relative">
                  <Heart className="h-5 w-5" />
                </span>
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={iconClass}>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Liked
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={iconClass}>
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 sm:w-56">
                  <DropdownMenuItem onClick={handleSignIn}>
                    <User className="mr-2 h-4 w-4" />
                    Sign in with Google
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={toggleMobileMenu} aria-label="Open menu">
            <Menu className={iconClass} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col md:hidden overflow-x-hidden">
          <div className="bg-white dark:bg-gray-900 w-full max-w-xs h-full p-6 flex flex-col space-y-4 shadow-lg overflow-y-auto">
            <button className="self-end mb-4" onClick={toggleMobileMenu} aria-label="Close menu">
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
            {/* Profile/Account option for mobile */}
            {isAuthenticated ? (
              <Link to="/profile" onClick={toggleMobileMenu} className="text-lg font-medium text-primary w-full mb-2">Profile</Link>
            ) : (
              <button onClick={handleSignIn} className="text-lg font-medium text-primary w-full mb-2">Sign In</button>
            )}
            {/* Location selection in mobile menu (Dialog) */}
            <div className="mb-4">
              <Dialog open={mobileLocationDialogOpen} onOpenChange={setMobileLocationDialogOpen}>
                <DialogTrigger asChild>
                  <button
                    className={cn("flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full text-base font-normal whitespace-nowrap", textClass)}
                    aria-label="Select location"
                  >
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span
                      className={cn(
                        "max-w-[120px] truncate text-base font-normal whitespace-nowrap",
                        isDarkPage ? "text-white" : "text-gray-900"
                      )}
                      style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'middle' }}
                    >
                      {getLocationLabel()}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Location</DialogTitle>
                  </DialogHeader>
                  <LocationDropdown
                    value={
                      selectedLocation && typeof selectedLocation === 'object' && 'address' in selectedLocation
                        ? selectedLocation.address
                        : typeof selectedLocation === 'string'
                          ? selectedLocation
                          : ''
                    }
                    onChange={(val) => {
                      setSelectedLocation(val);
                      window.dispatchEvent(new Event('locationChanged'));
                      setMobileLocationDialogOpen(false);
                      if (window.location.pathname !== '/experiences') {
                        navigate('/experiences');
                      }
                    }}
                    standalone
                    onClose={() => setMobileLocationDialogOpen(false)}
                  />
                  <DialogClose asChild>
                    <button className="mt-4 w-full py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800">Cancel</button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
            {/* Main navigation options */}
            <Link to="/experiences" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100 w-full">All Experiences</Link>
            <Link to="/gift-personalizer" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100 w-full">Gift Personalizer</Link>
            <Link to="/swipe-ai" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100 w-full">Swipe AI</Link>
            {/* Company Section */}
            <div>
              <button onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)} className="flex items-center justify-between w-full text-lg font-medium text-gray-900 dark:text-gray-100">
                Company
                <ChevronDown className={cn("h-5 w-5 transition-transform", companyDropdownOpen && "rotate-180")}/>
              </button>
              {companyDropdownOpen && (
                <div className="pl-4 flex flex-col space-y-2 mt-2">
                  <Link to="/about-us" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">About Us</Link>
                  <Link to="/testimonials" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Testimonials</Link>
                  <Link to="/press" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Press</Link>
                  <Link to="/privacy" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Privacy Policy</Link>
                </div>
              )}
            </div>
            {/* Support Section */}
            <div>
              <button onClick={() => setSupportDropdownOpen(!supportDropdownOpen)} className="flex items-center justify-between w-full text-lg font-medium text-gray-900 dark:text-gray-100">
                Support
                <ChevronDown className={cn("h-5 w-5 transition-transform", supportDropdownOpen && "rotate-180")}/>
              </button>
              {supportDropdownOpen && (
                <div className="pl-4 flex flex-col space-y-2 mt-2">
                  <Link to="/contact" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Contact Us</Link>
                  <Link to="/faq" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">FAQ</Link>
                </div>
              )}
            </div>
          </div>
          {/* Click outside to close */}
          <div className="flex-1" onClick={toggleMobileMenu} />
        </div>
      )}

      {/* Search Overlay */}
      <div 
        ref={searchRef}
        className={cn(
          "fixed inset-0 bg-white/80 backdrop-blur-sm transition-opacity z-50",
          searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="container max-w-2xl mx-auto pt-28 px-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="text"
              placeholder="Search for experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex h-12 w-full border border-input bg-white/90 backdrop-blur-sm px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 pr-4 py-6 text-lg rounded-xl"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button 
              type="button" 
              onClick={toggleSearch} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Hot Air Balloon', 'Dining', 'Yacht', 'Spa Day', 'Adventure'].map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularSearchClick(term)}
                  className="px-3 py-1.5 bg-gray-100/80 backdrop-blur-sm rounded-full text-sm hover:bg-gray-200/80 cursor-pointer text-gray-700"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Searches - Always show when search bar is open and empty */}
          {searchOpen && !searchQuery && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600">Recent Searches</p>
                {recentSearches.length > 0 && (
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-primary hover:underline px-2 py-1 rounded"
                  >
                    Clear Search History
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((term, index) => (
                    <div key={index} className="flex items-center group">
                      <button
                        onClick={() => handleRecentSearchClick(term)}
                        className="flex-1 text-left px-4 py-3 rounded-lg hover:bg-gray-100/80 backdrop-blur-sm text-gray-700 flex items-center transition-colors"
                      >
                        <Clock className="h-4 w-4 mr-3 text-gray-400" />
                        <span className="text-sm">{term}</span>
                      </button>
                      <button
                        onClick={() => removeFromSearchHistory(term)}
                        className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                        aria-label={`Remove ${term} from search history`}
                        tabIndex={0}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 px-4 py-3 text-sm">No recent searches yet.</div>
                )}
              </div>
            </div>
          )}

          {/* Search Results Suggestions */}
          {searchResults.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">Search Results</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {searchResults.map((experience, index) => (
                  <button
                    key={experience.id}
                    onClick={() => handleSearchResultClick(experience.id)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg hover:bg-gray-100/80 backdrop-blur-sm text-gray-700 flex items-center justify-between group transition-colors",
                      selectedResultIndex === index && "bg-gray-200/80"
                    )}
                    onMouseEnter={() => setSelectedResultIndex(index)}
                    onMouseLeave={() => setSelectedResultIndex(-1)}
                  >
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                        {experience.imageUrl && experience.imageUrl.length > 0 && (
                          <img 
                            src={experience.imageUrl[0]} 
                            alt={experience.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                          {experience.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {experience.location}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 flex-shrink-0">
                      ₹{experience.price.toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {searchQuery.length >= 2 && searchResults.length === 0 && (
            <div className="mt-6">
              <p className="text-sm text-gray-600 mb-3">No results found</p>
              <div className="text-center py-6 text-gray-500">
                <p className="text-base">No experiences match "{searchQuery}"</p>
                <p className="text-sm mt-2">Try different keywords or browse our popular experiences</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Location Dropdown/Modal (shared for both desktop and mobile) */}
      <DropdownMenu open={locationDropdownOpen} onOpenChange={setLocationDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className={cn("flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden", textClass)}
            aria-label="Select location"
          >
            <MapPin className="h-5 w-5 text-blue-600" />
            <span className="max-w-[90px] truncate text-sm text-gray-900 md:text-white" style={{ maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block', verticalAlign: 'middle' }}>
              {getLocationLabel()}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" sideOffset={0} className="w-auto min-w-[320px] max-w-[95vw] p-0 rounded-xl shadow-2xl border border-gray-200 bg-white overflow-x-hidden">
          <LocationDropdown
            value={
              selectedLocation && typeof selectedLocation === 'object' && 'address' in selectedLocation
                ? selectedLocation.address
                : typeof selectedLocation === 'string'
                  ? selectedLocation
                  : ''
            }
            onChange={(val) => {
              setSelectedLocation(val);
              window.dispatchEvent(new Event('locationChanged'));
              if (window.location.pathname !== '/experiences') {
                navigate('/experiences');
              }
            }}
            standalone
            onClose={() => setLocationDropdownOpen(false)}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default Navbar;
