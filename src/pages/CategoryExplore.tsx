import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { categories } from '@/lib/data/categories';
import { getExperiencesByCategoryTags } from '@/lib/data';
import { Experience, Category } from '@/lib/data/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ExperienceCard from '@/components/ExperienceCard';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react';
import { useInView } from '@/lib/animations';

const CategoryExplore = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [sortOrder, setSortOrder] = useState<'default' | 'price-low' | 'price-high'>('default');
  
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Find the category with the matching id
    const foundCategory = categories.find(cat => cat.id === id);
    
    if (foundCategory) {
      setCategory(foundCategory);
      
      // Load experiences for this category from Supabase
      const loadCategoryExperiences = async () => {
        setIsLoading(true);
        try {
          if (id) {
            const experiences = await getExperiencesByCategoryTags(id);
            setFilteredExperiences(experiences);
          }
        } catch (error) {
          console.error('Error loading category experiences:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      loadCategoryExperiences();
    } else {
      setIsLoading(false);
    }
  }, [id]);
  
  // Handle sorting
  useEffect(() => {
    if (filteredExperiences.length > 0) {
      let sorted = [...filteredExperiences];
      
      if (sortOrder === 'price-low') {
        sorted.sort((a, b) => a.price - b.price);
      } else if (sortOrder === 'price-high') {
        sorted.sort((a, b) => b.price - a.price);
      }
      
      setFilteredExperiences(sorted);
    }
  }, [sortOrder]);
  
  const handleSortChange = (order: 'default' | 'price-low' | 'price-high') => {
    setSortOrder(order);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-medium mb-4">Category not found</h2>
        <p className="text-muted-foreground mb-8">The category you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 md:pt-24">
        {/* Hero Section */}
        <div className="relative h-[30vh] md:h-[40vh] w-full">
          <img 
            src={category.imageUrl} 
            alt={category.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          <div className="absolute top-6 left-6">
            <button onClick={() => navigate(-1)} className="bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
              <ArrowLeft className="h-5 w-5 text-white" />
            </button>
          </div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
            <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-4">
              <category.icon className="h-8 w-8" />
            </div>
            <h1 className="text-3xl md:text-4xl font-medium mb-2">{category.name} Experiences</h1>
            <p className="max-w-2xl text-white/80">{category.description}</p>
          </div>
        </div>
        
        <div 
          ref={ref}
          className="container max-w-6xl mx-auto px-6 md:px-10 py-12"
        >
          {/* Filters and Sorting */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className={cn(
              "transition-all duration-700",
              isInView ? "opacity-100" : "opacity-0 translate-y-8"
            )}>
              <h2 className="text-2xl font-medium">
                {filteredExperiences.length} {category.name} Experiences
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
          {filteredExperiences.length > 0 ? (
            <div className={cn(
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children",
              isInView ? "opacity-100" : "opacity-0"
            )}>
              {filteredExperiences.map((experience) => (
                <ExperienceCard key={experience.id} experience={experience} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No experiences found</h3>
              <p className="text-muted-foreground mb-6">
                There are currently no experiences available in this category.
              </p>
              <Link to="/">
                <Button>Explore other categories</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryExplore;
