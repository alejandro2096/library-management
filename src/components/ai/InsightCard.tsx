"use client";

import { useAIInsights } from "@/hooks/useAI";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function InsightCard() {
  const { data, isLoading, error, refetch, isFetching } = useAIInsights();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-8 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Generating weekly AI analysis...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6 text-center">
          <p className="text-sm text-gray-500 mb-3">Could not generate analysis</p>
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5" />
            Weekly AI Analysis
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => refetch()}
            disabled={isFetching}
            className="text-purple-600 hover:text-purple-700"
          >
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700 leading-relaxed">{data.narrative}</p>

        {data.alerts?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-amber-700 flex items-center gap-1">
              <AlertTriangle className="h-3.5 w-3.5" />
              Alerts
            </h4>
            <ul className="space-y-1">
              {data.alerts.map((alert: string, i: number) => (
                <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span>
                  {alert}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.trends?.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-blue-700 flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Trends
            </h4>
            <ul className="space-y-1">
              {data.trends.map((trend: string, i: number) => (
                <li key={i} className="text-xs text-blue-800 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span>
                  {trend}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.weeklyStats && (
          <div className="grid grid-cols-4 gap-2 pt-2 border-t border-purple-100">
            {[
              { label: "Loans", value: data.weeklyStats.totalLoans },
              { label: "Returned", value: data.weeklyStats.returns },
              { label: "New books", value: data.weeklyStats.newBooks },
              { label: "Active members", value: data.weeklyStats.activeMembers },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold text-purple-700">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
