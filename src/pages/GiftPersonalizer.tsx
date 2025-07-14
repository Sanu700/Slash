import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePersonalizer } from '@/hooks/usePersonalizer';
import { Progress } from '@/components/ui/progress';
import { Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/animations';
import { useToast } from '@/components/ui/use-toast';
import { resetSession, fetchInitQuestion, fetchNextQuestion } from '@/lib/aiPersonalizer';

// Import separate step components
import StepBasics from '@/components/gift-personalizer/StepBasics';
import StepInterests from '@/components/gift-personalizer/StepInterests';
import StepResults from '@/components/gift-personalizer/StepResults';

const GiftPersonalizer = () => {
  const [ref, isInView] = useInView<HTMLDivElement>();
  const { toast } = useToast();
  const hasInitializedRef = useRef(false);
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [interestsPrompt, setInterestsPrompt] = useState<string>("");
  const [basicsInput, setBasicsInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [aiSessionId, setAiSessionId] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationInProgressRef = useRef(false);
  
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
    // Always scroll to top smoothly on mount
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
    setBasicsInput("");
    setInterestsInput("");
    
    const initializeSession = async () => {
      // Multiple safety checks to prevent duplicate initialization
      if (hasInitializedRef.current || isInitialized || initializationInProgressRef.current) {
        console.log('=== SKIPPING INITIALIZATION - ALREADY INITIALIZED OR IN PROGRESS ===');
        console.log('hasInitializedRef.current:', hasInitializedRef.current);
        console.log('isInitialized:', isInitialized);
        console.log('initializationInProgressRef.current:', initializationInProgressRef.current);
        return;
      }
      try {
        initializationInProgressRef.current = true;
        hasInitializedRef.current = true;
        const { question, session_id } = await fetchInitQuestion();
        setAiPrompt(question);
        setAiSessionId(session_id);
        setIsInitialized(true);
        console.log('=== AI SESSION INITIALIZATION COMPLETED ===');
        console.log('✅ /init response received:');
        console.log('  - question:', question);
        console.log('  - session_id:', session_id);
        console.log('  - session_id type:', typeof session_id);
        console.log('  - session_id length:', session_id ? session_id.length : 'undefined');
        console.log('✅ session_id stored in aiSessionId state');
        console.log('✅ This same session_id will be used for all subsequent API calls');
        console.log('=== END INITIALIZATION ===');
      } catch (error) {
        console.error('Failed to initialize AI session on page load:', error);
        hasInitializedRef.current = false;
        initializationInProgressRef.current = false;
      }
    };

    initializeSession();
  }, []); // Empty dependency array - only runs once on mount

  // Also scroll to top on every step change
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, 100);
  }, [currentStep]);

  const handleStartOver = () => {
    setBasicsInput("");
    setInterestsInput("");
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
            aiPrompt={aiPrompt}
            setBasicsInput={setBasicsInput}
            aiSessionId={aiSessionId}
            setInterestsPrompt={setInterestsPrompt}
          />
        );
      
      case 'interests':
        console.log('=== RENDERING STEP INTERESTS ===');
        console.log('Passing aiSessionId to StepInterests:', aiSessionId);
        console.log('aiSessionId type:', typeof aiSessionId);
        console.log('aiSessionId length:', aiSessionId ? aiSessionId.length : 'undefined');
        console.log('This is the same session_id from /init');
        return (
          <StepInterests
            formData={formData}
            handleInterestToggle={handleInterestToggle}
            onCustomInterestsChange={handleCustomInterestsChange}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
            isGenerating={isGenerating}
            setSuggestedExperiences={setSuggestedExperiences}
            interestsPrompt={interestsPrompt}
            setInterestsInput={setInterestsInput}
            aiSessionId={aiSessionId}
          />
        );
      
      case 'results':
        return (
          <StepResults
            formData={formData}
            suggestions={suggestedExperiences}
            onBack={handlePreviousStep}
            onStartOver={handleStartOver}
            basicsInput={basicsInput}
            interestsInput={interestsInput}
            aiSessionId={aiSessionId}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
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
            null
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
