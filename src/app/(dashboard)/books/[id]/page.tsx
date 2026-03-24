import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { getBookById } from "@/lib/db/books";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Calendar, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils/format";
import { BookDetailActions } from "@/components/books/BookDetailActions";

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [member, { id }] = await Promise.all([
    getMemberByClerkId(userId),
    params,
  ]);
  if (!member) redirect("/api/sync-member");

  const book = await getBookById(id);
  if (!book) notFound();

  const activeLoans = book.loans.filter((l) => l.status === "ACTIVE").length;
  const available = book.totalCopies - activeLoans;
  const isStaff = member.role === "ADMIN" || member.role === "LIBRARIAN";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/books" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Book details</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Cover */}
        <div className="md:col-span-1">
          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <BookOpen className="h-24 w-24 text-blue-300" />
            )}
          </div>

          {/* Availability */}
          <Card className="mt-4">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-gray-900">{available}</p>
              <p className="text-sm text-gray-500">
                of {book.totalCopies} copies available
              </p>
              <Badge
                variant={available > 0 ? "success" : "destructive"}
                className="mt-2"
              >
                {available > 0 ? "Available" : "Out of stock"}
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="md:col-span-2 space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
              </div>
              {book.aiEnriched && (
                <Badge variant="default" className="shrink-0">✨ AI</Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {book.genre.map((g) => (
                <Badge key={g} variant="secondary">{g}</Badge>
              ))}
            </div>
          </div>

          {book.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{book.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 text-sm">
            {book.publishedYear && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <Calendar className="h-4 w-4 text-gray-400" />
                {book.publishedYear}
              </div>
            )}
            {book.readingLevel && (
              <div className="flex items-center gap-1.5 text-gray-600">
                <span className="text-gray-400">📚</span>
                Level: {book.readingLevel}
              </div>
            )}
            {book.isbn && (
              <div className="text-gray-500">ISBN: {book.isbn}</div>
            )}
            {book.language && (
              <div className="text-gray-500">Language: {book.language.toUpperCase()}</div>
            )}
          </div>

          {book.themes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Themes</h3>
              <div className="flex flex-wrap gap-1">
                {book.themes.map((t) => (
                  <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <BookDetailActions
            book={book}
            memberId={member.id}
            role={member.role}
            available={available}
            isStaff={isStaff}
          />
        </div>
      </div>

      {/* Loan history (staff only) */}
      {isStaff && book.loans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Loan history</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="pb-2 font-medium text-gray-500">Member</th>
                  <th className="pb-2 font-medium text-gray-500">Checked out</th>
                  <th className="pb-2 font-medium text-gray-500">Due date</th>
                  <th className="pb-2 font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {book.loans.slice(0, 10).map((loan) => (
                  <tr key={loan.id} className="border-b border-gray-50">
                    <td className="py-2 text-gray-700">{loan.member.name}</td>
                    <td className="py-2 text-gray-500">{formatDate(loan.checkedOut)}</td>
                    <td className="py-2 text-gray-500">{formatDate(loan.dueDate)}</td>
                    <td className="py-2">
                      <Badge
                        variant={
                          loan.status === "ACTIVE"
                            ? "success"
                            : loan.status === "OVERDUE"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {loan.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
