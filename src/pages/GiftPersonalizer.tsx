import { useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Wand2, Key, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from '@/lib/animations';
import { useToast } from '@/components/ui/use-toast';
import { categories, experiences } from '@/lib/data';
import ExperienceCard from '@/components/ExperienceCard';

type QuestionStep = 'basics' | 'interests' | 'preferences' | 'social' | 'results';

interface FormData {
  recipient: string;
  relationship: string;
  occasion: string;
  budget: string;
  interests: string[];
  preferences: {
    adventurous: number;
    social: number;
    relaxation: number;
    learning: number;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    amazon: string;
  };
}

const GiftPersonalizer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<QuestionStep>('basics');
  const [progress, setProgress] = useState(25);
  const formRef = useRef<HTMLDivElement>(null);
  const [contentRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  
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
  
  const [suggestedExperiences, setSuggestedExperiences] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  
  const generateRecommendations = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      let potentialMatches = [...experiences];
      
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
        
        if (formData.occasion === 'anniversary' && exp.romantic) score += 8;
        if (formData.occasion === 'birthday' && exp.trending) score += 5;
        if (formData.occasion === 'graduation' && exp.category === 'luxury') score += 5;
        
        if (formData.preferences.adventurous > 3 && exp.adventurous) score += 7;
        if (formData.preferences.adventurous < 3 && !exp.adventurous) score += 5;
        
        if (formData.preferences.social > 3 && exp.group) score += 6;
        if (formData.preferences.social < 3 && !exp.group) score += 4;
        
        if (formData.preferences.relaxation > 3 && exp.category === 'wellness') score += 7;
        
        if (formData.preferences.learning > 3 && 
            (exp.category === 'learning' || exp.niche === 'workshops')) score += 7;
        
        if (formData.relationship === 'partner' && exp.romantic) score += 8;
        if (formData.relationship === 'family' && exp.group) score += 6;
        if (formData.relationship === 'friend' && exp.category === 'adventure') score += 5;
        
        if (formData.occasion === 'anniversary' && exp.niche === 'luxury') score += 10;
        
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
  };
  
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
  
  const interests = [
    'Adventure', 'Dining', 'Wellness', 'Luxury', 'Learning', 
    'Sports', 'Arts', 'Music', 'Travel', 'Nature', 'Technology'
  ];
  
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
              <div className="space-y-6">
                <h2 className="text-2xl font-medium mb-2">Tell us about the recipient</h2>
                <p className="text-muted-foreground mb-8">
                  Let's start with some basic information about who you're shopping for.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient's Name</Label>
                    <Input 
                      id="recipient" 
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleInputChange}
                      placeholder="Who is this gift for?" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="relationship">Your Relationship</Label>
                    <select 
                      id="relationship" 
                      name="relationship"
                      value={formData.relationship}
                      onChange={e => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select relationship</option>
                      <option value="partner">Partner/Spouse</option>
                      <option value="friend">Friend</option>
                      <option value="family">Family Member</option>
                      <option value="colleague">Colleague</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="occasion">Occasion</Label>
                    <select 
                      id="occasion" 
                      name="occasion"
                      value={formData.occasion}
                      onChange={e => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select occasion</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="holiday">Holiday</option>
                      <option value="graduation">Graduation</option>
                      <option value="justbecause">Just Because</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="budget">Budget Range</Label>
                    <select 
                      id="budget" 
                      name="budget"
                      value={formData.budget}
                      onChange={e => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="">Select budget</option>
                      <option value="low">₹10,000 - ₹20,000</option>
                      <option value="medium">₹20,000 - ₹30,000</option>
                      <option value="high">₹30,000+</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 'interests' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium mb-2">What are they interested in?</h2>
                <p className="text-muted-foreground mb-8">
                  Select all interests that apply to {formData.recipient || 'the recipient'}.
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {interests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={cn(
                        "px-4 py-2 rounded-lg border text-sm md:text-base transition-all",
                        formData.interests.includes(interest)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="custom-interests">Any other interests?</Label>
                  <Textarea 
                    id="custom-interests" 
                    placeholder="Tell us more about their hobbies and passions..." 
                    className="h-24"
                  />
                </div>
              </div>
            )}
            
            {currentStep === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium mb-2">Personality Profile</h2>
                <p className="text-muted-foreground mb-8">
                  Help us understand {formData.recipient || 'the recipient'}'s personality by adjusting these sliders.
                </p>
                
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Cautious</Label>
                      <Label>Adventurous</Label>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="5"
                      value={formData.preferences.adventurous}
                      onChange={(e) => handleSliderChange('adventurous', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Introverted</Label>
                      <Label>Social</Label>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="5"
                      value={formData.preferences.social}
                      onChange={(e) => handleSliderChange('social', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Active</Label>
                      <Label>Relaxed</Label>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="5"
                      value={formData.preferences.relaxation}
                      onChange={(e) => handleSliderChange('relaxation', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Practical</Label>
                      <Label>Curious</Label>
                    </div>
                    <input 
                      type="range"
                      min="1"
                      max="5"
                      value={formData.preferences.learning}
                      onChange={(e) => handleSliderChange('learning', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 'social' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-medium mb-2">Social & Shopping Profiles</h2>
                <p className="text-muted-foreground mb-8">
                  Optional: Link social or shopping accounts to help our AI better understand their preferences.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 border border-input rounded-lg bg-background/50">
                    <div className="bg-pink-500/10 p-2 rounded-lg">
                      <Key className="h-5 w-5 text-pink-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Your privacy is important</p>
                      <p className="text-xs text-muted-foreground">
                        We only use linked accounts to analyze preferences. We never post, message, or store credentials.
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Instagram Profile URL
                    </Label>
                    <Input 
                      id="instagram" 
                      name="socialLinks.instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/username" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Facebook Profile URL
                    </Label>
                    <Input 
                      id="facebook" 
                      name="socialLinks.facebook"
                      value={formData.socialLinks.facebook}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/username" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="amazon" className="flex items-center gap-2">
                      <Search className="h-4 w-4" /> Amazon Wishlist URL
                    </Label>
                    <Input 
                      id="amazon" 
                      name="socialLinks.amazon"
                      value={formData.socialLinks.amazon}
                      onChange={handleInputChange}
                      placeholder="https://amazon.com/wishlist/..." 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {currentStep === 'results' && (
              <div className="space-y-6">
                <div className="text-center mb-10">
                  <h2 className="text-2xl font-medium mb-2">Your Personalized Recommendations</h2>
                  <p className="text-muted-foreground">
                    Based on your answers, we've curated these experiences for {formData.recipient || 'your recipient'}.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {suggestedExperiences.map(id => {
                    const experience = experiences.find(exp => exp.id === id);
                    return experience ? (
                      <ExperienceCard key={id} experience={experience} />
                    ) : null;
                  })}
                </div>
                
                <div className="mt-10 text-center">
                  <p className="text-muted-foreground mb-6">
                    Not seeing the perfect gift? Browse our complete collection of experiences.
                  </p>
                  <Link to="/experiences">
                    <Button>
                      View All Experiences
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            {currentStep !== 'results' && (
              <div className="flex justify-between mt-10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreviousStep}
                  disabled={currentStep === 'basics'}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isGenerating}
                >
                  {currentStep === 'social' ? (
                    isGenerating ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </>
                    ) : 'Generate Recommendations'
                  ) : 'Next'}
                </Button>
              </div>
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
