"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes"; // Import useTheme

type PropsType = {
  data: {
    received: { x: unknown; y: number }[];
    due: { x: unknown; y: number }[];
  };
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function PaymentsOverviewChart({ data }: PropsType) {
  const isMobile = useIsMobile();
  const { theme } = useTheme(); // Get current theme

  const options: ApexOptions = {
    theme: {
      mode: theme === 'dark' ? 'dark' : 'light', // Set theme dynamically
    },
    legend: {
      show: false,
      labels: {
        colors: theme === 'dark' ? '#fff' : '#333', // Adjust legend color for theme
      },
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
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
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          if (typeof value === "number") return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          return String(value);
        },
        style: {
          colors: theme === 'dark' ? '#fff' : '#616161', // Adjust Y-axis label color for theme
        },
      },
    },
    tooltip: {
      marker: {
        show: true,
      },
      y: {
        formatter: function (value) {
          if (typeof value === "number") return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
          return String(value);
        },
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: theme === 'dark' ? '#fff' : '#616161', // Adjust X-axis label color for theme
        },
      },
    },
  };

  return (
    <div className="-ml-4 -mr-5 h-[310px]">
      <Chart
        options={options}
        series={[
          {
            name: "Received",
            data: data.received,
          },
          {
            name: "Due",
            data: data.due,
          },
        ]}
        type="area"
        height={310}
      />
    </div>
  );
}
