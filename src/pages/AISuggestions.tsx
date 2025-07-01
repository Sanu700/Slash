import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Heart, ShoppingCart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { fetchSuggestions, resetSession } from '@/lib/aiPersonalizer';

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

const AISuggestions = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasShownToast = useRef(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('=== FETCHING AI SUGGESTIONS ===');
        const results = await fetchSuggestions();
        console.log('Suggestions received:', results);
        
        // Ensure results is an array
        const suggestionsArray = Array.isArray(results) ? results : [];
        setSuggestions(suggestionsArray);
        
        if (suggestionsArray.length === 0) {
          setError('No suggestions found. Please try again with different preferences.');
        } else if (!hasShownToast.current) {
          // Only show success toast once
          hasShownToast.current = true;
          toast({
            title: "Success!",
            description: `We've found ${suggestionsArray.length} great recommendations based on your input.`,
          });
        }
      } catch (error) {
        console.error('Error loading suggestions:', error);
        setError(error instanceof Error ? error.message : 'Failed to load suggestions');
        if (!hasShownToast.current) {
          hasShownToast.current = true;
          toast({
            title: "Error",
            description: "Failed to load AI suggestions. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadSuggestions();
  }, []); // Removed toast dependency

  const handleStartOver = async () => {
    try {
      // Reset the AI session
      console.log('=== RESETTING AI SESSION FOR START OVER ===');
      await resetSession();
      console.log('AI session reset successfully');
      
      // Navigate back to gift personalizer
      navigate('/gift-personalizer');
      
      toast({
        title: "Session Reset",
        description: "Starting fresh with new preferences.",
      });
    } catch (error) {
      console.error('Error resetting session:', error);
      // Still navigate even if reset fails
      navigate('/gift-personalizer');
      toast({
        title: "Starting Over",
        description: "Taking you back to the personalizer.",
      });
    }
  };

  const handleAddToWishlist = (suggestion: Suggestion) => {
    // TODO: Implement wishlist functionality
    toast({
      title: "Added to Wishlist",
      description: `${suggestion.title} has been added to your wishlist.`,
    });
  };

  const handleAddToCart = (suggestion: Suggestion) => {
    // TODO: Implement cart functionality
    toast({
      title: "Added to Cart",
      description: `${suggestion.title} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold">Loading AI Recommendations...</h2>
              <p className="text-muted-foreground">Finding the perfect gifts for you</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Error Loading Suggestions</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={handleStartOver} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                AI-Powered Gift Recommendations
              </h1>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Based on your preferences, here are some perfect matches
            </p>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Start Over
            </Button>
          </div>

          {/* Suggestions Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {suggestions.map((suggestion, index) => {
              // Try to find image from multiple possible field names
              const imageUrl = suggestion.image_url || suggestion.image || suggestion.imageUrl || suggestion.img || suggestion.photo || suggestion.thumbnail || '/placeholder.svg';
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
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
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                      <CardDescription className="text-sm">{suggestion.category}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {suggestion.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-primary">
                          ₹{suggestion.price?.toLocaleString() || 'Price not available'}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddToWishlist(suggestion)}
                            className="flex items-center gap-1"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(suggestion)}
                            className="flex items-center gap-1"
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* No suggestions message */}
          {suggestions.length === 0 && !isLoading && !error && (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No suggestions found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your preferences to get more recommendations.
              </p>
              <Button onClick={handleStartOver} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Start Over
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AISuggestions; 