import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";


import { AuthProvider, requireAuth } from "@/lib/auth";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";

// Public Pages
import Index from "./pages/Index";
import ExperienceView from "./pages/ExperienceView";
import CategoryExplore from "./pages/CategoryExplore";
import AllExperiences from "./pages/AllExperiences";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";
import GiftingGuide from "./pages/GiftingGuide";
import GiftPersonalizer from "./pages/GiftPersonalizer";
import AISuggestions from "./pages/AISuggestions";
import Booking from "./pages/Booking";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import { WishlistProvider } from './contexts/WishlistContext';

// Company Pages
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import Testimonials from "./pages/Testimonials";
import Careers from "./pages/Careers";
import Press from "./pages/Press";

// Support Pages
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
import GiftRules from "./pages/GiftRules";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";

// Auth-Protected Pages
import ExperienceManager from "./pages/ExperienceManager";
import HostExperience from "./pages/HostExperience";
import Profile from "./pages/Profile";

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Customers from './pages/admin/users/Customers';
import Providers from './pages/admin/users/Providers';
import Experiences from './pages/admin/Experiences';
import AdminProfile from './pages/admin/Profile';
import { PaymentDetails } from '@/components/admin/PaymentDetails';

// Protect Routes
const ProtectedProfile = requireAuth(Profile, false);
const ProtectedWishlist = requireAuth(Wishlist, false);
const ProtectedExperienceManager = requireAuth(ExperienceManager, false);
const ProtectedHostExperience = requireAuth(HostExperience, false);
const ProtectedAdminDashboard = requireAuth(Dashboard, true);
const ProtectedAdminUsers = requireAuth(Users, true);
const ProtectedAdminAnalytics = requireAuth(Analytics, true);
const ProtectedAdminSettings = requireAuth(Settings, true);
const ProtectedCustomers = requireAuth(Customers, true);
const ProtectedProviders = requireAuth(Providers, true);
const ProtectedExperiences = requireAuth(Experiences, true);
const ProtectedAdminProfile = requireAuth(AdminProfile, true);
const ProtectedPaymentDetails = requireAuth(PaymentDetails, true);

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import LocationAccessModal from "@/components/LocationAccessModal";
import CitySelectorModal from "@/components/CitySelectorModal";

const queryClient = new QueryClient();

function App() {
  const [showCityModal, setShowCityModal] = useState(false);

  const handleLocationModalClose = () => {
    setShowCityModal(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <ScrollToTop />
                <LocationAccessModal onClose={handleLocationModalClose} />
                <CitySelectorModal open={showCityModal} onClose={() => setShowCityModal(false)} />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Layout><Index /></Layout>} />
                  <Route path="/experiences" element={<Layout><AllExperiences /></Layout>} />
                  <Route path="/experience/:id" element={<Layout><ExperienceView /></Layout>} />
                  <Route path="/category/:id" element={<Layout><CategoryExplore /></Layout>} />
                  <Route path="/cart" element={<Layout><Cart /></Layout>} />
                  <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                  <Route path="/gifting-guide" element={<Layout><GiftingGuide /></Layout>} />
                  <Route path="/gift-personalizer" element={<Layout><GiftPersonalizer /></Layout>} />
                  <Route path="/ai-suggestions" element={<Layout><AISuggestions /></Layout>} />
                  <Route path="/booking/:experienceId" element={<Layout><Booking /></Layout>} />

                  {/* Company Pages */}
                  <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
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

                  {/* Protected User Routes */}
                  <Route path="/profile" element={<Layout><ProtectedProfile /></Layout>} />
                  <Route path="/wishlist" element={<Layout><ProtectedWishlist /></Layout>} />
                  <Route path="/manage-experiences" element={<Layout><ProtectedExperienceManager /></Layout>} />
                  <Route path="/host-experience" element={<Layout><ProtectedHostExperience /></Layout>} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<ProtectedAdminDashboard />} />
                  <Route path="/admin/users" element={<ProtectedAdminUsers />} />
                  <Route path="/admin/analytics" element={<ProtectedAdminAnalytics />} />
                  <Route path="/admin/settings" element={<ProtectedAdminSettings />} />
                  <Route path="/admin/users/customers" element={<ProtectedCustomers />} />
                  <Route path="/admin/users/providers" element={<ProtectedProviders />} />
                  <Route path="/admin/experiences" element={<ProtectedExperiences />} />
                  <Route path="/admin/profile" element={<ProtectedAdminProfile />} />
                  <Route path="/admin/payments" element={<ProtectedPaymentDetails />} />

                  {/* 404 Page */}
                  <Route path="*" element={<Layout><NotFound /></Layout>} />
                </Routes>
              </BrowserRouter>
              <Toaster />
              <Sonner position="top-center" />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
