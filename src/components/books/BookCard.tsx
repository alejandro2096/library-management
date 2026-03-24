"use client";

import Link from "next/link";
import { Book } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar } from "lucide-react";

type BookCardProps = {
  book: Book & { loans?: { id: string }[] };
};

export function BookCard({ book }: BookCardProps) {
  const activeLoans = book.loans?.length ?? 0;
  const available = book.totalCopies - activeLoans;

  return (
    <Link href={`/books/${book.id}`} prefetch={false}>
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
        {/* Cover */}
        <div className="relative h-48 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-xl overflow-hidden">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen className="h-16 w-16 text-blue-300" />
            </div>
          )}
          {/* Availability badge */}
          <div className="absolute top-2 right-2">
            <Badge variant={available > 0 ? "success" : "destructive"}>
              {available > 0 ? `${available} available` : "Not available"}
            </Badge>
          </div>
          {book.aiEnriched && (
            <div className="absolute top-2 left-2">
              <Badge variant="default">✨ AI</Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{book.author}</p>

          <div className="mt-2 flex flex-wrap gap-1">
            {book.genre.slice(0, 2).map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">
                {g}
              </Badge>
            ))}
          </div>

          {book.publishedYear && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="h-3 w-3" />
              {book.publishedYear}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
