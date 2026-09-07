"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddTransactionModalProps {
  onTransactionAdded?: () => void;
}

export function AddTransactionModal({ onTransactionAdded }: AddTransactionModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("http://localhost:3000/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          amount: parseFloat(amount),
          type,
          date: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error("خطا در ثبت تراکنش");
      }

      setTitle("");
      setAmount("");
      setOpen(false);
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>تراکنش جدید</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>افزودن تراکنش جدید</DialogTitle>
          <DialogDescription>
            مشخصات تراکنش جدید را وارد کرده و ذخیره نمایید.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-2 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium mb-1">عنوان تراکنش</label>
            <Input
              required
              placeholder="مثال: خرید مواد غذایی"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">مبلغ</label>
            <Input
              required
              type="number"
              placeholder="مبلغ به تومان یا ریال"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">نوع تراکنش</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "EXPENSE" | "INCOME")}
              className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <option value="EXPENSE">هزینه (Expense)</option>
              <option value="INCOME">درآمد (Income)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "در حال ثبت..." : "ثبت تراکنش"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
