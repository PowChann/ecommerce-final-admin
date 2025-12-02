"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import { userManagement } from "@/services/user/api"; // Đảm bảo đúng đường dẫn file api.ts
import { useEffect, useState, ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import Image from "next/image";
import { authClient } from "@/lib/authClient";
import { useModalContext } from "@/contexts/modal-context";

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
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- 2. ZOD SCHEMA ---
const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["user", "admin"]),
  password: z.string().optional(), // Optional vì khi Edit có thể để trống
});

type UserFormData = z.infer<typeof userSchema>;

// --- 3. MAIN COMPONENT ---
export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  // Tracking IDs
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [actionUserId, setActionUserId] = useState<any | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
    },
  });

  const { setIsModalOpen } = useModalContext();

  useEffect(() => {
    if (isFormModalOpen || isDeleteModalOpen || isBanModalOpen) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
    return () => setIsModalOpen(false);
  }, [isFormModalOpen, isDeleteModalOpen, isBanModalOpen, setIsModalOpen]);

  // --- API FUNCTIONS ---
  const fetchUsers = async (currentPage = 1) => {
    setLoading(true);

    // <--- 3. LẤY SESSION USER KHI FETCH DỮ LIỆU
    const session = await authClient.getSession();
    if (session.data?.user) {
      setCurrentUserId(session.data.user.id);
    }
    // ------------------------------------------

    const { data, error } = await userManagement.listUsers({
      limit: limit,
      offset: (currentPage - 1) * limit,
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    if (error) {
      console.error("Failed to fetch users", error);
      toast.error(error.message || "Failed to fetch users.");
      setUsers([]);
    } else if (data) {
      setUsers(data.users);
      const calculatedTotal = Math.ceil((data.total || 0) / limit);
      setTotalPages(calculatedTotal > 0 ? calculatedTotal : 1);
      setPage(currentPage);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (formData: UserFormData) => {
    try {
      if (editingId) {
        // --- LOGIC EDIT ---
        // 1. Update thông tin cơ bản
        const { error: updateError } = await userManagement.updateUser({
          userId: editingId,
          data: { name: formData.name },
        });
        if (updateError) throw new Error(updateError.message);

        // 2. Update Role
        const { error: roleError } = await userManagement.setUserRole(
          editingId,
          formData.role,
        );
        if (roleError) throw new Error(roleError.message);

        // 3. Update Password (nếu người dùng nhập vào ô password)
        if (formData.password && formData.password.trim() !== "") {
          const { error: passError } = await userManagement.setUserPassword(
            editingId,
            formData.password,
          );
          if (passError) throw new Error(passError.message);
        }

        toast.success("User updated successfully!");
      } else {
        // --- LOGIC CREATE ---
        // Khi tạo mới, password là bắt buộc
        if (!formData.password) {
          toast.error("Password is required for new users");
          return;
        }

        const { error } = await userManagement.createUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
        });

        if (error) throw new Error(error.message);
        toast.success("User created successfully!");
      }

      handleCloseFormModal();
      fetchUsers(page);
    } catch (error: any) {
      console.error("Failed to save user", error);
      toast.error(error.message || "Failed to save user.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await userManagement.removeUser(deleteId);
      if (error) throw new Error(error.message);

      toast.success("User deleted successfully!");
      fetchUsers(1);
    } catch (error: any) {
      console.error("Failed to delete user", error);
      toast.error(error.message || "Failed to delete user.");
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  const handleConfirmBanToggle = async () => {
    if (!actionUserId) return;
    const user = actionUserId;
    const isBanning = !user.banned;

    try {
      let error = null;
      if (isBanning) {
        const res = await userManagement.banUser({
          userId: user.id,
          banReason: "Admin Action",
        });
        error = res.error;
      } else {
        const res = await userManagement.unbanUser(user.id);
        error = res.error;
      }

      if (error) throw new Error(error.message);

      toast.success(
        `User ${user.name} has been ${isBanning ? "banned" : "unbanned"}!`,
      );
      fetchUsers(page);
    } catch (error: any) {
      console.error("Ban action failed", error);
      toast.error(error.message || "Action failed.");
    } finally {
      setIsBanModalOpen(false);
      setActionUserId(null);
    }
  };

  // --- HANDLERS ---
  const handleOpenCreate = () => {
    setEditingId(null);
    reset({ name: "", email: "", role: "user", password: "" });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setEditingId(user.id);
    setValue("name", user.name);
    setValue("email", user.email);
    setValue("role", user.role || "user");
    setValue("password", ""); // Reset password field để trống
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingId(null);
    reset();
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleOpenBan = (user: any) => {
    setActionUserId(user);
    setIsBanModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchUsers(newPage);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Users" />

      {/* Header & Create Button */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          User Management
        </h2>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
        >
          Add New User
        </button>
      </div>

      {/* List Section */}
      <div className="flex flex-col gap-9">
        <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
          <div className="overflow-x-auto p-4">
            <table className="w-full table-auto">
              <thead className="bg-[#F7F9FC] dark:bg-dark-2">
                <tr className="text-left">
                  <th className="min-w-[200px] px-4 py-4 font-medium text-black dark:text-white">
                    Name
                  </th>
                  <th className="min-w-[180px] px-4 py-4 font-medium text-black dark:text-white">
                    Email
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                    Role
                  </th>
                  <th className="min-w-[100px] px-4 py-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                  <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                    Joined At
                  </th>
                  <th className="px-4 py-4 text-right font-medium text-black dark:text-white">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  // SỬA Ở ĐÂY: Bỏ dấu { } bao quanh users.map, chỉ cần gọi hàm trực tiếp
                  users.map((user) => {
                    // Logic kiểm tra user hiện tại
                    const isCurrentUser = user.id === currentUserId;

                    return (
                      <tr
                        key={user.id}
                        className={`dark:border-strokedark border-b border-stroke last:border-none ${
                          isCurrentUser ? "dark:bg-meta-4/30 bg-blue-50" : ""
                        }`}
                      >
                        {/* Avatar Column */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full">
                              {user.image ? (
                                <Image
                                  src={user.image}
                                  alt="User"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary text-lg font-bold text-white">
                                  {user.name?.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <span className="block font-medium text-black dark:text-white">
                                {user.name}{" "}
                                {isCurrentUser && (
                                  <span className="ml-1 rounded bg-primary/10 px-1 text-xs text-primary">
                                    (You)
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email Column */}
                        <td className="px-4 py-4 text-black dark:text-white">
                          {user.email}
                        </td>

                        {/* Role Column */}
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded px-2 py-1 text-xs font-bold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {(user.role || "").toUpperCase()}
                          </span>
                        </td>

                        {/* Status Column */}
                        <td className="px-4 py-4">
                          {user.banned ? (
                            <span className="text-sm font-medium text-red-500">
                              Banned
                            </span>
                          ) : (
                            <span className="text-sm font-medium text-green-500">
                              Active
                            </span>
                          )}
                        </td>

                        {/* Joined At Column */}
                        <td className="px-4 py-4 text-black dark:text-white">
                          {dayjs(user.createdAt).format("DD/MM/YYYY")}
                        </td>

                        {/* Actions Column */}
                        <td className="px-4 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(user)}
                              className="text-primary hover:underline"
                            >
                              Edit
                            </button>

                            {!isCurrentUser && (
                              <>
                                <button
                                  onClick={() => handleOpenBan(user)}
                                  className={`${
                                    user.banned
                                      ? "text-green-500"
                                      : "text-orange-500"
                                  } hover:underline`}
                                >
                                  {user.banned ? "Unban" : "Ban"}
                                </button>
                                <button
                                  onClick={() => handleOpenDelete(user.id)}
                                  className="text-red-500 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-2 flex items-center justify-end gap-4 border-t border-stroke py-4 dark:border-dark-3">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    className="rounded border px-3 py-1 hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-dark-2"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= totalPages}
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
        title={editingId ? "Edit User" : "Create User"}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            {/* Input Name */}
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                {...register("name")}
                className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Input Email */}
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. john@example.com"
                {...register("email")}
                readOnly={!!editingId}
                className={`dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary ${editingId ? "cursor-not-allowed opacity-60" : ""}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Input Role */}
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                {...register("role")}
                className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Input Password - Đã sửa để hiển thị cho cả Edit */}
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                {editingId ? "Change Password" : "Password"}
                {!editingId && <span className="text-red-500"> *</span>}
              </label>
              <input
                type="password"
                // Placeholder thay đổi tùy ngữ cảnh
                placeholder={
                  editingId
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                {...register("password")}
                className="dark:border-form-strokedark dark:bg-form-input w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary dark:focus:border-primary"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
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
              {editingId ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </Modal>

      {/* --- CONFIRM BAN MODAL --- */}
      <Modal
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        title={actionUserId?.banned ? "Unban User" : "Ban User"}
      >
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to{" "}
            <strong>{actionUserId?.banned ? "UNBAN" : "BAN"}</strong> the user{" "}
            <strong>{actionUserId?.name}</strong>?
            {!actionUserId?.banned && " They will not be able to login."}
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setIsBanModalOpen(false)}
            className="dark:border-strokedark rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBanToggle}
            className={`rounded px-6 py-2 font-medium text-white hover:bg-opacity-90 ${actionUserId?.banned ? "bg-green-500" : "bg-orange-500"}`}
          >
            {actionUserId?.banned ? "Unban" : "Ban"}
          </button>
        </div>
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
            permanently delete this user data.
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
