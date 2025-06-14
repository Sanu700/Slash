export type ProviderStatus = 'pending' | 'active' | 'inactive' | 'suspended';
export type ExperienceStatus = 'pending' | 'active' | 'inactive';

export interface Provider {
  id: string;
  company_name: string;
  email: string;
  contact_no: string;
  location: string;
  status: ProviderStatus;
  join_date: string;
  experiences: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  image_url: string;
  price: number;
  location: string;
  duration: string;
  participants: string;
  date: string;
  status: ExperienceStatus;
  created_at: string;
  updated_at: string;
  // Category flags
  adventurous: boolean;
  dining: boolean;
  wellness: boolean;
  cultural: boolean;
  entertainment: boolean;
  sports: boolean;
  educational: boolean;
  romantic: boolean;
  family: boolean;
  luxury: boolean;
  // Additional fields that might exist in the database
  featured?: boolean;
  group_activity?: boolean;
}

export interface Database {
  public: {
    Tables: {
      providers: {
        Row: Provider;
        Insert: Omit<Provider, 'id' | 'created_at' | 'updated_at' | 'experiences' | 'rating' | 'join_date'>;
        Update: Partial<Omit<Provider, 'id' | 'created_at' | 'updated_at'>>;
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Experience, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      provider_status: ProviderStatus;
      experience_status: ExperienceStatus;
    };
  };
} 