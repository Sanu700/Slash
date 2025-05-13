import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom';

// Simple predefined admin credentials for admin access
const ADMIN_ID = "admin123";
const ADMIN_PASSWORD = "slash2025";

// Auth context
type AuthContextType = {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: any | null;
  session: Session | null;
  loading: boolean;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateProfile: (data: { 
    full_name?: string | null; 
    avatar_url?: string | null;
    phone?: string | null;
    address?: string | null;
    bio?: string | null;
  }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is already authenticated with Supabase
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);
          
          // Check for admin email domain or specific user IDs that are admins
          const isAdminUser = 
            currentSession.user.email === 'admin@example.com' || 
            localStorage.getItem('slash_admin_auth') === 'true';
          
          setIsAdmin(isAdminUser);
        } else {
          // Check for admin auth in localStorage (for admin panel)
          const authStatus = localStorage.getItem('slash_admin_auth');
          if (authStatus === 'true') {
            setIsAuthenticated(true);
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user || null);
      setIsAuthenticated(!!newSession);
      
      // Check admin status whenever auth changes
      if (newSession?.user) {
        const isAdminUser = 
          newSession.user.email === 'admin@example.com' || 
          localStorage.getItem('slash_admin_auth') === 'true';
        
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Admin login function
  const login = async (id: string, password: string): Promise<boolean> => {
    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      localStorage.setItem('slash_admin_auth', 'true');
      toast.success('Logged in successfully as admin');
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const currentUrl = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: currentUrl,
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        toast.error(`Failed to sign in with Google: ${error.message}`);
      }
    } catch (error) {
      console.error('Exception during Google sign in:', error);
      toast.error('An error occurred during sign in');
    }
  };
  
  // Profile update function
  const updateProfile = async (data: { 
    full_name?: string | null; 
    avatar_url?: string | null;
    phone?: string | null;
    address?: string | null;
    bio?: string | null;
  }) => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      console.log('Starting profile update with data:', data);
      
      // First update the user metadata (only name and avatar)
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: data.full_name,
          avatar_url: data.avatar_url
        }
      });
      
      if (updateError) {
        console.error('Error updating auth metadata:', updateError);
        throw new Error(`Failed to update profile: ${updateError.message}`);
      }
      
      console.log('Auth metadata updated successfully');
      
      // Update the profiles table with all fields
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: data.full_name,
          avatar_url: data.avatar_url,
          phone: data.phone,
          address: data.address,
          bio: data.bio,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });
      
      if (profileError) {
        console.error('Error updating profiles table:', profileError);
        throw new Error(`Failed to update profile data: ${profileError.message}`);
      }
      
      console.log('Profiles table updated successfully');
      
      // Refresh the session to get updated user data
      const { data: { session: newSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Error refreshing session:', sessionError);
        throw new Error(`Failed to refresh session: ${sessionError.message}`);
      }
      
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        console.log('Session refreshed successfully');
      }
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error in updateProfile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
      throw error; // Re-throw to let the component handle it
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      if (session) {
        await supabase.auth.signOut();
      }
      
      localStorage.removeItem('slash_admin_auth');
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUser(null);
      setSession(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out');
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isAdmin,
      user, 
      session, 
      loading, 
      login, 
      logout, 
      signInWithGoogle,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth guard component that checks for both authentication and admin status
export const requireAuth = (Component: React.ComponentType<any>, adminRequired: boolean = false) => {
  const ProtectedComponent = (props: any) => {
    const { isAuthenticated, isAdmin, login, loading } = useAuth();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      login(id, password);
    };
    
    // Show loading state
    if (loading) {
      return (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-col items-center justify-center flex-grow p-6">
            <div className="animate-spin w-10 h-10 border-4 border-primary rounded-full border-t-transparent"></div>
            <p className="mt-4 text-lg">Loading...</p>
          </div>
        </div>
      );
    }
    
    // Check for admin access if required
    if (adminRequired && !isAdmin) {
      return <Navigate to="/profile" replace />;
    }
    
    // If not authenticated, show login screen
    if (!isAuthenticated) {
      return (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-col items-center justify-center flex-grow p-6">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Admin Login</h1>
                <p className="mt-2 text-gray-600">Enter your credentials to manage experiences</p>
              </div>
              
              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-gray-700">Admin ID</label>
                  <input
                    id="id"
                    type="text"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      );
    }
    
    // If authenticated, render the protected component
    return <Component {...props} />;
  };
  
  return ProtectedComponent;
};
