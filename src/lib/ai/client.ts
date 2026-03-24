import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const MODEL = "gemini-2.5-flash";

export async function generateAI(prompt: string, system: string): Promise<string> {
  const { text } = await generateText({
    model: google(MODEL),
    system,
    prompt,
    maxTokens: 1024,
  });
  return text;
}
