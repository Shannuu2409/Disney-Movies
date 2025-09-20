export type Genre = {
    id: number;
    name: string;
}

export type Genres = {
    genres: Genre[];
}

export type SearchResults<T> = {
    page: number;
    results: T[];
    total_pages: number;
    total_results: number;
}

export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path?: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    runtime?: number;
    budget?: number;
    revenue?: number;
    genres?: Genre[];
    production_companies?: ProductionCompany[];
    production_countries?: ProductionCountry[];
    spoken_languages?: SpokenLanguage[];
    status?: string;
    tagline?: string;
}

export type TVShow = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path?: string;
    first_air_date: string;
    name: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    origin_country: string[];
    original_country: string[];
    genres?: Genre[];
    production_companies?: ProductionCompany[];
    production_countries?: ProductionCountry[];
    spoken_languages?: SpokenLanguage[];
    status?: string;
    tagline?: string;
    number_of_episodes?: number;
    number_of_seasons?: number;
    episode_run_time?: number[];
    last_air_date?: string;
    in_production?: boolean;
    type?: string;
}

export type Anime = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path?: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    runtime?: number;
    budget?: number;
    revenue?: number;
    genres?: Genre[];
    production_companies?: ProductionCompany[];
    production_countries?: ProductionCountry[];
    spoken_languages?: SpokenLanguage[];
    status?: string;
    tagline?: string;
    original_name?: string;
    name?: string;
    first_air_date?: string;
    last_air_date?: string;
    number_of_episodes?: number;
    number_of_seasons?: number;
    episode_run_time?: number[];
    in_production?: boolean;
    type?: string;
}

export type ProductionCompany = {
    id: number;
    logo_path?: string;
    name: string;
    origin_country: string;
}

export type ProductionCountry = {
    iso_3166_1: string;
    name: string;
}

export type SpokenLanguage = {
    english_name: string;
    iso_639_1: string;
    name: string;
}

export type Cast = {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path?: string;
    cast_id: number;
    character: string;
    credit_id: string;
    order: number;
}

export type Crew = {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path?: string;
    credit_id: string;
    department: string;
    job: string;
}

export type Credits = {
    id: number;
    cast: Cast[];
    crew: Crew[];
}

export type Video = {
    iso_639_1: string;
    iso_3166_1: string;
    name: string;
    key: string;
    site: string;
    size: number;
    type: string;
    official: boolean;
    published_at: string;
    id: string;
}

export type Videos = {
    id: number;
    results: Video[];
}

export type ContentType = 'movie' | 'tv' | 'anime';

export type User = {
    id: string;
    email: string;
    name: string;
    image?: string;
    watchlist: number[];
}

export type WatchlistItem = {
    id: number;
    contentId: number;
    title: string;
    poster_path?: string;
    posterPath?: string;
    release_date: string;
    releaseDate?: string;
    vote_average: number;
    voteAverage?: number;
    type: ContentType;
    contentType: ContentType;
}