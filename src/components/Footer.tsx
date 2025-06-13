import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { scrollToTop } from '@/lib/animations';
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const socialLinks = [
  { name: 'Facebook', href: 'https://facebook.com/slashexperiences', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com/slashexperiences', icon: Twitter },
  { name: 'Instagram', href: 'https://instagram.com/slashexperiences', icon: Instagram },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'YouTube', href: 'https://youtube.com/slashexperiences', icon: Youtube }
];

const footerLinks = [
  {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' }
    ]
  },
  {
    title: 'Support',
    links: [
      { name: 'Help Center', href: '/support' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ', href: '/faq' },
      { name: 'Shipping', href: '/shipping' },
      { name: 'Returns', href: '/returns' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Accessibility', href: '/accessibility' }
    ]
  }
];

const Footer = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <footer 
      ref={ref} 
      className="pt-16 pb-8 bg-secondary/30"
    >
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <p className="text-muted-foreground mb-6 max-w-md text-sm sm:text-base">
              Curated experience gifts that create lasting memories. We believe in the power of experiences over material possessions.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a 
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-medium text-sm sm:text-base mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href} 
                      onClick={scrollToTop}
                      className="text-muted-foreground hover:text-foreground text-sm sm:text-base transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Slash Experiences. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link 
                to="/privacy" 
                onClick={scrollToTop}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Privacy
              </Link>
              <Link 
                to="/terms" 
                onClick={scrollToTop}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Terms
              </Link>
              <Link 
                to="/cookies" 
                onClick={scrollToTop}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
