/**
 * MockAuthProvider - Development-only wrapper for bypassing authentication
 *
 * This component mocks the auth store and profile data for local development
 * without requiring a backend or Keycloak.
 */

import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { organizationApi, conversationApi, fileApi } from '@/services/api';
import keycloak from '@/services/keycloak';
import { enableMockFetch } from '@/mocks/mockFetch';

// Enable mock fetch IMMEDIATELY at module load time (before any components render)
enableMockFetch();

// Mock Keycloak IMMEDIATELY at module load time
(keycloak as any).authenticated = true;
(keycloak as any).token = 'mock-token';
(keycloak as any).refreshToken = 'mock-refresh-token';
(keycloak as any).updateToken = async () => true;
(keycloak as any).logout = async () => {
  console.log('Mock: Keycloak logout blocked');
};

// Set auth store state IMMEDIATELY
useAuthStore.setState({
  authenticated: true,
  initialized: true,
  loading: false,
  sessionReady: true,
  user: {
    id: 'mock-user-id',
    email: 'dev@example.com',
    firstName: 'Dev',
    lastName: 'User',
    username: 'devuser',
  },
  token: 'mock-token',
  refreshToken: 'mock-refresh-token',
  tokenExpiry: Date.now() + 3600000,
  error: null,
});

// Create a custom QueryClient that doesn't retry and returns immediately
const mockQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
    },
  },
});

interface MockAuthProviderProps {
  children: React.ReactNode;
  role?: 'owner' | 'admin' | 'user';
}

export function MockAuthProvider({ children, role = 'owner' }: MockAuthProviderProps) {
  // Everything is already set up at module load time
  // This component just provides the QueryClient wrapper

  return (
    <QueryClientProvider client={mockQueryClient}>
      {children}
    </QueryClientProvider>
  );
}
