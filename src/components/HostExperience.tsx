import React, { useState, useEffect } from 'react';
import { submitProviderApplication } from '@/lib/services/provider';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function HostExperience() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    contactNo: '',
    location: '',
    experienceName: '',
    description: '',
    image: null as File | null,
    price: '',
    duration: '',
    participants: '',
    date: '',
    category: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert image to base64 if it exists
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
          category: formData.category
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Become a Host</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="contactNo">Contact Number</Label>
            <Input
              id="contactNo"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="experienceName">Experience Name</Label>
            <Input
              id="experienceName"
              name="experienceName"
              value={formData.experienceName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Experience Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price per person (₹)"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 2 hours"
              required
            />
          </div>

          <div>
            <Label htmlFor="participants">Maximum Participants</Label>
            <Input
              id="participants"
              name="participants"
              type="number"
              value={formData.participants}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="date">Available Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g., Adventure, Cultural, Food"
              required
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </div>
  );
} 