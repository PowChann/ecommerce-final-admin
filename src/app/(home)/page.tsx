import { PaymentsOverview } from "@/components/charts/payments-overview";
import { WeeksProfit } from "@/components/charts/weeks-profit";
import { UsersOverview } from "@/components/charts/users-overview";
import { OrdersOverview } from "@/components/charts/orders-overview";
import { RevenueOverview } from "@/components/charts/revenue-overview";
import { ProfitOverview } from "@/components/charts/profit-overview";
import { ProductsByTypeOverview } from "@/components/charts/products-by-type-overview";
import { PeriodPicker } from "@/components/period-picker"; // Import PeriodPicker

import { extractTimeFrame } from "@/lib/timeframe-extractor";
import { Suspense } from "react";
import Link from "next/link";
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
  const selectedTimeFrame = extractTimeFrame(
    (await searchParams).selected_time_frame,
  );

  return (
    <>
      <Suspense fallback={<OverviewCardsSkeleton />}>
        <OverviewCardsGroup />
      </Suspense>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 md:mt-8 2xl:mt-10">
        <h2 className="mb-4 text-xl font-semibold">Quick Navigation</h2>
        <PeriodPicker />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-7.5">
        <Link
          href="/auth/sign-in"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Sign In / Đăng nhập
        </Link>
        <Link
          href="/users"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          User Management
        </Link>
        <Link
          href="/products"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Product Management
        </Link>
        <Link
          href="/categories"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Category Management
        </Link>
        <Link
          href="/brands"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Brand Management
        </Link>
        <Link
          href="/tags"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Tag Management
        </Link>
        <Link
          href="/orders"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Order Management
        </Link>
        <Link
          href="/discounts"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Discount Management
        </Link>
        <Link
          href="/reviews"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Review & Rating Management
        </Link>
        <Link
          href="/payments"
          className="dark:bg-boxdark flex items-center justify-center rounded-md bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          Payment Management
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <Suspense fallback={<div>Loading user data...</div>}>
          <UsersOverview
            className="col-span-12 xl:col-span-6"
            timeFrame={selectedTimeFrame}
          />
        </Suspense>
        <Suspense fallback={<div>Loading order data...</div>}>
          <OrdersOverview
            className="col-span-12 xl:col-span-6"
            timeFrame={selectedTimeFrame}
          />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <Suspense fallback={<div>Loading revenue data...</div>}>
          <RevenueOverview
            className="col-span-12 xl:col-span-6"
            timeFrame={selectedTimeFrame}
          />
        </Suspense>
        <Suspense fallback={<div>Loading profit data...</div>}>
          <ProfitOverview
            className="col-span-12 xl:col-span-6"
            timeFrame={selectedTimeFrame}
          />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <Suspense fallback={<div>Loading products by type data...</div>}>
          <ProductsByTypeOverview
            className="col-span-12"
            timeFrame={selectedTimeFrame}
          />
        </Suspense>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <PaymentsOverview
          className="col-span-12 xl:col-span-8"
          key={selectedTimeFrame}
          timeFrame={selectedTimeFrame}
        />

        <WeeksProfit
          key={selectedTimeFrame}
          timeFrame={selectedTimeFrame}
          className="col-span-12 xl:col-span-4"
        />
      </div>

      {/* Recent Orders Section */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          {" "}
          {/* Occupy full width */}
          <Suspense fallback={<div>Loading recent orders...</div>}>
            <RecentOrders />
          </Suspense>
        </div>
      </div>

      {/* Low Stock Products Section */}
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="col-span-12">
          {" "}
          {/* Occupy full width */}
          <Suspense fallback={<div>Loading low stock products...</div>}>
            <LowStockProducts />
          </Suspense>
        </div>
      </div>
    </>
  );
}
