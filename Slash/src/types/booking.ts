export interface User {
  id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  address: string;
  phone: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  category: string;
  image_url: string;
  participants: string;
  date: string;
  created_at: string;
  updated_at: string;
  adventurous: boolean;
  featured: boolean;
  group_activity: boolean;
}

export interface BookingFormData {
  experienceId: string;
  date: Date;
  numberOfParticipants: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
} 