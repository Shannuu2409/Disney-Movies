"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";
import { ContentType, Movie, Credits, Videos, Genre, ProductionCompany } from "@/typing";
// import { useWatchlist } from "@/hooks/useWatchlist";
// import { Button } from "@/components/ui/button";
// import { Heart, Star, Calendar, Clock, Users, DollarSign } from "lucide-react";

type ModalProps = {
  movieId: number | null;
  onClose: () => void;
  type?: ContentType;
};

export default function MovieDetailModal({ movieId, onClose, type = 'movie' }: ModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [details, setDetails] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [videos, setVideos] = useState<Videos | null>(null);
  const [showTrailer, setShowTrailer] = useState<boolean>(false);
  // const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    if (!movieId) return;
    setOpen(true);
    setLoading(true);
    setShowTrailer(false);
    
    const fetchData = async () => {
      try {
        const [detailsRes, creditsRes, videosRes] = await Promise.all([
          fetch(`/api/${type}/${movieId}`),
          fetch(`/api/${type}/${movieId}/credits`),
          fetch(`/api/${type}/${movieId}/videos`)
        ]);

        const [detailsData, creditsData, videosData] = await Promise.all([
          detailsRes.json(),
          creditsRes.json(),
          videosRes.json()
        ]);

        setDetails(detailsData);
        setCredits(creditsData);
        setVideos(videosData);
      } catch (error) {
        console.error('Error fetching content data:', error);
        setDetails(null);
        setCredits(null);
        setVideos(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId, type]);

  const trailerKey = useMemo(() => {
    const results = videos?.results || [];
    const trailer = results.find((r) => r.type === "Trailer" && r.site === "YouTube");
    return trailer?.key as string | undefined;
  }, [videos]);

  if (!movieId || !open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 transition-opacity duration-200">
      {/* Close Button */}
      <button
        onClick={() => { setOpen(false); onClose(); }}
        className="absolute top-6 right-6 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading movie details...</p>
          </div>
        </div>
      ) : details ? (
        <>
          {/* Hero Banner */}
          <div className="relative h-[60vh] w-full max-w-6xl mx-auto">
            <Image
              src={getImagePath(details?.backdrop_path, true)}
              alt={details?.title || "Movie Banner"}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white max-w-4xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-black font-bold text-sm">
                      {Number(details?.vote_average || 0).toFixed(1)}
                    </span>
                  </div>
                  <span className="text-lg font-semibold">TMDB Rating</span>
                </div>
                <div className="text-lg text-gray-300">
                  {String(details?.release_date || "").slice(0,4)}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {details?.title}
              </h1>
              
              {Boolean(details?.genres?.length) && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {(details.genres as Genre[]).map((g) => (
                    <span key={g.id} className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-lg md:text-xl text-gray-200 leading-relaxed mb-8 max-w-3xl">
                {details?.overview}
              </p>
              
              {trailerKey && (
                <button
                  onClick={() => {
                    setShowTrailer(true);
                    setTimeout(() => {
                      const trailerSection = document.getElementById('trailer-section');
                      trailerSection?.scrollIntoView({ behavior: 'smooth' });
                    }, 0);
                  }}
                  className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Movie Not Found</h2>
            <p className="text-gray-300">Sorry, we couldn&apos;t load the movie details.</p>
          </div>
        </div>
      )}

      {/* Content Section */}
      {details && (
        <div className="text-white">
          <div className="max-w-6xl mx-auto px-6 py-8 pb-0">
            {/* Trailer Section */}
            {trailerKey && showTrailer && (
              <div id="trailer-section" className="mb-8">
                <h2 className="text-3xl font-bold mb-8">Trailer</h2>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                    title="Movie Trailer"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Cast Section */}
            {Boolean(credits?.cast?.length) && credits && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-8">Cast & Crew</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {credits.cast.slice(0, 12).map((p) => (
                    <div key={p.cast_id} className="group">
                      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg mb-3">
                        <Image
                          src={getImagePath(p.profile_path)}
                          alt={p.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-sm leading-tight mb-1">{p.name}</h3>
                        <p className="text-xs text-gray-400 leading-tight">as {p.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Movie Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-3">Movie Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Release Date</span>
                    <span>{new Date(details?.release_date || "").toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Runtime</span>
                    <span>{details?.runtime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rating</span>
                    <span>{Number(details?.vote_average || 0).toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Vote Count</span>
                    <span>{details?.vote_count?.toLocaleString()}</span>
                  </div>
                  {typeof details?.budget === 'number' && details.budget > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Budget</span>
                      <span>${(details?.budget || 0).toLocaleString()}</span>
                    </div>
                  )}
                  {typeof details?.revenue === 'number' && details.revenue > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue</span>
                      <span>${(details?.revenue || 0).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-3">Genres & Production</h3>
                {Boolean(details?.genres?.length) && (
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold mb-3">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {(details.genres as Genre[]).map((g) => (
                        <span key={g.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {Boolean(details?.production_companies?.length) && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Production Companies</h4>
                    <div className="space-y-2">
                      {(details.production_companies as ProductionCompany[]).slice(0, 3).map((company) => (
                        <div key={company.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center">
                            <span className="text-xs font-bold">{company.name[0]}</span>
                          </div>
                          <span className="text-sm">{company.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


