
import { useState } from 'react';
import { useInView } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { 
  Separator
} from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Slash, Instagram, Facebook, Twitter, Linkedin, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  
  const footerLinks = [
    {
      title: "Experiences",
      links: [
        { name: "All Experiences", href: "/experiences" },
        { name: "Adventure", href: "/category/adventure" },
        { name: "Dining", href: "/category/dining" },
        { name: "Wellness", href: "/category/wellness" },
        { name: "Luxury", href: "/category/luxury" },
        { name: "Learning", href: "/category/learning" }
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
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" }
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
            <Link to="/" className="flex items-center space-x-2 mb-6">
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
                <a 
                  key={social.name}
                  href={social.href}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-medium mb-4">{column.title}</h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
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
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
