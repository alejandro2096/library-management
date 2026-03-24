"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type LoansParams = {
  memberId?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export function useLoans(params: LoansParams = {}) {
  const query = new URLSearchParams();
  if (params.memberId) query.set("memberId", params.memberId);
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));

  return useQuery({
    queryKey: ["loans", params],
    queryFn: async () => {
      const res = await fetch(`/api/loans?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch loans");
      return res.json();
    },
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      bookId: string;
      memberId?: string;
      daysToReturn?: number;
      notes?: string;
    }) => {
      const res = await fetch("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Checkout failed");
      }
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useReturnBook() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (loanId: string) => {
      const res = await fetch(`/api/loans/${loanId}`, { method: "PUT" });
      if (!res.ok) throw new Error("Return failed");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["loans"] });
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
