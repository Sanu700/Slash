import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import type { Database } from '@/types/database';

type ProviderApplication = {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  duration: number;
  participants: number;
  date: string;
  image_url: string | null;
  category: string | null;
  niche_category: string | null;
  trending: boolean;
  featured: boolean;
  romantic: boolean;
  adventurous: boolean;
  group_activity: boolean;
  created_at: string;
  provider: {
    company_name: string;
    email: string;
    contact_no: string;
  };
};

const ExperienceApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get all provider applications
      const { data: applications, error: applicationsError } = await supabase
        .from('provider_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        throw new Error('Failed to fetch applications');
      }

      if (!applications || applications.length === 0) {
        setApplications([]);
        return;
      }

      // Get provider details for each application
      const applicationsWithProviders = await Promise.all(
        applications.map(async (app) => {
          const { data: provider, error: providerError } = await supabase
            .from('providers')
            .select('company_name, email, contact_no')
            .eq('id', app.provider_id)
            .single();

          if (providerError) {
            console.error(`Error fetching provider for application ${app.id}:`, providerError);
            return {
              ...app,
              provider: {
                company_name: 'Unknown Provider',
                email: 'N/A',
                contact_no: 'N/A'
              }
            };
          }

          return {
            ...app,
            provider: provider || {
              company_name: 'Unknown Provider',
              email: 'N/A',
              contact_no: 'N/A'
            }
          };
        })
      );

      setApplications(applicationsWithProviders);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleApplication = async (applicationId: string, action: 'accept' | 'reject') => {
    try {
      // First get the application details
      const { data: application, error: fetchError } = await supabase
        .from('provider_applications')
        .select('*')
        .eq('id', applicationId)
        .single();

      if (fetchError) {
        throw new Error('Failed to fetch application details');
      }

      if (action === 'accept') {
        // Create a new experience from the application
        const { error: createError } = await supabase
          .from('experiences')
          .insert({
            provider_id: application.provider_id,
            title: application.title,
            description: application.description,
            price: application.price,
            location: application.location,
            duration: application.duration,
            participants: application.participants,
            date: application.date,
            image_url: application.image_url,
            category: application.category,
            niche_category: application.niche_category,
            trending: application.trending,
            featured: application.featured,
            romantic: application.romantic,
            adventurous: application.adventurous,
            group_activity: application.group_activity,
            status: 'active'
          });

        if (createError) {
          console.error('Error creating experience:', createError);
          throw new Error('Failed to create experience');
        }
      }

      // Delete the application from provider_applications
      const { error: deleteError } = await supabase
        .from('provider_applications')
        .delete()
        .eq('id', applicationId);

      if (deleteError) {
        console.error('Error deleting application:', deleteError);
        throw new Error('Failed to delete application');
      }

      toast.success(`Application ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
      fetchApplications();
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
      toast.error(error instanceof Error ? error.message : `Failed to ${action} application`);
    }
  };

  const getSelectedCategories = (application: ProviderApplication) => {
    const categories = [];
    if (application.adventurous) categories.push('Adventure');
    if (application.romantic) categories.push('Romantic');
    if (application.group_activity) categories.push('Group Activity');
    if (application.trending) categories.push('Trending');
    if (application.featured) categories.push('Featured');
    if (application.category) categories.push(application.category);
    if (application.niche_category) categories.push(application.niche_category);
    return categories;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading applications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-red-500">{error}</div>
          <div className="text-center mt-4">
            <Button onClick={fetchApplications}>Retry</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Experience Applications
        </h1>

        <div className="grid gap-6">
          {applications.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              No pending applications
            </div>
          ) : (
            applications.map((application) => (
              <Card key={application.id} className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{application.title}</CardTitle>
                      <CardDescription>
                        by {application.provider.company_name}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="font-medium mb-2">Provider Details</h3>
                      <p>Email: {application.provider.email}</p>
                      <p>Contact: {application.provider.contact_no}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Experience Details</h3>
                      <p>Categories: {getSelectedCategories(application).join(', ') || 'None'}</p>
                      <p>Location: {application.location}</p>
                      <p>Duration: {application.duration}</p>
                      <p>Price: ₹{application.price}</p>
                      <p>Date: {new Date(application.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {application.description}
                      </p>
                    </div>
                    <div className="flex gap-4 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => handleApplication(application.id, 'reject')}
                      >
                        Reject
                      </Button>
                      <Button
                        onClick={() => handleApplication(application.id, 'accept')}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceApplications; 