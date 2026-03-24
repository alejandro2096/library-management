"use client";

import { UserButton } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";

const roleLabels: Record<Role, string> = {
  ADMIN: "Admin",
  LIBRARIAN: "Librarian",
  MEMBER: "Member",
};

const roleVariants: Record<Role, "default" | "secondary" | "success"> = {
  ADMIN: "default",
  LIBRARIAN: "success",
  MEMBER: "secondary",
};

type HeaderProps = {
  role: Role;
  memberName: string;
};

export function Header({ role, memberName }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">
          Welcome, <span className="font-medium text-gray-900">{memberName}</span>
        </p>
        <Badge variant={roleVariants[role]}>{roleLabels[role]}</Badge>
      </div>
      <UserButton />
    </header>
  );
}
