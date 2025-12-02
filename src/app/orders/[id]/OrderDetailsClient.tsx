"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import api from "@/services/api";
import { Order, OrderItem, User, Product } from "@/types/backend";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ORDER_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "shipping", label: "Shipping" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrderDetailsClientProps {
  id: string;
}

// Helper to get status badge classes
const getStatusBadgeClasses = (status: Order['status'] | undefined | string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'shipping':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'confirmed':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getPaymentStatusBadgeClasses = (status: Order['paymentStatus'] | undefined | string) => {
  switch (status?.toLowerCase()) {
    case 'paid':
      return 'bg-green-100 text-green-700';
    case 'unpaid':
      return 'bg-yellow-100 text-yellow-700';
    case 'failed':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};


export function OrderDetailsClient({ id }: OrderDetailsClientProps) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/admin/${id}`);
        if (response.data && response.data.data) {
          setOrder(response.data.data);
        } else {
          toast.error("Order not found or invalid response.");
          router.push("/orders");
        }
      } catch (error: any) {
        console.error("Failed to fetch order details", error);
        toast.error(error.response?.data?.message || "Failed to load order details.");
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id, router]);

  const handleStatusChange = async (newStatus: Order['status']) => {
    if (!order) return;
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    try {
      const response = await api.put(`/orders/admin/${order.id}`, { status: newStatus });
      toast.success("Order status updated successfully!");
      setOrder(response.data.data); // Update order with new data from backend
    } catch (error: any) {
      console.error("Failed to update status", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Order Details" />
        <div className="flex justify-center items-center h-64">
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Order Details" />
        <div className="flex justify-center items-center h-64">
          <p>Order not found.</p>
        </div>
      </div>
    );
  }

  // Safe access after null check
  const safeOrder = order;

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName={`Order #${safeOrder.id.slice(0, 8)}`} />

      <div className="flex flex-col gap-6">

        {/* Order Summary Card */}
        <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">Order Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
            {/* Left Column */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Order ID: <span className="text-dark dark:text-white font-semibold">#{safeOrder.id.slice(0, 8)}</span></p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Order Date: <span className="text-dark dark:text-white">{dayjs(safeOrder.createdAt).format("DD/MM/YYYY HH:mm")}</span></p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Status: 
                <span className={`ml-2 rounded px-2 py-0.5 text-xs font-medium border ${getStatusBadgeClasses(safeOrder.status)}`}>
                  {safeOrder.status.charAt(0).toUpperCase() + safeOrder.status.slice(1)}
                </span>
              </p>
              <div className="mt-2">
                <h4 className="font-medium text-dark dark:text-white mb-1">Update Status:</h4>
                <select
                  value={safeOrder.status}
                  onChange={(e) => handleStatusChange(e.target.value as Order['status'])}
                  className="rounded px-3 py-2 border border-stroke dark:border-dark-3 dark:bg-gray-dark text-dark dark:text-white"
                >
                  {ORDER_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Middle Column */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Method: <span className="text-dark dark:text-white">{safeOrder.payment?.method || safeOrder.paymentMethod || "N/A"}</span></p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Status: 
                 <span className={`ml-2 rounded px-2 py-0.5 text-xs font-medium ${getPaymentStatusBadgeClasses(safeOrder.payment?.status || safeOrder.paymentStatus)}`}>
                    {safeOrder.payment?.status || safeOrder.paymentStatus || "Unknown"}
                 </span>
              </p>
              {safeOrder.couponCode && (
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Coupon Code: <span className="text-dark dark:text-white font-semibold">{safeOrder.couponCode}</span></p>
              )}
              {safeOrder.discount?.code && (
                 <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Discount Code: <span className="text-dark dark:text-white font-semibold">{safeOrder.discount.code}</span></p>
              )}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-2 md:col-span-2 lg:col-span-1 border-t md:border-t-0 md:pt-4 lg:pt-0 pt-4 border-dashed border-stroke dark:border-dark-3 md:pl-8 lg:pl-0">
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Subtotal: <span className="text-dark dark:text-white font-semibold">{safeOrder.subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Shipping Fee: <span className="text-dark dark:text-white font-semibold">{safeOrder.shippingFee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Tax: <span className="text-dark dark:text-white font-semibold">{safeOrder.tax.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
              <p className="text-base font-medium text-gray-600 dark:text-gray-400">Discount: <span className="text-red-500 font-semibold">- {safeOrder.discountAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
              <hr className="my-2 border-dashed border-stroke dark:border-dark-3" />
              <p className="text-lg font-bold text-dark dark:text-white">Grand Total: <span className="text-primary">{safeOrder.grandTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
              {safeOrder.pointUsed ? <p className="text-sm text-gray-600 dark:text-gray-400">Points Used: <span className="text-dark dark:text-white">{safeOrder.pointUsed}</span></p> : null}
              {safeOrder.pointEarned ? <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned: <span className="text-dark dark:text-white">{safeOrder.pointEarned}</span></p> : null}
            </div>
          </div>
        </div>

        {/* Customer & Shipping Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          {safeOrder.user && (
            <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">Customer Information</h3>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Name: <span className="text-dark dark:text-white">{safeOrder.user.name}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email: <span className="text-dark dark:text-white">{safeOrder.user.email}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">User ID: <span className="text-dark dark:text-white">{safeOrder.user.id?.slice(0, 8)}</span></p>
              </div>
            </div>
          )}

          {/* Shipping Address */}
          {safeOrder.shippingAddress && (
            <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
              <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">Shipping Address</h3>
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recipient: <span className="text-dark dark:text-white">{safeOrder.shippingAddress.fullName}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone: <span className="text-dark dark:text-white">{safeOrder.shippingAddress.phone}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Address: <span className="text-dark dark:text-white">{safeOrder.shippingAddress.addressLine1} {safeOrder.shippingAddress.addressLine2 ? `, ${safeOrder.shippingAddress.addressLine2}` : ''}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ward: <span className="text-dark dark:text-white">{safeOrder.shippingAddress.ward}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">City: <span className="text-dark dark:text-white">{safeOrder.shippingAddress.city}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Country: <span className="text-dark dark:text-white">{safeOrder.shippingAddress.country}</span></p>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Postal Code: <span className="text-dark dark:text-white">{safeOrder.shippingAddress.postalCode}</span></p>
              </div>
            </div>
          )}
        </div>

        {/* Order Items Card */}
        {safeOrder.items && safeOrder.items.length > 0 && (
          <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">Order Items</h3>
            <div className="max-w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                    <TableHead>Product Name</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {safeOrder.items.map((item) => (
                    <TableRow key={item.id} className="border-[#eee] dark:border-dark-3">
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>{item.unitPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.subTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Order Status History Card */}
        {safeOrder.statusHistory && safeOrder.statusHistory.length > 0 && (
          <div className="rounded-[10px] border border-stroke bg-white p-6 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <h3 className="text-xl font-semibold text-dark dark:text-white mb-6">Status History</h3>
            <ul className="max-w-full overflow-x-auto">
              {safeOrder.statusHistory
                .sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix()) // Sắp xếp mới nhất lên trên (desc)
                .map((history, index) => (
                  <li key={history.id || index} className="mb-2 flex flex-wrap items-center gap-2 border-b border-dashed border-stroke dark:border-dark-3 pb-2 last:pb-0 last:border-none">
                    <span className="min-w-[160px] text-sm text-gray-500 dark:text-gray-400 font-medium">{dayjs(history.createdAt).format("DD/MM/YYYY HH:mm")}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadgeClasses(history.status)}`}>
                      {history.status}
                    </span>
                    {history.updatedByUser && (
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">by {history.updatedByUser.name || history.updatedByUser.email}</span>
                    )}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}