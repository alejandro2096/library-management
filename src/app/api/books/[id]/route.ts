import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getBookById, updateBook, deleteBook } from "@/lib/db/books";
import { getMemberByClerkId } from "@/lib/db/members";
import { z } from "zod";

const UpdateBookSchema = z.object({
  title: z.string().min(1).optional(),
  author: z.string().min(1).optional(),
  isbn: z.string().optional(),
  genre: z.array(z.string()).optional(),
  description: z.string().optional(),
  publishedYear: z.number().optional(),
  coverUrl: z.string().optional(),
  totalCopies: z.number().min(1).optional(),
  themes: z.array(z.string()).optional(),
  readingLevel: z.string().optional(),
  language: z.string().optional(),
  aiEnriched: z.boolean().optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const book = await getBookById(id);
    if (!book) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(book);
  } catch (error) {
    console.error("[BOOK GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMemberByClerkId(userId);
    if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = UpdateBookSchema.parse(body);
    const book = await updateBook(id, data);
    return NextResponse.json(book);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[BOOK PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMemberByClerkId(userId);
    if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    await deleteBook(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BOOK DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
