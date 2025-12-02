"use client";

import dynamic from "next/dynamic";
import { type ApexOptions } from "apexcharts";
import { type PropsWithClassName } from "@/types/props";
import { useTheme } from "next-themes"; // Import useTheme

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartProps = PropsWithClassName & {
  chartTitle: string;
  series: { name: string; data: number[] }[];
  categories: (string | number)[];
};

export function ProductsByTypeChart({
  className,
  chartTitle,
  series,
  categories,
}: ChartProps) {
  const { theme } = useTheme(); // Get current theme

  const options: ApexOptions = {
    theme: {
      mode: theme === 'dark' ? 'dark' : 'light', // Set theme dynamically
    },
    chart: {
      type: "bar",
      height: 335,
      stacked: true,
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    colors: ["#3BA0FF", "#2CD673", "#FFB648"], // Example colors
    responsive: [
      {
        breakpoint: 1024,
        options: {
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 0,
        columnWidth: "25%",
        barHeight: "50%",
      },
    },
    xaxis: {
      type: "category",
      categories: categories,
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#616161', // Adjust X-axis label color for theme
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          if (typeof value === "number") return value.toLocaleString('vi-VN');
          return String(value);
        },
        style: {
          colors: theme === 'dark' ? '#fff' : '#616161', // Adjust Y-axis label color for theme
          fontSize: "12px",
        },
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      fontWeight: 500,
      fontSize: "14px",
      markers: {
        // radius: 99,
      },
      labels: {
        colors: theme === 'dark' ? '#fff' : '#333', // Adjust legend color for theme
      },
    },
    fill: {
      opacity: 1,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          if (typeof val === "number") return val.toLocaleString('vi-VN');
          return String(val);
        },
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
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
          series={series}
          type="bar"
          height={350}
          width="100%"
        />
      </div>
    </div>
  );
}