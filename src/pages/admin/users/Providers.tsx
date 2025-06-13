import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Mail, Phone, Calendar, MapPin, Star, Eye } from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  getProviders, updateProviderStatus, getProviderDetails
} from '@/lib/services/provider';
import { Provider } from '@/lib/data/types';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const result = await getProviders();
      if (result.success && result.data) {
        setProviders(result.data as Provider[]);
      } else {
        toast.error('Failed to fetch providers');
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('An error occurred while fetching providers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (providerId: string, newStatus: Provider['status']) => {
    try {
      const result = await updateProviderStatus(providerId, newStatus);
      if (result.success) {
        toast.success('Provider status updated successfully');
        fetchProviders();
      } else {
        toast.error('Failed to update provider status');
      }
    } catch (error) {
      console.error('Error updating provider status:', error);
      toast.error('An error occurred while updating provider status');
    }
  };

  const handleViewDetails = async (providerId: string) => {
    try {
      const result = await getProviderDetails(providerId);
      if (result.success && result.data) {
        setSelectedProvider(result.data as Provider);
        setShowDetailsDialog(true);
      } else {
        toast.error('Failed to fetch provider details');
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
      toast.error('An error occurred while fetching provider details');
    }
  };

  const filteredProviders = providers.filter(provider =>
    provider.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Provider['status']) => {
    const variants = {
      active: "success",
      inactive: "secondary",
      suspended: "destructive",
      pending: "warning"
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Experience Providers</h1>
          <p className="text-muted-foreground">
            Manage experience providers and their listings
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Provider Management</CardTitle>
            <CardDescription>View and manage all experience providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>Export Data</Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Experiences</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map(provider => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.companyName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {provider.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-2 h-4 w-4" />
                          {provider.contactNo}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {provider.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {new Date(provider.joinDate).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(provider.status)}</TableCell>
                    <TableCell>{provider.experiences}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-400 fill-yellow-400" />
                        {provider.rating.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewDetails(provider.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(provider.id, 'active')} disabled={provider.status === 'active'}>
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(provider.id, 'inactive')} disabled={provider.status === 'inactive'}>
                            Deactivate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusUpdate(provider.id, 'suspended')} disabled={provider.status === 'suspended'} className="text-red-600">
                            Suspend
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

        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Provider Details</DialogTitle>
              <DialogDescription>Detailed information about the provider and their experiences</DialogDescription>
            </DialogHeader>

            {selectedProvider && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Company Information</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="text-muted-foreground">Name:</span> {selectedProvider.companyName}</p>
                      <p><span className="text-muted-foreground">Email:</span> {selectedProvider.email}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {selectedProvider.contactNo}</p>
                      <p><span className="text-muted-foreground">Location:</span> {selectedProvider.location}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Performance Metrics</h3>
                    <div className="mt-2 space-y-2">
                      <p><span className="text-muted-foreground">Total Experiences:</span> {selectedProvider.experiences}</p>
                      <p><span className="text-muted-foreground">Average Rating:</span> {selectedProvider.rating.toFixed(1)}</p>
                      <p><span className="text-muted-foreground">Status:</span> {selectedProvider.status}</p>
                      <p><span className="text-muted-foreground">Member Since:</span> {new Date(selectedProvider.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {selectedProvider.experienceDetails && (
                  <div>
                    <h3 className="font-medium mb-2">Latest Experience Submission</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium">{selectedProvider.experienceDetails.name}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{selectedProvider.experienceDetails.description}</p>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <p><span className="text-muted-foreground">Price:</span> ₹{selectedProvider.experienceDetails.price}</p>
                        <p><span className="text-muted-foreground">Duration:</span> {selectedProvider.experienceDetails.duration}</p>
                        <p><span className="text-muted-foreground">Category:</span> {selectedProvider.experienceDetails.category}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Providers;
