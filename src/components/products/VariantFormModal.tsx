"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import InputGroup from "../form-elements/InputGroup";
import { ProductVariant } from "@/types/backend";
import api from "@/services/api";
import { ImageUpload } from "@/components/upload/ImageUpload"; // Import ImageUpload

interface VariantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  editingVariant: ProductVariant | null;
  onSave: () => void; // Callback to refresh variants list
}

const variantSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Price must be a positive number")
  ),
  quantity: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().min(0, "Quantity cannot be negative")
  ),
  image: z.string().url("Image URL must be a valid URL").optional().or(z.literal("")),
  attributes: z.string().refine((val) => {
    try {
      JSON.parse(val);
      return true;
    } catch (e) {
      return false;
    }
  }, "Attributes must be a valid JSON string"),
});

type VariantFormData = z.infer<typeof variantSchema>;

export function VariantFormModal({
  isOpen,
  onClose,
  productId,
  editingVariant,
  onSave,
}: VariantFormModalProps) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch, // Thêm watch vào đây
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      sku: "",
      price: 0,
      quantity: 0,
      image: "",
      attributes: "{}", // Default to empty JSON object string
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingVariant) {
        reset({
          sku: editingVariant.sku,
          price: editingVariant.price,
          quantity: editingVariant.quantity,
          image: editingVariant.image || "",
          attributes: JSON.stringify(editingVariant.attributes, null, 2), // Pretty print JSON
        });
      } else {
        reset({
            sku: "",
            price: 0,
            quantity: 0,
            image: "",
            attributes: "{}",
        });
      }
    }
  }, [isOpen, editingVariant, reset]);

  const onSubmit = async (data: VariantFormData) => {
    setLoading(true);
    try {
      const payload = {
        productId,
        ...data,
        attributes: JSON.parse(data.attributes), // Parse JSON string back to object
      };

      if (editingVariant) {
        // Update existing variant
        await api.put(`/product-variants/${editingVariant.id}`, payload);
        toast.success("Variant updated successfully!");
      } else {
        // Add new variant
        await api.post("/product-variants/", payload);
        toast.success("Variant added successfully!");
      }
      onSave(); // Trigger refresh of variants list in parent
      onClose(); // Close modal
    } catch (error: any) {
      console.error("Error saving variant:", error);
      const errorMessage = error.response?.data?.message || "Failed to save variant. Please check inputs.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card w-full max-w-lg p-6.5">
        <h3 className="font-semibold text-dark dark:text-white mb-4">
          {editingVariant ? "Edit Variant" : "Add New Variant"}
        </h3>
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
            label="Variant Image (Optional)"
            value={watch("image")}
            onChange={(url) => setValue("image", url)}
            error={errors.image?.message}
            className="mb-4.5"
          />

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Attributes (JSON)
            </label>
            <textarea
              rows={6}
              placeholder='Enter attributes as JSON (e.g., {"color": "Red", "size": "M"})'
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              {...register("attributes")}
            ></textarea>
            {errors.attributes && (
              <p className="text-red-500 text-sm mt-1">{errors.attributes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
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
              {loading ? "Saving..." : "Save Variant"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
