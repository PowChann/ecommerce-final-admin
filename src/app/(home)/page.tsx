import { PaymentsOverview } from "@/components/charts/payments-overview";
import { WeeksProfit } from "@/components/charts/weeks-profit";

import { createTimeFrameExtractor } from "@/lib/timeframe-extractor";
import { Suspense } from "react";
import Link from 'next/link';
import { OverviewCardsGroup } from "./_components/overview-cards";
import { OverviewCardsSkeleton } from "./_components/overview-cards/skeleton";
import { RecentOrders } from "./_components/recent-orders";
import { LowStockProducts } from "./_components/low-stock-products";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const extractTimeFrame = createTimeFrameExtractor(selected_time_frame);

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-6 md:mt-8 2xl:mt-10">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-7.5">
          <Link href="/auth/sign-in" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Sign In / Đăng nhập
          </Link>
          <Link href="/users" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            User Management
          </Link>
          <Link href="/products" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Product Management
          </Link>
          <Link href="/categories" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Category Management
          </Link>
          <Link href="/brands" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Brand Management
          </Link>
          <Link href="/tags" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Tag Management
          </Link>
          <Link href="/orders" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Order Management
          </Link>
          <Link href="/discounts" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Discount Management
          </Link>
          <Link href="/reviews" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Review & Rating Management
          </Link>
          <Link href="/payments" className="flex items-center justify-center p-4 bg-white dark:bg-boxdark rounded-md shadow-sm hover:shadow-md transition-all duration-200">
            Payment Management
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-8"
          key={extractTimeFrame("payments_overview")}
          timeFrame={extractTimeFrame("payments_overview")?.split(":")[1]}
        />

        <WeeksProfit
          key={extractTimeFrame("weeks_profit")}
          timeFrame={extractTimeFrame("weeks_profit")?.split(":")[1]}
          className="col-span-12 xl:col-span-4"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12"> {/* Occupy full width */}
          <Suspense fallback={<div>Loading recent orders...</div>}>
            <RecentOrders />
          </Suspense>
        </div>
      </div>

      {/* Low Stock Products Section */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12"> {/* Occupy full width */}
          <Suspense fallback={<div>Loading low stock products...</div>}>
            <LowStockProducts />
          </Suspense>
        </div>
      </div>
    </>
  );
}


