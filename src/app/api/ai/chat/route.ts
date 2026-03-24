import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { auth } from "@clerk/nextjs/server";
import { getBooks } from "@/lib/db/books";
import { SYSTEM_PROMPTS } from "@/lib/ai/prompts";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { messages } = await req.json();

  const { books } = await getBooks({ limit: 50 });
  const catalogContext = books
    .map((b) => {
      const activeLoans = (b as typeof b & { loans: { id: string }[] }).loans?.length ?? 0;
      const available = b.totalCopies - activeLoans;
      return `- "${b.title}" por ${b.author} | Géneros: ${b.genre.join(", ")} | Disponibles: ${available}/${b.totalCopies}`;
    })
    .join("\n");

  const systemWithCatalog = `${SYSTEM_PROMPTS.librarian}\n\nCATÁLOGO ACTUAL:\n${catalogContext}`;

  const result = await streamText({
    model: google("gemini-1.5-flash"),
    system: systemWithCatalog,
    messages,
    maxTokens: 1024,
  });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => String(error),
  });
}
