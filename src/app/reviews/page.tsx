"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import InputGroup from "@/components/form-elements/InputGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/services/api";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { ProductVariant } from "@/types/backend"; // Assuming ProductVariant is defined here or will be

// Định nghĩa lại interface Review đầy đủ dựa trên thông tin API
interface Review {
  id: string;
  productVariantId: string;
  userId: string | null;
  userName: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  productVariant?: ProductVariant & { product?: { id: string; name: string } }; // Thêm thông tin product
  user?: { id: string; email: string; name?: string };
}

// Placeholder Icon
const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M13.75 2H11.25L10.5 1H7.5L6.75 2H4.25V4H13.75V2ZM5 15C5 15.55 5.45 16 6 16H12C12.55 16 13 15.55 13 15V5H5V15Z" />
  </svg>
);


export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProductVariantId, setFilterProductVariantId] = useState("");
  const [filterUserId, setFilterUserId] = useState("");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/reviews/admin/all", {
        params: {
          page,
          limit: 10,
          search: searchTerm,
          productVariantId: filterProductVariantId,
          userId: filterUserId,
          sort: "createdAt",
          order: "desc",
        },
      });
      
      if (response.data && Array.isArray(response.data.data)) {
         setReviews(response.data.data);
         setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
         setReviews([]);
         setTotalPages(1);
         toast.error("Invalid API response format for reviews.");
      }
    } catch (error: any) {
      console.error("Failed to fetch reviews", error);
      toast.error(error.response?.data?.message || "Failed to fetch reviews.");
      setReviews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [page, searchTerm, filterProductVariantId, filterUserId]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/reviews/admin/${id}`);
      toast.success("Review deleted successfully!");
      fetchReviews(); // Refresh list
    } catch (error: any) {
      console.error("Failed to delete review", error);
      toast.error(error.response?.data?.message || "Failed to delete review.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Reviews" />

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:justify-between">
          <InputGroup
            label="Search Comment"
            type="text"
            placeholder="Search by comment"
            value={searchTerm}
            handleChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-1/3"
          />
          {/* Add more filter inputs here (e.g., for productVariantId, userId) */}
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead>Product Variant</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={5} className="text-center py-10">No Reviews Found</TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => (
                  <TableRow key={review.id} className="border-[#eee] dark:border-dark-3">
                    <TableCell className="min-w-[150px]">
                      {review.productVariant?.product?.name || review.productVariant?.sku || review.productVariantId.slice(0,8)}
                    </TableCell>
                    <TableCell>
                      {review.user?.name || review.user?.email || review.userName || review.userId?.slice(0,8) || "Anonymous"}
                    </TableCell>
                    <TableCell className="min-w-[200px]">{review.comment}</TableCell>
                    <TableCell>{dayjs(review.createdAt).format("MMM DD, YYYY HH:mm")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-x-3.5">
                        {/* No Edit/Approve/Reject actions as per API */}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="hover:text-red-500"
                        >
                          <span className="sr-only">Delete</span>
                          <TrashIcon />
                        </button>
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
