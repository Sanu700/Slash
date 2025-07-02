'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Experience } from '@/lib/data/types';
import ExperienceCard from '@/components/ExperienceCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useInView } from '@/lib/animations';
import { useExperiencesManager } from '@/lib/data';
import { FilterDialog, FilterOptions } from '@/components/FilterDialog';

import { SearchInput } from '@/components/ui/search-input';

import { useSearchHistory } from '@/hooks/useSearchHistory';
import Navbar from '@/components/Navbar';
import { Filter, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';

// Add distance filter options
const DISTANCE_FILTERS = [
  { label: 'All distances', value: 'all' },
  { label: 'Within 2 km', value: '2' },
  { label: 'Within 5 km', value: '5' },
  { label: 'Within 10 km', value: '10' },
  { label: 'Within 20 km', value: '20' }
];

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

const DEFAULT_RADIUS_KM = 10;

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
  const [locationClearedCount, setLocationClearedCount] = useState(0);

  // Get location from query param
  const query = new URLSearchParams(location.search);
  const locationParam = query.get('location');

  const clearFilters = () => {
    setActiveFilters(null);
    setSearchTerm('');
    setSortOrder('default');
    setCurrentPage(1);
    localStorage.removeItem('selected_address');
    localStorage.removeItem('selected_city');
    sessionStorage.setItem('location_modal_asked', 'true');
    window.dispatchEvent(new Event('locationCleared'));
    setLocationClearedCount(c => c + 1);
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

  useEffect(() => {
    const handler = () => setLocationClearedCount(c => c + 1);
    window.addEventListener('locationCleared', handler);
    return () => window.removeEventListener('locationCleared', handler);
  }, []);

  useEffect(() => {
    const handler = () => setLocationClearedCount(c => c + 1);
    window.addEventListener('locationChanged', handler);
    return () => window.removeEventListener('locationChanged', handler);
  }, []);

  // Sync currentPage with URL on mount and when location.search changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page') || '1', 10);
    setCurrentPage(page);
  }, [location.search]);

  // Update the URL when changing pages
  const handlePageChange = (page) => {
    setCurrentPage(page);
    const params = new URLSearchParams(location.search);
    params.set('page', page);
    navigate({ search: params.toString() }, { replace: true });
  };

  // Memoize filtered and sorted experiences
  const filteredExperiences = useMemo(() => {
    if (isLoading) return [];
    
    let filtered = [...experiences];
    
    // Proximity filtering logic
    const selectedAddressRaw = localStorage.getItem('selected_address');
    let selectedAddress = null;
    try {
      selectedAddress = selectedAddressRaw ? JSON.parse(selectedAddressRaw) : selectedAddressRaw;
    } catch {
      selectedAddress = selectedAddressRaw;
    }

    if (selectedAddress && typeof selectedAddress === 'object' && selectedAddress.lat && selectedAddress.lon) {
      const lat = parseFloat(selectedAddress.lat);
      const lon = parseFloat(selectedAddress.lon);
      filtered = filtered
        .map(exp => {
          if (typeof exp.latitude === 'number' && typeof exp.longitude === 'number') {
            const distance = haversineDistance(lat, lon, exp.latitude, exp.longitude);
            return { ...exp, _distance: distance };
          }
          return { ...exp, _distance: Infinity };
        })
        .filter(exp => exp._distance <= DEFAULT_RADIUS_KM)
        .sort((a, b) => (a._distance || 0) - (b._distance || 0));
    }

    // Filter by location query param if present (fallback)
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
  }, [sortOrder, searchTerm, experiences, isLoading, activeFilters, locationParam, locationClearedCount]);

  // Group experiences by exp_type (first value), skip 'Other' group
  const groupedExperiences = useMemo<Record<string, Experience[]>>(() => {
    const groups: Record<string, Experience[]> = {};
    filteredExperiences.forEach(exp => {
      if (Array.isArray(exp.exp_type) && exp.exp_type.length > 0 && exp.exp_type[0]) {
        const type = exp.exp_type[0];
        if (!groups[type]) groups[type] = [];
        groups[type].push(exp);
      }
    });
    return groups;
  }, [filteredExperiences]);

  // Find ungrouped experiences (no exp_type or empty array)
  const ungroupedExperiences = useMemo(() => {
    return filteredExperiences.filter(
      exp => !Array.isArray(exp.exp_type) || exp.exp_type.length === 0 || !exp.exp_type[0]
    );
  }, [filteredExperiences]);

  const [expandedType, setExpandedType] = useState<string | null>(null);

  // Prepare a combined list of cards (grouped and ungrouped) for pagination
  const allCards = useMemo(() => {
    const groupCardEntries = Object.entries(groupedExperiences).map(([type, exps], idx) => {
      const experiencesArr = exps as Experience[];
      if (experiencesArr.length === 1) {
        // Show single experience as normal, visually match group card
        return { type: 'standalone', key: experiencesArr[0].id, content: (
          <div key={experiencesArr[0].id} className="col-span-1 h-full w-full aspect-[4/3] flex flex-col">
            <ExperienceCard experience={experiencesArr[0]} />
          </div>
        ) };
      }
      // Group card
      const groupColors = [
        'bg-blue-100 text-blue-900',
        'bg-green-100 text-green-900',
        'bg-yellow-100 text-yellow-900',
        'bg-pink-100 text-pink-900',
        'bg-purple-100 text-purple-900',
        'bg-orange-100 text-orange-900',
        'bg-teal-100 text-teal-900',
        'bg-red-100 text-red-900',
      ];
      const colorClass = groupColors[idx % groupColors.length];
      return { type: 'group', key: type, content: (
        <div key={type} className="col-span-1 h-full w-full aspect-[4/3]">
          <div
            className={`group relative overflow-hidden rounded-xl hover-lift transition-all duration-300 h-full w-full flex flex-col items-center justify-center cursor-pointer ${colorClass}`}
            onClick={() => navigate(`/experiences/type/${encodeURIComponent(type)}`)}
          >
            {/* Show image from the first experience in the group */}
            <div className="aspect-[4/3] w-full overflow-hidden flex items-center justify-center bg-white/30 mb-4">
              <img
                src={Array.isArray(experiencesArr[0].imageUrl) ? (experiencesArr[0].imageUrl[0] || '/placeholder.svg') : (experiencesArr[0].imageUrl || '/placeholder.svg')}
                alt={type}
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
                style={{ minHeight: '200px' }}
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                }}
              />
            </div>
            {/* Name and ellipse stacked below image */}
            <div className="flex flex-col items-center justify-center w-full min-h-[80px] gap-2 pb-2 mt-0">
              <span className="font-bold text-2xl text-center">{type}</span>
              <span className="text-xs bg-white/80 text-black rounded-full px-3 py-1 font-semibold">{experiencesArr.length} experiences</span>
            </div>
          </div>
        </div>
      ) };
    });
    const ungroupedCardEntries = ungroupedExperiences.map(exp => ({
      type: 'standalone',
      key: exp.id,
      content: (
        <div key={exp.id} className="col-span-1 h-full w-full aspect-[4/3] flex flex-col">
          <ExperienceCard experience={exp} />
        </div>
      )
    }));
    return [...groupCardEntries, ...ungroupedCardEntries];
  }, [groupedExperiences, ungroupedExperiences, navigate]);

  // Pagination for all cards
  const cardsPerPage = 9;
  const totalPages = Math.ceil(allCards.length / cardsPerPage);
  const paginatedCards = allCards.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  const handleSortChange = (order: 'default' | 'price-low' | 'price-high' | 'duration-low' | 'duration-high') => {
    setSortOrder(order);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (query: string) => {
    setSearchTerm(query);
  };

  const handleResultSelect = (experience: Experience) => {
    navigate(`/experience/${experience.id}`);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8 space-x-2">
        <Button
          variant="outline"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => handlePageChange(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
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
          className="container max-w-6xl mx-auto px-4 md:px-10 py-12"
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
                <SearchInput
                  placeholder="Search experiences by title, description or location..."
                  onSearch={handleSearchSubmit}
                  onResultSelect={handleResultSelect}
                  className="w-full"
                  recentSearches={[]}
                />
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
                  {activeFiltersCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </div>

              {/* Experiences Grid */}
              {allCards.length > 0 ? (
                <div className={cn(
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch stagger-children pt-16",
                  isInView ? "opacity-100" : "opacity-0"
                )}>

                  {currentExperiences.map((experience, idx) => (
                    <ExperienceCard key={experience.id} experience={experience} index={idx} />
                  ))}

                  {paginatedCards.map(card => card.content)}

                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl mb-2">
                    No experiences found in {locationParam || 'the selected location'}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try selecting a different location or clear your filters.
                  </p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setActiveFilters(null);
                    localStorage.removeItem('selected_address');
                    localStorage.removeItem('selected_city');
                    sessionStorage.setItem('location_modal_asked', 'true');
                    window.dispatchEvent(new Event('locationCleared'));
                    navigate('/experiences');
                  }}>
                    Clear All Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {allCards.length > cardsPerPage && renderPagination()}
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
