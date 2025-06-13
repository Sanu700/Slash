import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { scrollToTop } from '@/lib/animations';

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
  closeMobileMenu 
}: NavigationLinksProps) {
  const [companyOpen, setCompanyOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const linkClass = cn(
    "transition-colors",
    isScrolled || !isDarkPage
      ? "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" 
      : "text-white hover:text-gray-200"
  );

  const buttonClass = cn(
    "flex items-center space-x-1 transition-colors",
    isScrolled || !isDarkPage
      ? "text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" 
      : "text-white hover:text-gray-200"
  );

  const dropdownClass = cn(
    "absolute top-full left-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800",
    isScrolled || !isDarkPage
      ? "border-gray-200 dark:border-gray-800" 
      : "border-white/10"
  );

  const dropdownItemClass = cn(
    "block w-full px-4 py-2 text-left transition-colors",
    isScrolled || !isDarkPage
      ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" 
      : "text-white hover:bg-white/10"
  );

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <Link
            to="/experiences"
            onClick={closeMobileMenu}
            className="block text-lg font-medium text-gray-900 dark:text-gray-100"
          >
            All Experiences
          </Link>
          
          <div className="space-y-2">
            <button
              onClick={() => setCompanyOpen(!companyOpen)}
              className="flex items-center justify-between w-full text-lg font-medium text-gray-900 dark:text-gray-100"
            >
              Company
              <ChevronDown className={cn("h-5 w-5 transition-transform", companyOpen && "rotate-180")} />
            </button>
            {companyOpen && (
              <div className="pl-4 space-y-2">
                <Link
                  to="/about"
                  onClick={closeMobileMenu}
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  About Us
                </Link>
                <Link
                  to="/careers"
                  onClick={closeMobileMenu}
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Careers
                </Link>
                <Link
                  to="/press"
                  onClick={closeMobileMenu}
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Press
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSupportOpen(!supportOpen)}
              className="flex items-center justify-between w-full text-lg font-medium text-gray-900 dark:text-gray-100"
            >
              Support
              <ChevronDown className={cn("h-5 w-5 transition-transform", supportOpen && "rotate-180")} />
            </button>
            {supportOpen && (
              <div className="pl-4 space-y-2">
                <Link
                  to="/help"
                  onClick={closeMobileMenu}
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Help Center
                </Link>
                <Link
                  to="/contact"
                  onClick={closeMobileMenu}
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Contact Us
                </Link>
                <Link
                  to="/terms"
                  onClick={closeMobileMenu}
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Terms of Service
                </Link>
                <Link
                  to="/privacy"
                  onClick={closeMobileMenu}
                  className="block text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-8">
      <Link
        to="/experiences"
        onClick={scrollToTop}
        className={linkClass}
      >
        All Experiences
      </Link>
      
      <div className="relative">
        <button
          onClick={() => setCompanyOpen(!companyOpen)}
          className={buttonClass}
        >
          Company
          <ChevronDown className={cn("h-4 w-4 transition-transform", companyOpen && "rotate-180")} />
        </button>
        {companyOpen && (
          <div className={dropdownClass}>
            <Link
              to="/about"
              onClick={() => {
                setCompanyOpen(false);
                scrollToTop();
              }}
              className={dropdownItemClass}
            >
              About Us
            </Link>
            <Link
              to="/careers"
              onClick={() => {
                setCompanyOpen(false);
                scrollToTop();
              }}
              className={dropdownItemClass}
            >
              Careers
            </Link>
            <Link
              to="/press"
              onClick={() => {
                setCompanyOpen(false);
                scrollToTop();
              }}
              className={dropdownItemClass}
            >
              Press
            </Link>
          </div>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => setSupportOpen(!supportOpen)}
          className={buttonClass}
        >
          Support
          <ChevronDown className={cn("h-4 w-4 transition-transform", supportOpen && "rotate-180")} />
        </button>
        {supportOpen && (
          <div className={dropdownClass}>
            <Link
              to="/help"
              onClick={() => {
                setSupportOpen(false);
                scrollToTop();
              }}
              className={dropdownItemClass}
            >
              Help Center
            </Link>
            <Link
              to="/contact"
              onClick={() => {
                setSupportOpen(false);
                scrollToTop();
              }}
              className={dropdownItemClass}
            >
              Contact Us
            </Link>
            <Link
              to="/terms"
              onClick={() => {
                setSupportOpen(false);
                scrollToTop();
              }}
              className={dropdownItemClass}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              onClick={() => {
                setSupportOpen(false);
                scrollToTop();
              }}
              className={dropdownItemClass}
            >
              Privacy Policy
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
