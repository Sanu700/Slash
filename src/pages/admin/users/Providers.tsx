import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Mail, Phone, Shield, UserPlus, UserMinus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface Provider {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  raw_user_meta_data: {
    full_name?: string;
    phone?: string;
    role?: string;
    business_name?: string;
    business_type?: string;
    status?: 'active' | 'inactive';
  };
}

export default function Providers() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      // Filter for providers and map to our Provider interface
      const providerData = (data.users || [])
        .filter(u => u.user_metadata?.role === 'provider')
        .map(u => ({
          id: u.id,
          email: u.email ?? "",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          raw_user_meta_data: u.user_metadata || {}
        }));
      
      setProviders(providerData);
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
      provider.raw_user_meta_data?.business_name?.toLowerCase().includes(searchTerm) ||
      provider.raw_user_meta_data?.phone?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Provider Management</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Providers</CardTitle>
            <CardDescription>Manage experience providers and their accounts</CardDescription>
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
                    <TableHead>Business</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProviders.map((provider) => (
                    <TableRow key={provider.id}>
                      <TableCell>
                        <div className="font-medium">{provider.raw_user_meta_data?.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{provider.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{provider.raw_user_meta_data?.business_name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{provider.raw_user_meta_data?.business_type || 'N/A'}</div>
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
                        <Badge variant={provider.raw_user_meta_data?.status === 'active' ? 'default' : 'secondary'}>
                          {provider.raw_user_meta_data?.status || 'inactive'}
                        </Badge>
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