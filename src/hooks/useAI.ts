"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { Mood } from "@/types";

export function useReadingDNA(memberId?: string) {
  const query = memberId ? `?memberId=${memberId}` : "";
  return useQuery({
    queryKey: ["reading-dna", memberId],
    queryFn: async () => {
      const res = await fetch(`/api/ai/reading-dna${query}`);
      if (!res.ok) throw new Error("Failed to generate DNA");
      return res.json();
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });
}

export function useAIInsights() {
  return useQuery({
    queryKey: ["ai-insights"],
    queryFn: async () => {
      const res = await fetch("/api/ai/insights");
      if (!res.ok) throw new Error("Failed to generate insights");
      return res.json();
    },
    staleTime: 10 * 60 * 1000, // 10 min cache
  });
}

export function useMoodRecommendations() {
  return useMutation({
    mutationFn: async (mood: Mood) => {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood }),
      });
      if (!res.ok) throw new Error("Failed to get recommendations");
      return res.json();
    },
  });
}

export function useBookEnrichment() {
  return useMutation({
    mutationFn: async ({ title, author }: { title: string; author: string }) => {
      const res = await fetch("/api/ai/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author }),
      });
      if (!res.ok) throw new Error("Enrichment failed");
      return res.json();
    },
  });
}

export function useNaturalSearch() {
  return useMutation({
    mutationFn: async (query: string) => {
      const res = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
  });
}
