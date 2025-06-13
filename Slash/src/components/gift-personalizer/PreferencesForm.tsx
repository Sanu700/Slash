
import React from 'react';
import { Label } from '@/components/ui/label';
import { FormData } from '@/types/personalizerTypes';

interface PreferencesFormProps {
  formData: FormData;
  handleSliderChange: (preference: keyof FormData['preferences'], value: number) => void;
}

const PreferencesForm = ({ formData, handleSliderChange }: PreferencesFormProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium mb-2">Personality Profile</h2>
      <p className="text-muted-foreground mb-8">
        Help us understand {formData.recipient || 'the recipient'}'s personality by adjusting these sliders.
      </p>
      
      <div className="space-y-8">
        <div>
          <div className="flex justify-between mb-2">
            <Label>Cautious</Label>
            <Label>Adventurous</Label>
          </div>
          <input 
            type="range"
            min="1"
            max="5"
            value={formData.preferences.adventurous}
            onChange={(e) => handleSliderChange('adventurous', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Introverted</Label>
            <Label>Social</Label>
          </div>
          <input 
            type="range"
            min="1"
            max="5"
            value={formData.preferences.social}
            onChange={(e) => handleSliderChange('social', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Active</Label>
            <Label>Relaxed</Label>
          </div>
          <input 
            type="range"
            min="1"
            max="5"
            value={formData.preferences.relaxation}
            onChange={(e) => handleSliderChange('relaxation', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label>Practical</Label>
            <Label>Curious</Label>
          </div>
          <input 
            type="range"
            min="1"
            max="5"
            value={formData.preferences.learning}
            onChange={(e) => handleSliderChange('learning', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;
