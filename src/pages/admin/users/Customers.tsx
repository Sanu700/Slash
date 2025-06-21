import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, ShoppingBag, MoreVertical, UserPlus, Edit, Trash2, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from '@/lib/supabase';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define types locally since adminService doesn't exist
interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  bookings_count?: number;
  avatar_url?: string;
  user_metadata: {
    full_name: string;
    phone: string;
    role: string;
    status?: 'active' | 'inactive';
  };
}

interface CreateUserData {
  email: string;
  password: string;
  user_metadata: {
    full_name: string;
    phone: string;
    role: string;
    status?: 'active' | 'inactive';
  };
}

interface UpdateUserData {
  userId: string;
  user_metadata: {
    role?: string;
    status?: 'active' | 'inactive';
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

export default function Customers() {
  const [customers, setCustomers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<AdminUser | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const { toast } = useToast();
  const demoModeRef = useRef(false);
  const demoToastShownRef = useRef(false);
  const [isDeleteCustomerDialogOpen, setIsDeleteCustomerDialogOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isViewCustomerDialogOpen, setIsViewCustomerDialogOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Reset dropdown state when dialogs are closed
  useEffect(() => {
    if (!isEditCustomerDialogOpen && !isViewCustomerDialogOpen && !isDeleteCustomerDialogOpen) {
      setOpenDropdownId(null);
    }
  }, [isEditCustomerDialogOpen, isViewCustomerDialogOpen, isDeleteCustomerDialogOpen]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch users from the admin service
      try {
        const allUsers = await adminService.listUsers();
        
        // Filter only customers (users without admin or provider role)
        const customerUsers = allUsers.filter(u => 
          !(u.user_metadata?.role === 'admin' || u.user_metadata?.role === 'provider')
        );

        // Get booking counts for each customer
        const customersWithBookings = await Promise.all(
          customerUsers.map(async (user) => {
            const { count } = await supabase
              .from('bookings')
              .select('*', { count: 'exact', head: true })
              .eq('user_id', user.id);

            return {
              ...user,
              bookings_count: count || 0
            };
          })
        );

        setCustomers(customersWithBookings);
        demoModeRef.current = false;
      } catch (serviceError) {
        console.warn('Admin service not available, using fallback data:', serviceError);
        
        // Fallback: Use mock data for demonstration
        const mockCustomers: AdminUser[] = [
          {
            id: '1',
            email: 'john.doe@example.com',
            created_at: '2024-01-15T10:30:00Z',
            last_sign_in_at: '2024-01-20T14:45:00Z',
            user_metadata: {
              full_name: 'John Doe',
              phone: '+1234567890',
              role: 'user'
            },
            bookings_count: 3
          },
          {
            id: '2',
            email: 'sarah.smith@example.com',
            created_at: '2024-01-10T09:15:00Z',
            last_sign_in_at: '2024-01-19T16:20:00Z',
            user_metadata: {
              full_name: 'Sarah Smith',
              phone: '+1987654321',
              role: 'user'
            },
            bookings_count: 1
          },
          {
            id: '3',
            email: 'mike.johnson@example.com',
            created_at: '2024-01-05T11:00:00Z',
            last_sign_in_at: '2024-01-18T13:30:00Z',
            user_metadata: {
              full_name: 'Mike Johnson',
              phone: '+1122334455',
              role: 'user'
            },
            bookings_count: 0
          }
        ];
        
        setCustomers(mockCustomers);
        demoModeRef.current = true;
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customers",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomer = async () => {
    try {
      if (demoModeRef.current) {
        setCustomers(prev => [
          ...prev,
          {
            id: (prev.length + 1).toString(),
            email: newCustomer.email,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            user_metadata: {
              full_name: newCustomer.full_name,
              phone: newCustomer.phone,
              role: 'user'
            },
            bookings_count: 0
          }
        ]);
        setIsAddCustomerDialogOpen(false);
        setNewCustomer({
          email: '',
          password: '',
          full_name: '',
          phone: ''
        });
        return;
      }
      // Real mode
      const userData: CreateUserData = {
        email: newCustomer.email,
        password: newCustomer.password,
        user_metadata: {
          full_name: newCustomer.full_name,
          phone: newCustomer.phone,
          role: 'user'
        }
      };
      await adminService.createUser(userData);
      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      setIsAddCustomerDialogOpen(false);
      setNewCustomer({
        email: '',
        password: '',
        full_name: '',
        phone: ''
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
      toast({
        title: "Error",
        description: "Failed to create customer. Set up SUPABASE_SERVICE_ROLE_KEY for real customer management.",
        variant: "destructive",
      });
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;
    try {
      if (demoModeRef.current) {
        setCustomers(prev => prev.map(c =>
          c.id === selectedCustomer.id
            ? {
                ...c,
                user_metadata: {
                  ...c.user_metadata,
                  full_name: selectedCustomer.user_metadata.full_name,
                  phone: selectedCustomer.user_metadata.phone
                }
              }
            : c
        ));
        setIsEditCustomerDialogOpen(false);
        setSelectedCustomer(null);
        return;
      }
      // Real mode
      await adminService.updateUser({
        userId: selectedCustomer.id,
        user_metadata: {
          // Only role and status allowed
        }
      });
      toast({
        title: "Success",
        description: "Customer updated successfully",
      });
      setIsEditCustomerDialogOpen(false);
      setSelectedCustomer(null);
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      toast({
        title: "Error",
        description: "Failed to update customer. Set up SUPABASE_SERVICE_ROLE_KEY for real customer management.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      if (demoModeRef.current) {
        setCustomers(prev => prev.filter(c => c.id !== id));
        return;
      }
      await adminService.deleteUser(id);
      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer. Set up SUPABASE_SERVICE_ROLE_KEY for real customer management.",
        variant: "destructive",
      });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.user_metadata?.full_name?.toLowerCase().includes(searchTerm) ||
      customer.user_metadata?.phone?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Customer Management</h1>
          <Dialog open={isAddCustomerDialogOpen} onOpenChange={setIsAddCustomerDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Create a new customer account with the following details.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newCustomer.password}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={newCustomer.full_name}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddCustomerDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCustomer}>
                  Create Customer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>View and manage customer accounts</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search customers..."
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
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={customer.avatar_url} />
                            <AvatarFallback>
                              {customer.user_metadata?.full_name?.[0] || customer.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.user_metadata?.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.user_metadata?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{customer.user_metadata.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.bookings_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(customer.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {customer.last_sign_in_at 
                          ? format(new Date(customer.last_sign_in_at), 'MMM d, yyyy')
                          : 'Never'
                        }
                      </TableCell>
                      <TableCell>
                        <DropdownMenu open={openDropdownId === customer.id} onOpenChange={(open) => {
                          setOpenDropdownId(open ? customer.id : null);
                        }}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                            <DropdownMenuItem onClick={() => {
                              setSelectedCustomer(customer);
                              setIsEditCustomerDialogOpen(true);
                              setOpenDropdownId(null);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setSelectedCustomer(customer);
                              setIsViewCustomerDialogOpen(true);
                              setOpenDropdownId(null);
                            }}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setCustomerToDelete(customer.id);
                              setIsDeleteCustomerDialogOpen(true);
                              setOpenDropdownId(null);
                            }}>
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditCustomerDialogOpen} onOpenChange={setIsEditCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update the customer's details.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-full_name">Full Name</Label>
                <Input
                  id="edit-full_name"
                  value={selectedCustomer.user_metadata.full_name || ''}
                  onChange={(e) => setSelectedCustomer(prev => prev ? {
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
                  value={selectedCustomer.user_metadata.phone || ''}
                  onChange={(e) => setSelectedCustomer(prev => prev ? {
                    ...prev,
                    user_metadata: {
                      ...prev.user_metadata,
                      phone: e.target.value
                    }
                  } : null)}
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditCustomer}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Customer Dialog */}
      <Dialog open={isViewCustomerDialogOpen} onOpenChange={setIsViewCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              View customer details and information.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedCustomer.user_metadata.full_name || 'Not provided'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedCustomer.email}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedCustomer.user_metadata.phone || 'Not provided'}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Customer ID</Label>
                <div className="p-2 bg-muted rounded-md font-mono text-sm">
                  {selectedCustomer.id}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Joined Date</Label>
                <div className="p-2 bg-muted rounded-md">
                  {format(new Date(selectedCustomer.created_at), 'PPP')}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Last Sign In</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedCustomer.last_sign_in_at 
                    ? format(new Date(selectedCustomer.last_sign_in_at), 'PPP')
                    : 'Never'
                  }
                </div>
              </div>
              <div className="space-y-2">
                <Label>Total Bookings</Label>
                <div className="p-2 bg-muted rounded-md">
                  {selectedCustomer.bookings_count || 0} bookings
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsViewCustomerDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsViewCustomerDialogOpen(false);
              setIsEditCustomerDialogOpen(true);
            }}>
              Edit Customer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteCustomerDialogOpen} onOpenChange={setIsDeleteCustomerDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer?
            </DialogDescription>
          </DialogHeader>
          {customerToDelete && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="delete-customer-id">Customer ID</Label>
                <Input
                  id="delete-customer-id"
                  value={customerToDelete}
                  readOnly
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteCustomerDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (customerToDelete) {
                handleDeleteCustomer(customerToDelete);
              }
              setIsDeleteCustomerDialogOpen(false);
            }}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
} 