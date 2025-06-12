import { supabase } from '@/lib/supabase';

interface NotificationData {
  bookingId: string;
  experienceId: string;
  userEmail: string;
  userPhone: string;
  userName: string;
  experienceTitle: string;
  date: Date;
  numberOfParticipants: number;
  totalAmount: number;
}

export const sendBookingConfirmation = async (data: NotificationData) => {
  try {
    // For now, just log the notification data
    console.log('Sending booking confirmation:', {
      bookingId: data.bookingId,
      experienceTitle: data.experienceTitle,
      userName: data.userName,
      date: data.date.toLocaleDateString(),
      totalAmount: data.totalAmount,
    });

    // TODO: Implement actual email and SMS sending when backend is ready
    return { success: true };
  } catch (error) {
    console.error('Error sending notifications:', error);
    throw error;
  }
};

// Email template for booking confirmation
export const getBookingConfirmationEmail = (data: NotificationData) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; }
    .details { margin-bottom: 20px; }
    .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmation</h1>
    </div>
    
    <p>Dear ${data.userName},</p>
    
    <p>Thank you for booking with Slash Experiences! Your booking has been confirmed.</p>
    
    <div class="details">
      <h2>Booking Details:</h2>
      <p><strong>Experience:</strong> ${data.experienceTitle}</p>
      <p><strong>Date:</strong> ${data.date.toLocaleDateString()}</p>
      <p><strong>Number of Participants:</strong> ${data.numberOfParticipants}</p>
      <p><strong>Total Amount:</strong> $${data.totalAmount}</p>
      <p><strong>Booking ID:</strong> ${data.bookingId}</p>
    </div>
    
    <p>Please keep this email for your records. We look forward to seeing you!</p>
    
    <div class="footer">
      <p>If you have any questions, please contact us at support@slashexperiences.com</p>
    </div>
  </div>
</body>
</html>
`; 