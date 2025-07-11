import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    provider?: string;
  };
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user as User);
        setIsAuthenticated(true);
      }
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as User);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Referral logic: runs after user signs in, globally
    async function handleReferral() {
      if (!user) return;
      let referrerId = localStorage.getItem('pending_ref');
      if (!referrerId) return;
      if (user.id === referrerId) {
        console.log('[Referral] Self-referral detected, not inserting.');
        localStorage.removeItem('pending_ref');
        return;
      }
      // Check if referral already exists
      const { data, error: selectError } = await supabase
        .from('referrals')
        .select('*')
        .eq('user_id', referrerId)
        .eq('referred_user_id', user.id);
      if (selectError) {
        console.error('[Referral] Supabase select error:', selectError);
        return;
      }
      if (!data || data.length === 0) {
        console.log('[Referral] Inserting referral:', { user_id: referrerId, referred_user_id: user.id });
        const { error: insertError } = await supabase.from('referrals').insert([
          { user_id: referrerId, referred_user_id: user.id },
        ]);
        if (insertError) {
          console.error('[Referral] Supabase insert error:', insertError);
        } else {
          console.log('[Referral] Referral row inserted successfully!');
        }
      } else {
        console.log('[Referral] Referral already exists, not inserting.');
      }
      localStorage.removeItem('pending_ref');
    }
    handleReferral();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 