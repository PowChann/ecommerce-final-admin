"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes"; // Import useTheme

type PropsType = {
  data: {
    sales: { x: string; y: number }[];
    revenue: { x: string; y: number }[];
  };
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function WeeksProfitChart({ data }: PropsType) {
  const { theme } = useTheme(); // Get current theme

  const options: ApexOptions = {
    theme: {
      mode: theme === 'dark' ? 'dark' : 'light', // Set theme dynamically
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      type: "bar",
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      fontFamily: "inherit",
    },

    responsive: [
      {
        breakpoint: 1536,
        options: {
          plotOptions: {
            bar: {
              borderRadius: 3,
              columnWidth: "25%",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 3,
        columnWidth: "25%",
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    dataLabels: {
      enabled: false,
    },

    grid: {
      strokeDashArray: 5,
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

    yaxis: {
      labels: {
        formatter: (value) => {
          if (typeof value === "number") return value.toLocaleString('vi-VN');
          return String(value);
        },
        style: {
          colors: theme === 'dark' ? '#fff' : '#616161', // Adjust Y-axis label color for theme
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          if (typeof val === "number") return val.toLocaleString('vi-VN');
          return String(val);
        }
      }
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
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontFamily: "inherit",
      fontWeight: 500,
      fontSize: "14px",
      markers: {
        size: 9,
        shape: "circle",
      },
      labels: {
        colors: theme === 'dark' ? '#fff' : '#333', // Adjust legend color for theme
      },
    },
    fill: {
      opacity: 1,
    },
  };
  return (
    <div className="-ml-3.5 mt-3">
      <Chart
        options={options}
        series={[
          {
            name: "Sales",
            data: data.sales,
          },
          {
            name: "Revenue",
            data: data.revenue,
          },
        ]}
        type="bar"
        height={370}
      />
    </div>
  );
}
