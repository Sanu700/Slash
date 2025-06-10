import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Experience } from '@/types/booking';

interface CheckoutSummaryProps {
  experience: Experience;
  bookingData: {
    date: Date;
    numberOfParticipants: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  totalAmount: number;
  onProceedToPayment: () => void;
}

export function CheckoutSummary({
  experience,
  bookingData,
  totalAmount,
  onProceedToPayment,
}: CheckoutSummaryProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Checkout Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Experience Details */}
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

        <Separator />

        {/* Booking Details */}
        <div className="space-y-2">
          <h4 className="font-medium">Booking Details</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Date:</span>
            <span>{format(bookingData.date, 'PPP')}</span>
            <span className="text-muted-foreground">Time:</span>
            <span>{format(bookingData.date, 'p')}</span>
            <span className="text-muted-foreground">Participants:</span>
            <span>{bookingData.numberOfParticipants}</span>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-2">
          <h4 className="font-medium">Contact Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Name:</span>
            <span>{`${bookingData.firstName} ${bookingData.lastName}`}</span>
            <span className="text-muted-foreground">Email:</span>
            <span>{bookingData.email}</span>
            <span className="text-muted-foreground">Phone:</span>
            <span>{bookingData.phone}</span>
          </div>
        </div>

        <Separator />

        {/* Price Breakdown */}
        <div className="space-y-2">
          <h4 className="font-medium">Price Details</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Price per person</span>
              <span>${experience.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of participants</span>
              <span>x{bookingData.numberOfParticipants}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={onProceedToPayment}
        >
          Proceed to Payment
        </Button>
      </CardContent>
    </Card>
  );
} 