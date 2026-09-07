export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Login to BudgetBuddy</h1>
      <form className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email" 
          className="border p-2 rounded text-black" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="border p-2 rounded text-black" 
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
