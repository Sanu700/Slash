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
  },
  {
    id: "exp9",
    title: "Desert Stargazing Retreat",
    description: "Observe celestial wonders with professional astronomers in a remote desert location with zero light pollution.",
    imageUrl: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=2578&auto=format&fit=crop",
    price: 18500,
    location: "Jaisalmer, Rajasthan",
    duration: "Overnight",
    participants: "2 people",
    date: "Available on clear nights",
    category: "adventure"
  },
  {
    id: "exp10",
    title: "Ancient Temple Meditation",
    description: "Find inner peace with guided meditation sessions in a centuries-old temple surrounded by nature.",
    imageUrl: "https://images.unsplash.com/photo-1609234500016-81afafa54181?q=80&w=2670&auto=format&fit=crop",
    price: 12999,
    location: "Hampi, Karnataka",
    duration: "4 hours",
    participants: "1 person",
    date: "Daily sessions",
    category: "wellness"
  },
  {
    id: "exp11",
    title: "Himalayan Homestay Experience",
    description: "Live with a local family in a remote Himalayan village, experiencing authentic cuisine and daily life.",
    imageUrl: "https://images.unsplash.com/photo-1606217057598-fe753187e473?q=80&w=2574&auto=format&fit=crop",
    price: 32500,
    location: "Spiti Valley, Himachal Pradesh",
    duration: "3 days",
    participants: "2 people",
    date: "Seasonal (May-September)",
    category: "adventure"
  },
  {
    id: "exp12",
    title: "Artisanal Coffee Masterclass",
    description: "Learn the art of coffee from bean selection to perfect brewing techniques with award-winning baristas.",
    imageUrl: "https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?q=80&w=2670&auto=format&fit=crop",
    price: 14999,
    location: "Coorg, Karnataka",
    duration: "6 hours",
    participants: "1 person",
    date: "Weekends",
    category: "learning"
  },
  {
    id: "exp13",
    title: "Heritage Palace Dinner",
    description: "Enjoy a royal multi-course dinner in a historic palace with traditional music and dance performances.",
    imageUrl: "https://images.unsplash.com/photo-1583396754091-11f775ec4121?q=80&w=2670&auto=format&fit=crop",
    price: 42500,
    location: "Udaipur, Rajasthan",
    duration: "4 hours",
    participants: "2 people",
    date: "Available year-round",
    category: "dining",
    featured: true
  },
  {
    id: "exp14",
    title: "Houseboat Backwater Cruise",
    description: "Navigate tranquil backwaters on a luxury houseboat with personal chef and panoramic views.",
    imageUrl: "https://images.unsplash.com/photo-1580551387343-5e98952dc0a3?q=80&w=2670&auto=format&fit=crop",
    price: 28999,
    location: "Alleppey, Kerala",
    duration: "1 day",
    participants: "2-4 people",
    date: "Year-round",
    category: "luxury",
    trending: true
  },
  {
    id: "exp15",
    title: "Wildlife Photography Safari",
    description: "Capture stunning wildlife photographs with expert guidance in one of India's premier national parks.",
    imageUrl: "https://images.unsplash.com/photo-1574068752483-06bbe6da7c02?q=80&w=2670&auto=format&fit=crop",
    price: 36999,
    location: "Ranthambore, Rajasthan",
    duration: "2 days",
    participants: "1 person",
    date: "October-June",
    category: "learning"
  },
  {
    id: "exp16",
    title: "Organic Farm-to-Table Cooking",
    description: "Harvest fresh ingredients and learn traditional cooking techniques in a scenic organic farm.",
    imageUrl: "https://images.unsplash.com/photo-1536184071535-78906f7172c2?q=80&w=2670&auto=format&fit=crop",
    price: 17500,
    location: "Manali, Himachal Pradesh",
    duration: "1 day",
    participants: "2 people",
    date: "Year-round",
    category: "dining"
  },
  {
    id: "exp17",
    title: "Private Beach Glamping",
    description: "Luxury camping on a secluded beach with gourmet meals, bonfires, and water activities.",
    imageUrl: "https://images.unsplash.com/photo-1531097517181-3de20fd3f05c?q=80&w=2574&auto=format&fit=crop",
    price: 38500,
    location: "Gokarna, Karnataka",
    duration: "2 days",
    participants: "2 people",
    date: "October-May",
    category: "luxury",
    trending: true
  },
  {
    id: "exp18",
    title: "Historical Architecture Walk",
    description: "Explore magnificent historical structures with an architectural historian revealing hidden stories and techniques.",
    imageUrl: "https://images.unsplash.com/photo-1598827121180-220024f25804?q=80&w=2670&auto=format&fit=crop",
    price: 11999,
    location: "Delhi",
    duration: "4 hours",
    participants: "2 people",
    date: "Weekends",
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
