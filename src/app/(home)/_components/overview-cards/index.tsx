import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { revenue, totalUsers, newUsers, totalOrders, topSellingProduct } =
    await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Revenue"
        data={{
          ...revenue,
          value: "$" + compactFormat(revenue.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Users"
        data={{
          ...totalUsers,
          value: compactFormat(totalUsers.value),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="New Users"
        data={{
          ...newUsers,
          value: compactFormat(newUsers.value),
        }}
        Icon={icons.Users} // Using Users icon for new users
      />

      <OverviewCard
        label="Total Orders"
        data={{
          ...totalOrders,
          value: compactFormat(totalOrders.value),
        }}
        Icon={icons.Product} // Using Product icon as a placeholder
      />

      <OverviewCard
        label="Top Selling Product"
        data={{
          ...topSellingProduct,
          value: `${topSellingProduct.value} units`, // Assuming value is units sold
        }}
        Icon={icons.Product} // Using Product icon for top selling product
      />
    </div>
  );
}
