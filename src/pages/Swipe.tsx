import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const API_BASE = 'http://localhost:8000';

interface Experience {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  image_url?: string;
}

const USER_ID = 'b3b8c7e2-8c2a-4e2a-9c2a-8c2a4e2a9c2a';
type Niche = 'liked' | 'disliked' | 'skipped';

const Swipe: React.FC = () => {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState<Experience[]>([]);
  const [disliked, setDisliked] = useState<Experience[]>([]);
  const [skipped, setSkipped] = useState<Experience[]>([]);

  const fetchNext = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/start?user_id=${USER_ID}`);
      if (!res.ok) throw new Error('Failed to fetch experience');
      const data = await res.json();
      setExperience(Array.isArray(data) ? data[0] : data);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      setExperience(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: Niche) => {
    if (!experience) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: USER_ID, experience_id: experience.id, action }),
      });
      if (!res.ok) throw new Error('Failed to record swipe');
      if (action === 'liked') setLiked(prev => [...prev, experience]);
      if (action === 'disliked') setDisliked(prev => [...prev, experience]);
      if (action === 'skipped') setSkipped(prev => [...prev, experience]);
      fetchNext();
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNext(); }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f7f8fa] py-8">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg flex flex-col items-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Swipe-based AI Suggestions</h1>
        {loading && <div className="flex justify-center items-center h-96">Loading...</div>}
        {error && <div className="text-red-500 text-center mt-8">{error}</div>}
        {!loading && !error && experience && (
          <>
            <img
              src={experience.image_url || '/placeholder.svg'}
              alt={experience.title}
              className="w-full h-56 object-cover rounded-xl mb-6 border"
              style={{ maxWidth: 480 }}
            />
            <h2 className="text-xl font-bold mb-1 text-left w-full">{experience.title}</h2>
            <p className="mb-1 text-gray-700 w-full text-left">{experience.description}</p>
            <div className="mb-1 text-gray-500 w-full text-left text-sm">
              Locations like Nandi Hills, Skandagiri, and Ramanagara
            </div>
            <div className="mb-2 text-gray-400 w-full text-left text-sm">
              {experience.location}
            </div>
            <div className="mb-6 text-black font-bold w-full text-left text-lg">
              ₹{experience.price}
            </div>
            <div className="flex gap-4 mb-8 w-full justify-center">
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded transition"
                onClick={() => handleAction('liked')}
                disabled={loading}
              >
                Like
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded transition"
                onClick={() => handleAction('skipped')}
                disabled={loading}
              >
                Skip
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded transition"
                onClick={() => handleAction('disliked')}
                disabled={loading}
              >
                Dislike
              </button>
            </div>
          </>
        )}
        {!loading && !error && !experience && (
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