"use client";

import { useReadingDNA } from "@/hooks/useAI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Dna, BookOpen, Star } from "lucide-react";

type ReadingDNACardProps = {
  memberId?: string;
};

export function ReadingDNACard({ memberId }: ReadingDNACardProps) {
  const { data, isLoading, error } = useReadingDNA(memberId);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Analyzing your reading profile...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          Error generating profile. Please try again.
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-4">
      {/* DNA Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Dna className="h-5 w-5" />
            Your Reading DNA
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-blue-900 leading-relaxed italic">{data.narrative}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700 mb-1">Favorite genres</p>
              <div className="flex flex-wrap gap-1">
                {data.favoriteGenres?.length > 0 ? (
                  data.favoriteGenres.map((g: string) => (
                    <Badge key={g} variant="secondary">
                      {g}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No data yet</span>
                )}
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-700 mb-1">Frequent authors</p>
              <div className="flex flex-wrap gap-1">
                {data.favoriteAuthors?.length > 0 ? (
                  data.favoriteAuthors.map((a: string) => (
                    <Badge key={a} variant="outline">
                      {a}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-400 text-xs">No data yet</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Reading pace</p>
              <p className="text-gray-600 text-xs mt-0.5">{data.readingPace}</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Seasonal pattern</p>
              <p className="text-gray-600 text-xs mt-0.5">{data.seasonalPattern}</p>
            </div>
          </div>

          <div className="text-center py-1">
            <span className="text-2xl font-bold text-blue-700">{data.totalBooksRead}</span>
            <p className="text-xs text-gray-500">books read</p>
          </div>
        </CardContent>
      </Card>

      {/* Next read recommendation */}
      {data.nextRead && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-800 text-sm">
              <Star className="h-4 w-4" />
              Your ideal next read
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 text-amber-600 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900">{data.nextRead.title}</p>
                <p className="text-xs text-amber-700">{data.nextRead.author}</p>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  {data.nextRead.reason}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
