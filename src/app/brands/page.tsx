"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
// Bỏ import InputGroup vì ta sẽ dùng input thường
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getBrandsApi,
  createBrandApi,
  updateBrandApi,
  deleteBrandApi,
  Brand,
  Pagination,
} from "@/services/brand/api"; // Đảm bảo đường dẫn đúng

import { useEffect, useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { format } from "date-fns";

// --- 1. COMPONENT MODAL TỰ VIẾT (Tái sử dụng) ---
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

const brandSchema = z.object({
  name: z.string().min(3, "Brand name must be at least 3 characters long"),
});

type BrandFormData = z.infer<typeof brandSchema>;

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
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
  } = useForm<BrandFormData>({
    resolver: zodResolver(brandSchema),
    defaultValues: { name: "" },
  });

  const fetchBrands = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getBrandsApi(page, 10);
      setBrands(response.data || []);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Failed to fetch brands", error);
      toast.error(error.message || "Failed to fetch brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const onSubmit = async (data: BrandFormData) => {
    try {
      if (editingId) {
        await updateBrandApi(editingId, data);
        toast.success("Brand updated successfully!");
      } else {
        await createBrandApi(data);
        toast.success("Brand created successfully!");
      }
      handleCloseFormModal();
      fetchBrands(pagination?.page || 1);
    } catch (error: any) {
      console.error("Failed to save brand", error);
      toast.error(error.message || "Failed to save brand.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteBrandApi(deleteId);
      toast.success("Brand deleted successfully!");
      fetchBrands(1);
    } catch (error: any) {
      console.error("Failed to delete brand", error);
      toast.error(error.message || "Failed to delete brand.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    reset({ name: "" });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setValue("name", brand.name);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingId(null);
    reset({ name: "" });
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
      fetchBrands(newPage);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Brands" />

      {/* Header & Create Button */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Brand Management
        </h2>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add New Brand
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-4 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : brands.length > 0 ? (
                  brands.map((brand) => (
                    <TableRow key={brand.id}>
                      <TableCell className="font-medium">
                        {brand.name}
                      </TableCell>
                      <TableCell>{formatDate(brand.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleOpenEdit(brand)}
                          className="mr-3 text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenDelete(brand.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No brands found.
                    </TableCell>
                  </TableRow>
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
        title={editingId ? "Edit Brand" : "Add New Brand"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            {/* Thay thế InputGroup bằng Input thường */}
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Brand Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter brand name"
              {...register("name")}
              className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
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
            permanently delete this brand.
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
