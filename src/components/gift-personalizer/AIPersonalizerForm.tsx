import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, ArrowLeft, ArrowRight, Sparkles, Heart, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { 
  fetchInitQuestion, 
  submitAnswer, 
  fetchNextQuestion, 
  fetchSuggestions 
} from '@/lib/aiPersonalizer';
import { useNavigate } from 'react-router-dom';
import { formatRupees } from '@/lib/formatters';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  imageUrl?: string;
  img?: string;
  photo?: string;
  thumbnail?: string;
}

interface AIFormData {
  name: string;
  location: string;
  relation: string;
  occasion: string;
  budget: string;
  interests: string[];
  preferences: string;
}

const AISuggestionCard = ({ suggestion }: { suggestion: Suggestion }) => {
  const navigate = useNavigate();
  const imageUrl = suggestion.image || suggestion.imageUrl || suggestion.img || suggestion.photo || suggestion.thumbnail || '/placeholder.svg';
  
  // Debug logging
  console.log('AISuggestionCard image data:', {
    title: suggestion.title,
    imageUrl,
    originalFields: {
      image: suggestion.image,
      imageUrl: suggestion.imageUrl,
      img: suggestion.img,
      photo: suggestion.photo,
      thumbnail: suggestion.thumbnail
    }
  });
  
  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={suggestion.title}
          className="w-full h-full object-cover object-center"
          style={{ minHeight: '200px', minWidth: '100%' }}
          onError={(e) => {
            console.log(`Image failed to load for ${suggestion.title}:`, imageUrl);
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{suggestion.title}</CardTitle>
        <CardDescription className="text-sm">{suggestion.category}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {suggestion.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-primary">
            {formatRupees(suggestion.price)}
          </span>
          <Button 
            size="sm" 
            onClick={() => navigate(`/experience/${suggestion.id}`)}
            className="flex items-center gap-1"
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AIPersonalizerForm() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  
  const [formData, setFormData] = useState<AIFormData>({
    name: '',
    location: '',
    relation: '',
    occasion: '',
    budget: '',
    interests: [],
    preferences: ''
  });

  const [currentInput, setCurrentInput] = useState('');
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    initializeForm();
  }, []);

  const initializeForm = async () => {
    setIsLoading(true);
    try {
      const question = await fetchInitQuestion();
      setCurrentQuestion(question);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize the form. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      e.preventDefault();
      if (!currentTags.includes(currentInput.trim())) {
        setCurrentTags([...currentTags, currentInput.trim()]);
      }
      setCurrentInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleNext = async () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.name || !formData.location || !formData.relation || !formData.occasion || !formData.budget) {
        toast({
          title: "Please complete all fields",
          description: "All fields are required to continue.",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 2) {
      if (currentTags.length === 0) {
        toast({
          title: "Please add at least one interest",
          description: "Add interests to help personalize your recommendations.",
          variant: "destructive",
        });
        return;
      }
    } else if (currentStep === 3) {
      if (!currentInput.trim()) {
        toast({
          title: "Please provide preferences",
          description: "Your input is required to continue.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      let answer = '';

      if (currentStep === 1) {
        // Step 1: Basics - combine all fields
        answer = `${formData.name}\`${formData.location}\`${formData.relation}\`${formData.occasion}\`${formData.budget}`;
      } else if (currentStep === 2) {
        // Step 2: Interests - use tags
        answer = currentTags.join(', ');
      } else if (currentStep === 3) {
        // Step 3: Preferences - use text input
        answer = currentInput;
      }

      // Submit answer
      await submitAnswer(answer);

      if (currentStep < 4) {
        // Get next question
        const nextQuestion = await fetchNextQuestion();
        setCurrentQuestion(nextQuestion);
        setCurrentStep(prev => prev + 1);
        setCurrentInput('');
        setCurrentTags([]);
      } else {
        // Step 4: Get suggestions
        const results = await fetchSuggestions();
        setSuggestions(results);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to proceed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setCurrentInput('');
      setCurrentTags([]);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Recipient's Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Who is this gift for?"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Where are they located?"
              />
            </div>
            <div>
              <Label htmlFor="relation">Relationship</Label>
              <Input
                id="relation"
                value={formData.relation}
                onChange={(e) => setFormData(prev => ({ ...prev, relation: e.target.value }))}
                placeholder="What's your relationship?"
              />
            </div>
            <div>
              <Label htmlFor="occasion">Occasion</Label>
              <Input
                id="occasion"
                value={formData.occasion}
                onChange={(e) => setFormData(prev => ({ ...prev, occasion: e.target.value }))}
                placeholder="What's the occasion?"
              />
            </div>
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="What's your budget?"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="interests">Interests & Hobbies</Label>
              <Input
                id="interests"
                value={currentInput}
                onChange={handleInputChange}
                onKeyDown={handleTagInput}
                placeholder="Type interests and press Enter to add tags"
              />
            </div>
            {currentTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="preferences">Preferences & Personality</Label>
              <Textarea
                id="preferences"
                value={currentInput}
                onChange={handleInputChange}
                placeholder="Tell us about their personality, lifestyle, likes, dislikes..."
                rows={4}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-semibold">Personalized Gift Suggestions</h3>
              <p className="text-muted-foreground">Based on your answers, here are some perfect matches</p>
            </div>
            
            {suggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((suggestion, index) => (
                  <AISuggestionCard key={suggestion.id || index} suggestion={suggestion} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No suggestions available at the moment.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const getStepProgress = () => {
    return (currentStep / 4) * 100;
  };

  const isStepValid = () => {
    if (currentStep === 1) {
      return formData.name && formData.location && formData.relation && formData.occasion && formData.budget;
    }
    if (currentStep === 2) {
      return currentTags.length > 0;
    }
    if (currentStep === 3) {
      return currentInput.trim().length > 0;
    }
    return true;
  };

  const mapSuggestionToExperience = (suggestion: Suggestion) => ({
    id: suggestion.id,
    title: suggestion.title,
    description: suggestion.description,
    imageUrl: suggestion.image || suggestion.imageUrl || suggestion.img || suggestion.photo || suggestion.thumbnail || '/placeholder.svg',
    price: suggestion.price,
    location: 'Unknown',
    duration: 'N/A',
    participants: 'N/A',
    date: 'N/A',
    category: suggestion.category || 'General',
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Progress value={getStepProgress()} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Step {currentStep} of 4</span>
          <span>{Math.round(getStepProgress())}% Complete</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Gift Personalizer
          </CardTitle>
          <CardDescription>
            {currentStep < 4 ? currentQuestion : "Here are your personalized gift suggestions"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          {currentStep < 4 && (
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1 || isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setFormData({
                    name: '',
                    location: '',
                    relation: '',
                    occasion: '',
                    budget: '',
                    interests: [],
                    preferences: ''
                  });
                  initializeForm();
                }}
              >
                Start Over
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 