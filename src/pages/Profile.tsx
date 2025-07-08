// src/pages/Profile.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import WishlistContent from '@/components/profile/WishlistContent';
import ExperienceCard from '@/components/ExperienceCard';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Edit, Share2, Bookmark, Star, X, Gift, Copy, HelpCircle, Mail, Shield, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { updateUserProfile } from '@/lib/profileService';
import { useWishlistExperiences, useBookingHistory } from '@/hooks/useDataLoaders';
import { supabase } from '@/lib/supabase';
import { getTrendingExperiences } from '@/lib/data';
import { sampleExperiences } from '@/lib/data/sampleData';
import { getRecommendedExperiences, UserPreferences } from '@/lib/data/experienceMatching';
import { getAllExperiences } from '@/lib/data/experiences';
import { categories } from '@/lib/data/categories';
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';
import { useToast } from '@/components/ui/use-toast';
import Papa from 'papaparse';
import ImportContactsButton from '@/components/ImportContactsButton';
import { Heart as HeartIcon } from 'lucide-react';

// Add this at the top of your file (or before using window.gapi)
declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

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

// Google People API config
const GOOGLE_CLIENT_ID = '630365428319-iujdl046niv4hec0asllb3mcsluq9j3u.apps.googleusercontent.com'; // <-- Replace with your client ID
const GOOGLE_SCOPES = 'https://www.googleapis.com/auth/contacts.readonly';

const Profile = () => {
  const { user, logout } = useAuth();
  const { toggleWishlist } = useExperienceInteractions(user?.id);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('liked');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editName, setEditName] = useState(user?.user_metadata?.full_name || '');
  const [editAvatar, setEditAvatar] = useState(user?.user_metadata?.avatar_url || '');
  const [editAvatarFile, setEditAvatarFile] = useState<File | null>(null);
  const [editAvatarPreview, setEditAvatarPreview] = useState<string>(user?.user_metadata?.avatar_url || '/placeholder.svg');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedExperiences, setSavedExperiences] = useState([]);
  const [viewedExperiences, setViewedExperiences] = useState([]);
  // Add local state for wishlist to allow UI update on remove
  const [localWishlist, setLocalWishlist] = useState([]);
  // Wishlist from Supabase
  const { wishlistExperiences, isLoading: isWishlistLoading } = useWishlistExperiences(user?.id);
  const { bookingHistory, isLoading: isBookingHistoryLoading } = useBookingHistory(user?.id);
  const [referralCount, setReferralCount] = useState(0);
  const [allExperiences, setAllExperiences] = useState([]);
  const { toast } = useToast();
  const [matchedFriends, setMatchedFriends] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [friends, setFriends] = useState([]);
  const [friendsLikedExperiences, setFriendsLikedExperiences] = useState({});

  // Merge matchedFriends and friends for People You May Know, ensuring uniqueness
  const allPeopleYouMayKnow = React.useMemo(() => {
    const all = [...matchedFriends, ...friends];
    const unique = [];
    const seen = new Set();
    for (const person of all) {
      if (!seen.has(person.id)) {
        unique.push(person);
        seen.add(person.id);
      }
    }
    return unique;
  }, [matchedFriends, friends]);

  const mockPeople = [
    {
      id: 'u1',
      name: 'Aarav Mehta',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      mutual: 3
    },
    {
      id: 'u2',
      name: 'Priya Sharma',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      mutual: 1
    },
    {
      id: 'u3',
      name: 'Rohan Gupta',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      mutual: 2
    },
    {
      id: 'u4',
      name: 'Simran Kaur',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      mutual: 0
    },
  ];

  const buildUserPreferences = (wishlist, viewed) => {
    // Collect categories from wishlist and viewed
    const all = [...(wishlist || []), ...(viewed || [])];
    const preferredCategories = Array.from(new Set(all.map(exp => {
      // Try to match category name to category id
      const cat = categories.find(c => c.name.toLowerCase() === (exp.category || '').toLowerCase());
      return cat ? cat.id : exp.category;
    }).filter(Boolean)));
    // Estimate budget range from liked/viewed
    const prices = all.map(exp => exp.price).filter(p => typeof p === 'number');
    const min = prices.length ? Math.max(0, Math.min(...prices) - 500) : 0;
    const max = prices.length ? Math.max(...prices) + 1000 : 10000;
    // Estimate duration (try to parse hours from string)
    const parseDuration = (d) => {
      if (!d) return 2;
      if (typeof d === 'number') return d;
      const match = d.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[1]) : 2;
    };
    const durations = all.map(exp => parseDuration(exp.duration)).filter(Boolean);
    const durMin = durations.length ? Math.max(0, Math.min(...durations) - 1) : 1;
    const durMax = durations.length ? Math.max(...durations) + 2 : 8;
    // Estimate group size
    const groupSizes = all.map(exp => {
      if (typeof exp.participants === 'string') {
        const match = exp.participants.match(/\d+/g);
        return match ? Math.max(...match.map(Number)) : 2;
      }
      if (typeof exp.participants === 'number') return exp.participants;
      return 2;
    });
    const groupSize = groupSizes.length ? Math.round(groupSizes.reduce((a, b) => a + b, 0) / groupSizes.length) : 2;
    // Estimate interests from tags/nicheCategory
    const interests = Array.from(new Set(all.flatMap(exp => [exp.nicheCategory, ...(exp.tags || [])]).filter(Boolean)));
    // Default values for time/day/accessibility
    return {
      preferredCategories,
      budgetRange: { min, max },
      preferredDuration: { min: durMin, max: durMax },
      preferredTimeOfDay: ['morning', 'afternoon', 'evening'] as ('morning' | 'afternoon' | 'evening')[],
      preferredDays: ['weekday', 'weekend'] as ('weekday' | 'weekend')[],
      groupSize,
      accessibilityNeeds: [],
      interests,
    };
  };

  const [recommended, setRecommended] = useState([]);
  useEffect(() => {
    (async () => {
      // Use wishlist and viewed for preferences
      const allExperiences = await getAllExperiences();
      setAllExperiences(allExperiences);
      let prefs = buildUserPreferences(localWishlist, viewedExperiences);
      // If not enough data, fallback to trending/sample
      if (!prefs.preferredCategories.length && (!localWishlist.length && !viewedExperiences.length)) {
        let rec = await getTrendingExperiences();
        if (!rec || rec.length === 0) rec = sampleExperiences.slice(0, 6);
        setRecommended(rec);
        return;
      }
      // Map allExperiences to the minimal structure expected by getRecommendedExperiences
      const mapped = allExperiences.map(exp => ({
        id: exp.id,
        categoryId: (() => {
          const cat = categories.find(c => c.name.toLowerCase() === (exp.category || '').toLowerCase());
          return cat ? cat.id : exp.category;
        })(),
        name: exp.title,
        description: exp.description,
        price: exp.price,
        duration: typeof exp.duration === 'number' ? exp.duration : (() => {
          const match = (exp.duration || '').toString().match(/(\d+(\.\d+)?)/);
          return match ? parseFloat(match[1]) : 2;
        })(),
        availableTimeSlots: [{ timeOfDay: 'morning' as const, days: ['weekday', 'weekend'] as ('weekday' | 'weekend')[] }],
        groupSize: { min: 1, max: 10 },
        accessibilityFeatures: [],
        tags: (exp as any).tags || [],
        rating: (exp as any).rating || 4,
        imageUrl: Array.isArray(exp.imageUrl) ? exp.imageUrl[0] : exp.imageUrl,
      }));
      const recs = getRecommendedExperiences(prefs, mapped, 6);
      // Map back to app's Experience type for display
      const recsForDisplay = recs.map(r => allExperiences.find(e => e.id === r.id)).filter(Boolean);
      setRecommended(recsForDisplay);
    })();
  }, [localWishlist, viewedExperiences]);

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
              exps.push({ ...expData, imageUrl: expData.image_url, viewed_at: item.viewed_at });
            }
          }
          // Sort by viewed_at descending (most recent first)
          exps.sort((a, b) => new Date(b.viewed_at).getTime() - new Date(a.viewed_at).getTime());
          setViewedExperiences(exps);
        } else {
          setViewedExperiences([]);
        }
      })();
    }
  }, [user]);

  useEffect(() => {
    setLocalWishlist(Array.isArray(wishlistExperiences) ? wishlistExperiences : []);
  }, [wishlistExperiences]);

  // Load matchedFriends from localStorage on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      const stored = localStorage.getItem(`matchedFriends_${user.id}`);
      if (stored) {
        setMatchedFriends(JSON.parse(stored));
      } else {
        setMatchedFriends([]);
      }
    } else {
      setMatchedFriends([]);
    }
  }, [user?.id]);

  // Load incoming connection requests (no join, fetch sender profiles separately)
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('connections')
      .select('id, from_user_id, status, created_at')
      .eq('to_user_id', user.id)
      .eq('status', 'pending')
      .then(async ({ data }) => {
        if (!data) return setIncomingRequests([]);
        const senderIds = data.map(r => r.from_user_id);
        if (senderIds.length === 0) return setIncomingRequests([]);
        const { data: profiles } = await supabase
          .from('profiles_with_email')
          .select('id, full_name, avatar_url')
          .in('id', senderIds);
        const requests = data.map(r => ({
          ...r,
          from_user: profiles?.find(p => p.id === r.from_user_id)
        }));
        setIncomingRequests(requests);
      });
  }, [user?.id]);

  // Fetch connection statuses for all people you may know (contacts + friends)
  const fetchStatuses = React.useCallback(async () => {
    console.log('fetchStatuses called', { userId: user?.id, allPeopleYouMayKnow });
    if (!user?.id || !allPeopleYouMayKnow.length) return;
    const statuses = {};
    for (const friend of allPeopleYouMayKnow) {
      const { data, error } = await supabase
        .from('connections')
        .select('from_user_id, to_user_id, status')
        .or(
          `and(from_user_id.eq.${user.id},to_user_id.eq.${friend.id}),and(from_user_id.eq.${friend.id},to_user_id.eq.${user.id})`
        );
      console.log('Checking connection between', user.id, 'and', friend.id, '=>', data, 'error:', error);
      if (error) {
        statuses[friend.id] = 'none';
        continue;
      }
      if (data && data.length > 0) {
        if (data.some(conn => conn.status === 'accepted')) {
          statuses[friend.id] = 'accepted';
        } else if (data.some(conn => conn.status === 'pending' && conn.from_user_id === user.id)) {
          statuses[friend.id] = 'pending';
        } else if (data.some(conn => conn.status === 'pending' && conn.to_user_id === user.id)) {
          statuses[friend.id] = 'incoming';
        } else {
          statuses[friend.id] = 'none';
        }
      } else {
        statuses[friend.id] = 'none';
      }
    }
    setConnectionStatuses(statuses);
  }, [user?.id, allPeopleYouMayKnow]);

  React.useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  // Fetch accepted connections (friends)
  const fetchFriends = React.useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('connections')
      .select('from_user_id, to_user_id')
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
      .eq('status', 'accepted');
    if (!data) return setFriends([]);
    const friendIds = data.map(conn =>
      conn.from_user_id === user.id ? conn.to_user_id : conn.from_user_id
    );
    if (friendIds.length === 0) return setFriends([]);
    const { data: profiles } = await supabase
      .from('profiles_with_email')
      .select('id, full_name, avatar_url')
      .in('id', friendIds);
    console.log('Fetched friends:', profiles); // DEBUG LOG
    setFriends(profiles || []);
  }, [user?.id]);

  React.useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  // After fetching friends, fetch their liked experiences
  useEffect(() => {
    async function fetchFriendsLikes() {
      if (!friends.length) {
        setFriendsLikedExperiences({});
        return;
      }
      const allLikes = {};
      for (const friend of friends) {
        // Fetch wishlist experience IDs for this friend
        const { data: wishlist } = await supabase
          .from('wishlists')
          .select('experience_id')
          .eq('user_id', friend.id);
        const expIds = (wishlist || []).map(w => w.experience_id).filter(Boolean);
        if (expIds.length > 0) {
          // Fetch experience details for these IDs
          const { data: experiences } = await supabase
            .from('experiences')
            .select('id, title')
            .in('id', expIds);
          allLikes[friend.id] = experiences || [];
        } else {
          allLikes[friend.id] = [];
        }
      }
      setFriendsLikedExperiences(allLikes);
    }
    fetchFriendsLikes();
  }, [friends]);

  // Remove from local wishlist when un-wishlisted
  const handleWishlistChange = (experienceId, isNowInWishlist) => {
    setLocalWishlist(prev => {
      if (isNowInWishlist) {
        // Add experience to wishlist if not already present
        const exp = allExperiences.find(e => e.id === experienceId);
        if (exp && !prev.some(e => e.id === experienceId)) {
          return [...prev, exp];
        }
        return prev;
      } else {
        // Remove from wishlist
        return prev.filter(exp => exp.id !== experienceId);
      }
    });
  };

  // Profile info for header
  const profile = {
    name: user?.user_metadata?.full_name || editName || 'Jamie Smith',
    username: user?.username || 'jamiesmith',
    avatar: user?.user_metadata?.avatar_url || editAvatar || '/placeholder.svg',
    email: user?.email || '',
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditAvatarFile(file);
      setEditAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEditProfile = async () => {
    let avatarUrl = editAvatar;
    if (editAvatarFile) {
      // TODO: Upload to storage provider (e.g., Supabase Storage, S3, etc.)
      // For now, just use the preview URL (not persistent)
      avatarUrl = editAvatarPreview;
    }
    try {
      await updateUserProfile(user.id, { full_name: editName, avatar_url: avatarUrl });
      toast({ title: 'Profile updated!' });
      setShowEditModal(false);
      // Optionally update user context/state here
    } catch {
      toast({ title: 'Failed to update profile', variant: 'destructive' });
    }
  };

  const handleShareProfile = async () => {
    const url = `${window.location.origin}/profile/${user?.username || user?.email?.split('@')[0]}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Profile link copied!', description: url });
    } catch {
      toast({ title: 'Failed to copy link', variant: 'destructive' });
    }
  };

  // Remove from saved experiences
  const handleRemoveSaved = (id) => {
    const updated = removeSavedExperience(id);
    setSavedExperiences(updated);
    toast({ title: 'Removed', description: 'Experience removed from Saved for Later.' });
  };

  // Simulate fetching live referral count (replace with real API if available)
  useEffect(() => {
    // Example: fetch from localStorage or backend
    const stored = localStorage.getItem('referralCount');
    setReferralCount(stored ? parseInt(stored, 10) : 0);
    // Optionally, listen for changes (e.g., after a successful referral)
    // You can replace this with a real API call in the future
  }, []);

  // Stats (use local state for instant UI update)
  const totalBookedExperiences = bookingHistory.reduce((sum, booking) => sum + (booking.items?.length || 0), 0);
  const stats = [
    { label: 'Experiences', value: viewedExperiences.length },
    { label: 'Wishlist', value: localWishlist.length },
    { label: 'Saved', value: savedExperiences.length },
    { label: 'Bookings', value: totalBookedExperiences },
    { label: 'Referrals', value: referralCount },
  ];

  // --- Recommended For You handlers ---
  const handleShareExperience = async (exp) => {
    const url = `${window.location.origin}/experience/${exp.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Experience link copied!', description: url });
    } catch {
      toast({ title: 'Failed to copy link', variant: 'destructive' });
    }
  };
  const handleLikeExperience = async (exp) => {
    if (!user) {
      toast({ title: 'Please log in to save to your wishlist', variant: 'destructive' });
      return;
    }
    const isInWishlist = localWishlist.some(e => e.id === exp.id);
    await toggleWishlist(exp.id, isInWishlist, { [exp.id]: exp }, () => {
      const newWishlistState = !isInWishlist;
      setLocalWishlist(prev => {
        if (newWishlistState) return [...prev, exp];
        return prev.filter(e => e.id !== exp.id);
      });
    });
  };

  // Before rendering the people you may know list
  return (
    <div className="min-h-screen bg-neutral-50 pt-16 pb-12">
      {/* Profile Header - formal, spaced, aligned */}
      <div className="profile-header bg-gradient-to-r from-neutral-200 to-neutral-100 text-gray-900 py-8 px-2 md:px-6 border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-center gap-8">
          <div className="h-28 w-28 rounded-full bg-white p-1.5 flex-shrink-0 shadow-lg flex items-center justify-center border border-gray-200">
            <img src={user?.user_metadata?.avatar_url || editAvatar || '/placeholder.svg'} alt="Profile" className="h-full w-full rounded-full object-cover" />
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start gap-1">
            <h1 className="text-2xl md:text-3xl font-bold mb-0 text-gray-900 tracking-tight leading-tight">{user?.user_metadata?.full_name || editName || 'Your Name'}</h1>
            {user?.username && <p className="text-gray-500 text-base font-medium">@{user.username}</p>}
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-3 items-center">
            <Button className="bg-white text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition shadow-sm border border-gray-300 text-sm" onClick={() => {
              setEditName(user?.user_metadata?.full_name || '');
              setEditAvatar(user?.user_metadata?.avatar_url || '');
              setEditAvatarFile(null);
              setEditAvatarPreview(user?.user_metadata?.avatar_url || '/placeholder.svg');
              setShowEditModal(true);
            }}>Edit Profile</Button>
            <Button className="bg-neutral-200 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-neutral-300 transition flex items-center gap-2 shadow-sm border border-gray-300 text-sm" onClick={handleShareProfile}>
              <Share2 className="h-5 w-5" />
              <span>Share Profile</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-14 mt-12">
        {/* Main Content Area */}
        <div className="md:w-2/3 flex flex-col gap-12">
          {/* Stats Bar - formal, spaced */}
          <div className="bg-white rounded-2xl shadow flex divide-x divide-gray-100 mb-6 border border-gray-100 min-h-[80px]">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex-1 text-center py-5 px-1 md:px-4">
                <p className="font-semibold text-lg text-gray-900 mb-0.5">{stat.value}</p>
                <p className="text-gray-500 text-xs tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow mb-4 overflow-hidden border border-gray-100 relative">
            {/* Left gradient scroll indicator for mobile */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-6 z-10 bg-gradient-to-r from-white via-white/80 to-transparent md:hidden" />
            <div
              className="flex overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 gap-4 pl-0 pr-4 py-2 min-h-[60px]"
              ref={el => {
                if (el) el.scrollLeft = 0;
              }}
            >
              {['liked', 'saved', 'viewed', 'history'].map(tab => (
                <button
                  key={tab}
                  className={`px-10 py-3 flex-1 text-center capitalize transition font-medium text-base tracking-wide rounded-lg ${activeTab === tab ? 'border-b-4 border-primary text-primary bg-neutral-100 shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={{ minWidth: 140, maxWidth: 220, flexShrink: 0 }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'viewed' ? 'Viewed' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
          {/* Tab Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeTab === 'liked' && (
              (Array.isArray(localWishlist) && localWishlist.length > 0) ? localWishlist.map((exp, idx) => (
                <ExperienceCard key={exp.id} experience={exp} index={idx} isInWishlist={true} />
              )) : <div className="col-span-full text-center text-gray-400 py-12 text-lg">No liked experiences yet.</div>
            )}
            {activeTab === 'saved' && (
              (Array.isArray(savedExperiences) && savedExperiences.length > 0) ? savedExperiences.map((exp, idx) => (
                <div key={exp.id} className="relative">
                  <ExperienceCard experience={exp} index={idx} />
                  <Button size="icon" variant="ghost" className="absolute top-2 right-2 z-10" onClick={() => handleRemoveSaved(exp.id)} title="Remove from Saved">
                    <X className="h-5 w-5 text-gray-500" />
                  </Button>
                </div>
              )) : <div className="col-span-full text-center text-gray-400 py-12 text-lg">No saved experiences yet.</div>
            )}
            {activeTab === 'viewed' && (
              (Array.isArray(viewedExperiences) && viewedExperiences.length > 0) ? viewedExperiences.map((exp, idx) => (
                <ExperienceCard key={exp.id} experience={exp} index={idx} />
              )) : <div className="col-span-full text-center text-gray-400 py-12 text-lg">No viewed experiences yet.</div>
            )}
            {activeTab === 'history' && (
              isBookingHistoryLoading ? (
                <div className="col-span-full text-center text-gray-400 py-12 text-lg">Loading bookings...</div>
              ) : bookingHistory.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-12 text-lg">No bookings yet.</div>
              ) : bookingHistory.every(b => !b.items || b.items.length === 0) ? (
                <div className="col-span-full text-center text-gray-400 py-12 text-lg">No booked experiences found.</div>
              ) : bookingHistory.map(booking => (
                booking.items.map((item, idx) => (
                  <div key={item.experience.id + booking.id} className="relative">
                    <ExperienceCard experience={item.experience} index={idx} />
                    <div className="absolute bottom-2 right-2 bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full shadow-sm">Booked on {new Date(booking.booking_date).toLocaleDateString()}</div>
                  </div>
                ))
              ))
            )}
          </div>
        </div>
        {/* Sidebar - formal, spaced, aligned */}
        <div className="md:w-1/3 flex flex-col gap-8">
          {/* Recommended For You */}
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-5 border border-gray-100 min-h-[220px]">
            <h2 className="font-semibold text-lg mb-2 text-gray-900">Recommended For You</h2>
            {recommended.slice(0, 3).map(exp => {
              const isInWishlist = localWishlist.some(e => e.id === exp.id);
              return (
                <div
                  key={exp.id}
                  className="flex items-center gap-4 cursor-pointer hover:bg-neutral-100 rounded-lg transition"
                  onClick={() => navigate(`/experience/${exp.id}`)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') navigate(`/experience/${exp.id}`); }}
                >
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-200">
                    <img src={exp.imageUrl || '/placeholder.svg'} alt={exp.title} className="h-12 w-12 object-cover rounded-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 text-gray-800 truncate">{exp.title}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className="text-gray-500 text-xs ml-1">4.9 (128)</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end" onClick={e => e.stopPropagation()}>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-primary" onClick={() => handleShareExperience(exp)}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className={`heart-button h-9 w-9 rounded-full flex items-center justify-center ${isInWishlist ? 'text-primary' : 'text-gray-400 hover:text-primary'}`} onClick={() => handleLikeExperience(exp)}>
                      <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-primary' : ''}`} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          {/* People You May Know */}
          <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-5 border border-gray-100 min-h-[180px]">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-gray-900">People You May Know</h2>
              <div className="flex gap-2">
                <ImportContactsButton onContactsFetched={async (contacts) => {
                  setContactsLoading(true);
                  const emails = contacts.map(c => c.email);
                  if (emails.length === 0) {
                    toast({ title: 'No contacts found', description: 'No contacts with email addresses were found in your Google account.', variant: 'destructive' });
                    setContactsLoading(false);
                    return;
                  }
                  // Query Supabase for matching profiles with email
                  const { data: matchingProfiles, error } = await supabase
                    .from('profiles_with_email')
                    .select('*')
                    .in('email', emails);
                  if (error) {
                    toast({ title: 'Error matching contacts', description: error.message, variant: 'destructive' });
                  } else {
                    setMatchedFriends(matchingProfiles || []);
                    if (user?.id) {
                      localStorage.setItem(`matchedFriends_${user.id}`, JSON.stringify(matchingProfiles || []));
                    }
                    toast({ title: 'Contacts imported!', description: `${(matchingProfiles || []).length} friends found.` });
                  }
                  setContactsLoading(false);
                }} />
              </div>
            </div>
            {contactsLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-500">Matching contacts...</span>
              </div>
            ) : allPeopleYouMayKnow.map(friend => {
              const connectionStatus = connectionStatuses[friend.id] || 'none';
              return (
                <div key={friend.id} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                    <img src={friend.avatar_url} alt={friend.full_name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-0.5 text-gray-800 truncate">{friend.full_name}</p>
                  </div>
                  {connectionStatus === 'accepted' ? (
                    <Button disabled className="bg-green-100 text-green-700">Connected</Button>
                  ) : connectionStatus === 'pending' ? (
                    <Button disabled className="bg-yellow-100 text-yellow-700">Pending</Button>
                  ) : connectionStatus === 'incoming' ? (
                    <Button disabled className="bg-blue-100 text-blue-700">Requested You</Button>
                  ) : (
                    <Button
                      className="text-primary hover:bg-primary/10 px-4 py-1.5 rounded-full text-sm font-medium border border-primary/20 bg-white"
                      onClick={async () => {
                        if (!user?.id) return;
                        // Prevent duplicate requests
                        const { data: existing } = await supabase
                          .from('connections')
                          .select('*')
                          .or(
                            `and(from_user_id.eq.${user.id},to_user_id.eq.${friend.id}),and(from_user_id.eq.${friend.id},to_user_id.eq.${user.id})`
                          )
                          .maybeSingle();
                        if (existing) {
                          toast({ title: 'Request already sent!' });
                          return;
                        }
                        const { error } = await supabase.from('connections').insert([
                          { from_user_id: user.id, to_user_id: friend.id, status: 'pending' }
                        ]);
                        if (error) {
                          toast({ title: 'Failed to send request', description: error.message, variant: 'destructive' });
                        } else {
                          setConnectionStatuses(prev => ({ ...prev, [friend.id]: 'pending' }));
                          await fetchFriends();
                          await fetchStatuses();
                          toast({ title: 'Connection request sent!' });
                        }
                      }}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
          {/* Incoming Connection Requests */}
          {incomingRequests.length > 0 && (
            <div className="bg-white rounded-2xl shadow p-5 flex flex-col gap-5 border border-gray-100 min-h-[120px]">
              <h2 className="font-semibold text-lg text-gray-900 mb-2">Incoming Connection Requests</h2>
              {incomingRequests.map(req => (
                <div key={req.id} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200">
                    <img src={req.from_user?.avatar_url} alt={req.from_user?.full_name} className="h-full w-full rounded-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium mb-0.5 text-gray-800 truncate">{req.from_user?.full_name}</p>
                  </div>
                  <Button
                    className="bg-green-100 text-green-700 mr-2"
                    onClick={async () => {
                      await supabase.from('connections').update({ status: 'accepted' }).eq('id', req.id);
                      setIncomingRequests(incomingRequests.filter(r => r.id !== req.id));
                      setConnectionStatuses(prev => ({
                        ...prev,
                        [req.from_user?.id]: 'accepted',
                        [user.id]: 'accepted'
                      }));
                      await fetchFriends();
                      await fetchStatuses();
                      toast({ title: 'Connection accepted!' });
                    }}
                  >
                    Accept
                  </Button>
                  <Button
                    className="bg-red-100 text-red-700"
                    onClick={async () => {
                      await supabase.from('connections').delete().eq('id', req.id);
                      setIncomingRequests(incomingRequests.filter(r => r.id !== req.id));
                      toast({ title: 'Connection rejected.' });
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Liked by Your Friends - Basic Version */}
      {Object.keys(friendsLikedExperiences).length > 0 && (
        <div className="bg-white rounded-2xl shadow p-8 mt-10 mb-8 border border-gray-100 max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <HeartIcon className="h-6 w-6 text-pink-500" />
            <h2 className="font-semibold text-2xl text-gray-900">Liked by Your Friends</h2>
          </div>
          <div className="flex flex-col gap-10">
            {friends.map(friend => (
              <div key={friend.id} className="border-b last:border-b-0 border-gray-100 pb-8 mb-8 last:mb-0 last:pb-0">
                <div className="flex items-center gap-3 mb-4">
                  <img src={friend.avatar_url || '/placeholder.svg'} alt={friend.full_name} className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                  <span className="font-medium text-lg text-gray-800">{friend.full_name}</span>
                </div>
                {(friendsLikedExperiences[friend.id] && friendsLikedExperiences[friend.id].length > 0) ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {friendsLikedExperiences[friend.id].map(exp => (
                      <ExperienceCard key={exp.id} experience={exp} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 italic">No liked experiences yet.</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal with avatar upload */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md flex flex-col gap-6">
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 text-center">Edit Profile</h2>
            <div className="flex flex-col items-center gap-2 mb-2">
              <div className="h-28 w-28 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                <img src={editAvatarPreview || user?.user_metadata?.avatar_url || '/placeholder.svg'} alt="Avatar Preview" className="h-full w-full object-cover rounded-full" />
              </div>
              <input type="file" accept="image/*" className="mt-2" onChange={handleAvatarFileChange} />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                value={editName}
                onChange={e => setEditName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Avatar URL (optional)</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400"
                value={editAvatar}
                onChange={e => setEditAvatar(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button onClick={handleEditProfile}>Save</Button>
            </div>
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
                <Button className="ml-2 text-primary" onClick={handleShareProfile}>Copy</Button>
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