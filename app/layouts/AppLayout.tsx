"use client";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import React, { useState, type ReactNode } from "react";
import { Session } from "next-auth";

interface AppLayoutProps {
  children: ReactNode;
  session: Session;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="flex h-screen">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <div className="flex-shrink-0 sticky top-0 z-10 bg-[var(--header-bg)]">
          <Header setSidebarOpen={setSidebarOpen} />
        </div>

        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[var(--main-bg)] text-[var(--main-text)]">{children}</main>
      </div>
    </div>
  );
}
