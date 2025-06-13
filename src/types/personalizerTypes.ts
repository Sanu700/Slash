export type QuestionStep = 'basics' | 'interests' | 'preferences' | 'social' | 'results';

export interface FormData {
  recipient: string;
  city: string;
  relationship: string;
  customRelationship: string;
  occasion: string;
  customOccasion: string;
  budget: string;
  budgetRange: [number, number];
  interests: string[];
  preferences: {
    adventurous: number;
    social: number;
    relaxation: number;
    learning: number;
  };
  socialLinks: {
    instagram: string;
    facebook: string;
    amazon: string;
  };
}
