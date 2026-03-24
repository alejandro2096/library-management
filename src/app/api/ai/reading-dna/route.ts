import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMemberByClerkId, getMemberById } from "@/lib/db/members";
import { generateReadingDNA } from "@/lib/ai/reading-dna";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentMember = await getMemberByClerkId(userId);
    if (!currentMember) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const targetMemberId = searchParams.get("memberId");

    let member = currentMember;
    if (targetMemberId && targetMemberId !== currentMember.id) {
      if (!["ADMIN", "LIBRARIAN"].includes(currentMember.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      const found = await getMemberById(targetMemberId);
      if (!found) return NextResponse.json({ error: "Member not found" }, { status: 404 });
      member = found;
    }

    const dna = await generateReadingDNA(member.loans, member.name);
    return NextResponse.json(dna);
  } catch (error) {
    console.error("[AI READING DNA]", error);
    return NextResponse.json({ error: "DNA generation failed" }, { status: 500 });
  }
}
