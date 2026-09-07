"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type TransactionType = "INCOME" | "EXPENSE";

type Transaction = {
  id: number;
  description: string;
  amount: number; // integer cents
  type: TransactionType;
  category: string;
  account: string;
  date: string; // YYYY-MM-DD
  notes?: string;
};

// داده‌های Mock (روز سوم)
const initialTransactions: Transaction[] = [
  {
    id: 1,
    description: "Salary",
    amount: 250000, // $2,500.00
    type: "INCOME",
    category: "Salary",
    account: "Main Bank Account",
    date: "2026-08-01",
    notes: "Monthly job salary",
  },
  {
    id: 2,
    description: "Grocery Shopping",
    amount: 4550, // $45.50
    type: "EXPENSE",
    category: "Food",
    account: "Credit Card",
    date: "2026-08-02",
    notes: "Weekly groceries",
  },
  {
    id: 3,
    description: "Bus Ticket",
    amount: 150, // $1.50
    type: "EXPENSE",
    category: "Transport",
    account: "Main Bank Account",
    date: "2026-08-02",
    notes: "Commute to work",
  },
];

// لیست‌ها برای فیلتر (Mock)
const categories = ["Food", "Transport", "Rent", "Salary", "Entertainment"];
const accounts = ["Main Bank Account", "Credit Card", "Cash Wallet"];

function formatAmount(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

export default function TransactionsPage() {
  // فیلترها
  const [filterType, setFilterType] = useState<"ALL" | TransactionType>("ALL");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [filterAccount, setFilterAccount] = useState<string>("ALL");
  const [filterDate, setFilterDate] = useState<string>(""); // YYYY-MM-DD

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((tx) => {
      if (filterType !== "ALL" && tx.type !== filterType) return false;
      if (filterCategory !== "ALL" && tx.category !== filterCategory)
        return false;
      if (filterAccount !== "ALL" && tx.account !== filterAccount) return false;
      if (filterDate && tx.date !== filterDate) return false;
      return true;
    });
  }, [filterType, filterCategory, filterAccount, filterDate]);

  return (
    <main>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Transactions</h1>
          <p className="mt-1 text-slate-500">
            View, search, and filter your transaction history.
          </p>
        </div>

        <div>
          <Link
            href="/dashboard/transactions/new"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Transaction
          </Link>
        </div>
      </div>

      {/* Filters */}
      <section className="mb-6 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Filters</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-slate-500">
              Type
            </label>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "ALL" | TransactionType)
              }
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-500">
              Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Account */}
          <div>
            <label className="block text-xs font-medium text-slate-500">
              Account
            </label>
            <select
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-slate-500">
              Date
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {filterDate ? (
                <button
                  type="button"
                  onClick={() => setFilterDate("")}
                  className="mt-1 rounded-md bg-slate-100 px-2 text-xs font-medium text-slate-600 hover:bg-slate-200"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-slate-500">
            <thead className="bg-slate-50 text-xs uppercase text-slate-700">
              <tr>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Description</th>
                <th className="px-6 py-3 font-semibold">Account</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 font-semibold">Type</th>
                <th className="px-6 py-3 text-right font-semibold">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-slate-400"
                  >
                    No transactions match your filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isExpense = tx.type === "EXPENSE";

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-6 py-4">{tx.date}</td>

                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div>
                          <div>{tx.description}</div>
                          {tx.notes ? (
                            <div className="text-xs text-slate-400">
                              {tx.notes}
                            </div>
                          ) : null}
                        </div>
                      </td>

                      <td className="px-6 py-4">{tx.account}</td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                          {tx.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            isExpense
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {tx.type}
                        </span>
                      </td>

                      <td
                        className={`whitespace-nowrap px-6 py-4 text-right font-semibold ${
                          isExpense ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {isExpense ? "-" : "+"}
                        {formatAmount(tx.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
