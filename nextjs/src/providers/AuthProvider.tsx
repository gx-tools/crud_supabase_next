'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthStatus } from '@/utils/auth';
import { AuthRouteConstants } from '@/helpers/string_const';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Skip auth check for auth routes
    const pathname = window.location.pathname;
    if (
      pathname === AuthRouteConstants.LOGIN ||
      pathname === AuthRouteConstants.SIGNUP ||
      pathname.startsWith('/api/auth')
    ) {
      setIsLoading(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        // This will be a client-side request that includes cookies
        const response = await checkAuthStatus();
        
        if (response.success) {
          setIsAuthenticated(true);
          setUser(response.data);
        } else {
          // Redirect to login if not authenticated
          router.push(AuthRouteConstants.LOGIN);
        }
      } catch (error) {
        // Redirect to login on error
        router.push(AuthRouteConstants.LOGIN);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 