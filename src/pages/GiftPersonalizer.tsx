import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePersonalizer } from '@/hooks/usePersonalizer';
import { Progress } from '@/components/ui/progress';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/animations';
import { useToast } from '@/components/ui/use-toast';
import { resetSession } from '@/lib/aiPersonalizer';

// Import separate step components
import StepBasics from '@/components/gift-personalizer/StepBasics';
import StepInterests from '@/components/gift-personalizer/StepInterests';
import StepPreferences from '@/components/gift-personalizer/StepPreferences';
import StepResults from '@/components/gift-personalizer/StepResults';

const GiftPersonalizer = () => {
  const [ref, isInView] = useInView<HTMLDivElement>();
  const { toast } = useToast();
  const hasInitializedRef = useRef(false);
  
  const {
    currentStep,
    progress,
    formData,
    customInterests,
    suggestedExperiences,
    handleInputChange,
    handleInterestToggle,
    handleCustomInterestsChange,
    handleNextStep,
    handlePreviousStep,
    isGenerating,
    setFormData,
    setSuggestedExperiences
  } = usePersonalizer();

  // Reset AI session when component mounts (page reload) - only once
  useEffect(() => {
    const initializeSession = async () => {
      if (hasInitializedRef.current) return; // Prevent multiple resets
      
      try {
        console.log('=== PAGE RELOAD - RESETTING AI SESSION ===');
        await resetSession();
        console.log('AI session reset successfully on page load');
        hasInitializedRef.current = true;
      } catch (error) {
        console.error('Failed to reset AI session on page load:', error);
        // Don't show toast error for reset failure as it might be expected
        // if the backend doesn't support reset endpoint
        hasInitializedRef.current = true; // Mark as initialized even if reset fails
      }
    };

    initializeSession();
  }, []); // Empty dependency array - only runs once on mount

  const handleStartOver = () => {
    // Reset form data and go back to basics
    window.location.reload();
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'basics':
        return (
          <StepBasics
            formData={formData}
            handleInputChange={handleInputChange}
            setFormData={setFormData}
            onNext={handleNextStep}
            isGenerating={isGenerating}
          />
        );
      
      case 'interests':
        return (
          <StepInterests
            formData={formData}
            handleInterestToggle={handleInterestToggle}
            onCustomInterestsChange={handleCustomInterestsChange}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
            isGenerating={isGenerating}
          />
        );
      
      case 'preferences':
        return (
          <StepPreferences
            formData={formData}
            onBack={handlePreviousStep}
            onNext={handleNextStep}
            isGenerating={isGenerating}
            setSuggestedExperiences={setSuggestedExperiences}
          />
        );
      
      case 'results':
        return (
          <StepResults
            formData={formData}
            suggestions={suggestedExperiences}
            onBack={handlePreviousStep}
            onStartOver={handleStartOver}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Wand2 className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AI Gift Personalizer
              </h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Let our AI help you find the perfect gift
            </p>
          </div>

          {/* Progress Bar */}
          {currentStep !== 'results' && (
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Step {currentStep === 'basics' ? 1 : currentStep === 'interests' ? 2 : 3} of 3</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
            {renderCurrentStep()}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GiftPersonalizer;
