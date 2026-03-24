"use client";

import { useState } from "react";
import { useLoans } from "@/hooks/useLoans";
import { LoanRow } from "@/components/loans/LoanRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookMarked } from "lucide-react";
import { LoanWithDetails } from "@/types";

const STATUS_TABS = [
  { label: "All", value: undefined },
  { label: "Active", value: "ACTIVE" },
  { label: "Overdue", value: "OVERDUE" },
  { label: "Returned", value: "RETURNED" },
] as const;

export default function LoansPage() {
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { data, isLoading } = useLoans({ status });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loans</h1>
        <p className="text-gray-500 mt-1">
          Manage library loans
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={String(tab.value)}
            onClick={() => setStatus(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              status === tab.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
            {tab.value === "OVERDUE" && data?.total > 0 && status !== "OVERDUE" && (
              <Badge variant="destructive" className="ml-1.5 text-xs px-1.5 py-0">
                !
              </Badge>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : !data?.loans?.length ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookMarked className="h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500">No loans in this category</p>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3">Book</th>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Checked out</th>
                <th className="px-4 py-3">Due date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.loans.map((loan: LoanWithDetails) => (
                <LoanRow
                  key={loan.id}
                  loan={loan}
                  canReturn={true}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
