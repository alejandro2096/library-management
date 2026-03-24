"use client";

import { UserButton } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Menu } from "lucide-react";

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
  onMenuClick: () => void;
};

export function Header({ role, memberName, onMenuClick }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-500 hover:text-gray-700"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="text-sm text-gray-600">
          Welcome,{" "}
          <span className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-none inline-block align-bottom">
            {memberName}
          </span>
        </p>
        <Badge variant={roleVariants[role]}>{roleLabels[role]}</Badge>
      </div>
      <UserButton />
    </header>
  );
}
