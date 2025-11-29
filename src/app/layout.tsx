import "@/css/satoshi.css";
import "@/css/style.css";
import "flatpickr/dist/flatpickr.min.css";

import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import MasterLayout from "@/components/layout/MasterLayout";

export const metadata: Metadata = {
  title: {
    template: "%s | TechZone - Admin",
    default: "TechZone - Admin",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <NextTopLoader color="#5750F1" showSpinner={false} />

          {/* Sử dụng MasterLayout để điều khiển giao diện Sidebar/Header */}
          <MasterLayout>{children}</MasterLayout>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
