import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLoanById, returnBook } from "@/lib/db/loans";
import { getMemberByClerkId } from "@/lib/db/members";

export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentMember = await getMemberByClerkId(userId);
    if (!currentMember) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    const { id } = await params;
    const loan = await getLoanById(id);
    if (!loan) return NextResponse.json({ error: "Loan not found" }, { status: 404 });

    // Members can only return their own loans
    if (currentMember.role === "MEMBER" && loan.memberId !== currentMember.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedLoan = await returnBook(id);
    return NextResponse.json(updatedLoan);
  } catch (error) {
    console.error("[LOAN PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
