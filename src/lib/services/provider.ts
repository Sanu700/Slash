import { supabase } from '@/lib/supabase';
import { Provider } from '@/lib/data/types';
import { toast } from 'sonner';

export async function submitProviderApplication(formData: Omit<Provider, 'id' | 'status' | 'experiences' | 'rating' | 'joinDate'>) {
  try {
    // Get the authenticated user's UID
    let userId = undefined;
    if (supabase.auth.getUser) {
      const { data: userData } = await supabase.auth.getUser();
      userId = userData?.user?.id;
    }
    // Upsert provider record with the user's UID as the ID
    console.log('DEBUG: userId for provider:', userId);
    const { data: providerData, error: providerError } = await supabase
      .from('providers')
      .upsert({
        id: userId, // Set provider ID to auth UID
        company_name: formData.companyName,
        email: formData.email,
        contact_no: formData.contactNo,
        location: formData.location,
        status: 'pending',
        join_date: new Date().toISOString(),
        experiences: 0,
        rating: 0,
      }, { onConflict: 'id' })
      .select()
      .single();
    console.log('DEBUG: providerData:', providerData, 'providerError:', providerError);

    if (providerError) throw providerError;

    // If there are experience details, create an experience record
    if (formData.experienceDetails) {
      const providerId = userId || providerData.id;
      const experienceInsert = {
        provider_id: providerId,
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
      };
      console.log('DEBUG: experienceInsert:', experienceInsert);
      const { error: experienceError, data: experienceData } = await supabase
        .from('experiences')
        .insert(experienceInsert);
      console.log('DEBUG: experienceInsert result:', experienceData, experienceError);
      if (experienceError) throw experienceError;
    }

    return { success: true, data: providerData };
  } catch (error) {
    console.error('Error submitting provider application:', error);
    toast.error('Failed to submit application. Please try again.');
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