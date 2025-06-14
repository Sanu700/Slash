import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FormData } from '@/types/personalizerTypes';

export const usePersonalizer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basics' | 'interests' | 'preferences' | 'results'>('basics');
  const [progress, setProgress] = useState(25);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedExperiences, setSuggestedExperiences] = useState([]);

  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    city: '',
    relationship: '',
    customRelationship: '',
    occasion: '',
    customOccasion: '',
    budget: '',
    budgetRange: [10000, 50000],
    interests: [],
    preferences: {
      personality: '',
      lifestyle: '',
      specific: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('preferences.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      
      if (interests.includes(interest)) {
        return {
          ...prev,
          interests: interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest]
        };
      }
    });
  };

  const handleNextStep = () => {
    if (currentStep === 'basics') {
      const isRelationshipOther = formData.relationship === 'other';
      const isOccasionOther = formData.occasion === 'other';
      if (
        !formData.recipient ||
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
      setCurrentStep('interests');
      setProgress(50);
    } else if (currentStep === 'interests') {
      if (formData.interests.length === 0) {
        toast({
          title: "Please select at least one interest",
          description: "Interests help us find the perfect gift for your recipient.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('preferences');
      setProgress(75);
    } else if (currentStep === 'preferences') {
      if (!formData.preferences.personality || !formData.preferences.lifestyle) {
        toast({
          title: "Please complete personality profile",
          description: "The personality profile helps us provide better recommendations.",
          variant: "destructive",
        });
        return;
      }
      generateRecommendations();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 'interests') {
      setCurrentStep('basics');
      setProgress(25);
    } else if (currentStep === 'preferences') {
      setCurrentStep('interests');
      setProgress(50);
    }
  };

  const generateRecommendations = async () => {
    setIsGenerating(true);
    try {
      // TODO: Implement recommendation generation
      setCurrentStep('results');
      setProgress(100);
    } catch (error) {
      toast({
        title: "Error generating recommendations",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    currentStep,
    progress,
    formData,
    suggestedExperiences,
    isGenerating,
    handleInputChange,
    handleInterestToggle,
    handleNextStep,
    handlePreviousStep,
    setFormData
  };
};
