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

import {
  getDiscountsApi,
  createDiscountApi,
  updateDiscountApi,
  deleteDiscountApi,
  Discount,
  Pagination,
} from "@/services/discount/api"; // Đảm bảo đường dẫn đúng

import { useEffect, useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// --- 1. COMPONENT MODAL TỰ VIẾT ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  width = "max-w-md",
}: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className={`w-full ${width} dark:border-strokedark dark:bg-boxdark rounded-lg border border-stroke bg-white shadow-default`}
      >
        {/* Header */}
        <div className="dark:border-strokedark flex items-center justify-between border-b border-stroke px-6 py-4">
          <h3 className="text-xl font-semibold text-black dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- 2. LOGIC CHÍNH ---

// --- SỬA LẠI ĐOẠN NÀY ---
const discountSchema = z.object({
  code: z
    .string()
    .min(1, "Code is required")
    .max(5, "Code must be at most 5 characters long"),
  
  // Thay preprocess bằng coerce.number()
  value: z.coerce
    .number({ error: "Value must be a number"})
    .positive("Value must be a positive number"),
    
  // Tương tự cho usageLimit
  usageLimit: z.coerce
    .number({ error: "Usage limit must be a number" })
    .int()
    .min(1, "Usage limit must be at least 1"),
});

// Các phần dưới giữ nguyên
type DiscountFormData = z.infer<typeof discountSchema>;

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      value: 0,
      usageLimit: 10,
    },
  });

  const fetchDiscounts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getDiscountsApi(page, 10);
      setDiscounts(response.data || []);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Failed to fetch discounts", error);
      toast.error(error.message || "Failed to fetch discounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const onSubmit = async (data: DiscountFormData) => {
    try {
      if (editingId) {
        await updateDiscountApi(editingId, data);
        toast.success("Discount updated successfully!");
      } else {
        await createDiscountApi(data);
        toast.success("Discount created successfully!");
      }
      handleCloseFormModal();
      fetchDiscounts(pagination?.page || 1);
    } catch (error: any) {
      console.error("Failed to save discount", error);
      toast.error(error.message || "Failed to save discount.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDiscountApi(deleteId);
      toast.success("Discount deleted successfully!");
      fetchDiscounts(1);
    } catch (error: any) {
      console.error("Failed to delete discount", error);
      toast.error(error.message || "Failed to delete discount.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  // --- Handlers ---
  const handleOpenCreate = () => {
    setEditingId(null);
    reset({ code: "", value: 0, usageLimit: 10 });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (discount: Discount) => {
    setEditingId(discount.id);
    setValue("code", discount.code);
    setValue("value", discount.value);
    setValue("usageLimit", discount.usageLimit);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingId(null);
    reset({ code: "", value: 0, usageLimit: 10 });
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
      fetchDiscounts(newPage);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Discounts" />

      {/* Header & Create Button */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Discount Management
        </h2>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add New Discount
        </button>
      </div>

      {/* List Section */}
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
                  <TableHead>Code</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage (Used/Limit)</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-4 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : discounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-4 text-center">
                      No active discounts
                    </TableCell>
                  </TableRow>
                ) : (
                  discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell className="font-bold text-primary">
                        {discount.code}
                      </TableCell>
                      <TableCell>{discount.value}</TableCell>
                      <TableCell>
                        {discount.timesUsed} / {discount.usageLimit}
                      </TableCell>
                      <TableCell>
                        {dayjs(discount.createdAt).format("DD/MM/YYYY")}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleOpenEdit(discount)}
                          className="mr-3 text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenDelete(discount.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-2 flex items-center justify-end gap-4 border-t border-stroke py-4 dark:border-dark-3">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-dark-2"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
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

      {/* --- FORM MODAL (Create/Edit) --- */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingId ? "Edit Discount" : "Create Discount"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            {/* Input Code */}
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Discount Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. SUMMER20"
                {...register("code")}
                className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Input Value */}
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Value <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 10"
                {...register("value")} // Zod preprocess will handle number conversion
                className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
              />
              {errors.value && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.value.message}
                </p>
              )}
            </div>

            {/* Input Usage Limit */}
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Usage Limit <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 100"
                {...register("usageLimit")}
                className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
              />
              {errors.usageLimit && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.usageLimit.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCloseFormModal}
              className="dark:border-strokedark rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90"
            >
              {editingId ? "Save Changes" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- CONFIRM DELETE MODAL --- */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Are you absolutely sure? This action cannot be undone and will
            permanently delete this discount code.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="dark:border-strokedark rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            className="rounded bg-red-500 px-6 py-2 font-medium text-white hover:bg-opacity-90"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
