import { prisma } from "./client";
import { LoanStatus, Prisma } from "@prisma/client";
import { addDays } from "date-fns";

export async function getLoans(params?: {
  memberId?: string;
  status?: LoanStatus;
  page?: number;
  limit?: number;
}) {
  const { memberId, status, page = 1, limit = 20 } = params ?? {};
  const skip = (page - 1) * limit;

  const where: Prisma.LoanWhereInput = {};
  if (memberId) where.memberId = memberId;
  if (status) where.status = status;

  const [loans, total] = await Promise.all([
    prisma.loan.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        book: true,
        member: true,
      },
    }),
    prisma.loan.count({ where }),
  ]);

  return { loans, total, pages: Math.ceil(total / limit) };
}

export async function getLoanById(id: string) {
  return prisma.loan.findUnique({
    where: { id },
    include: { book: true, member: true },
  });
}

export async function checkoutBook(data: {
  bookId: string;
  memberId: string;
  daysToReturn?: number;
  notes?: string;
}) {
  const { bookId, memberId, daysToReturn = 14, notes } = data;

  // Check availability
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { loans: { where: { status: "ACTIVE" } } },
  });

  if (!book) throw new Error("Book not found");
  if (book.loans.length >= book.totalCopies) {
    throw new Error("No copies available for checkout");
  }

  const dueDate = addDays(new Date(), daysToReturn);

  return prisma.loan.create({
    data: {
      bookId,
      memberId,
      dueDate,
      notes,
      status: "ACTIVE",
    },
    include: { book: true, member: true },
  });
}

export async function returnBook(loanId: string) {
  return prisma.loan.update({
    where: { id: loanId },
    data: {
      returnedAt: new Date(),
      status: "RETURNED",
    },
    include: { book: true, member: true },
  });
}

export async function updateOverdueLoans() {
  const now = new Date();
  return prisma.loan.updateMany({
    where: {
      status: "ACTIVE",
      dueDate: { lt: now },
    },
    data: { status: "OVERDUE" },
  });
}

export async function getMemberActiveLoans(memberId: string) {
  return prisma.loan.findMany({
    where: { memberId, status: { in: ["ACTIVE", "OVERDUE"] } },
    include: { book: true },
    orderBy: { dueDate: "asc" },
  });
}
