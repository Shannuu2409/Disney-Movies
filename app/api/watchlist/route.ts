import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDatabase();
    const watchlist = await db.collection('watchlist')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(watchlist);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { contentId, contentType, title, posterPath, releaseDate, voteAverage } = body ?? {};

    if (
      typeof contentId !== 'number' ||
      !contentType ||
      typeof title !== 'string'
    ) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const db = await getDatabase();
    const watchlistItem = {
      userId,
      contentId,
      contentType,
      title,
      posterPath,
      releaseDate,
      voteAverage,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if item already exists
    const existingItem = await db.collection('watchlist').findOne({
      userId,
      contentId,
      contentType,
    });

    if (existingItem) {
      return NextResponse.json({ error: "Item already in watchlist" }, { status: 400 });
    }

    const result = await db.collection('watchlist').insertOne(watchlistItem);
    const responseItem = { ...watchlistItem, _id: result.insertedId } as const;

    return NextResponse.json(responseItem);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get("contentId");
    const contentType = searchParams.get("contentType");

    if (!contentId || !contentType) {
      return NextResponse.json({ error: "Missing contentId or contentType" }, { status: 400 });
    }

    const db = await getDatabase();
    await db.collection('watchlist').deleteOne({
      userId,
      contentId: parseInt(contentId),
      contentType,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
