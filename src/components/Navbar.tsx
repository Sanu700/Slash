
import { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingCart, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-6 md:px-10 py-4',
        isScrolled
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2 z-10">
          <img 
            src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
            alt="Slash logo" 
            className={cn("h-8 w-8 transition-colors")} 
          />
          <span className={cn("font-medium text-xl transition-colors", isScrolled ? "text-primary" : "text-white")}>
            Slash
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a 
            href="#experiences" 
            className={cn(
              "transition-colors hover:text-gray-600 dark:hover:text-gray-300",
              isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
            )}
          >
            Experiences
          </a>
          <a 
            href="#categories" 
            className={cn(
              "transition-colors hover:text-gray-600 dark:hover:text-gray-300",
              isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
            )}
          >
            Categories
          </a>
          <Link 
            to="/gifting-guide" 
            className={cn(
              "transition-colors hover:text-gray-600 dark:hover:text-gray-300",
              isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
            )}
          >
            Gifting Guide
          </Link>
          <Link 
            to="/gift-personalizer" 
            className={cn(
              "transition-colors hover:text-gray-600 dark:hover:text-gray-300",
              isScrolled ? "text-gray-800 dark:text-gray-200" : "text-white"
            )}
          >
            Gift Personalizer
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <button 
            onClick={toggleSearch}
            className={cn(
              "p-2 rounded-full transition-colors",
              isScrolled 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                : "hover:bg-white/10 text-white"
            )}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/cart"
            className={cn(
              "p-2 rounded-full transition-colors relative",
              isScrolled 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                : "hover:bg-white/10 text-white"
            )}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Button 
            variant={isScrolled ? "default" : "outline"}
            className={cn(
              "transition-all",
              !isScrolled && "text-white border-white hover:bg-white/20"
            )}
          >
            Sign In
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-3">
          <button 
            onClick={toggleSearch}
            className={cn(
              "p-2 rounded-full transition-colors",
              isScrolled 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                : "hover:bg-white/10 text-white"
            )}
          >
            <Search className="h-5 w-5" />
          </button>
          <Link 
            to="/cart"
            className={cn(
              "p-2 rounded-full transition-colors relative",
              isScrolled 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                : "hover:bg-white/10 text-white"
            )}
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
              isScrolled 
                ? "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                : "hover:bg-white/10 text-white"
            )}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Search Overlay */}
        <div
          className={cn(
            "fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity z-50",
            searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="container max-w-2xl mx-auto pt-28 px-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search for experiences..."
                className="pl-10 pr-4 py-6 text-lg rounded-xl"
                autoFocus={searchOpen}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <button 
                onClick={toggleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-6 text-white">
              <p className="text-sm text-gray-400 mb-3">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {["Hot Air Balloon", "Dining", "Yacht", "Spa Day", "Adventure"].map((term) => (
                  <span key={term} className="px-3 py-1 bg-white/10 rounded-full text-sm hover:bg-white/20 cursor-pointer">
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
            <div className="flex flex-col space-y-6 text-xl">
              <a 
                href="#experiences" 
                className="py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Experiences
              </a>
              <a 
                href="#categories" 
                className="py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </a>
              <Link 
                to="/gifting-guide" 
                className="py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Gifting Guide
                </div>
              </Link>
              <Link 
                to="/gift-personalizer" 
                className="py-2 border-b border-gray-100 dark:border-gray-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <Gift className="h-5 w-5 mr-2" />
                  Gift Personalizer
                </div>
              </Link>
            </div>
            <div className="mt-auto mb-10">
              <Button className="w-full mb-4">Sign In</Button>
              <Button variant="outline" className="w-full">Register</Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
