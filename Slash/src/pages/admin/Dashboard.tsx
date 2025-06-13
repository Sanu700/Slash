import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, TrendingUp, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Plus, Settings, BarChart3, UserCog, Download } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12.5%",
    trend: "up",
    icon: Users
  },
  {
    title: "Total Experiences",
    value: "567",
    change: "+8.3%",
    trend: "up",
    icon: Package
  },
  {
    title: "Total Revenue",
    value: "₹98,765",
    change: "+15.2%",
    trend: "up",
    icon: DollarSign
  },
  {
    title: "Active Bookings",
    value: "89",
    change: "-2.1%",
    trend: "down",
    icon: Calendar
  }
];

const recentActivity = [
  {
    type: "New User",
    description: "John Doe created an account",
    time: "5 minutes ago"
  },
  {
    type: "Booking",
    description: "Sarah Smith booked 'Sunset Cruise'",
    time: "15 minutes ago"
  },
  {
    type: "Payment",
    description: "Received payment of ₹5,000",
    time: "1 hour ago"
  },
  {
    type: "Review",
    description: "New 5-star review for 'Mountain Trek'",
    time: "2 hours ago"
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  const handleGenerateReport = () => {
    // Create a report object with current stats
    const report = {
      generatedAt: new Date().toISOString(),
      stats: stats.map(stat => ({
        title: stat.title,
        value: stat.value,
        change: stat.change
      })),
      recentActivity: recentActivity
    };

    // Convert to JSON and create a blob
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Report generated successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button 
            onClick={handleGenerateReport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{activity.type}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center justify-start px-4"
                onClick={() => navigate('/manage-experiences')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Experience
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start px-4"
                onClick={() => navigate('/admin/users')}
              >
                <UserCog className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start px-4"
                onClick={() => navigate('/admin/analytics')}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center justify-start px-4"
                onClick={() => navigate('/admin/settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current platform status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Server Status</span>
                <span className="text-green-500">Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Database</span>
                <span className="text-green-500">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span>API Status</span>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Last Backup</span>
                <span>2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 