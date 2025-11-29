import { getUsersChartData } from "@/services/charts.services";
import { type PropsWithClassName } from "@/types/props";
import { UsersChart } from "./chart";

type UsersOverviewProps = PropsWithClassName & {
  timeFrame?: string;
};

export async function UsersOverview({
  className,
  timeFrame,
}: UsersOverviewProps) {
  const { totalUsers, newUsers } = await getUsersChartData(
    timeFrame as "monthly" | "yearly",
  );

  const chartData = [
    {
      name: "Total Users",
      data: totalUsers.map((item) => item.y),
    },
    {
      name: "New Users",
      data: newUsers.map((item) => item.y),
    },
  ];

  const categories = totalUsers.map((item) => item.x);

  return (
    <UsersChart
      className={className}
      chartTitle="Users Overview"
      chartData={chartData}
      categories={categories}
    />
  );
}