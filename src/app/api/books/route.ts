import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getBooks, createBook } from "@/lib/db/books";
import { getMemberByClerkId } from "@/lib/db/members";
import { z } from "zod";

const CreateBookSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
  isbn: z.string().optional(),
  genre: z.array(z.string()).default([]),
  description: z.string().optional(),
  publishedYear: z.number().optional(),
  coverUrl: z.string().url().optional(),
  totalCopies: z.number().min(1).default(1),
  themes: z.array(z.string()).default([]),
  readingLevel: z.string().optional(),
  language: z.string().default("es"),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? undefined;
    const genre = searchParams.get("genre") ?? undefined;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const result = await getBooks({ search, genre, page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[BOOKS GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMemberByClerkId(userId);
    if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = CreateBookSchema.parse(body);
    const book = await createBook(data);
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[BOOKS POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
