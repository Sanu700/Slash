import React, { useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Wand2, Globe, Users2, Heart, Building2, BadgeCheck, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/animations';
import { usePersonalizer } from '@/hooks/usePersonalizer';

import BasicsForm from '@/components/gift-personalizer/BasicsForm';
import InterestsForm from '@/components/gift-personalizer/InterestsForm';
import PreferencesForm from '@/components/gift-personalizer/PreferencesForm';
import SocialForm from '@/components/gift-personalizer/SocialForm';
import ResultsSection from '@/components/gift-personalizer/ResultsSection';
import NavButtons from '@/components/gift-personalizer/NavButtons';

const BenefitCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm">
    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-medium mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const GiftPersonalizer = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [contentRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  const {
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
  } = usePersonalizer();

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
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
            <Button 
              onClick={scrollToForm}
              size="lg" 
              className="bg-white text-black hover:bg-white/90"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Form Section */}
        <div 
          ref={formRef}
          className="container max-w-3xl mx-auto px-6 md:px-10 py-16 md:py-24"
        >
          <div ref={contentRef} className={cn(
            "transition-all duration-700",
            isInView ? "opacity-100" : "opacity-0 translate-y-8"
          )}>
            <div className="w-full bg-secondary/30 h-2 rounded-full mb-8">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
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
                handleSliderChange={handleSliderChange}
              />
            )}
            
            {currentStep === 'social' && (
              <SocialForm
                formData={formData}
                handleInputChange={handleInputChange}
              />
            )}
            
            {currentStep === 'results' && (
              <ResultsSection
                suggestedExperiences={suggestedExperiences}
                formData={formData}
              />
            )}
            
            {currentStep !== 'results' && (
              <NavButtons
                currentStep={currentStep}
                handlePreviousStep={handlePreviousStep}
                handleNextStep={handleNextStep}
                isGenerating={isGenerating}
              />
            )}
            
            {currentStep === 'results' && (
              <div className="flex justify-center mt-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                >
                  Back to Questionnaire
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GiftPersonalizer;
