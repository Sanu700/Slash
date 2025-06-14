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
    personality: string;
    lifestyle: string;
    specific: string;
  };
}
