
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
    imageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/2e/55/b3/a4/michelin-2025.jpg",
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
    imageUrl: "https://i0.wp.com/www.theluxeinsider.com/wp-content/uploads/2023/10/superyach-2.jpg?fit=1200%2C800&ssl=1",
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
    imageUrl: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/12/1a/98/c5.jpg",
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
    imageUrl: "https://www.winedering.com/uploads/travels/2890/big/degustazione-al-wine-bar.jpg.webp",
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
    imageUrl: "https://tattvaspa.com/wp-content/uploads/2023/07/Spa-Experience-.jpg",
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
    imageUrl: "https://activity-superstore-res.cloudinary.com/image/upload/f_auto/v1671188246/web/products/atup/atup01",
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
    imageUrl: "https://i.ontraport.com/224876.95b4848a200233c4130d3271e852c2a1.JPEG",
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
  },
  {
    id: "exp9",
    title: "Urban Street Art Tour & Workshop",
    description: "Explore local street art scenes and create your own piece with professional artists.",
    imageUrl: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8",
    price: 15999,
    location: "Brooklyn, NY",
    duration: "6 hours",
    participants: "1 person",
    date: "Weekends",
    category: "art",
    nicheCategory: "Urban Culture",
    romantic: false,
    adventurous: false,
    group: true
  },
  {
    id: "exp10", 
    title: "Gourmet Truffle Hunting",
    description: "Join expert hunters and their trained dogs to find rare truffles, followed by a cooking class.",
    imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    price: 35999,
    location: "Tuscany, Italy",
    duration: "Full day",
    participants: "2-4 people",
    date: "Seasonal",
    category: "food",
    nicheCategory: "Culinary Adventures",
    romantic: true,
    adventurous: false,
    group: true
  },
  {
    id: "exp11",
    title: "Ice Climbing Adventure",
    description: "Scale frozen waterfalls with professional guides in a stunning winter landscape.",
    imageUrl: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d",
    price: 29999,
    location: "Banff, Canada",
    duration: "8 hours",
    participants: "1-2 people",
    date: "Winter season",
    category: "adventure",
    nicheCategory: "Extreme Sports",
    romantic: false,
    adventurous: true,
    group: false
  },
  {
    id: "exp12",
    title: "Private Island Glamping",
    description: "Luxury camping experience on a private island with chef-prepared meals.",
    imageUrl: "https://images.unsplash.com/photo-1517824806704-9040b037703b",
    price: 89999,
    location: "Maldives",
    duration: "2 days",
    participants: "2 people",
    date: "Year-round",
    category: "luxury",
    nicheCategory: "Exclusive Retreats",
    romantic: true,
    adventurous: false,
    group: false
  },
  {
    id: "exp13",
    title: "Zero Gravity Flight",
    description: "Experience weightlessness in a specially modified aircraft used by astronauts.",
    imageUrl: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7",
    price: 65999,
    location: "Orlando, FL",
    duration: "5 hours",
    participants: "1 person",
    date: "Monthly",
    category: "unique",
    nicheCategory: "Space & Aviation",
    romantic: false,
    adventurous: true,
    group: true
  },
  {
    id: "exp14",
    title: "Ancient Tea Ceremony",
    description: "Traditional tea ceremony experience with a master in a historic temple.",
    imageUrl: "https://images.unsplash.com/photo-1545579133-99bb5ab189bd",
    price: 18999,
    location: "Kyoto, Japan",
    duration: "3 hours",
    participants: "1-4 people",
    date: "Daily",
    category: "cultural",
    nicheCategory: "Traditional Arts",
    romantic: false,
    adventurous: false,
    group: true
  },
  {
    id: "exp15",
    title: "Arctic Wildlife Photography",
    description: "Photograph polar bears and northern lights with professional guidance.",
    imageUrl: "https://images.unsplash.com/photo-1517783999520-f068d7431a60",
    price: 75999,
    location: "Churchill, Canada",
    duration: "3 days",
    participants: "1 person",
    date: "Winter only",
    category: "photography",
    nicheCategory: "Wildlife Photography",
    romantic: false,
    adventurous: true,
    group: true
  },
  {
    id: "exp16",
    title: "Volcano Helicopter Tour",
    description: "Private helicopter tour over active volcanoes with a geology expert.",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
    price: 45999,
    location: "Big Island, Hawaii",
    duration: "2 hours",
    participants: "2-4 people",
    date: "Weather dependent",
    category: "adventure",
    nicheCategory: "Aerial Tours",
    romantic: true,
    adventurous: true,
    group: false
  },
  {
    id: "exp17",
    title: "Michelin Star Cooking Class",
    description: "Private cooking session with a Michelin-starred chef in their restaurant kitchen.",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d",
    price: 55999,
    location: "Paris, France",
    duration: "6 hours",
    participants: "1-2 people",
    date: "Limited availability",
    category: "food",
    nicheCategory: "Fine Dining",
    romantic: true,
    adventurous: false,
    group: false
  },
  {
    id: "exp18",
    title: "Desert Astronomy Night",
    description: "Stargazing in the desert with professional astronomers and high-powered telescopes.",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
    price: 19999,
    location: "Atacama Desert, Chile",
    duration: "6 hours",
    participants: "1 person",
    date: "Clear nights only",
    category: "science",
    nicheCategory: "Astronomy",
    romantic: true,
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
export const getSavedExperiences = (): Experience[] => {
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
