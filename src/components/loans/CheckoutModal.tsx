"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCheckout } from "@/hooks/useLoans";
import { Book } from "@prisma/client";
import { Loader2 } from "lucide-react";

type CheckoutModalProps = {
  book: Book;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  canCheckoutForOthers?: boolean;
};

export function CheckoutModal({
  book,
  open,
  onClose,
  onSuccess,
  canCheckoutForOthers = false,
}: CheckoutModalProps) {
  const [daysToReturn, setDaysToReturn] = useState(14);
  const [memberId, setMemberId] = useState("");
  const [notes, setNotes] = useState("");
  const checkout = useCheckout();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkout.mutate(
      {
        bookId: book.id,
        memberId: memberId || undefined,
        daysToReturn,
        notes: notes || undefined,
      },
      {
        onSuccess: () => {
          onClose();
          setMemberId("");
          setNotes("");
          setDaysToReturn(14);
          onSuccess?.();
        },
        onError: (err) => alert(err.message),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book loan</DialogTitle>
          <DialogDescription>
            <strong>{book.title}</strong> — {book.author}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Loan days</Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={daysToReturn}
              onChange={(e) => setDaysToReturn(parseInt(e.target.value))}
            />
          </div>

          {canCheckoutForOthers && (
            <div className="space-y-1.5">
              <Label>Member ID (optional, to check out on behalf of another member)</Label>
              <Input
                placeholder="member_id..."
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label>Notes (optional)</Label>
            <Input
              placeholder="Loan notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={checkout.isPending}>
              {checkout.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm loan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
