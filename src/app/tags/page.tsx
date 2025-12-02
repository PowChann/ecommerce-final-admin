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
  getTagsApi,
  createTagApi,
  updateTagApi,
  deleteTagApi,
  Tag,
  Pagination,
} from "@/services/tag/api"; // Đảm bảo đường dẫn đúng

import { useEffect, useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useModalContext } from "@/contexts/modal-context";

// --- 1. COMPONENT MODAL TỰ VIẾT ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

const Modal = ({ isOpen, onClose, title, children, width = "max-w-md" }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`w-full ${width} rounded-lg border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- 2. LOGIC CHÍNH ---

const tagSchema = z.object({
  name: z.string().min(3, "Tag name must be at least 3 characters long"),
});

type TagFormData = z.infer<typeof tagSchema>;

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
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
  } = useForm<TagFormData>({
    resolver: zodResolver(tagSchema),
    defaultValues: { name: "" },
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

  const fetchTags = async (page = 1) => {
    setLoading(true);
    try {
      const response = await getTagsApi(page, 10);
      setTags(response.data || []);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Failed to fetch tags", error);
      toast.error(error.message || "Failed to fetch tags.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const onSubmit = async (data: TagFormData) => {
    try {
      if (editingId) {
        await updateTagApi(editingId, data);
        toast.success("Tag updated successfully!");
      } else {
        await createTagApi(data);
        toast.success("Tag created successfully!");
      }
      handleCloseFormModal();
      fetchTags(pagination?.page || 1);
    } catch (error: any) {
      console.error("Failed to save tag", error);
      toast.error(error.message || "Failed to save tag.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteTagApi(deleteId);
      toast.success("Tag deleted successfully!");
      fetchTags(1);
    } catch (error: any) {
      console.error("Failed to delete tag", error);
      toast.error(error.message || "Failed to delete tag.");
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

  const handleOpenEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setValue("name", tag.name);
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
      fetchTags(newPage);
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
      <Breadcrumb pageName="Tags" />

      {/* Header & Create Button */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Tag Management
        </h2>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add New Tag
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
                    <TableCell colSpan={3} className="text-center py-4">Loading...</TableCell>
                  </TableRow>
                ) : tags.length > 0 ? (
                  tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell className="font-medium">{tag.name}</TableCell>
                      <TableCell>{formatDate(tag.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => handleOpenEdit(tag)}
                          className="mr-3 text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleOpenDelete(tag.id)}
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
                      No tags found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-end gap-4 py-4 mt-2 border-t border-stroke dark:border-dark-3">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <div className="flex gap-2">
                    <button
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-dark-2"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.totalPages}
                        className="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-dark-2"
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
        title={editingId ? "Edit Tag" : "Add New Tag"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
             {/* Dùng Input thường thay vì InputGroup */}
            <label className="mb-2.5 block text-black dark:text-white font-medium">
                Tag Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter tag name"
              {...register("name")}
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={handleCloseFormModal}
              className="rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
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
                Are you absolutely sure? This action cannot be undone and will permanently delete this tag.
            </p>
        </div>
        <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
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