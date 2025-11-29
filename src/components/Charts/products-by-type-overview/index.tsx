import { getProductsSoldByTypeData } from "@/services/charts.services";
import { type PropsWithClassName } from "@/types/props";
import { ProductsByTypeChart } from "./chart";

type ProductsByTypeOverviewProps = PropsWithClassName & {
  timeFrame?: string;
};

export async function ProductsByTypeOverview({
  className,
  timeFrame,
}: ProductsByTypeOverviewProps) {
  const data = await getProductsSoldByTypeData(
    timeFrame as "monthly" | "yearly",
  );

  const series = Object.keys(data).map((key) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
      data: data[key as keyof typeof data].map((item) => item.y),
    };
  });

  const categories = data[Object.keys(data)[0] as keyof typeof data].map(
    (item) => item.x,
  );

  return (
    <ProductsByTypeChart
      className={className}
      chartTitle="Products Sold by Type"
      series={series}
      categories={categories}
    />
  );
}