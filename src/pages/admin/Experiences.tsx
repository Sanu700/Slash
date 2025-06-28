import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, MapPin, DollarSign, MoreVertical, Plus, Edit, Trash2, Eye, Database } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addSampleExperiences } from '@/lib/data/sampleData';

interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  provider_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  provider?: {
    email: string;
    user_metadata: {
      full_name?: string;
      company_name?: string;
    };
  };
  bookings_count?: number;
}

interface User {
  id: string;
  email: string;
  user_metadata: {
    role?: string;
    full_name?: string;
    company_name?: string;
  };
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [newExperience, setNewExperience] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    category: '',
    provider_id: '',
    image_url: ''
  });

  useEffect(() => {
    fetchExperiences();
    fetchProviders();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('experiences')
        .select('*');

      if (error) throw error;

      // Get booking counts for each experience
      const experiencesWithBookings = await Promise.all(
        (data || []).map(async (exp) => {
          const { count } = await supabase
            .from('bookings')
            .select('*', { count: 'exact', head: true })
            .eq('experience_id', exp.id);

          return {
            ...exp,
            bookings_count: count || 0
          };
        })
      );

      console.log('Fetched experiences:', experiencesWithBookings); // Debug log
      setExperiences(experiencesWithBookings);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast.error('Failed to fetch experiences');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      const { data: users, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;

      const providerUsers = (users.users as User[]).filter(u => u.user_metadata?.role === 'provider');
      setProviders(providerUsers);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to fetch providers');
    }
  };

  const handleAddExperience = async () => {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .insert([{
          title: newExperience.title,
          description: newExperience.description,
          price: parseFloat(newExperience.price),
          location: newExperience.location,
          category: newExperience.category,
          provider_id: newExperience.provider_id,
          image_url: newExperience.image_url
        }])
        .select()
        .single();

      if (error) throw error;

      toast.success('Experience created successfully');

      setIsAddDialogOpen(false);
      setNewExperience({
        title: '',
        description: '',
        price: '',
        location: '',
        category: '',
        provider_id: '',
        image_url: ''
      });
      fetchExperiences();
    } catch (error) {
      console.error('Error creating experience:', error);
      toast.error('Failed to create experience');
    }
  };

  const handleEditExperience = async () => {
    if (!selectedExperience) return;

    try {
      const { error } = await supabase
        .from('experiences')
        .update({
          title: selectedExperience.title,
          description: selectedExperience.description,
          price: selectedExperience.price,
          location: selectedExperience.location,
          category: selectedExperience.category,
          provider_id: selectedExperience.provider_id,
          image_url: selectedExperience.image_url
        })
        .eq('id', selectedExperience.id);

      if (error) throw error;

      toast.success('Experience updated successfully');

      setIsEditDialogOpen(false);
      setSelectedExperience(null);
      fetchExperiences();
    } catch (error) {
      console.error('Error updating experience:', error);
      toast.error('Failed to update experience');
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Experience deleted successfully');

      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    }
  };

  const filteredExperiences = experiences.filter(experience => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      experience.title.toLowerCase().includes(searchTerm) ||
      experience.description.toLowerCase().includes(searchTerm) ||
      experience.location.toLowerCase().includes(searchTerm) ||
      experience.category.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Experience Management</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={async () => {
                const success = await addSampleExperiences();
                if (success) {
                  toast.success('Sample experiences added successfully!');
                  fetchExperiences(); // Refresh the list
                } else {
                  toast.error('Failed to add sample experiences');
                }
              }}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Add Sample Data
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Add Experience
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Experience</DialogTitle>
                  <DialogDescription>
                    Create a new experience with the following details.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newExperience.description}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newExperience.price}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newExperience.category}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                      value={newExperience.provider_id}
                      onValueChange={(value) => setNewExperience(prev => ({ ...prev, provider_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider.id} value={provider.id}>
                            {provider.user_metadata?.company_name || provider.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL</Label>
                    <Input
                      id="image_url"
                      value={newExperience.image_url}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, image_url: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddExperience}>
                    Create Experience
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Experiences</CardTitle>
            <CardDescription>Manage all experiences on the platform</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search experiences..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Experience</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExperiences.map((experience) => (
                    <TableRow key={experience.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={experience.image_url} />
                            <AvatarFallback>
                              {experience.title[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{experience.title}</div>
                            <div className="text-sm text-muted-foreground">{experience.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {experience.provider?.user_metadata?.company_name || experience.provider?.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{experience.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{experience.price}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {experience.bookings_count} bookings
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(experience.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedExperience(experience);
                              setIsEditDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteExperience(experience.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/experience/${experience.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Experience
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Experience Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
            <DialogDescription>
              Update the experience details.
            </DialogDescription>
          </DialogHeader>
          {selectedExperience && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={selectedExperience.title}
                  onChange={(e) => setSelectedExperience(prev => prev ? {
                    ...prev,
                    title: e.target.value
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={selectedExperience.description}
                  onChange={(e) => setSelectedExperience(prev => prev ? {
                    ...prev,
                    description: e.target.value
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={selectedExperience.price}
                  onChange={(e) => setSelectedExperience(prev => prev ? {
                    ...prev,
                    price: parseFloat(e.target.value)
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={selectedExperience.location}
                  onChange={(e) => setSelectedExperience(prev => prev ? {
                    ...prev,
                    location: e.target.value
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Input
                  id="edit-category"
                  value={selectedExperience.category}
                  onChange={(e) => setSelectedExperience(prev => prev ? {
                    ...prev,
                    category: e.target.value
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-provider">Provider</Label>
                <Select
                  value={selectedExperience.provider_id}
                  onValueChange={(value) => setSelectedExperience(prev => prev ? {
                    ...prev,
                    provider_id: value
                  } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.user_metadata?.company_name || provider.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-image_url">Image URL</Label>
                <Input
                  id="edit-image_url"
                  value={selectedExperience.image_url}
                  onChange={(e) => setSelectedExperience(prev => prev ? {
                    ...prev,
                    image_url: e.target.value
                  } : null)}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditExperience}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
} 