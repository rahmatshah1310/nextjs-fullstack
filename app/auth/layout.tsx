"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  if (status === "loading" || status === "authenticated") {
    return <div className="flex h-screen items-center justify-center bg-[var(--background)] text-[var(--foreground)]">Loading...</div>;
  }

  return <div>{children}</div>;
};

export default AuthLayout;
