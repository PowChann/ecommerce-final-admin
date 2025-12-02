"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useClickOutside } from "@/hooks/use-click-outside";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import InputGroup from "../form-elements/InputGroup";
import { User } from "@/types/backend"; // Assuming User type is defined here
import api from "@/services/api";
import { Select } from "../form-elements/select";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  onSave: () => void; // Callback to refresh users list
}

const userEditSchema = z.object({
  name: z.string().min(3, "User name must be at least 3 characters long").optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["user", "admin", "seller"]),
});

type UserEditFormData = z.infer<typeof userEditSchema>;

export function UserEditModal({
  isOpen,
  onClose,
  userId,
  onSave,
}: UserEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [userDataLoading, setUserDataLoading] = useState(false);
  const modalRef = useClickOutside<HTMLDivElement>(onClose);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
  });

  const fetchUserData = async (id: string) => {
    setUserDataLoading(true);
    try {
      const response = await api.get(`/users/admin/${id}`);
      const user: User = response.data.data;
      reset({
        name: user.name,
        email: user.email,
        role: user.role as "user" | "admin" | "seller",
      });
    } catch (error: any) {
      console.error("Failed to fetch user data", error);
      toast.error(error.response?.data?.message || "Failed to fetch user data.");
      onClose();
    } finally {
      setUserDataLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserData(userId);
    } else if (!isOpen) {
      reset({ name: "", email: "", role: "user" }); // Reset form when modal closes
    }
  }, [isOpen, userId, reset]);

  const onSubmit = async (data: UserEditFormData) => {
    if (!userId) return;

    setLoading(true);
    try {
      await api.put(`/users/admin/${userId}`, data);
      toast.success("User updated successfully!");
      onSave(); // Trigger refresh of users list
      onClose(); // Close modal
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card w-full max-w-lg p-6.5 max-h-[90vh] overflow-y-auto"
      >
        <h3 className="font-semibold text-dark dark:text-white mb-4">
          Edit User
        </h3>
        {userDataLoading ? (
          <p>Loading user data...</p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <InputGroup
              label="User Name"
              type="text"
              placeholder="Enter user name"
              className="mb-4.5"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}

            <InputGroup
              label="Email"
              type="email"
              placeholder="Enter email address"
              className="mb-4.5"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}

            <Select
              label="Role"
              items={[
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
                { value: "seller", label: "Seller" },
              ]}
              className="mb-4.5"
              value={watch("role")}
              onChange={(e) => setValue("role", e.target.value as "user" | "admin" | "seller")}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex justify-center rounded bg-gray-300 p-3 font-medium text-dark hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}