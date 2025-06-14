import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { usePersonalizer } from '@/hooks/usePersonalizer';
import BasicsForm from '@/components/gift-personalizer/BasicsForm';
import InterestsForm from '@/components/gift-personalizer/InterestsForm';
import PreferencesForm from '@/components/gift-personalizer/PreferencesForm';
import ResultsSection from '@/components/gift-personalizer/ResultsSection';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/animations';
import NavButtons from '@/components/gift-personalizer/NavButtons';

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

  // Validation for required fields per step
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Gift Experience Personalizer</h1>
            <p className="text-muted-foreground">
              Answer a few questions to get personalized gift experience recommendations
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
            <div className="mb-6">
              <Progress value={getStepProgress()} className="h-2" />
            </div>

            <div ref={formRef}>
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
            </div>

            {/* Render NavButtons for all steps except results */}
            {currentStep !== 'results' && (
              <NavButtons
                currentStep={currentStep}
                handlePreviousStep={handlePreviousStep}
                handleNextStep={handleNextStep}
                isGenerating={isGenerating}
                disabled={!isStepValid()}
              />
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
