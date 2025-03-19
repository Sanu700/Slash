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

const AllExperiences = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [sortOrder, setSortOrder] = useState<'default' | 'price-low' | 'price-high'>('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    
    let sorted = [...experiences];
    
    // Apply sorting
    if (sortOrder === 'price-low') {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-high') {
      sorted.sort((a, b) => b.price - a.price);
    }
    
    // Apply search filtering if there's a search term
    if (searchTerm.trim()) {
      const lowercasedSearch = searchTerm.toLowerCase();
      sorted = sorted.filter(exp => 
        exp.title.toLowerCase().includes(lowercasedSearch) ||
        exp.description.toLowerCase().includes(lowercasedSearch) ||
        exp.location.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    return sorted;
  }, [sortOrder, searchTerm, experiences, isLoading]);
  
  // Calculate pagination
  const indexOfLastExperience = currentPage * experiencesPerPage;
  const indexOfFirstExperience = indexOfLastExperience - experiencesPerPage;
  const currentExperiences = filteredExperiences.slice(indexOfFirstExperience, indexOfLastExperience);
  const totalPages = Math.ceil(filteredExperiences.length / experiencesPerPage);
  
  useEffect(() => {
    // Reset to page 1 when search or sort changes
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);
  
  const handleSortChange = (order: 'default' | 'price-low' | 'price-high') => {
    setSortOrder(order);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Keep the existing pagination renderer code
  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={cn(
            "w-10 h-10 rounded-md transition-colors",
            currentPage === i 
              ? "bg-primary text-white" 
              : "bg-secondary hover:bg-secondary/80"
          )}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex items-center justify-center gap-2 mt-12">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {totalPages <= 7 ? (
            pages
          ) : (
            <>
              {currentPage > 2 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="w-10 h-10 rounded-md bg-secondary hover:bg-secondary/80"
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="px-1">...</span>}
                </>
              )}
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={cn(
                        "w-10 h-10 rounded-md transition-colors",
                        currentPage === pageNum 
                          ? "bg-primary text-white" 
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              
              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && <span className="px-1">...</span>}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="w-10 h-10 rounded-md bg-secondary hover:bg-secondary/80"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </>
          )}
        </div>
        
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md bg-secondary hover:bg-secondary/80 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 md:pt-24">
        {/* Hero Section */}
        <div className="relative h-[30vh] md:h-[40vh] w-full">
          <img 
            src="https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?q=80&w=2674&auto=format&fit=crop" 
            alt="All Experiences"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <Link to="/" className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Link>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-4">
              <img 
                src="/lovable-uploads/5c4b2b72-9668-4671-9be9-84c7371c459a.png" 
                alt="Slash logo" 
                className="h-8 w-8" 
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-medium mb-2">All Experiences</h1>
            <p className="max-w-2xl text-white/80">
              Browse our complete collection of extraordinary experiences
            </p>
          </div>
        </div>
        
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
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
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
                  <Button onClick={() => setSearchTerm('')}>
                    Clear Search
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
    </div>
  );
};

export default AllExperiences;
