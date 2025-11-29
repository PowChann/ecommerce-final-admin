import { getRevenueChartData } from "@/services/charts.services";
import { type PropsWithClassName } from "@/types/props";
import { RevenueChart } from "./chart";

type RevenueOverviewProps = PropsWithClassName & {
  timeFrame?: string;
};

export async function RevenueOverview({
  className,
  timeFrame,
}: RevenueOverviewProps) {
  const { revenue } = await getRevenueChartData(
    timeFrame as "monthly" | "yearly",
  );

  const chartData = [
    {
      name: "Revenue",
      data: revenue.map((item) => item.y),
    },
  ];

  const categories = revenue.map((item) => item.x);

  return (
    <RevenueChart
      className={className}
      chartTitle="Revenue Overview"
      chartData={chartData}
      categories={categories}
    />
  );
}