import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

// Simple predefined admin credentials for admin access
const ADMIN_ID = "admin123";
const ADMIN_PASSWORD = "slash2025";

// Auth context
type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  session: Session | null;
  loading: boolean;
  login: (id: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        } else {
          // Check for admin auth in localStorage (for admin panel)
          const authStatus = localStorage.getItem('slash_admin_auth');
          if (authStatus === 'true') {
            setIsAuthenticated(true);
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
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Admin login function (still keeping for admin access)
  const login = async (id: string, password: string): Promise<boolean> => {
    if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('slash_admin_auth', 'true');
      toast.success('Logged in successfully');
      return true;
    } else {
      toast.error('Invalid credentials');
      return false;
    }
  };
  
  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error);
        toast.error('Failed to sign in with Google');
      }
    } catch (error) {
      console.error('Exception during Google sign in:', error);
      toast.error('An error occurred during sign in');
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      // If using Supabase auth
      if (session) {
        await supabase.auth.signOut();
      }
      
      // For admin auth
      localStorage.removeItem('slash_admin_auth');
      setIsAuthenticated(false);
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
      user, 
      session, 
      loading, 
      login, 
      logout, 
      signInWithGoogle 
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

// Auth guard component (for admin access)
export const requireAuth = (Component: React.ComponentType<any>) => {
  const ProtectedComponent = (props: any) => {
    const { isAuthenticated, login } = useAuth();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      login(id, password);
    };
    
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
              
              <div className="mt-4 text-center text-sm text-gray-600">
                <p>Use admin123 / slash2025 to login</p>
              </div>
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
