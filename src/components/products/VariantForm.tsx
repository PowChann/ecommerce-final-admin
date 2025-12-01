"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import InputGroup from "../form-elements/InputGroup";
import { ProductVariant } from "@/types/backend"; 
import api from "@/services/api";
import { ImageUpload } from "@/components/upload/ImageUpload";
import { uploadImageRequest } from "@/services/upload/api"; 


interface VariantFormProps {
  productId: string;
  initialData?: ProductVariant | null; 
  productPrice?: number;
  onSuccess: () => void;
  onCancel: () => void; 
}

const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().positive("Price must be a positive number"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  images: z.array(z.string().url("Image URL must be a valid URL")).min(1, "At least one variant image is required"),
  attributes: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, "Attributes must be a valid JSON string. Example: {\"color\": \"Red\", \"size\": \"M\"}"),
});

type VariantFormData = z.infer<typeof variantSchema>;

export function VariantForm({
  productId,
  initialData,
  productPrice,
  onSuccess,
  onCancel,
}: VariantFormProps) {
  const [loading, setLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [attributeList, setAttributeList] = useState<{ key: string; value: string }[]>([]);
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set());

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      sku: "",
      price: productPrice || 0,
      quantity: 0,
      images: [],
      attributes: JSON.stringify({}),
    },
  });

  useEffect(() => {
    if (initialData) {
      const dataToReset = {
        sku: initialData.sku,
        price: initialData.price,
        quantity: initialData.quantity,
        images: (initialData.images || []).map(imgUrl => 
          imgUrl.startsWith('http://') || imgUrl.startsWith('https://') ? imgUrl : `https://${imgUrl}`
        ),
        attributes: JSON.stringify(initialData.attributes || {}),
      };
      reset(dataToReset);
      const attributesArray = Object.entries(initialData.attributes || {}).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      setAttributeList(attributesArray);
    } else {
      reset({
          sku: "",
          price: productPrice || 0,
          quantity: 0,
          images: [],
          attributes: JSON.stringify({}),
      });
      setAttributeList([]);
    }
  }, [initialData, reset, productPrice]);

  const handleImageChange = async (files: File[]) => {
    const filesToUpload = files.filter(file => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      return !processedFiles.has(fileKey);
    });

    if (filesToUpload.length === 0) {
      return;
    }

    setIsUploadingImage(true);

    const currentImages = watch("images") || [];
    const newUrls: string[] = [...currentImages];

    const uploadPromises = filesToUpload.map(async (file) => {
        const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
        const toastId = toast.loading(`Uploading ${file.name}...`);
        try {
            const res = await uploadImageRequest(file);
            if (res && res.data && res.data.url) {
                let imageUrl = res.data.url;
                if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
                    imageUrl = `https://${imageUrl}`;
                }
                newUrls.push(imageUrl);
                setProcessedFiles(prev => new Set(prev).add(fileKey));
                toast.success("Uploaded successfully", { id: toastId });
            } else {
                toast.error("Failed to get image URL", { id: toastId });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image", { id: toastId });
        }
    });

    await Promise.allSettled(uploadPromises);
    setValue("images", newUrls);
    setIsUploadingImage(false);
  };

  const handleRemoveImage = (urlToRemove: string) => {
      const currentImages = watch("images") || [];
      const updatedImages = currentImages.filter(url => url !== urlToRemove);
      setValue("images", updatedImages);
  };

  const onSubmit = async (data: VariantFormData) => {
    setLoading(true);
    try {
      const attributesObject = attributeList.reduce((acc, attr) => {
        if (attr.key.trim() !== "") {
          acc[attr.key.trim()] = attr.value.trim();
        }
        return acc;
      }, {} as Record<string, string>);

      const payload = {
        productId,
        sku: data.sku,
        price: data.price,
        quantity: data.quantity,
        images: data.images,
        attributes: attributesObject,
      };

      if (initialData) {
        await api.put(`/product-variants/${initialData.id}`, payload);
        toast.success("Variant updated successfully!");
      } else {
        await api.post("/product-variants/", payload);
        toast.success("Variant added successfully!");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Error saving variant:", error);
      const errorMessage = error.response?.data?.message || "Failed to save variant. Please check inputs.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to delete this variant?")) return;

    setLoading(true);
    try {
        await api.delete(`/product-variants/${initialData.id}`);
        toast.success("Variant deleted successfully!");
        onSuccess();
    } catch (error: any) {
        console.error("Error deleting variant:", error);
        toast.error(error.response?.data?.message || "Failed to delete variant.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card p-6.5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-dark dark:text-white">
            {initialData ? "Edit Variant" : "Add New Variant"}
        </h3>
        {initialData && (
            <button
                type="button"
                onClick={onDelete}
                disabled={loading}
                className="text-red-500 hover:text-red-700 font-medium text-sm"
            >
                Delete Variant
            </button>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputGroup
          label="SKU"
          type="text"
          placeholder="Enter SKU"
          required
          className="mb-4.5"
          {...register("sku")}
        />
        {errors.sku && (
          <p className="text-red-500 text-sm mt-1">{errors.sku.message}</p>
        )}

        <InputGroup
          label="Price"
          type="number"
          placeholder="Enter price"
          required
          className="mb-4.5"
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}

        <InputGroup
          label="Quantity"
          type="number"
          placeholder="Enter quantity"
          required
          className="mb-4.5"
          {...register("quantity", { valueAsNumber: true })}
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
        )}

        <ImageUpload
          label="Variant Images"
          value={watch("images") || []}
          onChange={handleImageChange}
          onRemove={handleRemoveImage}
          error={errors.images?.message as string}
          className="mb-4.5"
        />
        {errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
        )}

        <div className="mb-4.5">
          <label className="mb-2.5 block text-black dark:text-white">
            Attributes
          </label>
          <div className="flex flex-col gap-2">
            {attributeList.map((attr, index) => (
              <div key={index} className="flex gap-2">
                <InputGroup
                  type="text"
                  placeholder="Key (e.g., Color)"
                  value={attr.key}
                  onChange={(e) => {
                    const newAttrList = [...attributeList];
                    newAttrList[index].key = e.target.value;
                    setAttributeList(newAttrList);
                  }}
                  className="flex-1"
                />
                <InputGroup
                  type="text"
                  placeholder="Value (e.g., Red)"
                  value={attr.value}
                  onChange={(e) => {
                    const newAttrList = [...attributeList];
                    newAttrList[index].value = e.target.value;
                    setAttributeList(newAttrList);
                  }}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newAttrList = attributeList.filter((_, i) => i !== index);
                    setAttributeList(newAttrList);
                  }}
                  className="flex items-center justify-center rounded bg-red-500 px-3 py-2 text-white hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAttributeList([...attributeList, { key: "", value: "" }])}
              className="flex justify-center rounded bg-blue-500 p-3 font-medium text-gray hover:bg-blue-600"
            >
              Add Attribute
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex justify-center rounded bg-gray-300 p-3 font-medium text-dark hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || isUploadingImage}
            className="flex justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading || isUploadingImage ? "Saving..." : "Save Variant"}
          </button>
        </div>
      </form>
    </div>
  );
}