import { generateAI } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";
import { Loan, Book } from "@prisma/client";
import { ReadingDNA } from "@/types";

export async function generateReadingDNA(
  loans: (Loan & { book: Book })[],
  memberName: string
): Promise<ReadingDNA> {
  if (loans.length === 0) {
    return {
      favoriteGenres: [],
      favoriteAuthors: [],
      readingPace: "Not enough history yet",
      seasonalPattern: "Not enough history yet",
      nextRead: null,
      narrative: `${memberName} is beginning their reading journey. Every great reader started with their first book!`,
      totalBooksRead: 0,
    };
  }

  const historySummary = loans
    .map(
      (l) =>
        `"${l.book.title}" por ${l.book.author} (${new Date(l.checkedOut).getFullYear()}) - Géneros: ${l.book.genre.join(", ")}`
    )
    .join("\n");

  const text = await generateAI(
    `Analiza el historial de lecturas de ${memberName}:\n\n${historySummary}\n\nGenera su perfil de lector único.`,
    SYSTEM_PROMPTS.readingDNA
  );

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]) as ReadingDNA;
}
