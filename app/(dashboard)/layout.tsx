import Header from "@/components/layout/Header";
import type { Metadata } from "next";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Kracada",
  description: "Manage your profile and explore opportunities",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={session?.user} />
      <main className="flex-1 pt-[72px]">{children}</main>
    </div>
  );
}
