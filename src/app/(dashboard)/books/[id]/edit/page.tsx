import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { getBookById } from "@/lib/db/books";
import { BookForm } from "@/components/books/BookForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function EditBookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [member, { id }] = await Promise.all([getMemberByClerkId(userId), params]);
  if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) redirect("/books");

  const book = await getBookById(id);
  if (!book) notFound();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href={`/books/${id}`} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit book</h1>
          <p className="text-gray-500 mt-0.5">{book.title}</p>
        </div>
      </div>

      <BookForm book={book} />
    </div>
  );
}
