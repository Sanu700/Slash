
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

// Re-export the experiences array to maintain compatibility
import { experiences } from './data/experiences';

export {
  getAllExperiences,
  getExperiencesByCategory,
  getTrendingExperiences,
  getFeaturedExperiences,
  getExperienceById,
  getSavedExperiences,
  useExperiencesManager,
  experiences
};

// Re-export types and other data
// Using import * as syntax to avoid name conflicts
import { Experience, CartItem } from './data/types';
import * as categoriesModule from './data/categories';
import * as nicheCategoriesModule from './data/nicheCategories';

export { Experience, CartItem };
export const categories = categoriesModule.categories;
export const nicheCategories = nicheCategoriesModule.nicheCategories;
