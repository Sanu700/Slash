import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="flex flex-col space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
        {/* Back Button */}
        <button
          onClick={closeMobileMenu}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-2"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back
        </button>

        <Link 
          to="/experiences" 
          className={cn(mobileClass, "text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary")}
          onClick={closeMobileMenu}
        >
          All Experiences
        </Link>
        
        {/* Company Dropdown */}
        <div className={cn(mobileClass, "text-gray-900 dark:text-gray-100")}>
          <button
            onClick={() => toggleDropdown('company')}
            className="flex justify-between items-center w-full font-medium"
          >
            Company
            <ChevronLeft className={cn("w-5 h-5 transition-transform", openDropdown === 'company' ? 'rotate-90' : '')} />
          </button>
          {openDropdown === 'company' && (
            <div className="pl-4 mt-2 flex flex-col space-y-3 text-base">
              <Link to="/about-us" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">About Us</Link>
              <Link to="/how-it-works" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">How It Works</Link>
              <Link to="/testimonials" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">Testimonials</Link>
              <Link to="/careers" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">Careers</Link>
              <Link to="/press" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">Press</Link>
            </div>
          )}
        </div>
        
        {/* Support Dropdown */}
        <div className={cn(mobileClass, "text-gray-900 dark:text-gray-100")}>
          <button
            onClick={() => toggleDropdown('support')}
            className="flex justify-between items-center w-full font-medium"
          >
            Support
            <ChevronLeft className={cn("w-5 h-5 transition-transform", openDropdown === 'support' ? 'rotate-90' : '')} />
          </button>
          {openDropdown === 'support' && (
            <div className="pl-4 mt-2 flex flex-col space-y-3 text-base">
              <Link to="/contact" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">Contact Us</Link>
              <Link to="/faq" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">FAQ</Link>
              <Link to="/gift-rules" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">Gift Rules</Link>
              <Link to="/shipping" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">Shipping</Link>
              <Link to="/returns" onClick={closeMobileMenu} className="hover:text-primary dark:hover:text-primary">Returns</Link>
            </div>
          )}
        </div>
        
        <Link 
          to="/gifting-guide" 
          className={cn(mobileClass, "text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary")}
          onClick={closeMobileMenu}
        >
          Gifting Guide
        </Link>
        <Link 
          to="/gift-personalizer" 
          className={cn(mobileClass, "text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary")}
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
                  : "text-gray-900 hover:bg-gray-100/20"
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
                  : "text-gray-900 hover:bg-gray-100/20"
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
                  : "text-gray-900 hover:bg-gray-100/20"
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
