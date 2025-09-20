"use client";

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return (
      <Button variant="outline" disabled className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
        Loading...
      </Button>
    );
  }

  if (!user) {
    return (
      <Button 
        onClick={signInWithGoogle}
        className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        >
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User'}
              width={24}
              height={24}
              className="rounded-full mr-2"
            />
          ) : (
            <User className="w-4 h-4 mr-2" />
          )}
          {user.displayName || 'User'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuItem className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={signOut}
          className="flex items-center gap-2 text-red-600"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
