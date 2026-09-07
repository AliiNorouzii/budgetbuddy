import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">BudgetBuddy</h1>
        <p className="text-slate-500 mb-6">
          Personal Expense Tracker (University Project)
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Go to Login
          </Link>

          <Link
            href="/register"
            className="rounded-md border border-slate-300 p-3 font-semibold text-slate-800 hover:bg-slate-50"
          >
            Create Account
          </Link>

          <Link
            href="/dashboard"
            className="rounded-md border border-slate-300 p-3 font-semibold text-slate-800 hover:bg-slate-50"
          >
            View Dashboard (temporary)
          </Link>
        </div>
      </div>
    </main>
  );
}
