import api from "@/services/api";
import { cookies } from "next/headers";

// --- Types Definitions ---

export interface OverviewData {
  revenue: { value: number; growthRate: number };
  totalUsers: { value: number; growthRate: number };
  newUsers: { value: number; growthRate: number };
  totalOrders: { value: number; growthRate: number };
  topSellingProduct: { name: string; value: number; growthRate: number };
}

export interface RecentOrder {
  orderId: string;
  customerName: string;
  totalAmount: number;
  status: string;
  orderDate: string;
}

export interface LowStockProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
}

// --- API Functions ---

export async function getOverviewData(): Promise<OverviewData> {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/overview", {
      headers: { Cookie: cookieStore.toString() },
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch overview data:", error);
    // Return fallback data to prevent crash
    return {
      revenue: { value: 0, growthRate: 0 },
      totalUsers: { value: 0, growthRate: 0 },
      newUsers: { value: 0, growthRate: 0 },
      totalOrders: { value: 0, growthRate: 0 },
      topSellingProduct: { name: "N/A", value: 0, growthRate: 0 },
    };
  }
}

// --- Helper Interfaces for API Responses ---

interface RawRecentOrder {
  id: string;
  user?: string | { name: string }; // Handle potential variations in API response
  grandTotal: number | string;
  status: string;
  createdAt: string;
}

interface RawLowStockProduct {
  id: string;
  name: string;
  category?: string | { name: string };
  price: number | string;
  stock: number | string;
  images?: string[];
}

export async function getRecentOrdersData(): Promise<RecentOrder[]> {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/recent-orders", {
      headers: { Cookie: cookieStore.toString() },
    });
    
    const orders = (Array.isArray(res.data.data) ? res.data.data : []) as RawRecentOrder[];
    
    return orders.map((order) => {
      let customerName = "Unknown";
      if (typeof order.user === "string") {
        customerName = order.user;
      } else if (order.user && typeof order.user === "object" && "name" in order.user) {
        customerName = order.user.name;
      }

      return {
        orderId: order.id,
        customerName,
        totalAmount: Number(order.grandTotal),
        status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown",
        orderDate: order.createdAt,
      };
    });
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return [];
  }
}

export async function getLowStockProductsData(): Promise<LowStockProduct[]> {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/low-stock-products", {
      headers: { Cookie: cookieStore.toString() },
    });
    
    const products = (Array.isArray(res.data.data) ? res.data.data : []) as RawLowStockProduct[];
    
    return products.map((p) => {
      let category = "Uncategorized";
      if (typeof p.category === "string") {
        category = p.category;
      } else if (p.category && typeof p.category === "object" && "name" in p.category) {
        category = p.category.name;
      }

      return {
        id: p.id,
        name: p.name,
        category,
        price: Number(p.price),
        stock: Number(p.stock),
        image: p.images && p.images.length > 0 ? p.images[0] : "",
      };
    });
  } catch (error) {
    console.error("Failed to fetch low stock products:", error);
    return [];
  }
}
