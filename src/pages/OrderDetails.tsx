import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { getExperienceById, Experience } from '@/lib/data';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface RawBookingItem {
  booking_id: string;
  quantity: number;
  price_at_booking: number;
  experience_id: string;
}

interface RawBooking {
  id: string;
  booking_date: string;
  total_amount: number;
  booking_items: RawBookingItem[];
}

interface OrderItem {
  booking_id: string;
  quantity: number;
  price_at_booking: number;
  experience: Experience;
}

interface Order {
  id: string;
  booking_date: Date;
  total_amount: number;
  booking_items: OrderItem[];
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            total_amount,
            booking_items (
              booking_id,
              quantity,
              price_at_booking,
              experience_id
            )
          `)
          .eq('id', orderId)
          .maybeSingle(); // Only fetch one order
        if (error) throw error;
        if (!data) {
          setError('Order not found.');
          setLoading(false);
          return;
        }
        console.log('Supabase booking data:', data); // Debug log
        const b = data as RawBooking;
        const items: OrderItem[] = await Promise.all(
          b.booking_items
            .filter((bi) => bi.booking_id === b.id)
            .map(async (bi) => ({
              booking_id: bi.booking_id,
              quantity: bi.quantity,
              price_at_booking: bi.price_at_booking,
              experience: await getExperienceById(bi.experience_id)!,
            }))
        );
        setOrder({
          id: b.id,
          booking_date: new Date(b.booking_date),
          total_amount: b.total_amount,
          booking_items: items,
        });
      } catch (e: any) {
        setError(e.message || 'Failed to load order.');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) return <div className="p-8 text-center">Loading order details…</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-8 text-center">Order not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start pt-20 pb-12 px-2 md:px-8">
      <div className="mb-6 w-full max-w-2xl">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 font-bold text-base px-6 py-3"
          onClick={() => navigate('/profile')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-200 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Order Details</h1>
        <div className="mb-2 text-gray-600 text-sm">Order ID: <span className="font-mono">{order.id}</span></div>
        <div className="mb-6 text-gray-600 text-sm">Date: {format(order.booking_date, 'PPP p')}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {order.booking_items.map((it) => (
            <div key={it.booking_id + it.experience.id} className="flex gap-4 items-center border rounded-xl p-4 bg-gray-50 shadow-sm">
              <img
                src={it.experience.imageUrl}
                alt={it.experience.title}
                className="w-20 h-16 object-cover rounded-md border"
              />
              <div className="flex-1">
                <div className="font-semibold text-base text-gray-800">{it.experience.title}</div>
                <div className="text-xs text-gray-500 mb-1">{it.experience.location}</div>
                <div className="text-sm">Qty: <span className="font-medium">{it.quantity}</span></div>
                <div className="text-sm">Price: ₹{it.price_at_booking}</div>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-4 border-gray-200" />
        <div className="text-right font-bold text-xl text-primary">Total Paid: ₹{order.total_amount}</div>
      </div>
    </div>
  );
};

export default OrderDetails; 