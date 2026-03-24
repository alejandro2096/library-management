import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getLoans, checkoutBook } from "@/lib/db/loans";
import { getMemberByClerkId } from "@/lib/db/members";
import { z } from "zod";

const CheckoutSchema = z.object({
  bookId: z.string().min(1),
  memberId: z.string().min(1).optional(),
  daysToReturn: z.number().min(1).max(60).default(14),
  notes: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMemberByClerkId(userId);
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") as "ACTIVE" | "RETURNED" | "OVERDUE" | null;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    // Members can only see their own loans
    const memberId = member.role === "MEMBER" ? member.id : (searchParams.get("memberId") ?? undefined);

    const result = await getLoans({ memberId, status: status ?? undefined, page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error("[LOANS GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const currentMember = await getMemberByClerkId(userId);
    if (!currentMember) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    const body = await req.json();
    const data = CheckoutSchema.parse(body);

    // Determine the member to checkout for
    let targetMemberId = currentMember.id;
    if (data.memberId && data.memberId !== currentMember.id) {
      // Only ADMIN/LIBRARIAN can checkout for others
      if (!["ADMIN", "LIBRARIAN"].includes(currentMember.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      targetMemberId = data.memberId;
    }

    const loan = await checkoutBook({
      bookId: data.bookId,
      memberId: targetMemberId,
      daysToReturn: data.daysToReturn,
      notes: data.notes,
    });

    return NextResponse.json(loan, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[LOANS POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
