"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface ImageUploadProps {
  label: string;
  // 'value' is now exclusively for external (uploaded) URLs
  value: string[];
  // 'initialFiles' is for File objects that are not yet uploaded (e.g., in AddProduct form)
  // For product edit, this might be null or empty unless new files are being added
  // onChange returns ALL File objects (newly selected + existing local ones)
  onChange: (files: File[]) => void;
  // onRemove is for EXTERNAL URLs (those in 'value')
  onRemove?: (url: string) => void;
  error?: string;
  className?: string;
  uploading?: boolean; // New prop for uploading state
}

export function ImageUpload({ label, value, onChange, onRemove, error, className, uploading }: ImageUploadProps) {
  // internal state to manage files selected by the user, and their blob URLs
  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [localBlobUrls, setLocalBlobUrls] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combine external URLs and local blob URLs for display
  const allPreviewUrls = [...value, ...localBlobUrls];

  // Effect to clean up blob URLs when component unmounts or local files change
  useEffect(() => {
    return () => {
      localBlobUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [localBlobUrls]);

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

    const newLocalFiles = [...localFiles, ...files];
    setLocalFiles(newLocalFiles);

    const newBlobUrls = files.map(file => URL.createObjectURL(file));
    setLocalBlobUrls(prev => [...prev, ...newBlobUrls]);
    
    // Notify parent about all local files (for upload on form submission)
    onChange(newLocalFiles);

    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const isLocalBlob = urlToRemove.startsWith("blob:");

    if (isLocalBlob) {
        // Find the index of the blob URL in localBlobUrls
        const blobIndex = localBlobUrls.indexOf(urlToRemove);
        if (blobIndex > -1) {
            // Revoke the object URL
            URL.revokeObjectURL(urlToRemove);

            // Remove from localBlobUrls and localFiles
            const updatedLocalBlobUrls = localBlobUrls.filter((_, i) => i !== blobIndex);
            const updatedLocalFiles = localFiles.filter((_, i) => i !== blobIndex);
            
            setLocalBlobUrls(updatedLocalBlobUrls);
            setLocalFiles(updatedLocalFiles);

            // Notify parent about the updated list of local files
            onChange(updatedLocalFiles);
        }
    } else {
        // It's an external URL, notify parent to handle removal
        if (onRemove) {
            onRemove(urlToRemove);
        }
        // Parent is responsible for updating the 'value' prop, which will trigger re-render
    }

    toast.success("Image removed.");
  };

  return (
    <div className={className}>
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-stroke p-4 dark:border-dark-3">
        {allPreviewUrls.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {allPreviewUrls.map((url, index) => (
              <div key={url || `preview-${index}`} className="relative h-24 w-24 rounded-md overflow-hidden border border-gray-300">
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(url)} // Pass only the URL for removal
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
