import { render, screen, fireEvent } from '@testing-library/react';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/typing';

const mockMovie: Movie = {
  id: 1,
  title: 'Test Movie',
  backdrop_path: '/test-backdrop.jpg',
  poster_path: '/test-poster.jpg',
  release_date: '2023-01-01',
  vote_average: 8.5,
  vote_count: 1000,
  adult: false,
  genre_ids: [1, 2, 3],
  original_language: 'en',
  original_title: 'Test Movie',
  overview: 'A test movie',
  popularity: 100,
  video: false,
};

const mockTVShow = {
  id: 2,
  name: 'Test TV Show',
  backdrop_path: '/test-backdrop.jpg',
  poster_path: '/test-poster.jpg',
  first_air_date: '2023-01-01',
  vote_average: 7.5,
  vote_count: 500,
  adult: false,
  genre_ids: [1, 2, 3],
  original_language: 'en',
  original_name: 'Test TV Show',
  overview: 'A test TV show',
  popularity: 50,
  video: false,
  origin_country: ['US'],
  original_country: ['US'],
};

describe('MovieCard', () => {
  it('renders movie title', () => {
    render(<MovieCard movie={mockMovie} />);
    expect(screen.getByText('Test Movie')).toBeInTheDocument();
  });

  it('renders TV show name', () => {
    render(<MovieCard movie={mockTVShow} type="tv" />);
    expect(screen.getByText('Test TV Show')).toBeInTheDocument();
  });

  it('renders watchlist button when showWatchlist is true', () => {
    const mockToggle = jest.fn();
    render(
      <MovieCard 
        movie={mockMovie} 
        showWatchlist={true} 
        onWatchlistToggle={mockToggle}
      />
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onWatchlistToggle when watchlist button is clicked', () => {
    const mockToggle = jest.fn();
    render(
      <MovieCard 
        movie={mockMovie} 
        showWatchlist={true} 
        onWatchlistToggle={mockToggle}
      />
    );
    
    const watchlistButton = screen.getByRole('button');
    fireEvent.click(watchlistButton);
    
    expect(mockToggle).toHaveBeenCalledWith(1, 'movie');
  });

  it('does not render watchlist button when showWatchlist is false', () => {
    render(<MovieCard movie={mockMovie} showWatchlist={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders with correct link href', () => {
    render(<MovieCard movie={mockMovie} type="movie" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movie/1');
  });

  it('renders with correct TV show link href', () => {
    render(<MovieCard movie={mockTVShow} type="tv" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/tv/2');
  });
});
