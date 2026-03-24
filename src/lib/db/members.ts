import { prisma } from "./client";
import { Role } from "@prisma/client";

export async function getMembers(params?: { page?: number; limit?: number }) {
  const { page = 1, limit = 20 } = params ?? {};
  const skip = (page - 1) * limit;

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        loans: {
          where: { status: { in: ["ACTIVE", "OVERDUE"] } },
          select: { id: true, status: true },
        },
      },
    }),
    prisma.member.count(),
  ]);

  return { members, total, pages: Math.ceil(total / limit) };
}

export async function getMemberByClerkId(clerkId: string) {
  return prisma.member.findUnique({
    where: { clerkId },
    include: {
      loans: {
        include: { book: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getMemberById(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: {
      loans: {
        include: { book: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function upsertMember(data: {
  clerkId: string;
  email: string;
  name: string;
}) {
  return prisma.member.upsert({
    where: { clerkId: data.clerkId },
    create: {
      clerkId: data.clerkId,
      email: data.email,
      name: data.name,
      role: "MEMBER",
    },
    update: {
      email: data.email,
      name: data.name,
    },
  });
}

export async function updateMemberRole(memberId: string, role: Role) {
  return prisma.member.update({
    where: { id: memberId },
    data: { role },
  });
}

export async function deleteMember(memberId: string) {
  return prisma.member.delete({ where: { id: memberId } });
}
