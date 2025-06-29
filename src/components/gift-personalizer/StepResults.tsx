import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, MessageCircle } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';
import { useNavigate } from 'react-router-dom';
import { formatRupees } from '@/lib/formatters';
import { goBackOneStep, submitAnswer, fetchNextQuestion, fetchSuggestions, fetchInitQuestion, resetSession, submitFollowup } from '@/lib/aiPersonalizer';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
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

const AISuggestionCard = ({ suggestion }: { suggestion: Suggestion }) => {
  const navigate = useNavigate();
  const imageUrl = suggestion.image || suggestion.imageUrl || suggestion.img || suggestion.photo || suggestion.thumbnail || '/placeholder.svg';
  
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

const StepResults = ({ formData, suggestions, onBack, onStartOver, basicsInput, interestsInput, aiSessionId }: StepResultsProps) => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [localSuggestions, setLocalSuggestions] = useState(suggestions);
  const [resultsHistory, setResultsHistory] = useState<Suggestion[][]>([]);
  const [showHistory, setShowHistory] = useState(false);
  console.log('StepResults received suggestions:', suggestions);
  console.log('Number of suggestions:', suggestions.length);
  
  const mapSuggestionToExperience = (suggestion: Suggestion) => ({
    id: suggestion.id,
    title: suggestion.title,
    description: suggestion.description,
    imageUrl: suggestion.image || suggestion.imageUrl || suggestion.img || suggestion.photo || suggestion.thumbnail || '/placeholder.svg',
    price: suggestion.price,
    location: 'Unknown',
    duration: 'N/A',
    participants: 'N/A',
    date: 'N/A',
    category: suggestion.category || 'General',
  });

  const handleChatOpen = () => {
    if (showChat) {
      // If chat is open, close it
      setShowChat(false);
      setChatInput("");
    } else {
      // If chat is closed, open it
      setShowChat(true);
    }
  };

  const handleChatClose = () => {
    setShowChat(false);
    setChatInput("");
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setIsChatLoading(true);
    try {
      // Save current results to history before updating
      setResultsHistory(prev => [localSuggestions, ...prev]);
      
      // Submit the chat input using followup - response should contain new suggestions
      const followupResult = await submitFollowup(aiSessionId, chatInput);
      
      // Process the followup result to extract suggestions
      if (followupResult) {
        let newSuggestions = [];
        
        if (Array.isArray(followupResult)) {
          // If the response is directly an array of suggestions
          newSuggestions = followupResult;
        } else if (followupResult.suggestions && Array.isArray(followupResult.suggestions)) {
          // If the response has a suggestions property
          newSuggestions = followupResult.suggestions;
        } else if (followupResult.results && Array.isArray(followupResult.results)) {
          // If the response has a results property
          newSuggestions = followupResult.results;
        } else if (typeof followupResult === 'object' && followupResult !== null) {
          // If it's an object, try to extract suggestions from it
          const keys = Object.keys(followupResult);
          for (const key of keys) {
            if (Array.isArray(followupResult[key])) {
              newSuggestions = followupResult[key];
              break;
            }
          }
          
          // If no array found, treat the object as a single suggestion
          if (newSuggestions.length === 0) {
            newSuggestions = [followupResult];
          }
        }
        
        if (newSuggestions.length > 0) {
          setLocalSuggestions(newSuggestions);
        }
      }
      
      setShowChat(false);
      setChatInput("");
    } catch (err) {
      // Optionally show error
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRestoreHistory = (historyIndex: number) => {
    setLocalSuggestions(resultsHistory[historyIndex]);
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
          {localSuggestions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {localSuggestions.map((suggestion, index) => (
                <AISuggestionCard key={suggestion.id || index} suggestion={suggestion} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No suggestions available at the moment.</p>
            </div>
          )}

          {resultsHistory.length > 0 && (
            <div className="mt-8">
              <Button variant="outline" size="sm" onClick={() => setShowHistory(v => !v)}>
                {showHistory ? 'Hide Previous Results' : 'Show Previous Results'}
              </Button>
              {showHistory && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" /> Previous Results
                  </h3>
                  <div className="space-y-6">
                    {resultsHistory.map((history, idx) => (
                      <div key={idx} className="border rounded-lg p-2 bg-gray-50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-muted-foreground">Result Set #{resultsHistory.length - idx}</span>
                          <Button size="sm" variant="outline" onClick={() => handleRestoreHistory(idx)}>
                            View
                          </Button>
                        </div>
                        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                          {history.map((suggestion, sidx) => (
                            <AISuggestionCard key={suggestion.id || sidx} suggestion={suggestion} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-4 pt-6">
            <Button
              onClick={onStartOver}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepResults; 