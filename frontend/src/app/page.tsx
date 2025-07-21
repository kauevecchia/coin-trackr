"use client";

import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { isAuthenticated, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      checkSession();
    }
  }, [isLoading, checkSession]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }

  return null;
}
