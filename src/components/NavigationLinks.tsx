import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { scrollToTop } from '@/lib/animations';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ChevronLeft } from 'lucide-react';

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
          className={cn(
            "px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
            "font-medium transition-colors"
          )}
          onClick={() => {
            closeMobileMenu();
            scrollToTop();
          }}
        >
          All Experiences
        </Link>
        
        {/* Company Dropdown */}
        <div className="space-y-2">
          <button
            onClick={() => toggleDropdown('company')}
            className="w-full flex justify-between items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
          >
            Company
            <ChevronLeft className={cn("w-5 h-5 transition-transform", openDropdown === 'company' ? 'rotate-90' : '')} />
          </button>
          {openDropdown === 'company' && (
            <div className="pl-4 space-y-2">
              <Link to="/about-us" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">About Us</Link>
              <Link to="/how-it-works" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">How It Works</Link>
              <Link to="/testimonials" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Testimonials</Link>
              <Link to="/careers" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Careers</Link>
              <Link to="/press" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Press</Link>
            </div>
          )}
        </div>
        
        {/* Support Dropdown */}
        <div className="space-y-2">
          <button
            onClick={() => toggleDropdown('support')}
            className="w-full flex justify-between items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 font-medium"
          >
            Support
            <ChevronLeft className={cn("w-5 h-5 transition-transform", openDropdown === 'support' ? 'rotate-90' : '')} />
          </button>
          {openDropdown === 'support' && (
            <div className="pl-4 space-y-2">
              <Link to="/contact" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Contact Us</Link>
              <Link to="/faq" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">FAQ</Link>
              <Link to="/gift-rules" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Gift Rules</Link>
              <Link to="/shipping" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Shipping</Link>
              <Link to="/returns" onClick={() => { closeMobileMenu(); scrollToTop(); }} className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">Returns</Link>
            </div>
          )}
        </div>
        
        <Link 
          to="/gifting-guide" 
          className={cn(
            "px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
            "font-medium transition-colors"
          )}
          onClick={() => {
            closeMobileMenu();
            scrollToTop();
          }}
        >
          Gifting Guide
        </Link>
        
        <Link 
          to="/gift-personalizer" 
          className={cn(
            "px-4 py-3 rounded-lg text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800",
            "font-medium transition-colors"
          )}
          onClick={() => {
            closeMobileMenu();
            scrollToTop();
          }}
        >
          Gift Personalizer
        </Link>
      </div>
    );
  }

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink 
            asChild 
            className={navigationMenuTriggerStyle()}
          >
            <Link 
              to="/experiences" 
              className={cn(
                navigationMenuTriggerStyle(),
                isScrolled || !isDarkPage 
                  ? "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" 
                  : "text-gray-900 hover:bg-gray-100/20"
              )}
              onClick={scrollToTop}
            >
              All Experiences
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        {/* Company Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger 
            className={cn(
              navigationMenuTriggerStyle(),
              isScrolled || !isDarkPage 
                ? "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "text-gray-900 hover:bg-gray-100/20"
            )}
          >
            Company
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/about-us"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">About Us</div>
                    <p className="text-sm text-muted-foreground">Learn more about our mission and team</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/how-it-works"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">How It Works</div>
                    <p className="text-sm text-muted-foreground">The process of booking and gifting experiences</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/testimonials"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Testimonials</div>
                    <p className="text-sm text-muted-foreground">What our customers say about us</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/careers"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Careers</div>
                    <p className="text-sm text-muted-foreground">Join our growing team</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/press"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Press</div>
                    <p className="text-sm text-muted-foreground">Media coverage and press releases</p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        {/* Support Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={cn(
              navigationMenuTriggerStyle(),
              isScrolled || !isDarkPage 
                ? "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" 
                : "text-gray-900 hover:bg-gray-100/20"
            )}
          >
            Support
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/contact"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Contact Us</div>
                    <p className="text-sm text-muted-foreground">Get in touch with our support team</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/faq"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">FAQ</div>
                    <p className="text-sm text-muted-foreground">Frequently asked questions</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/gift-rules"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Gift Rules</div>
                    <p className="text-sm text-muted-foreground">Understanding our gifting policies</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/shipping"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Shipping</div>
                    <p className="text-sm text-muted-foreground">Shipping information and policies</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/returns"
                    onClick={scrollToTop}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Returns</div>
                    <p className="text-sm text-muted-foreground">Return and refund policies</p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink 
            asChild 
            className={navigationMenuTriggerStyle()}
          >
            <Link 
              to="/gifting-guide" 
              className={cn(
                navigationMenuTriggerStyle(),
                isScrolled || !isDarkPage 
                  ? "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" 
                  : "text-gray-900 hover:bg-gray-100/20"
              )}
              onClick={scrollToTop}
            >
              Gifting Guide
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuLink 
            asChild 
            className={navigationMenuTriggerStyle()}
          >
            <Link 
              to="/gift-personalizer" 
              className={cn(
                navigationMenuTriggerStyle(),
                isScrolled || !isDarkPage 
                  ? "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800" 
                  : "text-gray-900 hover:bg-gray-100/20"
              )}
              onClick={scrollToTop}
            >
              Gift Personalizer
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
