import { MovieCarousel } from "@/components/MovieCarousel";
import { getDiscovermovies } from "@/lib/getMovies";

type PageProps = {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function GenrePage({ params, searchParams }: any) {
  const id = params.id;
  const genreParam = searchParams?.genre;
  const genre = Array.isArray(genreParam) ? genreParam[0] : genreParam;

  const movies = await getDiscovermovies(id); 
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col space-y-4 mt-32 xl:mt-42">
        <h1 className="text-6xl font-bold px-10">
          Results for {genre ?? "Genre"}
        </h1>
      </div>
       <MovieCarousel title={`Genre`} movies={movies} />
    </div>
  )
}