"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Add Image import
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
import { Product } from "@/types/backend";
import { TrashIcon } from "@/assets/icons";
import toast from "react-hot-toast"; // Import toast

// Placeholder icon if Pencil doesn't exist in assets
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
     <path d="M13.75 3.01L14.99 4.25L4.49 14.75H3.25V13.51L13.75 3.01ZM13.75 0.5C13.41 0.5 13.07 0.63 12.81 0.89L11.37 2.33L15.66 6.62L17.10 5.18C17.63 4.65 17.63 3.8 17.10 3.27L14.72 0.89C14.46 0.63 14.12 0.5 13.75 0.5ZM10.66 3.04L2 11.7V16H6.3L14.96 7.34L10.66 3.04Z" />
  </svg>
);

// Placeholder for TrashIcon if import fails (usually imported as React Component)
const DeleteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
    <path d="M13.75 2H11.25L10.5 1H7.5L6.75 2H4.25V4H13.75V2ZM5 15C5 15.55 5.45 16 6 16H12C12.55 16 13 15.55 13 15V5H5V15Z" />
  </svg>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/products", {
        params: {
          page,
          limit: 10,
          sortBy: "createdAt",
          order: "desc",
        },
      });
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
        toast.error("Invalid API response format for products.");
      }
    } catch (error: any) {
      console.error("Failed to fetch products", error);
      toast.error(error.response?.data?.message || "Failed to fetch products.");
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted successfully!");
      fetchProducts(); // Refresh the list
    } catch (error: any) {
      console.error("Failed to delete product", error);
      toast.error(error.response?.data?.message || "Failed to delete product.");
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4">
        <Breadcrumb pageName="Products" />
        <Link
          href="/products/add"
          className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead>Image</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center py-10">No Products Found</TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product.id} className="border-[#eee] dark:border-dark-3">
                    <TableCell className="min-w-[80px]">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      ) : (
                        <div className="size-12 rounded bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Img</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="min-w-[150px]">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <h5 className="text-dark dark:text-white">{product.name}</h5>
                          <span className="text-sm text-gray-500">{product.id.slice(0,8)}...</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name || product.categoryId}</TableCell>
                    <TableCell>${product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.brand?.name || product.brandId}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-x-3.5">
                        <Link href={`/products/edit/${product.id}`} className="hover:text-primary">
                          <span className="sr-only">Edit</span>
                          <EditIcon />
                        </Link>
                        <button onClick={() => handleDelete(product.id)} className="hover:text-red-500">
                          <span className="sr-only">Delete</span>
                          <DeleteIcon />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Logic Placeholder */}
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