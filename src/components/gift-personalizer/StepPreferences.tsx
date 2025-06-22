import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';
import { submitAnswer, fetchInitQuestion, fetchSuggestions, goBackOneStep } from '@/lib/aiPersonalizer';
import { useToast } from '@/components/ui/use-toast';

interface StepPreferencesProps {
  formData: FormData;
  onBack: () => void;
  onNext: () => void;
  isGenerating: boolean;
  setSuggestedExperiences: React.Dispatch<React.SetStateAction<any[]>>;
}

const StepPreferences = ({ formData, onBack, onNext, isGenerating, setSuggestedExperiences }: StepPreferencesProps) => {
  const { toast } = useToast();
  const [specificPreferences, setSpecificPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecificPreferences(e.target.value);
  };

  const handleSubmitAndFetch = async () => {
    if (!specificPreferences.trim()) {
      toast({
        title: "Please provide preferences",
        description: "Your preferences help us find the perfect gift recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting AI recommendations process...');
      
      // Step 1: Call /init first
      console.log('=== INITIALIZING AI CONTEXT (PREFERENCES STEP) ===');
      await fetchInitQuestion();
      console.log('AI initialized successfully in preferences step');
      
      // Step 2: Call /submit with preferences data
      console.log('=== SUBMITTING PREFERENCES DATA ===');
      console.log('Preferences text:', specificPreferences);
      console.log('=== END PREFERENCES DATA ===');
      
      await submitAnswer(specificPreferences);
      console.log('Preferences data submitted successfully');
      
      // Step 3: Call /suggestion to get AI recommendations
      console.log('=== FETCHING AI SUGGESTIONS ===');
      const suggestions = await fetchSuggestions();
      console.log('AI suggestions received:', suggestions);
      console.log('=== END AI SUGGESTIONS ===');
      
      // Store the suggestions in the parent component's state
      setSuggestedExperiences(suggestions);
      
      // Move to results step
      onNext();
      
    } catch (error) {
      console.error('Error in preferences step:', error);
      toast({
        title: "AI Service Error",
        description: error instanceof Error ? error.message : "Failed to connect to AI service. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = async () => {
    try {
      console.log('=== CALLING /back ===');
      await goBackOneStep();
      console.log('/back called successfully');
      
      // Call the parent's onBack function
      onBack();
    } catch (error) {
      console.error('Error going back:', error);
      toast({
        title: "Error going back",
        description: error instanceof Error ? error.message : "Failed to go back. Please try again.",
        variant: "destructive",
      });
      // Still call onBack even if the API call fails
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-2">Specific Preferences</h2>
        <p className="text-muted-foreground">
          Tell us about {formData.recipient || 'the recipient'}'s specific preferences, personality, lifestyle, likes, dislikes, and any other details that will help us find the perfect gift.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Preferences</CardTitle>
          <CardDescription>Share details about their personality and preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="specificPreferences">Specific Preferences</Label>
            <Textarea
              id="specificPreferences"
              value={specificPreferences}
              onChange={handlePreferencesChange}
              placeholder="Describe their personality, lifestyle, interests, preferences, dislikes, hobbies, favorite activities, or any other details that would help us find the perfect gift..."
              className="min-h-[150px]"
            />
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBackClick}
              disabled={isLoading}
            >
              Back
            </Button>
            
            <Button
              onClick={handleSubmitAndFetch}
              disabled={!specificPreferences.trim() || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Get AI Recommendations
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepPreferences; 