import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Package, CreditCard, Settings, LogOut, User, ShoppingCart } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useNavigate } from 'react-router-dom';
import GiftingHistoryContent from '@/components/profile/GiftHistoryContent';
import { GiftHistory } from '@/lib/data/types';

const Profile = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = React.useState(false);
  const [name, setName] = React.useState(user?.user_metadata?.full_name || 'User');
  const [avatar, setAvatar] = React.useState(user?.user_metadata?.avatar_url || '/default-avatar.png');
  const [activeTab, setActiveTab] = React.useState('profile');
  const navigate = useNavigate();

  // Mock data for demonstration
  const mockGiftHistory: GiftHistory[] = [
    {
      id: 'gift1',
      giftedAt: '2024-06-15T10:30:00Z',
      recipientName: 'Priya Sharma',
      recipientEmail: 'priya@example.com',
      experience: {
        id: 'exp1',
        title: 'Hot Air Balloon Ride',
        description: 'A magical sunrise ride above the city.',
        imageUrl: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
        price: 5000,
        location: 'Jaipur',
        duration: '2 hours',
        participants: '2',
        date: '2024-07-01',
        category: 'adventure',
      },
      message: 'Happy Birthday! Enjoy the skies!'
    },
    {
      id: 'gift2',
      giftedAt: '2024-05-10T15:00:00Z',
      recipientName: 'Rahul Verma',
      recipientEmail: 'rahul@example.com',
      experience: {
        id: 'exp2',
        title: 'Wine Tasting Tour',
        description: 'Explore the best vineyards and taste premium wines.',
        imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
        price: 3500,
        location: 'Nashik',
        duration: '4 hours',
        participants: '1',
        date: '2024-06-20',
        category: 'food',
      },
      message: 'Congratulations on your new job!'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Card className="p-4">
              <div className="space-y-4">
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
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Card className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-6">
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
                </TabsContent>
                <TabsContent value="orders" className="space-y-6">
                  {/* Orders content */}
                </TabsContent>
              </Tabs>
            </Card>
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

      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-1">Gifting History</h2>
        <p className="text-muted-foreground mb-4 text-base">A record of all the experiences you have gifted, including recipient details, date, and your personal message.</p>
        <GiftingHistoryContent giftHistory={mockGiftHistory} />
      </section>
    </div>
  );
};

export default Profile; 