import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkId(userId);
  if (!member) {
    // Member not synced yet via webhook - create them
    redirect("/api/sync-member");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={member.role} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header role={member.role} memberName={member.name} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
