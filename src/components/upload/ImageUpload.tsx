"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";

interface ImageUploadProps {
  label: string;
  value: string; // Current image URL
  onChange: (url: string) => void; // Callback when image is uploaded/removed
  error?: string;
  className?: string;
}

export function ImageUpload({ label, value, onChange, error, className }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update previewUrl if value prop changes
    if (value !== previewUrl && !selectedFile) {
      setPreviewUrl(value);
    }
  }, [value, previewUrl, selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        // Tự động gọi upload sau khi chọn và tạo preview
        // Sử dụng một timeout nhỏ để đảm bảo state được cập nhật
      setTimeout(() => handleUpload(file), 0);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(value || null);
    }
  };

  const handleUpload = async (fileToUpload: File | null = selectedFile) => {
    if (!fileToUpload) {
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", fileToUpload);

      // Simulate API call for image upload
      // In a real application, replace this with your actual backend upload endpoint
      // and handle response to get the actual image URL.
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming backend returns { imageUrl: "URL_OF_UPLOADED_IMAGE" }
      const uploadedImageUrl = response.data.imageUrl || "https://via.placeholder.com/150"; // Fallback placeholder
      onChange(uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (err: any) {
      console.error("Error uploading image:", err);
      toast.error(err.response?.data?.message || "Failed to upload image.");
      onChange(value); // Revert to original value on error
    } finally {
      setUploading(false);
      setSelectedFile(null); // Clear selected file after upload attempt
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear file input
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    onChange(""); // Notify parent that image is removed/cleared
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
    toast("Image cleared.", { icon: '🗑️' });
  };

  return (
    <div className={className}>
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-stroke p-4 dark:border-dark-3">
        {previewUrl ? (
          <div className="relative h-40 w-full rounded-md overflow-hidden mb-4">
            <Image
              src={previewUrl}
              alt="Preview"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 text-xs hover:bg-red-600"
            >
              X
            </button>
          </div>
        ) : (
          <div className="text-center text-gray-500 mb-4">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="sr-only" // Hide the default file input
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center rounded-md border border-stroke bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 dark:border-strokedark dark:bg-primary dark:hover:bg-opacity-90"
            >
              Choose File
            </button>
            {selectedFile && <span className="ml-2 text-black dark:text-white">{selectedFile.name}</span>}
          </div>
        )}

        {selectedFile && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-4 inline-flex items-center justify-center rounded-md border border-stroke bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 dark:border-strokedark dark:bg-primary dark:hover:bg-opacity-90"
          >
            Change File
          </button>
        )}
        
        {uploading && <p className="text-sm text-blue-500">Uploading...</p>}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
