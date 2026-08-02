export default function DashboardPage() {
  return (
    <main>
      <h1 className="mb-6 text-3xl font-bold text-slate-900">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-3">
        <section className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-slate-500">Balance</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">$0.00</p>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-slate-500">Income</p>
          <p className="mt-2 text-3xl font-bold text-green-600">$0.00</p>
        </section>

        <section className="rounded-lg bg-white p-6 shadow-md">
          <p className="text-sm font-medium text-slate-500">Expenses</p>
          <p className="mt-2 text-3xl font-bold text-red-600">$0.00</p>
        </section>
      </div>
    </main>
  );
}
