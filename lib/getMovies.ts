import { SearchResults, Movie, TVShow, Credits, Videos, ContentType } from "@/typing";

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function tmdbUrlOrProxy(path: string): URL {
  // On the server, call TMDB directly with token headers.
  // In the browser, call our proxy route so env token is not required client-side.
  if (isBrowser()) {
    const proxy = new URL(`/api/tmdb/${path.replace(/^\//, '')}`, typeof location !== 'undefined' ? location.origin : 'http://localhost');
    return proxy;
  }
  return new URL(`https://api.themoviedb.org/3/${path.replace(/^\//, '')}`);
}

async function fetchFromTMDB<T>(url: URL, cacheTime?: number): Promise<SearchResults<T>> {
  url.searchParams.set("include_adult", "false");
  url.searchParams.set("include_video", "false");
  url.searchParams.set("sort_by", "popularity.desc");
  url.searchParams.set("language", "en-US");
  url.searchParams.set("page", "1");

  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    next: {
      revalidate: cacheTime || 60 * 60 * 24,
    },
  };

  // Server-side direct calls: prefer v4 access token; otherwise use v3 api_key param
  if (!isBrowser()) {
    if (accessToken && accessToken.startsWith('ey')) {
      (options.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
    } else if (apiKey && !accessToken) {
      url.searchParams.set('api_key', apiKey);
    }
  }

  // If no token is available (likely client), route through proxy
  const haveServerAuth = (!isBrowser()) && ((accessToken && accessToken.startsWith('ey')) || (apiKey && !accessToken));
  const finalUrl = (!haveServerAuth && isBrowser()) ? tmdbUrlOrProxy(url.pathname + url.search) : url;
  const response = await fetch(finalUrl.toString(), options);
  if (!response.ok) {
    const errorBody = await response.text().catch(() => "<no body>");
    const error = new Error(`TMDB request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    console.error(error);
    throw error;
  }
  const data = (await response.json()) as SearchResults<T>;
  return data;
}

async function fetchFromTMDBGeneric<T>(url: URL, cacheTime?: number): Promise<T> {
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  const options: RequestInit = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
    next: {
      revalidate: cacheTime || 60 * 60 * 24,
    },
  };

  try {
    if (!isBrowser()) {
      if (accessToken && accessToken.startsWith('ey')) {
        (options.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
      } else if (apiKey && !accessToken) {
        url.searchParams.set('api_key', apiKey);
      }
    }

    const haveServerAuth = (!isBrowser()) && ((accessToken && accessToken.startsWith('ey')) || (apiKey && !accessToken));
    const finalUrl = (!haveServerAuth && isBrowser()) ? tmdbUrlOrProxy(url.pathname + url.search) : url;
    const response = await fetch(finalUrl.toString(), options);
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "<no body>");
      console.error(`TMDB request failed: ${response.status} ${response.statusText} - ${errorBody}`);
      throw new Error(`TMDB request failed: ${response.status}`);
    }
    const data = await response.json() as T;
    return data;
  } catch (error) {
    console.error("Failed to fetch from TMDB:", error);
    throw error;
  }
}

// Movie functions
export async function getUpcomingMovies() {
    const url = new URL("https://api.themoviedb.org/3/movie/upcoming");
    const data = await fetchFromTMDB<Movie>(url);
    return data.results;
}

export async function getTopRatedMovies() {
    const url = new URL("https://api.themoviedb.org/3/movie/top_rated");
    const data = await fetchFromTMDB<Movie>(url);
    return data.results;
}

export async function getPopularMovies() {
    const url = new URL("https://api.themoviedb.org/3/movie/popular");
    const data = await fetchFromTMDB<Movie>(url);
    return data.results;
}

export async function getNowPlayingMovies() {
    const url = new URL("https://api.themoviedb.org/3/movie/now_playing");
    const data = await fetchFromTMDB<Movie>(url);
    return data.results;
}

export async function getTrendingMovies() {
    const url = new URL("https://api.themoviedb.org/3/trending/movie/week");
    const data = await fetchFromTMDB<Movie>(url);
    return data.results;
}

// TV Show functions
export async function getPopularTVShows() {
    const url = new URL("https://api.themoviedb.org/3/tv/popular");
    const data = await fetchFromTMDB<TVShow>(url);
    return data.results;
}

export async function getTopRatedTVShows() {
    const url = new URL("https://api.themoviedb.org/3/tv/top_rated");
    const data = await fetchFromTMDB<TVShow>(url);
    return data.results;
}

export async function getOnTheAirTVShows() {
    const url = new URL("https://api.themoviedb.org/3/tv/on_the_air");
    const data = await fetchFromTMDB<TVShow>(url);
    return data.results;
}

export async function getAiringTodayTVShows() {
    const url = new URL("https://api.themoviedb.org/3/tv/airing_today");
    const data = await fetchFromTMDB<TVShow>(url);
    return data.results;
}

export async function getTrendingTVShows() {
    const url = new URL("https://api.themoviedb.org/3/trending/tv/week");
    const data = await fetchFromTMDB<TVShow>(url);
    return data.results;
}

// Anime functions (using TV shows with anime keywords)
export async function getPopularAnime() {
    const url = new URL("https://api.themoviedb.org/3/discover/tv");
    url.searchParams.set("with_keywords", "210024"); // Anime keyword ID
    url.searchParams.set("sort_by", "popularity.desc");
    const data = await fetchFromTMDB<TVShow>(url);
    return data.results;
}

export async function getTopRatedAnime() {
    const url = new URL("https://api.themoviedb.org/3/discover/tv");
    url.searchParams.set("with_keywords", "210024"); // Anime keyword ID
    url.searchParams.set("sort_by", "vote_average.desc");
    const data = await fetchFromTMDB<TVShow>(url);
    return data.results;
}

// Generic content functions
export async function getDiscoverContent(type: ContentType, id?: string, keywords?: string) {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const url = new URL(`https://api.themoviedb.org/3/discover/${endpoint}`);

    if (keywords) url.searchParams.set("with_keywords", keywords);
    if (id) url.searchParams.set("with_genres", id);

    const data = await fetchFromTMDB<typeof endpoint extends 'movie' ? Movie : TVShow>(url);
    return data.results;
}

export function getSearchedContent(term: string, type: 'movie'): Promise<Movie[]>;
export function getSearchedContent(term: string, type: 'tv'): Promise<TVShow[]>;
export async function getSearchedContent(term: string, type: ContentType = 'movie') {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const url = new URL(`https://api.themoviedb.org/3/search/${endpoint}`);
    url.searchParams.set("query", term);
    if (type === 'movie') {
        const data = await fetchFromTMDB<Movie>(url);
        return data.results;
    } else {
        const data = await fetchFromTMDB<TVShow>(url);
        return data.results;
    }
}

// Detail functions
export async function getMovieDetails(id: string) {
    const url = new URL(`https://api.themoviedb.org/3/movie/${id}`);
    return await fetchFromTMDBGeneric<Movie>(url, 60 * 60);
}

export async function getTVShowDetails(id: string) {
    const url = new URL(`https://api.themoviedb.org/3/tv/${id}`);
    return await fetchFromTMDBGeneric<TVShow>(url, 60 * 60);
}

export async function getContentDetails(id: string, type: ContentType) {
    if (type === 'movie') {
        return await getMovieDetails(id);
    } else {
        return await getTVShowDetails(id);
    }
}

export async function getMovieCredits(id: string) {
    const url = new URL(`https://api.themoviedb.org/3/movie/${id}/credits`);
    return await fetchFromTMDBGeneric<Credits>(url, 60 * 60);
}

export async function getTVShowCredits(id: string) {
    const url = new URL(`https://api.themoviedb.org/3/tv/${id}/credits`);
    return await fetchFromTMDBGeneric<Credits>(url, 60 * 60);
}

export async function getContentCredits(id: string, type: ContentType) {
    if (type === 'movie') {
        return await getMovieCredits(id);
    } else {
        return await getTVShowCredits(id);
    }
}

export async function getMovieVideos(id: string) {
    const url = new URL(`https://api.themoviedb.org/3/movie/${id}/videos`);
    return await fetchFromTMDBGeneric<Videos>(url, 60 * 60);
}

export async function getTVShowVideos(id: string) {
    const url = new URL(`https://api.themoviedb.org/3/tv/${id}/videos`);
    return await fetchFromTMDBGeneric<Videos>(url, 60 * 60);
}

export async function getContentVideos(id: string, type: ContentType) {
    if (type === 'movie') {
        return await getMovieVideos(id);
    } else {
        return await getTVShowVideos(id);
    }
}

// Genre functions
export async function getMovieGenres() {
    const url = new URL("https://api.themoviedb.org/3/genre/movie/list");
    return await fetchFromTMDBGeneric<{ genres: Array<{ id: number; name: string }> }>(url);
}

export async function getTVGenres() {
    const url = new URL("https://api.themoviedb.org/3/genre/tv/list");
    return await fetchFromTMDBGeneric<{ genres: Array<{ id: number; name: string }> }>(url);
}

// Legacy functions for backward compatibility
export async function getDiscovermovies(id?: string, keywords?: string) {
    return await getDiscoverContent('movie', id, keywords);
}

export async function getSearchedMovies(term: string) {
    return await getSearchedContent(term, 'movie');
}