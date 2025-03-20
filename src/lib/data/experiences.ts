
// This file contains the default experiences data that is used as a fallback
// when the database is not available or when running in development mode

import { Experience } from './types';

// Base set of experiences for local development and fallback
export const experiences: Experience[] = [
  {
    id: "e1",
    title: "Wine Tasting Tour",
    description: "Experience the finest wines with a guided tour through local vineyards. Learn about wine-making processes and enjoy tastings of premium selections.",
    imageUrl: "/placeholder.svg",
    price: 120,
    location: "Napa Valley",
    duration: "3 hours",
    participants: "1-8 people",
    date: "Available daily",
    category: "food",
    nicheCategory: "tasting",
    featured: true,
    trending: true,
    romantic: true
  },
  {
    id: "e2",
    title: "Skydiving Adventure",
    description: "Feel the ultimate rush with a tandem skydiving experience. Free fall from 12,000 feet with stunning panoramic views.",
    imageUrl: "/placeholder.svg",
    price: 299,
    location: "Santa Barbara",
    duration: "3 hours",
    participants: "1-4 people",
    date: "Weekends",
    category: "adventure",
    nicheCategory: "extreme",
    featured: false,
    trending: true,
    adventurous: true
  },
  {
    id: "e3",
    title: "Cooking Class with Chef Marco",
    description: "Learn to prepare authentic Italian cuisine with renowned Chef Marco. Create a complete three-course meal and enjoy it with paired wines.",
    imageUrl: "/placeholder.svg",
    price: 150,
    location: "San Francisco",
    duration: "4 hours",
    participants: "2-12 people",
    date: "Tuesday and Thursday evenings",
    category: "food",
    nicheCategory: "cooking",
    featured: true,
    group: true
  },
  {
    id: "e4",
    title: "Hot Air Balloon Ride",
    description: "Float gently above the landscape in a hot air balloon as the sun rises. Includes champagne breakfast after landing.",
    imageUrl: "/placeholder.svg",
    price: 275,
    location: "Sonoma County",
    duration: "3-4 hours",
    participants: "2-8 people",
    date: "Weather dependent, mornings only",
    category: "adventure",
    nicheCategory: "aerial",
    featured: true,
    romantic: true
  },
  {
    id: "e5",
    title: "Pottery Workshop",
    description: "Create your own ceramic masterpieces with guidance from expert potters. All materials provided, and pieces will be fired and available for pickup later.",
    imageUrl: "/placeholder.svg",
    price: 85,
    location: "Berkeley",
    duration: "2 hours",
    participants: "1-10 people",
    date: "Weekdays and Saturday mornings",
    category: "creative",
    nicheCategory: "crafts",
    featured: false,
    group: true
  },
  {
    id: "e6",
    title: "Sunset Sailing Cruise",
    description: "Cruise along the bay as the sun sets, offering spectacular views of the cityscape. Includes light appetizers and beverages.",
    imageUrl: "/placeholder.svg",
    price: 110,
    location: "San Francisco Bay",
    duration: "2 hours",
    participants: "2-20 people",
    date: "Daily, weather permitting",
    category: "relaxation",
    nicheCategory: "water",
    featured: true,
    romantic: true
  }
];
