import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Calendar, Users, TrendingUp, DollarSign } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

const timeRanges = [
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "Last 12 Months" },
];

// Mock data for each time range
const revenueDataMap = {
  week: [
    { name: "Mon", value: 4000 },
    { name: "Tue", value: 3000 },
    { name: "Wed", value: 2000 },
    { name: "Thu", value: 2780 },
    { name: "Fri", value: 1890 },
    { name: "Sat", value: 2390 },
    { name: "Sun", value: 3490 },
  ],
  month: Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i + 1}`, value: Math.floor(1500 + Math.random() * 3000) })),
  year: [
    { name: "Jan", value: 25000 },
    { name: "Feb", value: 22000 },
    { name: "Mar", value: 27000 },
    { name: "Apr", value: 30000 },
    { name: "May", value: 32000 },
    { name: "Jun", value: 31000 },
    { name: "Jul", value: 33000 },
    { name: "Aug", value: 34000 },
    { name: "Sep", value: 36000 },
    { name: "Oct", value: 37000 },
    { name: "Nov", value: 39000 },
    { name: "Dec", value: 41000 },
  ],
};

const userGrowthDataMap = {
  week: [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 20 },
    { name: "Thu", value: 28 },
    { name: "Fri", value: 18 },
    { name: "Sat", value: 23 },
    { name: "Sun", value: 34 },
  ],
  month: Array.from({ length: 30 }, (_, i) => ({ name: `Day ${i + 1}`, value: Math.floor(10 + Math.random() * 40) })),
  year: [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 200 },
    { name: "Apr", value: 278 },
    { name: "May", value: 189 },
    { name: "Jun", value: 239 },
    { name: "Jul", value: 300 },
    { name: "Aug", value: 350 },
    { name: "Sep", value: 370 },
    { name: "Oct", value: 390 },
    { name: "Nov", value: 410 },
    { name: "Dec", value: 430 },
  ],
};

const categoryDataMap = {
  week: [
    { name: "Adventure", value: 12 },
    { name: "Dining", value: 8 },
    { name: "Wellness", value: 5 },
  ],
  month: [
    { name: "Adventure", value: 45 },
    { name: "Dining", value: 30 },
    { name: "Wellness", value: 25 },
  ],
  year: [
    { name: "Adventure", value: 320 },
    { name: "Dining", value: 210 },
    { name: "Wellness", value: 170 },
  ],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const StatCard = ({ title, value, change, trend, icon: Icon }: { 
  title: string; 
  value: string; 
  change: string; 
  trend: "up" | "down"; 
  icon: React.ElementType;
}) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          <div className="flex items-center mt-2">
            {trend === "up" ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {change}
            </span>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </CardContent>
  </Card>
);

interface AnalyticsData {
  totalUsers: number;
  totalProviders: number;
  totalExperiences: number;
  totalRevenue: number;
  recentBookings: any[];
  topExperiences: any[];
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("week");
  const [data, setData] = useState<AnalyticsData>({
    totalUsers: 0,
    totalProviders: 0,
    totalExperiences: 0,
    totalRevenue: 0,
    recentBookings: [],
    topExperiences: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);

      // Fetch total users (from auth.users)
      const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
      if (usersError) throw usersError;

      // Count providers
      const providerCount = users?.users?.filter(u => (u as any).user_metadata?.role === 'provider').length || 0;

      // Fetch total experiences
      const { count: experienceCount } = await supabase
        .from('experiences')
        .select('*', { count: 'exact', head: true });

      // Fetch total revenue from bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('total_amount');

      const totalRevenue = bookings?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

      // Fetch recent bookings
      const { data: recentBookings } = await supabase
        .from('bookings')
        .select('*, experiences(*)')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch top experiences
      const { data: topExperiences } = await supabase
        .from('experiences')
        .select('*, bookings(*)')
        .order('bookings', { ascending: false })
        .limit(5);

      setData({
        totalUsers: users?.users?.length || 0,
        totalProviders: providerCount,
        totalExperiences: experienceCount || 0,
        totalRevenue,
        recentBookings: recentBookings || [],
        topExperiences: topExperiences || []
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Select data based on timeRange
  const revenueData = revenueDataMap[timeRange];
  const userGrowthData = userGrowthDataMap[timeRange];
  const categoryData = categoryDataMap[timeRange];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Providers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalProviders}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalExperiences}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-4">
          <TabsList>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="experiences">Top Experiences</TabsTrigger>
          </TabsList>
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Latest bookings across all experiences</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{booking.experiences?.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="font-medium">${booking.total_amount}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="experiences" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Experiences</CardTitle>
                <CardDescription>Most popular experiences by bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.topExperiences.map((experience) => (
                      <div key={experience.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{experience.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {experience.location}
                          </div>
                        </div>
                        <div className="font-medium">
                          {experience.bookings?.length || 0} bookings
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
} 