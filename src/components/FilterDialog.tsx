import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Badge } from '@/components/ui/badge';

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
  duration: [number, number]; // range in hours
  locations: string[];
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
  duration: [0, 24],
  locations: []
};

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

  // Update filters when initialFilters changes
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters]);

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
        
        // Only update price range if it hasn't been set by initialFilters
        if (!initialFilters) {
          setFilters(prev => ({
            ...prev,
            priceRange: [min, max]
          }));
        }
      } catch (err) {
        console.error('Error fetching filter data:', err);
        setError('Failed to load filter options');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilterData();
  }, [isOpen, initialFilters]);

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

  const handleDurationChange = (value: number[]) => {
    // Ensure value is always a tuple of two numbers
    const tuple: [number, number] = [value[0] ?? 0, value[1] ?? 24];
    setFilters(prev => ({ ...prev, duration: tuple }));
  };

  const handleLocationChange = (location: string) => {
    setFilters(prev => {
      const currentLocations = prev.locations || [];
      const exists = currentLocations.some(l => l.toLowerCase() === location.toLowerCase());
      const newLocations = exists
        ? currentLocations.filter(l => l.toLowerCase() !== location.toLowerCase())
        : [...currentLocations, location];
      return {
        ...prev,
        locations: newLocations
      };
    });
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handleApply = () => {
    // Check if any filters are actually active
    const hasActiveFilters = 
      filters.categories.length > 0 ||
      Object.values(filters.experienceTypes).some(Boolean) ||
      filters.duration[0] !== 0 ||
      filters.duration[1] !== 24 ||
      filters.locations.length > 0 ||
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
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange[0] === 0 && filters.priceRange[1] === 1000}
                    onChange={() => setFilters(prev => ({ ...prev, priceRange: [0, 1000] }))}
                  />
                  ₹0 - ₹1,000
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange[0] === 1000 && filters.priceRange[1] === 2000}
                    onChange={() => setFilters(prev => ({ ...prev, priceRange: [1000, 2000] }))}
                  />
                  ₹1,000 - ₹2,000
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange[0] === 2000 && filters.priceRange[1] === 3000}
                    onChange={() => setFilters(prev => ({ ...prev, priceRange: [2000, 3000] }))}
                  />
                  ₹2,000 - ₹3,000
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={filters.priceRange[0] === 3000 && filters.priceRange[1] === 100000}
                    onChange={() => setFilters(prev => ({ ...prev, priceRange: [3000, 100000] }))}
                  />
                  ₹3,000+
                </label>
              </div>
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
              <Label>Duration (hours)</Label>
              <Slider
                value={Array.isArray(filters.duration) ? filters.duration : [0, 24]}
                min={0}
                max={24}
                step={1}
                onValueChange={handleDurationChange}
                className="w-full"
                minStepsBetweenThumbs={1}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{Array.isArray(filters.duration) ? filters.duration[0] : 0} hr</span>
                <span>{Array.isArray(filters.duration) ? filters.duration[1] : 24} hr</span>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label>Location</Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsLocationOpen(!isLocationOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm bg-white"
                >
                  <span>
                    {filters.locations.length === 0
                      ? 'Select locations'
                      : `${filters.locations.length} selected`}
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
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-56 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {locations.map((location) => (
                        <div key={location} className="flex items-center space-x-2 py-1">
                          <Checkbox
                            id={`loc-${location}`}
                            checked={filters.locations.some(l => l.toLowerCase() === location.toLowerCase())}
                            onCheckedChange={() => handleLocationChange(location)}
                          />
                          <Label htmlFor={`loc-${location}`} className="text-sm cursor-pointer">
                            {location}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Selected locations as badges */}
              {filters.locations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.locations.map((location) => (
                    <Badge key={location} variant="secondary" className="flex items-center gap-1 pr-1">
                      <span>{location}</span>
                      <button
                        type="button"
                        className="ml-1 text-xs text-gray-500 hover:text-red-500 focus:outline-none"
                        onClick={() => handleLocationChange(location)}
                        aria-label={`Remove ${location}`}
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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