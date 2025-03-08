
export * from './types';
export * from './categories';
export * from './nicheCategories';
export * from './experiences';

// This is the main data management layer that will be used by the application
import { experiences as defaultExperiences, Experience } from './experiences';
import { categories as defaultCategories } from './categories';
import { nicheCategories as defaultNicheCategories } from './nicheCategories';
import { useState, useEffect } from 'react';

// Create a data manager that loads experiences from localStorage or external source
// and provides methods to update them

// This function checks if there are saved experiences in localStorage
// If not, it uses the default experiences
const getSavedExperiences = (): Experience[] => {
  const saved = localStorage.getItem('experiences');
  return saved ? JSON.parse(saved) : defaultExperiences;
};

// This hook manages the experiences data
export const useExperiencesManager = () => {
  const [experiences, setExperiences] = useState<Experience[]>(getSavedExperiences());

  // Save experiences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('experiences', JSON.stringify(experiences));
  }, [experiences]);

  // Add a new experience
  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience = {
      ...experience,
      id: `exp${Date.now()}` // Generate a unique ID
    };
    setExperiences([...experiences, newExperience as Experience]);
    return newExperience;
  };

  // Update an existing experience
  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences(
      experiences.map(exp => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  // Delete an experience
  const deleteExperience = (id: string) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  // Reset to default experiences
  const resetExperiences = () => {
    setExperiences(defaultExperiences);
    localStorage.removeItem('experiences');
  };

  // Import experiences from JSON
  const importExperiences = (jsonString: string) => {
    try {
      const importedExperiences = JSON.parse(jsonString);
      if (Array.isArray(importedExperiences)) {
        setExperiences(importedExperiences);
        return { success: true, message: 'Experiences imported successfully' };
      }
      return { success: false, message: 'Invalid format: expected an array' };
    } catch (error) {
      return { 
        success: false, 
        message: `Error parsing JSON: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  };

  // Export experiences to JSON
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
