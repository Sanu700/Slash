import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormData } from '@/types/personalizerTypes';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import { fetchInitQuestion, submitAnswer } from '@/lib/aiPersonalizer';
import { useToast } from '@/components/ui/use-toast';

interface StepBasicsProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void;
  isGenerating: boolean;
}

const StepBasics = ({ formData, handleInputChange, setFormData, onNext, isGenerating }: StepBasicsProps) => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNextClick = async () => {
    // Validate form data first
    const isRelationshipOther = formData.relationship === 'other';
    const isOccasionOther = formData.occasion === 'other';
    
    if (
      !formData.recipient ||
      !formData.city ||
      !formData.relationship ||
      (isRelationshipOther && !formData.customRelationship) ||
      !formData.occasion ||
      (isOccasionOther && !formData.customOccasion)
    ) {
      toast({
        title: "Please complete all fields",
        description: "All fields are required to provide personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Step 1: Call /init if not already initialized
      if (!isInitialized) {
        console.log('=== INITIALIZING AI CONTEXT (FIRST TIME) ===');
        await fetchInitQuestion();
        console.log('AI initialized successfully');
        setIsInitialized(true);
      }

      // Step 2: Call /submit with basics data
      console.log('=== SUBMITTING BASICS DATA ===');
      
      // Construct the proper input string with all form data
      const recipient = formData.recipient || 'User';
      const location = formData.city || 'Mumbai';
      const relation = formData.relationship === 'other' ? formData.customRelationship : formData.relationship || 'Friend';
      const occasion = formData.occasion === 'other' ? formData.customOccasion : formData.occasion || 'Birthday';
      const budget = formData.budget || '10000-50000';
      
      // Create the input string in the required format: name`location`relation`occasion`budget
      const combinedInput = `${recipient}\`${location}\`${relation}\`${occasion}\`${budget}`;
      
      console.log('Form data:', formData);
      console.log('Constructed input:', combinedInput);
      console.log('Input parts:', combinedInput.split('`'));
      console.log('Number of parts:', combinedInput.split('`').length);
      console.log('=== END BASICS DATA ===');
      
      await submitAnswer(combinedInput);
      console.log('Basics data submitted successfully');
      
      // Step 3: Move to next step
      onNext();
      
    } catch (error) {
      console.error('Error in basics step:', error);
      toast({
        title: "Error processing request",
        description: error instanceof Error ? error.message : "Failed to process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-2">Tell us about the recipient</h2>
        <p className="text-muted-foreground">
          Let's start with some basic information about who you're shopping for.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Fill in the details about the gift recipient</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient's Name</Label>
            <Input
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              placeholder="Who is this gift for?"
            />
          </div>
          
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter their city"
            />
          </div>

          <div>
            <Label htmlFor="relationship">Your Relationship</Label>
            <select
              id="relationship"
              name="relationship"
              value={formData.relationship}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, relationship: e.target.value }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Select relationship</option>
              <option value="partner">Partner/Spouse</option>
              <option value="friend">Friend</option>
              <option value="family">Family Member</option>
              <option value="colleague">Colleague</option>
              <option value="other">Other</option>
            </select>
            {formData.relationship === "other" && (
              <Input
                id="customRelationship"
                name="customRelationship"
                value={formData.customRelationship}
                onChange={handleInputChange}
                placeholder="Please specify your relationship"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label htmlFor="occasion">Occasion</Label>
            <select
              id="occasion"
              name="occasion"
              value={formData.occasion}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, occasion: e.target.value }))
              }
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="">Select occasion</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="holiday">Holiday</option>
              <option value="graduation">Graduation</option>
              <option value="justbecause">Just Because</option>
              <option value="other">Other</option>
            </select>
            {formData.occasion === "other" && (
              <Input
                id="customOccasion"
                name="customOccasion"
                value={formData.customOccasion}
                onChange={handleInputChange}
                placeholder="Please specify the occasion"
                className="mt-2"
              />
            )}
          </div>

          <div>
            <Label htmlFor="budgetRange">Budget Range</Label>
            <div className="h-4" />
            <Slider
              min={0}
              max={100000}
              step={100}
              value={formData.budgetRange}
              onValueChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  budgetRange: val as [number, number],
                }))
              }
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>₹0</span>
              <span>₹1,00,000</span>
            </div>
            <div className="text-center mt-1">
              ₹{formData.budgetRange[0]} - ₹{formData.budgetRange[1]}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleNextClick}
          disabled={isProcessing || isGenerating}
          className="flex items-center gap-2"
        >
          {isProcessing || isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {!isInitialized ? 'Initializing...' : 'Processing...'}
            </>
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepBasics; 