import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';

interface CartButtonProps {
  className?: string;
  iconClassName?: string;
  showCount?: boolean;
}

export const CartButton = ({
  className,
  iconClassName,
  showCount = true
}: CartButtonProps) => {
  const { itemCount } = useCart();

  return (
    <Link 
      to="/cart"
      className={cn(
        "p-2 rounded-full transition-colors relative",
        className
      )}
      aria-label="Shopping cart"
    >
      <ShoppingCart className={cn("h-5 w-5", iconClassName)} />
      {showCount && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Link>
  );
}; 