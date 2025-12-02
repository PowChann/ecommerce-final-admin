"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { PeriodPicker } from "@/components/period-picker";
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
import { useEffect, useState, Suspense } from "react"; // Import Suspense
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { extractTimeFrame, getDateRangeFromTimeFrame } from "@/lib/timeframe-extractor";

import { TrashIcon, EyeIcon } from "@/assets/icons"; // Import TrashIcon and EyeIcon


const ORDER_STATUSES = [
  { value: "pending", label: "pending" },
  { value: "confirmed", label: "confirmed" },
  { value: "shipping", label: "shipping" },
  { value: "completed", label: "completed" }, // Changed from delivered to completed
  { value: "cancelled", label: "cancelled" },
];

function OrdersContent() {
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
         const fetchedOrders = response.data.data;
         setOrders(fetchedOrders);
         setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
         setOrders([]);
         setTotalPages(1);
      }
    } catch (error: any) {
      console.error("Failed to fetch orders", error);
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedTimeFrame]); 

  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      const response = await api.put(`/orders/admin/${id}`, { status: newStatus });
      toast.success("Order status updated successfully!");
      fetchOrders(); // Refresh the list from the server
    } catch (error: any) {
      console.error("Failed to update status", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    try {
      await api.delete(`/orders/admin/${id}`); // Assuming admin delete endpoint
      toast.success("Order deleted successfully!");
      fetchOrders(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to delete order", error);
      toast.error(error.response?.data?.message || "Failed to delete order.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Orders" />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Order Management
        </h2>
        <PeriodPicker />
      </div>

      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="p-4">
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
                        {order.user?.name || order.user?.email || order.userId.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                        {dayjs(order.createdAt).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell>{order.grandTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                    <TableCell>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                        className={`rounded px-2 py-1 text-xs font-medium border ${
                            order.status.toLowerCase() === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                            order.status.toLowerCase() === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                            order.status.toLowerCase() === 'shipping' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            order.status.toLowerCase() === 'confirmed' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}
                      >
                        {ORDER_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label.charAt(0).toUpperCase() + s.label.slice(1)}</option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-x-3.5">
                        <Link href={`/orders/${order.id}`} className="hover:text-primary" title="View Details">
                          <EyeIcon />
                        </Link>
                        <button onClick={() => handleDelete(order.id)} className="hover:text-red-500" title="Delete Order">
                          <TrashIcon /> {/* Assumed TrashIcon exists from previous context */}
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
                      </Table>
          
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="mt-2 flex items-center justify-end gap-4 border-t border-stroke py-4 dark:border-dark-3">
                          <span className="text-sm text-gray-700 dark:text-gray-400">
                            Page {page} of {totalPages}
                          </span>
                          <div className="flex gap-2">
                            <button
                              disabled={page <= 1}
                              onClick={() => setPage((p) => p - 1)}
                              className="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-dark-2"
                            >
                              Prev
                            </button>
                            <button
                              disabled={page >= totalPages}
                              onClick={() => setPage((p) => p + 1)}
                              className="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-dark-2"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="p-4">Loading orders...</div>}>
      <OrdersContent />
    </Suspense>
  );
}
