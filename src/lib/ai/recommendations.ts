import { generateAI } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";
import { Book } from "@prisma/client";
import { Mood } from "@/types";

const MOOD_DESCRIPTIONS: Record<Mood, string> = {
  adventurous: "Me siento aventurero/a y quiero vivir una experiencia emocionante",
  romantic: "Me siento romántico/a y quiero una historia de amor",
  thoughtful: "Estoy reflexivo/a y quiero algo que me haga pensar",
  excited: "Estoy emocionado/a y con mucha energía",
  calm: "Me siento tranquilo/a y quiero una lectura relajante",
  curious: "Tengo mucha curiosidad y quiero aprender algo nuevo",
  melancholic: "Me siento melancólico/a y quiero algo emotivo",
  inspired: "Me siento inspirado/a y quiero algo que alimente mi creatividad",
};

export type Recommendation = {
  bookId: string;
  title: string;
  author: string;
  reason: string;
};

export type RecommendationResult = {
  recommendations: Recommendation[];
  message: string;
};

export async function getMoodRecommendations(
  mood: Mood,
  availableBooks: Book[]
): Promise<RecommendationResult> {
  const catalogSummary = availableBooks
    .slice(0, 30)
    .map(
      (b) =>
        `ID: ${b.id} | "${b.title}" por ${b.author} | Géneros: ${b.genre.join(", ")} | Temas: ${b.themes.join(", ")}`
    )
    .join("\n");

  const text = await generateAI(
    `Estado emocional del usuario: ${MOOD_DESCRIPTIONS[mood]}\n\nCatálogo disponible:\n${catalogSummary}\n\nRecomienda los 3 libros más adecuados del catálogo para este momento emocional.`,
    SYSTEM_PROMPTS.recommendations,
    2048
  );

  // Strip markdown code fences if present
  const stripped = text.replace(/```(?:json)?\s*/g, "").replace(/```\s*/g, "").trim();
  const jsonMatch = stripped.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error("[RECOMMENDATIONS] No JSON in response:", text.slice(0, 200));
    throw new Error("No JSON found in response");
  }

  return JSON.parse(jsonMatch[0]) as RecommendationResult;
}
