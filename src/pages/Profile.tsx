import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Package, CreditCard, Settings, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Profile = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState(user?.user_metadata?.full_name || 'User');
  const [avatar, setAvatar] = React.useState(user?.user_metadata?.avatar_url || '/default-avatar.png');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 md:grid-cols-[300px_1fr]">
            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatar} />
                      <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <div className="text-xl font-bold">{name}</div>
                      <div className="text-sm text-muted-foreground">{user?.email}</div>
                    </div>
                    <Button onClick={() => setShowModal(true)} variant="outline" className="w-full">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Heart className="h-4 w-4" />
                      Wishlist
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Package className="h-4 w-4" />
                      My Orders
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <CreditCard className="h-4 w-4" />
                      Payment Methods
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
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
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="orders" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="orders">Orders</TabsTrigger>
                      <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="orders" className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        No orders yet
                      </div>
                    </TabsContent>
                    <TabsContent value="wishlist" className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        Your wishlist is empty
                      </div>
                    </TabsContent>
                    <TabsContent value="settings" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Email</label>
                          <Input value={user?.email || ''} disabled />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Name</label>
                          <Input value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Avatar URL</label>
                          <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} />
                        </div>
                        <Button className="w-full">Save Changes</Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <label className="block mb-2 font-medium">Avatar URL</label>
                <Input value={avatar} onChange={e => setAvatar(e.target.value)} />
              </div>
              <Button onClick={() => setShowModal(false)} className="w-full">Save</Button>
              <Button variant="outline" onClick={() => setShowModal(false)} className="w-full">Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile; 