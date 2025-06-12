import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreVertical, Search, Plus, MessageSquare, Clock, User, Tag } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";

const mockTickets = [
  {
    id: "1",
    user: "John Doe",
    subject: "Booking Cancellation Issue",
    category: "Bookings",
    status: "open",
    priority: "high",
    lastUpdated: "2024-03-15T10:30:00",
    assignedTo: "Support Team",
  },
  {
    id: "2",
    user: "Jane Smith",
    subject: "Payment Refund Request",
    category: "Payments",
    status: "in-progress",
    priority: "medium",
    lastUpdated: "2024-03-14T15:45:00",
    assignedTo: "Finance Team",
  },
  {
    id: "3",
    user: "Mike Johnson",
    subject: "Account Access Problem",
    category: "Account",
    status: "resolved",
    priority: "low",
    lastUpdated: "2024-03-13T09:15:00",
    assignedTo: "Support Team",
  },
];

const categories = ["All", "Bookings", "Payments", "Account", "Technical", "Other"];

export default function Support() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ticket.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      open: "default" as const,
      "in-progress": "secondary" as const,
      resolved: "outline" as const,
    };
    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {status.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive" as const,
      medium: "default" as const,
      low: "secondary" as const,
    };
    return (
      <Badge variant={variants[priority as keyof typeof variants]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground">
              Manage customer support tickets and inquiries
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tickets..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Tickets</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Support Tickets</CardTitle>
                <CardDescription>
                  View and manage customer support tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow 
                        key={ticket.id}
                        className={selectedTicket?.id === ticket.id ? "bg-accent" : ""}
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {ticket.user}
                          </div>
                        </TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            {ticket.category}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                        <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                        <TableCell>{ticket.assignedTo}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {new Date(ticket.lastUpdated).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Reply
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Assign to Me
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Mark as {ticket.status === "open" ? "In Progress" : "Resolved"}
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
          </TabsContent>
        </Tabs>

        {/* Ticket Details */}
        {selectedTicket && (
          <Card>
            <CardHeader>
              <CardTitle>Ticket Details</CardTitle>
              <CardDescription>
                Ticket #{selectedTicket.id} - {selectedTicket.subject}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">User</h3>
                  <p>{selectedTicket.user}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Category</h3>
                  <p>{selectedTicket.category}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <p>{getStatusBadge(selectedTicket.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Priority</h3>
                  <p>{getPriorityBadge(selectedTicket.priority)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Assigned To</h3>
                  <p>{selectedTicket.assignedTo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                  <p>{new Date(selectedTicket.lastUpdated).toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Conversation</h3>
                <div className="space-y-4">
                  {/* Add conversation messages here */}
                  <p className="text-muted-foreground">No messages yet.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
                <Button variant="outline">
                  Assign to Me
                </Button>
                <Button variant="outline">
                  Mark as {selectedTicket.status === "open" ? "In Progress" : "Resolved"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
} 