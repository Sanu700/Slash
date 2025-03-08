
import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';

// Simple predefined admin credentials
const ADMIN_ID = "admin123";
const ADMIN_PASSWORD = "slash2025";

// Auth context
type AuthContextType = {
  isAuthenticated: boolean;
  login: (id: string, password: string) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is already authenticated
    const authStatus = localStorage.getItem('slash_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);
  
  const login = (id: string, password: string): boolean => {
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
  
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('slash_admin_auth');
    toast.success('Logged out successfully');
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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

// Auth guard component
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
