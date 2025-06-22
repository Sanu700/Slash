import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { getExperienceById, Experience } from '@/lib/data';
import { format } from 'date-fns';

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

export default function OrdersTab() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    (async () => {
      setLoading(true);
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
          .eq('user_id', user.id)
          .order('booking_date', { ascending: false });

        if (error) throw error;
        if (!data) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const bookings = (data as unknown) as RawBooking[];

        const hydrated = await Promise.all(
          bookings.map(async (b) => {
            const items: OrderItem[] = await Promise.all(
              b.booking_items.map(async (bi) => ({
                booking_id: bi.booking_id,
                quantity: bi.quantity,
                price_at_booking: bi.price_at_booking,
                experience: await getExperienceById(bi.experience_id)!,
              }))
            );
            return {
              id: b.id,
              booking_date: new Date(b.booking_date),
              total_amount: b.total_amount,
              booking_items: items,
            };
          })
        );

        setOrders(hydrated);
      } catch (e) {
        console.error('Loading orders failed:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (loading) return <div>Loading orders…</div>;
  if (orders.length === 0)
    return <div className="text-center py-8 text-muted-foreground">No orders yet.</div>;

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div
          key={o.id}
          className="border rounded-lg p-6 space-y-2 bg-white dark:bg-gray-800"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Date: {format(o.booking_date, 'PPP p')}
          </div>
          <ul className="list-disc pl-4 space-y-1">
            {o.booking_items.map((it) => (
              <li key={it.booking_id + it.experience.id}>
                {it.experience.title} × {it.quantity} — ₹{it.price_at_booking}
              </li>
            ))}
          </ul>
          <div className="text-right font-semibold text-gray-900 dark:text-white">
            Total Paid: ₹{o.total_amount}
          </div>
        </div>
      ))}
    </div>
  );
}
