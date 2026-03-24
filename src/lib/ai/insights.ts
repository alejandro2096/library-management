import { generateAI } from "./client";
import { SYSTEM_PROMPTS } from "./prompts";
import { AIInsight } from "@/types";

type InsightData = {
  totalLoans: number;
  returns: number;
  newBooks: number;
  activeMembers: number;
  overdueLoans: number;
  topBooks: { title: string; author: string; loans: number }[];
  topGenres: { genre: string; loans: number }[];
};

export async function generateInsights(data: InsightData): Promise<AIInsight> {
  const text = await generateAI(
    `Estadísticas de la semana:
- Total de préstamos: ${data.totalLoans}
- Devoluciones: ${data.returns}
- Libros nuevos: ${data.newBooks}
- Miembros activos: ${data.activeMembers}
- Préstamos vencidos: ${data.overdueLoans}

Libros más prestados:
${data.topBooks.map((b) => `- "${b.title}" (${b.loans} préstamos)`).join("\n")}

Géneros más populares:
${data.topGenres.map((g) => `- ${g.genre}: ${g.loans} préstamos`).join("\n")}

Genera un reporte narrativo, alertas y tendencias.`,
    SYSTEM_PROMPTS.analytics
  );

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("No JSON found in response");

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    ...parsed,
    weeklyStats: {
      totalLoans: data.totalLoans,
      returns: data.returns,
      newBooks: data.newBooks,
      activeMembers: data.activeMembers,
    },
  } as AIInsight;
}
