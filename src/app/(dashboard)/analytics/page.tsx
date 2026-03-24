import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { prisma } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InsightCard } from "@/components/ai/InsightCard";
import { subDays } from "date-fns";

async function getAnalyticsData() {
  const weekAgo = subDays(new Date(), 7);
  const monthAgo = subDays(new Date(), 30);

  const [
    weeklyLoans,
    monthlyLoans,
    overdueCount,
    topBooksRaw,
    genreStats,
  ] = await Promise.all([
    prisma.loan.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.loan.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.loan.count({ where: { status: "OVERDUE" } }),
    prisma.loan.groupBy({
      by: ["bookId"],
      _count: { bookId: true },
      orderBy: { _count: { bookId: "desc" } },
      take: 5,
    }),
    prisma.loan.findMany({
      where: { createdAt: { gte: monthAgo } },
      include: { book: { select: { genre: true } } },
    }),
  ]);

  const topBooks = await Promise.all(
    topBooksRaw.map(async (item) => {
      const book = await prisma.book.findUnique({ where: { id: item.bookId } });
      return { title: book?.title ?? "", author: book?.author ?? "", loans: item._count.bookId };
    })
  );

  const genreCount: Record<string, number> = {};
  genreStats.forEach((l) => {
    l.book.genre.forEach((g) => {
      genreCount[g] = (genreCount[g] ?? 0) + 1;
    });
  });
  const topGenres = Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return { weeklyLoans, monthlyLoans, overdueCount, topBooks, topGenres };
}

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkId(userId);
  if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) redirect("/");

  const data = await getAnalyticsData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Library statistics and analysis</p>
      </div>

      {/* AI Insights */}
      <InsightCard />

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{data.weeklyLoans}</p>
            <p className="text-sm text-gray-500 mt-1">Loans this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{data.monthlyLoans}</p>
            <p className="text-sm text-gray-500 mt-1">Loans this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-red-600">{data.overdueCount}</p>
            <p className="text-sm text-gray-500 mt-1">Overdue loans</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Top books */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most borrowed books</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topBooks.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.topBooks.map((book, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{book.title}</p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {book.loans} loans
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top genres */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most popular genres</CardTitle>
          </CardHeader>
          <CardContent>
            {data.topGenres.length === 0 ? (
              <p className="text-sm text-gray-400">No data yet</p>
            ) : (
              <div className="space-y-3">
                {data.topGenres.map(([genre, count]) => {
                  const maxCount = data.topGenres[0]?.[1] ?? 1;
                  const pct = Math.round((count / maxCount) * 100);
                  return (
                    <div key={genre}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{genre}</span>
                        <span className="text-xs text-gray-500">{count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
