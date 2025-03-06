
import { Gift, MapPin, Users, Clock, Calendar } from "lucide-react";

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
  trending?: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: any;
}

// Cart related types
export interface CartItem {
  experienceId: string;
  quantity: number;
}

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
    featured: true
  },
  {
    id: "exp2",
    title: "Michelin Star Dining",
    description: "Experience culinary excellence with a 7-course tasting menu at an award-winning restaurant.",
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop",
    price: 28999,
    location: "New York, NY",
    duration: "3 hours",
    participants: "2 people",
    date: "Available weekdays",
    category: "dining",
    trending: true
  },
  {
    id: "exp3",
    title: "Private Yacht Sunset Cruise",
    description: "Cruise along the coast on a private yacht with champagne and hors d'oeuvres.",
    imageUrl: "https://images.unsplash.com/photo-1560507074-b9eb43faab00?q=80&w=2787&auto=format&fit=crop",
    price: 41999,
    location: "Miami, FL",
    duration: "4 hours",
    participants: "Up to 6 people",
    date: "Seasonal",
    category: "luxury",
    featured: true
  },
  {
    id: "exp4",
    title: "Helicopter City Tour",
    description: "See the city from above with a private helicopter tour over iconic landmarks.",
    imageUrl: "https://images.unsplash.com/photo-1506974210756-8e1b8985d348?q=80&w=2574&auto=format&fit=crop",
    price: 33999,
    location: "Los Angeles, CA",
    duration: "1 hour",
    participants: "3 people",
    date: "Available daily",
    category: "adventure",
    trending: true
  },
  {
    id: "exp5",
    title: "Wine Tasting Experience",
    description: "Guided tour of premium vineyards with exclusive tastings and pairings.",
    imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=2670&auto=format&fit=crop",
    price: 15999,
    location: "Sonoma, CA",
    duration: "5 hours",
    participants: "2 people",
    date: "Weekends",
    category: "dining",
    featured: true
  },
  {
    id: "exp6",
    title: "Spa Retreat Day",
    description: "Full day of relaxation with massage, facial treatments, and thermal baths.",
    imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2670&auto=format&fit=crop",
    price: 23999,
    location: "Sedona, AZ",
    duration: "Full day",
    participants: "1 person",
    date: "Available daily",
    category: "wellness",
    trending: true
  },
  {
    id: "exp7",
    title: "Supercar Track Day",
    description: "Drive exotic supercars on a professional race track with professional instruction.",
    imageUrl: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?q=80&w=2574&auto=format&fit=crop",
    price: 49999,
    location: "Austin, TX",
    duration: "4 hours",
    participants: "1 person",
    date: "Weekends",
    category: "adventure"
  },
  {
    id: "exp8",
    title: "Photography Workshop",
    description: "Learn professional photography techniques in stunning natural settings.",
    imageUrl: "https://images.unsplash.com/photo-1520549233664-03f65c1d1327?q=80&w=2574&auto=format&fit=crop",
    price: 20999,
    location: "Yosemite, CA",
    duration: "8 hours",
    participants: "1 person",
    date: "Seasonal",
    category: "learning"
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
