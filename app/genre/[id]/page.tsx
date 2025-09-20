import { MovieCarousel } from "@/components/MovieCarousel";
import { getDiscovermovies } from "@/lib/getMovies";

type Props = {
    params: {
        id: string;
    };
    searchParams: {
        genre: string;
    };
};

async function GenrePage({params: {id}, searchParams: { genre }}: Props) {

  const movies = await getDiscovermovies(id); 
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mt-32 xl:mt-42">
        <h1 className="text-6xl font-bold px-10">
          Results for {genre }
        </h1>
      </div>
       <MovieCarousel title={`Genre`} movies={movies} />
    </div>
  )
}

export default GenrePage