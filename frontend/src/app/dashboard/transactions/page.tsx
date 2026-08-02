import Link from "next/link";

const transactions = [
  {
    id: 1,
    date: "2026-08-01",
    description: "Salary",
    category: "Salary",
    type: "INCOME",
    amount: 250000,
  },
  {
    id: 2,
    date: "2026-08-02",
    description: "Grocery Shopping",
    category: "Food",
    type: "EXPENSE",
    amount: -4550,
  },
  {
    id: 3,
    date: "2026-08-02",
    description: "Bus Ticket",
    category: "Transport",
    type: "EXPENSE",
    amount: -150,
  },
];

function formatAmount(amountInCents: number) {
  const amountInDollars = Math.abs(amountInCents) / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInDollars);
}

export default function TransactionsPage() {
  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Transactions
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your income and expenses.
          </p>
        </div>

        <Link
          href="/dashboard/transactions/new"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
        >
          Add Transaction
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm text-slate-600">
              <tr>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 text-right font-semibold">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-slate-600">
                    {transaction.date}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-900">
                    {transaction.description}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {transaction.category}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.type === "INCOME"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {formatAmount(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
