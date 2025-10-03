"use client";

import React from 'react';
import { ClerkProvider, useUser } from '@clerk/nextjs';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      {children}
    </ClerkProvider>
  );
}

export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser();

  // Adapt Clerk's user to the minimal interface used in the app
  const adaptedUser = React.useMemo(() => {
    if (!user) return null as unknown as { getIdToken: () => Promise<string> } | null;

    return {
      // Provide Firebase-like API expected by hooks: getIdToken()
      async getIdToken() {
        const token = await user.getToken();
        return token ?? '';
      },
      id: user.id,
      emailAddresses: user.emailAddresses,
      fullName: user.fullName,
      imageUrl: user.imageUrl,
    } as unknown as { getIdToken: () => Promise<string> } & typeof user;
  }, [user]);

  return {
    user: isSignedIn ? (adaptedUser as any) : null,
    loading: !isLoaded,
  } as const;
}
