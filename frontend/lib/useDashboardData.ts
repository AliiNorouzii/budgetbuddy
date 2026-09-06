"use client";

import { useState, useEffect, useCallback } from "react";

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netSavings: number;
  recentTransactions: Array<{
    id: string;
    title: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string;
  }>;
}

// ساختار کش محلی در حافظه سمت کلاینت
interface CacheRecord {
  data: DashboardSummary;
  timestamp: number;
}

let memoryCache: CacheRecord | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds stale-while-revalidate

export function useDashboardData() {
  const [data, setData] = useState<DashboardSummary | null>(() => {
    if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_TTL_MS) {
      return memoryCache.data;
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(!data);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // استفاده از کش در صورتی که منقضی نشده باشد و رفرش اجباری خواسته نشده باشد
    if (
      !forceRefresh &&
      memoryCache &&
      Date.now() - memoryCache.timestamp < CACHE_TTL_MS
    ) {
      setData(memoryCache.data);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch("http://localhost:3000/transactions/summary", {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        // بهینه‌سازی سطح HTTP Fetch Next.js
        cache: "default",
      });

      if (!res.ok) {
        throw new Error("خطا در بارگذاری داده‌های داشبورد");
      }

      const result: DashboardSummary = await res.json();
      // به‌روزرسانی کش
      memoryCache = {
        data: result,
        timestamp: Date.now(),
      };
      setData(result);
    } catch (err: any) {
      setError(err.message || "خطای ناشناخته رخ داده است");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const invalidateCache = useCallback(() => {
    memoryCache = null;
    return fetchData(true);
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData, invalidateCache };
}
