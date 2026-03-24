import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { DashboardShell } from "@/components/layout/DashboardShell";

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
    <DashboardShell role={member.role} memberName={member.name}>
      {children}
    </DashboardShell>
  );
}
