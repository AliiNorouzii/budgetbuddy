export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar - نوار کناری */}
      <aside className="w-64 bg-slate-800 text-white p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-blue-400">BudgetBuddy</h2>
        <nav className="space-y-4">
          <div className="hover:text-blue-400 cursor-pointer">Dashboard</div>
          <div className="hover:text-blue-400 cursor-pointer">Transactions</div>
          <div className="hover:text-blue-400 cursor-pointer">Categories</div>
          <div className="hover:text-blue-400 cursor-pointer">Budgets</div>
        </nav>
      </aside>

      {/* Main Content - محتوای اصلی */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
