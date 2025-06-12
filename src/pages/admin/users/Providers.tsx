import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Mail, Phone, Calendar, MapPin, Star } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with actual data from your backend
const mockProviders = [
  {
    id: "1",
    name: "Adventure Tours India",
    email: "contact@adventuretours.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    joinDate: "2024-01-15",
    status: "active",
    experiences: 8,
    rating: 4.8
  },
  {
    id: "2",
    name: "Heritage Walks",
    email: "info@heritagewalks.com",
    phone: "+91 98765 43211",
    location: "Delhi, NCR",
    joinDate: "2024-02-01",
    status: "active",
    experiences: 5,
    rating: 4.5
  },
  // Add more mock data as needed
];

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProviders = mockProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default" as const,
      inactive: "secondary" as const,
      suspended: "destructive" as const
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const mockApplications = [
    {
      id: "app1",
      companyName: "New Adventure Co.",
      email: "apply@adventureco.com",
      contactNo: "+91 99999 88888",
      experienceName: "Jungle Safari",
      description: "A thrilling jungle safari experience.",
      price: "2000",
      location: "Goa",
      duration: "5 hours",
      participants: "20",
      date: "2024-07-01",
      category: "Adventure"
    },
    // ...more applications
  ];

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
            <CardDescription>
              View and manage all experience providers
            </CardDescription>
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
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProviders.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell className="font-medium">{provider.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {provider.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-2 h-4 w-4" />
                          {provider.phone}
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
                        {provider.joinDate}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(provider.status)}</TableCell>
                    <TableCell>{provider.experiences}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        {provider.rating}
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
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>View Experiences</DropdownMenuItem>
                          <DropdownMenuItem>View Reviews</DropdownMenuItem>
                          <DropdownMenuItem>Send Message</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Suspend Account
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

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Provider Applications</CardTitle>
            <CardDescription>Review new provider applications</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApplications.map(app => (
                  <TableRow key={app.id}>
                    <TableCell>{app.companyName}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>{app.experienceName}</TableCell>
                    <TableCell>{app.location}</TableCell>
                    <TableCell>{app.date}</TableCell>
                    <TableCell>{app.category}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Providers; 
