import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

// Helper to join IDs with backtick
const joinIds = (arr: string[]) => arr.join('`');

const API_BASE = "http://localhost:8002";

const SwipeAISuggestions = () => {
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [liked, setLiked] = useState<string[]>([]);
  const [disliked, setDisliked] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swipeCount, setSwipeCount] = useState(0);

  // Call /start on mount
  useEffect(() => {
    const fetchStart = async () => {
      if (!user?.id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/start?user_id=${user.id}`, {
          method: "GET"
        });
        if (!res.ok) throw new Error("Failed to start session");
        const data = await res.json();
        const normalizedExperiences = (data.experiences || []).map(exp => ({
          ...exp,
          imageUrl: Array.isArray(exp.imageUrl)
            ? exp.imageUrl
            : exp.image_url
              ? [exp.image_url]
              : exp.image
                ? [exp.image]
                : exp.img
                  ? [exp.img]
                  : exp.photo
                    ? [exp.photo]
                    : exp.thumbnail
                      ? [exp.thumbnail]
                      : ['/placeholder.svg'],
        }));
        setSessionId(data.session_id);
        setExperiences(normalizedExperiences);
        setCurrentIdx(0);
        setLiked([]);
        setDisliked([]);
        setSkipped([]);
        setSwipeCount(0);
      } catch (err) {
        setError("Failed to start swipe session");
      } finally {
        setLoading(false);
      }
    };
    fetchStart();
  }, [user?.id]);

  // Handle swipe action
  const handleSwipe = useCallback(
    async (type: "like" | "dislike" | "skip") => {
      if (!experiences[currentIdx]) return;
      const expId = experiences[currentIdx].id;
      if (type === "like") setLiked(prev => [...prev, expId]);
      if (type === "dislike") setDisliked(prev => [...prev, expId]);
      if (type === "skip") setSkipped(prev => [...prev, expId]);
      setSwipeCount(prev => prev + 1);
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);

      // After every 5 swipes, call /recommend
      if ((swipeCount + 1) % 5 === 0) {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${API_BASE}/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: user?.id,
              likes: [...liked, type === "like" ? expId : ""].filter(Boolean),
              dislikes: [...disliked, type === "dislike" ? expId : ""].filter(Boolean),
              skips: [...skipped, type === "skip" ? expId : ""].filter(Boolean),
            })
          });
          if (!res.ok) throw new Error("Failed to get recommendations");
          const data = await res.json();
          // Append new experiences
          setExperiences(prev => [...prev, ...(data.experiences || [])]);
        } catch (err) {
          setError("Failed to fetch recommendations");
        } finally {
          setLoading(false);
        }
      }
    },
    [currentIdx, experiences, liked, disliked, skipped, sessionId, swipeCount, user?.id]
  );

  // UI for current experience
  const currentExp = experiences[currentIdx];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Swipe-based AI Suggestions</h1>
        {!user?.id && <div className="text-red-500">Please log in to use Swipe AI.</div>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
        {loading && <div className="text-blue-500 mt-4">Loading...</div>}
        {user?.id && currentExp && (
          <div className="flex flex-col items-center mt-6">
            <div className="mb-4 w-full">
              <img src={currentExp.imageUrl?.[0] || currentExp.imageUrl || "/placeholder.svg"} alt={currentExp.title} className="w-full h-48 object-cover rounded mb-2" />
              <h2 className="text-xl font-semibold mb-1">{currentExp.title}</h2>
              <p className="text-gray-600 mb-2">{currentExp.description}</p>
              <div className="text-sm text-gray-500 mb-2">{currentExp.location}</div>
              <div className="text-lg font-bold mb-2">₹{currentExp.price}</div>
            </div>
            <div className="flex gap-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleSwipe("like")} disabled={loading}>Like</button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => handleSwipe("skip")} disabled={loading}>Skip</button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => handleSwipe("dislike")} disabled={loading}>Dislike</button>
            </div>
          </div>
        )}
        {user?.id && !currentExp && !loading && (
          <div className="mt-8 text-center text-lg font-semibold">No more experiences to swipe! 🎉</div>
        )}
        <div className="mt-8">
          <h3 className="font-bold mb-2">Your Swipes</h3>
          <div className="mb-2">
            <span className="font-semibold">Liked:</span>
            <ul className="list-disc ml-6">
              {liked.map(id => {
                const exp = experiences.find(e => e.id === id);
                return <li key={id}>{exp ? exp.title : id}</li>;
              })}
            </ul>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Disliked:</span>
            <ul className="list-disc ml-6">
              {disliked.map(id => {
                const exp = experiences.find(e => e.id === id);
                return <li key={id}>{exp ? exp.title : id}</li>;
              })}
            </ul>
          </div>
          <div className="mb-2">
            <span className="font-semibold">Skipped:</span>
            <ul className="list-disc ml-6">
              {skipped.map(id => {
                const exp = experiences.find(e => e.id === id);
                return <li key={id}>{exp ? exp.title : id}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeAISuggestions; 