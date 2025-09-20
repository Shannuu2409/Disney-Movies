import { NextRequest, NextResponse } from "next/server";
import { getMovieDetails } from "@/lib/getMovies";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const details = await getMovieDetails(id);
    return NextResponse.json(details);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}