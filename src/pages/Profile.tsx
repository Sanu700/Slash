// src/pages/Profile.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrdersTab from '@/components/OrdersTab';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Heart,
  Settings,
  LogOut,
  User,
  ShoppingCart,
} from 'lucide-react';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // which top-level tab is active?
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');

  // local form state for editing
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || '/default-avatar.png'
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container max-w-6xl mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <nav className="w-full md:w-64 flex-shrink-0 space-y-4">
            <Card className="p-4">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setActiveTab('profile')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/wishlist')}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <CardContent className="p-0">
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => setShowModal(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </nav>

          {/* Main Content */}
          <div className="flex-1">
            <Card className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={(value: string) =>
                setActiveTab(value as "profile" | "orders")
                }
              >
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="profile" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-[300px_1fr]">
                    {/* Avatar & Info */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback>
                              {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center">
                            <div className="text-xl font-bold">
                              {name || 'Unnamed User'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {user?.email}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Account Overview Form */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="block mb-1 font-medium">
                            Name
                          </label>
                          <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Avatar URL
                          </label>
                          <Input
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                          />
                        </div>
                        <Button className="w-full">Save Changes</Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* ORDERS TAB */}
                <TabsContent value="orders" className="space-y-6">
                  <OrdersTab />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit-Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Edit Profile</h2>
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Avatar URL</label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  /* you’d also persist these back to Supabase user metadata here */
                  setShowModal(false);
                }}
              >
                Save
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
