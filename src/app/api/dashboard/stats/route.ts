import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/client";
import { getMemberByClerkId } from "@/lib/db/members";

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMemberByClerkId(userId);
    if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    const [totalBooks, totalMembers, activeLoans, overdueLoans, recentLoans] =
      await Promise.all([
        prisma.book.count(),
        prisma.member.count(),
        prisma.loan.count({ where: { status: "ACTIVE" } }),
        prisma.loan.count({ where: { status: "OVERDUE" } }),
        prisma.loan.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { book: true, member: true },
        }),
      ]);

    const totalCopies = await prisma.book.aggregate({ _sum: { totalCopies: true } });
    const availableBooks = (totalCopies._sum.totalCopies ?? 0) - activeLoans;

    return NextResponse.json({
      totalBooks,
      totalMembers,
      activeLoans,
      overdueLoans,
      availableBooks,
      recentLoans,
    });
  } catch (error) {
    console.error("[DASHBOARD STATS]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
