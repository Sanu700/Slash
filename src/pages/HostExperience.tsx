import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { submitProviderApplication } from '@/lib/services/provider';
import { toast } from 'sonner';
import { LoginModal } from '@/components/LoginModal';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';

type ExperienceInsert = Database['public']['Tables']['experiences']['Insert'];
type ProviderInsert = Database['public']['Tables']['providers']['Insert'];

const categories = [
  { id: 'adventurous', label: 'Adventure' },
  { id: 'dining', label: 'Dining' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'sports', label: 'Sports' },
  { id: 'educational', label: 'Educational' },
  { id: 'romantic', label: 'Romantic' },
  { id: 'family', label: 'Family' },
  { id: 'luxury', label: 'Luxury' }
] as const;

type CategoryId = typeof categories[number]['id'];

interface FormData {
  companyName: string;
  email: string;
  contactNo: string;
  experienceName: string;
  description: string;
  price: string;
  duration: string;
  participants: string;
  location: string;
  categories: Record<CategoryId, boolean>;
  images: string[];
}

const HostExperience = () => {
  const { isAuthenticated, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    companyName: '',
    email: '',
    contactNo: '',
    experienceName: '',
    description: '',
    price: '',
    duration: '',
    participants: '',
    location: '',
    categories: {
      adventurous: false,
      dining: false,
      wellness: false,
      cultural: false,
      entertainment: false,
      sports: false,
      educational: false,
      romantic: false,
      family: false,
      luxury: false
    },
    images: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (categoryId: CategoryId) => {
    setFormData(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [categoryId]: !prev.categories[categoryId]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to submit an experience');
      return;
    }

    try {
      setIsSubmitting(true);

      // Create the experience application directly
      const { error: experienceError } = await supabase
        .from('provider_applications')
        .insert({
          user_id: user.id,
          company_name: formData.companyName,
          email: formData.email,
          contact_no: formData.contactNo,
          title: formData.experienceName,
          description: formData.description,
          price: parseInt(formData.price),
          location: formData.location,
          duration: parseInt(formData.duration),
          participants: parseInt(formData.participants),
          date: new Date().toISOString().split('T')[0],
          image_url: '',
          category: Object.entries(formData.categories)
            .filter(([_, value]) => value)
            .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1))
            .join(', ') || 'Other',
          niche_category: null,
          trending: false,
          featured: false,
          romantic: formData.categories.romantic || false,
          adventurous: formData.categories.adventurous || false,
          group_activity: false
        });

      if (experienceError) {
        console.error('Error creating experience application:', experienceError);
        throw new Error('Failed to submit application');
      }

      toast.success('Application submitted successfully');
      navigate('/provider/dashboard');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center pt-16">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign in to Host</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please sign in with Google to host your experience
            </p>
          </div>
          <Button
            onClick={() => signInWithGoogle()}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Host an Experience</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Name
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNo"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="experienceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Experience Name
              </label>
              <input
                type="text"
                id="experienceName"
                name="experienceName"
                value={formData.experienceName}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price per person (₹)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Maximum Participants
                </label>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  value={formData.participants}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categories
              </label>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={category.id}
                      checked={formData.categories[category.id] || false}
                      onChange={() => handleCategoryChange(category.id as CategoryId)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={category.id}
                      className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                    >
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Experience'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostExperience;
