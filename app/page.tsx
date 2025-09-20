import CarouselBannerWrapper from "../components/CarouselBannerWrapper";
import { MovieCarousel } from "@/components/MovieCarousel";
import { 
  getPopularMovies, 
  getTopRatedMovies, 
  getUpcomingMovies,
  getNowPlayingMovies,
  getTrendingMovies,
  getPopularTVShows,
  getTopRatedTVShows,
  getOnTheAirTVShows,
  getAiringTodayTVShows,
  getTrendingTVShows,
  getPopularAnime,
  getTopRatedAnime
} from "@/lib/getMovies";
import { ContentType } from "@/typing";

export default async function Home({ 
  searchParams 
}: { 
  searchParams?: { [key: string]: string | string[] | undefined } 
}) {
  const contentType = (searchParams?.type as ContentType) || 'movie';

  const [
    upcomingMovies,
    topRatedMovies,
    popularMovies,
    nowPlayingMovies,
    trendingMovies,
    popularTVShows,
    topRatedTVShows,
    onTheAirTVShows,
    airingTodayTVShows,
    trendingTVShows,
    popularAnime,
    topRatedAnime,
  ] = await Promise.all([
    getUpcomingMovies(),
    getTopRatedMovies(),
    getPopularMovies(),
    getNowPlayingMovies(),
    getTrendingMovies(),
    getPopularTVShows(),
    getTopRatedTVShows(),
    getOnTheAirTVShows(),
    getAiringTodayTVShows(),
    getTrendingTVShows(),
    getPopularAnime(),
    getTopRatedAnime(),
  ]);

  const renderContent = () => {
    switch (contentType) {
      case 'tv':
        return (
          <div className="flex flex-col space-y-2 xl:-mt-48 isolate">
            <div className="isolate">
              <MovieCarousel movies={trendingTVShows} title="Trending TV Shows" type="tv" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={popularTVShows} title="Popular TV Shows" type="tv" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={topRatedTVShows} title="Top Rated TV Shows" type="tv" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={onTheAirTVShows} title="On The Air" type="tv" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={airingTodayTVShows} title="Airing Today" type="tv" />
            </div>
          </div>
        );
      case 'anime':
        return (
          <div className="flex flex-col space-y-2 xl:-mt-48 isolate">
            <div className="isolate">
              <MovieCarousel movies={popularAnime} title="Popular Anime" type="anime" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={topRatedAnime} title="Top Rated Anime" type="anime" />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col space-y-2 xl:-mt-48 isolate">
            <div className="isolate">
              <MovieCarousel movies={trendingMovies} title="Trending Movies" type="movie" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={upcomingMovies} title="Upcoming Movies" type="movie" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={topRatedMovies} title="Top Rated Movies" type="movie" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={popularMovies} title="Popular Movies" type="movie" />
            </div>
            <div className="isolate">
              <MovieCarousel movies={nowPlayingMovies} title="Now Playing" type="movie" />
            </div>
          </div>
        );
    }
  };

  return (
    <main className="relative bg-gradient-to-t from-gray-900/10 to-[#030303]">
      <div className="isolate">
        <CarouselBannerWrapper />
      </div>
      {renderContent()}
    </main>
  );
}
