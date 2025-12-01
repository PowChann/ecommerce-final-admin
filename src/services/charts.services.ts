import api from "./api";
import { cookies } from "next/headers"; // Import cookies

export async function getUsersChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/users-chart", { // Added /dashboard prefix
      params: { timeFrame },
      headers: { Cookie: cookieStore.toString() }, // Forward cookies
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch user chart data:", error);
    return { totalUsers: [], newUsers: [] }; // Return empty structure on error
  }
}

export async function getOrdersChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/orders-chart", { // Added /dashboard prefix
      params: { timeFrame },
      headers: { Cookie: cookieStore.toString() }, // Forward cookies
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch orders chart data:", error);
    return { totalOrders: [], newOrders: [], productsSold: [] };
  }
}

export async function getRevenueChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/revenue-chart", { // Added /dashboard prefix
      params: { timeFrame },
      headers: { Cookie: cookieStore.toString() }, // Forward cookies
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch revenue chart data:", error);
    return { revenue: [] };
  }
}

export async function getProfitChartData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/profit-chart", { // Added /dashboard prefix
      params: { timeFrame },
      headers: { Cookie: cookieStore.toString() }, // Forward cookies
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch profit chart data:", error);
    return { profit: [] };
  }
}

export async function getProductsSoldByTypeData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/products-by-type-chart", { // Added /dashboard prefix
      params: { timeFrame },
      headers: { Cookie: cookieStore.toString() }, // Forward cookies
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch products by type data:", error);
    return {};
  }
}


export async function getPaymentsOverviewData(
  timeFrame?: "monthly" | "yearly" | (string & {}),
) {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/payments-overview", { // Added /dashboard prefix
      params: { timeFrame },
      headers: { Cookie: cookieStore.toString() }, // Forward cookies
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch payments overview data:", error);
    return { received: [], due: [] };
  }
}

export async function getWeeksProfitData(timeFrame?: string) {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/weeks-profit", { // Added /dashboard prefix
      params: { timeFrame },
      headers: { Cookie: cookieStore.toString() }, // Forward cookies
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch weeks profit data:", error);
    return { revenue: [], sales: [] };
  }
}