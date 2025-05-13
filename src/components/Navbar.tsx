import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, Gift, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/auth';
import { NavigationLinks } from '@/components/NavigationLinks';
import { Search } from '@/components/ui/search';
import { CartButton } from '@/components/ui/cart-button';
import { UserMenu } from '@/components/ui/user-menu';
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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchOpen(false);
    navigate(`/experiences?search=${encodeURIComponent(query)}`);
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
          <CartButton 
            className={cn(
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
          />
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <Button 
              variant={isScrolled || !isDarkPage ? "default" : "secondary"}
              className={cn(
                "transition-all font-medium",
                !isScrolled && isDarkPage && "bg-white text-gray-900 hover:bg-gray-100"
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
          <CartButton 
            className={cn(
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
          />
          <button
            onClick={toggleMobileMenu}
            className={cn(
              "p-2 rounded-full transition-colors",
              isScrolled || !isDarkPage
                ? "hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "hover:bg-white/10",
              iconClass
            )}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="max-w-2xl mx-auto mt-20 px-4">
            <Search
              onSubmit={handleSearchSubmit}
              onResultClick={handleSearchResultClick}
              className="w-full"
            />
          </div>
          <button
            onClick={toggleSearch}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
            aria-label="Close search"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-800">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <NavigationLinks
                  isDarkPage={false}
                  isScrolled={true}
                  className="flex flex-col space-y-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
