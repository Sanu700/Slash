import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, MessageCircle } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';
import { useNavigate } from 'react-router-dom';
import { formatRupees } from '@/lib/formatters';
import { submitFollowup } from '@/lib/aiPersonalizer';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience } from '@/lib/data/types';
import { supabase } from '@/lib/supabaseClient';

interface StepResultsFollowupProps {
  formData: FormData;
  initialSuggestions: Experience[];
  onBack: () => void;
  onStartOver: () => void;
  basicsInput: string;
  interestsInput: string;
  aiSessionId?: string;
}

const StepResultsFollowup = ({ formData, initialSuggestions, onBack, onStartOver, basicsInput, interestsInput, aiSessionId }: StepResultsFollowupProps) => {
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [experiences, setExperiences] = useState<Experience[]>(initialSuggestions);

  const handleChatOpen = () => setShowChat(v => !v);
  const handleChatClose = () => { setShowChat(false); setChatInput(""); };

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;
    setIsChatLoading(true);
    try {
      const followupResult = await submitFollowup(aiSessionId, chatInput);
      let aiSuggestions: any[] = [];
      if (Array.isArray(followupResult)) aiSuggestions = followupResult;
      else if (typeof followupResult === 'object' && followupResult !== null) {
        const arrayValue = Object.values(followupResult).find(v => Array.isArray(v));
        if (arrayValue) aiSuggestions = arrayValue as any[];
        else aiSuggestions = [followupResult];
      }
      // Extract supabase_ids from AI output
      const supabaseIds = aiSuggestions.map((s: any) => s.supabase_id).filter(Boolean);
      let matchedExperiences: Experience[] = [];
      if (supabaseIds.length > 0) {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .in('id', supabaseIds);
        if (!error) {
          matchedExperiences = data || [];
        }
      }
      setExperiences(matchedExperiences);
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
          {experiences && experiences.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No suggestions available at the moment.</p>
            </div>
          )}

          <div className="flex justify-center gap-4 pt-6">
            <Button onClick={onStartOver} className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepResultsFollowup; 