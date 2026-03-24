import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMemberByClerkId } from "@/lib/db/members";
import { generateInsights } from "@/lib/ai/insights";
import { prisma } from "@/lib/db/client";
import { subDays } from "date-fns";

export async function GET(_req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await getMemberByClerkId(userId);
    if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const weekAgo = subDays(new Date(), 7);

    const [weeklyLoans, weeklyReturns, newBooks, activeMembers, overdueLoans] = await Promise.all([
      prisma.loan.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.loan.count({ where: { returnedAt: { gte: weekAgo } } }),
      prisma.book.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.member.count({ where: { loans: { some: { createdAt: { gte: weekAgo } } } } }),
      prisma.loan.count({ where: { status: "OVERDUE" } }),
    ]);

    // Top books
    const topBooksRaw = await prisma.loan.groupBy({
      by: ["bookId"],
      where: { createdAt: { gte: weekAgo } },
      _count: { bookId: true },
      orderBy: { _count: { bookId: "desc" } },
      take: 5,
    });

    const topBooks = await Promise.all(
      topBooksRaw.map(async (item) => {
        const book = await prisma.book.findUnique({ where: { id: item.bookId } });
        return {
          title: book?.title ?? "Unknown",
          author: book?.author ?? "Unknown",
          loans: item._count.bookId,
        };
      })
    );

    // Top genres - simplified
    const allLoans = await prisma.loan.findMany({
      where: { createdAt: { gte: weekAgo } },
      include: { book: { select: { genre: true } } },
    });

    const genreCount: Record<string, number> = {};
    allLoans.forEach((l) => {
      l.book.genre.forEach((g) => {
        genreCount[g] = (genreCount[g] ?? 0) + 1;
      });
    });

    const topGenres = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([genre, loans]) => ({ genre, loans }));

    const insights = await generateInsights({
      totalLoans: weeklyLoans,
      returns: weeklyReturns,
      newBooks,
      activeMembers,
      overdueLoans,
      topBooks,
      topGenres,
    });

    return NextResponse.json(insights);
  } catch (error) {
    console.error("[AI INSIGHTS]", error);
    return NextResponse.json({ error: "Insights generation failed" }, { status: 500 });
  }
}
