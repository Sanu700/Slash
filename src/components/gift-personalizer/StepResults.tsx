import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';
import { useNavigate } from 'react-router-dom';
import { formatRupees } from '@/lib/formatters';
import { goBackOneStep, submitAnswer, fetchNextQuestion, fetchSuggestions, fetchInitQuestion, resetSession, submitFollowup } from '@/lib/aiPersonalizer';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data/types';
import { supabase } from '@/lib/supabaseClient';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  image?: string;
  imageUrl?: string;
  img?: string;
  photo?: string;
  thumbnail?: string;
}

interface StepResultsProps {
  formData: FormData;
  suggestions: Suggestion[];
  onBack: () => void;
  onStartOver: () => void;
  basicsInput: string;
  interestsInput: string;
  aiSessionId?: string;
}

const getFirstImageUrl = (suggestion: Suggestion) => {
  const fields = [
    suggestion.image_url,
    suggestion.image,
    suggestion.imageUrl,
    suggestion.img,
    suggestion.photo,
    suggestion.thumbnail
  ];
  for (const field of fields) {
    if (Array.isArray(field) && field.length > 0) return field[0];
    if (typeof field === 'string' && field) return field;
  }
  return '/placeholder.svg';
};

const AISuggestionCard = ({ suggestion }: { suggestion: Suggestion }) => {
  const navigate = useNavigate();
  const imageUrl = getFirstImageUrl(suggestion);
  
  // Debug logging
  console.log('AISuggestionCard image data:', {
    title: suggestion.title,
    imageUrl,
    originalFields: {
      image: suggestion.image,
      imageUrl: suggestion.imageUrl,
      img: suggestion.img,
      photo: suggestion.photo,
      thumbnail: suggestion.thumbnail
    }
  });
  
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={suggestion.title}
          className="w-full h-full object-cover object-center"
          style={{ minHeight: '200px', minWidth: '100%' }}
          onError={(e) => {
            console.log(`Image failed to load for ${suggestion.title}:`, imageUrl);
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{suggestion.title}</CardTitle>
        <CardDescription className="text-sm">{suggestion.category}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {suggestion.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">
            {formatRupees(suggestion.price)}
          </span>
          <Button 
            size="sm" 
            onClick={() => navigate(`/experience/${suggestion.id}`)}
            className="flex items-center gap-1"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const mapToExperience = (s: any): Experience => ({
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
  nicheCategory: s.nicheCategory,
  trending: s.trending,
  featured: s.featured,
  romantic: s.romantic,
  adventurous: s.adventurous,
  group: s.group,
  coordinates: s.coordinates,
  exp_type: s.exp_type,
});

function isValidExperience(obj: any): obj is Experience {
  return obj && typeof obj.id === 'string' && typeof obj.title === 'string' && Array.isArray(obj.imageUrl) && obj.imageUrl.length > 0 && typeof obj.location === 'string' && typeof obj.duration === 'string' && typeof obj.participants === 'string' && typeof obj.date === 'string';
}

const StepResults = ({ formData, suggestions, onBack, onStartOver, basicsInput, interestsInput, aiSessionId }: StepResultsProps) => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  // Always use aiSuggestions as the source of truth
  const [aiSuggestions, setAiSuggestions] = useState<Suggestion[]>(suggestions);
  // Store history of previous results
  const [history, setHistory] = useState<Suggestion[][]>([]);
  const [showHistory, setShowHistory] = useState(false);
  // Always show the latest AI output (from /suggestion or /followup)
  // Use aiSuggestions as the only source of truth
  const suggestionsToShow = aiSuggestions;

  // Remove all Supabase/local/fallback logic

  const handleChatOpen = () => setShowChat(v => !v);
  const handleChatClose = () => { setShowChat(false); setChatInput(""); };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setIsChatLoading(true);
    try {
      // Save current suggestions to history before updating
      if (aiSuggestions && aiSuggestions.length > 0) {
        setHistory(prev => [aiSuggestions, ...prev]);
      }
      const followupResult = await submitFollowup(aiSessionId, chatInput);
      let newSuggestions: any[] = [];
      if (Array.isArray(followupResult)) newSuggestions = followupResult;
      else if (typeof followupResult === 'object' && followupResult !== null) {
        const arrayValue = Object.values(followupResult).find(v => Array.isArray(v));
        if (arrayValue) newSuggestions = arrayValue as any[];
        else newSuggestions = [followupResult];
      }

      console.log('AI suggestions:', newSuggestions);
      // Match by supabase_id only (as in StepInterests)
      const supabaseIds = newSuggestions.map((s: any) => s.supabase_id).filter(Boolean);
      console.log('Supabase IDs:', supabaseIds);
      let matchedExperiences = [];
      if (supabaseIds.length > 0) {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .in('id', supabaseIds);
        if (!error) {
          matchedExperiences = data || [];
        }
      }
      console.log('Matched experiences:', matchedExperiences);
      setAiSuggestions(matchedExperiences.length > 0 ? matchedExperiences : newSuggestions);
      setShowChat(false);
      setChatInput("");
    } catch (err) {
      // Optionally handle error
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-8">
        <div className="flex items-center mr-4">
          <Sparkles className="h-10 w-10 text-primary" />
          <Button variant="ghost" className="ml-2" onClick={handleChatOpen}>
            Not satisfied?
          </Button>
        </div>
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-medium mb-2">Your Personalized Gift Recommendations</h2>
          <p className="text-muted-foreground">
            Based on your preferences for {formData.recipient || 'the recipient'}, here are some perfect matches we found.
          </p>
        </div>
      </div>

      {showChat && (
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md flex flex-col items-center">
            <div className="flex items-center mb-2">
              <MessageCircle className="h-6 w-6 text-primary mr-2" />
              <span className="font-medium">Any specific preferences?</span>
            </div>
            <input
              className="border rounded px-3 py-2 w-full mb-2"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type your preferences..."
              disabled={isChatLoading}
              onKeyDown={e => { if (e.key === 'Enter') handleChatSubmit(); }}
            />
            <div className="flex gap-2 w-full">
              <Button onClick={handleChatSubmit} disabled={isChatLoading || !chatInput.trim()} className="flex-1">
                {isChatLoading ? 'Processing...' : 'Next'}
              </Button>
              <Button variant="outline" onClick={handleChatClose} disabled={isChatLoading} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Curated just for you based on your input</CardDescription>
        </CardHeader>
        <CardContent>
          {suggestionsToShow && suggestionsToShow.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestionsToShow.map((experience) => {
                const key = isValidExperience(experience)
                  ? String(experience.id)
                  : ('supabase_id' in experience ? String((experience as any).supabase_id) : String(experience.id || Math.random().toString(36).substr(2, 9)));
                return isValidExperience(experience)
                  ? <ExperienceCard key={key} experience={experience} openInNewTab={true} />
                  : <ExperienceCard key={key} experience={mapToExperience(experience)} openInNewTab={true} />;
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No suggestions available at the moment.</p>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-6">
            {history.length > 0 && (
              <Button variant="outline" size="sm" onClick={() => setShowHistory(v => !v)}>
                {showHistory ? 'Hide Previous Results' : 'Show Previous Results'}
              </Button>
            )}
            <div className="flex-1" />
            <Button onClick={onStartOver} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Results section moved below current experiences */}
      {showHistory && history.length > 0 && (
        <div className="mb-6 mt-6">
          {history.map((prevResults, idx) => (
            <Card key={idx} className="mb-4 border-dashed border-2 border-gray-300 bg-gray-50">
              <CardHeader>
                <CardTitle>Previous Results {history.length - idx}</CardTitle>
                <CardDescription>These were your earlier recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {prevResults.map((experience, i) => {
                    const key = isValidExperience(experience)
                      ? String(experience.id)
                      : ('supabase_id' in experience ? String((experience as any).supabase_id) : String(experience.id || Math.random().toString(36).substr(2, 9)));
                    return isValidExperience(experience)
                      ? <ExperienceCard key={key} experience={experience} openInNewTab={true} />
                      : <ExperienceCard key={key} experience={mapToExperience(experience)} openInNewTab={true} />;
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StepResults; 
