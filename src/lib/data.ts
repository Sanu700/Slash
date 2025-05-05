
// This is a bridge file to maintain backward compatibility
// It re-exports functions from the proper locations

import { 
  getAllExperiences,
  getExperiencesByCategory,
  getTrendingExperiences,
  getFeaturedExperiences,
  getExperienceById,
  getSavedExperiences,
  useExperiencesManager
} from './data/index';

// Import categories and nicheCategories
import { categories } from './data/categories';
import { nicheCategories } from './data/nicheCategories';

// Re-export them
export {
  getAllExperiences,
  getExperiencesByCategory,
  getTrendingExperiences,
  getFeaturedExperiences,
  getExperienceById,
  getSavedExperiences,
  useExperiencesManager,
  categories,
  nicheCategories
};

// Re-export types
import type { Experience, CartItem } from './data/types';
export type { Experience, CartItem };
