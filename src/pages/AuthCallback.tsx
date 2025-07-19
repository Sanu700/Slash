import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    async function handleAuthCallback() {
      try {
        // Wait for the session to be available
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) {
          console.error('Supabase getUser error:', userError.message);
          navigate('/');
          return;
        }
        if (!user) {
          // No user found, redirect home
          navigate('/');
          return;
        }
        // Referral logic
        const params = new URLSearchParams(location.search);
        let referrerId = params.get('ref');
        if (!referrerId) {
          referrerId = localStorage.getItem('pending_ref');
        }
        if (user && referrerId && user.id !== referrerId) {
          // Check if this referral already exists
          const { data, error: selectError } = await supabase
            .from('referrals')
            .select('*')
            .eq('user_id', referrerId)
            .eq('referred_user_id', user.id);
          if (selectError) {
            console.error('Supabase select error:', selectError.message);
          }
          if (!data || data.length === 0) {
            const { error: insertError } = await supabase.from('referrals').insert([
              { user_id: referrerId, referred_user_id: user.id },
            ]);
            if (insertError) {
              console.error('Referral insert error:', insertError.message);
            }
          }
          // Clear the ref from storage after use
          localStorage.removeItem('pending_ref');
        }
        // Redirect to homepage after handling
        if (isMounted) navigate('/');
      } catch (err) {
        console.error('Error in AuthCallback:', err);
        if (isMounted) navigate('/');
      }
    }
    handleAuthCallback();
    return () => { isMounted = false; };
  }, [navigate, location]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
} 