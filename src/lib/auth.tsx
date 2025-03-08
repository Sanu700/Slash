
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Simple predefined admin credentials
const ADMIN_ID = "admin123";
const ADMIN_PASSWORD = "slash2025";

export const useAuth = () => {
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
  
  return { isAuthenticated, login, logout };
};

// Auth guard component
export const requireAuth = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const { isAuthenticated } = useAuth();
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      return <AdminLogin />;
    }
    
    // If authenticated, render the protected component
    return <Component {...props} />;
  };
};

const AdminLogin = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(id, password);
  };
  
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
            <p>Contact administrator for login credentials</p>
          </div>
        </div>
      </div>
    </div>
  );
};
