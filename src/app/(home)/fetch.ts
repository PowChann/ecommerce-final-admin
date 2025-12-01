import api from "@/services/api";
import { cookies } from "next/headers";

export async function getOverviewData() {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/overview", {
      headers: { Cookie: cookieStore.toString() },
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch overview data:", error);
    // Return fallback data or empty structure to prevent crash
    return {
      revenue: { value: 0, growthRate: 0 },
      totalUsers: { value: 0, growthRate: 0 },
      newUsers: { value: 0, growthRate: 0 },
      totalOrders: { value: 0, growthRate: 0 },
      topSellingProduct: { name: "N/A", value: 0, growthRate: 0 },
    };
  }
}

export async function getRecentOrdersData() {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/recent-orders", { // Use dedicated endpoint
      headers: { Cookie: cookieStore.toString() },
    });
    
    const orders = Array.isArray(res.data.data) ? res.data.data : [];
    
    return orders.map((order: any) => ({
      orderId: order.id,
      customerName: order.user || "Unknown", // Backend returns user name directly
      totalAmount: Number(order.grandTotal),
      status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Unknown",
      orderDate: order.createdAt,
    }));
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return [];
  }
}

export async function getLowStockProductsData() {
  try {
    const cookieStore = await cookies();
    const res = await api.get("/dashboard/low-stock-products", { // Use dedicated endpoint
      headers: { Cookie: cookieStore.toString() },
    });
    
    const products = Array.isArray(res.data.data) ? res.data.data : [];
    
    return products.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category || "Uncategorized", // Backend returns category name directly
      price: Number(p.price),
      stock: Number(p.stock),
      image: p.images && p.images.length > 0 ? p.images[0] : "",
    }));
  } catch (error) {
    console.error("Failed to fetch low stock products:", error);
    return [];
  }
}