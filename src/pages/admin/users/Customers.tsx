import React, { useState, useEffect } from 'react';
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

interface Customer {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  raw_user_meta_data: {
    full_name?: string;
    phone?: string;
    avatar_url?: string;
  };
  bookings_count?: number;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddCustomerDialogOpen, setIsAddCustomerDialogOpen] = useState(false);
  const [isEditCustomerDialogOpen, setIsEditCustomerDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      // Filter only customers (users without admin or provider role)
      const customerUsers = (users.users || []).filter(u => 
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
            id: user.id,
            email: user.email ?? "",
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            raw_user_meta_data: user.user_metadata || {},
            bookings_count: count || 0
          };
        })
      );

      setCustomers(customersWithBookings);
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
      const { data, error } = await supabase.auth.admin.createUser({
        email: newCustomer.email,
        password: newCustomer.password,
        user_metadata: {
          full_name: newCustomer.full_name,
          phone: newCustomer.phone,
          role: 'user'
        }
      });

      if (error) throw error;

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
        description: "Failed to create customer",
        variant: "destructive",
      });
    }
  };

  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;

    try {
      const { error } = await supabase.auth.admin.updateUserById(
        selectedCustomer.id,
        {
          user_metadata: {
            full_name: selectedCustomer.raw_user_meta_data.full_name,
            phone: selectedCustomer.raw_user_meta_data.phone
          }
        }
      );

      if (error) throw error;

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
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer deleted successfully",
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      customer.email.toLowerCase().includes(searchTerm) ||
      customer.raw_user_meta_data?.full_name?.toLowerCase().includes(searchTerm) ||
      customer.raw_user_meta_data?.phone?.toLowerCase().includes(searchTerm)
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
                            <AvatarImage src={customer.raw_user_meta_data?.avatar_url} />
                            <AvatarFallback>
                              {customer.raw_user_meta_data?.full_name?.[0] || customer.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{customer.raw_user_meta_data?.full_name || 'No name'}</div>
                            <div className="text-sm text-muted-foreground">{customer.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{customer.email}</span>
                        </div>
                        {customer.raw_user_meta_data?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{customer.raw_user_meta_data.phone}</span>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedCustomer(customer);
                              setIsEditCustomerDialogOpen(true);
                            }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteCustomer(customer.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link to={`/profile/${customer.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
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
                  value={selectedCustomer.raw_user_meta_data.full_name || ''}
                  onChange={(e) => setSelectedCustomer(prev => prev ? {
                    ...prev,
                    raw_user_meta_data: {
                      ...prev.raw_user_meta_data,
                      full_name: e.target.value
                    }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={selectedCustomer.raw_user_meta_data.phone || ''}
                  onChange={(e) => setSelectedCustomer(prev => prev ? {
                    ...prev,
                    raw_user_meta_data: {
                      ...prev.raw_user_meta_data,
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
    </AdminLayout>
  );
} 