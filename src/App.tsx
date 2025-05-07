
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/lib/auth";
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

// Create a new QueryClient instance outside the component to avoid recreation on each render
const queryClient = new QueryClient();

// Apply authentication to the ExperienceManager component with admin required
const ProtectedExperienceManager = requireAuth(ExperienceManager, true);

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
