"use client";
import { Movie, TVShow, ContentType } from "@/typing"
import MovieCard from "./MovieCard";
import MovieDetailModal from "./MovieDetailModal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useWatchlist } from "@/hooks/useWatchlist";

type Props = {
    title?: string;
    movies: (Movie | TVShow)[];
    type?: ContentType;
};

export const MovieCarousel = ({title, movies, type = 'movie'}: Props) => {
  const [activeMovieId, setActiveMovieId] = useState<number | null>(null);
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const handleWatchlistToggle = (id: number, contentType: ContentType) => {
    const movie = movies.find(m => m.id === id);
    if (movie) {
      const title = 'title' in movie ? movie.title : movie.name;
      const releaseDate = 'release_date' in movie ? movie.release_date : movie.first_air_date;
      toggleWatchlist(id, contentType, title, movie.poster_path, releaseDate, movie.vote_average);
    }
  };

  return (
    <div className="z-50">
        <h2 className="text-xl font-bold px-10 py-2 text-white">{title}</h2>
        <div className={cn("flex space-x-4 overflow-x-auto px-5 lg:px-10 py-5 scrollbar-hide")}> 
          {movies?.map((movie) => (
            <div key={movie.id} onClick={() => setActiveMovieId(movie.id)}>
              <MovieCard 
                movie={movie} 
                type={type}
                onWatchlistToggle={handleWatchlistToggle}
                isInWatchlist={isInWatchlist(movie.id, type)}
              />
            </div>
          ))}
        </div>
        <MovieDetailModal movieId={activeMovieId} onClose={() => setActiveMovieId(null)} type={type} />
    </div>
  );
}
