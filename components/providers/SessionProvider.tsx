"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider
      refetchInterval={0} // Disable automatic refetching
      refetchOnWindowFocus={true} // Refetch when window gains focus
    >
      {children}
    </NextAuthSessionProvider>
  );
}
