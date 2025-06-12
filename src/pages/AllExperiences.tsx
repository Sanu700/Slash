import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExperienceCard from '@/components/ExperienceCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Filter } from 'lucide-react';
import { getAllExperiences } from '@/lib/data';
import { Experience } from '@/lib/data/types';
import { useInView } from '@/lib/animations';
import { FilterDialog, FilterOptions } from '@/components/FilterDialog';

const AllExperiences = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [sortOrder, setSortOrder] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const experiencesPerPage = 12;
  const location = useLocation();
  
  // Load experiences from Supabase
  useEffect(() => {
    const loadExperiences = async () => {
      setIsLoading(true);
      try {
        const data = await getAllExperiences();
        setExperiences(data);
      } catch (error) {
        console.error('Error loading experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadExperiences();
  }, []);
  
  // Get search term from URL query params
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const search = query.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [location.search]);
  
  // Memoize filtered and sorted experiences to improve performance
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
      // Price range filter
      filtered = filtered.filter(exp => 
        exp.price >= activeFilters.priceRange[0] && 
        exp.price <= activeFilters.priceRange[1]
      );

      // Categories filter
      if (activeFilters.categories.length > 0) {
        filtered = filtered.filter(exp => 
          activeFilters.categories.includes(exp.category)
        );
      }

      // Experience types filter
      const hasExperienceTypeFilter = Object.values(activeFilters.experienceTypes).some(Boolean);
      if (hasExperienceTypeFilter) {
        filtered = filtered.filter(exp => {
          if (activeFilters.experienceTypes.romantic && !exp.romantic) return false;
          if (activeFilters.experienceTypes.adventurous && !exp.adventurous) return false;
          if (activeFilters.experienceTypes.group && !exp.group) return false;
          if (activeFilters.experienceTypes.trending && !exp.trending) return false;
          if (activeFilters.experienceTypes.featured && !exp.featured) return false;
          return true;
        });
      }

      // Duration filter
      if (activeFilters.duration) {
        filtered = filtered.filter(exp => {
          const [min, max] = activeFilters.duration.split('-').map(Number);
          const expDuration = parseInt(exp.duration);
          if (max) {
            return expDuration >= min && expDuration <= max;
          } else {
            return expDuration >= min;
          }
        });
      }

      // Location filter
      if (activeFilters.location) {
        filtered = filtered.filter(exp => 
          exp.location.toLowerCase() === activeFilters.location.toLowerCase()
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
  
  useEffect(() => {
    // Reset to page 1 when search, sort, or filters change
    setCurrentPage(1);
  }, [searchTerm, sortOrder, activeFilters]);
  
  const handleSortChange = (order: 'default' | 'price-low' | 'price-high') => {
    setSortOrder(order);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleFilterApply = (filters: FilterOptions) => {
    setActiveFilters(filters);
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-background">
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
                "mb-8 transition-all duration-500",
                isInView ? "opacity-100" : "opacity-0 translate-y-8"
              )}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search experiences by title, description or location..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-4 py-3 pl-12 rounded-lg border focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
                    {activeFilters && (
                      <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        {Object.values(activeFilters.experienceTypes).filter(Boolean).length +
                         (activeFilters.categories.length > 0 ? 1 : 0) +
                         (activeFilters.duration ? 1 : 0) +
                         (activeFilters.location ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Experiences Grid */}
              {currentExperiences.length > 0 ? (
                <div className={cn(
                  "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children",
                  isInView ? "opacity-100" : "opacity-0"
                )}>
                  {currentExperiences.map((experience) => (
                    <ExperienceCard key={experience.id} experience={experience} />
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
      
      <Footer />

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        initialFilters={activeFilters || undefined}
      />
    </div>
  );
};

export default AllExperiences;
