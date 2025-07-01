// src/pages/Profile.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import WishlistContent from '@/components/profile/WishlistContent';
import ExperienceCard from '@/components/ExperienceCard';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Edit, Share2, Bookmark, Star, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { updateUserProfile } from '@/lib/profileService';
import { useWishlistExperiences } from '@/hooks/useDataLoaders';
import { supabase } from '@/lib/supabase';

// Helper to get saved experiences from localStorage
const getSavedExperiences = () => {
  try {
    const saved = localStorage.getItem('savedExperiences');
    const arr = saved ? JSON.parse(saved) : [];
    // Filter out any falsey or corrupt entries (must have id, title, etc)
    return Array.isArray(arr) ? arr.filter(exp => exp && exp.id && exp.title) : [];
  } catch {
    return [];
  }
};
// Helper to get viewed experiences from localStorage
const getViewedExperiences = () => {
  try {
    const viewed = localStorage.getItem('viewedExperiences');
    const arr = viewed ? JSON.parse(viewed) : [];
    return Array.isArray(arr) ? arr.filter(exp => exp && exp.id && exp.title) : [];
  } catch {
    return [];
  }
};
// Remove a saved experience by id
const removeSavedExperience = (id) => {
  const arr = getSavedExperiences();
  const filtered = arr.filter(exp => exp.id !== id);
  localStorage.setItem('savedExperiences', JSON.stringify(filtered));
  return filtered;
};

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('wishlist');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || '');
  const [editAvatar, setEditAvatar] = useState(user?.user_metadata?.avatar_url || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedExperiences, setSavedExperiences] = useState([]);
  const [viewedExperiences, setViewedExperiences] = useState([]);
  // Add local state for wishlist to allow UI update on remove
  const [localWishlist, setLocalWishlist] = useState([]);
  // Wishlist from Supabase
  const { wishlistExperiences, isLoading: isWishlistLoading } = useWishlistExperiences(user?.id);

  // Fetch saved and viewed experiences on mount
  useEffect(() => {
    setSavedExperiences(getSavedExperiences());
    // Fetch viewed experiences
    if (!user) {
      setViewedExperiences(getViewedExperiences());
    } else {
      // Fetch from Supabase: join viewed_experiences and experiences
      (async () => {
        const { data, error } = await supabase
          .from('viewed_experiences')
          .select('experience_id, viewed_at')
          .eq('user_id', user.id)
          .order('viewed_at', { ascending: false })
          .limit(50);
        if (error) {
          setViewedExperiences([]);
          return;
        }
        if (data && data.length > 0) {
          // Fetch experience details for each
          const exps = [];
          for (const item of data) {
            const { data: expData } = await supabase
              .from('experiences')
              .select('*')
              .eq('id', item.experience_id)
              .single();
            if (expData) {
              exps.push({ ...expData, imageUrl: expData.image_url });
            }
          }
          setViewedExperiences(exps);
        } else {
          setViewedExperiences([]);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    setLocalWishlist(wishlistExperiences);
  }, [wishlistExperiences]);

  // Remove from local wishlist when un-wishlisted
  const handleWishlistChange = (experienceId, isInWishlist) => {
    if (!isInWishlist) {
      setLocalWishlist(prev => prev.filter(exp => exp.id !== experienceId));
    }
  };

  // Profile info for header
  const profile = {
    name: user?.user_metadata?.full_name || editName || 'Jamie Smith',
    username: user?.user_metadata?.username || 'jamiesmith',
    avatar: user?.user_metadata?.avatar_url || editAvatar || '/default-avatar.png',
    email: user?.email || '',
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!user || !user.id) return;
    setIsSavingProfile(true);
    try {
      await updateUserProfile(user.id, {
        full_name: editName,
        avatar_url: editAvatar,
      });
      toast({ title: 'Success', description: 'Profile updated successfully' });
      setShowEditModal(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Copy profile link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://slash-experiences.netlify.app/profile/${profile.username}`);
    toast({ title: 'Copied!', description: 'Profile link copied to clipboard.' });
  };

  // Remove from saved experiences
  const handleRemoveSaved = (id) => {
    const updated = removeSavedExperience(id);
    setSavedExperiences(updated);
    toast({ title: 'Removed', description: 'Experience removed from Saved for Later.' });
  };

  // Stats (replace with real counts if available)
  const stats = [
    { label: 'Experiences', value: viewedExperiences.length },
    { label: 'Wishlist', value: wishlistExperiences.length },
    { label: 'Saved', value: savedExperiences.length },
    { label: 'Referrals', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-background pt-12">
      {/* Profile Header */}
      <div className="profile-header text-white py-8 px-4 md:px-6 bg-gradient-to-r from-primary to-pink-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-center space-y-6 md:space-y-0 md:space-x-8">
          <div className="h-28 w-28 rounded-full bg-white p-1 flex-shrink-0">
            <img src={profile.avatar} alt="Profile" className="h-full w-full rounded-full object-cover" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{profile.name}</h1>
            <p className="text-pink-100 mb-1">@{profile.username}</p>
            {profile.email && <p className="text-pink-50 text-sm">{profile.email}</p>}
          </div>
          <div className="flex space-x-4">
            <Button className="bg-white text-primary px-5 py-2.5 rounded-lg font-medium hover:bg-primary/10 transition" onClick={() => {
              setEditName(profile.name);
              setEditAvatar(profile.avatar);
              setShowEditModal(true);
            }}>
              <Edit className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
            <Button className="bg-pink-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-pink-400 transition flex items-center space-x-2" onClick={() => setShowShareModal(true)}>
              <Share2 className="h-4 w-4 mr-2" /> Share Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm mb-8 flex">
          {stats.map((stat, i) => (
            <div key={stat.label} className={`flex-1 text-center py-3 px-4 ${i !== stats.length - 1 ? 'border-r border-gray-200' : ''}`}>
              <p className="font-semibold text-2xl text-gray-800 mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="flex overflow-x-auto">
            <button className={`px-6 py-4 flex-1 text-center font-medium transition ${activeTab === 'wishlist' ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setActiveTab('wishlist')}>Wishlist</button>
            <button className={`px-6 py-4 flex-1 text-center font-medium transition ${activeTab === 'saved' ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setActiveTab('saved')}>Saved</button>
            <button className={`px-6 py-4 flex-1 text-center font-medium transition ${activeTab === 'history' ? 'border-b-4 border-primary text-primary' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setActiveTab('history')}>History</button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'wishlist' && (
            <WishlistContent wishlistExperiences={localWishlist} handleExperienceClick={(id) => navigate(`/experience/${id}`)} onWishlistChange={handleWishlistChange} />
          )}
          {activeTab === 'saved' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedExperiences.length > 0 ? savedExperiences.map(exp => (
                <div key={exp.id} className="relative">
                  <ExperienceCard experience={exp} />
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 z-10" onClick={() => handleRemoveSaved(exp.id)} title="Remove from Saved">
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              )) : (
                <div className="text-center py-12 col-span-full">
                  <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No saved experiences</h3>
                  <p className="text-gray-500 mb-6">Save experiences for later to see them here.</p>
                  <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
                </div>
              )}
            </div>
          )}
          {activeTab === 'history' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {viewedExperiences.length > 0 ? viewedExperiences.map(exp => (
                <ExperienceCard key={exp.id} experience={exp} />
              )) : (
                <div className="text-center py-12 col-span-full">
                  <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No browsing history</h3>
                  <p className="text-gray-500 mb-6">Experiences you view will appear here.</p>
                  <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowEditModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Name</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                disabled={isSavingProfile}
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 font-medium">Avatar URL</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={editAvatar}
                onChange={e => setEditAvatar(e.target.value)}
                disabled={isSavingProfile}
              />
            </div>
            <Button className="w-full" onClick={handleSaveProfile} disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving...' : 'Save'}
            </Button>
            <Button variant="outline" className="w-full mt-2" onClick={() => setShowEditModal(false)} disabled={isSavingProfile}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Share Profile Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-lg relative">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600" onClick={() => setShowShareModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-4">Share Profile</h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Share your profile with friends</p>
              <div className="flex items-center bg-gray-100 rounded-lg p-3 mb-4">
                <input type="text" value={`https://slash-experiences.netlify.app/profile/${profile.username}`} className="bg-transparent flex-1 outline-none text-gray-700" readOnly />
                <Button className="ml-2 text-primary" onClick={handleCopyLink}>Copy</Button>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1">Facebook</Button>
              <Button variant="outline" className="flex-1">Twitter</Button>
              <Button variant="outline" className="flex-1">WhatsApp</Button>
              <Button variant="outline" className="flex-1">Email</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
