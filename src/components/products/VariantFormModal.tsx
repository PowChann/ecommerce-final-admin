"use client";

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useClickOutside } from "@/hooks/use-click-outside";
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
  productPrice?: number; // New prop: main product's price
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
  image: z.string().url("Image URL must be a valid URL").min(1, "Variant image is required"),
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

export function VariantFormModal({
  isOpen,
  onClose,
  productId,
  editingVariant,
  onSave,
  productPrice, // Destructure new prop
}: VariantFormModalProps) {
  const [loading, setLoading] = useState(false);
  const modalRef = useClickOutside<HTMLDivElement>(onClose);
  const [attributeList, setAttributeList] = useState<{ key: string; value: string }[]>([]);

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
      price: productPrice || 0, // Use productPrice as default
      quantity: 0,
      image: "",
      // attributes will be managed separately
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
          // attributes are managed by attributeList state
        });
        const attributesArray = Object.entries(editingVariant.attributes || {}).map(([key, value]) => ({
          key,
          value: String(value), // Ensure value is string for input
        }));
        setAttributeList(attributesArray);
      } else {
        reset({
            sku: "",
            price: productPrice || 0, // Use productPrice as default
            quantity: 0,
            image: "",
            // attributes are managed by attributeList state
        });
        setAttributeList([]);
      }
    }
  }, [isOpen, editingVariant, reset, productPrice]); // Add productPrice to dependency array

  const onSubmit = async (data: VariantFormData) => {
    setLoading(true);
    try {
      // Construct attributes object from attributeList
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
        image: data.image,
        attributes: attributesObject, // Use the constructed object
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card w-full max-w-lg p-6.5 max-h-[90vh] overflow-y-auto"
      >
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
            label="Variant Image"
            value={watch("image")}
            onChange={(url) => setValue("image", url)}
            error={errors.image?.message}
            className="mb-4.5"
          />

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
            {/* Zod validation for attributes will still apply, but handled indirectly */}
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
    </div>,
    document.body
  );
}
