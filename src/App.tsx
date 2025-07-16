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
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationModalClose = () => {
    setShowCityModal(true);
  };

  return (
    <>
      {showSplash && (
        <div style={{ position: 'fixed', zIndex: 99999, inset: 0, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.5s', animation: 'splash-fade 0.5s 1.2s forwards' }}>
          {/* Confetti burst */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  width: 8,
                  height: 24,
                  background: `hsl(${i * 15}, 80%, 60%)`,
                  borderRadius: 4,
                  transform: `rotate(${i * 15}deg) translateY(-80px) scaleY(0.7)`,
                  opacity: 0.7,
                  animation: `confetti-burst 1s cubic-bezier(.68,-0.55,.27,1.55) ${0.05 * i}s forwards`
                }}
              />
            ))}
          </div>
          <img
            src={logo}
            alt="Slash Experiences Logo"
            style={{
              width: 120,
              height: 120,
              animation: 'splash-bounce 1.2s cubic-bezier(.68,-0.55,.27,1.55) forwards',
              filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.12))',
              zIndex: 2,
            }}
          />
          <style>{`
            @keyframes splash-bounce {
              0% { transform: scale(0.7) rotate(-10deg); opacity: 0; }
              40% { transform: scale(1.1) rotate(8deg); opacity: 1; }
              70% { transform: scale(0.95) rotate(-4deg); }
              100% { transform: scale(1) rotate(0deg); opacity: 1; }
            }
            @keyframes splash-fade {
              to { opacity: 0; pointer-events: none; }
            }
            @keyframes confetti-burst {
              0% { opacity: 0; transform: scaleY(0.7) translateY(-80px); }
              60% { opacity: 1; transform: scaleY(1.2) translateY(-120px); }
              100% { opacity: 0; transform: scaleY(0.7) translateY(-180px); }
            }
          `}</style>
        </div>
      )}
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
