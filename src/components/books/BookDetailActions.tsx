"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckoutModal } from "@/components/loans/CheckoutModal";
import { useDeleteBook } from "@/hooks/useBooks";
import { Book, Role } from "@prisma/client";
import { Loader2, BookMarked, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

type BookDetailActionsProps = {
  book: Book;
  memberId: string;
  role: Role;
  available: number;
  isStaff: boolean;
};

export function BookDetailActions({
  book,
  memberId,
  role,
  available,
  isStaff,
}: BookDetailActionsProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const router = useRouter();
  const deleteBook = useDeleteBook();

  const handleDelete = () => {
    if (!confirm("Delete this book? This action cannot be undone.")) return;
    deleteBook.mutate(book.id, {
      onSuccess: () => router.push("/books"),
      onError: (err) => alert(err.message),
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => setCheckoutOpen(true)}
        disabled={available === 0}
      >
        <BookMarked className="h-4 w-4" />
        {available > 0 ? "Request loan" : "No copies available"}
      </Button>

      {isStaff && (
        <>
          <Link href={`/books/${book.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteBook.isPending}
          >
            {deleteBook.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            Delete
          </Button>
        </>
      )}

      <CheckoutModal
        book={book}
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => router.refresh()}
        canCheckoutForOthers={isStaff}
      />
    </div>
  );
}
