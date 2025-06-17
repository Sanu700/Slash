import { useState } from 'react';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { 
  Separator
} from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Slash, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { scrollToTop } from '@/lib/animations';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterDialog, FilterOptions } from '@/components/FilterDialog';

const Footer = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    // Navigate to All Experiences with category filter
    navigate('/experiences', {
      state: {
        initialFilters: {
          priceRange: [0, 100000],
          categories: [category],
          experienceTypes: {
            romantic: false,
            adventurous: false,
            group: false,
            trending: false,
            featured: false,
          },
          duration: 'any',
          location: 'any'
        }
      }
    });
  };

  const handleAllExperiencesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollToTop();
    navigate('/experiences', {
      state: {
        initialFilters: null
      }
    });
  };

  const footerLinks = [
    {
      title: "Experiences",
      links: [
        { name: "All Experiences", href: "/experiences" },
        { name: "Adventure", category: "Adventure", href: "/experiences" },
        { name: "Dining", category: "Dining", href: "/experiences" },
        { name: "Wellness", category: "Wellness", href: "/experiences" },
        { name: "Luxury", category: "Luxury", href: "/experiences" },
        { name: "Learning", category: "Learning", href: "/experiences" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about-us" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Gift Rules", href: "/gift-rules" },
        { name: "Shipping", href: "/shipping" },
        { name: "Returns", href: "/returns" }
      ]
    }
  ];
  
  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: '#'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: '#'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://x.com/social_slashexp?t=2hMgiF7n9Z-6px4AIhXhgA&s=09'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://www.linkedin.com/company/slash-adbc/'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: '#'
    }
  ];

  return (
    <footer 
      ref={ref} 
      className="pt-16 pb-8 bg-secondary/30"
    >
      <div className="container max-w-6xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and About */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6" onClick={scrollToTop}>
              <img 
                src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
                alt="Slash logo" 
                className="h-8 w-8" 
              />
              <span className="font-medium text-xl">Slash</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Curated experience gifts that create lasting memories. We believe in the power of experiences over material possessions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <TooltipProvider key={social.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a 
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <social.icon className="h-4 w-4" />
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{social.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-medium mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => {
                  if (link.name === "All Experiences") {
                    return (
                      <li key={link.name}>
                        <Link 
                          to={link.href}
                          onClick={handleAllExperiencesClick}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  }
                  if (link.category) {
                    return (
                      <li key={link.name}>
                        <Link 
                          to={link.href}
                          onClick={(e) => {
                            e.preventDefault();
                            scrollToTop();
                            handleCategoryClick(link.category);
                          }}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  }
                  return (
                    <li key={link.name}>
                      <Link 
                        to={link.href}
                        onClick={scrollToTop}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between text-sm text-muted-foreground">
          <div className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Slash. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy-policy" onClick={scrollToTop} className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" onClick={scrollToTop} className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" onClick={scrollToTop} className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
