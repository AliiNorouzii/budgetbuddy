const categories = [
  {
    id: 1,
    name: "Food",
    type: "EXPENSE",
    description: "Groceries, restaurants, and food delivery.",
  },
  {
    id: 2,
    name: "Transport",
    type: "EXPENSE",
    description: "Bus, taxi, fuel, and other transportation costs.",
  },
  {
    id: 3,
    name: "Rent",
    type: "EXPENSE",
    description: "Monthly rent and housing payments.",
  },
  {
    id: 4,
    name: "Entertainment",
    type: "EXPENSE",
    description: "Movies, games, and leisure activities.",
  },
  {
    id: 5,
    name: "Salary",
    type: "INCOME",
    description: "Monthly salary and other employment income.",
  },
];

export default function CategoriesPage() {
  return (
    <main>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
        <p className="mt-1 text-slate-500">
          View the categories used to organize your transactions.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <section
            key={category.id}
            className="rounded-lg bg-white p-6 shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">
                {category.name}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  category.type === "INCOME"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {category.type}
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              {category.description}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
