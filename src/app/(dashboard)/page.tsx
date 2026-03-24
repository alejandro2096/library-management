import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { prisma } from "@/lib/db/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, BookMarked, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format";

async function getDashboardData(memberId: string, role: string) {
  const [totalBooks, totalMembers, activeLoans, overdueLoans] = await Promise.all([
    prisma.book.count(),
    prisma.member.count(),
    prisma.loan.count({ where: { status: "ACTIVE" } }),
    prisma.loan.count({ where: { status: "OVERDUE" } }),
  ]);

  const recentLoansWhere =
    role === "MEMBER" ? { memberId } : {};

  const recentLoans = await prisma.loan.findMany({
    where: recentLoansWhere,
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { book: true, member: true },
  });

  const totalCopies = await prisma.book.aggregate({ _sum: { totalCopies: true } });

  return {
    totalBooks,
    totalMembers,
    activeLoans,
    overdueLoans,
    availableBooks: (totalCopies._sum.totalCopies ?? 0) - activeLoans,
    recentLoans,
  };
}

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkId(userId);
  if (!member) redirect("/api/sync-member");

  const stats = await getDashboardData(member.id, member.role);

  const isStaff = member.role === "ADMIN" || member.role === "LIBRARIAN";

  const statCards = [
    {
      title: "Total books",
      value: stats.totalBooks,
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/books",
    },
    {
      title: "Available books",
      value: stats.availableBooks,
      icon: BookOpen,
      color: "text-green-600",
      bg: "bg-green-50",
      href: "/books",
    },
    {
      title: "Active loans",
      value: stats.activeLoans,
      icon: BookMarked,
      color: "text-amber-600",
      bg: "bg-amber-50",
      href: "/loans",
    },
    ...(isStaff
      ? [
          {
            title: "Overdue loans",
            value: stats.overdueLoans,
            icon: AlertTriangle,
            color: "text-red-600",
            bg: "bg-red-50",
            href: "/loans?status=OVERDUE",
          },
          {
            title: "Members",
            value: stats.totalMembers,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
            href: "/members",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Library system summary</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`inline-flex rounded-lg p-2 ${card.bg} mb-3`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{card.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent loans */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {isStaff ? "Recent loans" : "My recent loans"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentLoans.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No recent loans
            </p>
          ) : (
            <div className="space-y-3">
              {stats.recentLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-gray-400" />
                    <div>
                      <Link
                        href={`/books/${loan.book.id}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600"
                      >
                        {loan.book.title}
                      </Link>
                      {isStaff && (
                        <p className="text-xs text-gray-500">{loan.member.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{formatDate(loan.checkedOut)}</span>
                    <Badge
                      variant={
                        loan.status === "ACTIVE"
                          ? "success"
                          : loan.status === "OVERDUE"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {loan.status === "ACTIVE"
                        ? "Active"
                        : loan.status === "RETURNED"
                        ? "Returned"
                        : "Overdue"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/books"
          className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <BookOpen className="h-4 w-4" />
          Explore catalog
        </Link>
        <Link
          href="/ai"
          className="flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-100 transition-colors"
        >
          ✨ AI Librarian
        </Link>
      </div>
    </div>
  );
}
