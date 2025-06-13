import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { scrollToTop } from '@/lib/animations';
import { ChevronDown } from 'lucide-react';

interface NavigationLinksProps {
  isDarkPage: boolean;
  isScrolled: boolean;
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

export function NavigationLinks({ 
  isDarkPage, 
  isScrolled, 
  isMobile = false,
  closeMobileMenu = () => {}
}: NavigationLinksProps) {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  // Create consistent link styling based on background context
  // Always ensure good contrast with the background
  const linkClass = cn(
    "transition-colors font-medium",
    isScrolled || !isDarkPage 
      ? "text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary" 
      : "text-white hover:text-gray-200"
  );

  const mobileClass = "py-2 border-b border-gray-100 dark:border-gray-800";

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4">
        <Link 
          to="/experiences" 
          onClick={() => { closeMobileMenu(); scrollToTop(); }}
          className={cn(linkClass, "text-lg")}
        >
          Experiences
        </Link>
        
        <div>
          <button
            onClick={() => toggleDropdown('company')}
            className={cn(linkClass, "flex items-center justify-between w-full text-lg")}
          >
            Company
            <ChevronDown className={cn("h-5 w-5 transition-transform", openDropdown === 'company' && "rotate-180")} />
          </button>
          {openDropdown === 'company' && (
            <div className="pl-4 space-y-2 mt-2">
              <Link to="/about" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>About Us</Link>
              <Link to="/how-it-works" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>How It Works</Link>
              <Link to="/testimonials" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>Testimonials</Link>
              <Link to="/careers" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>Careers</Link>
              <Link to="/press" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>Press</Link>
            </div>
          )}
        </div>

        <div>
          <button
            onClick={() => toggleDropdown('support')}
            className={cn(linkClass, "flex items-center justify-between w-full text-lg")}
          >
            Support
            <ChevronDown className={cn("h-5 w-5 transition-transform", openDropdown === 'support' && "rotate-180")} />
          </button>
          {openDropdown === 'support' && (
            <div className="pl-4 space-y-2 mt-2">
              <Link to="/contact" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>Contact Us</Link>
              <Link to="/faq" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>FAQ</Link>
              <Link to="/gift-rules" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>Gift Rules</Link>
              <Link to="/shipping" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>Shipping</Link>
              <Link to="/returns" onClick={() => { closeMobileMenu(); scrollToTop(); }} className={cn(linkClass, "block")}>Returns</Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/experiences" onClick={scrollToTop} className={linkClass}>
        Experiences
      </Link>
      
      <div className="relative group">
        <button className={cn(linkClass, "flex items-center space-x-1")}>
          <span>Company</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="absolute top-full left-0 w-48 py-2 mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <Link to="/about" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">About Us</Link>
          <Link to="/how-it-works" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">How It Works</Link>
          <Link to="/testimonials" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Testimonials</Link>
          <Link to="/careers" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Careers</Link>
          <Link to="/press" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Press</Link>
        </div>
      </div>

      <div className="relative group">
        <button className={cn(linkClass, "flex items-center space-x-1")}>
          <span>Support</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className="absolute top-full left-0 w-48 py-2 mt-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <Link to="/contact" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Contact Us</Link>
          <Link to="/faq" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">FAQ</Link>
          <Link to="/gift-rules" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Gift Rules</Link>
          <Link to="/shipping" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Shipping</Link>
          <Link to="/returns" onClick={scrollToTop} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">Returns</Link>
        </div>
      </div>
    </div>
  );
}
