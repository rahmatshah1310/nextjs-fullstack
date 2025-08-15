// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AppLayout from "../layouts/AppLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <AppLayout session={session}>{children}</AppLayout>;
}
