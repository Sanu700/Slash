import { Experience } from "./types";
import { supabase } from '@/lib/supabase';

// This is just a placeholder for type definitions
// All experience data will be fetched from Supabase
export const experiences: Experience[] = [];

/**
 * Get similar experiences based on category
 * @param categoryName The category to fetch similar experiences for
 * @param currentExperienceId The ID of the current experience to exclude
 * @param limit Maximum number of experiences to return
 * @returns Array of similar experiences
 */
export const getSimilarExperiences = async (
  categoryName: string,
  currentExperienceId: string,
  limit: number = 4
): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('category', categoryName)
      .neq('id', currentExperienceId)
      .limit(limit);
      
    if (error) {
      console.error("Error fetching similar experiences:", error.message);
      throw error;
    }
    
    if (!data || data.length === 0) {
      // If no experiences in same category, just get other experiences
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('experiences')
        .select('*')
        .neq('id', currentExperienceId)
        .limit(limit);
        
      if (fallbackError) {
        throw fallbackError;
      }
      
      return (fallbackData || []).map(mapDbExperienceToModel);
    }
    
    return data.map(mapDbExperienceToModel);
  } catch (error) {
    console.error('Error fetching similar experiences:', error);
    return [];
  }
};

// Helper function to map database experience to Experience model
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
  nicheCategory: item.niche_category || undefined,
  trending: item.trending || false,
  featured: item.featured || false,
  romantic: item.romantic || false,
  adventurous: item.adventurous || false,
  group: item.group_activity || false
});
