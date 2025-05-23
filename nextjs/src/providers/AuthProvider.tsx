'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { checkAuthStatus } from '@/utils/auth';
import { AuthRouteConstants } from '@/helpers/string_const';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  recheckAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  recheckAuth: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const verifyAuth = async () => {
    try {
      setIsLoading(true);
      const response = await checkAuthStatus();
      
      if (response.success) {
        setIsAuthenticated(true);
        setUser(response.data);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        // Only redirect to login if we're not already on an auth route
        if (
          pathname !== AuthRouteConstants.LOGIN &&
          pathname !== AuthRouteConstants.SIGNUP &&
          !pathname.startsWith('/api/auth')
        ) {
          router.push(AuthRouteConstants.LOGIN);
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      // Only redirect to login if we're not already on an auth route
      if (
        pathname !== AuthRouteConstants.LOGIN &&
        pathname !== AuthRouteConstants.SIGNUP &&
        !pathname.startsWith('/api/auth')
      ) {
        router.push(AuthRouteConstants.LOGIN);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const recheckAuth = async () => {
    await verifyAuth();
  };

  useEffect(() => {
    // Skip auth check for auth routes
    if (
      pathname === AuthRouteConstants.LOGIN ||
      pathname === AuthRouteConstants.SIGNUP ||
      pathname.startsWith('/api/auth')
    ) {
      setIsLoading(false);
      return;
    }

    verifyAuth();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, recheckAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 