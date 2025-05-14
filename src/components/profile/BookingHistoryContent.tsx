import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Experience } from '@/lib/data';
import { Clock, Calendar, CreditCard } from 'lucide-react';
import { formatRupees } from '@/lib/formatters';

interface BookingItem {
  experience: Experience;
  quantity: number;
  price_at_booking: number;
}

interface Booking {
  id: string;
  booking_date: string;
  total_amount: number;
  status: string;
  payment_method: string | null;
  items: BookingItem[];
}

interface BookingHistoryContentProps {
  bookingHistory: Booking[];
}

const BookingHistoryContent = ({ bookingHistory }: BookingHistoryContentProps) => {
  const navigate = useNavigate();

  return (
    <>
      {bookingHistory.length > 0 ? (
        <div className="space-y-8">
          {bookingHistory.map((booking) => (
            <Card key={booking.id} className="overflow-hidden border-0 shadow-md">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-background">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Booking on {new Date(booking.booking_date).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </CardTitle>
                    <CardDescription className="text-sm space-y-1 mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span>{new Date(booking.booking_date).toLocaleDateString(undefined, { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2 text-primary" />
                        <span className="capitalize">{booking.payment_method || 'Card'}</span>
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm bg-primary/20 text-primary px-4 py-2 rounded-full font-semibold mb-2">
                      {booking.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Experience</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {booking.items.map((item, index) => (
                      <TableRow 
                        key={`${booking.id}-${item.experience.id}-${index}`}
                        className="hover:bg-primary/5 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 flex-shrink-0">
                              <img 
                                src={item.experience.imageUrl}
                                alt={item.experience.title}
                                className="w-full h-full object-cover rounded"
                              />
                            </div>
                            <div>
                              <a
                                href={`/experience/${item.experience.id}`}
                                className="font-medium line-clamp-1 text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.experience.title}
                              </a>
                              <p className="text-xs text-muted-foreground">{item.experience.location}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatRupees(item.price_at_booking)}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right font-semibold">{formatRupees(item.price_at_booking * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="bg-muted/20 flex justify-end pt-4 pb-4">
                <div className="text-lg font-bold">
                  Total: {formatRupees(booking.total_amount)}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No booking history</h3>
          <p className="text-gray-500 mb-6">You haven't made any bookings yet</p>
          <Button onClick={() => navigate('/experiences')}>Browse Experiences</Button>
        </div>
      )}
    </>
  );
};

export default BookingHistoryContent;
