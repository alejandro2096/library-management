import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId, getMembers } from "@/lib/db/members";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import { MemberRoleSelector } from "@/components/members/MemberRoleSelector";

export default async function MembersPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkId(userId);
  if (!member || member.role !== "ADMIN") redirect("/");

  const { members, total } = await getMembers({ limit: 50 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Members</h1>
        <p className="text-gray-500 mt-1">{total} registered members</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-4 w-4" />
            Member management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-medium text-gray-500 uppercase">
                <th className="pb-3">Name</th>
                <th className="hidden sm:table-cell pb-3">Email</th>
                <th className="pb-3">Active loans</th>
                <th className="pb-3">Role</th>
                <th className="hidden sm:table-cell pb-3">Member since</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => {
                const activeLoans = m.loans?.filter(
                  (l) => l.status === "ACTIVE" || l.status === "OVERDUE"
                ).length ?? 0;

                return (
                  <tr key={m.id} className="border-b border-gray-50">
                    <td className="py-3 font-medium text-gray-900">{m.name}</td>
                    <td className="hidden sm:table-cell py-3 text-gray-500">{m.email}</td>
                    <td className="py-3">
                      {activeLoans > 0 ? (
                        <Badge variant={activeLoans > 3 ? "warning" : "secondary"}>
                          {activeLoans}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                    <td className="py-3">
                      <MemberRoleSelector
                        memberId={m.id}
                        currentRole={m.role}
                        disabled={m.id === member.id}
                      />
                    </td>
                    <td className="hidden sm:table-cell py-3 text-gray-500 text-xs">
                      {new Date(m.createdAt).toLocaleDateString("en")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
          </CardContent>
      </Card>
    </div>
  );
}
