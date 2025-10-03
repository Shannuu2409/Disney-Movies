"use client";

import { SignInButton, SignOutButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';

export default function AuthButton() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Button variant="outline" disabled className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        Loading...
      </Button>
    );
  }

  if (!isSignedIn) {
    return (
      <SignInButton>
        <Button 
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </SignInButton>
    );
  }

  return (
    <UserButton 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          avatarBox: "w-10 h-10"
        }
      }}
    />
  );
}
