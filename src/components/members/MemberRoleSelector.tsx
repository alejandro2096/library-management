"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Role } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  LIBRARIAN: "Librarian",
  MEMBER: "Member",
};

type MemberRoleSelectorProps = {
  memberId: string;
  currentRole: Role;
  disabled?: boolean;
};

export function MemberRoleSelector({
  memberId,
  currentRole,
  disabled,
}: MemberRoleSelectorProps) {
  const [role, setRole] = useState<Role>(currentRole);
  const qc = useQueryClient();

  const updateRole = useMutation({
    mutationFn: async (newRole: Role) => {
      const res = await fetch("/api/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["members"] }),
  });

  const handleChange = (value: string) => {
    const newRole = value as Role;
    setRole(newRole);
    updateRole.mutate(newRole, {
      onError: () => {
        setRole(currentRole);
        alert("Error updating role");
      },
    });
  };

  return (
    <Select value={role} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger className="h-7 w-36 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(["ADMIN", "LIBRARIAN", "MEMBER"] as Role[]).map((r) => (
          <SelectItem key={r} value={r} className="text-xs">
            {roleLabels[r]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
