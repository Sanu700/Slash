import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavigationLinks } from './NavigationLinks';
import { Search } from '@/components/ui/search';
import { CartButton } from '@/components/ui/cart-button';
import { UserMenu } from '@/components/ui/user-menu';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

interface NavbarProps {
  isDarkPage?: boolean;
  className?: string;
}

export function Navbar({ isDarkPage = false, className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      isScrolled || !isDarkPage 
        ? "bg-white dark:bg-gray-900 shadow-md" 
        : "bg-transparent",
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className={cn(
              "text-2xl font-bold",
              isScrolled || !isDarkPage 
                ? "text-gray-900 dark:text-white" 
                : "text-white"
            )}
          >
            Slash
          </Link>

          {/* Desktop Navigation */}
          <NavigationLinks 
            isDarkPage={isDarkPage} 
            isScrolled={isScrolled} 
          />

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <Search className={cn(
              "w-64",
              isScrolled || !isDarkPage 
                ? "text-gray-900 dark:text-white" 
                : "text-white",
              "[&_input]:h-10 [&_input]:py-2 [&_input]:text-base"
            )} />
            <CartButton className={cn(
              isScrolled || !isDarkPage 
                ? "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "text-white hover:bg-white/10"
            )} />
            <UserMenu className={cn(
              isScrolled || !isDarkPage 
                ? "text-gray-900 dark:text-white" 
                : "text-white"
            )} />
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "md:hidden",
                  isScrolled || !isDarkPage 
                    ? "text-gray-900 dark:text-white" 
                    : "text-white"
                )}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link 
                    to="/" 
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                    onClick={closeMobileMenu}
                  >
                    Slash
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={closeMobileMenu}
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <NavigationLinks 
                    isDarkPage={isDarkPage} 
                    isScrolled={isScrolled}
                    isMobile
                    closeMobileMenu={closeMobileMenu}
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
                  <div className="flex flex-col space-y-4">
                    <Search className={cn(
                      "w-full",
                      "[&_input]:h-10 [&_input]:py-2 [&_input]:text-base"
                    )} />
                    <div className="flex items-center justify-between">
                      <CartButton className="flex-1" />
                      <UserMenu className="flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
