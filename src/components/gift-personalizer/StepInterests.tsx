import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';
import { submitAnswer, fetchSuggestions, goBackOneStep } from '@/lib/aiPersonalizer';
import { useToast } from '@/components/ui/use-toast';

interface StepInterestsProps {
  formData: FormData;
  handleInterestToggle: (interest: string) => void;
  onCustomInterestsChange: (customInterests: string) => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating: boolean;
  setSuggestedExperiences: React.Dispatch<React.SetStateAction<any[]>>;
  interestsPrompt?: string;
  setInterestsInput: (input: string) => void;
  aiSessionId?: string;
}

const StepInterests = ({ 
  formData, 
  handleInterestToggle, 
  onCustomInterestsChange, 
  onNext, 
  onBack, 
  isGenerating, 
  setSuggestedExperiences,
  interestsPrompt,
  setInterestsInput,
  aiSessionId
}: StepInterestsProps) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customInterests, setCustomInterests] = useState('');

  const interests = [
    'Adventure', 'Dining', 'Wellness', 'Luxury', 'Learning', 
    'Sports', 'Arts', 'Music', 'Travel', 'Nature', 'Technology'
  ];

  const handleCustomInterestsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setCustomInterests(value);
    onCustomInterestsChange(value);
  };

  const handleNextClick = async () => {
    // Validate that at least one interest is selected or custom interests are provided
    if (formData.interests.length === 0 && !customInterests.trim()) {
      toast({
        title: "Please select at least one interest or add custom interests",
        description: "Interests help us find the perfect gift for your recipient.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call /submit with interests data
      console.log('=== SUBMITTING INTERESTS DATA ===');
      
      // Combine predefined interests and custom interests
      const allInterests = [...formData.interests];
      if (customInterests.trim()) {
        allInterests.push(customInterests.trim());
      }
      
      // Create interests input string with commas between each interest
      const interestsInput = allInterests.length > 0 ? allInterests.join(', ') : 'general';
      
      console.log('Predefined interests:', formData.interests);
      console.log('Custom interests:', customInterests);
      console.log('Combined interests:', interestsInput);
      console.log('=== END INTERESTS DATA ===');
      
      setInterestsInput(interestsInput);
      await submitAnswer(aiSessionId, interestsInput);
      console.log('Interests data submitted successfully');

      // Call /suggestion to get AI recommendations
      const suggestions = await fetchSuggestions('', 5, aiSessionId);
      setSuggestedExperiences(suggestions);
      console.log('Suggestions fetched and set successfully');
      
      // Move to next step
      onNext();
      
    } catch (error) {
      console.error('Error in interests step:', error);
      toast({
        title: "Error processing request",
        description: error instanceof Error ? error.message : "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackClick = async () => {
    try {
      console.log('=== CALLING /back ===');
      await goBackOneStep(aiSessionId);
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
        {interestsPrompt && (
          <p className="text-lg font-medium text-primary mb-2">{interestsPrompt}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interests & Hobbies</CardTitle>
          <CardDescription>Choose from predefined interests or add your own</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium mb-3 block">Select Interests</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={cn(
                    "px-4 py-2 rounded-lg border text-sm md:text-base transition-all",
                    formData.interests.includes(interest)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="custom-interests">Any other interests?</Label>
            <Textarea 
              id="custom-interests" 
              placeholder="Tell us more about their hobbies and passions..." 
              className="h-24"
              value={customInterests}
              onChange={handleCustomInterestsChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBackClick}
          disabled={isProcessing || isGenerating}
        >
          Back
        </Button>
        
        <Button
          onClick={handleNextClick}
          disabled={isProcessing || isGenerating}
          className="flex items-center gap-2"
        >
          {isProcessing || isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Get AI Suggestions
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepInterests; 