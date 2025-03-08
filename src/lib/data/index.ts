
import { useState, useEffect } from 'react';
import { categories } from './categories';
import { nicheCategories } from './nicheCategories';
import { defaultExperiences, Experience } from './experiences';
import { v4 as uuidv4 } from 'uuid';

export { categories, nicheCategories, Experience };
export { experiences } from './experiences';

// Add uuid dependency
// <lov-add-dependency>uuid@latest</lov-add-dependency>
// <lov-add-dependency>@types/uuid@latest</lov-add-dependency>

// Storage key for experiences
const STORAGE_KEY = 'slash_experiences';

// Global experiences store to ensure consistency across components
let globalExperiences: Experience[] = [...defaultExperiences];

// Load experiences from localStorage on app initialization
const loadInitialExperiences = () => {
  try {
    const storedExperiences = localStorage.getItem(STORAGE_KEY);
    if (storedExperiences) {
      globalExperiences = JSON.parse(storedExperiences);
    }
  } catch (error) {
    console.error('Error loading experiences from storage:', error);
  }
};

// Initialize on module load
loadInitialExperiences();

export const useExperiencesManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>(globalExperiences);

  // Function to update both local state and the global store
  const updateStore = (newExperiences: Experience[]) => {
    setExperiences(newExperiences);
    globalExperiences = newExperiences;
    
    // Persist to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newExperiences));
    } catch (error) {
      console.error('Error saving experiences to storage:', error);
    }
  };

  const addExperience = (experienceData: Omit<Experience, 'id'>) => {
    const newExperience = {
      ...experienceData,
      id: `exp-${uuidv4().slice(0, 8)}`,
    };
    
    const newExperiences = [...experiences, newExperience];
    updateStore(newExperiences);
    
    return newExperience;
  };

  const updateExperience = (id: string, data: Partial<Experience>) => {
    const experienceIndex = experiences.findIndex(exp => exp.id === id);
    
    if (experienceIndex !== -1) {
      const updatedExperiences = [...experiences];
      updatedExperiences[experienceIndex] = {
        ...updatedExperiences[experienceIndex],
        ...data
      };
      
      updateStore(updatedExperiences);
      return true;
    }
    
    return false;
  };

  const deleteExperience = (id: string) => {
    const filteredExperiences = experiences.filter(exp => exp.id !== id);
    updateStore(filteredExperiences);
  };

  const resetExperiences = () => {
    updateStore([...defaultExperiences]);
  };

  const importExperiences = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      if (!Array.isArray(parsedData)) {
        return { success: false, message: 'Invalid format: data must be an array' };
      }
      
      // Basic validation
      for (const item of parsedData) {
        if (!item.title || !item.description || !item.category) {
          return { success: false, message: 'Invalid data: experiences must have title, description, and category' };
        }
      }
      
      updateStore(parsedData);
      return { success: true, message: `Successfully imported ${parsedData.length} experiences` };
    } catch (error) {
      console.error('Import error:', error);
      return { success: false, message: 'Invalid JSON data' };
    }
  };

  const exportExperiences = () => {
    return JSON.stringify(experiences, null, 2);
  };

  return {
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    resetExperiences,
    importExperiences,
    exportExperiences
  };
};
