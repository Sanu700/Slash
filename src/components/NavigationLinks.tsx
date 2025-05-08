
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

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
      <div className="flex flex-col space-y-6 text-xl">
        <Link 
          to="/experiences" 
          className={mobileClass}
          onClick={closeMobileMenu}
        >
          All Experiences
        </Link>
        
        {/* Company Pages Dropdown */}
        <div className="py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="font-medium mb-2">Company</div>
          <div className="pl-4 flex flex-col space-y-3 text-base">
            <Link to="/about-us" onClick={closeMobileMenu}>About Us</Link>
            <Link to="/how-it-works" onClick={closeMobileMenu}>How It Works</Link>
            <Link to="/testimonials" onClick={closeMobileMenu}>Testimonials</Link>
            <Link to="/careers" onClick={closeMobileMenu}>Careers</Link>
            <Link to="/press" onClick={closeMobileMenu}>Press</Link>
          </div>
        </div>
        
        {/* Support Pages Dropdown */}
        <div className="py-2 border-b border-gray-100 dark:border-gray-800">
          <div className="font-medium mb-2">Support</div>
          <div className="pl-4 flex flex-col space-y-3 text-base">
            <Link to="/contact" onClick={closeMobileMenu}>Contact Us</Link>
            <Link to="/faq" onClick={closeMobileMenu}>FAQ</Link>
            <Link to="/gift-rules" onClick={closeMobileMenu}>Gift Rules</Link>
            <Link to="/shipping" onClick={closeMobileMenu}>Shipping</Link>
            <Link to="/returns" onClick={closeMobileMenu}>Returns</Link>
          </div>
        </div>
        
        <Link 
          to="/gifting-guide" 
          className={mobileClass}
          onClick={closeMobileMenu}
        >
          Gifting Guide
        </Link>
        <Link 
          to="/gift-personalizer" 
          className={mobileClass}
          onClick={closeMobileMenu}
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
                  : "text-white hover:bg-white/10"
              )}
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
                : "text-white hover:bg-white/10"
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
                : "text-white hover:bg-white/10"
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
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Gift Rules</div>
                    <p className="text-sm text-muted-foreground">Our gift policies and procedures</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/shipping"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Shipping</div>
                    <p className="text-sm text-muted-foreground">Shipping options and delivery information</p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/returns"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="font-medium">Returns</div>
                    <p className="text-sm text-muted-foreground">Our return and exchange policies</p>
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
                  : "text-white hover:bg-white/10"
              )}
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
                  : "text-white hover:bg-white/10"
              )}
            >
              Gift Personalizer
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
