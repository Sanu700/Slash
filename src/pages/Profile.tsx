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
import { User, Clock, ShoppingCart, Heart, LogOut, Settings, Edit, Save, X, AlertCircle, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatRupees } from '@/lib/formatters';

interface Booking {
  id: string;
  booking_date: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  items: {
    experience: Experience;
    quantity: number;
    price_at_booking: number;
  }[];
}

const Profile = () => {
  const { user, isAuthenticated, isAdmin, logout, updateProfile } = useAuth();
  const { items, cachedExperiences } = useCart();
  const [cartExperiences, setCartExperiences] = useState<Experience[]>([]);
  const [recentlyViewedExperiences, setRecentlyViewedExperiences] = useState<Experience[]>([]);
  const [wishlistExperiences, setWishlistExperiences] = useState<Experience[]>([]);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('cart');
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
  
  // Load recently viewed experiences from Supabase
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('viewed_experiences')
          .select('experience_id, viewed_at')
          .eq('user_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        // Load experience details for each viewed experience
        if (data && data.length > 0) {
          const experiences = [];
          
          for (const item of data) {
            const { data: expData, error: expError } = await supabase
              .from('experiences')
              .select('*')
              .eq('id', item.experience_id)
              .single();
              
            if (!expError && expData) {
              const experience: Experience = {
                id: expData.id,
                title: expData.title,
                description: expData.description,
                imageUrl: expData.image_url,
                price: expData.price,
                location: expData.location,
                duration: expData.duration,
                participants: expData.participants,
                date: expData.date,
                category: expData.category,
                nicheCategory: expData.niche_category || undefined,
                trending: expData.trending || false,
                featured: expData.featured || false,
                romantic: expData.romantic || false,
                adventurous: expData.adventurous || false,
                group: expData.group_activity || false
              };
              
              experiences.push(experience);
            }
          }
          
          setRecentlyViewedExperiences(experiences);
        }
      } catch (error) {
        console.error('Error loading viewed experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentlyViewed();
  }, [user]);
  
  // Load wishlist from Supabase
  useEffect(() => {
    const loadWishlist = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('experience_id, added_at')
          .eq('user_id', user.id)
          .order('added_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Load experience details for each wishlist item
        if (data && data.length > 0) {
          const experiences = [];
          
          for (const item of data) {
            const { data: expData, error: expError } = await supabase
              .from('experiences')
              .select('*')
              .eq('id', item.experience_id)
              .single();
              
            if (!expError && expData) {
              const experience: Experience = {
                id: expData.id,
                title: expData.title,
                description: expData.description,
                imageUrl: expData.image_url,
                price: expData.price,
                location: expData.location,
                duration: expData.duration,
                participants: expData.participants,
                date: expData.date,
                category: expData.category,
                nicheCategory: expData.niche_category || undefined,
                trending: expData.trending || false,
                featured: expData.featured || false,
                romantic: expData.romantic || false,
                adventurous: expData.adventurous || false,
                group: expData.group_activity || false
              };
              
              experiences.push(experience);
            }
          }
          
          setWishlistExperiences(experiences);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    };
    
    loadWishlist();
  }, [user]);
  
  // Load booking history from Supabase
  useEffect(() => {
    const loadBookingHistory = async () => {
      if (!user) return;
      
      try {
        // Fetch bookings for the current user
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });
          
        if (bookingsError) {
          throw bookingsError;
        }
        
        // For each booking, fetch the items
        const bookings: Booking[] = [];
        
        for (const booking of bookingsData || []) {
          // Get booking items
          const { data: itemsData, error: itemsError } = await supabase
            .from('booking_items')
            .select('*')
            .eq('booking_id', booking.id);
            
          if (itemsError) {
            console.error('Error loading booking items:', itemsError);
            continue;
          }
          
          // Get experience details for each item
          const items = [];
          
          for (const item of itemsData || []) {
            const { data: expData, error: expError } = await supabase
              .from('experiences')
              .select('*')
              .eq('id', item.experience_id)
              .single();
              
            if (!expError && expData) {
              const experience: Experience = {
                id: expData.id,
                title: expData.title,
                description: expData.description,
                imageUrl: expData.image_url,
                price: expData.price,
                location: expData.location,
                duration: expData.duration,
                participants: expData.participants,
                date: expData.date,
                category: expData.category,
                nicheCategory: expData.niche_category || undefined,
                trending: expData.trending || false,
                featured: expData.featured || false,
                romantic: expData.romantic || false,
                adventurous: expData.adventurous || false,
                group: expData.group_activity || false
              };
              
              items.push({
                experience,
                quantity: item.quantity,
                price_at_booking: item.price_at_booking
              });
            }
          }
          
          bookings.push({
            id: booking.id,
            booking_date: booking.booking_date,
            total_amount: booking.total_amount,
            status: booking.status,
            payment_method: booking.payment_method,
            items
          });
        }
        
        setBookingHistory(bookings);
      } catch (error) {
        console.error('Error loading booking history:', error);
      }
    };
    
    loadBookingHistory();
  }, [user]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  // Function to track when a user views an experience
  const trackExperienceView = async (experienceId: string) => {
    if (!user) return;
    
    try {
      // Upsert to viewed_experiences table
      await supabase
        .from('viewed_experiences')
        .upsert(
          { 
            user_id: user.id,
            experience_id: experienceId,
            viewed_at: new Date().toISOString()
          },
          { 
            onConflict: 'user_id,experience_id'
          }
        );
    } catch (error) {
      console.error('Error tracking experience view:', error);
    }
  };
  
  // Function to toggle wishlist
  const toggleWishlist = async (experienceId: string, isInWishlist: boolean) => {
    if (!user) return;
    
    try {
      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('experience_id', experienceId);
          
        if (error) throw error;
        
        setWishlistExperiences(prev => 
          prev.filter(exp => exp.id !== experienceId)
        );
        
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: user.id,
            experience_id: experienceId
          });
          
        if (error) throw error;
        
        // Get the experience details and add to state
        const experience = cachedExperiences[experienceId];
        if (experience) {
          setWishlistExperiences(prev => [experience, ...prev]);
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };
  
  // Handle click to navigate to experience detail
  const handleExperienceClick = (experienceId: string) => {
    trackExperienceView(experienceId);
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
                  onClick={() => { 
                    navigate('/cart');
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  My Cart ({items.length} items)
                </Button>
                <Button 
                  variant="outline" 
                  className={`justify-start ${activeTab === 'bookings' ? 'bg-secondary/20' : ''}`}
                  onClick={() => setActiveTab('bookings')}
                >
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Booking History ({bookingHistory.length})
                </Button>
                <Button 
                  variant="outline" 
                  className={`justify-start ${activeTab === 'wishlist' ? 'bg-secondary/20' : ''}`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist ({wishlistExperiences.length})
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cart">Current Cart</TabsTrigger>
                <TabsTrigger value="bookings">Booking History</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
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
              
              <TabsContent value="bookings" className="mt-6">
                {bookingHistory.length > 0 ? (
                  <div className="space-y-6">
                    {bookingHistory.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardHeader className="bg-muted/30">
                          <div className="flex justify-between items-center">
                            <div>
                              <CardTitle className="text-lg">
                                Booking #{booking.id.substring(0, 8)}
                              </CardTitle>
                              <CardDescription>
                                {new Date(booking.booking_date).toLocaleDateString()} • 
                                {' ' + formatRupees(booking.total_amount)} • 
                                Status: <span className="capitalize font-medium text-primary">{booking.status}</span>
                              </CardDescription>
                            </div>
                            <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                              {booking.payment_method || 'Card'}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="divide-y">
                            {booking.items.map((item, index) => (
                              <div 
                                key={`${booking.id}-${item.experience.id}-${index}`}
                                className="py-3 flex items-center gap-4"
                              >
                                <div className="w-16 h-16 flex-shrink-0">
                                  <img 
                                    src={item.experience.imageUrl}
                                    alt={item.experience.title}
                                    className="w-full h-full object-cover rounded"
                                  />
                                </div>
                                <div className="flex-grow">
                                  <h4 className="font-medium">{item.experience.title}</h4>
                                  <div className="text-sm text-muted-foreground">
                                    {formatRupees(item.price_at_booking)} × {item.quantity}
                                  </div>
                                </div>
                                <div className="font-medium">
                                  {formatRupees(item.price_at_booking * item.quantity)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No booking history</h3>
                    <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
                    <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-6">
                {wishlistExperiences.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlistExperiences.map(experience => {
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
                    <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 mb-6">Save your favorite experiences to revisit later</p>
                    <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
                  </div>
                )}
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
