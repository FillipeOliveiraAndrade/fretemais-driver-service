"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { clearAuthToken, getAuthToken } from "@/lib/api";

export function useRequireAuth() {
  const router = useRouter();

  useEffect(() => {
    if (!getAuthToken()) {
      router.replace("/login");
    }
  }, [router]);

  const logout = useCallback(() => {
    clearAuthToken();
    router.push("/login");
  }, [router]);

  return { logout };
}
