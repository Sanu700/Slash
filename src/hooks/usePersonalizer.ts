import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { FormData } from '@/types/personalizerTypes';
import { submitAnswer } from '@/lib/aiPersonalizer';

export const usePersonalizer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basics' | 'interests' | 'results'>('basics');
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedExperiences, setSuggestedExperiences] = useState([]);
  const [customInterests, setCustomInterests] = useState('');

  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    city: '',
    relationship: '',
    customRelationship: '',
    occasion: '',
    customOccasion: '',
    budget: '',
    budgetRange: [0, 100000],
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

  const handleCustomInterestsChange = (customInterests: string) => {
    setCustomInterests(customInterests);
  };

  const handleNextStep = async () => {
    if (currentStep === 'basics') {
      // Basics step now handles its own validation and AI submission
      // Just move to the next step
      setCurrentStep('interests');
      setProgress(50);
    } else if (currentStep === 'interests') {
      // Interests step now handles its own validation and AI submission
      // Move directly to results
      setCurrentStep('results');
      setProgress(100);
    }
  };

  const handlePreviousStep = async () => {
    try {
      setIsGenerating(true);
      
      // Note: Individual components now handle the /back API call
      // This function only handles local state navigation
      console.log('=== GOING BACK - LOCAL NAVIGATION ONLY ===');
      console.log('✅ No API call here - components handle /back API calls');
      
      // Update local state
      if (currentStep === 'interests') {
        setCurrentStep('basics');
        setProgress(0);
      } else if (currentStep === 'results') {
        setCurrentStep('interests');
        setProgress(50);
      }
      
    } catch (error) {
      console.error('Error going back:', error);
      toast({
        title: "Error going back",
        description: "Failed to go back. Please try again.",
        variant: "destructive",
      });
      
      // Fallback to local navigation if API fails
      if (currentStep === 'interests') {
        setCurrentStep('basics');
        setProgress(0);
      } else if (currentStep === 'results') {
        setCurrentStep('interests');
        setProgress(50);
      }
    } finally {
      setIsGenerating(false);
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
    customInterests,
    handleInputChange,
    handleInterestToggle,
    handleCustomInterestsChange,
    handleNextStep,
    handlePreviousStep,
    setFormData,
    setSuggestedExperiences
  };
};
