import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationLinks } from './NavigationLinks';
import { cn } from '@/lib/utils';
import { scrollToTop } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
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
  const [isDarkPage, setIsDarkPage] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, signInWithGoogle } = useAuth();
  const [itemCount, setItemCount] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current page has dark background
  useEffect(() => {
    const checkDarkPage = () => {
      const path = window.location.pathname;
      const darkPages = ['/', '/about', '/how-it-works', '/testimonials', '/careers', '/press'];
      setIsDarkPage(darkPages.includes(path));
    };
    checkDarkPage();
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const navbarBgClass = cn(
    'transition-all duration-300',
    isScrolled 
      ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm' 
      : isDarkPage 
        ? 'bg-transparent' 
        : 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'
  );

  const logoTextClass = cn(
    'font-medium text-lg sm:text-xl transition-colors',
    isScrolled || !isDarkPage 
      ? 'text-gray-900 dark:text-white' 
      : 'text-white'
  );

  const iconClass = cn(
    'transition-colors',
    isScrolled || !isDarkPage 
      ? 'text-gray-900 dark:text-white' 
      : 'text-white'
  );

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ease-in-out px-4 sm:px-6 md:px-10 py-3 sm:py-4',
        navbarBgClass
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-50" onClick={scrollToTop}>
          <img 
            src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
            alt="Slash logo" 
            className="h-7 w-7 sm:h-8 sm:w-8" 
          />
          <span className={cn(logoTextClass, "hidden sm:inline")}>
            Slash
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavigationLinks 
            isDarkPage={isDarkPage} 
            isScrolled={isScrolled} 
          />

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className={cn(
                "hidden sm:flex",
                isScrolled || !isDarkPage 
                  ? "text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-white/80" 
                  : "text-white hover:text-white/80"
              )}
              asChild
            >
              <Link to="/host" onClick={scrollToTop}>Host an Experience</Link>
            </Button>

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
                      "transition-all font-medium text-sm sm:text-base",
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
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className={cn("h-5 w-5 sm:h-6 sm:w-6", iconClass)} />
        </button>
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
            <Link to="/" className="flex items-center space-x-2" onClick={scrollToTop}>
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

          {/* Mobile Actions */}
          <div className="p-4 border-t">
            <div className="flex flex-col space-y-4">
              <Button 
                variant="ghost" 
                className="w-full justify-center"
                asChild
              >
                <Link to="/host" onClick={scrollToTop}>Host an Experience</Link>
              </Button>
              <div className="flex items-center justify-between space-x-4">
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
                          "transition-all font-medium text-sm sm:text-base",
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
