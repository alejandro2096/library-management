"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCreateBook, useUpdateBook } from "@/hooks/useBooks";
import { useBookEnrichment } from "@/hooks/useAI";
import { Sparkles, Loader2 } from "lucide-react";
import { Book } from "@prisma/client";

type BookFormProps = {
  book?: Book;
};

export function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const isEdit = !!book;

  const [form, setForm] = useState({
    title: book?.title ?? "",
    author: book?.author ?? "",
    isbn: book?.isbn ?? "",
    genre: book?.genre.join(", ") ?? "",
    description: book?.description ?? "",
    publishedYear: book?.publishedYear?.toString() ?? "",
    coverUrl: book?.coverUrl ?? "",
    totalCopies: book?.totalCopies?.toString() ?? "1",
    themes: book?.themes.join(", ") ?? "",
    readingLevel: book?.readingLevel ?? "",
    language: book?.language ?? "es",
  });

  const createBook = useCreateBook();
  const updateBook = useUpdateBook(book?.id ?? "");
  const enrichment = useBookEnrichment();

  const handleEnrich = () => {
    if (!form.title || !form.author) {
      alert("Enter a title and author to enrich with AI");
      return;
    }
    enrichment.mutate(
      { title: form.title, author: form.author },
      {
        onSuccess: (data) => {
          setForm((prev) => ({
            ...prev,
            description: data.description || prev.description,
            genre: data.genre?.join(", ") || prev.genre,
            themes: data.themes?.join(", ") || prev.themes,
            readingLevel: data.readingLevel || prev.readingLevel,
            publishedYear: data.publishedYear?.toString() || prev.publishedYear,
          }));
        },
        onError: () => alert("Enrichment failed. Please check your API key."),
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title: form.title,
      author: form.author,
      isbn: form.isbn || undefined,
      genre: form.genre.split(",").map((s) => s.trim()).filter(Boolean),
      description: form.description || undefined,
      publishedYear: form.publishedYear ? parseInt(form.publishedYear) : undefined,
      coverUrl: form.coverUrl || undefined,
      totalCopies: parseInt(form.totalCopies) || 1,
      themes: form.themes.split(",").map((s) => s.trim()).filter(Boolean),
      readingLevel: form.readingLevel || undefined,
      language: form.language,
      aiEnriched: enrichment.isSuccess,
    };

    const mutation = isEdit ? updateBook : createBook;
    mutation.mutate(data, {
      onSuccess: (result) => {
        router.push(`/books/${result.id}`);
      },
      onError: (err) => alert(err.message),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Book Information</CardTitle>
            <Button
              type="button"
              variant="outline"
              onClick={handleEnrich}
              disabled={enrichment.isPending}
              className="gap-2 border-purple-200 text-purple-700 hover:bg-purple-50"
            >
              {enrichment.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {enrichment.isPending ? "Enriching..." : "✨ Enrich with AI"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="isbn">ISBN</Label>
            <Input
              id="isbn"
              value={form.isbn}
              onChange={(e) => setForm((p) => ({ ...p, isbn: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="publishedYear">Publication year</Label>
            <Input
              id="publishedYear"
              type="number"
              value={form.publishedYear}
              onChange={(e) => setForm((p) => ({ ...p, publishedYear: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="totalCopies">Number of copies</Label>
            <Input
              id="totalCopies"
              type="number"
              min="1"
              value={form.totalCopies}
              onChange={(e) => setForm((p) => ({ ...p, totalCopies: e.target.value }))}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="readingLevel">Reading level</Label>
            <Input
              id="readingLevel"
              placeholder="beginner, intermediate, advanced"
              value={form.readingLevel}
              onChange={(e) => setForm((p) => ({ ...p, readingLevel: e.target.value }))}
            />
          </div>

          <div className="col-span-full space-y-1.5">
            <Label htmlFor="genre">Genres (comma-separated)</Label>
            <Input
              id="genre"
              placeholder="Fiction, Novel, Adventure"
              value={form.genre}
              onChange={(e) => setForm((p) => ({ ...p, genre: e.target.value }))}
            />
          </div>

          <div className="col-span-full space-y-1.5">
            <Label htmlFor="themes">Themes (comma-separated)</Label>
            <Input
              id="themes"
              placeholder="Love, Identity, Exploration"
              value={form.themes}
              onChange={(e) => setForm((p) => ({ ...p, themes: e.target.value }))}
            />
          </div>

          <div className="col-span-full space-y-1.5">
            <Label htmlFor="coverUrl">Cover URL</Label>
            <Input
              id="coverUrl"
              type="url"
              placeholder="https://..."
              value={form.coverUrl}
              onChange={(e) => setForm((p) => ({ ...p, coverUrl: e.target.value }))}
            />
          </div>

          <div className="col-span-full space-y-1.5">
            <Label htmlFor="description">Description / Synopsis</Label>
            <Textarea
              id="description"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={createBook.isPending || updateBook.isPending}
        >
          {createBook.isPending || updateBook.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : isEdit ? (
            "Save changes"
          ) : (
            "Add book"
          )}
        </Button>
      </div>
    </form>
  );
}
