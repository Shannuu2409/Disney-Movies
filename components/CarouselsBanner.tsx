"use client";
import { Movie, TVShow } from "@/typing"
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from "next/image";
import getImagePath from "@/lib/getImagePath";

Autoplay.globalOptions = { delay: 4000 };



const CarouselsBanner = ({ movies }: { movies: (Movie | TVShow)[] }) => {
    const [emblaRef] = useEmblaCarousel({ loop: true, duration: 100 }, [Autoplay()])


  return (
    <div className="overflow-hidden lg:-mt-40 relative z-0 cursor-pointer isolate"
     ref={emblaRef}
    ><div className="flex">
        {movies.map((movie) => (
            <div key={movie.id} className="flex-[0_0_100%] min-w-0 relative">
                <Image
                src={getImagePath(movie.backdrop_path, true)}
                alt={'title' in movie ? movie.title : movie.name}
                width={1920}
                height={1080} />
					<div className="absolute inset-0 left-0 flex items-center pointer-events-none
					z-10 bg-gradient-to-r from-black/80 via-transparent to-transparent">
						<div className="p-6 md:p-10 space-y-3 md:space-y-5 text-white max-w-3xl">
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold max-w-xl z-10">
                        {'title' in movie ? movie.title : movie.name}
                    </h2>
						<p className="max-w-2xl line-clamp-3 text-sm md:text-base">
                        {movie.overview}
                    </p>
						</div>
                </div>
            </div>
        ))}
        </div>
			{/* Bottom fade to black for better legibility */}
			<div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-transparent via-gray-900/60 to-black dark:via-black-900/50 dark:to-[#0b0d17]" />
			{/* Right-edge black shade at the end of the banner */}
			<div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 z-0 bg-gradient-to-l from-black/70 to-transparent"/>
    </div>
  );
}

export default CarouselsBanner