import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Experience } from '@/lib/data/types';
import { Button } from '@/components/ui/button';

const heading = "Discover Your Next Adventure – Swipe to Find the Perfect Experience!";

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 20,
  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
  padding: 32,
  maxWidth: 440,
  margin: '40px auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
};

const imgStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 380,
  aspectRatio: '16/9', // natural landscape ratio
  objectFit: 'cover',
  borderRadius: 12,
  marginBottom: 20,
  background: '#eee',
};

const titleStyle: React.CSSProperties = {
  fontSize: 16, // smaller title
  fontWeight: 600,
  margin: '10px 0 4px 0',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: 320,
};

const descStyle: React.CSSProperties = {
  color: '#444',
  fontSize: 15,
  marginBottom: 8,
  textAlign: 'left',
};

const locationStyle: React.CSSProperties = {
  color: '#6b7280',
  fontSize: 14,
  marginBottom: 8,
  textAlign: 'left',
};

const priceStyle: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 18,
  margin: '8px 0',
  textAlign: 'left',
};

const buttonRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: 20,
  margin: '24px 0',
};

const summaryStyle: React.CSSProperties = {
  marginTop: 32,
  width: '100%',
  textAlign: 'left',
};

// Add fade-in animation styles
const fadeInStyle: React.CSSProperties = {
  animation: 'fadeIn 0.7s',
};

const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
}
`;

const loadingBarStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: 4,
  background: 'linear-gradient(90deg, #6366f1 0%, #22d3ee 100%)',
  zIndex: 1000,
  animation: 'loadingBarAnim 1s linear infinite',
};

const loadingBarAnim = `
@keyframes loadingBarAnim {
  0% { opacity: 0.5; left: -100vw; width: 30vw; }
  50% { opacity: 1; left: 35vw; width: 30vw; }
  100% { opacity: 0.5; left: 100vw; width: 30vw; }
}
`;

// For local development, use FastAPI server directly
const API_BASE = import.meta.env.VITE_API_BASE;
// For production/Netlify, use:
// const API_BASE = "/.netlify/functions/back";

const SwipeExperiences: React.FC = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState<Experience[]>([]);
  const [disliked, setDisliked] = useState<Experience[]>([]);
  const [skipped, setSkipped] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleStartSwiping = () => {
    setShowIntro(false);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 1500);
  };

  // Fetch initial experiences
  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`${API_BASE}/start?user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        const normalized = (data.experiences || data || []).map(exp => ({
          ...exp,
          imageUrl: exp.imageUrl || exp.image_url || [],
        }));
        setExperiences(normalized);
        setCurrent(0);
        setLiked([]);
        setDisliked([]);
        setSkipped([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  // Scroll to top of card on swipe
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [current]);

  const handleAction = (action: 'like' | 'dislike' | 'skip') => {
    const exp = experiences[current];
    if (!exp) return;
    if (action === 'like') setLiked([...liked, exp]);
    if (action === 'dislike') setDisliked([...disliked, exp]);
    if (action === 'skip') setSkipped([...skipped, exp]);
    // Always scroll to top after swipe
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // After swipe, get new recommendations if at end
    if (current + 1 >= experiences.length) {
      setLoading(true);
      fetch(`${API_BASE}/recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          likes: [...liked, ...(action === 'like' ? [exp] : [])].map(e => e.id),
          dislikes: [...disliked, ...(action === 'dislike' ? [exp] : [])].map(e => e.id),
          skips: [...skipped, ...(action === 'skip' ? [exp] : [])].map(e => e.id),
        }),
      })
        .then(res => res.json())
        .then(data => {
          const normalized = (data.experiences || data || []).map(exp => ({
            ...exp,
            imageUrl: exp.imageUrl || exp.image_url || [],
          }));
          setExperiences(normalized);
          setCurrent(0);
        })
        .finally(() => setLoading(false));
    } else {
      setCurrent(prev => prev + 1);
    }
  };

  const currentExp = experiences[current];

  return (
    <>
      <style>{globalStyles + loadingBarAnim}</style>
      {loading && <div style={loadingBarStyle}></div>}
      <div style={{ minHeight: '100vh', minWidth: '100vw', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
        <div style={{ height: 120 }} />
        {showIntro ? (
          <div style={{ background: '#fff', borderRadius: 24, boxShadow: '0 8px 32px rgba(99,102,241,0.10)', padding: 48, maxWidth: 440, minWidth: 320, textAlign: 'center', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎁</div>
            <h1 style={{ fontWeight: 900, fontSize: 32, marginBottom: 10, letterSpacing: 1, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome to Swipe</h1>
            <div style={{ color: '#64748b', fontSize: 18, marginBottom: 32 }}>
              Discover unique experiences for you and your friends. Ready to explore?
            </div>
            <Button style={{ fontSize: 20, padding: '14px 40px', fontWeight: 700, background: 'linear-gradient(90deg, #6366f1, #22d3ee)', color: '#fff', border: 'none', borderRadius: 8, boxShadow: '0 2px 8px rgba(99,102,241,0.10)' }} onClick={handleStartSwiping}>
              Start Swiping
            </Button>
          </div>
        ) : showCelebration ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div style={{ fontSize: 80, animation: 'pop 0.7s cubic-bezier(.68,-0.55,.27,1.55) infinite alternate' }}>🎉</div>
            <style>{`@keyframes pop { 0% { transform: scale(1); } 100% { transform: scale(1.25) rotate(-8deg); } }`}</style>
          </div>
        ) : (
          <div style={{ ...cardStyle, ...fadeInStyle, margin: '0 auto' }} ref={cardRef}>
            <div style={{ fontWeight: 800, fontSize: 18, textAlign: 'center', marginBottom: 10, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 2 }}>Swipe</div>
            {loading ? (
              <div style={{ textAlign: 'center', margin: 32, fontSize: 18 }}>Loading...</div>
            ) : currentExp ? (
              <>
                <img src={currentExp.imageUrl?.[0] || '/placeholder.svg'} alt={currentExp.title} style={imgStyle} />
                <div style={titleStyle} title={currentExp.title}>{currentExp.title.length > 40 ? currentExp.title.slice(0, 40) + '…' : currentExp.title}</div>
                <div style={descStyle}>{currentExp.description}</div>
                <div style={locationStyle}>{currentExp.location}</div>
                <div style={priceStyle}>₹{currentExp.price}</div>
                <div style={{ ...buttonRow, marginTop: 32 }}>
                  <Button style={{ background: '#22c55e', color: '#fff', minWidth: 90, fontWeight: 600 }} onClick={() => handleAction('like')}>Like</Button>
                  <Button style={{ background: '#6b7280', color: '#fff', minWidth: 90, fontWeight: 600 }} onClick={() => handleAction('skip')}>Skip</Button>
                  <Button style={{ background: '#ef4444', color: '#fff', minWidth: 90, fontWeight: 600 }} onClick={() => handleAction('dislike')}>Dislike</Button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', margin: 32, fontSize: 20 }}>No more experiences to show!</div>
            )}
            <div style={{ ...summaryStyle, width: '100%', background: 'rgba(255,255,255,0.95)', padding: 16, borderRadius: 12, marginTop: 24 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Your Swipes</h3>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Liked:</span>
                {liked.length === 0 ? (
                  <span style={{ marginLeft: 8, color: '#6b7280' }}>None</span>
                ) : (
                  <ul style={{ margin: '4px 0 0 20px' }}>{liked.map(exp => <li key={exp.id}>{exp.title}</li>)}</ul>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Disliked:</span>
                {disliked.length === 0 ? (
                  <span style={{ marginLeft: 8, color: '#6b7280' }}>None</span>
                ) : (
                  <ul style={{ margin: '4px 0 0 20px' }}>{disliked.map(exp => <li key={exp.id}>{exp.title}</li>)}</ul>
                )}
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Skipped:</span>
                {skipped.length === 0 ? (
                  <span style={{ marginLeft: 8, color: '#6b7280' }}>None</span>
                ) : (
                  <ul style={{ margin: '4px 0 0 20px' }}>{skipped.map(exp => <li key={exp.id}>{exp.title}</li>)}</ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SwipeExperiences; 