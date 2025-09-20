import { NextRequest, NextResponse } from "next/server";
import { getMovieCredits } from "@/lib/getMovies";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const credits = await getMovieCredits(id);
    return NextResponse.json(credits);
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
