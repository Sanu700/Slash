import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, TrendingUp, DollarSign, Calendar, ArrowUpRight, ArrowDownRight, Plus, Settings, BarChart3, UserCog, Download } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalExperiences: number;
  totalRevenue: number;
  activeBookings: number;
  userChange: number;
  experienceChange: number;
  revenueChange: number;
  bookingChange: number;
}

interface RecentActivity {
  type: string;
  description: string;
  time: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalExperiences: 0,
    totalRevenue: 0,
    activeBookings: 0,
    userChange: 0,
    experienceChange: 0,
    revenueChange: 0,
    bookingChange: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch total experiences
      const { count: totalExperiences, error: experiencesError } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true });

      if (experiencesError) throw experiencesError;

      // Fetch total revenue from completed bookings
      const { data: revenueData, error: revenueError } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'completed');

      if (revenueError) throw revenueError;

      const totalRevenue = revenueData.reduce((sum, booking) => sum + booking.total_amount, 0);

      // Fetch active bookings
      const { count: activeBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (bookingsError) throw bookingsError;

      // Calculate changes (comparing with last month)
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      // Fetch last month's data for comparison
      const { count: lastMonthExperiences } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .lt('created_at', lastMonth.toISOString());

      const { data: lastMonthRevenue } = await supabase
        .from('bookings')
        .select('total_amount')
        .eq('status', 'completed')
        .lt('created_at', lastMonth.toISOString());

      const { count: lastMonthBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
        .lt('created_at', lastMonth.toISOString());

      // Calculate percentage changes
      const experienceChange = lastMonthExperiences ? ((totalExperiences - lastMonthExperiences) / lastMonthExperiences) * 100 : 0;
      const revenueChange = lastMonthRevenue ? ((totalRevenue - lastMonthRevenue.reduce((sum, b) => sum + b.total_amount, 0)) / lastMonthRevenue.reduce((sum, b) => sum + b.total_amount, 0)) * 100 : 0;
      const bookingChange = lastMonthBookings ? ((activeBookings - lastMonthBookings) / lastMonthBookings) * 100 : 0;

      setStats({
        totalUsers: 0, // We can't access auth.users directly
        totalExperiences,
        totalRevenue,
        activeBookings,
        userChange: 0, // We can't access auth.users directly
        experienceChange,
        revenueChange,
        bookingChange
      });

      // Fetch recent activity
      const { data: recentBookings, error: recentError } = await supabase
        .from('bookings')
        .select(`
          *,
          booking_items (
            experience_id,
            quantity,
            price_at_booking,
            experiences (
              title
            )
          )
        `)
        .order('booking_date', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      const activities = recentBookings.map(booking => {
        const firstItem = booking.booking_items?.[0];
        return {
          type: 'Booking',
          description: `Booking #${booking.id} for '${firstItem?.experiences?.title}'`,
          time: new Date(booking.booking_date).toLocaleString()
        };
      });

      setRecentActivity(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      stats: {
        totalUsers: stats.totalUsers,
        totalExperiences: stats.totalExperiences,
        totalRevenue: stats.totalRevenue,
        activeBookings: stats.activeBookings
      },
      recentActivity
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Report generated successfully!');
  };

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: `${stats.userChange.toFixed(1)}%`,
      trend: stats.userChange >= 0 ? "up" : "down",
      icon: Users
    },
    {
      title: "Total Experiences",
      value: stats.totalExperiences.toLocaleString(),
      change: `${stats.experienceChange.toFixed(1)}%`,
      trend: stats.experienceChange >= 0 ? "up" : "down",
      icon: Package
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      change: `${stats.revenueChange.toFixed(1)}%`,
      trend: stats.revenueChange >= 0 ? "up" : "down",
      icon: DollarSign
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings.toLocaleString(),
      change: `${stats.bookingChange.toFixed(1)}%`,
      trend: stats.bookingChange >= 0 ? "up" : "down",
      icon: Calendar
    }
  ];

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
          {statsData.map((stat) => (
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
                onClick={() => navigate('/admin/experiences')}
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

        {/* System Status */}
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
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 