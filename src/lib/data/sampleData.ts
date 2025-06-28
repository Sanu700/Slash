import { Experience } from './types';

export const sampleExperiences: Experience[] = [
  {
    id: '1',
    title: 'Sunset Beach Yoga',
    description: 'Experience the perfect blend of tranquility and fitness with our sunset beach yoga session.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    price: 1500,
    location: 'Mumbai, Maharashtra',
    duration: '1.5 hours',
    participants: 'Max 15 people',
    date: 'Every Saturday',
    category: 'Wellness',
    coordinates: { lat: 19.0760, lng: 72.8777 }, // Mumbai coordinates
    trending: true
  },
  {
    id: '2',
    title: 'Heritage Walk in Old Delhi',
    description: 'Discover the rich history and culture of Old Delhi through this guided heritage walk.',
    imageUrl: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
    price: 800,
    location: 'Delhi',
    duration: '3 hours',
    participants: 'Max 20 people',
    date: 'Daily',
    category: 'Cultural',
    coordinates: { lat: 28.7041, lng: 77.1025 }, // Delhi coordinates
    featured: true
  },
  {
    id: '3',
    title: 'Cooking Class in Bangalore',
    description: 'Learn to cook authentic South Indian dishes from a local chef in their home kitchen.',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    price: 2000,
    location: 'Bangalore, Karnataka',
    duration: '4 hours',
    participants: 'Max 8 people',
    date: 'Weekends',
    category: 'Culinary',
    coordinates: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
    romantic: true
  },
  {
    id: '4',
    title: 'Adventure Trek in Manali',
    description: 'Embark on an exciting trek through the beautiful mountains of Manali.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    price: 3500,
    location: 'Manali, Himachal Pradesh',
    duration: '6 hours',
    participants: 'Max 12 people',
    date: 'Daily',
    category: 'Adventure',
    coordinates: { lat: 32.2432, lng: 77.1892 }, // Manali coordinates
    adventurous: true
  },
  {
    id: '5',
    title: 'Art Workshop in Jaipur',
    description: 'Create beautiful traditional Rajasthani art pieces under expert guidance.',
    imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800',
    price: 1200,
    location: 'Jaipur, Rajasthan',
    duration: '2.5 hours',
    participants: 'Max 10 people',
    date: 'Tuesday & Thursday',
    category: 'Creative',
    coordinates: { lat: 26.9124, lng: 75.7873 }, // Jaipur coordinates
    group: true
  },
  {
    id: '6',
    title: 'Photography Tour in Udaipur',
    description: 'Capture the beauty of Udaipur through your lens with professional photography guidance.',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    price: 2500,
    location: 'Udaipur, Rajasthan',
    duration: '5 hours',
    participants: 'Max 6 people',
    date: 'Daily',
    category: 'Creative',
    coordinates: { lat: 24.5854, lng: 73.7125 }, // Udaipur coordinates
    romantic: true
  }
];

// Function to add sample experiences to the database
export const addSampleExperiences = async () => {
  try {
    const { supabase } = await import('@/lib/supabase');
    
    for (const experience of sampleExperiences) {
      const { error } = await supabase
        .from('experiences')
        .insert({
          title: experience.title,
          description: experience.description,
          image_url: experience.imageUrl,
          price: experience.price,
          location: experience.location,
          duration: experience.duration,
          participants: experience.participants,
          date: experience.date,
          category: experience.category,
          featured: experience.featured || false,
          trending: experience.trending || false,
          adventurous: experience.adventurous || false
        });
      
      if (error) {
        console.error('Error adding sample experience:', error);
      }
    }
    
    console.log('Sample experiences added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding sample experiences:', error);
    return false;
  }
}; 