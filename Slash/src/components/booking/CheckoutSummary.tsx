import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookingFormData, Experience } from '@/types/booking';

interface CheckoutSummaryProps {
  experience: Experience;
  bookingData: BookingFormData;
  totalAmount: number;
  onConfirmBooking: () => void;
}

export function CheckoutSummary({
  experience,
  bookingData,
  totalAmount,
  onConfirmBooking,
}: CheckoutSummaryProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
        <CardDescription>Review your booking details before confirming</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-4">
            <img
              src={experience.image_url}
              alt={experience.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-medium">{experience.title}</h3>
              <p className="text-sm text-muted-foreground">{experience.location}</p>
              <p className="text-sm text-muted-foreground">
                Duration: {experience.duration}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="font-medium mb-2">Booking Details</h4>
              <div className="space-y-1 text-sm">
                <p>Date: {bookingData.date.toLocaleDateString()}</p>
                <p>Time: {bookingData.date.toLocaleTimeString()}</p>
                <p>Number of Participants: {bookingData.numberOfParticipants}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <p>Name: {bookingData.firstName} {bookingData.lastName}</p>
                <p>Email: {bookingData.email}</p>
                <p>Phone: {bookingData.phone}</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Amount</span>
              <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          onClick={onConfirmBooking}
        >
          Confirm Booking
        </Button>
      </CardContent>
    </Card>
  );
} 