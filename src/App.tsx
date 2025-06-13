import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/lib/auth";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import ExperienceView from "./pages/ExperienceView";
import CategoryExplore from "./pages/CategoryExplore";
import AllExperiences from "./pages/AllExperiences";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import GiftingGuide from "./pages/GiftingGuide";
import GiftPersonalizer from "./pages/GiftPersonalizer";
import ExperienceManager from "./pages/ExperienceManager";
import Profile from "./pages/Profile";
import { requireAuth } from "./lib/auth";
import Booking from '@/pages/Booking';
import HostExperience from './pages/HostExperience';
import AdminLogin from '@/pages/admin/AdminLogin';
import Dashboard from '@/pages/admin/Dashboard';
import Users from '@/pages/admin/Users';
import Categories from '@/pages/admin/Categories';
import Analytics from '@/pages/admin/Analytics';
import Settings from '@/pages/admin/Settings';
import Customers from './pages/admin/users/Customers';
import Providers from './pages/admin/users/Providers';
import Experiences from './pages/admin/Experiences';

// Import Company Pages
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import Testimonials from "./pages/Testimonials";
import Careers from "./pages/Careers";
import Press from "./pages/Press";

// Import Support Pages
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import GiftRules from "./pages/GiftRules";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";

const queryClient = new QueryClient();

// Create protected components
const ProtectedDashboard = requireAuth(Dashboard);
const ProtectedUsers = requireAuth(Users);
const ProtectedCustomers = requireAuth(Customers);
const ProtectedProviders = requireAuth(Providers);
const ProtectedExperiences = requireAuth(Experiences);
const ProtectedCategories = requireAuth(Categories);
const ProtectedAnalytics = requireAuth(Analytics);
const ProtectedSettings = requireAuth(Settings);
const ProtectedProfile = requireAuth(Profile);
const ProtectedHostExperience = requireAuth(HostExperience);
const ProtectedExperienceManager = requireAuth(ExperienceManager);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/experiences" element={<Layout><AllExperiences /></Layout>} />
                <Route path="/experiences/:id" element={<Layout><ExperienceView /></Layout>} />
                <Route path="/categories/:id" element={<Layout><CategoryExplore /></Layout>} />
                <Route path="/cart" element={<Layout><Cart /></Layout>} />
                <Route path="/gifting-guide" element={<Layout><GiftingGuide /></Layout>} />
                <Route path="/gift-personalizer" element={<Layout><GiftPersonalizer /></Layout>} />
                <Route path="/booking/:id" element={<Layout><Booking /></Layout>} />
                
                {/* Company Pages */}
                <Route path="/about" element={<Layout><AboutUs /></Layout>} />
                <Route path="/how-it-works" element={<Layout><HowItWorks /></Layout>} />
                <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
                <Route path="/careers" element={<Layout><Careers /></Layout>} />
                <Route path="/press" element={<Layout><Press /></Layout>} />
                
                {/* Support Pages */}
                <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
                <Route path="/faq" element={<Layout><FAQ /></Layout>} />
                <Route path="/gift-rules" element={<Layout><GiftRules /></Layout>} />
                <Route path="/shipping" element={<Layout><Shipping /></Layout>} />
                <Route path="/returns" element={<Layout><Returns /></Layout>} />
                
                {/* Protected Routes */}
                <Route path="/profile" element={<Layout><ProtectedProfile /></Layout>} />
                <Route path="/host-experience" element={<Layout><ProtectedHostExperience /></Layout>} />
                <Route path="/experience-manager" element={<Layout><ProtectedExperienceManager /></Layout>} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<Layout><ProtectedDashboard /></Layout>} />
                <Route path="/admin/users" element={<Layout><ProtectedUsers /></Layout>} />
                <Route path="/admin/users/customers" element={<Layout><ProtectedCustomers /></Layout>} />
                <Route path="/admin/users/providers" element={<Layout><ProtectedProviders /></Layout>} />
                <Route path="/admin/experiences" element={<Layout><ProtectedExperiences /></Layout>} />
                <Route path="/admin/categories" element={<Layout><ProtectedCategories /></Layout>} />
                <Route path="/admin/analytics" element={<Layout><ProtectedAnalytics /></Layout>} />
                <Route path="/admin/settings" element={<Layout><ProtectedSettings /></Layout>} />
                
                {/* 404 Route */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
