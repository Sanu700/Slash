
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useCart } from '@/contexts/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import refactored components
import ProfileCard from '@/components/profile/ProfileCard';
import CartContent from '@/components/profile/CartContent';
import WishlistContent from '@/components/profile/WishlistContent';
import BookingHistoryContent from '@/components/profile/BookingHistoryContent';

// Import custom hooks
import { useBookingHistory, useWishlistExperiences } from '@/hooks/useDataLoaders';
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const { items, cachedExperiences } = useCart();
  const [cartExperiences, setCartExperiences] = useState([]);
  const [activeTab, setActiveTab] = useState('cart');
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get tab from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  
  // Load data using custom hooks
  const { bookingHistory } = useBookingHistory(user?.id);
  const { wishlistExperiences } = useWishlistExperiences(user?.id);
  const { handleExperienceClick } = useExperienceInteractions(user?.id);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Get cart experiences from cache
  useEffect(() => {
    const experiences = items
      .map(item => cachedExperiences[item.experienceId])
      .filter(exp => exp !== undefined);
    
    setCartExperiences(experiences);
  }, [items, cachedExperiences]);
  
  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['cart', 'bookings', 'wishlist'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  if (!isAuthenticated || !user) {
    return null;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* User Profile Overview */}
          <ProfileCard 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            bookingHistoryCount={bookingHistory.length}
            wishlistCount={wishlistExperiences.length}
          />
          
          {/* User Activity */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cart" onClick={() => navigate('/profile?tab=cart')}>Current Cart</TabsTrigger>
                <TabsTrigger value="bookings" onClick={() => navigate('/profile?tab=bookings')}>Booking History</TabsTrigger>
                <TabsTrigger value="wishlist" onClick={() => navigate('/profile?tab=wishlist')}>Wishlist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="cart" className="mt-6">
                <CartContent 
                  cartExperiences={cartExperiences}
                  handleExperienceClick={handleExperienceClick}
                />
              </TabsContent>
              
              <TabsContent value="bookings" className="mt-6">
                <BookingHistoryContent bookingHistory={bookingHistory} />
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-6">
                <WishlistContent 
                  wishlistExperiences={wishlistExperiences}
                  handleExperienceClick={handleExperienceClick}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
