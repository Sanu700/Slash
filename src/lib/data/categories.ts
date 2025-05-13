
import { Activity, UtensilsCrossed, Leaf, Crown, BookOpen } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  icon: any;
}

export const categories: Category[] = [
  {
    id: "cat1",
    name: "Adventure",
    description: "Thrilling experiences for adrenaline seekers",
    imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=2688&auto=format&fit=crop",
    icon: Activity
  },
  {
    id: "cat2",
    name: "Dining",
    description: "Exceptional culinary experiences",
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop",
    icon: UtensilsCrossed
  },
  {
    id: "cat3",
    name: "Wellness",
    description: "Relaxation and rejuvenation",
    imageUrl: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2678&auto=format&fit=crop",
    icon: Leaf
  },
  {
    id: "cat4",
    name: "Luxury",
    description: "Premium exclusive experiences",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop",
    icon: Crown
  },
  {
    id: "cat5",
    name: "Learning",
    description: "Educational and skill-building activities",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2622&auto=format&fit=crop",
    icon: BookOpen
  }
];
