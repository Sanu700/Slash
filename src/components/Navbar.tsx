import { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingCart, ChevronDown, ChevronLeft, User, Settings, LogOut } from 'lucide-react';
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
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, signInWithGoogle } = useAuth();
  const { toast } = useToast();

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

  const navbarBgClass = isScrolled || !isDarkPage
    ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
    : "bg-black/30 backdrop-blur-md";
    
  const iconClass = cn(
    "transition-colors",
    isScrolled || !isDarkPage
      ? "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" 
      : "text-white hover:text-gray-200"
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
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4',
        navbarBgClass
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-10" onClick={scrollToTop}>
          <img 
            src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
            alt="Slash logo" 
            className="h-8 w-8" 
          />
          <span className={cn(
            "font-medium text-xl transition-colors",
            isScrolled || !isDarkPage
              ? "text-gray-800 dark:text-gray-200" : "text-white"
          )}>
            Slash
          </span>
        </Link>

        <nav aria-label="Main" data-orientation="horizontal" dir="ltr" className="relative z-10 max-w-max flex-1 items-center justify-center hidden md:flex">
          <ul data-orientation="horizontal" className="group flex flex-1 list-none items-center justify-center space-x-1" dir="ltr">
            <li>
              <Link
                to="/experiences"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 text-gray-900 hover:bg-gray-100/20"
                data-radix-collection-item=""
                onClick={scrollToTop}
              >
                All Experiences
              </Link>
            </li>
            <li>
              <DropdownMenu open={companyDropdownOpen} onOpenChange={setCompanyDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      isScrolled || !isDarkPageProp
                        ? "text-gray-900 hover:bg-gray-100/20" 
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    Company
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[400px] p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Link
                        to="/about"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/about')}
                      >
                        <div className="font-medium">About Us</div>
                        <p className="text-sm text-muted-foreground">Learn more about our mission and team</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/how-it-works"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/how-it-works')}
                      >
                        <div className="font-medium">How It Works</div>
                        <p className="text-sm text-muted-foreground">The process of booking and gifting experiences</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/testimonials"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/testimonials')}
                      >
                        <div className="font-medium">Testimonials</div>
                        <p className="text-sm text-muted-foreground">What our customers say about us</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/careers"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/careers')}
                      >
                        <div className="font-medium">Careers</div>
                        <p className="text-sm text-muted-foreground">Join our growing team</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/press"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/press')}
                      >
                        <div className="font-medium">Press</div>
                        <p className="text-sm text-muted-foreground">Media coverage and press releases</p>
                      </Link>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <DropdownMenu open={supportDropdownOpen} onOpenChange={setSupportDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      isScrolled || !isDarkPageProp
                        ? "text-gray-900 hover:bg-gray-100/20" 
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    Support
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[400px] p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Link
                        to="/contact"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/contact')}
                      >
                        <div className="font-medium">Contact Us</div>
                        <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/faq"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/faq')}
                      >
                        <div className="font-medium">FAQ</div>
                        <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/gift-rules"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/gift-rules')}
                      >
                        <div className="font-medium">Gift Rules</div>
                        <p className="text-sm text-muted-foreground">Understanding our gifting policies</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/shipping"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/shipping')}
                      >
                        <div className="font-medium">Shipping</div>
                        <p className="text-sm text-muted-foreground">Information about delivery options</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link
                        to="/returns"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        onClick={() => handleNavigation('/returns')}
                      >
                        <div className="font-medium">Returns</div>
                        <p className="text-sm text-muted-foreground">Our return and refund policy</p>
                      </Link>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link
                to="/gifting-guide"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 text-gray-900 hover:bg-gray-100/20"
                data-radix-collection-item=""
                onClick={scrollToTop}
              >
                Gifting Guide
              </Link>
            </li>
            <li>
              <Link
                to="/gift-personalizer"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 text-gray-900 hover:bg-gray-100/20"
                data-radix-collection-item=""
                onClick={scrollToTop}
              >
                Gift Personalizer
              </Link>
            </li>
          </ul>
        </nav>

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
            onClick={scrollToTop}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            to="/host-experience"
            className={cn(
              "px-4 py-2 rounded-full font-medium transition-colors",
              isScrolled || !isDarkPage
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-white text-gray-900 hover:bg-gray-100"
            )}
            onClick={scrollToTop}
          >
            Host an Experience
          </Link>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
                    <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.user_metadata?.full_name || 'User'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleProfileClick}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" onClick={handleSignIn}>
                Sign in
              </Button>
              <Link to="/admin/login">
                <Button variant="outline">Admin Login</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center space-x-4">
          <Link
            to="/host-experience"
            className={cn(
              "px-3 py-1.5 rounded-lg transition-colors font-medium text-sm",
              isScrolled || !isDarkPage
                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                : "bg-orange-100/90 text-orange-600 hover:bg-orange-200/90"
            )}
            onClick={scrollToTop}
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
            className="p-2 rounded-full relative hover:bg-white/10 transition-colors text-white hover:text-gray-200"
            aria-label="Shopping cart"
            onClick={scrollToTop}
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
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gray-200"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={cn(
        "fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity z-50",
        searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        <div className="container max-w-2xl mx-auto pt-28 px-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Input
              type="search"
              placeholder="Search for experiences..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex h-10 w-full border border-input bg-background px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 pr-4 py-6 text-lg rounded-xl"
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
            <p className="text-sm text-gray-400 mb-3">Popular Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Hot Air Balloon', 'Dining', 'Yacht', 'Spa Day', 'Adventure'].map((term) => (
                <span
                  key={term}
                  onClick={() => {
                    setSearchQuery(term);
                    handleNavigation(`/experiences?search=${encodeURIComponent(term)}`);
                    setSearchOpen(false);
                  }}
                  className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 cursor-pointer"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out md:hidden z-40",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-20 px-6">
          <div className="flex flex-col space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <button
              onClick={toggleMobileMenu}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-2"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <Link
              to="/experiences"
              onClick={() => {
                scrollToTop();
                toggleMobileMenu();
              }}
              className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary"
            >
              All Experiences
            </Link>
            <div className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
              <button className="flex justify-between items-center w-full font-medium">
                Company
                <ChevronLeft className="w-5 h-5 transition-transform" />
              </button>
            </div>
            <div className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100">
              <button className="flex justify-between items-center w-full font-medium">
                Support
                <ChevronLeft className="w-5 h-5 transition-transform" />
              </button>
            </div>
            <Link
              to="/gifting-guide"
              onClick={() => {
                scrollToTop();
                toggleMobileMenu();
              }}
              className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary"
            >
              Gifting Guide
            </Link>
            <Link
              to="/gift-personalizer"
              onClick={() => {
                scrollToTop();
                toggleMobileMenu();
              }}
              className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary"
            >
              Gift Personalizer
            </Link>
            <Link
              to="/host-experience"
              onClick={() => {
                scrollToTop();
                toggleMobileMenu();
              }}
              className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary"
            >
              Host an Experience
            </Link>
          </div>
          {isAuthenticated && (
            <div className="mt-auto mb-10">
              <div className="flex items-center space-x-3 py-4">
                <img 
                  src={user?.user_metadata?.avatar_url} 
                  alt="Profile" 
                  className="h-10 w-10 rounded-full border-2 border-primary"
                />
                <div>
                  <p className="font-medium">{user?.user_metadata?.full_name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
