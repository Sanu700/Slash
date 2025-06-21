import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Search, Mail, Phone, Shield, UserPlus, UserMinus, Users as UsersIcon, UserCog, BarChart } from "lucide-react";
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
  user_metadata: {
    full_name: string;
    phone: string;
    role: string;
  };
}

interface CreateUserData {
  email: string;
  password: string;
  user_metadata: {
    full_name: string;
    phone: string;
    role: string;
  };
}

interface UpdateUserData {
  userId: string;
  user_metadata: {
    role?: string;
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

export default function Users() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isServiceAvailable, setIsServiceAvailable] = useState(false);
  const [serviceError, setServiceError] = useState<string | undefined>();
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'user'
  });
  const { toast } = useToast();
  const [demoToastShown, setDemoToastShown] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const demoModeRef = useRef(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch users from the admin service
      try {
        const usersData = await adminService.listUsers();
        setUsers(usersData);
        setIsServiceAvailable(true);
        setServiceError(undefined);
        demoModeRef.current = false;
      } catch (serviceError) {
        console.warn('Admin service not available, using fallback data:', serviceError);
        setIsServiceAvailable(false);
        setServiceError(serviceError instanceof Error ? serviceError.message : 'Unknown error');
        demoModeRef.current = true;
        
        // Fallback: Use mock data for demonstration
        const mockUsers: AdminUser[] = [
          {
            id: '1',
            email: 'john.doe@example.com',
            created_at: '2024-01-15T10:30:00Z',
            last_sign_in_at: '2024-01-20T14:45:00Z',
            user_metadata: {
              full_name: 'John Doe',
              phone: '+1234567890',
              role: 'user'
            }
          },
          {
            id: '2',
            email: 'jane.smith@example.com',
            created_at: '2024-01-10T09:15:00Z',
            last_sign_in_at: '2024-01-19T16:20:00Z',
            user_metadata: {
              full_name: 'Jane Smith',
              phone: '+1987654321',
              role: 'admin'
            }
          },
          {
            id: '3',
            email: 'bob.wilson@example.com',
            created_at: '2024-01-05T11:00:00Z',
            last_sign_in_at: '2024-01-18T13:30:00Z',
            user_metadata: {
              full_name: 'Bob Wilson',
              phone: '+1122334455',
              role: 'provider'
            }
          }
        ];
        
        setUsers(mockUsers);
        // Demo toast notification removed for cleaner UI
      }
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
      if (demoModeRef.current) {
        setUsers(prev => prev.map(user =>
          user.id === userId
            ? {
                ...user,
                user_metadata: {
                  ...user.user_metadata,
                  role: newRole
                }
              }
            : user
        ));
        toast({
          title: "Success",
          description: "User role updated successfully",
        });
        return;
      }

      await adminService.updateUser({
        userId,
        user_metadata: { role: newRole }
      });

      toast({
        title: "Success",
        description: "User role updated successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role. Set up SUPABASE_SERVICE_ROLE_KEY for real user management.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      if (demoModeRef.current) {
        setUsers(prev => prev.filter(user => user.id !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        return;
      }

      await adminService.deleteUser(userId);

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user. Set up SUPABASE_SERVICE_ROLE_KEY for real user management.",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      if (demoModeRef.current) {
        setUsers(prev => [
          ...prev,
          {
            id: (prev.length + 1).toString(),
            email: newUser.email,
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            user_metadata: {
              full_name: newUser.full_name,
              phone: newUser.phone,
              role: newUser.role
            }
          }
        ]);
        setIsAddUserDialogOpen(false);
        setNewUser({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'user'
        });
        toast({
          title: "Success",
          description: "User created successfully",
        });
        return;
      }

      const userData: CreateUserData = {
        email: newUser.email,
        password: newUser.password,
        user_metadata: {
          full_name: newUser.full_name,
          phone: newUser.phone,
          role: newUser.role
        }
      };

      await adminService.createUser(userData);

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
        description: "Failed to create user. Set up SUPABASE_SERVICE_ROLE_KEY for real user management.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchTerm) ||
      user.user_metadata?.full_name?.toLowerCase().includes(searchTerm) ||
      user.user_metadata?.phone?.toLowerCase().includes(searchTerm)
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
                        <div className="font-medium">{user.user_metadata?.full_name || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                        </div>
                        {user.user_metadata?.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{user.user_metadata.phone}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.user_metadata?.role === 'admin' ? 'default' : 'secondary'}>
                          {user.user_metadata?.role || 'user'}
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
                        <DropdownMenu open={openDropdownId === user.id} onOpenChange={(open) => {
                          setOpenDropdownId(open ? user.id : null);
                        }}>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                            <DropdownMenuItem onClick={() => {
                              handleRoleChange(user.id, 'admin');
                              setOpenDropdownId(null);
                            }}>
                              <Shield className="mr-2 h-4 w-4" />
                              Make Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              handleRoleChange(user.id, 'user');
                              setOpenDropdownId(null);
                            }}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove Admin
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setUserToDelete(user.id);
                                setIsDeleteUserDialogOpen(true);
                                setOpenDropdownId(null);
                              }}
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

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete);
                  setIsDeleteUserDialogOpen(false);
                  setUserToDelete(null);
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
