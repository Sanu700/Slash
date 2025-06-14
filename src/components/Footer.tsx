import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { scrollToTop } from '@/lib/animations';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://x.com/social_slashexp?t=2hMgiF7n9Z-6px4AIhXhgA&s=09',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://www.linkedin.com/company/slash-adbc/',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: '#',
  },
];

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { name: "About Us", to: "/about" },
                { name: "How It Works", to: "/how-it-works" },
                { name: "Testimonials", to: "/testimonials" },
                { name: "Careers", to: "/careers" },
                { name: "Press", to: "/press" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Contact Us", to: "/contact" },
                { name: "FAQ", to: "/faq" },
                { name: "Gift Rules", to: "/gift-rules" },
                { name: "Shipping", to: "/shipping" },
                { name: "Returns", to: "/returns" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Experiences
            </h3>
            <ul className="space-y-3">
              {[
                { name: "All Experiences", to: "/experiences" },
                { name: "Gifting Guide", to: "/gifting-guide" },
                { name: "Gift Personalizer", to: "/gift-personalizer" },
                { name: "Host an Experience", to: "/host-experience" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons with Tooltip */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map(({ name, icon: Icon, url }) => (
                <TooltipProvider key={name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Slash Experiences. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
