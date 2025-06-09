import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/lib/auth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { Experience } from '@/lib/data';
import { formatRupees } from '@/lib/formatters';
import { supabase } from '@/lib/supabase';
import { CreditCard, Banknote, Wallet, Plus, Minus, Trash } from 'lucide-react';

const Cart = () => {
  const { items, cachedExperiences, clearCart, updateQuantity, removeFromCart } = useCart();
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

  const handleQuantityChange = (experienceId: string, change: number) => {
    const item = items.find(item => item.experienceId === experienceId);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + change);
      updateQuantity(experienceId, newQuantity);
    }
  };

  const handleExperienceClick = (experienceId: string) => {
    navigate(`/experience/${experienceId}`);
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

      console.log('Booking created:', bookingData);

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
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Items</CardTitle>
                <CardDescription>Review the experiences in your cart</CardDescription>
              </CardHeader>
              <CardContent>
                {cartExperiences.length > 0 ? (
                  <div className="space-y-6">
                    {cartExperiences.map(experience => {
                      const cartItem = items.find(item => item.experienceId === experience.id);
                      const quantity = cartItem ? cartItem.quantity : 1;

                      return (
                        <div key={experience.id} className="flex items-center space-x-4 border border-gray-100 rounded-lg p-4 shadow-sm">
                          <div 
                            className="h-24 w-32 overflow-hidden rounded-md cursor-pointer"
                            onClick={() => handleExperienceClick(experience.id)}
                          >
                            <img 
                              src={experience.imageUrl} 
                              alt={experience.title}
                              className="h-full w-full object-cover hover:opacity-90 transition-opacity"
                            />
                          </div>
                          <div 
                            className="flex-1 space-y-1 cursor-pointer"
                            onClick={() => handleExperienceClick(experience.id)}
                          >
                            <h3 className="font-semibold hover:text-primary transition-colors">{experience.title}</h3>
                            <p className="text-sm text-gray-500">{experience.location}</p>
                            <p className="text-sm font-medium">{formatRupees(experience.price)}</p>
                          </div>
                          <div className="flex items-center">
                            <div className="flex items-center space-x-2 border rounded-md p-1">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(experience.id, -1)}
                                disabled={quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                                <span className="sr-only">Decrease quantity</span>
                              </Button>
                              <span className="w-8 text-center">{quantity}</span>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleQuantityChange(experience.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Increase quantity</span>
                              </Button>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 ml-2 text-destructive"
                              onClick={() => removeFromCart(experience.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only">Remove item</span>
                            </Button>
                          </div>
                          <div className="text-right min-w-[80px]">
                            <p className="font-medium">{formatRupees(experience.price * quantity)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-lg font-medium mb-4">Your cart is empty</p>
                    <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {cartExperiences.length > 0 && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{formatRupees(calculateTotal())}</span>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2 border p-3 rounded-md mb-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center">
                          <CreditCard className="h-4 w-4 mr-2" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md mb-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="flex items-center">
                          <Wallet className="h-4 w-4 mr-2" />
                          <span>UPI Payment</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-3 rounded-md">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center">
                          <Banknote className="h-4 w-4 mr-2" />
                          <span>Cash on Delivery</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Complete Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
