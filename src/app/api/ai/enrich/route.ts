import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMemberByClerkId } from "@/lib/db/members";
import { enrichBook } from "@/lib/ai/enrichment";
import { z } from "zod";

const EnrichSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMemberByClerkId(userId);
    if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, author } = EnrichSchema.parse(body);

    const result = await enrichBook(title, author);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("[AI ENRICH]", error);
    return NextResponse.json({ error: "Enrichment failed" }, { status: 500 });
  }
}
