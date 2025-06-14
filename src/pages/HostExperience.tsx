import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
import { useAuth } from '@/lib/auth';
import { LoginModal } from '@/components/LoginModal';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

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
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    contactNo: '',
    experienceName: '',
    description: '',
    image: null as File | null,
    price: '',
    location: '',
    duration: '',
    participants: '',
    date: '',
    categories: [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        image: e.target.files![0]
      }));
    }
  };

  const handleCategoryChange = (value: string) => {
    if (!formData.categories.includes(value)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, value]
      }));
    }
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    if (formData.categories.length === 0) {
      toast.error('Please select at least one category');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageBase64 = null;
      if (formData.image) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(formData.image);
        });
      }

      const result = await submitProviderApplication({
        companyName: formData.companyName,
        email: formData.email,
        contactNo: formData.contactNo,
        location: formData.location,
        experienceDetails: {
          name: formData.experienceName,
          description: formData.description,
          image: imageBase64,
          price: formData.price,
          location: formData.location,
          duration: formData.duration,
          participants: formData.participants,
          date: formData.date,
          categories: formData.categories
        }
      });

      if (result.success) {
        toast.success('Application submitted successfully! We will review your application and get back to you soon.');
        navigate('/');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while submitting your application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Host an Experience
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Join our community of experience providers and share your unique offerings with our customers.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Details</h2>
                <Input
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="tel"
                  name="contactNo"
                  placeholder="Contact Number"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Experience Details</h2>
                <Input
                  name="experienceName"
                  placeholder="Experience Name"
                  value={formData.experienceName}
                  onChange={handleInputChange}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Experience Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="min-h-[120px]"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    type="number"
                    name="price"
                    placeholder="Price per person (₹)"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    name="duration"
                    placeholder="Duration (e.g., 2 hours)"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="number"
                    name="participants"
                    placeholder="Max Participants"
                    value={formData.participants}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    type="date"
                    name="date"
                    placeholder="Available From"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categories
                    </label>
                    <Select onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem 
                            key={category} 
                            value={category}
                            disabled={formData.categories.includes(category)}
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.categories.map(category => (
                        <Badge
                          key={category}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {category}
                          <button
                            type="button"
                            onClick={() => removeCategory(category)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Experience Image
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  );
};

export default HostExperience;
