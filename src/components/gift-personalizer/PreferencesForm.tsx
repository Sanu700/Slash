import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';
import { submitAnswer, fetchSuggestions } from '@/lib/aiPersonalizer';
import { useToast } from '@/components/ui/use-toast';

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

interface PreferencesFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onNext: () => void;
  onBack: () => void;
  isGenerating: boolean;
}

const PreferencesForm = ({ formData, handleInputChange, onNext, onBack, isGenerating }: PreferencesFormProps) => {
  const { toast } = useToast();
  const [specificPreferences, setSpecificPreferences] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handlePreferencesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSpecificPreferences(e.target.value);
  };

  const handleSubmitAndFetch = async () => {
    if (!specificPreferences.trim()) {
      toast({
        title: "Please provide preferences",
        description: "Your preferences help us find the perfect gift recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting AI suggestions fetch...');
      
      // Only fetch suggestions - data should already be submitted in previous steps
      console.log('=== FETCHING AI SUGGESTIONS ===');
      console.log('Preferences text:', specificPreferences);
      console.log('=== END PREFERENCES DATA ===');
      
      // Fetch suggestions
      console.log('Fetching suggestions...');
      const results = await fetchSuggestions();
      console.log('Suggestions received:', results);
      
      // Debug: Log each suggestion's structure
      if (Array.isArray(results) && results.length > 0) {
        console.log('=== AI SUGGESTIONS DEBUG ===');
        results.forEach((suggestion, index) => {
          console.log(`Suggestion ${index + 1}:`, suggestion);
          console.log(`- Has image field:`, 'image' in suggestion);
          console.log(`- Image value:`, suggestion.image);
          console.log(`- All keys:`, Object.keys(suggestion));
        });
        console.log('=== END AI SUGGESTIONS DEBUG ===');
      } else {
        console.log('=== AI SUGGESTIONS DEBUG ===');
        console.log('No suggestions received or empty array');
        console.log('Results:', results);
        console.log('=== END AI SUGGESTIONS DEBUG ===');
      }
      
      // Ensure results is an array
      const suggestionsArray = Array.isArray(results) ? results : [];
      setSuggestions(suggestionsArray);
      setShowSuggestions(true);
      
      toast({
        title: "Success!",
        description: `We've found ${suggestionsArray.length} great recommendations based on your input.`,
      });
    } catch (error) {
      console.error('Error in handleSubmitAndFetch:', error);
      toast({
        title: "AI Service Error",
        description: error instanceof Error ? error.message : "Failed to connect to AI service. Please check your internet connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium mb-2">Specific Preferences</h2>
      <p className="text-muted-foreground mb-8">
        Tell us about {formData.recipient || 'the recipient'}'s specific preferences, personality, lifestyle, likes, dislikes, and any other details that will help us find the perfect gift.
      </p>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="specificPreferences">Specific Preferences</Label>
          <Textarea
            id="specificPreferences"
            value={specificPreferences}
            onChange={handlePreferencesChange}
            placeholder="Describe their personality, lifestyle, interests, preferences, dislikes, hobbies, favorite activities, or any other details that would help us find the perfect gift..."
            className="min-h-[150px]"
          />
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isLoading}
          >
            Back
          </Button>
          
          <Button
            onClick={handleSubmitAndFetch}
            disabled={!specificPreferences.trim() || isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Suggestions Section */}
      {showSuggestions && (
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-semibold">AI-Powered Gift Recommendations</h3>
            <p className="text-muted-foreground">Based on your preferences, here are some perfect matches</p>
          </div>
          
          {suggestions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion, index) => {
                // Try to find image from multiple possible field names
                const imageUrl = suggestion.image_url || suggestion.image || suggestion.imageUrl || suggestion.img || suggestion.photo || suggestion.thumbnail || '/placeholder.svg';
                
                console.log(`Rendering suggestion ${index + 1}:`, {
                  title: suggestion.title,
                  imageUrl: imageUrl,
                  hasImage: !!imageUrl
                });
                
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={suggestion.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.log(`Image failed to load for suggestion ${index + 1}:`, imageUrl);
                            // Fallback to a placeholder image if the image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                          onLoad={() => {
                            console.log(`Image loaded successfully for suggestion ${index + 1}:`, imageUrl);
                          }}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                      <CardDescription>{suggestion.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{suggestion.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">₹{suggestion.price}</span>
                        <Button size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No suggestions available at the moment.</p>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setSpecificPreferences('');
                setShowSuggestions(false);
                setSuggestions([]);
              }}
            >
              Start Over
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesForm;
