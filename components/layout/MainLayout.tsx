"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useSession } from "next-auth/react";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={session?.user} />
      <main className="flex-grow pt-[72px]">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
