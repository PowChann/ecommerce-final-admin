"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/authClient";
import { updateUserRequest, changePasswordRequest } from "@/services/user/api";
import { uploadImageRequest } from "@/services/upload/api";
// Import API upload bạn vừa tạo (Hãy chắc chắn đường dẫn đúng)


export default function ProfilePage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // State
  const [profileData, setProfileData] = useState({ name: "", image: "" });
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // State upload ảnh riêng
  const [uploading, setUploading] = useState(false);

  const [passData, setPassData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loadingPass, setLoadingPass] = useState(false);

  // Load data
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        image: user.image || "",
      });
    }
  }, [user]);

  // --- HANDLER: UPLOAD FILE ---
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate nhẹ (ví dụ max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading image...");

    try {
      // Gọi API upload
      const res = await uploadImageRequest(file);
      
      // Upload xong: Cập nhật URL vào state để hiển thị ngay lập tức
      // URL này sẽ được gửi đi khi bấm "Save Profile"
      setProfileData((prev) => ({ ...prev, image: res.data.url }));
      
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error("Upload failed. Please try again.", { id: toastId });
    } finally {
      setUploading(false);
      // Reset value input để cho phép chọn lại cùng 1 file nếu cần
      e.target.value = ""; 
    }
  };

  // --- HANDLER: SAVE PROFILE ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);

    // Xử lý Image URL: Tự động thêm https:// nếu người dùng nhập tay thiếu
    let imageUrl = profileData.image.trim();
    if (imageUrl && !/^https?:\/\//i.test(imageUrl)) {
      imageUrl = `https://${imageUrl}`;
    }
    
    // Cập nhật state (để UI đồng bộ nếu có sửa đổi https)
    setProfileData((prev) => ({ ...prev, image: imageUrl }));

    try {
      await updateUserRequest({
        name: profileData.name,
        image: imageUrl, 
      });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passData.newPassword !== passData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoadingPass(true);
    try {
      await changePasswordRequest({
        currentPassword: passData.currentPassword,
        newPassword: passData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPassData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="mx-auto max-w-270">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-semibold text-black dark:text-white">
          Profile Settings
        </h2>
      </div>

      <div className="grid grid-cols-5 gap-8">
        {/* --- SECTION 1: PERSONAL INFO --- */}
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-[#121c2c]">
            <div className="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleUpdateProfile}>
                
                {/* --- AVATAR UPLOAD SECTION --- */}
                <div className="mb-5.5 flex items-center gap-4">
                  <div className="relative group">
                    <div className="h-14 w-14 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
                      {profileData.image ? (
                        <img
                          src={profileData.image}
                          alt="User"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://ui-avatars.com/api/?name=" +
                              (profileData.name || "User");
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#5750F1] font-bold text-white">
                          {profileData.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Overlay Loading hoặc Hover để Upload */}
                    <label 
                      htmlFor="profilePhoto" 
                      className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition hover:opacity-100 group-hover:opacity-100"
                    >
                      {uploading ? (
                         <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      ) : (
                        <svg
                          className="fill-white"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.9999 10.5V11.6667C13.9999 12.3111 13.4777 12.8333 12.8333 12.8333H1.16659C0.522152 12.8333 -8.13802e-05 12.3111 -8.13802e-05 11.6667V10.5C-8.13802e-05 10.1778 0.260997 9.91667 0.583252 9.91667C0.905507 9.91667 1.16659 10.1778 1.16659 10.5V11.6667H12.8333V10.5C12.8333 10.1778 13.0943 9.91667 13.4166 9.91667C13.7388 9.91667 13.9999 10.1778 13.9999 10.5Z"
                            fill=""
                          />
                          <path
                            d="M6.99992 1.16667L9.91659 4.08333C10.1444 4.31111 10.1444 4.67778 9.91659 4.90556C9.68884 5.13333 9.32217 5.13333 9.09439 4.90556L7.58325 3.39444V9.91667C7.58325 10.2389 7.32217 10.5 6.99992 10.5C6.67767 10.5 6.41659 10.2389 6.41659 9.91667V3.39444L4.90547 4.90556C4.67772 5.13333 4.31106 5.13333 4.08328 4.90556C3.8555 4.67778 3.8555 4.31111 4.08328 4.08333L6.99992 1.16667Z"
                            fill=""
                          />
                        </svg>
                      )}
                    </label>
                    <input
                      type="file"
                      name="profilePhoto"
                      id="profilePhoto"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                  </div>
                  
                  <div>
                    <span className="text-sm text-black dark:text-white">
                      Your Avatar
                    </span>
                    <label 
                      htmlFor="profilePhoto" 
                      className="cursor-pointer text-xs text-[#5750F1] hover:underline"
                    >
                      Click to upload new photo
                    </label>
                  </div>
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Full Name
                  </label>
                  <input
                    className="w-full rounded border border-gray-200 bg-gray-50 px-4.5 py-3 text-black focus:border-[#5750F1] focus-visible:outline-none dark:border-gray-700 dark:bg-[#1b273a] dark:text-white dark:focus:border-[#5750F1]"
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData({ ...profileData, name: e.target.value })
                    }
                    placeholder="Devid Jhon"
                  />
                </div>
                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded bg-[#5750F1] px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-70"
                    type="submit"
                    disabled={loadingProfile || uploading}
                  >
                    {loadingProfile ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: CHANGE PASSWORD --- */}
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-sm border border-gray-200 bg-white shadow-default dark:border-gray-800 dark:bg-[#121c2c]">
            <div className="border-b border-gray-200 px-7 py-4 dark:border-gray-800">
              <h3 className="font-medium text-black dark:text-white">
                Change Password
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={handleChangePassword}>
                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Current Password
                  </label>
                  <input
                    className="w-full rounded border border-gray-200 bg-gray-50 px-4.5 py-3 text-black focus:border-[#5750F1] focus-visible:outline-none dark:border-gray-700 dark:bg-[#1b273a] dark:text-white dark:focus:border-[#5750F1]"
                    type="password"
                    value={passData.currentPassword}
                    onChange={(e) =>
                      setPassData({
                        ...passData,
                        currentPassword: e.target.value,
                      })
                    }
                    placeholder="Current Password"
                  />
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    New Password
                  </label>
                  <input
                    className="w-full rounded border border-gray-200 bg-gray-50 px-4.5 py-3 text-black focus:border-[#5750F1] focus-visible:outline-none dark:border-gray-700 dark:bg-[#1b273a] dark:text-white dark:focus:border-[#5750F1]"
                    type="password"
                    value={passData.newPassword}
                    onChange={(e) =>
                      setPassData({ ...passData, newPassword: e.target.value })
                    }
                    placeholder="New Password"
                  />
                </div>

                <div className="mb-5.5">
                  <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                    Re-type New Password
                  </label>
                  <input
                    className="w-full rounded border border-gray-200 bg-gray-50 px-4.5 py-3 text-black focus:border-[#5750F1] focus-visible:outline-none dark:border-gray-700 dark:bg-[#1b273a] dark:text-white dark:focus:border-[#5750F1]"
                    type="password"
                    value={passData.confirmPassword}
                    onChange={(e) =>
                      setPassData({
                        ...passData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Re-type New Password"
                  />
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded bg-[#5750F1] px-6 py-2 font-medium text-white hover:bg-opacity-90 disabled:opacity-70"
                    type="submit"
                    disabled={loadingPass}
                  >
                    {loadingPass ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}