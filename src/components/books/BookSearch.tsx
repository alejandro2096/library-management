"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, X } from "lucide-react";
import { useNaturalSearch } from "@/hooks/useAI";
import { Book } from "@prisma/client";

type BookSearchProps = {
  onSearch: (query: string) => void;
  onAIResults?: (books: Book[]) => void;
};

export function BookSearch({ onSearch, onAIResults }: BookSearchProps) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"normal" | "ai">("normal");
  const naturalSearch = useNaturalSearch();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "normal") {
      onSearch(query);
    } else {
      naturalSearch.mutate(query, {
        onSuccess: (data) => {
          onAIResults?.(data.books);
        },
      });
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    onAIResults?.([]);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === "ai"
              ? 'E.g.: "Short psychological horror"...'
              : "Search by title, author or ISBN..."
          }
          className="pl-9 pr-9"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Button
        type="button"
        variant={mode === "ai" ? "default" : "outline"}
        size="icon"
        onClick={() => setMode(mode === "ai" ? "normal" : "ai")}
        title={mode === "ai" ? "AI search active" : "Enable AI search"}
        className={mode === "ai" ? "bg-purple-600 hover:bg-purple-700" : ""}
      >
        <Sparkles className="h-4 w-4" />
      </Button>

      <Button type="submit" disabled={naturalSearch.isPending}>
        {naturalSearch.isPending ? "Searching..." : "Search"}
      </Button>
    </form>
  );
}
