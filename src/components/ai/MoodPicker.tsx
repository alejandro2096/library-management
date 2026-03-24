"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMoodRecommendations } from "@/hooks/useAI";
import { Mood, MoodOption } from "@/types";
import { Loader2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import Link from "next/link";

const MOODS: MoodOption[] = [
  { id: "adventurous", label: "Adventurous", emoji: "🗺️", description: "I want to live an adventure" },
  { id: "romantic", label: "Romantic", emoji: "💕", description: "In love mode" },
  { id: "thoughtful", label: "Thoughtful", emoji: "🤔", description: "I want to think" },
  { id: "excited", label: "Excited", emoji: "⚡", description: "Full of energy" },
  { id: "calm", label: "Calm", emoji: "🌿", description: "Relaxed mode" },
  { id: "curious", label: "Curious", emoji: "🔍", description: "I want to learn" },
  { id: "melancholic", label: "Melancholic", emoji: "🌧️", description: "Emotional mood" },
  { id: "inspired", label: "Inspired", emoji: "✨", description: "Feeding creativity" },
];

export function MoodPicker() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const recommend = useMoodRecommendations();

  const handleSelect = (mood: Mood) => {
    setSelectedMood(mood);
    recommend.mutate(mood);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">How are you feeling today?</h3>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleSelect(mood.id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all hover:border-blue-300 hover:shadow-sm",
                selectedMood === mood.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              )}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-medium text-gray-700">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {recommend.isPending && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Finding perfect books for you...
        </div>
      )}

      {recommend.isSuccess && recommend.data && (
        <div className="space-y-4">
          {recommend.data.message && (
            <p className="text-sm text-gray-600 italic border-l-4 border-blue-200 pl-3">
              {recommend.data.message}
            </p>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {recommend.data.recommendations?.map(
              (rec: { bookId: string; title: string; author: string; reason: string }) => (
                <Card key={rec.bookId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start gap-2">
                      <BookOpen className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <Link
                          href={`/books/${rec.bookId}`}
                          className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                        >
                          {rec.title}
                        </Link>
                        <p className="text-xs text-gray-500">{rec.author}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{rec.reason}</p>
                  </CardContent>
                </Card>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
