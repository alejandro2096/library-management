import { prisma } from "./client";
import { Prisma } from "@prisma/client";

export async function getBooks(params?: {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}) {
  const { search, genre, page = 1, limit = 20 } = params ?? {};
  const skip = (page - 1) * limit;

  const where: Prisma.BookWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { author: { contains: search, mode: "insensitive" } },
      { isbn: { contains: search, mode: "insensitive" } },
    ];
  }

  if (genre) {
    where.genre = { has: genre };
  }

  const [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        loans: {
          where: { status: "ACTIVE" },
          select: { id: true },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  return { books, total, pages: Math.ceil(total / limit) };
}

export async function getBookById(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      loans: {
        include: { member: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function createBook(data: Prisma.BookCreateInput) {
  return prisma.book.create({ data });
}

export async function updateBook(id: string, data: Prisma.BookUpdateInput) {
  return prisma.book.update({ where: { id }, data });
}

export async function deleteBook(id: string) {
  return prisma.book.delete({ where: { id } });
}

export async function getBookAvailability(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      loans: { where: { status: "ACTIVE" } },
    },
  });

  if (!book) return null;

  return {
    book,
    totalCopies: book.totalCopies,
    activeLoans: book.loans.length,
    available: book.totalCopies - book.loans.length,
  };
}

export async function getAllGenres(): Promise<string[]> {
  const books = await prisma.book.findMany({
    select: { genre: true },
  });
  const genres = new Set<string>();
  books.forEach((b) => b.genre.forEach((g) => genres.add(g)));
  return Array.from(genres).sort();
}
