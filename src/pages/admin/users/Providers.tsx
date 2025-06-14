import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Mail, Phone, Calendar, MapPin, Star, Briefcase } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

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
  const [providers, setProviders] = useState(mockProviders);
  const [modal, setModal] = useState<{ type: string, provider: any } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', email: '', phone: '', location: '', joinDate: '', status: 'active', experiences: 0, rating: 0 });

  const filteredProviders = providers.filter(provider =>
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

  const handleAction = (type: string, provider: any) => setModal({ type, provider });
  const closeModal = () => setModal(null);

  const handleSuspend = (id: string) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'suspended' ? 'active' : 'suspended' } : p));
    toast.success('Account status updated!');
    closeModal();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Location', 'Join Date', 'Status', 'Experiences', 'Rating'];
    const rows = filteredProviders.map(p => [p.name, p.email, p.phone, p.location, p.joinDate, p.status, p.experiences, p.rating]);
    let csv = headers.join(',') + '\n';
    csv += rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'providers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Experience Providers</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your experience provider accounts and view their activity
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Provider Management</CardTitle>
            <CardDescription>
              View and manage all experience providers
            </CardDescription>
            <Button className="ml-auto" onClick={() => setShowAddModal(true)}>Add New Provider</Button>
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
              <Button onClick={exportToCSV}>Export Data</Button>
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
                          <DropdownMenuItem onClick={() => handleAction('details', provider)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('experiences', provider)}>View Experiences</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('reviews', provider)}>View Reviews</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('message', provider)}>Send Message</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleAction('suspend', provider)}>
                            {provider.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
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

        {/* Modals */}
        {modal && modal.type === 'details' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Provider Details</h2>
              <div className="mb-4">
                <div><b>Name:</b> {modal.provider.name}</div>
                <div><b>Email:</b> {modal.provider.email}</div>
                <div><b>Phone:</b> {modal.provider.phone}</div>
                <div><b>Location:</b> {modal.provider.location}</div>
                <div><b>Join Date:</b> {modal.provider.joinDate}</div>
                <div><b>Status:</b> {modal.provider.status}</div>
                <div><b>Experiences:</b> {modal.provider.experiences}</div>
                <div><b>Rating:</b> {modal.provider.rating}</div>
              </div>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          </div>
        )}
        {modal && modal.type === 'experiences' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Experiences by {modal.provider.name}</h2>
              <div className="mb-4">
                <ul className="list-disc pl-5">
                  <li>Mumbai Street Food Tour</li>
                  <li>Old Delhi Heritage Walk</li>
                </ul>
              </div>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          </div>
        )}
        {modal && modal.type === 'reviews' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Reviews for {modal.provider.name}</h2>
              <div className="mb-4">
                <ul className="list-disc pl-5">
                  <li><b>John Doe:</b> 5★ - Excellent guide!</li>
                  <li><b>Jane Smith:</b> 4★ - Very informative.</li>
                </ul>
              </div>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          </div>
        )}
        {modal && modal.type === 'message' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Send Message to {modal.provider.name}</h2>
              <div className="mb-4">
                <textarea className="w-full border rounded p-2" rows={3} placeholder="Type your message..." />
              </div>
              <Button onClick={() => { toast.success('Message sent!'); closeModal(); }} className="w-full">Send</Button>
              <Button variant="outline" onClick={closeModal} className="w-full mt-2">Cancel</Button>
            </div>
          </div>
        )}
        {modal && modal.type === 'suspend' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">{modal.provider.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}</h2>
              <div className="mb-4">Are you sure you want to {modal.provider.status === 'suspended' ? 'activate' : 'suspend'} {modal.provider.name}'s account?</div>
              <Button onClick={() => handleSuspend(modal.provider.id)} className="w-full" variant={modal.provider.status === 'suspended' ? 'default' : 'destructive'}>{modal.provider.status === 'suspended' ? 'Activate' : 'Suspend'}</Button>
              <Button variant="outline" onClick={closeModal} className="w-full mt-2">Cancel</Button>
            </div>
          </div>
        )}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Provider</h2>
              <div className="mb-4 space-y-2">
                <Input placeholder="Name" value={newProvider.name} onChange={e => setNewProvider({ ...newProvider, name: e.target.value })} />
                <Input placeholder="Email" value={newProvider.email} onChange={e => setNewProvider({ ...newProvider, email: e.target.value })} />
                <Input placeholder="Phone" value={newProvider.phone} onChange={e => setNewProvider({ ...newProvider, phone: e.target.value })} />
                <Input placeholder="Location" value={newProvider.location} onChange={e => setNewProvider({ ...newProvider, location: e.target.value })} />
                <Input placeholder="Join Date" type="date" value={newProvider.joinDate} onChange={e => setNewProvider({ ...newProvider, joinDate: e.target.value })} />
              </div>
              <Button className="w-full" onClick={() => {
                if (!newProvider.name || !newProvider.email || !newProvider.phone || !newProvider.location || !newProvider.joinDate) {
                  toast.error('Please fill all fields');
                  return;
                }
                setProviders(prev => [
                  ...prev,
                  { ...newProvider, id: (prev.length + 1).toString(), experiences: 0, rating: 0 }
                ]);
                setShowAddModal(false);
                setNewProvider({ name: '', email: '', phone: '', location: '', joinDate: '', status: 'active', experiences: 0, rating: 0 });
                toast.success('Provider added!');
              }} disabled={!newProvider.name || !newProvider.email || !newProvider.phone || !newProvider.location || !newProvider.joinDate}>Add</Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Providers; 