"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { usePathname } from "next/navigation";

export default function MasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Danh sách các đường dẫn KHÔNG hiển thị Sidebar/Header
  // Ví dụ: trang đăng nhập, đăng ký, quên mật khẩu... (bắt đầu bằng /auth)
  const isAuthPage = pathname?.startsWith("/auth");

  // Nếu là trang Auth -> Render full màn hình, không có Sidebar
  if (isAuthPage) {
    return (
      <div className="flex min-h-screen">
        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
            {children}
          </main>
        </div>
      </div>
    );
  }

  // Nếu là trang Admin -> Render có Sidebar + Header
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
        <Header />
        <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
