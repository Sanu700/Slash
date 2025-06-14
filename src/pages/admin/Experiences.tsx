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
import { toast } from 'sonner';

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
  const [experiences, setExperiences] = useState(mockExperiences);
  const [modal, setModal] = useState<{ type: string, experience: any } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExperience, setNewExperience] = useState({
    name: '', provider: '', location: '', price: '', duration: '', category: '', status: 'active', rating: 0, bookings: 0, lastUpdated: ''
  });

  const filteredExperiences = experiences.filter(experience =>
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

  const handleAction = (type: string, experience: any) => setModal({ type, experience });
  const closeModal = () => setModal(null);
  const handleSuspend = (id: string) => {
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, status: e.status === 'suspended' ? 'active' : 'suspended' } : e));
    toast.success('Experience status updated!');
    closeModal();
  };
  const exportToCSV = () => {
    const headers = ['Name', 'Provider', 'Location', 'Category', 'Price', 'Duration', 'Status', 'Rating', 'Bookings', 'Last Updated'];
    const rows = filteredExperiences.map(e => [e.name, e.provider, e.location, e.category, e.price, e.duration, e.status, e.rating, e.bookings, e.lastUpdated]);
    let csv = headers.join(',') + '\n';
    csv += rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'experiences.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
                <Button variant="outline" onClick={exportToCSV}>Export Data</Button>
                <Button onClick={() => setShowAddModal(true)}>Add New Experience</Button>
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
                          <DropdownMenuItem onClick={() => handleAction('details', experience)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('edit', experience)}>Edit Experience</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('bookings', experience)}>View Bookings</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('reviews', experience)}>View Reviews</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleAction('suspend', experience)}>
                            {experience.status === 'suspended' ? 'Activate Experience' : 'Suspend Experience'}
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

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Experience</h2>
            <div className="mb-4 space-y-2">
              <Input placeholder="Name" value={newExperience.name} onChange={e => setNewExperience({ ...newExperience, name: e.target.value })} />
              <Input placeholder="Provider" value={newExperience.provider} onChange={e => setNewExperience({ ...newExperience, provider: e.target.value })} />
              <Input placeholder="Location" value={newExperience.location} onChange={e => setNewExperience({ ...newExperience, location: e.target.value })} />
              <Input placeholder="Category" value={newExperience.category} onChange={e => setNewExperience({ ...newExperience, category: e.target.value })} />
              <Input placeholder="Price" type="number" value={newExperience.price} onChange={e => setNewExperience({ ...newExperience, price: e.target.value })} />
              <Input placeholder="Duration" value={newExperience.duration} onChange={e => setNewExperience({ ...newExperience, duration: e.target.value })} />
            </div>
            <Button className="w-full" onClick={() => {
              if (!newExperience.name || !newExperience.provider || !newExperience.location || !newExperience.category || !newExperience.price || !newExperience.duration) {
                toast.error('Please fill all fields');
                return;
              }
              setExperiences(prev => [
                ...prev,
                { ...newExperience, price: Number(newExperience.price), id: (prev.length + 1).toString(), rating: 0, bookings: 0, lastUpdated: new Date().toISOString().slice(0, 10) }
              ]);
              setShowAddModal(false);
              setNewExperience({ name: '', provider: '', location: '', price: '', duration: '', category: '', status: 'active', rating: 0, bookings: 0, lastUpdated: '' });
              toast.success('Experience added!');
            }} disabled={!newExperience.name || !newExperience.provider || !newExperience.location || !newExperience.category || !newExperience.price || !newExperience.duration}>Add</Button>
            <Button variant="outline" className="w-full mt-2" onClick={() => setShowAddModal(false)}>Cancel</Button>
          </div>
        </div>
      )}
      {modal && modal.type === 'details' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Experience Details</h2>
            <div className="mb-4">
              <div><b>Name:</b> {modal.experience.name}</div>
              <div><b>Provider:</b> {modal.experience.provider}</div>
              <div><b>Location:</b> {modal.experience.location}</div>
              <div><b>Category:</b> {modal.experience.category}</div>
              <div><b>Price:</b> {modal.experience.price}</div>
              <div><b>Duration:</b> {modal.experience.duration}</div>
              <div><b>Status:</b> {modal.experience.status}</div>
              <div><b>Rating:</b> {modal.experience.rating}</div>
              <div><b>Bookings:</b> {modal.experience.bookings}</div>
              <div><b>Last Updated:</b> {modal.experience.lastUpdated}</div>
            </div>
            <Button onClick={closeModal} className="w-full">Close</Button>
          </div>
        </div>
      )}
      {modal && modal.type === 'edit' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Edit Experience</h2>
            <div className="mb-4 space-y-2">
              <Input value={modal.experience.name} onChange={e => setModal(m => m && { ...m, experience: { ...m.experience, name: e.target.value } })} />
              <Input value={modal.experience.provider} onChange={e => setModal(m => m && { ...m, experience: { ...m.experience, provider: e.target.value } })} />
              <Input value={modal.experience.location} onChange={e => setModal(m => m && { ...m, experience: { ...m.experience, location: e.target.value } })} />
              <Input value={modal.experience.category} onChange={e => setModal(m => m && { ...m, experience: { ...m.experience, category: e.target.value } })} />
              <Input value={modal.experience.price} type="number" onChange={e => setModal(m => m && { ...m, experience: { ...m.experience, price: e.target.value } })} />
              <Input value={modal.experience.duration} onChange={e => setModal(m => m && { ...m, experience: { ...m.experience, duration: e.target.value } })} />
            </div>
            <Button className="w-full" onClick={() => {
              setExperiences(prev => prev.map(e => e.id === modal.experience.id ? { ...modal.experience, price: Number(modal.experience.price) } : e));
              closeModal();
              toast.success('Experience updated!');
            }}>Save</Button>
            <Button variant="outline" className="w-full mt-2" onClick={closeModal}>Cancel</Button>
          </div>
        </div>
      )}
      {modal && modal.type === 'bookings' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Bookings for {modal.experience.name}</h2>
            <div className="mb-4">
              <ul className="list-disc pl-5">
                <li>John Doe - 2024-03-10 - Confirmed</li>
                <li>Jane Smith - 2024-03-12 - Cancelled</li>
              </ul>
            </div>
            <Button onClick={closeModal} className="w-full">Close</Button>
          </div>
        </div>
      )}
      {modal && modal.type === 'reviews' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Reviews for {modal.experience.name}</h2>
            <div className="mb-4">
              <ul className="list-disc pl-5">
                <li><b>John Doe:</b> 5★ - Amazing experience!</li>
                <li><b>Jane Smith:</b> 4★ - Great but could be longer.</li>
              </ul>
            </div>
            <Button onClick={closeModal} className="w-full">Close</Button>
          </div>
        </div>
      )}
      {modal && modal.type === 'suspend' && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">{modal.experience.status === 'suspended' ? 'Activate Experience' : 'Suspend Experience'}</h2>
            <div className="mb-4">Are you sure you want to {modal.experience.status === 'suspended' ? 'activate' : 'suspend'} {modal.experience.name}?</div>
            <Button onClick={() => handleSuspend(modal.experience.id)} className="w-full" variant={modal.experience.status === 'suspended' ? 'default' : 'destructive'}>{modal.experience.status === 'suspended' ? 'Activate' : 'Suspend'}</Button>
            <Button variant="outline" onClick={closeModal} className="w-full mt-2">Cancel</Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Experiences; 