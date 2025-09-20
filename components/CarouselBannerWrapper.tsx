"use client";

import { useEffect, useState } from "react";
import { getDiscovermovies } from "@/lib/getMovies";
import CarouselsBanner from "./CarouselsBanner";

type Props = {
    id?: string;
    keywords?: string;
}

export default function CarouselBannerWrapper({ id, keywords }: Props) {
    const [movies, setMovies] = useState<Array<import("@/typing").Movie | import("@/typing").TVShow>>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                const results = await getDiscovermovies(id, keywords);
                if (isMounted) setMovies(results);
            } catch (e) {
                if (isMounted) setMovies([]);
                console.error("Failed to load banner movies:", e);
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, [id, keywords]);

    if (loading) return null;
    return <CarouselsBanner movies={movies} />
}


