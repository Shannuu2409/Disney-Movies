"use client";

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/hooks/useWatchlist';
import { Button } from '@/components/ui/button';
import { Heart, Star, Calendar, Film, Tv, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import getImagePath from '@/lib/getImagePath';

export default function WatchlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { watchlist, loading: watchlistLoading, removeFromWatchlist } = useWatchlist();

  if (authLoading || watchlistLoading) {
    return (
      <main className="relative bg-gradient-to-t from-gray-900/10 to-[#030303] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading your watchlist...</p>
        </div>
      </main>
    );
  }

  // Clerk guards
  if (!user) {
    return (
      <main className="relative bg-gradient-to-t from-gray-900/10 to-[#030303] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-300 text-lg mb-6">Please sign in to view your watchlist</p>
          <SignInButton mode="modal">
            <Button className="bg-red-600 hover:bg-red-700">Sign in</Button>
          </SignInButton>
        </div>
      </main>
    );
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'anime':
        return <Zap className="w-4 h-4" />;
      default:
        return <Film className="w-4 h-4" />;
    }
  };

  const handleRemoveFromWatchlist = async (contentId: number, contentType: 'movie' | 'tv' | 'anime') => {
    await removeFromWatchlist(contentId, contentType);
  };

  if (watchlist.length === 0) {
    return (
      <main className="relative bg-gradient-to-t from-gray-900/10 to-[#030303] min-h-screen">
        <div className="pt-20 px-8">
          <h1 className="text-4xl font-bold text-white mb-8">My Watchlist</h1>
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Your watchlist is empty</h2>
            <p className="text-gray-300 text-lg mb-8">Start adding movies, TV shows, and anime to your watchlist!</p>
            <Button asChild className="bg-red-600 hover:bg-red-700">
              <Link href="/">Browse Content</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-gradient-to-t from-gray-900/10 to-[#030303] min-h-screen">
      <div className="pt-20 px-8">
        <h1 className="text-4xl font-bold text-white mb-8">My Watchlist</h1>
        <p className="text-gray-300 text-lg mb-8">
          {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} in your watchlist
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlist.map((item) => (
            <div key={`${item.contentId}-${item.contentType}`} className="group relative">
              <Link href={`/${item.contentType}/${item.contentId}`}>
                <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg mb-3">
                  <Image
                    src={getImagePath(item.posterPath)}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Content Type Badge */}
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    {getContentIcon(item.contentType)}
                    <span className="text-white text-xs font-semibold capitalize">
                      {item.contentType}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-semibold">
                      {item.voteAverage?.toFixed(1) || item.vote_average?.toFixed(1) || 'N/A'}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute bottom-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveFromWatchlist(item.contentId, item.contentType);
                    }}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              </Link>
              
              <div className="text-center">
                <h3 className="font-semibold text-white text-sm leading-tight mb-1 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{item.releaseDate ? new Date(item.releaseDate).getFullYear() : (item.release_date ? new Date(item.release_date).getFullYear() : 'N/A')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
