import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getBooks } from "@/lib/db/books";
import { getMoodRecommendations } from "@/lib/ai/recommendations";
import { z } from "zod";
import { Mood } from "@/types";

const MoodSchema = z.object({
  mood: z.enum([
    "adventurous",
    "romantic",
    "thoughtful",
    "excited",
    "calm",
    "curious",
    "melancholic",
    "inspired",
  ]),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { mood } = MoodSchema.parse(body);

    // Get available books
    const { books } = await getBooks({ limit: 50 });

    const result = await getMoodRecommendations(mood as Mood, books.map(b => ({
      ...b,
      loans: undefined as never,
    })));
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[AI RECOMMEND]", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Recommendation failed" }, { status: 500 });
  }
}
