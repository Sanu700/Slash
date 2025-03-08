import { Experience as ExperienceType } from './types';

// Default/initial experiences data
export const defaultExperiences: ExperienceType[] = [
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

// For backwards compatibility and to ensure the imported experiences are available
// This exports the global experiences from index.ts
export { globalExperiences as experiences } from './index';

// Re-export the Experience type
export type Experience = ExperienceType;
