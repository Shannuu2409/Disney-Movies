"use client";

import { Movie, TVShow, ContentType } from '@/typing'
import Image from 'next/image';
import getImagePath from '@/lib/getImagePath';
import Link from 'next/link';
import { Button } from '@/components/ui/button'
import { Heart, Star } from 'lucide-react'

interface MovieCardProps {
  movie: Movie | TVShow;
  type?: ContentType;
  showWatchlist?: boolean;
  onWatchlistToggle?: (id: number, type: ContentType) => void;
  isInWatchlist?: boolean;
}

function MovieCard({ 
  movie, 
  type = 'movie', 
  showWatchlist = true, 
  onWatchlistToggle,
  isInWatchlist = false 
}: MovieCardProps) {
  const title = 'title' in movie ? movie.title : movie.name;
  
  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onWatchlistToggle) {
      onWatchlistToggle(movie.id, type);
    }
  };

  return (
    <Link href={`/${type}/${movie.id}`}>
      <div 
        className='relative flex-shrink-0 cursor-pointer transform hover:scale-105 transition duration-250 easy-out hover:drop-shadow-lg w-[220px] sm:w-[260px] md:w-[300px] lg:w-[400px] group'
      >
        <div className='absolute inset-0 bg-gradient-to-b from-gray-200/0 via-gray-900/10 to-gray-300 dark:to-[#1A1C29]/80 z-10' />
        
        {/* Rating Badge */}
        <div className='absolute top-3 right-3 z-20 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1'>
          <Star className='w-3 h-3 text-yellow-400 fill-yellow-400' />
          <span className='text-white text-xs font-semibold'>
            {movie.vote_average.toFixed(1)}
          </span>
        </div>

        {/* Watchlist Button */}
        {showWatchlist && onWatchlistToggle && (
          <Button
            size="sm"
            variant="ghost"
            className={`absolute top-3 left-3 z-20 p-2 rounded-full transition-all duration-200 ${
              isInWatchlist 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-black/50 hover:bg-black/70 text-white'
            }`}
            onClick={handleWatchlistClick}
          >
            <Heart 
              className={`w-4 h-4 ${isInWatchlist ? 'fill-current' : ''}`} 
            />
          </Button>
        )}

        
        <div className='absolute bottom-0 left-0 right-0 z-20 p-4'>
          <h3 className='text-white font-bold text-lg mb-2 line-clamp-2'>
            {title}
          </h3>
        </div>

        <Image 
          className='w-full h-56 object-cover object-center shadow-md shadow-gray-900 drop-shadow-xl rounded-sm'
          src={getImagePath(movie.backdrop_path || movie.poster_path)}
          alt={title}
          width={1920}
          height={1080}
        />
      </div>
    </Link>
  )
}

export default MovieCard