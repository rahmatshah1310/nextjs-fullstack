// app/dashboard/layout.tsx (Server Component)
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AppLayout from "../layouts/AppLayout";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getServerSession();

  if (!user) {
    redirect("/auth/login");
  }

  return <AppLayout session={user}>{children}</AppLayout>;
}
