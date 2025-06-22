import React from 'react';
import { Button } from '@/components/ui/button';
import { QuestionStep } from '@/types/personalizerTypes';
import { useNavigation } from '@/lib/hooks/useNavigation';

interface NavButtonsProps {
  currentStep: QuestionStep;
  handlePreviousStep: () => Promise<void>;
  handleNextStep: () => Promise<void>;
  isGenerating: boolean;
  disabled?: boolean;
}

const NavButtons = ({ currentStep, handlePreviousStep, handleNextStep, isGenerating, disabled }: NavButtonsProps) => {
  const { navigateTo } = useNavigation();
  
  // If we're on the first step and user clicks back, navigate to home
  const handleBackAction = async () => {
    if (currentStep === 'basics') {
      navigateTo('/');
    } else {
      try {
        await handlePreviousStep();
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const handleNextAction = async () => {
    try {
      await handleNextStep();
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="flex justify-between mt-10">
      <Button
        type="button"
        variant="outline"
        onClick={handleBackAction}
        disabled={isGenerating}
        className="flex items-center"
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Going Back...
          </>
        ) : (
          'Back'
        )}
      </Button>
      <Button
        type="button"
        onClick={handleNextAction}
        disabled={isGenerating || disabled}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          'Next'
        )}
      </Button>
    </div>
  );
};

export default NavButtons;
