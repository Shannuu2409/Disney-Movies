import { Genres } from "@/typing";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

async function GenreDropdown() {
    const url = 'https://api.themoviedb.org/3/genre/movie/list?language=en';

    // Support both common env var names
    const bearerToken = process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_API_KEY;

    let data: Genres = { genres: [] };

    if (!bearerToken) {
        console.error("TMDB bearer token is missing. Set TMDB_ACCESS_TOKEN (v4) or TMDB_API_KEY.");
    } else {
        const options: RequestInit = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${bearerToken}`,
            },
            next: {
                revalidate: 60 * 60 * 24,
            },
        };

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorBody = await response.text().catch(() => "<no body>");
                throw new Error(`TMDB request failed: ${response.status} ${response.statusText} - ${errorBody}`);
            }
            data = (await response.json()) as Genres;
        } catch (error) {
            console.error("Failed to fetch TMDB genres:", error);
            data = { genres: [] };
        }
    }

    return (
        <DropdownMenu>

            <DropdownMenuTrigger className="text-white flex justify-center items-center">
                Genre
                <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuLabel>Types</DropdownMenuLabel>
                <DropdownMenuItem>
                    <Link href={`/?type=movie`}>Movies</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/?type=anime`}>Anime</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link href={`/?type=tv`}>Series</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Genres</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {data.genres.length === 0 ? (
                    <DropdownMenuItem disabled>
                        No genres available
                    </DropdownMenuItem>
                ) : (
                data.genres.map((genre) => (
                    <DropdownMenuItem key={genre.id}>
                        <Link href={`/genre/${genre.id}?genre=${genre.name}`}>{genre.name}</Link>
                    </DropdownMenuItem>
                ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default GenreDropdown;
