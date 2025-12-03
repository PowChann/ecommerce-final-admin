"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/services/api";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import Image from "next/image";

interface Review {
  id: string;
  productId: string; // Needed for fetching image
  productName: string;
  productImage?: string;
  authorName: string;
  comment: string;
  userRating: number;
  createdAt: string;
  updatedAt: string;
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
  // Cache for product images to avoid redundant API calls
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  const fetchImagesForProducts = useCallback(async (productIds: string[]) => {
    const newImages: Record<string, string> = {};
    
    await Promise.allSettled(productIds.map(async (id) => {
      try {
        const res = await api.get(`/products/${id}`);
        const product = res.data?.data || res.data; // Handle potential data wrapping
        if (product && product.images && product.images.length > 0) {
          newImages[id] = product.images[0];
        }
      } catch (err) {
        console.error(`Failed to fetch image for product ${id}`, err);
      }
    }));

    setImageCache(prev => ({ ...prev, ...newImages }));
  }, []);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/reviews/admin/all", {
        params: {
          page,
          limit: 10,
          sort: "createdAt",
          order: "desc",
        },
      });
      
      if (response.data && Array.isArray(response.data.data)) {
         const fetchedReviews: Review[] = response.data.data;
         setReviews(fetchedReviews);
         setTotalPages(response.data.pagination?.totalPages || 1);

         // Extract product IDs that need images and aren't in cache
         const productIdsToFetch = Array.from(new Set(fetchedReviews
            .map(r => r.productId)
            .filter(id => id && !imageCache[id])
         ));

         if (productIdsToFetch.length > 0) {
           fetchImagesForProducts(productIdsToFetch);
         }

      } else {
         setReviews([]);
         setTotalPages(1);
      }
    } catch (error: any) {
      console.error("Failed to fetch reviews", error);
      toast.error(error.response?.data?.message || "Failed to fetch reviews.");
      setReviews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, imageCache, fetchImagesForProducts]); // Add imageCache as dependency to useCallback.

  useEffect(() => {
    fetchReviews();
  }, [page, fetchReviews]);

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
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead>Image</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && reviews.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : reviews.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={7} className="text-center py-10">No Reviews Found</TableCell>
                </TableRow>
              ) : (
                reviews.map((review) => {
                  const imgUrl = review.productImage || imageCache[review.productId];
                  return (
                  <TableRow key={review.id} className="border-[#eee] dark:border-dark-3">
                    <TableCell>
                      <div className="h-12 w-12 relative rounded overflow-hidden bg-gray-100">
                         {imgUrl ? (
                            <Image 
                              src={imgUrl} 
                              alt={review.productName} 
                              fill 
                              className="object-cover" 
                            />
                         ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs text-gray-500">No img</span>
                         )}
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      {review.productName || "Unknown Product"}
                    </TableCell>
                    <TableCell>
                      {review.authorName || "Anonymous"}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1">
                        {review.userRating} <span className="text-yellow-500">★</span>
                      </span>
                    </TableCell>
                    <TableCell className="min-w-[200px] max-w-[300px] truncate" title={review.comment}>
                      {review.comment}
                    </TableCell>
                    <TableCell>{dayjs(review.createdAt).format("MMM DD, YYYY")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-x-3.5">
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
                  );
                })
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
