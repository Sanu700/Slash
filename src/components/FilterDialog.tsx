import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  priceRange: [number, number];
  categories: string[];
  experienceTypes: {
    romantic: boolean;
    adventurous: boolean;
    group: boolean;
    trending: boolean;
    featured: boolean;
  };
  duration: string;
  location: string;
}

const defaultFilters: FilterOptions = {
  priceRange: [0, 100000],
  categories: [],
  experienceTypes: {
    romantic: false,
    adventurous: false,
    group: false,
    trending: false,
    featured: false,
  },
  duration: 'any',
  location: 'any'
};

const durations = [
  { value: '1-3', label: '1-3 hours' },
  { value: '3-6', label: '3-6 hours' },
  { value: '6-12', label: '6-12 hours' },
  { value: '12+', label: '12+ hours', dataValue: 'Full Day' },
];

const defaultLocations = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow'
];

export function FilterDialog({ isOpen, onClose, onApply, initialFilters }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || defaultFilters);
  const [error, setError] = useState<string | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  // Only reset filters when initialFilters is provided
  useEffect(() => {
    if (isOpen && initialFilters) {
      setFilters(initialFilters);
    }
  }, [isOpen, initialFilters]);

  // Fetch filter data from Supabase when dialog opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchFilterData = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('category, location, price');

        if (error) throw error;

        // Get unique categories, ensuring case-insensitive comparison
        const uniqueCategories = Array.from(
          new Set(
            data
              .map(item => item.category?.trim())
              .filter(Boolean)
              .map(category => category.toLowerCase())
          )
        )
        .map(category => category.charAt(0).toUpperCase() + category.slice(1))
        .sort();

        // Get unique locations from both Supabase and default locations
        const supabaseLocations = data
          .map(item => item.location?.trim())
          .filter(Boolean);
        
        const uniqueLocations = Array.from(
          new Set([...defaultLocations, ...supabaseLocations])
        ).sort();
        
        // Get min and max prices
        const prices = data
          .map(item => item.price)
          .filter(price => typeof price === 'number');
        
        const min = Math.min(...prices, 0);
        const max = Math.max(...prices, 100000);

        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
        setMinPrice(min);
        setMaxPrice(max);
        
        // Update price range in filters
        setFilters(prev => ({
          ...prev,
          priceRange: [min, max]
        }));
      } catch (err) {
        console.error('Error fetching filter data:', err);
        setError('Failed to load filter options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterData();
  }, [isOpen]);

  const handlePriceChange = (value: number[]) => {
    try {
      setFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] }));
    } catch (err) {
      console.error('Error in handlePriceChange:', err);
      setError('Error updating price range');
    }
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => {
      const currentCategories = prev.categories || [];
      const categoryExists = currentCategories.some(c => c.toLowerCase() === category.toLowerCase());
      const newCategories = categoryExists
        ? currentCategories.filter(c => c.toLowerCase() !== category.toLowerCase())
        : [...currentCategories, category];
      
      return {
        ...prev,
        categories: newCategories
      };
    });
  };

  const handleExperienceTypeChange = (type: keyof FilterOptions['experienceTypes']) => {
    try {
      setFilters(prev => ({
        ...prev,
        experienceTypes: {
          ...prev.experienceTypes,
          [type]: !prev.experienceTypes[type]
        }
      }));
    } catch (err) {
      console.error('Error in handleExperienceTypeChange:', err);
      setError('Error updating experience types');
    }
  };

  const handleDurationChange = (duration: string) => {
    setFilters(prev => ({
      ...prev,
      duration
    }));
  };

  const handleLocationChange = (value: string) => {
    try {
      setFilters(prev => ({ ...prev, location: value }));
    } catch (err) {
      console.error('Error in handleLocationChange:', err);
      setError('Error updating location');
    }
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    // Check if any filters are actually active
    const hasActiveFilters = 
      filters.categories.length > 0 ||
      Object.values(filters.experienceTypes).some(Boolean) ||
      filters.duration !== 'any' ||
      filters.location !== 'any' ||
      filters.priceRange[0] !== minPrice ||
      filters.priceRange[1] !== maxPrice;

    onApply(hasActiveFilters ? filters : null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filter Experiences</DialogTitle>
          <DialogDescription>
            Customize your experience search by applying filters
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6 py-4">
            {/* Price Range */}
            <div className="space-y-4">
              <Label>Price Range</Label>
              <Slider
                value={filters.priceRange}
                min={minPrice}
                max={maxPrice}
                step={1000}
                onValueChange={handlePriceChange}
                className="w-full"
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{filters.priceRange[0].toLocaleString()}</span>
                <span>₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={filters.categories.some(c => c.toLowerCase() === category.toLowerCase())}
                        onCheckedChange={() => handleCategoryChange(category)}
                      />
                      <Label 
                        htmlFor={category} 
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No categories available</div>
                )}
              </div>
            </div>

            {/* Experience Types */}
            <div className="space-y-4">
              <Label>Experience Types</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="romantic"
                    checked={filters.experienceTypes.romantic}
                    onCheckedChange={() => handleExperienceTypeChange('romantic')}
                  />
                  <Label htmlFor="romantic" className="text-sm">Romantic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="adventurous"
                    checked={filters.experienceTypes.adventurous}
                    onCheckedChange={() => handleExperienceTypeChange('adventurous')}
                  />
                  <Label htmlFor="adventurous" className="text-sm">Adventurous</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="group"
                    checked={filters.experienceTypes.group}
                    onCheckedChange={() => handleExperienceTypeChange('group')}
                  />
                  <Label htmlFor="group" className="text-sm">Group</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="trending"
                    checked={filters.experienceTypes.trending}
                    onCheckedChange={() => handleExperienceTypeChange('trending')}
                  />
                  <Label htmlFor="trending" className="text-sm">Trending</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={filters.experienceTypes.featured}
                    onCheckedChange={() => handleExperienceTypeChange('featured')}
                  />
                  <Label htmlFor="featured" className="text-sm">Featured</Label>
                </div>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-4">
              <Label>Duration</Label>
              <div className="relative">
                <button
                  onClick={() => setIsDurationOpen(!isDurationOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm"
                >
                  <span>
                    {filters.duration === 'any' 
                      ? 'Any duration'
                      : durations.find(d => d.value === filters.duration)?.label || 'Select duration'
                    }
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isDurationOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDurationOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                    <div className="p-2 space-y-1">
                      <button
                        onClick={() => {
                          handleDurationChange('any');
                          setIsDurationOpen(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-sm text-sm transition-colors ${
                          filters.duration === 'any' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-secondary'
                        }`}
                      >
                        Any duration
                      </button>
                      {durations.map((duration) => (
                        <button
                          key={duration.value}
                          onClick={() => {
                            handleDurationChange(duration.value);
                            setIsDurationOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-sm text-sm transition-colors ${
                            filters.duration === duration.value 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-secondary'
                          }`}
                        >
                          {duration.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label>Location</Label>
              <div className="relative">
                <button
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm"
                >
                  <span>
                    {filters.location 
                      ? filters.location.charAt(0).toUpperCase() + filters.location.slice(1)
                      : 'Select location'
                    }
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform ${isLocationOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isLocationOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg">
                    <div className="h-[144px] overflow-y-auto">
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            handleLocationChange('any');
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-sm text-sm transition-colors ${
                            filters.location === 'any' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'hover:bg-secondary'
                          }`}
                        >
                          Any location
                        </button>
                        {locations.map((location) => (
                          <button
                            key={location}
                            onClick={() => {
                              handleLocationChange(location);
                              setIsLocationOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 rounded-sm text-sm transition-colors ${
                              filters.location === location 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-secondary'
                            }`}
                          >
                            {location.charAt(0).toUpperCase() + location.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 