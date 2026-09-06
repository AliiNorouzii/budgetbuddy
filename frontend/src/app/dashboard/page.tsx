"use client";

import { useDashboardData } from "@/lib/useDashboardData";
import { AddTransactionModal } from "@/components/ui/AddTransactionModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

export default function DashboardPage() {
  const { data, loading, error, invalidateCache } = useDashboardData();

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* سربرگ داشبورد همراه با کنترل کش و مودال */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">داشبورد مالی BudgetBuddy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            خلاصه وضعیت مالی، تراکنش‌ها و بودجه‌بندی هوشمند
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => invalidateCache()}
            title="به‌روزرسانی کش"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {/* مودال ثبت تراکنش با Invalidate کردن کش پس از ثبت */}
          <AddTransactionModal onTransactionAdded={() => invalidateCache()} />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* کارت‌های خلاصه وضعیت */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع درآمد</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {loading && !data ? "در حال دریافت..." : `${(data?.totalIncome || 0).toLocaleString()} تومان`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مجموع هزینه‌ها</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {loading && !data ? "در حال دریافت..." : `${(data?.totalExpense || 0).toLocaleString()} تومان`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">مانده خالص</CardTitle>
            <Wallet className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {loading && !data ? "در حال دریافت..." : `${(data?.netSavings || 0).toLocaleString()} تومان`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* تراکنش‌های اخیر */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">تراکنش‌های اخیر</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              در حال بارگذاری اطلاعات از کش و سرور...
            </div>
          ) : !data?.recentTransactions || data.recentTransactions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              هیچ تراکنشی یافت نشد.
            </div>
          ) : (
            <div className="divide-y">
              {data.recentTransactions.map((tx) => (
                <div key={tx.id} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{tx.title}</span>
                    <span className="text-xs text-muted-foreground block">
                      {new Date(tx.date).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <div
                    className={`font-semibold ${
                      tx.type === "INCOME" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {tx.type === "INCOME" ? "+" : "-"}
                    {tx.amount.toLocaleString()} تومان
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
