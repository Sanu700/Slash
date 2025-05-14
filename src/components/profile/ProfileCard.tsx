
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/contexts/CartContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Heart, LogOut, Settings, Edit, Save, X, AlertCircle, Phone, MapPin, CalendarCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  full_name: string;
  avatar_url: string;
  phone?: string;
  address?: string;
  bio?: string;
}

interface ProfileCardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  bookingHistoryCount: number;
  wishlistCount: number;
}

const ProfileCard = ({ activeTab, setActiveTab, bookingHistoryCount, wishlistCount }: ProfileCardProps) => {
  const { user, isAuthenticated, isAdmin, logout, updateProfile } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [editMode, setEditMode] = React.useState(false);
  const [profileData, setProfileData] = React.useState<UserProfile>({
    full_name: '',
    avatar_url: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Initialize profile edit form and load extended profile data
  React.useEffect(() => {
    const loadProfileData = async () => {
      if (user) {
        // Set basic fields from auth metadata
        setProfileData(prev => ({
          ...prev,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
        }));
        
        // Try to load extended profile data
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (!error && data) {
            setProfileData(prev => ({
              ...prev,
              full_name: data.full_name || prev.full_name,
              avatar_url: data.avatar_url || prev.avatar_url,
              phone: data.phone || '',
              address: data.address || '',
              bio: data.bio || ''
            }));
          } else if (error) {
            console.error('Error loading profile data:', error);
          }
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      }
    };
    
    loadProfileData();
  }, [user]);

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setIsUpdating(true);
      console.log("Saving profile data:", profileData);
      
      // Convert empty strings to null for optional fields
      const updateData = {
        full_name: profileData.full_name || null,
        avatar_url: profileData.avatar_url || null,
        phone: profileData.phone?.trim() || null,
        address: profileData.address?.trim() || null,
        bio: profileData.bio?.trim() || null
      };
      
      console.log("Processed update data:", updateData);
      
      // First, try to update the auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          full_name: updateData.full_name,
          avatar_url: updateData.avatar_url
        }
      });
      
      if (metadataError) {
        console.error('Error updating auth metadata:', metadataError);
        throw new Error(`Failed to update profile: ${metadataError.message}`);
      }
      
      // Then update the profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: updateData.full_name,
          avatar_url: updateData.avatar_url,
          phone: updateData.phone,
          address: updateData.address,
          bio: updateData.bio,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('Error updating profiles table:', profileError);
        throw new Error(`Failed to update profile data: ${profileError.message}`);
      }
      
      // Refresh auth session to get updated user data
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error refreshing session:', sessionError);
      } else if (sessionData.session) {
        // Update local state with the latest data
        setProfileData(prev => ({
          ...prev,
          full_name: sessionData.session?.user?.user_metadata?.full_name || prev.full_name,
          avatar_url: sessionData.session?.user?.user_metadata?.avatar_url || prev.avatar_url
        }));
      }
      
      setEditMode(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save profile changes';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    // Reset form data
    if (user) {
      setProfileData({
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        bio: profileData.bio || ''
      });
    }
    setEditMode(false);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Card className="md:col-span-1">
      <CardHeader className="flex flex-col items-center text-center">
        {editMode ? (
          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <Input 
              value={profileData.avatar_url}
              onChange={(e) => setProfileData({...profileData, avatar_url: e.target.value})}
              placeholder="Avatar URL"
              className="mb-2"
            />
            <div className="flex justify-center">
              <Avatar className="h-24 w-24 mt-2">
                {profileData.avatar_url ? (
                  <AvatarImage src={profileData.avatar_url} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {profileData.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
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
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input 
                value={profileData.full_name}
                onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input 
                value={profileData.phone || ''}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                placeholder="Your phone number"
                type="tel"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <Input 
                value={profileData.address || ''}
                onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                placeholder="Your address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <Textarea 
                value={profileData.bio || ''}
                onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
          </div>
        ) : (
          <>
            <CardTitle>{user.user_metadata?.full_name || 'User'}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
            
            {/* Extra profile details when available */}
            {(profileData.phone || profileData.address || profileData.bio) && (
              <div className="mt-4 text-left w-full">
                {profileData.phone && (
                  <div className="flex items-center text-sm mb-2">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profileData.phone}</span>
                  </div>
                )}
                {profileData.address && (
                  <div className="flex items-center text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profileData.address}</span>
                  </div>
                )}
                {profileData.bio && (
                  <div className="mt-3 text-sm">
                    <p className="text-muted-foreground">{profileData.bio}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        {editMode && (
          <div className="flex space-x-2 w-full mt-4">
            <Button 
              onClick={handleSaveProfile} 
              className="flex-1"
              variant="default"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </>
              )}
            </Button>
            <Button 
              onClick={handleCancelEdit} 
              className="flex-1"
              variant="outline"
              disabled={isUpdating}
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
            onClick={() => {
              setActiveTab('bookings');
              navigate('/profile?tab=bookings');
            }}
          >
            <CalendarCheck className="mr-2 h-4 w-4" />
            Booking History ({bookingHistoryCount})
          </Button>
          <Button 
            variant="outline" 
            className={`justify-start ${activeTab === 'wishlist' ? 'bg-secondary/20' : ''}`}
            onClick={() => {
              setActiveTab('wishlist');
              navigate('/profile?tab=wishlist');
            }}
          >
            <Heart className="mr-2 h-4 w-4" />
            Wishlist ({wishlistCount})
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
  );
};

export default ProfileCard;
