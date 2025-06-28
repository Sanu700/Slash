import { Experience } from "./types";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
      .select('id, title, description, image_url, price, location, latitude, longitude, duration, participants, date, category, niche_category, trending, featured, romantic, adventurous, group_activity')
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
        .select('id, title, description, image_url, price, location, latitude, longitude, duration, participants, date, category, niche_category, trending, featured, romantic, adventurous, group_activity')
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
  latitude: item.latitude,
  longitude: item.longitude,
  duration: item.duration,
  participants: item.participants.toString(),
  date: item.date,
  category: item.category,
  nicheCategory: item.niche_category,
  trending: item.trending || false,
  featured: item.featured || false,
  romantic: item.romantic || false,
  adventurous: item.adventurous || false,
  group: item.group_activity || false,
  coordinates: (item.latitude != null && item.longitude != null)
    ? { lat: item.latitude, lng: item.longitude }
    : undefined
});

// This function checks if there are saved experiences in localStorage for fallback
export const getSavedExperiences = (): Experience[] => {
  try {
    const saved = localStorage.getItem('experiences');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error retrieving saved experiences:', error);
    return [];
  }
};

// Get all experiences
export const getAllExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('id, title, description, image_url, price, location, latitude, longitude, duration, participants, date, category, niche_category, trending, featured, romantic, adventurous, group_activity');
    
    if (error) throw error;
    
    const experiences = data.map(mapDbExperienceToModel);
    // Always update localStorage with the latest data
    localStorage.setItem('experiences', JSON.stringify(experiences));
    return experiences;
  } catch (error) {
    console.error('Error fetching experiences:', error);
    // Only use localStorage as a fallback if Supabase fetch fails
    return getSavedExperiences();
  }
};

// Get trending experiences
export const getTrendingExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('id, title, description, image_url, price, location, latitude, longitude, duration, participants, date, category, niche_category, trending, featured, romantic, adventurous, group_activity')
      .eq('trending', true)
      .limit(3);
    
    if (error) throw error;
    
    return data.map(mapDbExperienceToModel);
  } catch (error) {
    console.error('Error fetching trending experiences:', error);
    return [];
  }
};

// Get featured experiences
export const getFeaturedExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('id, title, description, image_url, price, location, latitude, longitude, duration, participants, date, category, niche_category, trending, featured, romantic, adventurous, group_activity')
      .eq('featured', true)
      .limit(3);
    
    if (error) throw error;
    
    return data.map(mapDbExperienceToModel);
  } catch (error) {
    console.error('Error fetching featured experiences:', error);
    return [];
  }
};

// Get experience by ID
export const getExperienceById = async (id: string): Promise<Experience | null> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('id, title, description, image_url, price, location, latitude, longitude, duration, participants, date, category, niche_category, trending, featured, romantic, adventurous, group_activity')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return mapDbExperienceToModel(data);
  } catch (error) {
    console.error('Error fetching experience:', error);
    return null;
  }
};

// Get experiences by category
export const getExperiencesByCategory = async (categoryId: string): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('id, title, description, image_url, price, location, latitude, longitude, duration, participants, date, category, niche_category, trending, featured, romantic, adventurous, group_activity')
      .eq('category', categoryId);
    
    if (error) throw error;
    
    return data.map(mapDbExperienceToModel);
  } catch (error) {
    console.error('Error fetching experiences by category:', error);
    return [];
  }
};

// Add a new experience
export const addExperience = async (experience: Omit<Experience, 'id'>): Promise<Experience | null> => {
  try {
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
      
    if (error) throw error;
    
    return mapDbExperienceToModel(data);
  } catch (error) {
    console.error('Error adding experience:', error);
    toast.error('Failed to add experience');
    return null;
  }
};

// Update an existing experience
export const updateExperience = async (id: string, updates: Partial<Experience>): Promise<boolean> => {
  try {
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
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error updating experience:', error);
    toast.error('Failed to update experience');
    return false;
  }
};

// Delete an experience
export const deleteExperience = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error deleting experience:', error);
    toast.error('Failed to delete experience');
    return false;
  }
};
