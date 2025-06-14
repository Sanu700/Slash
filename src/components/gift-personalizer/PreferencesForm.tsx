import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FormData } from '@/types/personalizerTypes';

interface PreferencesFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const PreferencesForm = ({ formData, handleInputChange }: PreferencesFormProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium mb-2">Personality Profile</h2>
      <p className="text-muted-foreground mb-8">
        Help us understand {formData.recipient || 'the recipient'}'s personality by describing their traits and preferences.
      </p>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="personality">Personality Traits</Label>
          <Textarea
            id="personality"
            name="preferences.personality"
            value={formData.preferences.personality || ''}
            onChange={handleInputChange}
            placeholder="Describe their personality traits (e.g., outgoing, creative, analytical, etc.)"
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="lifestyle">Lifestyle & Activities</Label>
          <Textarea
            id="lifestyle"
            name="preferences.lifestyle"
            value={formData.preferences.lifestyle || ''}
            onChange={handleInputChange}
            placeholder="Describe their lifestyle and favorite activities (e.g., enjoys outdoor adventures, prefers quiet evenings at home, etc.)"
            className="min-h-[100px]"
          />
        </div>
        
        <div>
          <Label htmlFor="preferences">Specific Preferences</Label>
          <Textarea
            id="preferences"
            name="preferences.specific"
            value={formData.preferences.specific || ''}
            onChange={handleInputChange}
            placeholder="Any specific preferences or dislikes we should know about? (e.g., loves trying new foods, prefers indoor activities, etc.)"
            className="min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;
