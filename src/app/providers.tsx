"use client";

import { SidebarProvider } from "@/components/layout/sidebar/sidebar-context";
import { ThemeProvider } from "next-themes";
// import { AuthContextProvider } from "@/context/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <AuthContextProvider>
      <ThemeProvider defaultTheme="light" attribute="class">
        <SidebarProvider>{children}</SidebarProvider>
      </ThemeProvider>
    // </AuthContextProvider>
  );
}
