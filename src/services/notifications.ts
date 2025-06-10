import { supabase } from '@/lib/supabase';
import { BookingFormData } from '@/types/booking';

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
    // Send email confirmation
    await sendEmailConfirmation(data);

    // Send SMS confirmation
    await sendSMSConfirmation(data);

    return { success: true };
  } catch (error) {
    console.error('Error sending notifications:', error);
    throw error;
  }
};

const sendEmailConfirmation = async (data: NotificationData) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: data.userEmail,
        subject: 'Booking Confirmation - Slash Experiences',
        template: 'booking-confirmation',
        data: {
          name: data.userName,
          experience: data.experienceTitle,
          date: data.date.toLocaleDateString(),
          time: data.date.toLocaleTimeString(),
          participants: data.numberOfParticipants,
          amount: data.totalAmount,
          bookingId: data.bookingId,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const sendSMSConfirmation = async (data: NotificationData) => {
  try {
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: data.userPhone,
        message: `Your booking for ${data.experienceTitle} on ${data.date.toLocaleDateString()} has been confirmed. Booking ID: ${data.bookingId}. Thank you for choosing Slash Experiences!`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to send SMS');
    }
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Email template for booking confirmation
export const bookingConfirmationEmailTemplate = `
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
    
    <p>Dear {{name}},</p>
    
    <p>Thank you for booking with Slash Experiences! Your booking has been confirmed.</p>
    
    <div class="details">
      <h2>Booking Details:</h2>
      <p><strong>Experience:</strong> {{experience}}</p>
      <p><strong>Date:</strong> {{date}}</p>
      <p><strong>Time:</strong> {{time}}</p>
      <p><strong>Number of Participants:</strong> {{participants}}</p>
      <p><strong>Total Amount:</strong> ${{amount}}</p>
      <p><strong>Booking ID:</strong> {{bookingId}}</p>
    </div>
    
    <p>Please keep this email for your records. We look forward to seeing you!</p>
    
    <div class="footer">
      <p>If you have any questions, please contact us at support@slashexperiences.com</p>
    </div>
  </div>
</body>
</html>
`; 