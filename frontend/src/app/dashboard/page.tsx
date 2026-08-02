export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Balance</h3>
          <p className="text-2xl font-bold">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Income</h3>
          <p className="text-2xl font-bold text-green-600">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Expenses</h3>
          <p className="text-2xl font-bold text-red-600">$0.00</p>
        </div>
      </div>
    </div>
  );
}
