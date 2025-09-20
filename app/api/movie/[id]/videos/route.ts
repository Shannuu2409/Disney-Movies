import { NextRequest, NextResponse } from "next/server";
import { getMovieVideos } from "@/lib/getMovies";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const videos = await getMovieVideos(id);
    return NextResponse.json(videos);
  } catch (error) {
    console.error("Error fetching movie videos:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
