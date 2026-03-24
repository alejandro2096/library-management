import { generateAI } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";

export type EnrichmentResult = {
  description: string;
  genre: string[];
  themes: string[];
  readingLevel: string;
  tags: string[];
  publishedYear?: number;
};

export async function enrichBook(
  title: string,
  author: string
): Promise<EnrichmentResult> {
  const text = await generateAI(
    `Enriquece la información del libro:\nTítulo: "${title}"\nAutor: "${author}"\n\nProporciona descripción, géneros, temas, nivel de lectura, tags creativos y año de publicación.`,
    SYSTEM_PROMPTS.enrichment
  );

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  return JSON.parse(jsonMatch[0]) as EnrichmentResult;
}
