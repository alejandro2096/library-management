"use client";

import { LoanWithDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReturnBook } from "@/hooks/useLoans";
import { formatDate, isOverdue, getDueDaysLeft } from "@/lib/utils/format";
import { BookOpen, RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";

type LoanRowProps = {
  loan: LoanWithDetails;
  canReturn?: boolean;
};

const statusConfig = {
  ACTIVE: { label: "Active", variant: "success" as const },
  RETURNED: { label: "Returned", variant: "secondary" as const },
  OVERDUE: { label: "Overdue", variant: "destructive" as const },
};

export function LoanRow({ loan, canReturn = false }: LoanRowProps) {
  const returnBook = useReturnBook();
  const overdue = isOverdue(loan.dueDate) && loan.status === "ACTIVE";
  const daysLeft = getDueDaysLeft(loan.dueDate);
  const config = statusConfig[overdue ? "OVERDUE" : loan.status];

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <div>
            <Link
              href={`/books/${loan.book.id}`}
              className="text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              {loan.book.title}
            </Link>
            <p className="text-xs text-gray-500">{loan.book.author}</p>
          </div>
        </div>
      </td>
      <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-600">{loan.member.name}</td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(loan.checkedOut)}
      </td>
      <td className="hidden sm:table-cell px-4 py-3">
        <div className="flex items-center gap-1">
          {overdue && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
          <span className={`text-sm ${overdue ? "text-red-600 font-medium" : "text-gray-600"}`}>
            {formatDate(loan.dueDate)}
            {loan.status === "ACTIVE" && (
              <span className="text-xs ml-1">
                ({daysLeft > 0 ? `${daysLeft}d` : `${Math.abs(daysLeft)}d overdue`})
              </span>
            )}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge variant={config.variant}>{config.label}</Badge>
      </td>
      <td className="px-4 py-3">
        {canReturn && loan.status !== "RETURNED" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              returnBook.mutate(loan.id, {
                onError: (err) => alert(err.message),
              })
            }
            disabled={returnBook.isPending}
          >
            {returnBook.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RotateCcw className="h-3.5 w-3.5" />
            )}
            Return
          </Button>
        )}
      </td>
    </tr>
  );
}
