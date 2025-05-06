
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Experience } from '@/lib/data';
import { formatRupees } from '@/lib/formatters';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, ShoppingBag } from "lucide-react";

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

      if (!bookingData || !bookingData.id) {
        throw new Error('Booking data is missing or invalid');
      }

      console.log('Booking created:', bookingData);

      // Add each cart item to booking_items
      for (const item of items) {
        const experience = cachedExperiences[item.experienceId];
        if (!experience) continue;

        const { error: itemError } = await supabase
          .from('booking_items')
          .insert({
            booking_id: bookingData.id,
            experience_id: item.experienceId,
            quantity: item.quantity,
            price_at_booking: experience.price
          });

        if (itemError) {
          console.error('Error adding booking item:', itemError);
          // Continue with other items even if one fails
        }
      }

      // Clear the cart
      await clearCart();
      
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
              <div className="space-y-6">
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
                      <div className="text-right">
                        <span className="block mb-1">Quantity: {quantity}</span>
                        <span className="font-semibold">{formatRupees(experience.price * quantity)}</span>
                      </div>
                    </div>
                  );
                })}
                
                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span>Total:</span>
                  <span>{formatRupees(calculateTotal())}</span>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-3">Payment Method</h4>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="gap-4">
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-2 cursor-pointer">
                        <Wallet className="h-4 w-4" />
                        <span>UPI Payment</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer">
                        <ShoppingBag className="h-4 w-4" />
                        <span>Cash on Delivery</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button onClick={handleCheckout} className="w-full mt-4">
                  Checkout
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-lg font-medium">Your cart is empty.</h3>
                <p className="text-gray-500">Add experiences to your cart to proceed.</p>
                <Button onClick={() => navigate('/experiences')} className="mt-4">
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
