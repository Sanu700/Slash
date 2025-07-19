import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import ScrollToTop from "@/components/ScrollToTop";


import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Layout from "@/components/Layout";

// Public Pages
import Index from "./pages/Index";
import ExperienceView from "./pages/ExperienceView";
import CategoryExplore from "./pages/CategoryExplore";
import AllExperiences from "./pages/AllExperiences";
import NotFound from "./pages/NotFound";
import GiftPersonalizer from "./pages/GiftPersonalizer";
import AISuggestions from "./pages/AISuggestions";
import Wishlist from "./pages/Wishlist";
import TravelDemo from "./pages/TravelDemo";
import { WishlistProvider } from './contexts/WishlistContext';
import ExperienceType from "./pages/ExperienceType";
import Swipe from "./pages/Swipe";
// Company Pages
import AboutUs from "./pages/AboutUs";
import Testimonials from "./pages/Testimonials";
import Press from "./pages/Press";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
// Support Pages
import ContactUs from "./pages/ContactUs";
import FAQ from "./pages/FAQ";
// Auth-Protected Pages
import Profile from "./pages/Profile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useRef } from "react";
import CitySelectorModal from "@/components/CitySelectorModal";
import LocationAccessModal from "@/components/LocationAccessModal";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { config } from '@/config';
import RefTracker from './components/RefTracker';
import AuthCallback from "./pages/AuthCallback";
import logo from '/public/og-image.png'; // Use your logo or a fun image

const queryClient = new QueryClient();

function App() {
  const [showCityModal, setShowCityModal] = useState(false);

  const handleLocationModalClose = () => {
    setShowCityModal(true);
  };

  return (
    <>
      <GoogleOAuthProvider clientId={config.google.clientId}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <BrowserRouter>
                    <RefTracker />
                    <ScrollToTop />
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Layout><Index /></Layout>} />
                      <Route path="/experiences" element={<Layout><AllExperiences /></Layout>} />
                      <Route path="/experiences/type/:type" element={<Layout><ExperienceType /></Layout>} />
                      <Route path="/experience/:id" element={<Layout><ExperienceView /></Layout>} />
                      <Route path="/category/:id" element={<Layout><CategoryExplore /></Layout>} />
                      <Route path="/gift-personalizer" element={<Layout><GiftPersonalizer /></Layout>} />
                      <Route path="/ai-suggestions" element={<Layout><AISuggestions /></Layout>} />
                      <Route path="/travel-demo" element={<Layout><TravelDemo /></Layout>} />
                      <Route path="/swipe-feature" element={<Layout><Swipe /></Layout>} />
                      {/* Company Pages */}
                      <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
                      <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
                      <Route path="/press" element={<Layout><Press /></Layout>} />
                      <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
                      <Route path="/terms" element={<Layout><Terms /></Layout>} />
                      {/* Support Pages */}
                      <Route path="/contact" element={<Layout><ContactUs /></Layout>} />
                      <Route path="/faq" element={<Layout><FAQ /></Layout>} />
                      {/* Auth Callback Route */}
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      {/* Protected User Routes */}
                      <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
                      <Route path="/profile" element={<Layout><Profile /></Layout>} />
                      {/* Admin Routes */}
                      {/* Admin routes removed */}
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
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
