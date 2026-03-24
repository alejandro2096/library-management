import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db/client";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getCurrentMember() {
  const { userId } = await auth();
  if (!userId) return null;

  return prisma.member.findUnique({
    where: { clerkId: userId },
  });
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}

export async function requireRole(allowedRoles: Role[]) {
  const member = await getCurrentMember();
  if (!member) redirect("/sign-in");
  if (!allowedRoles.includes(member.role)) redirect("/");
  return member;
}

export function canManageBooks(role: Role): boolean {
  return role === "ADMIN" || role === "LIBRARIAN";
}

export function canManageMembers(role: Role): boolean {
  return role === "ADMIN";
}

export function canViewAllLoans(role: Role): boolean {
  return role === "ADMIN" || role === "LIBRARIAN";
}

export function canCheckoutForOthers(role: Role): boolean {
  return role === "ADMIN" || role === "LIBRARIAN";
}

export function canViewAnalytics(role: Role): boolean {
  return role === "ADMIN" || role === "LIBRARIAN";
}
