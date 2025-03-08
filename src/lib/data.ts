import { Gift, MapPin, Users, Clock, Calendar, Music, Camera, Utensils, Plane, Palette, BookOpen, Shirt, HeartPulse, Landmark, Briefcase, Anchor, Dumbbell, Leaf, Coffee, Wine } from "lucide-react";

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
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: any;
}

export interface NicheCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
}

export interface CartItem {
  experienceId: string;
  quantity: number;
}

export const nicheCategories: NicheCategory[] = [
  {
    id: "niche1",
    name: "Music & Arts",
    description: "Experiences for music and art enthusiasts",
    icon: Music
  },
  {
    id: "niche2",
    name: "Photography",
    description: "Experiences for photography enthusiasts",
    icon: Camera
  },
  {
    id: "niche3",
    name: "Culinary Arts",
    description: "Experiences for food and cooking enthusiasts",
    icon: Utensils
  },
  {
    id: "niche4",
    name: "Luxury Escapes",
    description: "Premium getaway experiences",
    icon: Plane
  },
  {
    id: "niche5",
    name: "Creative Workshops",
    description: "Hands-on creative experiences",
    icon: Palette
  },
  {
    id: "niche6",
    name: "Literature & History",
    description: "Experiences for book and history lovers",
    icon: BookOpen
  },
  {
    id: "niche7",
    name: "Fashion & Style",
    description: "Experiences for fashion enthusiasts",
    icon: Shirt
  },
  {
    id: "niche8",
    name: "Wellness & Spirituality",
    description: "Experiences for mind and body wellness",
    icon: HeartPulse
  },
  {
    id: "niche9",
    name: "Heritage & Culture",
    description: "Experiences to explore local culture and heritage",
    icon: Landmark
  },
  {
    id: "niche10",
    name: "Business & Professional",
    description: "Professional development experiences",
    icon: Briefcase
  },
  {
    id: "niche11",
    name: "Ocean & Marine",
    description: "Experiences for ocean and marine enthusiasts",
    icon: Anchor
  },
  {
    id: "niche12",
    name: "Sports & Fitness",
    description: "Active and athletic experiences",
    icon: Dumbbell
  },
  {
    id: "niche13",
    name: "Eco & Sustainability",
    description: "Environmentally conscious experiences",
    icon: Leaf
  },
  {
    id: "niche14",
    name: "Coffee Culture",
    description: "Experiences for coffee enthusiasts",
    icon: Coffee
  },
  {
    id: "niche15",
    name: "Wine & Spirits",
    description: "Experiences for wine and spirits connoisseurs",
    icon: Wine
  }
];

export const experiences: Experience[] = [
  {
    id: "exp1",
    title: "Hot Air Balloon Ride",
    description: "Soar above breathtaking landscapes in a majestic hot air balloon at sunrise.",
    imageUrl: "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1974&auto=format&fit=crop",
    price: 24999,
    location: "Napa Valley, CA",
    duration: "3 hours",
    participants: "2 people",
    date: "Available year-round",
    category: "adventure",
    trending: true,
    featured: true,
    nicheCategory: "Luxury Escapes",
    romantic: true,
    adventurous: true,
    group: false
  },
  {
    id: "exp2",
    title: "Michelin Star Dining",
    description: "Experience culinary excellence with a 7-course tasting menu at an award-winning restaurant.",
    imageUrl: "https://example.com/michelin-dining-image.jpg",
    price: 28999,
    location: "New York, NY",
    duration: "3 hours",
    participants: "2 people",
    date: "Available weekdays",
    category: "dining",
    trending: true,
    nicheCategory: "Culinary Arts",
    romantic: true,
    adventurous: false,
    group: false
  },
  {
    id: "exp3",
    title: "Private Yacht Sunset Cruise",
    description: "Cruise along the coast on a private yacht with champagne and hors d'oeuvres.",
    imageUrl: "https://example.com/yacht-sunset-image.jpg",
    price: 41999,
    location: "Miami, FL",
    duration: "4 hours",
    participants: "Up to 6 people",
    date: "Seasonal",
    category: "luxury",
    featured: true,
    nicheCategory: "Luxury Escapes",
    romantic: true,
    adventurous: false,
    group: true
  },
  {
    id: "exp4",
    title: "Helicopter City Tour",
    description: "See the city from above with a private helicopter tour over iconic landmarks.",
    imageUrl: "https://example.com/helicopter-tour-image.jpg",
    price: 33999,
    location: "Los Angeles, CA",
    duration: "1 hour",
    participants: "3 people",
    date: "Available daily",
    category: "adventure",
    trending: true,
    nicheCategory: "Luxury Escapes",
    romantic: false,
    adventurous: true,
    group: true
  },
  {
    id: "exp5",
    title: "Wine Tasting Experience",
    description: "Guided tour of premium vineyards with exclusive tastings and pairings.",
    imageUrl: "https://example.com/wine-tasting-image.jpg",
    price: 15999,
    location: "Sonoma, CA",
    duration: "5 hours",
    participants: "2 people",
    date: "Weekends",
    category: "dining",
    featured: true,
    nicheCategory: "Wine & Spirits",
    romantic: true,
    adventurous: false,
    group: false
  },
  {
    id: "exp6",
    title: "Spa Retreat Day",
    description: "Full day of relaxation with massage, facial treatments, and thermal baths.",
    imageUrl: "https://example.com/spa-retreat-image.jpg",
    price: 23999,
    location: "Sedona, AZ",
    duration: "Full day",
    participants: "1 person",
    date: "Available daily",
    category: "wellness",
    trending: true,
    nicheCategory: "Wellness & Spirituality",
    romantic: false,
    adventurous: false,
    group: false
  },
  {
    id: "exp7",
    title: "Supercar Track Day",
    description: "Drive exotic supercars on a professional race track with professional instruction.",
    imageUrl: "https://example.com/supercar-track-image.jpg",
    price: 49999,
    location: "Austin, TX",
    duration: "4 hours",
    participants: "1 person",
    date: "Weekends",
    category: "adventure",
    nicheCategory: "Sports & Fitness",
    romantic: false,
    adventurous: true,
    group: false
  },
  {
    id: "exp8",
    title: "Photography Workshop",
    description: "Learn professional photography techniques in stunning natural settings.",
    imageUrl: "https://example.com/photography-workshop-image.jpg",
    price: 20999,
    location: "Yosemite, CA",
    duration: "8 hours",
    participants: "1 person",
    date: "Seasonal",
    category: "learning",
    nicheCategory: "Photography",
    romantic: false,
    adventurous: false,
    group: true
  }
];

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Adventure",
    description: "Thrilling experiences for adrenaline seekers",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2688&auto=format&fit=crop",
    icon: Users
  },
  {
    id: "cat2",
    name: "Dining",
    description: "Exceptional culinary experiences",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop",
    icon: Gift
  },
  {
    id: "cat3",
    name: "Wellness",
    description: "Relaxation and rejuvenation",
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2678&auto=format&fit=crop",
    icon: Calendar
  },
  {
    id: "cat4",
    name: "Luxury",
    description: "Premium exclusive experiences",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop",
    icon: MapPin
  },
  {
    id: "cat5",
    name: "Learning",
    description: "Educational and skill-building activities",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2622&auto=format&fit=crop",
    icon: Clock
  }
];

// This is the main data management layer that will be used by the application
import { useState, useEffect } from 'react';

// Create a data manager that loads experiences from localStorage or external source
// and provides methods to update them

// This function checks if there are saved experiences in localStorage
// If not, it uses the default experiences
const getSavedExperiences = (): Experience[] => {
  const saved = localStorage.getItem('experiences');
  return saved ? JSON.parse(saved) : experiences;
};

// This hook manages the experiences data
export const useExperiencesManager = () => {
  const [experiencesState, setExperiencesState] = useState<Experience[]>(getSavedExperiences());

  // Save experiences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('experiences', JSON.stringify(experiencesState));
  }, [experiencesState]);

  // Add a new experience
  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience = {
      ...experience,
      id: `exp${Date.now()}` // Generate a unique ID
    };
    setExperiencesState([...experiencesState, newExperience as Experience]);
    return newExperience;
  };

  // Update an existing experience
  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiencesState(
      experiencesState.map(exp => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  // Delete an experience
  const deleteExperience = (id: string) => {
    setExperiencesState(experiencesState.filter(exp => exp.id !== id));
  };

  // Reset to default experiences
  const resetExperiences = () => {
    setExperiencesState(experiences);
    localStorage.removeItem('experiences');
  };

  // Import experiences from JSON
  const importExperiences = (jsonString: string) => {
    try {
      const importedExperiences = JSON.parse(jsonString);
      if (Array.isArray(importedExperiences)) {
        setExperiencesState(importedExperiences);
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
    return JSON.stringify(experiencesState, null, 2);
  };

  return {
    experiences: experiencesState,
    addExperience,
    updateExperience,
    deleteExperience,
    resetExperiences,
    importExperiences,
    exportExperiences
  };
};
