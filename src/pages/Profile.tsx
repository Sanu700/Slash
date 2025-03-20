
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data';
import { User, Clock, ShoppingCart, Heart, LogOut, Settings, Edit, Save, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { user, isAuthenticated, isAdmin, logout, updateProfile } = useAuth();
  const { items, cachedExperiences } = useCart();
  const [cartExperiences, setCartExperiences] = useState<Experience[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Get cart experiences from cache
  useEffect(() => {
    const experiences = items
      .map(item => cachedExperiences[item.experienceId])
      .filter(exp => exp !== undefined);
    
    setCartExperiences(experiences);
  }, [items, cachedExperiences]);
  
  // Initialize profile edit form
  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
    }
  }, [user]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Handle click to navigate to experience detail
  const handleExperienceClick = (experienceId: string) => {
    navigate(`/experience/${experienceId}`);
  };
  
  // Handle profile save
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile changes');
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setFullName(user.user_metadata?.full_name || '');
    setAvatarUrl(user.user_metadata?.avatar_url || '');
    setEditMode(false);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Profile Overview */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center text-center">
              {editMode ? (
                <div className="mb-4 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                  <Input 
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="Avatar URL"
                    className="mb-2"
                  />
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24 mt-2">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt="Profile" />
                      ) : (
                        <AvatarFallback className="bg-primary text-white text-xl">
                          {fullName?.charAt(0) || user.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    <AlertCircle className="h-3 w-3 inline-block mr-1" />
                    Preview shown above
                  </div>
                </div>
              ) : (
                <Avatar className="h-24 w-24 mb-4">
                  {user.user_metadata?.avatar_url ? (
                    <AvatarImage src={user.user_metadata.avatar_url} alt="Profile" />
                  ) : (
                    <AvatarFallback className="bg-primary text-white text-xl">
                      {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              )}
              
              {editMode ? (
                <div className="w-full mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
              ) : (
                <>
                  <CardTitle>{user.user_metadata?.full_name || 'User'}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </>
              )}
              
              {editMode && (
                <div className="flex space-x-2 w-full mt-4">
                  <Button 
                    onClick={handleSaveProfile} 
                    className="flex-1"
                    variant="default"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button 
                    onClick={handleCancelEdit} 
                    className="flex-1"
                    variant="outline"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-3 mt-4">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  My Cart ({items.length} items)
                </Button>
                <Button variant="outline" className="justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Booking History
                </Button>
                <Button variant="outline" className="justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                
                {!editMode && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setEditMode(true)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                )}
                
                {isAdmin && (
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => navigate('/manage-experiences')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Experiences
                  </Button>
                )}
                
                <Button 
                  variant="destructive" 
                  className="justify-start mt-4"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* User Activity */}
          <div className="md:col-span-2">
            <Tabs defaultValue="cart">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cart">Current Cart</TabsTrigger>
                <TabsTrigger value="recent">Recent Views</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cart" className="mt-6">
                {cartExperiences.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cartExperiences.map(experience => {
                      // Create a new experience object with onClick handler
                      const expWithClick = {
                        ...experience,
                        onClick: () => handleExperienceClick(experience.id)
                      };
                      
                      return (
                        <ExperienceCard 
                          key={experience.id} 
                          experience={expWithClick}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 mb-6">Discover unforgettable experiences and create memories</p>
                    <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="recent" className="mt-6">
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recently viewed experiences</h3>
                  <p className="text-gray-500 mb-6">Start exploring to see your recently viewed experiences</p>
                  <Button onClick={() => navigate('/experiences')}>Start Exploring</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="bookings" className="mt-6">
                <div className="text-center py-12">
                  <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-500 mb-6">Book your first unforgettable experience</p>
                  <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
