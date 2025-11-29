"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { Select } from "@/components/form-elements/select";
import { PeriodPicker } from "@/components/period-picker"; // Import PeriodPicker
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/services/api";
import { Order } from "@/types/backend";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast"; // Import toast
import { useSearchParams } from "next/navigation"; // Import useSearchParams
import { extractTimeFrame, getDateRangeFromTimeFrame } from "@/lib/timeframe-extractor"; // Import date range utilities

// Placeholder Icon
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M9 3.375C5.25 3.375 2.0475 5.7075 0.75 9C2.0475 12.2925 5.25 14.625 9 14.625C12.75 14.625 15.9525 12.2925 17.25 9C15.9525 5.7075 12.75 3.375 9 3.375ZM9 12.75C6.93 12.75 5.25 11.07 5.25 9C5.25 6.93 6.93 5.25 9 5.25C11.07 12.75 11.07 12.75 9 12.75ZM9 6.75C7.755 6.75 6.75 7.755 6.75 9C6.75 10.245 7.755 11.25 9 11.25C10.245 11.25 11.25 10.245 11.25 9C11.25 7.755 10.245 6.75 9 6.75Z" />
  </svg>
);

const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const selectedTimeFrame = extractTimeFrame(searchParams.get("selected_time_frame") || undefined);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRangeFromTimeFrame(selectedTimeFrame);

      const response = await api.get("/orders/admin/all", {
        params: {
          page,
          limit: 20,
          sort: "createdAt",
          order: "desc",
          startDate,
          endDate,
        },
      });
      
      if (response.data && Array.isArray(response.data.data)) {
         setOrders(response.data.data);
         setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
         setOrders([]);
         setTotalPages(1);
         toast.error("Invalid API response format for orders.");
      }
    } catch (error: any) {
      console.error("Failed to fetch orders", error);
      toast.error(error.response?.data?.message || "Failed to fetch orders.");
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, selectedTimeFrame]); // Re-fetch orders when page or time frame changes

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      const response = await api.put(`/orders/admin/${id}`, { status: newStatus });
      toast.success("Order status updated successfully!");
      // Optimistic update
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus as any, statusHistory: response.data.data.statusHistory } : o));
    } catch (error: any) {
      console.error("Failed to update status", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
        <Breadcrumb pageName="Orders" />
        <PeriodPicker />
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center py-10">No Orders Found</TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.id} className="border-[#eee] dark:border-dark-3">
                    <TableCell className="font-medium">
                        #{order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                        {order.user?.email || order.user?.name || order.userId.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                        {dayjs(order.createdAt).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell>${order.grandTotal.toLocaleString()}</TableCell>
                    <TableCell>
                      {/* Inline Status Changer */}
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`rounded px-2 py-1 text-xs font-medium border ${
                            order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-x-3.5">
                        <Link href={`/orders/${order.id}`} className="hover:text-primary" title="View Details">
                          <EyeIcon />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}