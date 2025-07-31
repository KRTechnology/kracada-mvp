import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Kracada",
  description: "Manage your profile and settings",
};

export default async function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect dashboard routes - redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  return <>{children}</>;
}
