import { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingCart, Gift, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { getSavedExperiences } from '@/lib/data';
import { useAuth } from '@/lib/auth';
import { NavigationLinks } from '@/components/NavigationLinks';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, signInWithGoogle } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.classList.add('search-overlay-active');
    } else {
      document.body.classList.remove('search-overlay-active');
    }
    
    return () => {
      document.body.classList.remove('search-overlay-active');
    };
  }, [searchOpen]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const experiences = getSavedExperiences();
    const lowercaseQuery = searchQuery.toLowerCase();
    const results = experiences
      .filter(exp => 
        exp.title.toLowerCase().includes(lowercaseQuery) || 
        exp.description.toLowerCase().includes(lowercaseQuery) ||
        exp.location.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 5);
    
    setSearchResults(results);
  }, [searchQuery]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/experiences?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchResultClick = (id: string) => {
    setSearchOpen(false);
    navigate(`/experience/${id}`);
  };

  const handleSignIn = () => {
    signInWithGoogle();
  };

  const handleProfileClick = () => {
    setMobileMenuOpen(false);
    navigate('/profile');
  };

  const isDarkPage = 
    location.pathname === '/' || 
    location.pathname.includes('/gifting-guide') || 
    location.pathname.includes('/category/') ||
    location.pathname.includes('/experience/') ||
    location.pathname.includes('/gift-personalizer');

  // Determine background and text colors based on page context for better contrast
  const navbarBgClass = isScrolled || !isDarkPage
    ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
    : "bg-black/30 backdrop-blur-md";
    
  const iconClass = cn(
    "transition-colors",
    isScrolled || !isDarkPage
      ? "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" 
      : "text-white hover:text-gray-200"
  );

  const logoTextClass = cn(
    "font-medium text-xl transition-colors", 
    isScrolled || !isDarkPage 
      ? "text-gray-800 dark:text-gray-200" 
      : "text-white"
  );

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4',
        navbarBgClass
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-10">
          <img 
            src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
            alt="Slash logo" 
            className="h-8 w-8" 
          />
          <span className={logoTextClass}>
            Slash
          </span>
        </Link>

        <NavigationLinks 
          isDarkPage={isDarkPage} 
          isScrolled={isScrolled} 
        />

        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={toggleSearch}
            className={cn(
              "p-2 rounded-full transition-colors",
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/cart"
            className={cn(
              "p-2 rounded-full transition-colors relative",
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  {user?.user_metadata?.avatar_url ? (
                    <Avatar className="h-8 w-8 cursor-pointer border-2 border-primary">
                      <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
                      <AvatarFallback className="bg-primary text-white">
                        {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.user_metadata?.full_name || 'My Account'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/cart')}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart ({itemCount})
                </DropdownMenuItem>
                {user?.app_metadata?.provider === 'email' ? (
                  <DropdownMenuItem onClick={() => navigate('/manage-experiences')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Experiences
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant={isScrolled || !isDarkPage ? "default" : "outline"}
              className={cn(
                "transition-all font-medium",
                isScrolled || !isDarkPage 
                  ? "bg-primary text-white hover:bg-primary/90" 
                  : "border-white text-white hover:bg-white/10"
              )}
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          )}
        </div>

        <div className="md:hidden flex items-center space-x-3">
          <button 
            onClick={toggleSearch}
            className={cn(
              "p-2 rounded-full transition-colors",
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/cart"
            className={cn(
              "p-2 rounded-full transition-colors relative",
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
            aria-label="Shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "p-2 rounded-full transition-colors",
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Search Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity z-50",
            searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="container max-w-2xl mx-auto pt-28 px-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search for experiences..."
                className="pl-10 pr-4 py-6 text-lg rounded-xl"
                autoFocus={searchOpen}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 bg-white/10 backdrop-blur-md rounded-xl overflow-hidden divide-y divide-white/10">
                {searchResults.map(result => (
                  <div 
                    key={result.id}
                    onClick={() => handleSearchResultClick(result.id)}
                    className="flex p-4 hover:bg-white/20 cursor-pointer transition-colors"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden mr-4 flex-shrink-0">
                      <img 
                        src={result.imageUrl} 
                        alt={result.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{result.title}</h4>
                      <p className="text-white/70 text-sm truncate">{result.location}</p>
                    </div>
                  </div>
                ))}
                <div className="p-4 text-center">
                  <button
                    onClick={() => {
                      setSearchOpen(false);
                      navigate(`/experiences?search=${encodeURIComponent(searchQuery)}`);
                    }}
                    className="text-primary hover:underline text-sm"
                  >
                    See all results
                  </button>
                </div>
              </div>
            )}
            
            {/* Popular Searches */}
            <div className="mt-6 text-white">
              <p className="text-sm text-gray-400 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Hot Air Balloon", "Dining", "Yacht", "Spa Day", "Adventure"].map((term) => (
                  <span 
                    key={term} 
                    className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 cursor-pointer"
                    onClick={() => {
                      setSearchQuery(term);
                    }}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out md:hidden z-40",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full pt-20 px-6">
            <NavigationLinks 
              isDarkPage={false}
              isScrolled={true}
              isMobile={true}
              closeMobileMenu={() => setMobileMenuOpen(false)}
            />
            
            <div className="mt-auto mb-10">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3 py-4" onClick={handleProfileClick}>
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="h-10 w-10 rounded-full border-2 border-primary"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{user?.user_metadata?.full_name || 'User'}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              ) : (
                <>
                  <Button className="w-full mb-4" onClick={() => {
                    signInWithGoogle();
                    setMobileMenuOpen(false);
                  }}>Sign In</Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
