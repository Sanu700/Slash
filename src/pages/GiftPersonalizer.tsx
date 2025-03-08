
import { useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/animations';
import { usePersonalizer } from '@/hooks/usePersonalizer';

// Import component for each form step
import BasicsForm from '@/components/gift-personalizer/BasicsForm';
import InterestsForm from '@/components/gift-personalizer/InterestsForm';
import PreferencesForm from '@/components/gift-personalizer/PreferencesForm';
import SocialForm from '@/components/gift-personalizer/SocialForm';
import ResultsSection from '@/components/gift-personalizer/ResultsSection';
import NavButtons from '@/components/gift-personalizer/NavButtons';

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
      
      <main className="flex-grow pt-20 md:pt-24">
        <div className="relative h-[50vh] md:h-[60vh] w-full">
          <img 
            src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop" 
            alt="Gift Personalizer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <Link to="/" className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
          </div>
          
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
      
      <Footer />
    </div>
  );
};

export default GiftPersonalizer;
