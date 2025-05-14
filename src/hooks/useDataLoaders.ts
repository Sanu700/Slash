import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Experience } from '@/lib/data';

export interface Booking {
  id: string;
  booking_date: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  items: {
    experience: Experience;
    quantity: number;
    price_at_booking: number;
  }[];
}

export const useBookingHistory = (userId: string | undefined) => {
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBookingHistory = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch bookings for the current user
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', userId)
          .order('booking_date', { ascending: false });
          
        if (bookingsError) {
          throw bookingsError;
        }
        
        // For each booking, fetch the items
        const bookings: Booking[] = [];
        
        for (const booking of bookingsData || []) {
          // Get booking items
          const { data: itemsData, error: itemsError } = await supabase
            .from('booking_items')
            .select('*')
            .eq('booking_id', booking.id);
          
          console.log('Booking ID:', booking.id, 'Booking Items:', itemsData, 'Error:', itemsError);
          
          if (itemsError) {
            console.error('Error loading booking items:', itemsError);
            continue;
          }
          
          // Get experience details for each item
          const items = [];
          
          for (const item of itemsData || []) {
            const { data: expData, error: expError } = await supabase
              .from('experiences')
              .select('*')
              .eq('id', item.experience_id)
              .single();
            
            console.log('Booking Item:', item, 'Experience Data:', expData, 'Error:', expError);
            
            if (!expError && expData) {
              const experience: Experience = {
                id: expData.id,
                title: expData.title,
                description: expData.description,
                imageUrl: expData.image_url,
                price: expData.price,
                location: expData.location,
                duration: expData.duration,
                participants: expData.participants,
                date: expData.date,
                category: expData.category,
                nicheCategory: expData.niche_category || undefined,
                trending: expData.trending || false,
                featured: expData.featured || false,
                romantic: expData.romantic || false,
                adventurous: expData.adventurous || false,
                group: expData.group_activity || false
              };
              
              items.push({
                experience,
                quantity: item.quantity,
                price_at_booking: item.price_at_booking
              });
            }
          }
          
          bookings.push({
            id: booking.id,
            booking_date: booking.booking_date,
            total_amount: booking.total_amount,
            status: booking.status,
            payment_method: booking.payment_method,
            items
          });
        }
        
        setBookingHistory(bookings);
      } catch (error) {
        console.error('Error loading booking history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBookingHistory();
  }, [userId]);

  return { bookingHistory, isLoading };
};

export const useWishlistExperiences = (userId: string | undefined) => {
  const [wishlistExperiences, setWishlistExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('wishlists')
          .select('experience_id, added_at')
          .eq('user_id', userId)
          .order('added_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Load experience details for each wishlist item
        if (data && data.length > 0) {
          const experiences = [];
          
          for (const item of data) {
            const { data: expData, error: expError } = await supabase
              .from('experiences')
              .select('*')
              .eq('id', item.experience_id)
              .single();
              
            if (!expError && expData) {
              const experience: Experience = {
                id: expData.id,
                title: expData.title,
                description: expData.description,
                imageUrl: expData.image_url,
                price: expData.price,
                location: expData.location,
                duration: expData.duration,
                participants: expData.participants,
                date: expData.date,
                category: expData.category,
                nicheCategory: expData.niche_category || undefined,
                trending: expData.trending || false,
                featured: expData.featured || false,
                romantic: expData.romantic || false,
                adventurous: expData.adventurous || false,
                group: expData.group_activity || false
              };
              
              experiences.push(experience);
            }
          }
          
          setWishlistExperiences(experiences);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWishlist();
  }, [userId]);

  return { wishlistExperiences, isLoading };
};

export const useRecentlyViewedExperiences = (userId: string | undefined) => {
  const [recentlyViewedExperiences, setRecentlyViewedExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecentlyViewed = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('viewed_experiences')
          .select('experience_id, viewed_at')
          .eq('user_id', userId)
          .order('viewed_at', { ascending: false })
          .limit(4);
          
        if (error) {
          throw error;
        }
        
        // Load experience details for each viewed experience
        if (data && data.length > 0) {
          const experiences = [];
          
          for (const item of data) {
            const { data: expData, error: expError } = await supabase
              .from('experiences')
              .select('*')
              .eq('id', item.experience_id)
              .single();
              
            if (!expError && expData) {
              const experience: Experience = {
                id: expData.id,
                title: expData.title,
                description: expData.description,
                imageUrl: expData.image_url,
                price: expData.price,
                location: expData.location,
                duration: expData.duration,
                participants: expData.participants,
                date: expData.date,
                category: expData.category,
                nicheCategory: expData.niche_category || undefined,
                trending: expData.trending || false,
                featured: expData.featured || false,
                romantic: expData.romantic || false,
                adventurous: expData.adventurous || false,
                group: expData.group_activity || false
              };
              
              experiences.push(experience);
            }
          }
          
          setRecentlyViewedExperiences(experiences);
        }
      } catch (error) {
        console.error('Error loading viewed experiences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRecentlyViewed();
  }, [userId]);

  return { recentlyViewedExperiences, isLoading };
};
