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
import { fetchUserProfile, updateUserProfile } from '@/lib/profileService';

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
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
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
      if (user) { // Check if user object exists
        // Default values for profile state
        let newProfileDataState: UserProfile = {
          full_name: '',
          avatar_url: '',
          phone: '', // Keep existing phone, address, bio from state if any, or default
          address: '',
          bio: ''
        };

        // 1. Populate from auth user_metadata (these are considered defaults)
        const umFullName = user.user_metadata?.full_name;
        const umAvatarUrl = user.user_metadata?.avatar_url;

        if (typeof umFullName === 'string') {
          newProfileDataState.full_name = umFullName;
        }
        if (typeof umAvatarUrl === 'string') {
          newProfileDataState.avatar_url = umAvatarUrl;
        }

        // Preserve other fields if they were already loaded (e.g., from a previous render or partial load)
        // This ensures fields not covered by metadata/DB fetch (if any) or loaded earlier are not wiped.
        // However, typically phone, address, bio will be overwritten by DB fetch if available.
        setProfileData(currentProfileData => ({
            ...currentProfileData, // spread current to keep phone, address, bio if not yet fetched
            full_name: newProfileDataState.full_name,
            avatar_url: newProfileDataState.avatar_url,
        }));

        // 2. Fetch from 'profiles' table and override/fill in if user.id is available
        if (user.id) {
          const dbProfile = await fetchUserProfile(user.id); // ExtendedProfile | null
          if (dbProfile) {
            setProfileData(prevProfileData => ({
              full_name: typeof dbProfile.full_name === 'string' ? dbProfile.full_name : prevProfileData.full_name,
              avatar_url: typeof dbProfile.avatar_url === 'string' ? dbProfile.avatar_url : prevProfileData.avatar_url,
              phone: typeof dbProfile.phone === 'string' ? dbProfile.phone : '',
              address: typeof dbProfile.address === 'string' ? dbProfile.address : '',
              bio: typeof dbProfile.bio === 'string' ? dbProfile.bio : ''
            }));
          } else {
            // If no dbProfile, ensure phone/address/bio are at least empty strings from initial defaults
            // if they weren't set from a previous state that had them.
             setProfileData(prevProfileData => ({
                ...prevProfileData, // full_name, avatar_url already set from metadata
                phone: prevProfileData.phone || '', // Ensure these are at least empty strings
                address: prevProfileData.address || '',
                bio: prevProfileData.bio || '',
            }));
          }
        }
      } else {
        // No user, reset to default empty profile
        setProfileData({ full_name: '', avatar_url: '', phone: '', address: '', bio: '' });
      }
    };
    
    loadProfileData();
  }, [user]);

  // Handle profile save
  const handleSaveProfile = async () => {
    if (!user || !user.id) return;
    
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
      
      const result = await updateUserProfile(user.id, updateData);
      
      if (result && result.success && result.session) {
        // Update local state with the latest data
        // The session contains updated user_metadata (full_name, avatar_url)
        // Other fields (phone, address, bio) are from the current profileData that was just saved
        setProfileData({
          full_name: result.session.user?.user_metadata?.full_name || profileData.full_name,
          avatar_url: result.session.user?.user_metadata?.avatar_url || profileData.avatar_url,
          phone: profileData.phone,
          address: profileData.address,
          bio: profileData.bio,
        });
        // Also, it's good practice to update the auth context's user object if possible,
        // though useAuth() might handle this automatically if session changes trigger a refresh.
        // For now, we'll rely on the local profileData state for the form.
      }
      
      setEditMode(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      // Error is already handled in updateUserProfile
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
