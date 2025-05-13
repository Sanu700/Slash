import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/lib/auth";
import { useScrollToTop } from "@/hooks/useScrollToTop";
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

// Apply authentication to the ExperienceManager component with admin required
const ProtectedExperienceManager = requireAuth(ExperienceManager, true);

const App = () => {
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/experience/:id" element={<ExperienceView />} />
                <Route path="/category/:id" element={<CategoryExplore />} />
                <Route path="/experiences" element={<AllExperiences />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/gifting-guide" element={<GiftingGuide />} />
                <Route path="/gift-personalizer" element={<GiftPersonalizer />} />
                <Route path="/manage-experiences" element={<ProtectedExperienceManager />} />
                
                {/* Company Pages */}
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                
                {/* Support Pages */}
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/gift-rules" element={<GiftRules />} />
                <Route path="/shipping" element={<Shipping />} />
                <Route path="/returns" element={<Returns />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
