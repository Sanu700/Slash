import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Mail, Phone, Shield, UserPlus, UserMinus, Users as UsersIcon, UserCog, BarChart } from "lucide-react";
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

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  raw_user_meta_data: {
    full_name?: string;
    phone?: string;
    role?: string;
  };
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'user'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) throw error;
      
      setUsers(
        (data.users || []).map(u => ({
          id: u.id,
          email: u.email ?? "",
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          raw_user_meta_data: u.user_metadata || {}
        }))
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role: newRole } }
      );

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
          full_name: newUser.full_name,
          phone: newUser.phone,
          role: newUser.role
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "User created successfully",
      });

      setIsAddUserDialogOpen(false);
      setNewUser({
        email: '',
        password: '',
        full_name: '',
        phone: '',
        role: 'user'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTerm) ||
      user.raw_user_meta_data?.full_name?.toLowerCase().includes(searchTerm) ||
      user.raw_user_meta_data?.phone?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex gap-2">
            <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" /> Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                  <DialogDescription>
                    Create a new user account with the following details.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={newUser.full_name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, full_name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      className="w-full p-2 border rounded-md"
                      value={newUser.role}
                      onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="provider">Provider</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>
                    Create User
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Link to="/admin/users/customers">
              <Button variant="outline" className="flex items-center gap-2">
                <UsersIcon className="h-4 w-4" /> Customers
              </Button>
            </Link>
            <Link to="/admin/users/providers">
              <Button variant="outline" className="flex items-center gap-2">
                <UserCog className="h-4 w-4" /> Providers
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" /> Analytics
              </Button>
            </Link>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
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
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="font-medium">{user.raw_user_meta_data?.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.raw_user_meta_data?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{user.raw_user_meta_data.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.raw_user_meta_data?.role === 'admin' ? 'default' : 'secondary'}>
                          {user.raw_user_meta_data?.role || 'user'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {user.last_sign_in_at 
                          ? format(new Date(user.last_sign_in_at), 'MMM d, yyyy')
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
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')}>
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600"
                            >
                              <UserMinus className="mr-2 h-4 w-4" />
                              Delete User
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
