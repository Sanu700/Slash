import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Mail, Phone, Briefcase, UserPlus, UserMinus, Edit, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from '@/components/ui/use-toast';
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

// Define types locally since adminService doesn't exist
interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  experiences_count?: number;
  user_metadata: {
    full_name: string;
    phone: string;
    role: string;
    status?: 'active' | 'inactive' | 'pending';
    company_name?: string;
    business_type?: string;
    avatar_url?: string;
  };
}

interface CreateUserData {
  email: string;
  password: string;
  user_metadata: {
    full_name: string;
    phone: string;
    role: string;
    status?: 'active' | 'inactive' | 'pending';
    company_name?: string;
    business_type?: string;
    avatar_url?: string;
  };
}

interface UpdateUserData {
  userId: string;
  user_metadata: {
    role?: string;
    status?: 'active' | 'inactive' | 'pending';
    full_name?: string;
    phone?: string;
    company_name?: string;
    business_type?: string;
    avatar_url?: string;
  };
}

// Mock admin service
const adminService = {
  listUsers: async (): Promise<AdminUser[]> => {
    throw new Error('Admin service not available');
  },
  updateUser: async (data: UpdateUserData): Promise<void> => {
    throw new Error('Admin service not available');
  },
  deleteUser: async (userId: string): Promise<void> => {
    throw new Error('Admin service not available');
  },
  createUser: async (data: CreateUserData): Promise<AdminUser> => {
    throw new Error('Admin service not available');
  }
};

export default function Providers() {
  const [providers, setProviders] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [demoToastShown, setDemoToastShown] = useState(false);
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
  const [selectedProvider, setSelectedProvider] = useState<AdminUser | null>(null);
  const [isEditProviderDialogOpen, setIsEditProviderDialogOpen] = useState(false);
  const [isDeleteProviderDialogOpen, setIsDeleteProviderDialogOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<string | null>(null);
  const [isViewProviderDialogOpen, setIsViewProviderDialogOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const demoModeRef = useRef(false);
  const demoToastShownRef = useRef(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  // Reset dropdown state when dialogs are closed
  useEffect(() => {
    if (!isEditProviderDialogOpen && !isViewProviderDialogOpen && !isDeleteProviderDialogOpen) {
      setOpenDropdownId(null);
    }
  }, [isEditProviderDialogOpen, isViewProviderDialogOpen, isDeleteProviderDialogOpen]);

  const fetchProviders = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch providers from the admin service
      try {
        const providersData = await adminService.listUsers();
        setProviders(providersData);
        demoModeRef.current = false;
      } catch (serviceError) {
        console.warn('Admin service not available, using fallback data:', serviceError);
        demoModeRef.current = true;
        
        // Fallback: Use mock data for demonstration
        const mockProviders: AdminUser[] = [
          {
            id: '1',
            email: 'john.provider@example.com',
            created_at: '2024-01-15T10:30:00Z',
            last_sign_in_at: '2024-01-20T14:45:00Z',
            experiences_count: 5,
            user_metadata: {
              full_name: 'John Provider',
              phone: '+1234567890',
              role: 'provider',
              status: 'active' as const,
              company_name: 'Adventure Tours Co.',
              business_type: 'Adventure & Outdoor'
            }
          },
          {
            id: '2',
            email: 'jane.guide@example.com',
            created_at: '2024-01-10T09:15:00Z',
            last_sign_in_at: '2024-01-19T16:20:00Z',
            experiences_count: 3,
            user_metadata: {
              full_name: 'Jane Guide',
              phone: '+1987654321',
              role: 'provider',
              status: 'inactive' as const,
              company_name: 'City Explorers',
              business_type: 'City Tours'
            }
          },
          {
            id: '3',
            email: 'bob.host@example.com',
            created_at: '2024-01-05T11:00:00Z',
            last_sign_in_at: '2024-01-18T13:30:00Z',
            experiences_count: 0,
            user_metadata: {
              full_name: 'Bob Host',
              phone: '+1122334455',
              role: 'provider',
              status: 'pending' as const,
              company_name: 'Food & Culture Tours',
              business_type: 'Food & Beverage'
            }
          }
        ];
        
        setProviders(mockProviders);
        demoModeRef.current = true;
      }
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
      if (demoModeRef.current) {
        setProviders(prev => [
          ...prev,
          {
            id: (prev.length + 1).toString(),
            email: newProvider.email,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            user_metadata: {
              full_name: newProvider.full_name,
              phone: newProvider.phone,
              role: 'provider',
              company_name: newProvider.company_name,
              business_type: newProvider.business_type,
              status: 'pending'
            },
            experiences_count: 0
          }
        ]);
        setIsAddProviderDialogOpen(false);
        setNewProvider({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          company_name: '',
          business_type: ''
        });
        return;
      }
      // Real mode
      const userData = {
        email: newProvider.email,
        password: newProvider.password,
        user_metadata: {
          full_name: newProvider.full_name,
          phone: newProvider.phone,
          role: 'provider',
          company_name: newProvider.company_name,
          business_type: newProvider.business_type
        }
      };
      await adminService.createUser(userData);
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
      toast({
        title: "Error",
        description: "Failed to create provider. Set up SUPABASE_SERVICE_ROLE_KEY for real provider management.",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      if (demoModeRef.current) {
        setProviders(prev => prev.map(provider =>
          provider.id === userId
            ? {
                ...provider,
                user_metadata: {
                  ...provider.user_metadata,
                  status: newStatus as 'active' | 'inactive' | 'pending'
                }
              }
            : provider
        ));
        toast({
          title: "Success",
          description: "Provider status updated successfully",
        });
        return;
      }

      await adminService.updateUser({
        userId,
        user_metadata: { status: newStatus }
      });

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

  const handleEditProvider = async () => {
    if (!selectedProvider) return;
    try {
      if (demoModeRef.current) {
        setProviders(prev => prev.map(p =>
          p.id === selectedProvider.id
            ? {
                ...p,
                user_metadata: {
                  ...p.user_metadata,
                  full_name: selectedProvider.user_metadata.full_name,
                  phone: selectedProvider.user_metadata.phone,
                  company_name: selectedProvider.user_metadata.company_name,
                  business_type: selectedProvider.user_metadata.business_type
                }
              }
            : p
        ));
        setIsEditProviderDialogOpen(false);
        setSelectedProvider(null);
        return;
      }
      // Real mode
      await adminService.updateUser({
        userId: selectedProvider.id,
        user_metadata: {
          full_name: selectedProvider.user_metadata.full_name,
          phone: selectedProvider.user_metadata.phone,
          company_name: selectedProvider.user_metadata.company_name,
          business_type: selectedProvider.user_metadata.business_type
        }
      });
      toast({
        title: "Success",
        description: "Provider updated successfully",
      });
      setIsEditProviderDialogOpen(false);
      setSelectedProvider(null);
      fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider. Set up SUPABASE_SERVICE_ROLE_KEY for real provider management.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProvider = async (id: string) => {
    try {
      if (demoModeRef.current) {
        setProviders(prev => prev.filter(p => p.id !== id));
        return;
      }
      await adminService.deleteUser(id);
      toast({
        title: "Success",
        description: "Provider deleted successfully",
      });
      fetchProviders();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete provider. Set up SUPABASE_SERVICE_ROLE_KEY for real provider management.",
        variant: "destructive",
      });
    }
  };

  const filteredProviders = providers.filter(provider => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      provider.email.toLowerCase().includes(searchTerm) ||
      provider.user_metadata?.full_name?.toLowerCase().includes(searchTerm) ||
      provider.user_metadata?.phone?.toLowerCase().includes(searchTerm) ||
      provider.user_metadata?.company_name?.toLowerCase().includes(searchTerm)
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
                    <TableHead>Status</TableHead>
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
                            <AvatarImage src={provider.user_metadata?.avatar_url} />
                            <AvatarFallback>
                              {provider.user_metadata?.full_name?.[0] || provider.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{provider.user_metadata?.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{provider.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{provider.email}</span>
                        </div>
                        {provider.user_metadata?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{provider.user_metadata.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{provider.user_metadata?.company_name || 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">{provider.user_metadata?.business_type || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={provider.user_metadata?.status === 'active' ? 'default' : 'secondary'}>
                          {provider.user_metadata?.status || 'pending'}
                        </Badge>
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
                        <DropdownMenu open={openDropdownId === provider.id} onOpenChange={(open) => {
                          setOpenDropdownId(open ? provider.id : null);
                        }}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                            <DropdownMenuItem onClick={() => {
                              handleStatusChange(provider.id, 'active');
                              setOpenDropdownId(null);
                            }}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              handleStatusChange(provider.id, 'inactive');
                              setOpenDropdownId(null);
                            }}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => { 
                                setSelectedProvider(provider); 
                                setIsEditProviderDialogOpen(true);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => { 
                                setSelectedProvider(provider); 
                                setIsViewProviderDialogOpen(true);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => { 
                                setProviderToDelete(provider.id); 
                                setIsDeleteProviderDialogOpen(true);
                                setOpenDropdownId(null);
                              }}
                              className="text-red-600"
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Delete
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

      {/* Edit Provider Dialog */}
      <Dialog open={isEditProviderDialogOpen} onOpenChange={setIsEditProviderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Provider</DialogTitle>
            <DialogDescription>
              Update the provider's details.
            </DialogDescription>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-full_name">Full Name</Label>
                <Input
                  id="edit-full_name"
                  value={selectedProvider.user_metadata.full_name || ''}
                  onChange={(e) => setSelectedProvider(prev => prev ? {
                    ...prev,
                    user_metadata: {
                      ...prev.user_metadata,
                      full_name: e.target.value
                    }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedProvider.user_metadata.phone || ''}
                  onChange={(e) => setSelectedProvider(prev => prev ? {
                    ...prev,
                    user_metadata: {
                      ...prev.user_metadata,
                      phone: e.target.value
                    }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-company_name">Company Name</Label>
                <Input
                  id="edit-company_name"
                  value={selectedProvider.user_metadata.company_name || ''}
                  onChange={(e) => setSelectedProvider(prev => prev ? {
                    ...prev,
                    user_metadata: {
                      ...prev.user_metadata,
                      company_name: e.target.value
                    }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-business_type">Business Type</Label>
                <Input
                  id="edit-business_type"
                  value={selectedProvider.user_metadata.business_type || ''}
                  onChange={(e) => setSelectedProvider(prev => prev ? {
                    ...prev,
                    user_metadata: {
                      ...prev.user_metadata,
                      business_type: e.target.value
                    }
                  } : null)}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditProviderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProvider}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Provider Dialog */}
      <Dialog open={isViewProviderDialogOpen} onOpenChange={setIsViewProviderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provider Profile</DialogTitle>
            <DialogDescription>
              View provider details and information.
            </DialogDescription>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedProvider.user_metadata.full_name || 'Not provided'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedProvider.email}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedProvider.user_metadata.phone || 'Not provided'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Company Name</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedProvider.user_metadata.company_name || 'Not provided'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Business Type</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedProvider.user_metadata.business_type || 'Not provided'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="p-2 bg-muted rounded-md">
                  <Badge variant={selectedProvider.user_metadata?.status === 'active' ? 'default' : 'secondary'}>
                    {selectedProvider.user_metadata?.status || 'pending'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Provider ID</Label>
                <div className="p-2 bg-muted rounded-md font-mono text-sm">
                  {selectedProvider.id}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Joined Date</Label>
                <div className="p-2 bg-muted rounded-md">
                  {format(new Date(selectedProvider.created_at), 'PPP')}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Sign In</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedProvider.last_sign_in_at 
                    ? format(new Date(selectedProvider.last_sign_in_at), 'PPP')
                    : 'Never'
                  }
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total Experiences</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedProvider.experiences_count || 0} experiences
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewProviderDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewProviderDialogOpen(false);
              setIsEditProviderDialogOpen(true);
            }}>
              Edit Provider
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Provider Confirmation Dialog */}
      <Dialog open={isDeleteProviderDialogOpen} onOpenChange={setIsDeleteProviderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Provider</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this provider? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteProviderDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (providerToDelete) {
                  handleDeleteProvider(providerToDelete);
                  setIsDeleteProviderDialogOpen(false);
                  setProviderToDelete(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
} 