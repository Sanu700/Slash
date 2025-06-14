import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, MoreVertical, Mail, Phone, Calendar, Users } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

// Mock data - replace with actual data from your backend
const mockCustomers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    joinDate: "2024-01-15",
    status: "active",
    bookings: 5
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+91 98765 43211",
    joinDate: "2024-02-01",
    status: "active",
    bookings: 3
  },
  // Add more mock data as needed
];

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState(mockCustomers);
  const [modal, setModal] = useState<{ type: string, customer: any } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '', joinDate: '', status: 'active', bookings: 0 });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default" as const,
      inactive: "secondary" as const,
      suspended: "destructive" as const
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const handleAction = (type: string, customer: any) => setModal({ type, customer });
  const closeModal = () => setModal(null);

  const handleSuspend = (id: string) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, status: 'suspended' } : c));
    toast.success('Account suspended!');
    closeModal();
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Join Date', 'Status', 'Bookings'];
    const rows = filteredCustomers.map(c => [c.name, c.email, c.phone, c.joinDate, c.status, c.bookings]);
    let csv = headers.join(',') + '\n';
    csv += rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-muted-foreground">
          Manage your customer accounts and view their activity
        </p>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-gray-800" />
              <CardTitle>Customer Management</CardTitle>
              <Button className="ml-auto" onClick={() => setShowAddModal(true)}>Add New Customer</Button>
            </div>
            <CardDescription>
              View and manage all customer accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
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
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                          {customer.email}
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Phone className="mr-2 h-4 w-4" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {customer.joinDate}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>{customer.bookings}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleAction('details', customer)}>View Details</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('bookings', customer)}>View Bookings</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAction('message', customer)}>Send Message</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleAction('suspend', customer)}>
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

        {/* Modals */}
        {modal && modal.type === 'details' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Customer Details</h2>
              <div className="mb-4">
                <div><b>Name:</b> {modal.customer.name}</div>
                <div><b>Email:</b> {modal.customer.email}</div>
                <div><b>Phone:</b> {modal.customer.phone}</div>
                <div><b>Join Date:</b> {modal.customer.joinDate}</div>
                <div><b>Status:</b> {modal.customer.status}</div>
                <div><b>Bookings:</b> {modal.customer.bookings}</div>
              </div>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          </div>
        )}
        {modal && modal.type === 'bookings' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Bookings for {modal.customer.name}</h2>
              <div className="mb-4">
                <ul className="list-disc pl-5">
                  <li>Mumbai Street Food Tour - 2024-03-10 - Confirmed</li>
                  <li>Old Delhi Heritage Walk - 2024-03-12 - Cancelled</li>
                </ul>
              </div>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          </div>
        )}
        {modal && modal.type === 'reviews' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Reviews for {modal.customer.name}</h2>
              <div className="mb-4">
                <ul className="list-disc pl-5">
                  <li><b>Adventure Tours India:</b> 5★ - Great customer!</li>
                  <li><b>Heritage Walks:</b> 4★ - Enjoyed the experience.</li>
                </ul>
              </div>
              <Button onClick={closeModal} className="w-full">Close</Button>
            </div>
          </div>
        )}
        {modal && modal.type === 'message' && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-2">Send Message to {modal.customer.name}</h2>
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
              <h2 className="text-xl font-bold mb-2">Suspend Account</h2>
              <div className="mb-4">Are you sure you want to suspend {modal.customer.name}'s account?</div>
              <Button onClick={() => handleSuspend(modal.customer.id)} className="w-full" variant="destructive">Suspend</Button>
              <Button variant="outline" onClick={closeModal} className="w-full mt-2">Cancel</Button>
            </div>
          </div>
        )}
        {showAddModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
              <div className="mb-4 space-y-2">
                <Input placeholder="Name" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
                <Input placeholder="Email" value={newCustomer.email} onChange={e => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                <Input placeholder="Phone" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                <Input placeholder="Join Date" type="date" value={newCustomer.joinDate} onChange={e => setNewCustomer({ ...newCustomer, joinDate: e.target.value })} />
              </div>
              <Button className="w-full" onClick={() => {
                if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.joinDate) {
                  toast.error('Please fill all fields');
                  return;
                }
                setCustomers(prev => [
                  ...prev,
                  { ...newCustomer, id: (prev.length + 1).toString(), bookings: 0 }
                ]);
                setShowAddModal(false);
                setNewCustomer({ name: '', email: '', phone: '', joinDate: '', status: 'active', bookings: 0 });
                toast.success('Customer added!');
              }} disabled={!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.joinDate}>Add</Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => setShowAddModal(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Customers; 