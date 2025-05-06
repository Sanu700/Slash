import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatRupees } from '@/lib/formatters';
import { Trash, Plus, Minus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Experience } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/lib/auth';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, cachedExperiences, checkout } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartExperiences, setCartExperiences] = useState<Record<string, Experience>>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Load cart experiences from cache or fetch them
  useEffect(() => {
    setCartExperiences(cachedExperiences);
  }, [cachedExperiences]);
  
  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to checkout",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some experiences to your cart before checking out",
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const success = await checkout();
      
      if (success) {
        toast({
          title: "Order placed successfully!",
          description: "Thank you for your purchase"
        });
        navigate('/profile?tab=bookings');
      } else {
        toast({
          title: "Checkout failed",
          description: "There was an error processing your order",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-20 md:pt-28">
        <div className="container max-w-6xl mx-auto px-6 md:px-10 py-6 md:py-12">
          <div className="flex items-center mb-6">
            <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
            <h1 className="text-2xl md:text-3xl font-semibold ml-auto">Your Cart</h1>
          </div>
          
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Looks like you haven't added any experiences to your cart yet.
              </p>
              <Link to="/experiences">
                <Button>Browse Experiences</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow-sm divide-y">
                  {items.map((item) => {
                    const experience = cartExperiences[item.experienceId];
                    if (!experience) return null;
                    
                    return (
                      <div key={item.experienceId} className="p-4 md:p-6 flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-24 h-24 flex-shrink-0">
                          <Link to={`/experience/${experience.id}`}>
                            <img 
                              src={experience.imageUrl} 
                              alt={experience.title}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </Link>
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <Link to={`/experience/${experience.id}`}>
                              <h3 className="font-medium hover:text-primary transition-colors">
                                {experience.title}
                              </h3>
                            </Link>
                            <button 
                              onClick={() => removeFromCart(item.experienceId)}
                              className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="text-sm text-muted-foreground mb-4">
                            {experience.location} • {experience.duration}
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="inline-flex items-center border rounded-md">
                              <button 
                                onClick={() => updateQuantity(item.experienceId, item.quantity - 1)}
                                className="px-2 py-1 border-r"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.experienceId, item.quantity + 1)}
                                className="px-2 py-1 border-l"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-medium">
                                {formatRupees(experience.price * item.quantity)}
                              </div>
                              {item.quantity > 1 && (
                                <div className="text-xs text-muted-foreground">
                                  {formatRupees(experience.price)} each
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-sm p-6 sticky top-28">
                  <h3 className="text-lg font-medium mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatRupees(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span>{formatRupees(Math.round(totalPrice * 0.18))}</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 font-medium">
                      <span>Total</span>
                      <span>{formatRupees(Math.round(totalPrice * 1.18))}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Checkout"}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Secure checkout with instant confirmation
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
