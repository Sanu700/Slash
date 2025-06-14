import { supabase } from '@/lib/supabase';
import { Provider } from '@/lib/data/types';
import { toast } from 'sonner';

export async function submitProviderApplication(formData: Omit<Provider, 'id' | 'status' | 'experiences' | 'rating' | 'joinDate'>) {
  try {
    // First, ensure we have a session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new Error('Authentication required');
    }

    if (!session) {
      throw new Error('Please sign in to submit an application');
    }

    // Create a new provider record
    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .insert({
        company_name: formData.companyName,
        email: formData.email,
        contact_no: formData.contactNo,
        location: formData.location,
        status: 'pending',
        join_date: new Date().toISOString(),
        experiences: 0,
        rating: 0,
      })
      .select()
      .single();

    if (providerError) {
      console.error('Provider creation error:', providerError);
      throw new Error(providerError.message || 'Failed to create provider record');
    }

    // If there are experience details, create an experience record
    if (formData.experienceDetails) {
      const { error: experienceError } = await supabase
        .from('experiences')
        .insert({
          provider_id: providerData.id,
          title: formData.experienceDetails.name,
          description: formData.experienceDetails.description,
          image_url: formData.experienceDetails.image,
          price: parseFloat(formData.experienceDetails.price),
          location: formData.experienceDetails.location,
          duration: formData.experienceDetails.duration,
          participants: formData.experienceDetails.participants,
          date: formData.experienceDetails.date,
          category: formData.experienceDetails.category,
          status: 'pending'
        });

      if (experienceError) {
        console.error('Experience creation error:', experienceError);
        // If experience creation fails, delete the provider record
        await supabase.from('providers').delete().eq('id', providerData.id);
        throw new Error(experienceError.message || 'Failed to create experience record');
      }
    }

    toast.success('Application submitted successfully!');
    return { success: true, data: providerData };
  } catch (error: any) {
    console.error('Error submitting provider application:', error);
    toast.error(error.message || 'Failed to submit application. Please try again.');
    return { success: false, error };
  }
}

export async function getProviders() {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .order('join_date', { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching providers:', error);
    return { success: false, error };
  }
}

export async function updateProviderStatus(providerId: string, status: Provider['status']) {
  try {
    const { error } = await supabase
      .from('providers')
      .update({ status })
      .eq('id', providerId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating provider status:', error);
    return { success: false, error };
  }
}

export async function getProviderDetails(providerId: string) {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select(`
        *,
        experiences (*)
      `)
      .eq('id', providerId)
      .single();

    if (error) throw error;

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching provider details:', error);
    return { success: false, error };
  }
} 