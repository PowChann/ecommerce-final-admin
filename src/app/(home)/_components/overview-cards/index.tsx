import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

export async function OverviewCardsGroup() {
  const { sales, users, pendingOrders, productStock } = await getOverviewData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <OverviewCard
        label="Total Sales"
        data={{
          ...sales,
          value: "$" + compactFormat(sales.value),
        }}
        Icon={icons.Profit}
      />

      <OverviewCard
        label="Total Users"
        data={{
          ...users,
          value: compactFormat(users.value),
        }}
        Icon={icons.Users}
      />

      <OverviewCard
        label="Total Orders"
        data={{
          ...pendingOrders,
          value: compactFormat(pendingOrders.value),
        }}
        Icon={icons.Product} // Using Product icon as a placeholder
      />

      <OverviewCard
        label="Product Stock"
        data={{
          ...productStock,
          value: compactFormat(productStock.value),
        }}
        Icon={icons.Product}
      />
    </div>
  );
}
