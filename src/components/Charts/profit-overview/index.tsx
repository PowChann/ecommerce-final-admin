import { getProfitChartData } from "@/services/charts.services";
import { type PropsWithClassName } from "@/types/props";
import { ProfitChart } from "./chart";

type ProfitOverviewProps = PropsWithClassName & {
  timeFrame?: string;
};

export async function ProfitOverview({
  className,
  timeFrame,
}: ProfitOverviewProps) {
  const { profit } = await getProfitChartData(
    timeFrame as "monthly" | "yearly",
  );

  const chartData = [
    {
      name: "Profit",
      data: profit.map((item: any) => item.y),
    },
  ];

  const categories = profit.map((item: any) => item.x);

  return (
    <ProfitChart
      className={className}
      chartTitle="Profit Overview"
      chartData={chartData}
      categories={categories}
    />
  );
}