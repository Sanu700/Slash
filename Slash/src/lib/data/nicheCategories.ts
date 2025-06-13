
import { Music, Camera, Utensils, Plane, Palette, BookOpen, Shirt, HeartPulse, Landmark, Briefcase, Anchor, Dumbbell, Leaf, Coffee, Wine } from "lucide-react";

export interface NicheCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
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
