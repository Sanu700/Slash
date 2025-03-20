
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
}
