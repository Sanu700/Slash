import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('AuthCallback useEffect running');
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event);
      if (event === 'SIGNED_IN') {
        alert('SIGNED_IN event triggered');
        // Referral logic
        const params = new URLSearchParams(location.search);
        let referrerId = params.get('ref');
        if (!referrerId) {
          referrerId = localStorage.getItem('pending_ref');
        }
        alert('RefTracker: location.search = ' + location.search);
        alert('RefTracker: localStorage.pending_ref = ' + localStorage.getItem('pending_ref'));
        alert('ReferrerId: ' + referrerId);
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          alert('Supabase getUser error: ' + userError.message);
        }
        alert('New user: ' + (user ? JSON.stringify(user) : 'null'));
        if (user && referrerId && user.id !== referrerId) {
          // Check if this referral already exists
          const { data, error: selectError } = await supabase
            .from('referrals')
            .select('*')
            .eq('user_id', referrerId)
            .eq('referred_user_id', user.id);
          if (selectError) {
            alert('Supabase select error: ' + selectError.message);
          } else {
            alert('Referral select result: ' + JSON.stringify(data));
          }
          if (!data || data.length === 0) {
            alert('Inserting referral: ' + JSON.stringify({ user_id: referrerId, referred_user_id: user.id }));
            const { error: insertError } = await supabase.from('referrals').insert([
              { user_id: referrerId, referred_user_id: user.id },
            ]);
            if (insertError) {
              alert('Referral insert error: ' + insertError.message);
            } else {
              alert('Referral row inserted successfully!');
            }
          } else {
            alert('Referral already exists, not inserting.');
          }
          // Clear the ref from storage after use
          localStorage.removeItem('pending_ref');
        } else {
          if (!user) alert('No user found after signup.');
          if (!referrerId) alert('No referrerId found.');
          if (user && referrerId && user.id === referrerId) alert('Self-referral detected, not inserting.');
        }
        navigate('/');
      }
    });
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
} 