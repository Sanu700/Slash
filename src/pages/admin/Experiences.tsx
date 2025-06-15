import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface Experience {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: string;
  created_at: string;
  updated_at: string;
  image_url: string;
  duration: string;
  date: string;
  adventurous: boolean;
  group_activity: boolean;
  featured: boolean;
  status?: 'active' | 'inactive';
  provider_id?: string;
}

export default function Experiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setExperiences(data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      toast({
        title: "Error",
        description: "Failed to fetch experiences",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (experienceId: string, newStatus: 'active' | 'inactive') => {
    // If status is not in the schema, do nothing
    toast({
      title: "Not Supported",
      description: "Status field does not exist in the schema.",
      variant: "destructive",
    });
  };

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Experience deleted successfully",
      });

      fetchExperiences();
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete experience",
        variant: "destructive",
      });
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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Experiences</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Search experiences..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-[300px]"
              />
            </div>
            <Link to="/admin/experiences/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Experience
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Experience</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExperiences.map((experience) => (
                    <TableRow key={experience.id}>
                      <TableCell>
                        <div className="font-medium">{experience.title}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2">
                          {experience.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{experience.category}</Badge>
                      </TableCell>
                      <TableCell>{experience.location}</TableCell>
                      <TableCell>${experience.price}</TableCell>
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
                            <DropdownMenuItem asChild>
                              <Link to={`/experience/${experience.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/experiences/edit/${experience.id}`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(
                                experience.id, 
                                experience.status === 'active' ? 'inactive' : 'active'
                              )}
                            >
                              <Badge className="mr-2 h-4 w-4" />
                              {experience.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteExperience(experience.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
} 