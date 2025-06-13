
export type QuestionStep = 'basics' | 'interests' | 'preferences' | 'social' | 'results';

export interface FormData {
  recipient: string;
  relationship: string;
  occasion: string;
  budget: string;
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
