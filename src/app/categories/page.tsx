"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { ImageUpload } from "@/components/upload/ImageUpload";
import Image from "next/image";
import InputGroup from "@/components/form-elements/InputGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Giữ lại Table nếu đây là component thuần, nếu không có thể thay bằng thẻ <table> thường

import {
  getCategoriesApi,
  createCategoryApi,
  updateCategoryApi,
  deleteCategoryApi,
  Category,
  Pagination,
} from "@/services/category/api";

import { uploadImageRequest } from "@/services/upload/api"; // Import upload service

import { useEffect, useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useModalContext } from "@/contexts/modal-context";

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

const categorySchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters long"),
  image: z.string().url("Image URL must be a valid URL").optional().or(z.literal('')), // Change back to image
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false); // New state to track image upload

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
    watch, // Add watch here
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", image: "" }, // Change to image
  });

  const { setIsModalOpen } = useModalContext();

  useEffect(() => {
    if (isFormModalOpen || isDeleteModalOpen) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [isFormModalOpen, isDeleteModalOpen, setIsModalOpen]);

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getCategoriesApi(page, 10);
      setCategories(response.data || []);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Failed to fetch categories", error);
      toast.error(error.message || "Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploadingImage(true);
    const fileToUpload = files[0];
    const toastId = toast.loading(`Uploading ${fileToUpload.name}...`);
    try {
      const res = await uploadImageRequest(fileToUpload);
      if (res && res.data && res.data.url) {
        let imageUrl = res.data.url;
        if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
          imageUrl = `https://${imageUrl}`;
        }
        setValue("image", imageUrl); // Change to image
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        toast.error("Failed to get image URL", { id: toastId });
        setValue("image", ""); // Change to image
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image", { id: toastId });
      setValue("image", ""); // Change to image
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setValue("image", ""); // Change to image
    toast.success("Image removed.");
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      // Use watch("image") to get the current value, as data.image might not be updated yet after async upload
      const currentImage = watch("image"); // Change to image
      const payload = { ...data, image: currentImage || undefined }; // Change to image

      if (editingId) {
        await updateCategoryApi(editingId, payload);
        toast.success("Category updated successfully!");
      } else {
        await createCategoryApi(payload);
        toast.success("Category created successfully!");
      }
      handleCloseFormModal();
      fetchCategories(pagination?.page || 1);
    } catch (error: any) {
      console.error("Failed to save category", error);
      toast.error(error.message || "Failed to save category.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategoryApi(deleteId);
      toast.success("Category deleted successfully!");
      fetchCategories(1);
    } catch (error: any) {
      console.error("Failed to delete category", error);
      toast.error(error.message || "Failed to delete category.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    reset({ name: "", image: "" }); // Reset image
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingId(category.id);
    setValue("name", category.name);
    setValue("image", category.image || ""); // Set existing image
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingId(null);
    reset({ name: "", image: "" }); // Reset image on close
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
      fetchCategories(newPage);
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
      <Breadcrumb pageName="Categories" />

      {/* Header & Create Button */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Category Management
        </h2>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add New Category
        </button>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="p-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-4 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        {category.image && (
                          <Image
                            src={category.image}
                            alt={category.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {category.name}
                      </TableCell>
                      <TableCell>{formatDate(category.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleOpenEdit(category)}
                          className="mr-3 text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenDelete(category.id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No categories found.
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
        title={editingId ? "Edit Category" : "Add New Category"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Category Name
              </label>
              <input
                type="text"
                placeholder="Enter category name"
                {...register("name")} // Hoạt động tốt với thẻ input thường
                className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <ImageUpload
              label="Category Image"
              value={watch("image") ? [watch("image") as string] : []} // Pass current image as an array of strings
              onChange={(files) => handleImageChange(files)} // Handle upload
              onRemove={() => handleRemoveImage()} // Handle removal
              error={errors.image?.message} // Display image errors
            />
             {errors.image && (
              <p className="mt-1 text-sm text-red-500">{errors.image.message}</p>
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
              disabled={isUploadingImage} // Disable if image is uploading
              className="rounded bg-primary px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-50"
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
            permanently delete this category.
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
