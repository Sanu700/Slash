import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scrollToTop } from '@/lib/animations';

interface NavigationLinksProps {
  isDarkPage?: boolean;
  isScrolled?: boolean;
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const NavigationLinks: React.FC<NavigationLinksProps> = ({
  isDarkPage = false,
  isScrolled = false,
  isMobile = false,
  closeMobileMenu
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const linkClass = cn(
    "transition-colors duration-200",
    isDarkPage && !isScrolled
      ? "text-white hover:text-white/80"
      : "text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-white/80"
  );

  const dropdownClass = cn(
    "absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    isMobile ? "relative mt-0 w-full shadow-none border-none" : ""
  );

  const handleLinkClick = () => {
    if (closeMobileMenu) {
      closeMobileMenu();
    }
    scrollToTop();
  };

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Testimonials', href: '/testimonials' },
    { name: 'Careers', href: '/careers' },
    { name: 'Press', href: '/press' }
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/support' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' }
  ];

  if (isMobile) {
    return (
      <div className="flex flex-col space-y-4">
        <Link to="/" className={cn(linkClass, "text-lg font-medium")} onClick={handleLinkClick}>
          Home
        </Link>
        <Link to="/experiences" className={cn(linkClass, "text-lg font-medium")} onClick={handleLinkClick}>
          Experiences
        </Link>
        <Link to="/gift-personalizer" className={cn(linkClass, "text-lg font-medium")} onClick={handleLinkClick}>
          Gift Personalizer
        </Link>
        <Link to="/gifting-guide" className={cn(linkClass, "text-lg font-medium")} onClick={handleLinkClick}>
          Gifting Guide
        </Link>
        
        {/* Company Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('company')}
            className={cn(
              "flex items-center justify-between w-full text-lg font-medium",
              linkClass
            )}
          >
            Company
            <ChevronDown className={cn(
              "h-5 w-5 transition-transform",
              openDropdown === 'company' ? "transform rotate-180" : ""
            )} />
          </button>
          {openDropdown === 'company' && (
            <div className={cn(dropdownClass, "mt-2")}>
              {companyLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "block px-4 py-2 text-base",
                    linkClass
                  )}
                  onClick={handleLinkClick}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Support Dropdown */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('support')}
            className={cn(
              "flex items-center justify-between w-full text-lg font-medium",
              linkClass
            )}
          >
            Support
            <ChevronDown className={cn(
              "h-5 w-5 transition-transform",
              openDropdown === 'support' ? "transform rotate-180" : ""
            )} />
          </button>
          {openDropdown === 'support' && (
            <div className={cn(dropdownClass, "mt-2")}>
              {supportLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "block px-4 py-2 text-base",
                    linkClass
                  )}
                  onClick={handleLinkClick}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-8">
      <Link to="/" className={linkClass} onClick={scrollToTop}>
        Home
      </Link>
      <Link to="/experiences" className={linkClass} onClick={scrollToTop}>
        Experiences
      </Link>
      <Link to="/gift-personalizer" className={linkClass} onClick={scrollToTop}>
        Gift Personalizer
      </Link>
      <Link to="/gifting-guide" className={linkClass} onClick={scrollToTop}>
        Gifting Guide
      </Link>

      {/* Company Dropdown */}
      <div className="relative group">
        <button
          onClick={() => toggleDropdown('company')}
          className={cn(
            "flex items-center space-x-1",
            linkClass
          )}
        >
          <span>Company</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className={cn(
          dropdownClass,
          "opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
        )}>
          {companyLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "block px-4 py-2 text-sm",
                linkClass
              )}
              onClick={scrollToTop}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Support Dropdown */}
      <div className="relative group">
        <button
          onClick={() => toggleDropdown('support')}
          className={cn(
            "flex items-center space-x-1",
            linkClass
          )}
        >
          <span>Support</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <div className={cn(
          dropdownClass,
          "opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
        )}>
          {supportLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "block px-4 py-2 text-sm",
                linkClass
              )}
              onClick={scrollToTop}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationLinks;
