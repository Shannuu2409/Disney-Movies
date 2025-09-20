import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getAuth } from "firebase-admin/auth";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

async function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    
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
    const userId = await verifyToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentId, contentType, title, posterPath, releaseDate, voteAverage } = await request.json();

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
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyToken(request);
    
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
