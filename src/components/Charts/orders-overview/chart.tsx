"use client";

import dynamic from "next/dynamic";
import { type ApexOptions } from "apexcharts";
import { type PropsWithClassName } from "@/types/props";
import { useTheme } from "next-themes"; // Import useTheme

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartProps = PropsWithClassName & {
  chartTitle: string;
  chartData: { name: string; data: number[] }[];
  categories: (string | number)[];
};

export function OrdersChart({
  className,
  chartTitle,
  chartData,
  categories,
}: ChartProps) {
  const { theme } = useTheme(); // Get current theme

  const options: ApexOptions = {
    theme: {
      mode: theme === 'dark' ? 'dark' : 'light', // Set theme dynamically
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      markers: {
        // radius: 99, // Removed due to type error
      },
      labels: {
        colors: theme === 'dark' ? '#fff' : '#333', // Adjust legend color for theme
      },
    },
    colors: ["#3BA0FF", "#FFB648"], // Example colors for orders
    chart: {
      fontFamily: "Satoshi",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: ["#fff"],
      strokeColors: ["#3BA0FF", "#FFB648"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      shape: "circle",
      // radius: 2, // Removed
      offsetX: 0,
      offsetY: 0,
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#616161', // Adjust X-axis label color for theme
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      labels: {
        formatter: (value) => value.toLocaleString('en-US'),
        style: {
          colors: theme === 'dark' ? '#fff' : '#616161', // Adjust Y-axis label color for theme
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          return value.toLocaleString('en-US');
        }
      }
    },
  };

  return (
    <div
      className={`col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8 ${className}`}
    >
      <div className="mb-3 justify-between gap-4 sm:flex">
        <div>
          <h5 className="font-semibold text-xl text-black dark:text-white">
            {chartTitle}
          </h5>
        </div>
      </div>

      <div className="-mx-8">
        <Chart
          options={options}
          series={chartData}
          type="area"
          height={350}
          width="100%"
        />
      </div>
    </div>
  );
}