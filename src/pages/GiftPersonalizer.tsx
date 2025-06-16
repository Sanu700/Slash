import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePersonalizer } from '@/hooks/usePersonalizer';
import BasicsForm from '@/components/gift-personalizer/BasicsForm';
import InterestsForm from '@/components/gift-personalizer/InterestsForm';
import PreferencesForm from '@/components/gift-personalizer/PreferencesForm';
import ResultsSection from '@/components/gift-personalizer/ResultsSection';
import { Progress } from '@/components/ui/progress';
import NavButtons from '@/components/gift-personalizer/NavButtons';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/animations';

type Step = 'basics' | 'interests' | 'preferences' | 'results';

export default function GiftPersonalizer() {
  const formRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  const [contentRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  const {
    formData,
    handleInputChange,
    handleInterestToggle,
    suggestedExperiences,
    isGenerating,
    handleNextStep: hookNextStep,
    handlePreviousStep: hookPrevStep,
    setFormData
  } = usePersonalizer();

  const handleNextStep = () => {
    switch (currentStep) {
      case 'basics':
        setCurrentStep('interests');
        break;
      case 'interests':
        setCurrentStep('preferences');
        break;
      case 'preferences':
        setCurrentStep('results');
        break;
      default:
        setCurrentStep('basics');
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePreviousStep = () => {
    switch (currentStep) {
      case 'results':
        setCurrentStep('preferences');
        break;
      case 'preferences':
        setCurrentStep('interests');
        break;
      case 'interests':
        setCurrentStep('basics');
        break;
      default:
        setCurrentStep('basics');
    }
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getStepProgress = () => {
    switch (currentStep) {
      case 'basics':
        return 25;
      case 'interests':
        return 50;
      case 'preferences':
        return 75;
      case 'results':
        return 100;
      default:
        return 0;
    }
  };

  const isStepValid = () => {
    if (currentStep === 'basics') {
      const isRelationshipOther = formData.relationship === 'other';
      const isOccasionOther = formData.occasion === 'other';
      return (
        !!formData.recipient &&
        !!formData.city &&
        !!formData.relationship &&
        (!isRelationshipOther || !!formData.customRelationship) &&
        !!formData.occasion &&
        (!isOccasionOther || !!formData.customOccasion)
      );
    }
    if (currentStep === 'interests') {
      return formData.interests.length > 0;
    }
    if (currentStep === 'preferences') {
      return (
        !!formData.preferences.personality &&
        !!formData.preferences.lifestyle &&
        !!formData.preferences.specific
      );
    }
    return true;
  };

  return (
    <div className="bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-[527.4px] flex items-center justify-center overflow-hidden mt-[72px]">
        <img 
          src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop" 
          alt="Gift Personalizer"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-4">
            <Wand2 className="h-8 w-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-medium mb-4">Gift Personalizer</h1>
          <p className="max-w-2xl text-white/80 text-lg mb-8">
            Answer a few questions to find the perfect experience gift for your special someone
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div
        ref={formRef}
        className="container max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24"
      >
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-card rounded-lg shadow-lg p-6"
        >
          <div className="mb-6">
            <Progress value={getStepProgress()} className="h-2" />
          </div>

          {currentStep === 'basics' && (
            <BasicsForm
              formData={formData}
              handleInputChange={handleInputChange}
              setFormData={setFormData}
            />
          )}

          {currentStep === 'interests' && (
            <InterestsForm
              formData={formData}
              handleInterestToggle={handleInterestToggle}
            />
          )}

          {currentStep === 'preferences' && (
            <PreferencesForm
              formData={formData}
              handleInputChange={handleInputChange}
            />
          )}

          {currentStep === 'results' && (
            <ResultsSection
              suggestedExperiences={suggestedExperiences}
              formData={formData}
              onBack={handlePreviousStep}
            />
          )}

          {/* Nav Buttons */}
          {currentStep !== 'results' && (
            <NavButtons
              currentStep={currentStep}
              handlePreviousStep={handlePreviousStep}
              handleNextStep={handleNextStep}
              isGenerating={isGenerating}
              disabled={!isStepValid()}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
