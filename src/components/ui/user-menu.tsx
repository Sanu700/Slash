import { LogOut, User, Settings, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/contexts/CartContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserMenuProps {
  className?: string;
}

export const UserMenu = ({ className }: UserMenuProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:outline-none">
          {user?.user_metadata?.avatar_url ? (
            <Avatar className="h-8 w-8 cursor-pointer border-2 border-primary">
              <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
              <AvatarFallback className="bg-primary text-white">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer">
              <User className="h-4 w-4" />
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {user?.user_metadata?.full_name || 'My Account'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/cart')}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Cart ({itemCount})
        </DropdownMenuItem>
        {user?.app_metadata?.provider === 'email' ? (
          <DropdownMenuItem onClick={() => navigate('/manage-experiences')}>
            <Settings className="mr-2 h-4 w-4" />
            Manage Experiences
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} className="text-red-500 focus:text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 