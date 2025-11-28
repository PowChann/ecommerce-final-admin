import { logo } from "@/assets/logos";
import Image from "next/image";
import { cn } from "@/lib/utils"; // Import cn utility

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative h-15 w-60", className)}>
      <Image
        src={logo}
        fill
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
        priority
      />
    </div>
  );
}
