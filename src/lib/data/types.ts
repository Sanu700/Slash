import { LucideIcon } from 'lucide-react';

export interface Experience {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  duration: string;
  participants: string;
  date: string;
  category: string;
  niche?: string;
  nicheCategory?: string;
  trending?: boolean;
  featured?: boolean;
  romantic?: boolean;
  adventurous?: boolean;
  group?: boolean;
  onClick?: () => void; // Add onClick property for ExperienceCard in Profile page
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: LucideIcon;
}

export interface NicheCategory {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface CartItem {
  experienceId: string;
  quantity: number;
  date?: string;
}

// Add this interface to properly type profile data
export interface ExtendedProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  phone?: string | null;
  address?: string | null;
  bio?: string | null;
}

export interface Provider {
  id: string;
  companyName: string;
  email: string;
  contactNo: string;
  location: string;
  joinDate: string;
  status: 'pending' | 'active' | 'inactive' | 'suspended';
  experiences: number;
  rating: number;
  experienceDetails?: {
    name: string;
    description: string;
    image: string | null;
    price: string;
    location: string;
    duration: string;
    participants: string;
    date: string;
    category: string;
  };
}
