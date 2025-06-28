import { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, ShoppingCart, ChevronDown, ChevronLeft, User, Settings, LogOut, Calendar, Shield, Heart, Package, CreditCard, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { getSavedExperiences } from '@/lib/data';
import { useAuth } from '@/lib/auth';
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
  const { isAuthenticated, user, logout, signInWithGoogle, login } = useAuth();
  const { toast } = useToast();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminCredentials, setAdminCredentials] = useState({ id: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  
  // Use search history hook
  const { recentSearches, addToSearchHistory } = useSearchHistory();

  // Always reload search history when search overlay is opened
  useEffect(() => {
    if (searchOpen) {
      // This will trigger the hook to reload from localStorage
      addToSearchHistory(''); // No-op, but triggers a state update
    }
    // No cleanup needed
  }, [searchOpen, addToSearchHistory]);

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
    
    // Enhanced search with better matching logic
    const results = experiences
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
      })
      .sort((a, b) => {
        // Sort by relevance: exact title matches first, then location, then category
        const aTitleMatch = a.title.toLowerCase().includes(lowercaseQuery);
        const bTitleMatch = b.title.toLowerCase().includes(lowercaseQuery);
        
        if (aTitleMatch && !bTitleMatch) return -1;
        if (!aTitleMatch && bTitleMatch) return 1;
        
        const aLocationMatch = a.location.toLowerCase().includes(lowercaseQuery);
        const bLocationMatch = b.location.toLowerCase().includes(lowercaseQuery);
        
        if (aLocationMatch && !bLocationMatch) return -1;
        if (!aLocationMatch && bLocationMatch) return 1;
        
        // If relevance is the same, sort by trending/featured status
        if (a.trending && !b.trending) return -1;
        if (!a.trending && b.trending) return 1;
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        return 0;
      })
      .slice(0, 8); // Show more results for better UX
    
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
    if (searchQuery.trim()) {
      const trimmedQuery = searchQuery.trim();
      addToSearchHistory(trimmedQuery);
      navigate(`/experiences?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchOpen(false);
      document.body.style.overflow = '';
    }
  };

  const handleSearchResultClick = (id: string) => {
    // Add both the current search query and the experience title to history (if different)
    const experience = searchResults.find(exp => exp.id === id);
    if (searchQuery && experience && experience.title && searchQuery.trim().toLowerCase() !== experience.title.trim().toLowerCase()) {
      addToSearchHistory(searchQuery.trim());
      addToSearchHistory(experience.title);
    } else if (experience && experience.title) {
      addToSearchHistory(experience.title);
    } else if (searchQuery) {
      addToSearchHistory(searchQuery.trim());
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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const success = await login(adminCredentials.id, adminCredentials.password);
      if (success) {
        setShowLoginDropdown(false);
        toast({
          title: "Signed in successfully",
          description: "You have been signed in to your account.",
        });
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Error signing in",
        description: "There was a problem signing in. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  return (
    <>
      <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4', navbarBgClass)}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 z-10" onClick={scrollToTop}>
            <img src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" alt="Slash logo" className="h-8 w-8" />
            <span className={cn("font-medium text-xl", textClass)}>
              Slash
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/experiences" className={cn("text-sm font-medium", textClass)}>
              All Experiences
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("text-sm font-medium flex items-center", textClass)}>
                  Company
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[280px] sm:w-[400px] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link to="/about-us" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">About Us</div>
                    <p className="text-sm text-muted-foreground">Learn more about our mission and team</p>
                  </Link>
                  <Link to="/how-it-works" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">How It Works</div>
                    <p className="text-sm text-muted-foreground">The process of booking and gifting experiences</p>
                  </Link>
                  <Link to="/testimonials" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Testimonials</div>
                    <p className="text-sm text-muted-foreground">What our customers say about us</p>
                  </Link>
                  <Link to="/careers" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Careers</div>
                    <p className="text-sm text-muted-foreground">Join our growing team</p>
                  </Link>
                  <Link to="/press" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Press</div>
                    <p className="text-sm text-muted-foreground">Media coverage and press releases</p>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={cn("text-sm font-medium flex items-center", textClass)}>
                  Support
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-[280px] sm:w-[400px] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link to="/contact" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Contact Us</div>
                    <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
                  </Link>
                  <Link to="/faq" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">FAQ</div>
                    <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                  </Link>
                  <Link to="/gift-rules" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Gift Rules</div>
                    <p className="text-sm text-muted-foreground">Understanding our gifting policies</p>
                  </Link>
                  <Link to="/shipping" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Shipping</div>
                    <p className="text-sm text-muted-foreground">Information about delivery options</p>
                  </Link>
                  <Link to="/returns" className="block p-3 rounded-md hover:bg-accent">
                    <div className="font-medium">Returns</div>
                    <p className="text-sm text-muted-foreground">Our return and refund policy</p>
                  </Link>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link to="/gifting-guide" className={cn("text-sm font-medium", textClass)}>
              Gifting Guide
            </Link>
            <Link to="/gift-personalizer" className={cn("text-sm font-medium", textClass)}>
              Gift Personalizer
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className={cn("p-2 hover:bg-white/10 rounded-full transition-colors", iconClass)}
            >
              <Search className="h-5 w-5" />
            </button>
            
            {isAuthenticated && (
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className={iconClass}>
                  <div className="relative">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                </Button>
              </Link>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={iconClass}>
                  <div className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56">
                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/cart')}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      View Cart
                    </DropdownMenuItem>
                  </>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Please sign in to view your cart</p>
                    <Button onClick={handleSignIn} className="w-full">
                      Sign In
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/host-experience">
              <Button variant="default" className="hidden md:flex">
                Host an Experience
              </Button>
            </Link>

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
                  {user?.user_metadata?.role === 'admin' && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/cart')}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Cart
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu open={showLoginDropdown} onOpenChange={setShowLoginDropdown}>
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
                  <DropdownMenuItem onClick={() => navigate('/admin/login')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Login
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
        <div className="fixed inset-0 z-50 bg-black/60 flex flex-col md:hidden">
          <div className="bg-white dark:bg-gray-900 w-4/5 max-w-xs h-full p-6 flex flex-col space-y-4 shadow-lg overflow-y-auto">
            <button className="self-end mb-4" onClick={toggleMobileMenu} aria-label="Close menu">
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
            <Link to="/experiences" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100">All Experiences</Link>
            <Link to="/gifting-guide" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100">Gifting Guide</Link>
            <Link to="/gift-personalizer" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100">Gift Personalizer</Link>
            <Link to="/host-experience" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100">Host an Experience</Link>
            {/* Company Section */}
            <div>
              <button onClick={() => setCompanyDropdownOpen(!companyDropdownOpen)} className="flex items-center justify-between w-full text-lg font-medium text-gray-900 dark:text-gray-100">
                Company
                <ChevronDown className={cn("h-5 w-5 transition-transform", companyDropdownOpen && "rotate-180")} />
              </button>
              {companyDropdownOpen && (
                <div className="pl-4 flex flex-col space-y-2 mt-2">
                  <Link to="/about-us" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">About Us</Link>
                  <Link to="/how-it-works" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">How It Works</Link>
                  <Link to="/testimonials" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Testimonials</Link>
                  <Link to="/careers" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Careers</Link>
                  <Link to="/press" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Press</Link>
                </div>
              )}
            </div>
            {/* Support Section */}
            <div>
              <button onClick={() => setSupportDropdownOpen(!supportDropdownOpen)} className="flex items-center justify-between w-full text-lg font-medium text-gray-900 dark:text-gray-100">
                Support
                <ChevronDown className={cn("h-5 w-5 transition-transform", supportDropdownOpen && "rotate-180")} />
              </button>
              {supportDropdownOpen && (
                <div className="pl-4 flex flex-col space-y-2 mt-2">
                  <Link to="/contact" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Contact Us</Link>
                  <Link to="/faq" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">FAQ</Link>
                  <Link to="/gift-rules" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Gift Rules</Link>
                  <Link to="/shipping" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Shipping</Link>
                  <Link to="/returns" onClick={toggleMobileMenu} className="text-gray-700 dark:text-gray-300">Returns</Link>
                </div>
              )}
            </div>
            <div className="mt-6 border-t pt-4">
              <Link to="/admin/login" onClick={toggleMobileMenu} className="text-lg font-medium text-gray-900 dark:text-gray-100">Login as Admin</Link>
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
              <p className="text-sm text-gray-600 mb-3">Recent Searches</p>
              <div className="space-y-2">
                {recentSearches.length > 0 ? (
                  recentSearches.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearchClick(term)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100/80 backdrop-blur-sm text-gray-700 flex items-center transition-colors"
                    >
                      <Clock className="h-4 w-4 mr-3 text-gray-400" />
                      <span className="text-sm">{term}</span>
                    </button>
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
                        {experience.imageUrl && (
                          <img 
                            src={experience.imageUrl} 
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
    </>
  );
};

export default Navbar;
