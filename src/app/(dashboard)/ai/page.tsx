import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMemberByClerkId } from "@/lib/db/members";
import { AILibrarian } from "@/components/ai/AILibrarian";
import { MoodPicker } from "@/components/ai/MoodPicker";
import { ReadingDNACard } from "@/components/ai/ReadingDNA";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Smile, Dna } from "lucide-react";

export default async function AIPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const member = await getMemberByClerkId(userId);
  if (!member) redirect("/api/sync-member");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Librarian</h1>
        <p className="text-gray-500 mt-1">
          Artificial intelligence features for your reading experience
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Chatbot */}
        <Card className="xl:row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Library Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AILibrarian />
          </CardContent>
        </Card>

        {/* Mood recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5 text-amber-500" />
              Mood recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoodPicker />
          </CardContent>
        </Card>

        {/* Reading DNA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dna className="h-5 w-5 text-purple-600" />
              Your Reading DNA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReadingDNACard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
