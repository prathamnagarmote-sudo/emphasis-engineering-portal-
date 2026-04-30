import Dashboard from "@/components/pages/Dashboard";
import AdminDashboard from "@/components/pages/AdminDashboard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if ((session.user as any).role === "admin") {
    return <AdminDashboard />;
  }

  return <Dashboard />;
}
