import { getOrdersChartData } from "@/services/charts.services";
import { type PropsWithClassName } from "@/types/props";
import { OrdersChart } from "./chart";

type OrdersOverviewProps = PropsWithClassName & {
  timeFrame?: string;
};

export async function OrdersOverview({
  className,
  timeFrame,
}: OrdersOverviewProps) {
  const { totalOrders, newOrders } = await getOrdersChartData(
    timeFrame as "monthly" | "yearly",
  );

  const chartData = [
    {
      name: "Total Orders",
      data: totalOrders.map((item: any) => item.y),
    },
    {
      name: "New Orders",
      data: newOrders.map((item: any) => item.y),
    },
  ];

  const categories = totalOrders.map((item: any) => item.x);

  return (
    <OrdersChart
      className={className}
      chartTitle="Orders Overview"
      chartData={chartData}
      categories={categories}
    />
  );
}