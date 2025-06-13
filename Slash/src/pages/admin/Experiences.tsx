import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, MapPin, Star, Calendar, IndianRupee, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with actual data from your backend
const mockExperiences = [
  {
    id: "1",
    name: "Mumbai Street Food Tour",
    provider: "Adventure Tours India",
    location: "Mumbai, Maharashtra",
    price: 1500,
    duration: "3 hours",
    category: "Food & Drink",
    status: "active",
    rating: 4.8,
    bookings: 156,
    lastUpdated: "2024-03-15"
  },
  {
    id: "2",
    name: "Old Delhi Heritage Walk",
    provider: "Heritage Walks",
    location: "Delhi, NCR",
    price: 2000,
    duration: "4 hours",
    category: "Cultural",
    status: "active",
    rating: 4.5,
    bookings: 89,
    lastUpdated: "2024-03-10"
  },
  // Add more mock data as needed
];

const Experiences = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredExperiences = mockExperiences.filter(experience =>
    experience.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    experience.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    experience.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default" as const,
      inactive: "secondary" as const,
      suspended: "destructive" as const
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Experiences</h1>
          <p className="text-muted-foreground">
            Manage all experiences and their details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Experience Management</CardTitle>
            <CardDescription>
              View and manage all experiences listed on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search experiences..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline">Export Data</Button>
                <Button>Add New Experience</Button>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Experience Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExperiences.map((experience) => (
                  <TableRow key={experience.id}>
                    <TableCell className="font-medium">{experience.name}</TableCell>
                    <TableCell>{experience.provider}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                        {experience.location}
                      </div>
                    </TableCell>
                    <TableCell>{experience.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <IndianRupee className="mr-1 h-4 w-4 text-muted-foreground" />
                        {experience.price}
                      </div>
                    </TableCell>
                    <TableCell>{experience.duration}</TableCell>
                    <TableCell>{getStatusBadge(experience.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        {experience.rating}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                        {experience.bookings}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {experience.lastUpdated}
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
                          <DropdownMenuItem>Edit Experience</DropdownMenuItem>
                          <DropdownMenuItem>View Bookings</DropdownMenuItem>
                          <DropdownMenuItem>View Reviews</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Suspend Experience
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
      </div>
    </AdminLayout>
  );
};

export default Experiences; 