import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatRupees } from '@/lib/formatters';
import { supabase } from '@/lib/supabaseClient';

interface Payment {
  id: string;
  payment_id: string;
  order_id: string;
  user_id: string;
  status: string;
  amount: number;
  items: Array<{
    experience_id: string;
    quantity: number;
    price: number;
  }>;
  created_at: string;
  user?: {
    email: string;
    user_metadata: {
      full_name?: string;
    };
  };
  experiences?: Array<{
    id: string;
    title: string;
    location: string;
  }>;
}

export function PaymentDetails() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .select(`
          *,
          user:users(email, user_metadata),
          experiences:experiences(id, title, location)
        `)
        .order('created_at', { ascending: false });

      if (paymentsError) throw paymentsError;

      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading payment details...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>
                  {new Date(payment.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {payment.user?.user_metadata?.full_name || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.user?.email || 'N/A'}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {payment.payment_id}
                </TableCell>
                <TableCell>{formatRupees(payment.amount)}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    payment.status === 'success' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {payment.items.map((item, index) => {
                      const experience = payment.experiences?.find(
                        exp => exp.id === item.experience_id
                      );
                      return (
                        <div key={index} className="text-sm">
                          {experience?.title || 'Unknown Experience'} - {item.quantity}x
                          <span className="text-gray-500 ml-1">
                            ({formatRupees(item.price * item.quantity)})
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 