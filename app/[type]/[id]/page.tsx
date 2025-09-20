"use client";

import { useParams, useRouter } from "next/navigation";
import { ContentType } from "@/typing";
import MovieDetailModal from "@/components/MovieDetailModal";

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as ContentType;
  const id = parseInt(params.id as string);

  if (!id || !type) {
    return (
      <main className="relative bg-gradient-to-t from-gray-900/10 to-[#030303] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Content Not Found</h1>
          <p className="text-gray-300 text-lg">The requested content could not be found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative bg-gradient-to-t from-gray-900/10 to-[#030303] min-h-screen">
      <MovieDetailModal 
        movieId={id} 
        onClose={() => router.back()} 
        type={type}
      />
    </main>
  );
}
