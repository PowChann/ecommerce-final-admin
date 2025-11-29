"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/authClient";
import Image from "next/image"; // Import Next Image
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

// Icon Login tạm thời
const LogInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
    />
  </svg>
);

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;

  const handleLogout = async () => {
    setIsOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully!");
          router.push("/auth/sign-in");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  };

  // 1. Loading State
  if (isPending) {
    return (
      <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200 dark:bg-dark-3" />
    );
  }

  // 2. Chưa đăng nhập: Hiển thị nút Sign In
  if (!session) {
    return (
      <Link
        href="/auth/sign-in"
        className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-opacity-90 dark:bg-white dark:text-dark dark:hover:bg-gray-2"
      >
        <LogInIcon />
        <span>Sign In</span>
      </Link>
    );
  }

  // 3. Đã đăng nhập: Xử lý thông tin user
  const currentUser = {
    name: user?.name || "User",
    email: user?.email || "",
    image: user?.image || "",
  };

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          {/* --- BẮT ĐẦU PHẦN SỬA AVATAR --- */}
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-300 transition-colors duration-200 hover:border-primary">
            {currentUser.image ? (
              <Image
                src={currentUser.image}
                alt={`Avatar of ${currentUser.name}`}
                className="h-full w-full object-cover"
                width={100} // Cần thiết cho Next/Image
                height={100}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-bold text-white">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* --- KẾT THÚC PHẦN SỬA AVATAR --- */}

          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span>{currentUser.name}</span>

            <ChevronUpIcon
              aria-hidden
              className={cn(
                "rotate-180 transition-transform",
                isOpen && "rotate-0",
              )}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        {/* Phần hiển thị user trong dropdown cũng nên dùng logic avatar tương tự cho đồng bộ */}
        <div className="flex items-center gap-2.5 px-5 py-3.5">
          <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-300">
            {currentUser.image ? (
              <Image
                src={currentUser.image}
                alt={`Avatar of ${currentUser.name}`}
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-bold text-white">
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1 text-base font-medium">
            <div className="mb-2 leading-none text-dark dark:text-white">
              {currentUser.name}
            </div>
            <div className="leading-none text-gray-6">{currentUser.email}</div>
          </div>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href={"/profile"}
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />
            <span className="mr-auto text-base font-medium">View profile</span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
            onClick={handleLogout}
          >
            <LogOutIcon />
            <span className="text-base font-medium">Log out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
