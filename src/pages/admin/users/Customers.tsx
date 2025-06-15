import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, Phone, ShoppingBag } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

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