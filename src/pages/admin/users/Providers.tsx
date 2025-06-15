import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Mail, Phone, Briefcase, UserPlus, UserMinus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Provider {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  raw_user_meta_data: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
    company_name?: string;
    business_type?: string;
  };
  experiences_count?: number;
}

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddProviderDialogOpen, setIsAddProviderDialogOpen] = useState(false);
  const [newProvider, setNewProvider] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    company_name: '',
    business_type: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      // Filter only providers
      const providerUsers = (users.users || []).filter(u => 
        u.user_metadata?.role === 'provider'
      );

      // Get experience counts for each provider
      const providersWithExperiences = await Promise.all(
        providerUsers.map(async (user) => {
          const { count } = await supabase
            .from('experiences')
            .select('*', { count: 'exact', head: true })
            .eq('provider_id', user.id);

          return {
            id: user.id,
            email: user.email ?? "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            raw_user_meta_data: user.user_metadata || {},
            experiences_count: count || 0
          };
        })
      );

      setProviders(providersWithExperiences);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch providers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProvider = async () => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newProvider.email,
        password: newProvider.password,
        user_metadata: {
          full_name: newProvider.full_name,
          phone: newProvider.phone,
          company_name: newProvider.company_name,
          business_type: newProvider.business_type,
          role: 'provider'
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider created successfully",
      });

      setIsAddProviderDialogOpen(false);
      setNewProvider({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        company_name: '',
        business_type: ''
      });
      fetchProviders();
    } catch (error) {
      console.error('Error creating provider:', error);
      toast({
        title: "Error",
        description: "Failed to create provider",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (providerId: string, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        providerId,
        { user_metadata: { status: newStatus } }
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider status updated successfully",
      });

      fetchProviders();
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast({
        title: "Error",
        description: "Failed to update provider status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProvider = async (providerId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(providerId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Provider deleted successfully",
      });

      fetchProviders();
    } catch (error) {
      console.error('Error deleting provider:', error);
      toast({
        title: "Error",
        description: "Failed to delete provider",
        variant: "destructive",
      });
    }
  };

  const filteredProviders = providers.filter(provider => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      provider.email.toLowerCase().includes(searchTerm) ||
      provider.raw_user_meta_data?.full_name?.toLowerCase().includes(searchTerm) ||
      provider.raw_user_meta_data?.company_name?.toLowerCase().includes(searchTerm) ||
      provider.raw_user_meta_data?.phone?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Provider Management</h1>
          <Dialog open={isAddProviderDialogOpen} onOpenChange={setIsAddProviderDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Add Provider
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Provider</DialogTitle>
                <DialogDescription>
                  Create a new provider account with the following details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newProvider.email}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newProvider.password}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={newProvider.full_name}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newProvider.phone}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    value={newProvider.company_name}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, company_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business_type">Business Type</Label>
                  <Input
                    id="business_type"
                    value={newProvider.business_type}
                    onChange={(e) => setNewProvider(prev => ({ ...prev, business_type: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddProviderDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddProvider}>
                  Create Provider
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Providers</CardTitle>
            <CardDescription>View and manage experience providers</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search providers..."
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
                    <TableHead>Provider</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Experiences</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={provider.raw_user_meta_data?.avatar_url} />
                            <AvatarFallback>
                              {provider.raw_user_meta_data?.full_name?.[0] || provider.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{provider.raw_user_meta_data?.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{provider.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{provider.email}</span>
                        </div>
                        {provider.raw_user_meta_data?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{provider.raw_user_meta_data.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{provider.raw_user_meta_data?.company_name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{provider.raw_user_meta_data?.business_type || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <span>{provider.experiences_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(provider.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {provider.last_sign_in_at 
                          ? format(new Date(provider.last_sign_in_at), 'MMM d, yyyy')
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStatusChange(provider.id, 'active')}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(provider.id, 'inactive')}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteProvider(provider.id)}
                              className="text-red-600"
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Delete Provider
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
    </AdminLayout>
  );
} 