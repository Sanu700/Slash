import { Link } from 'react-router-dom';
import { scrollToTop } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface NavLinkProps extends ButtonHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export const NavLink = ({ 
  to, 
  children, 
  className,
  variant = 'default',
  ...props 
}: NavLinkProps) => {
  return (
    <Link
      to={to}
      onClick={scrollToTop}
      className={cn(
        'transition-colors',
        variant === 'default' 
          ? 'text-gray-800 dark:text-gray-200 hover:text-primary dark:hover:text-primary'
          : 'text-white hover:text-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}; 