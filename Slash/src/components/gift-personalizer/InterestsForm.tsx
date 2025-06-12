
import React from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormData } from '@/types/personalizerTypes';

interface InterestsFormProps {
  formData: FormData;
  handleInterestToggle: (interest: string) => void;
}

const InterestsForm = ({ formData, handleInterestToggle }: InterestsFormProps) => {
  const interests = [
    'Adventure', 'Dining', 'Wellness', 'Luxury', 'Learning', 
    'Sports', 'Arts', 'Music', 'Travel', 'Nature', 'Technology'
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium mb-2">What are they interested in?</h2>
      <p className="text-muted-foreground mb-8">
        Select all interests that apply to {formData.recipient || 'the recipient'}.
      </p>
      
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
      
      <div className="mt-6">
        <Label htmlFor="custom-interests">Any other interests?</Label>
        <Textarea 
          id="custom-interests" 
          placeholder="Tell us more about their hobbies and passions..." 
          className="h-24"
        />
      </div>
    </div>
  );
};

export default InterestsForm;
