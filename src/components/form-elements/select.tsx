"use client";

import { ChevronUpIcon } from "@/assets/icons";
import { cn } from "@/lib/utils";
import { useId, useState, forwardRef } from "react";

type PropsType = {
  label: string;
  items: { value: string | number; label: string }[];
  prefixIcon?: React.ReactNode;
  className?: string;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string | number;
} & React.SelectHTMLAttributes<HTMLSelectElement> & ( // Extend HTML select attributes
  | { placeholder?: string; defaultValue?: string }
  | { placeholder: string; defaultValue?: string }
);

export const Select = forwardRef<HTMLSelectElement, PropsType>(
  (
    {
      items,
      label,
      defaultValue,
      placeholder,
      prefixIcon,
      className,
      onChange,
      value,
      name,
      ...props
    },
    ref
  ) => {
    const id = useId();
    const [touched, setTouched] = useState(false);

    const isSelected = value !== "" && value !== undefined;

    return (
      <div className={cn("space-y-3", className)}>
        <label
          htmlFor={id}
          className="block text-body-sm font-medium text-dark dark:text-white"
        >
          {label}
        </label>

        <div className="relative">
          {prefixIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              {prefixIcon}
            </div>
          )}

          <select
            id={id}
            ref={ref}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={(e) => {
              setTouched(true);
              if (onChange) onChange(e);
            }}
            className={cn(
              "w-full appearance-none rounded-lg border border-stroke bg-transparent px-5.5 py-3 outline-none transition focus:border-primary active:border-primary dark:border-dark-3 dark:bg-dark-2 dark:focus:border-primary [&>option]:text-dark-5 dark:[&>option]:text-dark-6",
              (isSelected || touched) ? "text-dark dark:text-white" : "text-dark-5",
              prefixIcon && "pl-11.5",
            )}
            {...props} // Spread rest of props (onBlur, required, etc.)
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <ChevronUpIcon className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rotate-180" />
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";
