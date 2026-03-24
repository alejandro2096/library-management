import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { BooksContent } from "./BooksContent";

export default async function BooksPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkId(userId);
  if (!member) redirect("/api/sync-member");

  const canAdd = member.role === "ADMIN" || member.role === "LIBRARIAN";

  return <BooksContent canAdd={canAdd} />;
}
