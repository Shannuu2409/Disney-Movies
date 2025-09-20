"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { MovieCarousel } from '@/components/MovieCarousel';
import { 
  getSearchedContent, 
  getPopularMovies
} from '@/lib/getMovies';
import { Movie, TVShow } from '@/typing';

export default function SearchPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [anime, setAnime] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [popularMovies, setPopularMovies] = useState<Movie[]>([]);
  
  const params = useParams();
  const term = params.term as string;

  useEffect(() => {
    const searchContent = async () => {
      if (!term) return;
      
      setLoading(true);
      try {
        const termToSearch = decodeURIComponent(term);
        const [movieResults, tvResults, popularResults] = await Promise.all([
          getSearchedContent(termToSearch, 'movie'),
          getSearchedContent(termToSearch, 'tv'),
          getPopularMovies()
        ]);

        // TMDB API doesn't have a separate 'anime' search type.
        // We filter from TV show results based on the "Animation" genre ID (16).
        const animeResults: TVShow[] = tvResults.filter((show) => show.genre_ids.includes(16));
        const regularTvResults: TVShow[] = tvResults.filter((show) => !show.genre_ids.includes(16));

        setMovies(movieResults);
        setTvShows(regularTvResults);
        setAnime(animeResults);
        setPopularMovies(popularResults);
      } catch (error) {
        console.error('Error searching content:', error);
      } finally {
        setLoading(false);
      }
    };

    searchContent();
  }, [term]);

  if (loading) {
    return (
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col space-y-4 mt-32 xl:42'>
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Searching for &quot;{decodeURIComponent(term || '')}&quot;...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!term) {
    return (
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col space-y-4 mt-32 xl:42'>
          <h1 className='text-6xl font-bold px-10 pb-3 text-white'>No search term provided</h1>
        </div>
      </div>
    );
  }

  const termToUse = decodeURIComponent(term);
  const hasResults = movies.length > 0 || tvShows.length > 0 || anime.length > 0;

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex flex-col space-y-4 mt-32 xl:42'>
        <h1 className='text-6xl font-bold px-10 pb-3 text-white'>Results for &quot;{termToUse}&quot;</h1>
        
        {!hasResults ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">No results found</h2>
            <p className="text-gray-300 text-lg">Try searching for something else</p>
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <MovieCarousel title="Movies" movies={movies} type="movie" />
            )}
            {tvShows.length > 0 && (
              <MovieCarousel title="TV Shows" movies={tvShows} type="tv" />
            )}
            {anime.length > 0 && (
              <MovieCarousel title="Anime" movies={anime} type="anime" />
            )}
            <MovieCarousel title="You May Also Like" movies={popularMovies} type="movie" />
          </>
        )}
      </div>
    </div>
  );
}