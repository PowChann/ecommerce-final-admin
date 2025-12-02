"use client";

// import { SearchIcon } from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { useModalContext } from "@/contexts/modal-context"; // Import useModalContext
// import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import { Logo } from "@/components/logo";

export function Header() {
  const { toggleSidebar, isMobile } = useSidebarContext();
  const { isModalOpen } = useModalContext(); // Use modal context

  if (isModalOpen) {
    return null; // Hide header if modal is open
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        {/* Placeholder for Menu Icon */}
        <span className="mb-1.5 block h-0.5 w-4 bg-dark dark:bg-white"></span>
        <span className="mb-1.5 block h-0.5 w-4 bg-dark dark:bg-white"></span>
        <span className="block h-0.5 w-4 bg-dark dark:bg-white"></span>
        <span className="sr-only">Toggle Sidebar</span>
      </button>

      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        

        <ThemeToggleSwitch />

        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}
