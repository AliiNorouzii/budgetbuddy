const budgets = [
  {
    id: 1,
    category: "Food",
    limit: 50000,
    spent: 32500,
  },
  {
    id: 2,
    category: "Transport",
    limit: 15000,
    spent: 8200,
  },
  {
    id: 3,
    category: "Entertainment",
    limit: 20000,
    spent: 18500,
  },
  {
    id: 4,
    category: "Rent",
    limit: 80000,
    spent: 80000,
  },
];

function formatAmount(amountInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInCents / 100);
}

export default function BudgetsPage() {
  return (
    <main>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Budgets</h1>

        <p className="mt-1 text-slate-500">
          Track your monthly spending limits by category.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {budgets.map((budget) => {
          const remaining = budget.limit - budget.spent;
          const percentage = Math.min(
            Math.round((budget.spent / budget.limit) * 100),
            100,
          );

          const isOverBudget = budget.spent > budget.limit;
          const isNearLimit = percentage >= 80;

          return (
            <section
              key={budget.id}
              className="rounded-lg bg-white p-6 shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {budget.category}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Monthly spending budget
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    isOverBudget
                      ? "bg-red-100 text-red-700"
                      : isNearLimit
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                  }`}
                >
                  {percentage}% used
                </span>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-600">
                    Spent: {formatAmount(budget.spent)}
                  </span>

                  <span className="font-medium text-slate-800">
                    Limit: {formatAmount(budget.limit)}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${
                      isOverBudget
                        ? "bg-red-500"
                        : isNearLimit
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                <p
                  className={`mt-4 text-sm font-medium ${
                    remaining >= 0 ? "text-slate-600" : "text-red-600"
                  }`}
                >
                  {remaining >= 0
                    ? `Remaining: ${formatAmount(remaining)}`
                    : `Over budget by: ${formatAmount(Math.abs(remaining))}`}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
