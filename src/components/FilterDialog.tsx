import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data/categories';

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
  location: '',
};

const durations = [
  { value: '1-3', label: '1-3 hours' },
  { value: '3-6', label: '3-6 hours' },
  { value: '6-12', label: '6-12 hours' },
  { value: '12+', label: '12+ hours' },
];

export function FilterDialog({ isOpen, onClose, onApply, initialFilters }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters || defaultFilters);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('FilterDialog mounted, isOpen:', isOpen);
    console.log('Categories:', categories);
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
    try {
      setFilters(prev => ({
        ...prev,
        categories: prev.categories.includes(category)
          ? prev.categories.filter(c => c !== category)
          : [...prev.categories, category]
      }));
    } catch (err) {
      console.error('Error in handleCategoryChange:', err);
      setError('Error updating categories');
    }
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

  const handleDurationChange = (value: string) => {
    try {
      setFilters(prev => ({ ...prev, duration: value }));
    } catch (err) {
      console.error('Error in handleDurationChange:', err);
      setError('Error updating duration');
    }
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
    try {
      setFilters(defaultFilters);
      setError(null);
    } catch (err) {
      console.error('Error in handleReset:', err);
      setError('Error resetting filters');
    }
  };

  const handleApply = () => {
    try {
      onApply(filters);
      onClose();
    } catch (err) {
      console.error('Error in handleApply:', err);
      setError('Error applying filters');
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
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

        <div className="grid gap-6 py-4">
          {/* Price Range */}
          <div className="space-y-4">
            <Label>Price Range</Label>
            <Slider
              defaultValue={filters.priceRange}
              max={100000}
              step={1000}
              onValueChange={handlePriceChange}
              className="w-full"
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
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => handleCategoryChange(category.id)}
                    />
                    <Label htmlFor={category.id} className="text-sm">
                      {category.name}
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
            <Select value={filters.duration} onValueChange={handleDurationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any duration</SelectItem>
                {durations.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <Label>Location</Label>
            <Select value={filters.location} onValueChange={handleLocationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any location</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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