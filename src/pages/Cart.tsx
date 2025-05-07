import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

// Add import for useExperienceInteractions
import { useExperienceInteractions } from '@/hooks/useExperienceInteractions';

const Cart = () => {
  const cart = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get the user
  const { user } = useAuth();
  const { createBookingFromCart } = useExperienceInteractions(user?.id);
  
  useEffect(() => {
    if (!cart.cachedExperiences) {
      return;
    }
  }, [cart.cachedExperiences]);
  
  // Handle checkout process
  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      
      if (!user) {
        toast.error('You must be logged in to complete your purchase');
        navigate('/login');
        return;
      }
      
      // Create booking in Supabase
      const bookingId = await createBookingFromCart(cart.items, cart.totalPrice);
      
      if (bookingId) {
        // Clear cart after successful checkout
        cart.clearCart();
        
        // Show success message
        toast.success('Order placed successfully!');
        
        // Navigate to profile/bookings
        navigate('/profile?tab=bookings');
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to complete checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Cart Item Component
  const CartItem = ({ id, quantity }: { id: string; quantity: number }) => {
    const experience = cart.cachedExperiences[id];
    
    if (!experience) {
      return null;
    }
    
    return (
      <div className="flex items-center py-4 border-b">
        <img 
          src={experience.imageUrl} 
          alt={experience.title} 
          className="w-20 h-20 object-cover rounded-lg mr-4 cursor-pointer"
          onClick={() => navigate(`/experience/${id}`)}
        />
        <div className="flex-1 cursor-pointer" onClick={() => navigate(`/experience/${id}`)}>
          <h3 className="font-medium text-gray-900">{experience.title}</h3>
          <p className="text-sm text-gray-500">{experience.location}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => cart.updateQuantity(id, Math.max(0, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={() => cart.updateQuantity(id, quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-right ml-4 w-24">
          <p className="font-medium">${(experience.price / 100).toFixed(2)}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-red-500 px-2 h-7"
            onClick={() => cart.removeItem(id)}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
            
            {cart.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add experiences to your cart to book them</p>
                <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
              </div>
            ) : (
              <>
                {cart.items.map(item => (
                  <CartItem key={item.experienceId} id={item.experienceId} quantity={item.quantity} />
                ))}
                
                <div className="mt-6 flex justify-between items-center">
                  <div>
                    <p className="text-gray-700">Total Items: {cart.totalItems}</p>
                    <p className="text-2xl font-semibold">Total Price: ${cart.totalPrice.toFixed(2)}</p>
                  </div>
                  <Button 
                    className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin mr-2 h-5 w-5 border-2 border-current border-t-transparent rounded-full"></div>
                        Processing...
                      </>
                    ) : (
                      'Checkout'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
