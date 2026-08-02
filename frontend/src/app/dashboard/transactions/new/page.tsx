"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NewTransactionPage() {
  const router = useRouter();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const amountInCents = Math.round(parseFloat(amount) * 100);

    const newTransaction = {
      description,
      amount:
        type === "EXPENSE" ? -Math.abs(amountInCents) : Math.abs(amountInCents),
      type,
      category,
      date,
      notes,
    };

    console.log("Saving new transaction (sample backend payload)", newTransaction);

    router.push("/dashboard/transactions");
  }

  return (
    <main className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/dashboard/transactions"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Transactions
        </Link>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Add Transaction
        </h1>

        <p className="mt-1 text-slate-500">
          Add a new income or expense transaction.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-6 shadow-md"
      >
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <input
            id="description"
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: Grocery Shopping"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Amount (USD)
          </label>

          <input
            id="amount"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="25.99"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="type"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Type
            </label>

            <select
              id="type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="category"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="Food">Food</option>
              <option value="Transport">Transport</option>
              <option value="Rent">Rent</option>
              <option value="Salary">Salary</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="date"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Date
          </label>

          <input
            id="date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Notes
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Optional notes..."
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard/transactions"
            className="rounded-md border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </main>
  );
}
