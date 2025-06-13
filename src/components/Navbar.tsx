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
    ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm"
    : "bg-black/50 backdrop-blur-md";
    
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
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out px-4 sm:px-6 md:px-10 py-3 sm:py-4',
        navbarBgClass
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-50">
          <img 
            src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
            alt="Slash logo" 
            className="h-7 w-7 sm:h-8 sm:w-8" 
          />
          <span className={cn(logoTextClass, "hidden sm:inline")}>
            Slash
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 z-50"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className={cn("h-5 w-5 sm:h-6 sm:w-6", iconClass)} />
          ) : (
            <Menu className={cn("h-5 w-5 sm:h-6 sm:w-6", iconClass)} />
          )}
        </button>

        <NavigationLinks 
          isDarkPage={isDarkPage} 
          isScrolled={isScrolled} 
        />

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/host-experience"
            className={cn(
              "px-4 py-2 rounded-lg transition-colors font-medium",
              isScrolled || !isDarkPage
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                : "bg-orange-100/90 text-orange-600 hover:bg-orange-200/90"
            )}
          >
            Host an Experience
          </Link>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={isScrolled || !isDarkPage ? "default" : "secondary"}
                  className={cn(
                    "transition-all font-medium",
                    !isScrolled && isDarkPage && "bg-white text-gray-900 hover:bg-gray-100"
                  )}
                >
                  Sign In
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Sign In Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignIn}>
                  <User className="mr-2 h-4 w-4" />
                  Sign in with Google
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/admin/login')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Admin Login
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            to="/host-experience"
            className={cn(
              "px-3 py-1.5 rounded-lg transition-colors font-medium text-sm",
              isScrolled || !isDarkPage
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                : "bg-orange-100/90 text-orange-600 hover:bg-orange-200/90"
            )}
          >
            Host
          </Link>
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
        </div>

        {/* Search Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity z-50",
            searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="container max-w-3xl mx-auto px-4 sm:px-6 md:px-10 pt-20">
            <div className="relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search experiences..."
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={toggleSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              {searchResults.length > 0 && (
                <div className="mt-4 bg-white/10 rounded-lg overflow-hidden">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearchResultClick(result.id)}
                      className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-white/70">{result.location}</div>
                    </button>
                  ))}
                </div>
              )}

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
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out md:hidden",
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
                  alt="Slash logo" 
                  className="h-7 w-7 sm:h-8 sm:w-8" 
                />
                <span className={logoTextClass}>Slash</span>
              </Link>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className={cn("h-5 w-5 sm:h-6 sm:w-6", iconClass)} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <NavigationLinks 
                isDarkPage={isDarkPage} 
                isScrolled={isScrolled}
                isMobile={true}
                closeMobileMenu={toggleMobileMenu}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
