"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadProps {
  label: string;
  value: string[]; // Still expects an array of URLs for initial display
  onChange: (files: File[]) => void; // Now returns selected File objects
  onRemove?: (url: string) => void; // Callback when an external URL is removed
  error?: string;
  className?: string;
}

export function ImageUpload({ label, value, onChange, onRemove, error, className }: ImageUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(value || []);
  const [uploading, setUploading] = useState(false); // Keep uploading state for future use if needed, but not used for direct upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If external 'value' (URLs from existing product) changes, update previews
    // We update if the lengths don't match or if the content is different
    // But we must be careful not to kill local previews of newly added files.
    // A safe bet: Sync if we have NO selected files (purely viewing/editing existing).
    // OR, better: merge 'value' (external) + local previews.
    // For now, let's stick to the logic: if value changes, and we assume value contains ALL valid images (including newly uploaded ones if parent manages that), update.
    // But here parent manages 'images' (URLs) separately from 'files' (Blobs).
    
    // Simple sync: If value provided, use it as base.
    // But we have local blobs. 
    // Let's trust the parent 'value' if provided.
    if (value) {
        // If parent updates 'value', we should reflect it. 
        // But we also have 'selectedFiles' which generate blob URLs.
        // If we are in "upload immediately" mode, parent 'value' will contain the new URL replacing the blob.
        // So we can just setPreviewUrls(value).
        setPreviewUrls(value);
    }
  }, [value]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate size (e.g., 5MB per file)
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`File "${file.name}" size must be less than 5MB`);
        return; 
      }
    }

    const newSelectedFiles = [...selectedFiles, ...files];
    setSelectedFiles(newSelectedFiles);

    // In "immediate upload" mode, the parent will eventually update 'value' with the real URL.
    // But for now, show blob preview.
    const newFilePreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newFilePreviews]);
    
    onChange(newSelectedFiles); // Pass selected File objects to parent

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (urlToRemove: string, indexToRemove: number) => {
    // Determine if it's a new file (blob URL)
    const isNewFile = urlToRemove.startsWith("blob:");

    if (isNewFile) {
        // It's a local blob
        URL.revokeObjectURL(urlToRemove);
        
        // We need to find which file corresponds to this blob.
        // This is tricky because 'previewUrls' mixes external URLs and blobs.
        // We can count how many external URLs are there to find the offset in selectedFiles.
        const externalUrlsCount = previewUrls.filter(u => !u.startsWith("blob:")).length;
        const fileIndex = indexToRemove - externalUrlsCount;

        if (fileIndex >= 0 && selectedFiles[fileIndex]) {
             const newSelectedFiles = selectedFiles.filter((_, i) => i !== fileIndex);
             setSelectedFiles(newSelectedFiles);
             onChange(newSelectedFiles);
        }
        
        setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));

    } else {
        // It's an existing external URL
        if (onRemove) {
            onRemove(urlToRemove);
        }
        // We optimistically remove it from preview
        setPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
    }

    toast.success("Image removed.");
  };

  return (
    <div className={className}>
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-stroke p-4 dark:border-dark-3">
        {previewUrls.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div key={url + index} className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-300">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url, index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 shadow-sm opacity-80"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mb-4">
            No images selected.
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          multiple // Allow multiple file selection
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center justify-center rounded-md border border-stroke bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 dark:border-strokedark dark:bg-primary dark:hover:bg-opacity-90 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Choose Files"}
        </button>
        
        {uploading && <p className="text-sm text-blue-500 mt-2">Uploading to server...</p>}
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
