export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: Date;
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
  max_participants: number;
  available_dates: string[];
  created_at: string;
  updated_at: string;
  adventurous: boolean;
  featured: boolean;
  group_activity: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  experienceId: string;
  date: Date;
  numberOfParticipants: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: 'card' | 'bank_transfer';
  createdAt: Date;
}

export interface BookingFormData {
  experienceId: string;
  bookingId?: string;
  userId?: string;
  date: Date;
  numberOfParticipants: number;
  totalPrice?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
} 