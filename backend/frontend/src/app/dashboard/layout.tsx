import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-64 bg-slate-800 text-white flex flex-col justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold mb-8">BudgetBuddy</h2>

          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className="block py-2.5 px-4 rounded hover:bg-slate-700 transition"
            >
              Dashboard
            </Link>

            <Link
              href="/dashboard/transactions"
              className="block py-2.5 px-4 rounded hover:bg-slate-700 transition"
            >
              Transactions
            </Link>

            <Link
              href="/dashboard/categories"
              className="block py-2.5 px-4 rounded hover:bg-slate-700 transition"
            >
              Categories
            </Link>

            <Link
              href="/dashboard/budgets"
              className="block py-2.5 px-4 rounded hover:bg-slate-700 transition"
            >
              Budgets
            </Link>
          </nav>
        </div>

        <div>
          <Link
            href="/login"
            className="block py-2.5 px-4 rounded bg-red-600 hover:bg-red-700 transition text-center"
          >
            Logout
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

