import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const MODEL = "gemini-2.5-flash";

export async function generateAI(
  prompt: string,
  system: string,
  maxTokens = 2048
): Promise<string> {
  const { text } = await generateText({
    model: google(MODEL),
    system,
    prompt,
    maxTokens,
  });
  return text;
}
