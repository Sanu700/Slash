
// This is a bridge file to maintain backward compatibility
// It re-exports functions from the proper locations

import { 
  getAllExperiences,
  getExperiencesByCategory,
  getTrendingExperiences,
  getFeaturedExperiences,
  getExperienceById,
  getSavedExperiences
} from './data/index';

export {
  getAllExperiences,
  getExperiencesByCategory,
  getTrendingExperiences,
  getFeaturedExperiences,
  getExperienceById,
  getSavedExperiences
};

// Re-export types and other data
export * from './data/types';
export * from './data/categories';
export * from './data/nicheCategories';
