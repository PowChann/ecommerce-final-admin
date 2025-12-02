"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
// Removed Dropdown, DropdownContent, DropdownTrigger imports
// import { Dropdown, DropdownContent, DropdownTrigger } from "./ui/dropdown"; // No longer needed

type PropsType<TItem> = {
  defaultValue?: TItem;
  items?: TItem[];
  minimal?: boolean;
};

const PARAM_KEY = "selected_time_frame";

export function PeriodPicker<TItem extends string>({
  defaultValue,
  items,
  minimal, // 'minimal' prop might be ignored for segmented buttons, or adapted
}: PropsType<TItem>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current selected time frame from URL
  const currentSelectedTimeFrame = searchParams.get(PARAM_KEY) || defaultValue || "monthly"; // Default to 'monthly' if none

  const periodItems = items || ["daily", "weekly", "monthly", "quarterly", "yearly"];

  const handlePeriodChange = (item: TItem) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(PARAM_KEY, item);
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className={cn(
        "inline-flex items-center rounded-md border border-stroke dark:border-dark-3 bg-white dark:bg-dark-2 text-dark-5 dark:text-white text-sm font-medium",
        minimal && "border-none bg-transparent dark:bg-transparent" // Adjust styling for minimal
    )}>
      {periodItems.map((item) => (
        <button
          key={item}
          onClick={() => handlePeriodChange(item as TItem)}
          className={cn(
            "px-3 py-1.5 transition-colors duration-200",
            currentSelectedTimeFrame === item
              ? "bg-primary text-white"
              : "hover:bg-gray-100 dark:hover:bg-dark-3",
            // Add rounded classes for first and last buttons
            item === periodItems[0] && "rounded-l-md",
            item === periodItems[periodItems.length - 1] && "rounded-r-md",
            // Add border between buttons
            item !== periodItems[periodItems.length - 1] && "border-r border-stroke dark:border-dark-3"
          )}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </button>
      ))}
    </div>
  );
}
// Removed createQueryString as it's no longer used
// const createQueryString = (key: string, value: string) => {
//   const params = new URLSearchParams(window.location.search);
//   params.set(key, value);
//   return params.toString();
// };
