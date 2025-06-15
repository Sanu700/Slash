import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Gift,
  Settings,
  BarChart3,
  LogOut,
  Menu,
  X,
  Tag,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Briefcase,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Dialog } from '@/components/ui/dialog';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [notificationModal, setNotificationModal] = React.useState<{ open: boolean, title: string, time: string, message: string, link?: string }>(
    { open: false, title: '', time: '', message: '' }
  );

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { 
      path: '/admin/users', 
      label: 'Users', 
      icon: Users,
      subItems: [
        { path: '/admin/users/customers', label: 'Customers', icon: User },
        { path: '/admin/users/providers', label: 'Experience Providers', icon: Briefcase }
      ]
    },
    { path: '/admin/experiences', label: 'Experiences', icon: Gift },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const notificationList = [
    { title: 'New user registered', time: '2 minutes ago', message: 'John Doe has joined the platform.', link: '/admin/users/customers' },
    { title: 'Booking received', time: '10 minutes ago', message: 'Sarah Smith booked "Sunset Cruise".', link: '/admin/experiences' },
    { title: 'Payment processed', time: '1 hour ago', message: 'Payment of ₹5,000 received.', link: '/admin/analytics' },
    { title: 'Support ticket replied', time: 'Yesterday', message: 'Support team replied to ticket #1234.', link: '/admin/support' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-white border-r transform transition-all duration-200 ease-in-out",
        isSidebarOpen ? "w-64" : "w-16",
        "lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center border-b px-4">
            {isSidebarOpen ? (
              <Link to="/admin" className="text-xl font-bold text-primary flex-1">
                Admin Panel
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0 mx-auto"
            >
              {isSidebarOpen ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path));
              
              return (
                <div key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-gray-600 hover:bg-gray-100",
                      !isSidebarOpen && "justify-center"
                    )}
                    title={!isSidebarOpen ? item.label : undefined}
                  >
                    <Icon className={cn("h-5 w-5", !isSidebarOpen ? "mr-0" : "mr-3")} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Link>
                  {isSidebarOpen && item.subItems && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm",
                            location.pathname === subItem.path
                              ? "text-primary font-medium"
                              : "text-gray-600 hover:text-gray-900"
                          )}
                        >
                          {subItem.icon && <subItem.icon className="h-4 w-4 mr-2" />}
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className={cn("p-4 border-t", !isSidebarOpen && "flex justify-center")}>
            <div className={cn("flex items-center space-x-3", !isSidebarOpen && "flex-col space-y-2")}>
              <Avatar>
                <AvatarImage src={user?.user_metadata?.avatar_url || '/default-admin-avatar.png'} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {user?.user_metadata?.full_name || 'Admin User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={cn("transition-all duration-200", isSidebarOpen ? "lg:pl-64" : "lg:pl-16")}>
        {/* Header */}
        <header className="h-16 border-b bg-white w-full">
          <div className="h-full px-4 flex items-center justify-between w-full">
            <div className="flex items-center w-full min-w-0">
              <button
                className="lg:hidden mr-4"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="relative flex-1 max-w-xs min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-9 w-full min-w-0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2 font-semibold text-gray-700 border-b">Notifications</div>
                  {notificationList.map((notif, idx) => (
                    <DropdownMenuItem key={idx} onClick={() => setNotificationModal({ open: true, title: notif.title, time: notif.time, message: notif.message, link: notif.link })}>
                      <div>
                        <div className="font-medium">{notif.title}</div>
                        <div className="text-xs text-gray-500">{notif.time}</div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.user_metadata?.avatar_url || '/default-admin-avatar.png'} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/admin/profile')}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      <Dialog open={notificationModal.open} onOpenChange={open => setNotificationModal(modal => ({ ...modal, open }))}>
        {notificationModal.open && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h2 className="text-xl font-bold mb-2">{notificationModal.title}</h2>
              <p className="text-gray-500 mb-2">{notificationModal.time}</p>
              <p className="mb-4">{notificationModal.message}</p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setNotificationModal({ ...notificationModal, open: false })}>Close</Button>
                <Button className="flex-1" onClick={() => {
                  if (notificationModal.link) {
                    setNotificationModal({ ...notificationModal, open: false });
                    navigate(notificationModal.link);
                  } else {
                    setNotificationModal({ ...notificationModal, open: false });
                    toast('No details page for this notification');
                  }
                }}>Go to details</Button>
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default AdminLayout;
