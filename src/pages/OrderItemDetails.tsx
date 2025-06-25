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

const OrderItemDetails: React.FC = () => {
  const { orderId, experienceId } = useParams<{ orderId: string; experienceId: string }>();
  const navigate = useNavigate();
  const [orderDate, setOrderDate] = useState<Date | null>(null);
  const [item, setItem] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !experienceId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            booking_items (
              booking_id,
              quantity,
              price_at_booking,
              experience_id
            )
          `)
          .eq('id', orderId)
          .maybeSingle();
        if (error) throw error;
        if (!data) {
          setError('Order not found.');
          setLoading(false);
          return;
        }
        setOrderDate(new Date(data.booking_date));
        const found = data.booking_items.find((bi: RawBookingItem) => bi.experience_id === experienceId && bi.booking_id === data.id);
        if (!found) {
          setItem(null);
          setLoading(false);
          return;
        }
        const experience = await getExperienceById(found.experience_id);
        setItem({
          booking_id: found.booking_id,
          quantity: found.quantity,
          price_at_booking: found.price_at_booking,
          experience,
        });
      } catch (e: any) {
        setError(e.message || 'Failed to load order item.');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId, experienceId]);

  if (loading) return <div className="p-8 text-center">Loading experience details…</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!item) return <div className="p-8 text-center">Experience not found in this order.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-start pt-20 pb-12 px-2 md:px-8">
      <div className="mb-6 w-full max-w-2xl">
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 font-bold text-base px-6 py-3"
          onClick={() => navigate('/profile?tab=orders')}
        >
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </Button>
      </div>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 border border-gray-200 flex flex-col">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Experience Details</h1>
        <div className="flex gap-6 items-center mb-6">
          <img
            src={item.experience.imageUrl}
            alt={item.experience.title}
            className="w-32 h-24 object-cover rounded-xl border"
          />
          <div className="flex-1">
            <div className="font-semibold text-xl text-gray-800 mb-1">{item.experience.title}</div>
            <div className="text-sm text-gray-500 mb-2">{item.experience.location}</div>
            <div className="text-base">Qty: <span className="font-medium">{item.quantity}</span></div>
            <div className="text-base">Price: ₹{item.price_at_booking}</div>
          </div>
        </div>
        {orderDate && <div className="mb-2 text-gray-600 text-sm">Order Date: {format(orderDate, 'PPP p')}</div>}
      </div>
    </div>
  );
};

export default OrderItemDetails; 