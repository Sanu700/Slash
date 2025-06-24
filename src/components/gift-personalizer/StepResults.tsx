import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { FormData } from '@/types/personalizerTypes';
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

interface StepResultsProps {
  formData: FormData;
  suggestions: Suggestion[];
  onBack: () => void;
  onStartOver: () => void;
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

const StepResults = ({ formData, suggestions, onBack, onStartOver }: StepResultsProps) => {
  const navigate = useNavigate();
  console.log('StepResults received suggestions:', suggestions);
  console.log('Number of suggestions:', suggestions.length);
  
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
              {suggestions.map((suggestion, index) => (
                <AISuggestionCard key={suggestion.id || index} suggestion={suggestion} />
              ))}
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