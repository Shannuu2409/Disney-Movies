"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { WatchlistItem, ContentType } from '@/typing';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchWatchlist();
    } else {
      setWatchlist([]);
    }
  }, [user]);

  const fetchWatchlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/watchlist', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (
    contentId: number,
    contentType: ContentType,
    title: string,
    posterPath?: string,
    releaseDate: string = '',
    voteAverage: number = 0
  ) => {
    if (!user) return false;

    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contentId,
          contentType,
          title,
          posterPath,
          releaseDate,
          voteAverage,
        }),
      });

      if (response.ok) {
        await fetchWatchlist();
        return true;
      }
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
    return false;
  };

  const removeFromWatchlist = async (contentId: number, contentType: ContentType) => {
    if (!user) return false;

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/watchlist?contentId=${contentId}&contentType=${contentType}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchWatchlist();
        return true;
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
    return false;
  };

  const isInWatchlist = (contentId: number, contentType: ContentType) => {
    return watchlist.some(
      item => item.contentId === contentId && item.contentType === contentType
    );
  };

  const toggleWatchlist = async (
    contentId: number,
    contentType: ContentType,
    title: string,
    posterPath?: string,
    releaseDate: string = '',
    voteAverage: number = 0
  ) => {
    if (isInWatchlist(contentId, contentType)) {
      return await removeFromWatchlist(contentId, contentType);
    } else {
      return await addToWatchlist(contentId, contentType, title, posterPath, releaseDate, voteAverage);
    }
  };

  return {
    watchlist,
    loading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    fetchWatchlist,
  };
}
