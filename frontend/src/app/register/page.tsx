export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
        <h1 className="mb-2 text-3xl font-bold text-slate-800">
          Create your account
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Start managing your personal finances with BudgetBuddy.
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Full name"
            className="rounded-md border border-slate-300 p-3 text-slate-900 outline-none focus:border-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            className="rounded-md border border-slate-300 p-3 text-slate-900 outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            className="rounded-md border border-slate-300 p-3 text-slate-900 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            className="rounded-md bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
