import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateAI } from "@/lib/ai/client";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";
import { getBooks } from "@/lib/db/books";
import { z } from "zod";

const SearchSchema = z.object({
  query: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { query } = SearchSchema.parse(body);

    const text = await generateAI(query, SYSTEM_PROMPTS.naturalSearch);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in response");

    const filters = JSON.parse(jsonMatch[0]);

    const { books } = await getBooks({
      search: filters.textSearch || undefined,
      genre: filters.genres?.[0] || undefined,
      limit: 20,
    });

    return NextResponse.json({ books, filters });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[AI SEARCH]", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
