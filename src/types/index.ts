import { Book, Loan, Member, LoanStatus, Role } from "@prisma/client";

export type { Book, Loan, Member, LoanStatus, Role };

export type BookWithLoans = Book & {
  loans: (Loan & { member: Member })[];
};

export type LoanWithDetails = Loan & {
  book: Book;
  member: Member;
};

export type MemberWithLoans = Member & {
  loans: (Loan & { book: Book })[];
};

export type BookAvailability = {
  book: Book;
  totalCopies: number;
  activeLoans: number;
  available: number;
};

export type Mood =
  | "adventurous"
  | "romantic"
  | "thoughtful"
  | "excited"
  | "calm"
  | "curious"
  | "melancholic"
  | "inspired";

export type MoodOption = {
  id: Mood;
  label: string;
  emoji: string;
  description: string;
};

export type ReadingDNA = {
  favoriteGenres: string[];
  favoriteAuthors: string[];
  readingPace: string;
  seasonalPattern: string;
  nextRead: {
    title: string;
    author: string;
    reason: string;
  } | null;
  narrative: string;
  totalBooksRead: number;
};

export type AIInsight = {
  narrative: string;
  alerts: string[];
  trends: string[];
  weeklyStats: {
    totalLoans: number;
    returns: number;
    newBooks: number;
    activeMembers: number;
  };
};

export type DashboardStats = {
  totalBooks: number;
  totalMembers: number;
  activeLoans: number;
  overdueLoans: number;
  availableBooks: number;
  recentLoans: LoanWithDetails[];
};
