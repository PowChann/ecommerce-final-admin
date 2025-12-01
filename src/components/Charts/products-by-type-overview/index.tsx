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

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className={`${className} flex items-center justify-center p-8 bg-white rounded-md border border-stroke dark:bg-gray-dark dark:border-dark-3 shadow-1`}>
        <p className="text-gray-500 dark:text-gray-400">No data available for Products by Type</p>
      </div>
    );
  }

  const series = Object.keys(data).map((key) => {
    return {
      name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
      data: data[key as keyof typeof data].map((item) => item.y),
    };
  });

  // Safely access the first category's data for x-axis labels
  const firstKey = Object.keys(data)[0] as keyof typeof data;
  const categories = data[firstKey]?.map((item) => item.x) || [];

  return (
    <ProductsByTypeChart
      className={className}
      chartTitle="Products Sold by Type"
      series={series}
      categories={categories}
    />
  );
}