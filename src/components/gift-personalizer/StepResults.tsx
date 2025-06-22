import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';

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

interface StepResultsProps {
  formData: FormData;
  suggestions: Suggestion[];
  onBack: () => void;
  onStartOver: () => void;
}

const StepResults = ({ formData, suggestions, onBack, onStartOver }: StepResultsProps) => {
  console.log('StepResults received suggestions:', suggestions);
  console.log('Number of suggestions:', suggestions.length);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-medium mb-2">Your Personalized Gift Recommendations</h2>
        <p className="text-muted-foreground">
          Based on your preferences for {formData.recipient || 'the recipient'}, here are some perfect matches we found.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Recommendations</CardTitle>
          <CardDescription>Curated just for you based on your input</CardDescription>
        </CardHeader>
        <CardContent>
          {suggestions.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {suggestions.map((suggestion, index) => {
                // Try to find image from multiple possible field names
                const imageUrl = suggestion.image || suggestion.imageUrl || suggestion.img || suggestion.photo || suggestion.thumbnail;
                
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {imageUrl && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={imageUrl}
                          alt={suggestion.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback to a placeholder image if the image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
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

          <div className="flex justify-center gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Preferences
            </Button>
            
            <Button
              onClick={onStartOver}
              className="flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Start Over
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepResults; 