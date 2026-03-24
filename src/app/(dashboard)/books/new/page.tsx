import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { BookForm } from "@/components/books/BookForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewBookPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkId(userId);
  if (!member || !["ADMIN", "LIBRARIAN"].includes(member.role)) {
    redirect("/books");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/books" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add book</h1>
          <p className="text-gray-500 mt-0.5">
            Fill in the form or use ✨ to automatically enrich with AI
          </p>
        </div>
      </div>

      <BookForm />
    </div>
  );
}
