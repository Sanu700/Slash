import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { submitProviderApplication } from '@/lib/services/provider';

const categories = [
  "Adventure",
  "Dining",
  "Wellness",
  "Cultural",
  "Entertainment",
  "Sports",
  "Educational",
  "Romantic",
  "Family",
  "Luxury"
];

const HostExperience = () => {
  const { isAuthenticated, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    companyName: '',
    email: user?.email || '',
    contactNo: '',
    experienceName: '',
    description: '',
    price: '',
    duration: '',
    location: '',
    participants: '',
    date: '',
    category: '',
    images: [] as string[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      await signInWithGoogle();
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitProviderApplication({
        companyName: formData.companyName,
        email: formData.email,
        contactNo: formData.contactNo,
        location: formData.location,
        experienceDetails: {
          name: formData.experienceName,
          description: formData.description,
          image: formData.images[0] || '',
          price: formData.price,
          location: formData.location,
          duration: formData.duration,
          participants: formData.participants,
          date: formData.date,
          category: formData.category
        }
      });

      if (result.success) {
        toast.success('Application submitted successfully!');
        navigate('/');
      } else {
        toast.error(result.error?.message || 'Submission failed.');
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || 'Unexpected error.');
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
          <Button onClick={signInWithGoogle} className="w-full" variant="outline">
            Sign in with Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Host an Experience</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
              <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} required />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
            </div>

            <div>
              <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Number</label>
              <Input type="tel" id="contactNo" name="contactNo" value={formData.contactNo} onChange={handleInputChange} required />
            </div>

            <div>
              <label htmlFor="experienceName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience Name</label>
              <Input id="experienceName" name="experienceName" value={formData.experienceName} onChange={handleInputChange} required />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price</label>
              <Input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} min="0" required />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration (hours)</label>
              <Input type="number" id="duration" name="duration" value={formData.duration} onChange={handleInputChange} min="1" required />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
              <Input id="location" name="location" value={formData.location} onChange={handleInputChange} required />
            </div>

            <div>
              <label htmlFor="participants" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Participants</label>
              <Input type="number" id="participants" name="participants" value={formData.participants} onChange={handleInputChange} min="1" required />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Available Date</label>
              <Input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary file:text-white
                  hover:file:bg-primary/90
                  dark:file:bg-primary dark:file:text-white"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Experience'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostExperience;
