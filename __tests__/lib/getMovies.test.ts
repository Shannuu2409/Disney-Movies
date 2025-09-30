import { getPopularMovies, getSearchedContent } from '@/lib/getMovies';

// Mock fetch
global.fetch = jest.fn();

describe('getMovies', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('should fetch popular movies successfully', async () => {
    const mockResponse = {
      results: [
        {
          id: 1,
          title: 'Test Movie',
          backdrop_path: '/test.jpg',
          vote_average: 8.5,
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const movies = await getPopularMovies();
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('movie/popular'),
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          accept: 'application/json',
        }),
      })
    );
    
    expect(movies).toEqual(mockResponse.results);
  });

  it('should handle fetch errors', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(getPopularMovies()).rejects.toThrow('Network error');
  });

  it('should search movies with correct parameters', async () => {
    const mockResponse = {
      results: [
        {
          id: 1,
          title: 'Searched Movie',
          backdrop_path: '/test.jpg',
          vote_average: 8.5,
        },
      ],
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const movies = await getSearchedContent('test query', 'movie');
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('search/movie'),
      expect.objectContaining({
        method: 'GET',
      })
    );
    
    expect(movies).toEqual(mockResponse.results);
  });
});


