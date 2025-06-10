import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignInForm } from '@/components/auth/SignInForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { BookingForm } from '@/components/booking/BookingForm';
import { CheckoutSummary } from '@/components/booking/CheckoutSummary';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { BookingFormData, Experience } from '@/types/booking';
import { sendBookingConfirmation } from '@/services/notifications';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type BookingStep = 'auth' | 'details' | 'checkout' | 'confirmation';

export default function Booking() {
  const { experienceId } = useParams<{ experienceId: string }>();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState<BookingStep>(user ? 'details' : 'auth');
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [experience, setExperience] = useState<Experience | null>(null);

  useEffect(() => {
    const fetchExperience = async () => {
      if (experienceId) {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .eq('id', experienceId)
          .single();

        if (error) {
          toast.error('Failed to load experience details');
          navigate('/');
          return;
        }

        setExperience(data);
      }
    };

    fetchExperience();
  }, [experienceId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleBookingSubmit = async (data: BookingFormData) => {
    try {
      setBookingData(data);
      const pricePerPerson = experience?.price || 0;
      const total = data.numberOfParticipants * pricePerPerson;
      setTotalAmount(total);
      setCurrentStep('checkout');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking. Please try again.');
    }
  };

  const handleConfirmBooking = async () => {
    try {
      if (!bookingData || !experience) return;

      // Create booking in database
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user?.id,
            booking_date: bookingData.date.toISOString(),
            total_amount: totalAmount,
            status: 'confirmed',
            notes: `Experience: ${experience.title}, Participants: ${bookingData.numberOfParticipants}, Contact: ${bookingData.email}, Phone: ${bookingData.phone}`
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation notifications
      await sendBookingConfirmation({
        bookingId: booking.id,
        experienceId: experience.id,
        userEmail: bookingData.email,
        userPhone: bookingData.phone,
        userName: `${bookingData.firstName} ${bookingData.lastName}`,
        experienceTitle: experience.title,
        date: bookingData.date,
        numberOfParticipants: bookingData.numberOfParticipants,
        totalAmount,
      });

      setCurrentStep('confirmation');
      toast.success('Booking confirmed! Check your email for details.');
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to confirm booking. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'auth':
        return (
          <Tabs defaultValue="signin" className="w-full max-w-md mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        );

      case 'details':
        return (
          <BookingForm
            experienceId={experienceId!}
            onSuccess={handleBookingSubmit}
          />
        );

      case 'checkout':
        return experience && bookingData ? (
          <CheckoutSummary
            experience={experience}
            bookingData={bookingData}
            totalAmount={totalAmount}
            onConfirmBooking={handleConfirmBooking}
          />
        ) : null;

      case 'confirmation':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Booking Confirmed!</CardTitle>
              <CardDescription>Thank you for your booking</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">Booking Details</h3>
                <p>Experience: {experience?.title}</p>
                <p>Date: {bookingData?.date.toLocaleDateString()}</p>
                <p>Number of Participants: {bookingData?.numberOfParticipants}</p>
                <p>Total Amount: ${totalAmount.toFixed(2)}</p>
              </div>
              <Button
                className="w-full"
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book Your Experience</h1>
          <p className="text-muted-foreground">
            {currentStep === 'auth' && 'Sign in or create an account to continue'}
            {currentStep === 'details' && 'Fill in your booking details'}
            {currentStep === 'checkout' && 'Review your booking details'}
            {currentStep === 'confirmation' && 'Your booking is confirmed!'}
          </p>
        </div>

        {renderStep()}
      </div>
    </div>
  );
} 