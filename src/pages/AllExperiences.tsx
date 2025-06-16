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
import { useLocation } from 'react-router-dom';

const AllExperiences = () => {
  const { experiences, isLoading } = useExperiencesManager();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [currentPage, setCurrentPage] = useState(1);
  const experiencesPerPage = 6;
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const location = useLocation();

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
      setActiveFilters(location.state.initialFilters);
    }
  }, [location]);

  // Memoize filtered and sorted experiences
  const filteredExperiences = useMemo(() => {
    if (isLoading) return [];
    
    let filtered = [...experiences];
    
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
      if (activeFilters.categories?.length) {
        filtered = filtered.filter(exp => 
          activeFilters.categories.some(category => 
            exp.category.toLowerCase() === category.toLowerCase()
          )
        );
      }

      if (activeFilters.location && activeFilters.location !== 'any') {
        filtered = filtered.filter(exp => 
          exp.location.toLowerCase() === activeFilters.location.toLowerCase()
        );
      }

      if (activeFilters.priceRange) {
        filtered = filtered.filter(exp => 
          exp.price >= activeFilters.priceRange[0] && 
          exp.price <= activeFilters.priceRange[1]
        );
      }
    }
    
    // Apply sorting
    if (sortOrder === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }
    
    return filtered;
  }, [sortOrder, searchTerm, experiences, isLoading, activeFilters]);

  // Calculate pagination
  const indexOfLastExperience = currentPage * experiencesPerPage;
  const indexOfFirstExperience = indexOfLastExperience - experiencesPerPage;
  const currentExperiences = filteredExperiences.slice(indexOfFirstExperience, indexOfLastExperience);
  const totalPages = Math.ceil(filteredExperiences.length / experiencesPerPage);

  const handleSortChange = (order: 'default' | 'price-low' | 'price-high') => {
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
    (activeFilters?.location && activeFilters.location !== 'any' ? 1 : 0) +
    (activeFilters?.priceRange && 
     (activeFilters.priceRange[0] !== 0 || activeFilters.priceRange[1] !== 100000) ? 1 : 0);

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
                  <div className="flex items-center bg-secondary/50 rounded-lg p-1">
                    <button 
                      onClick={() => handleSortChange('default')}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        sortOrder === 'default' ? "bg-white text-black" : "text-muted-foreground"
                      )}
                    >
                      Featured
                    </button>
                    <button 
                      onClick={() => handleSortChange('price-low')}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        sortOrder === 'price-low' ? "bg-white text-black" : "text-muted-foreground"
                      )}
                    >
                      Price: Low to High
                    </button>
                    <button 
                      onClick={() => handleSortChange('price-high')}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors",
                        sortOrder === 'price-high' ? "bg-white text-black" : "text-muted-foreground"
                      )}
                    >
                      Price: High to Low
                    </button>
                  </div>
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
              {currentExperiences.length > 0 ? (
                <div className={cn(
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center stagger-children",
                  isInView ? "opacity-100" : "opacity-0"
                )}>
                  {currentExperiences.map((experience) => (
                    <div key={experience.id} className="flex justify-center">
                      <ExperienceCard experience={experience} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl mb-2">No matching experiences found</h3>
                  <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setActiveFilters(null);
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
        onApply={setActiveFilters}
        initialFilters={activeFilters}
      />
    </div>
  );
};

export default AllExperiences;
