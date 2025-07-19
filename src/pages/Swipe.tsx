import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import ExperienceCard from '@/components/ExperienceCard';

const API_BASE = 'https://swipe-68h5.onrender.com';

interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url?: string[]; // updated to array
  duration?: string;
  participants?: string;
  date?: string;
  category?: string;
  niche_category?: string;
  trending?: boolean;
  featured?: boolean;
  romantic?: boolean;
  adventurous?: boolean;
  group_activity?: boolean;
  created_at?: string;
  updated_at?: string;
  status?: string;
  tags?: string;
  idtag?: number;
  latitude?: number;
  longitude?: number;
  exp_type?: string[];
}

type Niche = 'liked' | 'disliked' | 'skipped';

const Swipe: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [userId, setUserId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]); // Store all experiences
  const [currentIndex, setCurrentIndex] = useState(0); // Track which experience is being shown
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<Experience[]>([]);
  const [disliked, setDisliked] = useState<Experience[]>([]);
  const [skipped, setSkipped] = useState<Experience[]>([]);
  const [apiOutput, setApiOutput] = useState<any>(null);
  const [rawApiExperiences, setRawApiExperiences] = useState<any[]>([]); // Store raw API output

  // --- Swipe-based AI Suggestions Page ---
  // This page fetches the logged-in user's id from Supabase (by matching full_name),
  // then calls the /start endpoint with user_id to get swipe experiences.
  // The user_id is stored in state and used for all swipe actions.
  // Fetch user_id from Supabase by full_name (robust, with clear comments)
  useEffect(() => {
    const fetchUserId = async () => {
      // If user is not logged in or full_name is missing, show error
      if (!user || !user.user_metadata?.full_name) {
        setError('You must be logged in to use Swipe AI.');
        setUserId(null);
        return;
      }
      setError(null);
      // Query Supabase profiles table for id where full_name matches
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('full_name', user.user_metadata.full_name)
        .single();
      if (error || !data) {
        setError('Could not find your user profile.');
        setUserId(null);
      } else {
        setUserId(data.id); // Store user_id in state
      }
    };
    fetchUserId();
  }, [user]);

  // Fetch next experience(s) from /start endpoint
  const fetchExperiences = async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/start?user_id=${uid}`);
      if (!res.ok) throw new Error('Failed to fetch experience');
      let data = await res.text();
      console.log('DEBUG: Raw API response:', data); // TEMP DEBUG LOG
      let arr: any[] = [];
      let parseError = '';
      try {
        arr = JSON.parse(data);
      } catch {
        // Try to extract all valid JSON arrays/objects using regex
        const matches = data.match(/\{[\s\S]*?\}|\[[\s\S]*?\]/g);
        if (matches) {
          arr = matches.flatMap((jsonStr) => {
            try {
              const parsed = JSON.parse(jsonStr);
              return Array.isArray(parsed) ? parsed : [parsed];
            } catch {
              return [];
            }
          });
        } else {
          parseError = 'Could not parse API response as JSON.';
        }
      }
      setExperiences(arr);
      setRawApiExperiences(arr);
      setCurrentIndex(0);
      setApiOutput(arr.length > 0 ? arr : data);
      if (arr.length === 0 && parseError) setError(parseError);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setExperiences([]);
      setRawApiExperiences([]);
      setCurrentIndex(0);
      setApiOutput(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch experiences when userId is available
  useEffect(() => {
    if (userId) {
      fetchExperiences(userId); // Only call /start when userId is set
    }
  }, [userId]);

  // Handle like/dislike/skip actions (recommendation endpoint can be added here)
  const handleAction = async (action: Niche) => {
    if (!experiences[currentIndex] || !userId) return;
    setLoading(true);
    setError(null);
    try {
      // TODO: Update to use /recommendation endpoint as needed
      // Example POST to /recommendation:
      // await fetch(`${API_BASE}/recommendation`, { ... })
      if (action === 'liked') setLiked(prev => [...prev, experiences[currentIndex]]);
      if (action === 'disliked') setDisliked(prev => [...prev, experiences[currentIndex]]);
      if (action === 'skipped') setSkipped(prev => [...prev, experiences[currentIndex]]);
      // Move to next valid experience
      setCurrentIndex(idx => idx + 1);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Add mapToExperience utility (from StepResults)
  const mapToExperience = (s: any) => ({
    id: s.id || Math.random().toString(36).substr(2, 9),
    title: s.title || '',
    description: s.description || '',
    imageUrl: Array.isArray(s.imageUrl) ? s.imageUrl : [s.image_url || s.image || s.imageUrl || s.img || s.photo || s.thumbnail || '/placeholder.svg'],
    price: s.price || 0,
    location: s.location || '',
    latitude: s.latitude,
    longitude: s.longitude,
    duration: s.duration || '',
    participants: s.participants || '',
    date: s.date || '',
    category: s.category || '',
    niche: s.niche,
    nicheCategory: s.nicheCategory || s.niche_category,
    trending: s.trending,
    featured: s.featured,
    romantic: s.romantic,
    adventurous: s.adventurous,
    group: s.group || s.group_activity,
    coordinates: s.coordinates,
    exp_type: s.exp_type,
  });

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f8fa] py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Swipe-based AI Suggestions</h1>
          <div className="text-center text-lg">Please log in to use Swipe AI.</div>
        </div>
      </div>
    );
  }

  // RawExperienceCard: displays all fields present in the API output
  const RawExperienceCard: React.FC<{ exp: any }> = ({ exp }) => (
    <div className="bg-white rounded-2xl shadow p-6 w-full flex flex-col items-center border">
      {exp.image_url && Array.isArray(exp.image_url) && exp.image_url.length > 0 && (
        <img
          src={exp.image_url[0]}
          alt={exp.title || 'Experience image'}
          className="w-full object-cover rounded-xl mb-4 border"
          style={{ maxWidth: 600, height: 'auto' }}
        />
      )}
      {/* Show all fields except image_url */}
      {Object.entries(exp).map(([key, value]) =>
        key !== 'image_url' && value !== undefined && value !== null && value !== '' && (
          <div key={key} className="mb-1 text-gray-700 w-full text-center text-sm">
            <span className="font-semibold">{key}:</span> {Array.isArray(value) ? value.join(', ') : value.toString()}
          </div>
        )
      )}
    </div>
  );

  // ExperienceGrid: displays a grid of experience cards
  const ExperienceGrid: React.FC<{ experiences: any[] }> = ({ experiences }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {experiences.map((exp, idx) => (
        <div
          key={exp.id || idx}
          className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-200 overflow-hidden flex flex-col cursor-pointer transform hover:scale-[1.03]"
          style={{ minHeight: 340 }}
        >
          {/* exp_type badge */}
          {exp.exp_type && Array.isArray(exp.exp_type) && exp.exp_type[0] && (
            <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-br-2xl rounded-bl-2xl w-fit ml-4 mt-4 mb-2">
              {exp.exp_type[0]}
            </div>
          )}
          {/* Image */}
          {exp.image_url && Array.isArray(exp.image_url) && exp.image_url[0] ? (
            <img
              src={exp.image_url[0]}
              alt={exp.title || 'Experience image'}
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
          )}
          {/* Content */}
          <div className="p-4 flex flex-col flex-1">
            {/* Title */}
            <h3 className="text-lg font-bold mb-1 line-clamp-2">{exp.title}</h3>
            {/* Description */}
            {exp.description && (
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                {exp.description.length > 100 ? exp.description.slice(0, 100) + '…' : exp.description}
              </p>
            )}
            {/* Duration & Location */}
            <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-2">
              {exp.duration && <span>⏱ {exp.duration}</span>}
              {exp.location && <span>📍 {exp.location}</span>}
            </div>
            {/* Price */}
            {typeof exp.price === 'number' && (
              <div className="text-primary font-bold text-lg mt-auto">₹{exp.price}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f8fa] py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-5xl flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Swipe-based AI Suggestions</h1>
        {loading && <div className="flex justify-center items-center h-96">Loading...</div>}
        {error && <div className="text-red-500 text-center mt-8">{error}</div>}
        {/* Debug: Show full API output or error */}
        {!loading && !error && rawApiExperiences.length > 0 && (
          <div className="w-full mb-4">
            <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-64">{JSON.stringify(rawApiExperiences, null, 2)}</pre>
          </div>
        )}
        {error && (
          <div className="w-full mb-4 text-red-600">
            <div>Error: {error}</div>
            <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-64">{typeof apiOutput === 'string' ? apiOutput : JSON.stringify(apiOutput, null, 2)}</pre>
          </div>
        )}
        {/* Show grid of experience cards or a placeholder if none */}
        {!loading && !error && rawApiExperiences.length > 0 && (
          <ExperienceGrid experiences={rawApiExperiences} />
        )}
        {!loading && !error && rawApiExperiences.length === 0 && (
          <div className="w-full flex flex-col items-center mt-8">
            <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md flex flex-col items-center border">
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 mb-4">No experiences to display</div>
              <div className="text-gray-500 text-center">No valid experiences found in the API output.</div>
            </div>
            <div className="w-full mt-4">
              <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto max-h-64">{typeof apiOutput === 'string' ? apiOutput : JSON.stringify(apiOutput, null, 2)}</pre>
            </div>
          </div>
        )}
        {/* Fallback if no more experiences */}
        {!loading && !error && (rawApiExperiences.length === 0 || currentIndex >= rawApiExperiences.length) && (
          <div className="text-center mt-8">No more experiences to swipe!</div>
        )}
        {/* Your Swipes Section */}
        <div className="w-full mt-2">
          <div className="font-semibold text-lg mb-1">Your Swipes</div>
          <div className="mb-1 font-semibold">Liked:</div>
          <ul className="mb-2 ml-4">
            {liked.length === 0 && <li className="text-gray-400"> </li>}
            {liked.map(exp => <li key={exp.id} className="list-disc">{exp.title}</li>)}
          </ul>
          <div className="mb-1 font-semibold">Disliked:</div>
          <ul className="mb-2 ml-4">
            {disliked.length === 0 && <li className="text-gray-400"> </li>}
            {disliked.map(exp => <li key={exp.id} className="list-disc">{exp.title}</li>)}
          </ul>
          <div className="mb-1 font-semibold">Skipped:</div>
          <ul className="mb-2 ml-4">
            {skipped.length === 0 && <li className="text-gray-400"> </li>}
            {skipped.map(exp => <li key={exp.id} className="list-disc">{exp.title}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Swipe; 
