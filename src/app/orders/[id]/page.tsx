"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import api from "@/services/api";
import { Order } from "@/types/backend";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false); // Changed default to false

  /*
  // TEMPORARILY DISABLED: Fetching specific order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const response = await api.get(`/orders/admin/${id}`); // Adjust endpoint if needed (e.g., /orders/:id)
        // Check if backend returns { data: ... } or just ...
        const data = response.data.data || response.data;
        setOrder(data);
      } catch (error) {
        console.error("Failed to fetch order details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);
  */

  /*
  if (loading) return <div className="p-10">Loading...</div>;
  if (!order) return <div className="p-10">Order not found</div>;
  */

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Order Details (Disabled)" />

      <div className="rounded-md bg-yellow-50 p-4 text-yellow-800 mb-6 border border-yellow-200">
        Chức năng xem chi tiết đơn hàng đang được tạm khóa để phát triển.
      </div>

      {/* Content hidden/disabled */}
      <div className="opacity-50 pointer-events-none hidden">
      {/* 
      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-title-md2 font-semibold text-black dark:text-white">
              Order #{order?.id.slice(0, 8)}
            </h2>
            <p className="text-sm font-medium text-black dark:text-white">
              Placed on {dayjs(order?.createdAt).format("MMM DD, YYYY h:mm A")}
            </p>
          </div>
          <div className={`inline-flex rounded px-3 py-1 text-sm font-medium ${
             order?.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
             {order?.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
           <div className="rounded border border-stroke p-4 dark:border-dark-3">
               <h3 className="mb-2 font-semibold text-black dark:text-white">Customer</h3>
               <p>Name: {order?.user?.name || "Guest"}</p>
               <p>Email: {order?.user?.email || "N/A"}</p>
               <p>Shipping Address: {order?.shippingAddress || "N/A"}</p>
           </div>
           
            <div className="rounded border border-stroke p-4 dark:border-dark-3">
               <h3 className="mb-2 font-semibold text-black dark:text-white">Summary</h3>
               <p className="flex justify-between"><span>Subtotal:</span> <span>${order?.grandTotal}</span></p>
               <p className="flex justify-between font-bold text-lg mt-2"><span>Total:</span> <span>${order?.grandTotal}</span></p>
           </div>
        </div>

        <div className="mt-6">
             <h3 className="mb-4 font-semibold text-black dark:text-white">Order Items</h3>
             <div className="rounded border border-stroke dark:border-dark-3">
                <div className="grid grid-cols-4 border-b border-stroke bg-gray-50 p-3 font-medium dark:border-dark-3 dark:bg-gray-800">
                    <div className="col-span-2">Product</div>
                    <div className="text-right">Qty</div>
                    <div className="text-right">Total</div>
                </div>
                {order?.items?.map((item, idx) => (
                    <div key={idx} className="grid grid-cols-4 border-b border-stroke p-3 last:border-0 dark:border-dark-3">
                        <div className="col-span-2">
                            <p className="text-black dark:text-white">{item.product?.name || "Product"}</p>
                            <p className="text-sm text-gray-500">${item.price}</p>
                        </div>
                         <div className="text-right">{item.quantity}</div>
                         <div className="text-right">${item.price * item.quantity}</div>
                    </div>
                ))}
             </div>
        </div>

      </div>
      */}
      </div>
    </div>
  );
}
