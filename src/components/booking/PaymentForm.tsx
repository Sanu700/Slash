import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { BookingFormData } from '@/types/booking';

const paymentSchema = z.object({
  cardNumber: z.string()
    .min(16, 'Card number must be 16 digits')
    .max(16, 'Card number must be 16 digits')
    .regex(/^\d+$/, 'Card number must contain only digits'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string()
    .min(3, 'CVV must be 3 digits')
    .max(4, 'CVV must be 4 digits')
    .regex(/^\d+$/, 'CVV must contain only digits'),
  nameOnCard: z.string().min(2, 'Name on card is required'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

type PaymentFormProps = {
  bookingData: BookingFormData;
  totalAmount: number;
  onSuccess: () => void;
  onBack: () => void;
};

export function PaymentForm({ bookingData, totalAmount, onSuccess, onBack }: PaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsProcessing(true);
    try {
      // Here you would integrate with your payment processor (e.g., Stripe)
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Process the payment
      // const paymentResult = await processPayment({
      //   cardNumber: data.cardNumber.replace(/\s/g, ''),
      //   expiryDate: data.expiryDate,
      //   cvv: data.cvv,
      //   nameOnCard: data.nameOnCard,
      //   amount: totalAmount,
      //   bookingData,
      // });

      toast.success('Payment processed successfully!');
      onSuccess();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Enter your card information to complete the booking</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              {...register('cardNumber')}
              onChange={(e) => {
                e.target.value = formatCardNumber(e.target.value);
              }}
            />
            {errors.cardNumber && (
              <p className="text-sm text-red-500">{errors.cardNumber.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                maxLength={5}
                {...register('expiryDate')}
                onChange={(e) => {
                  e.target.value = formatExpiryDate(e.target.value);
                }}
              />
              {errors.expiryDate && (
                <p className="text-sm text-red-500">{errors.expiryDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                maxLength={4}
                placeholder="123"
                {...register('cvv')}
              />
              {errors.cvv && (
                <p className="text-sm text-red-500">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input
              id="nameOnCard"
              placeholder="John Doe"
              {...register('nameOnCard')}
            />
            {errors.nameOnCard && (
              <p className="text-sm text-red-500">{errors.nameOnCard.message}</p>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-medium">Total Amount:</span>
              <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onBack}
              disabled={isProcessing}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 