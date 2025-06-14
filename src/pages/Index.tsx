// Export types directly
export * from '@/lib/data/types';

// Import from categories and experiences
import { categories } from '@/lib/data/categories';
import { experiences } from '@/lib/data/experiences';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Gift, CheckCircle, Clock, Heart, Image, CornerRightDown } from 'lucide-react';
import { useInView } from '@/lib/animations';
import ExperienceCard from '@/components/ExperienceCard';
import { Experience, Category } from '@/lib/data/types';

interface CompanyPage {
  id: string;
  title: string;
  meta_description: string;
  content: {
    image_url?: string;
  };
}

// This function checks if there are saved experiences in localStorage for fallback
export const getSavedExperiences = (): Experience[] => {
  try {
    const saved = localStorage.getItem('experiences');
    return saved ? JSON.parse(saved) : experiences;
  } catch (error) {
    console.error('Error retrieving saved experiences:', error);
    return experiences;
  }
};

// Helper function to map database experience to application experience type
const mapDbExperienceToModel = (item: any): Experience => ({
  id: item.id,
  title: item.title,
  description: item.description,
  imageUrl: item.image_url,
  price: item.price,
  location: item.location,
  duration: item.duration,
  participants: item.participants,
  date: item.date,
  category: item.category,
  nicheCategory: item.niche_category,
  trending: item.trending || false,
  featured: item.featured || false,
  romantic: item.romantic || false,
  adventurous: item.adventurous || false,
  group: item.group_activity || false
});

// This hook manages the experiences data
export const useExperiencesManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load experiences from Supabase on component mount
  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Map Supabase data to our Experience type
        const mappedExperiences = data.map(mapDbExperienceToModel);
        setExperiences(mappedExperiences);
        
        // Save to localStorage as fallback
        localStorage.setItem('experiences', JSON.stringify(mappedExperiences));
      } catch (err) {
        console.error('Error fetching experiences:', err);
        setError('Failed to load experiences');
        
        // Load from localStorage as fallback
        const saved = getSavedExperiences();
        if (saved.length > 0) {
          setExperiences(saved);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExperiences();
  }, []);

  // Add a new experience
  const addExperience = async (experience: Omit<Experience, 'id'>) => {
    try {
      // Map our Experience type to Supabase schema
      const { data, error } = await supabase
        .from('experiences')
        .insert({
          title: experience.title,
          description: experience.description,
          image_url: experience.imageUrl,
          price: experience.price,
          location: experience.location,
          duration: experience.duration,
          participants: experience.participants,
          date: experience.date,
          category: experience.category,
          niche_category: experience.nicheCategory,
          trending: experience.trending || false,
          featured: experience.featured || false,
          romantic: experience.romantic || false,
          adventurous: experience.adventurous || false,
          group_activity: experience.group || false
        })
        .select('*')
        .single();
        
      if (error) {
        throw error;
      }
      
      const newExperience = mapDbExperienceToModel(data);
      setExperiences(prev => [...prev, newExperience]);
      return newExperience;
    } catch (err) {
      console.error('Error adding experience:', err);
      toast.error('Failed to add experience');
      throw err;
    }
  };

  // Update an existing experience
  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      // Map our Experience type updates to Supabase schema
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.location !== undefined) updateData.location = updates.location;
      if (updates.duration !== undefined) updateData.duration = updates.duration;
      if (updates.participants !== undefined) updateData.participants = updates.participants;
      if (updates.date !== undefined) updateData.date = updates.date;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.nicheCategory !== undefined) updateData.niche_category = updates.nicheCategory;
      if (updates.trending !== undefined) updateData.trending = updates.trending;
      if (updates.featured !== undefined) updateData.featured = updates.featured;
      if (updates.romantic !== undefined) updateData.romantic = updates.romantic;
      if (updates.adventurous !== undefined) updateData.adventurous = updates.adventurous;
      if (updates.group !== undefined) updateData.group_activity = updates.group;
      
      const { error } = await supabase
        .from('experiences')
        .update(updateData)
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setExperiences(prev => 
        prev.map(exp => (exp.id === id ? { ...exp, ...updates } : exp))
      );
    } catch (err) {
      console.error('Error updating experience:', err);
      toast.error('Failed to update experience');
      throw err;
    }
  };

  // Delete an experience
  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      setExperiences(prev => prev.filter(exp => exp.id !== id));
    } catch (err) {
      console.error('Error deleting experience:', err);
      toast.error('Failed to delete experience');
      throw err;
    }
  };

  // Import experiences from JSON
  const importExperiences = async (jsonString: string) => {
    try {
      const importedExperiences = JSON.parse(jsonString);
      
      if (!Array.isArray(importedExperiences)) {
        return { success: false, message: 'Invalid format: expected an array' };
      }
      
      // Insert new experiences
      const experiencesToInsert = importedExperiences.map((exp: any) => ({
        title: exp.title,
        description: exp.description,
        image_url: exp.imageUrl,
        price: exp.price,
        location: exp.location,
        duration: exp.duration,
        participants: exp.participants,
        date: exp.date,
        category: exp.category,
        niche_category: exp.nicheCategory,
        trending: exp.trending || false,
        featured: exp.featured || false,
        romantic: exp.romantic || false,
        adventurous: exp.adventurous || false,
        group_activity: exp.group || false
      }));
      
      const { error: insertError } = await supabase
        .from('experiences')
        .insert(experiencesToInsert);
        
      if (insertError) {
        throw insertError;
      }
      
      // Refresh the experiences list
      const { data, error: fetchError } = await supabase
        .from('experiences')
        .select('*');
        
      if (fetchError) {
        throw fetchError;
      }
      
      // Map Supabase data to our Experience type
      const mappedExperiences = data.map(mapDbExperienceToModel);
      
      setExperiences(mappedExperiences);
      
      return { success: true, message: 'Experiences imported successfully' };
    } catch (error) {
      console.error('Error importing experiences:', error);
      return { 
        success: false, 
        message: `Error importing: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  // Export experiences to JSON
  const exportExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      // Map Supabase data to our Experience type for export
      const exportData = data.map(mapDbExperienceToModel);
      
      return JSON.stringify(exportData, null, 2);
    } catch (err) {
      console.error('Error exporting experiences:', err);
      toast.error('Failed to export experiences');
      throw err;
    }
  };

  // Reset to default experiences - for development purposes
  const resetExperiences = async () => {
    try {
      toast.success('Experiences have been reset');
      return { success: true, message: 'Experiences have been reset' };
    } catch (err) {
      console.error('Error resetting experiences:', err);
      toast.error('Failed to reset experiences');
      throw err;
    }
  };

  return {
    experiences,
    isLoading,
    error,
    addExperience,
    updateExperience,
    deleteExperience,
    resetExperiences,
    importExperiences,
    exportExperiences
  };
};

// Create a standalone function to get all experiences
export const getAllExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data.map(mapDbExperienceToModel);
  } catch (err) {
    console.error('Error loading experiences:', err);
    return getSavedExperiences();
  }
};

// Create a standalone function to get trending experiences
export const getTrendingExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('trending', true);
    
    if (error) {
      throw error;
    }
    
    return data.map(mapDbExperienceToModel);
  } catch (err) {
    console.error('Error loading trending experiences:', err);
    const localExperiences = getSavedExperiences();
    return localExperiences.filter(exp => exp.trending);
  }
};

// Create a standalone function to get featured experiences
export const getFeaturedExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('featured', true);
    
    if (error) {
      throw error;
    }
    
    return data.map(mapDbExperienceToModel);
  } catch (err) {
    console.error('Error loading featured experiences:', err);
    const localExperiences = getSavedExperiences();
    return localExperiences.filter(exp => exp.featured);
  }
};

// Create a standalone function to get a single experience by ID
export const getExperienceById = async (id: string): Promise<Experience | null> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      throw error;
    }
    
    if (!data) return null;
    
    return mapDbExperienceToModel(data);
  } catch (err) {
    console.error('Error loading experience by ID:', err);
    const localExperiences = getSavedExperiences();
    return localExperiences.find(exp => exp.id === id) || null;
  }
};

// Create a standalone function to get experiences by category
export const getExperiencesByCategory = async (categoryId: string): Promise<Experience[]> => {
  try {
    const categoryObj = categories.find(cat => cat.id === categoryId);
    
    if (!categoryObj) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .ilike('category', categoryObj.name.toLowerCase());
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      const localExperiences = getSavedExperiences();
      return localExperiences.filter(exp => 
        exp.category?.toLowerCase() === categoryObj.name.toLowerCase()
      );
    }
    
    return data.map(mapDbExperienceToModel);
  } catch (err) {
    console.error('Error loading experiences by category:', err);
    const localExperiences = getSavedExperiences();
    const categoryObj = categories.find(cat => cat.id === categoryId);
    return localExperiences.filter(exp => 
      categoryObj && exp.category?.toLowerCase() === categoryObj.name.toLowerCase()
    );
  }
};

const Index = () => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load featured experiences
        const { data: experiences, error: expError } = await supabase
          .from('experiences')
          .select('*')
          .eq('featured', true)
          .limit(3);

        if (expError) throw expError;
        
        const transformedExperiences = experiences?.map(exp => ({
          id: exp.id,
          title: exp.title,
          description: exp.description,
          imageUrl: exp.image_url,
          price: exp.price,
          location: exp.location,
          duration: exp.duration,
          participants: exp.participants.toString(),
          date: exp.date,
          category: exp.category,
          nicheCategory: exp.niche_category,
          trending: exp.trending || false,
          featured: exp.featured || false,
          romantic: exp.romantic || false,
          adventurous: exp.adventurous || false,
          group: exp.group_activity || false
        })) || [];
        
        setFeaturedExperiences(transformedExperiences);

        // Load categories
        const { data: cats, error: catError } = await supabase
          .from('company_pages')
          .select('*')
          .eq('type', 'category')
          .limit(6);

        if (catError) throw catError;
        
        const transformedCategories = cats?.map(cat => ({
          id: cat.id,
          name: cat.title,
          description: cat.meta_description,
          imageUrl: (cat.content as { image_url?: string })?.image_url || '',
          icon: Gift
        })) || [];
        
        setCategories(transformedCategories);
      } catch (error) {
        console.error('Error loading data:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main className="pt-20 md:pt-24">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <img
          src="https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop"
          alt="Hero"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-6">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full mb-4">
            <Gift className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Unforgettable Experiences
          </h1>
          <p className="max-w-2xl text-white/80 text-lg mb-8">
            Create lasting memories with unique experiences tailored just for you
          </p>
          <div className="flex gap-4">
            <Link to="/experiences">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">
                Explore Experiences
              </Button>
            </Link>
            <Link to="/gift-personalizer">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Gift an Experience
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Experiences */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Experiences</h2>
        {hasError ? (
          <p className="text-center text-red-500">
            Failed to load experiences. Please try again later.
          </p>
        ) : isLoading ? (
          <div className="flex justify-center items-center p-10">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredExperiences.map((experience) => (
              <ExperienceCard key={experience.id} experience={experience} />
            ))}
          </div>
        )}
      </section>

      {/* Categories */}
      <section className="bg-secondary/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Explore by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categories/${category.id}`}
                className="group relative h-64 rounded-xl overflow-hidden"
              >
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-white/80">{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Experiences */}
      <section ref={ref} className="container max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className={cn(
          'space-y-16 transition-all duration-700',
          isInView ? 'opacity-100' : 'opacity-0 translate-y-8'
        )}>
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-medium mb-6">Why Choose Experiences?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Research shows that experiences create stronger emotional connections and more lasting happiness than material possessions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-secondary/30 p-8 rounded-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Gift className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-medium mb-4">Experience Gifts</h3>
              <ul className="space-y-4">
                {[
                  'Creates lasting memories and stories to share',
                  'No physical clutter – only emotional richness',
                  'Appreciation increases as memories are cherished',
                  'Deepens relationships through shared moments',
                ].map((point, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 mt-0.5 text-primary" aria-hidden="true" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
