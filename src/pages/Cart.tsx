import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Experience } from '@/lib/data';
import { formatRupees } from '@/lib/formatters';
import { supabase } from '@/integrations/supabase/client';

const Cart = () => {
  const { items, cachedExperiences, clearCart } = useCart();
  const { user } = useAuth();
  const [cartExperiences, setCartExperiences] = useState<Experience[]>([]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const experiences = items
      .map(item => cachedExperiences[item.experienceId])
      .filter(exp => exp !== undefined);

    setCartExperiences(experiences);
  }, [items, cachedExperiences]);

  const calculateTotal = () => {
    return cartExperiences.reduce((total, experience) => {
      const cartItem = items.find(item => item.experienceId === experience.id);
      return total + (experience.price * (cartItem ? cartItem.quantity : 1));
    }, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      return;
    }

    setIsLoading(true);
    try {
      // Create a new booking in the database
      const { data: bookingData, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          total_amount: calculateTotal(),
          status: 'confirmed',
          payment_method: paymentMethod
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        throw bookingError;
      }

      // Add each cart item to booking_items
      const bookingItemsPromises = items.map(item => {
        const experience = cachedExperiences[item.experienceId];
        if (!experience) return null;

        return supabase
          .from('booking_items')
          .insert({
            booking_id: bookingData.id,
            experience_id: item.experienceId,
            quantity: item.quantity,
            price_at_booking: experience.price
          });
      });

      // Filter out null promises and execute all remaining ones
      const validPromises = bookingItemsPromises.filter(p => p !== null);
      const bookingItemsResults = await Promise.all(validPromises);
      
      // Check for errors in booking items
      const bookingItemsErrors = bookingItemsResults
        .filter(result => result && result.error)
        .map(result => result ? result.error : null)
        .filter(error => error !== null);
      
      if (bookingItemsErrors.length > 0) {
        console.error('Errors adding booking items:', bookingItemsErrors);
        // Continue with checkout even if there are some errors with booking items
        // The booking has been created successfully
      }

      // Clear the cart
      clearCart();
      
      toast.success('Checkout successful!');
      navigate('/profile?tab=bookings');
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('There was an error processing your checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center flex-grow p-6">
          <div className="animate-spin w-10 h-10 border-4 border-primary rounded-full border-t-transparent"></div>
          <p className="mt-4 text-lg">Processing checkout...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Your Cart</CardTitle>
            <CardDescription>Review and manage the items in your cart.</CardDescription>
          </CardHeader>
          <CardContent>
            {cartExperiences.length > 0 ? (
              <div className="space-y-4">
                {cartExperiences.map(experience => {
                  const cartItem = items.find(item => item.experienceId === experience.id);
                  const quantity = cartItem ? cartItem.quantity : 1;

                  return (
                    <div key={experience.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center">
                        <img src={experience.imageUrl} alt={experience.title} className="w-24 h-20 object-cover rounded mr-4" />
                        <div>
                          <h3 className="text-lg font-medium">{experience.title}</h3>
                          <p className="text-gray-500">{experience.location}</p>
                        </div>
                      </div>
                      <div>
                        <span className="mr-2">Quantity: {quantity}</span>
                        <span className="font-semibold">{formatRupees(experience.price * quantity)}</span>
                      </div>
                    </div>
                  );
                })}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>{formatRupees(calculateTotal())}</span>
                </div>
                <div>
                  <h4 className="text-md font-medium mb-2">Payment Method</h4>
                  <div className="flex items-center">
                    <Input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={() => setPaymentMethod('card')}
                      className="mr-2"
                    />
                    <label htmlFor="card" className="mr-4">Card</label>
                  </div>
                </div>
                <Button onClick={handleCheckout} className="w-full">
                  Checkout
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Your cart is empty.</h3>
                <p className="text-gray-500">Add experiences to your cart to proceed.</p>
                <Button onClick={() => navigate('/experiences')}>
                  Browse Experiences
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
