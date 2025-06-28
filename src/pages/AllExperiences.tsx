'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Experience } from '@/lib/data/types';
import ExperienceCard from '@/components/ExperienceCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/animations';
import { useExperiencesManager } from '@/lib/data';
import { FilterDialog, FilterOptions } from '@/components/FilterDialog';
import Navbar from '@/components/Navbar';
import { Filter } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

const AllExperiences = () => {
  const { experiences, isLoading } = useExperiencesManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<
    'default' | 'price-low' | 'price-high' | 'duration-low' | 'duration-high'
  >('default');
  const [currentPage, setCurrentPage] = useState(1);
  const experiencesPerPage = 6;
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const location = useLocation();
  const navigate = useNavigate();

  // Get location from query param
  const query = new URLSearchParams(location.search);
  const locationParam = query.get('location');

  const clearFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    setSortOrder('default');
    setCurrentPage(1);
  };

  // Handle initial filters from location state
  useEffect(() => {
    // Get search term from URL query params
    const query = new URLSearchParams(location.search);
    const search = query.get('search');
    if (search) {
      setSearchTerm(search);
    }

    // Handle initial filters from location state
    if (location.state?.initialFilters === null) {
      clearFilters();
    } else if (location.state?.initialFilters) {
      // Ensure locations is always an array
      const filters = { ...location.state.initialFilters };
      if (filters.location && !filters.locations) {
        filters.locations = filters.location !== 'any' ? [filters.location] : [];
        delete filters.location;
      }
      // Ensure duration is always a [number, number] array
      if (typeof filters.duration === 'string') {
        if (filters.duration === 'any') {
          filters.duration = [1, 24];
        } else if (filters.duration.endsWith('+')) {
          const min = parseInt(filters.duration);
          filters.duration = [min, 24];
        } else if (filters.duration.includes('-')) {
          const [min, max] = filters.duration.split('-').map(Number);
          filters.duration = [min, max];
        } else {
          const val = parseInt(filters.duration);
          filters.duration = [val, val];
        }
      }
      setActiveFilters(filters);
    }
  }, [location]);

  // Memoize filtered and sorted experiences
  const filteredExperiences = useMemo(() => {
    if (isLoading) return [];
    
    let filtered = [...experiences];
    
    // Filter by location query param if present
    if (locationParam && locationParam !== 'All India') {
      const normalizedParam = locationParam.trim().toLowerCase();
      filtered = filtered.filter(exp => {
        const expLoc = (exp.location || '').trim().toLowerCase();
        // Exact match or partial match
        return expLoc === normalizedParam || expLoc.includes(normalizedParam) || normalizedParam.includes(expLoc);
      });
    }

    // Apply search filtering
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(lowercasedSearch) ||
        exp.description.toLowerCase().includes(lowercasedSearch) ||
        exp.location.toLowerCase().includes(lowercasedSearch)
      );
    }

    // Apply active filters
    if (activeFilters) {
      // Category filter
      if (activeFilters.categories?.length) {
        filtered = filtered.filter(exp => 
          activeFilters.categories.some(category => 
            exp.category.toLowerCase() === category.toLowerCase()
          )
        );
      }

      // Location filter
      if (activeFilters.locations && activeFilters.locations.length > 0) {
        filtered = filtered.filter(exp =>
          activeFilters.locations.some(loc =>
            exp.location.toLowerCase() === loc.toLowerCase()
          )
        );
      }

      // Price range filter
      if (activeFilters.priceRange) {
        filtered = filtered.filter(exp => 
          exp.price >= activeFilters.priceRange[0] && 
          exp.price <= activeFilters.priceRange[1]
        );
      }

      // Duration filter
      if (Array.isArray(activeFilters.duration)) {
        filtered = filtered.filter(exp => {
          // Parse duration string to handle different formats
          const durationStr = exp.duration.toLowerCase();
          let expDuration: number;
          if (durationStr.includes('day') || durationStr.includes('days')) {
            // Convert days to hours (1 day = 24 hours)
            const days = parseInt(durationStr);
            expDuration = days * 24;
          } else if (durationStr.includes('full day')) {
            expDuration = 24; // Full day is considered as 24 hours
          } else {
            // Extract hours from string like "2 hours" or "3-4 hours"
            expDuration = parseInt(durationStr);
          }
          return expDuration >= activeFilters.duration[0] && expDuration <= activeFilters.duration[1];
        });
      }

      // Experience types filter
      if (Object.values(activeFilters.experienceTypes).some(Boolean)) {
        filtered = filtered.filter(exp => {
          if (activeFilters.experienceTypes.romantic && exp.romantic) return true;
          if (activeFilters.experienceTypes.adventurous && exp.adventurous) return true;
          if (activeFilters.experienceTypes.group && exp.group) return true;
          if (activeFilters.experienceTypes.trending && exp.trending) return true;
          if (activeFilters.experienceTypes.featured && exp.featured) return true;
          return false;
        });
      }
    }
    
    // Apply sorting
    if (sortOrder === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'duration-low' || sortOrder === 'duration-high') {
      const getDurationHours = (exp: Experience) => {
        const durationStr = exp.duration?.toLowerCase?.() || '';
        if (durationStr.includes('day') && !durationStr.includes('hour')) {
          const days = parseInt(durationStr);
          return days * 24;
        } else if (durationStr.includes('full day')) {
          return 24;
        } else {
          const match = durationStr.match(/(\d+)(-(\d+))?/);
          if (match) {
            return parseInt(match[1]);
          }
          return 0;
        }
      };
      filtered.sort((a, b) => {
        const aDur = getDurationHours(a);
        const bDur = getDurationHours(b);
        return sortOrder === 'duration-low' ? aDur - bDur : bDur - aDur;
      });
    }
    
    return filtered;
  }, [sortOrder, searchTerm, experiences, isLoading, activeFilters, locationParam]);

  // Calculate pagination
  const indexOfLastExperience = currentPage * experiencesPerPage;
  const indexOfFirstExperience = indexOfLastExperience - experiencesPerPage;
  const currentExperiences = filteredExperiences.slice(indexOfFirstExperience, indexOfLastExperience);
  const totalPages = Math.ceil(filteredExperiences.length / experiencesPerPage);

  const handleSortChange = (order: 'default' | 'price-low' | 'price-high' | 'duration-low' | 'duration-high') => {
    setSortOrder(order);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  const activeFiltersCount =
    (activeFilters?.categories?.length || 0) +
    (activeFilters?.locations?.length || 0) +
    (activeFilters?.priceRange && 
     (activeFilters.priceRange[0] !== 0 || activeFilters.priceRange[1] !== 100000) ? 1 : 0) +
    (activeFilters?.duration && Array.isArray(activeFilters.duration) && (activeFilters.duration[0] !== 1 || activeFilters.duration[1] !== 24) ? 1 : 0) +
    (activeFilters?.experienceTypes && 
     Object.values(activeFilters.experienceTypes).filter(Boolean).length);


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background pt-24">
        <div 
          ref={ref}
          className="container max-w-6xl mx-auto px-6 md:px-10 py-12"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Search Bar */}
              <div className={cn(
                "mb-8 mt-8 transition-all duration-500",
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search experiences by title, description or location..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-200 bg-white shadow-sm focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                </div>
              </div>

              {/* Filters and Sorting */}
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className={cn(
                  "transition-all duration-700",
                  isInView ? "opacity-100" : "opacity-0 translate-y-8"
                )}>
                  <h2 className="text-2xl font-medium">
                    {filteredExperiences.length} Experiences
                  </h2>
                </div>

                <div className={cn(
                  "flex items-center space-x-4 transition-all duration-700 delay-100",
                  isInView ? "opacity-100" : "opacity-0 translate-y-8"
                )}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="min-w-[120px]">
                        Sort by: {
                          sortOrder === 'default' ? 'Featured'
                          : sortOrder === 'price-low' ? 'Price (Low to High)'
                          : sortOrder === 'price-high' ? 'Price (High to Low)'
                          : sortOrder === 'duration-low' ? 'Duration (Low to High)'
                          : 'Duration (High to Low)'
                        }
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuRadioGroup value={sortOrder} onValueChange={v => setSortOrder(v as typeof sortOrder)}>
                        <DropdownMenuRadioItem value="default">Featured</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="price-low">Price (Low to High)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="price-high">Price (High to Low)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="duration-low">Duration (Low to High)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="duration-high">Duration (High to Low)</DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className={cn(
                      activeFilters && "border-primary text-primary"
                    )}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Experiences Grid */}
              {filteredExperiences.length > 0 ? (
                <div className={cn(
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch stagger-children",
                  isInView ? "opacity-100" : "opacity-0"
                )}>
                  {currentExperiences.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl mb-2">
                    {locationParam ? `No experiences found in ${locationParam}` : 'No matching experiences found'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {locationParam
                      ? `We don't have any experiences available in ${locationParam} yet. Try selecting a different location or check back later!`
                      : 'Try adjusting your search criteria'}
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setActiveFilters(null);
                    navigate('/experiences');
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {filteredExperiences.length > experiencesPerPage && renderPagination()}
            </>
          )}
        </div>
      </main>
      
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => {
          setActiveFilters(filters);
          setCurrentPage(1);
        }}
        initialFilters={activeFilters}
      />
    </div>
  );
};

export default AllExperiences;
