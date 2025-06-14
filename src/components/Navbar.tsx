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
  const { isAuthenticated, user, logout, signInWithGoogle, login } = useAuth();
  const { toast } = useToast();
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

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

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(adminId, adminPassword);
    setShowLoginDropdown(false);
  };

  return (
    <nav className={cn('fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4', navbarBgClass)}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-10" onClick={scrollToTop}>
          <img src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" alt="Slash logo" className="h-8 w-8" />
          <span className={cn("font-medium text-xl transition-colors", isScrolled || !isDarkPage ? "text-gray-800 dark:text-gray-200" : "text-white")}>
            Slash
          </span>
        </Link>

        <div aria-label="Main" data-orientation="horizontal" dir="ltr" className="relative z-10 max-w-max flex-1 items-center justify-center hidden md:flex">
          <ul data-orientation="horizontal" className="group flex flex-1 list-none items-center justify-center space-x-1" dir="ltr">
            <li>
              <Link to="/experiences" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 text-gray-900 hover:bg-gray-100/20" data-radix-collection-item="" onClick={scrollToTop}>
                All Experiences
              </Link>
            </li>
            <li>
              <DropdownMenu open={companyDropdownOpen} onOpenChange={setCompanyDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <button className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50", isScrolled || !isDarkPageProp ? "text-gray-900 hover:bg-gray-100/20" : "text-white hover:bg-white/10")}>
                    Company
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[400px] p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Link to="/about" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/about')}>
                        <div className="font-medium">About Us</div>
                        <p className="text-sm text-muted-foreground">Learn more about our mission and team</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/how-it-works" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/how-it-works')}>
                        <div className="font-medium">How It Works</div>
                        <p className="text-sm text-muted-foreground">The process of booking and gifting experiences</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/testimonials" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/testimonials')}>
                        <div className="font-medium">Testimonials</div>
                        <p className="text-sm text-muted-foreground">What our customers say about us</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/careers" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/careers')}>
                        <div className="font-medium">Careers</div>
                        <p className="text-sm text-muted-foreground">Join our growing team</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/press" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/press')}>
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
                  <button className={cn("group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50", isScrolled || !isDarkPageProp ? "text-gray-900 hover:bg-gray-100/20" : "text-white hover:bg-white/10")}>
                    Support
                    <ChevronDown className="ml-1 h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-[400px] p-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Link to="/contact" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/contact')}>
                        <div className="font-medium">Contact Us</div>
                        <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/faq" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/faq')}>
                        <div className="font-medium">FAQ</div>
                        <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/gift-rules" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/gift-rules')}>
                        <div className="font-medium">Gift Rules</div>
                        <p className="text-sm text-muted-foreground">Understanding our gifting policies</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/shipping" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/shipping')}>
                        <div className="font-medium">Shipping</div>
                        <p className="text-sm text-muted-foreground">Information about delivery options</p>
                      </Link>
                    </div>
                    <div className="space-y-1">
                      <Link to="/returns" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground" onClick={() => handleNavigation('/returns')}>
                        <div className="font-medium">Returns</div>
                        <p className="text-sm text-muted-foreground">Our return and refund policy</p>
                      </Link>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
            <li>
              <Link to="/gifting-guide" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 text-gray-900 hover:bg-gray-100/20" data-radix-collection-item="" onClick={scrollToTop}>
                Gifting Guide
              </Link>
            </li>
            <li>
              <Link to="/gift-personalizer" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 text-gray-900 hover:bg-gray-100/20" data-radix-collection-item="" onClick={scrollToTop}>
                Gift Personalizer
              </Link>
            </li>
          </ul>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button onClick={toggleSearch} className={cn("p-2 rounded-full transition-colors", isScrolled || !isDarkPage ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "hover:bg-white/10", iconClass)} aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/cart" className={cn("p-2 rounded-full transition-colors relative", isScrolled || !isDarkPage ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "hover:bg-white/10", iconClass)} aria-label="Shopping cart" onClick={scrollToTop}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link to="/host-experience" className={cn("px-4 py-2 rounded-full font-medium transition-colors", isScrolled || !isDarkPage ? "bg-primary text-white hover:bg-primary/90" : "bg-white text-gray-900 hover:bg-gray-100")} onClick={scrollToTop}>
            Host an Experience
          </Link>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email || ''} />
                      <AvatarFallback>{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
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
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/experience-manager')}>
                    <span>My Experiences</span>
                  </DropdownMenuItem>
                  {user?.user_metadata?.isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu open={showLoginDropdown} onOpenChange={setShowLoginDropdown}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Sign in</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 p-4" align="end">
                  <div className="space-y-4">
                    <Button onClick={() => signInWithGoogle()} className="w-full" variant="outline">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Sign in with Google
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or</span>
                      </div>
                    </div>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                      <div>
                        <label htmlFor="adminId" className="block text-sm font-medium text-gray-700">Admin ID</label>
                        <input
                          id="adminId"
                          type="text"
                          value={adminId}
                          onChange={(e) => setAdminId(e.target.value)}
                          required
                          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                          id="adminPassword"
                          type="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          required
                          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Admin Login
                      </Button>
                    </form>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <div className="flex md:hidden items-center space-x-4">
          <Link to="/host-experience" className={cn("px-3 py-1.5 rounded-lg transition-colors font-medium text-sm", isScrolled || !isDarkPage ? "bg-orange-100 text-orange-600 hover:bg-orange-200" : "bg-orange-100/90 text-orange-600 hover:bg-orange-200/90")} onClick={scrollToTop}>
            Host
          </Link>
          <button onClick={toggleSearch} className={cn("p-2 rounded-full transition-colors", isScrolled || !isDarkPage ? "hover:bg-gray-100 dark:hover:bg-gray-800" : "hover:bg-white/10", iconClass)} aria-label="Search">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/cart" className="p-2 rounded-full relative hover:bg-white/10 transition-colors text-white hover:text-gray-200" aria-label="Shopping cart" onClick={scrollToTop}>
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-white/10 transition-colors text-white hover:text-gray-200" aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={cn("fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity z-50", searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}>
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
            <button type="button" onClick={toggleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
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
      <div className={cn("fixed inset-0 bg-white dark:bg-gray-900 transition-transform duration-300 ease-in-out md:hidden z-40", mobileMenuOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex flex-col h-full pt-20 px-6">
          <div className="flex flex-col space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <button onClick={toggleMobileMenu} className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-2">
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back
            </button>
            <Link to="/experiences" onClick={() => { scrollToTop(); toggleMobileMenu(); }} className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary">
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
            <Link to="/gifting-guide" onClick={() => { scrollToTop(); toggleMobileMenu(); }} className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary">
              Gifting Guide
            </Link>
            <Link to="/gift-personalizer" onClick={() => { scrollToTop(); toggleMobileMenu(); }} className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary">
              Gift Personalizer
            </Link>
            <Link to="/host-experience" onClick={() => { scrollToTop(); toggleMobileMenu(); }} className="py-2 border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary">
              Host an Experience
            </Link>
          </div>
          {isAuthenticated && (
            <div className="mt-auto mb-10">
              <div className="flex items-center space-x-3 py-4">
                <img src={user?.user_metadata?.avatar_url} alt="Profile" className="h-10 w-10 rounded-full border-2 border-primary" />
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
