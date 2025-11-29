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
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "completed", label: "Completed" },
];

interface OrderDetailsClientProps {
  id: string;
}

export function OrderDetailsClient({ id }: OrderDetailsClientProps) { // Component renamed to OrderDetailsClient
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/orders/${id}`);
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

  const handleStatusChange = async (newStatus: string) => {
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

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName={`Order #${order.id.slice(0, 8)}`} />

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        {/* Order Summary */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">Order Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><strong>Order ID:</strong> #{order.id.slice(0, 8)}</p>
              <p><strong>Order Date:</strong> {dayjs(order.createdAt).format("DD/MM/YYYY HH:mm")}</p>
              <p><strong>Current Status:</strong> 
                <span className={`rounded px-2 py-1 text-xs font-medium border ml-2 ${
                    order.status === 'delivered' || order.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-yellow-100 text-yellow-800 border-yellow-200'
                }`}>
                  {order.status}
                </span>
              </p>
              <p><strong>Grand Total:</strong> ${order.grandTotal.toLocaleString()}</p>
              <p><strong>Discount Amount:</strong> ${order.discountAmount.toLocaleString()}</p>
              <p><strong>Shipping Fee:</strong> ${order.shippingFee.toLocaleString()}</p>
              <p><strong>Tax:</strong> ${order.tax.toLocaleString()}</p>
              <p><strong>Subtotal:</strong> ${order.subtotal.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Update Status:</h4>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded px-3 py-2 border border-stroke dark:border-dark-3 dark:bg-gray-dark"
              >
                {ORDER_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <hr className="my-8 border-stroke dark:border-dark-3" />

        {/* User Information */}
        {order.user && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">Customer Information</h3>
            <p><strong>Name:</strong> {order.user.name}</p>
            <p><strong>Email:</strong> {order.user.email}</p>
            <p><strong>User ID:</strong> {order.user.id.slice(0, 8)}</p>
          </div>
        )}

        <hr className="my-8 border-stroke dark:border-dark-3" />

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">Shipping Address</h3>
            <p><strong>Recipient:</strong> {order.shippingAddress.fullName}</p>
            <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
            <p><strong>Address:</strong> {order.shippingAddress.addressLine1} {order.shippingAddress.addressLine2 ? `, ${order.shippingAddress.addressLine2}` : ''}</p>
            <p><strong>Ward:</strong> {order.shippingAddress.ward}</p>
            <p><strong>City:</strong> {order.shippingAddress.city}</p>
            <p><strong>Country:</strong> {order.shippingAddress.country}</p>
            <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
          </div>
        )}

        <hr className="my-8 border-stroke dark:border-dark-3" />

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">Order Items</h3>
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
                  {order.items.map((item) => (
                    <TableRow key={item.id} className="border-[#eee] dark:border-dark-3">
                      <TableCell>{item.productName}</TableCell>
                      <TableCell>${item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.subTotal.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        <hr className="my-8 border-stroke dark:border-dark-3" />

        {/* Order Status History */}
        {order.statusHistory && order.statusHistory.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-dark dark:text-white mb-4">Status History</h3>
            <ul>
              {order.statusHistory
                .sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix())
                .map((history, index) => (
                  <li key={history.id || index} className="mb-2">
                    <span className="font-medium">{dayjs(history.createdAt).format("DD/MM/YYYY HH:mm")}</span>: {history.status}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}