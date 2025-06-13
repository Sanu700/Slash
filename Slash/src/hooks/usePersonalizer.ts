
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { categories, getAllExperiences } from '@/lib/data';
import { QuestionStep, FormData } from '@/types/personalizerTypes';
import { Experience } from '@/lib/data';

export const usePersonalizer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<QuestionStep>('basics');
  const [progress, setProgress] = useState(25);
  const [suggestedExperiences, setSuggestedExperiences] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    recipient: '',
    relationship: '',
    occasion: '',
    budget: '',
    interests: [],
    preferences: {
      adventurous: 3,
      social: 3,
      relaxation: 3,
      learning: 3
    },
    socialLinks: {
      instagram: '',
      facebook: '',
      amazon: ''
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => {
        if (section === 'socialLinks') {
          return {
            ...prev,
            socialLinks: {
              ...prev.socialLinks,
              [field]: value
            }
          };
        } else if (section === 'preferences') {
          return {
            ...prev,
            preferences: {
              ...prev.preferences,
              [field]: value
            }
          };
        }
        return prev;
      });
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
  
  const handleSliderChange = (preference: keyof FormData['preferences'], value: number) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: value
      }
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 'basics') {
      if (!formData.recipient || !formData.relationship || !formData.occasion || !formData.budget) {
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
      setCurrentStep('social');
      setProgress(90);
    } else if (currentStep === 'social') {
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
    } else if (currentStep === 'social') {
      setCurrentStep('preferences');
      setProgress(75);
    } else if (currentStep === 'results') {
      setCurrentStep('social');
      setProgress(90);
    }
  };

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Use getAllExperiences to fetch experiences instead of directly accessing experiences array
    getAllExperiences().then((allExperiences) => {
      setTimeout(() => {
        let potentialMatches = [...allExperiences];
        
        if (formData.budget === 'low') {
          potentialMatches = potentialMatches.filter(exp => exp.price < 20000);
        } else if (formData.budget === 'medium') {
          potentialMatches = potentialMatches.filter(exp => exp.price >= 20000 && exp.price <= 30000);
        } else if (formData.budget === 'high') {
          potentialMatches = potentialMatches.filter(exp => exp.price > 30000);
        }
        
        const scoredExperiences = potentialMatches.map(exp => {
          let score = 0;
          
          const categoryMatch = formData.interests.some(interest => {
            const matchingCategory = categories.find(cat => 
              cat.name.toLowerCase() === interest.toLowerCase()
            );
            return matchingCategory?.id === exp.category;
          });
          
          if (categoryMatch) score += 10;
          
          // Only check these properties if they exist
          if (formData.occasion === 'anniversary' && exp.romantic) score += 8;
          if (formData.occasion === 'birthday' && exp.trending) score += 5;
          if (formData.occasion === 'graduation' && exp.category === 'luxury') score += 5;
          
          if (formData.preferences.adventurous > 3 && exp.adventurous) score += 7;
          if (formData.preferences.adventurous < 3 && exp.adventurous === false) score += 5;
          
          if (formData.preferences.social > 3 && exp.group) score += 6;
          if (formData.preferences.social < 3 && exp.group === false) score += 4;
          
          if (formData.preferences.relaxation > 3 && exp.category === 'wellness') score += 7;
          
          if (formData.preferences.learning > 3 && 
              (exp.category === 'learning' || exp.nicheCategory === 'Creative Workshops' || 
               exp.nicheCategory === 'Literature & History')) score += 7;
          
          if (formData.relationship === 'partner' && exp.romantic) score += 8;
          if (formData.relationship === 'family' && exp.group) score += 6;
          if (formData.relationship === 'friend' && exp.category === 'adventure') score += 5;
          
          if (formData.occasion === 'anniversary' && exp.nicheCategory === 'Luxury Escapes') score += 10;
          
          return { 
            experience: exp,
            score
          };
        });
        
        scoredExperiences.sort((a, b) => b.score - a.score);
        
        const topRecommendations = scoredExperiences
          .slice(0, 5)
          .map(item => item.experience.id);
        
        setSuggestedExperiences(topRecommendations);
        setCurrentStep('results');
        setProgress(100);
        setIsGenerating(false);
        
        toast({
          title: "Personalized recommendations ready!",
          description: `We've found the perfect experiences for ${formData.recipient}.`,
        });
      }, 1500);
    }).catch(error => {
      console.error('Error loading experiences:', error);
      setIsGenerating(false);
      toast({
        title: "Error generating recommendations",
        description: "Unable to load experiences data. Please try again.",
        variant: "destructive",
      });
    });
  };

  return {
    currentStep,
    progress,
    formData,
    suggestedExperiences,
    isGenerating,
    handleInputChange,
    handleInterestToggle,
    handleSliderChange,
    handleNextStep,
    handlePreviousStep,
    setFormData
  };
};
