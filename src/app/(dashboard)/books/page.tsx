"use client";

import { useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/books/BookCard";
import { BookSearch } from "@/components/books/BookSearch";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, BookOpen } from "lucide-react";
import Link from "next/link";
import { Book } from "@prisma/client";

export default function BooksPage() {
  const [search, setSearch] = useState("");
  const [aiResults, setAIResults] = useState<Book[] | null>(null);
  const { data, isLoading } = useBooks({ search });

  const displayBooks = aiResults ?? data?.books ?? [];
  const isAISearch = aiResults !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Book catalog</h1>
          <p className="text-gray-500 mt-1">
            {data?.total ?? 0} books total
          </p>
        </div>
        <Link href="/books/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add book
          </Button>
        </Link>
      </div>

      <BookSearch
        onSearch={(q) => {
          setSearch(q);
          setAIResults(null);
        }}
        onAIResults={(books) => setAIResults(books)}
      />

      {isAISearch && (
        <div className="flex items-center gap-2 text-sm text-purple-700 bg-purple-50 rounded-lg px-3 py-2">
          ✨ AI search results ({aiResults?.length ?? 0} matches)
          <button
            onClick={() => setAIResults(null)}
            className="ml-auto text-xs underline"
          >
            Clear
          </button>
        </div>
      )}

      {isLoading && !isAISearch ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : displayBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500">No books found</p>
          <p className="text-sm text-gray-400 mt-1">Try different search terms</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {displayBooks.map((book: Book & { loans?: { id: string }[] }) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
