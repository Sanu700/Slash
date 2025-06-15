import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckCircle2, XCircle } from 'lucide-react';

interface PaymentNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'success' | 'failure';
  message?: string;
}

export function PaymentNotification({ isOpen, onClose, status, message }: PaymentNotificationProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'success' ? (
              <>
                <CheckCircle2 className="h-6 w-6 text-green-500" />
                Payment Successful
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 text-red-500" />
                Payment Failed
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-gray-600 dark:text-gray-400">
            {message || (status === 'success' 
              ? 'Your payment has been processed successfully.'
              : 'There was an error processing your payment. Please try again.')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
} 