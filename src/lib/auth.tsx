import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { Navigate } from 'react-router-dom';

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
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          setIsAuthenticated(true);

          // Check admin status from user metadata
          const isAdminUser = currentSession.user.user_metadata?.isAdmin === true;
          setIsAdmin(isAdminUser);
          
          // Update local storage to match metadata
          if (isAdminUser) {
            localStorage.setItem('slash_admin_auth', 'true');
          }
        } else {
          // Check if we have a stored admin session
          const storedAdminAuth = localStorage.getItem('slash_admin_auth');
          if (storedAdminAuth === 'true') {
            setIsAuthenticated(true);
            setIsAdmin(true);
            // Create a temporary session for admin
            const tempSession = {
              user: {
                id: 'admin',
                email: 'admin@slash.com',
                user_metadata: { isAdmin: true },
                app_metadata: {},
                aud: 'authenticated',
                created_at: new Date().toISOString()
              },
              access_token: 'admin-token',
              refresh_token: 'admin-refresh-token',
              expires_in: 3600,
              token_type: 'bearer'
            } as Session;
            setSession(tempSession);
            setUser(tempSession.user);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);
        setIsAuthenticated(true);

        // Check admin status from user metadata
        const isAdminUser = newSession.user.user_metadata?.isAdmin === true;
        setIsAdmin(isAdminUser);
        
        // Update local storage to match metadata
        if (isAdminUser) {
          localStorage.setItem('slash_admin_auth', 'true');
        }
      } else {
        // Check if we have a stored admin session
        const storedAdminAuth = localStorage.getItem('slash_admin_auth');
        if (storedAdminAuth === 'true') {
          setIsAuthenticated(true);
          setIsAdmin(true);
          // Create a temporary session for admin
          const tempSession = {
            user: {
              id: 'admin',
              email: 'admin@slash.com',
              user_metadata: { isAdmin: true },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString()
            },
            access_token: 'admin-token',
            refresh_token: 'admin-refresh-token',
            expires_in: 3600,
            token_type: 'bearer'
          } as Session;
          setSession(tempSession);
          setUser(tempSession.user);
        } else {
          setIsAuthenticated(false);
          setIsAdmin(false);
          setUser(null);
          setSession(null);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Admin login function (only used in admin routes)
  const login = async (id: string, password: string): Promise<boolean> => {
    if (id === "admin123" && password === "slash2025") {
      try {
        setIsAuthenticated(true);
        setIsAdmin(true);
        localStorage.setItem('slash_admin_auth', 'true');
        
        // Create a temporary session for admin
        const tempSession = {
          user: {
            id: 'admin',
            email: 'admin@slash.com',
            user_metadata: { isAdmin: true },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString()
          },
          access_token: 'admin-token',
          refresh_token: 'admin-refresh-token',
          expires_in: 3600,
          token_type: 'bearer'
        } as Session;
        setSession(tempSession);
        setUser(tempSession.user);
        
        toast.success('Logged in successfully as admin');
        return true;
      } catch (error) {
        console.error('Error during admin login:', error);
        toast.error('Failed to create admin session');
        return false;
      }
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
          redirectTo: window.location.origin,
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google');
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear admin session if it exists
      localStorage.removeItem('slash_admin_auth');
      
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
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

// Auth guard component that checks for both authentication and admin status
export const requireAuth = (Component: React.ComponentType<any>, adminRequired: boolean = false) => {
  const ProtectedComponent = (props: any) => {
    const { isAuthenticated, isAdmin, loading, login, signInWithGoogle } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [adminCredentials, setAdminCredentials] = useState({ id: '', password: '' });

    const handleAdminLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        const success = await login(adminCredentials.id, adminCredentials.password);
        if (success) {
          toast.success('Admin login successful');
        }
      } catch (error) {
        console.error('Admin login error:', error);
        toast.error('Admin login failed');
      } finally {
        setIsSubmitting(false);
      }
    };

    // Show loading state
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Check for admin access if required
    if (adminRequired && !isAdmin) {
      return <Navigate to="/admin/login" replace />;
    }

    // If not authenticated, show login options
    if (!isAuthenticated) {
      // For admin routes, show both Google and admin login
      if (adminRequired) {
        return (
          <div className="flex flex-col min-h-screen">
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-bold">Admin Access</h2>
                  <p className="mt-2 text-gray-600">Sign in to access the admin dashboard</p>
                </div>

                <div className="space-y-4">
                  {/* Google Sign In */}
                  <button
                    onClick={() => signInWithGoogle()}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or</span>
                    </div>
                  </div>

                  {/* Admin Login Form */}
                  <form onSubmit={handleAdminLogin} className="space-y-4">
                    <div>
                      <label htmlFor="id" className="block text-sm font-medium text-gray-700">Admin ID</label>
                      <input
                        id="id"
                        type="text"
                        value={adminCredentials.id}
                        onChange={(e) => setAdminCredentials({ ...adminCredentials, id: e.target.value })}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                      <input
                        id="password"
                        type="password"
                        value={adminCredentials.password}
                        onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                        required
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90"
                    >
                      Admin Login
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      }
      
      // For non-admin routes, only show Google sign-in
      return (
        <div className="flex flex-col min-h-screen">
          <div className="flex flex-col items-center justify-center flex-grow p-6">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <h1 className="text-2xl font-bold">Sign in to continue</h1>
                <p className="mt-2 text-gray-600">Please sign in with Google to continue</p>
              </div>
              
              <button
                onClick={() => signInWithGoogle()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
  
  return ProtectedComponent;
};
