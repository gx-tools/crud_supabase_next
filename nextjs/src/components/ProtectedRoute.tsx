'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // We don't need to redirect here since the AuthProvider will do that
    return null;
  }

  return <>{children}</>;
} 