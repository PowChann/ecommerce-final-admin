"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { VariantForm } from "@/components/products/VariantForm";
import Breadcrumb from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { Product } from "@/types/backend";

export default function AddProductVariantPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [productDetails, setProductDetails] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          setLoadingProduct(true);
          const res = await api.get(`/products/${productId}`);
          setProductDetails(res.data.data);
        } catch (error) {
          console.error("Error fetching product details:", error);
          toast.error("Failed to load product details for variant creation.");
          router.push("/products"); // Redirect if product not found or error
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchProduct();
    } else {
      toast.error("Product ID is missing for variant creation.");
      router.push("/products");
    }
  }, [productId, router]);

  const handleSuccess = () => {
    toast.success("Variant added successfully!");
    router.push(`/products/edit/${productId}`); // Corrected path: /products/edit/[id]
  };

  const handleCancel = () => {
    router.push(`/products/edit/${productId}`); // Corrected path: /products/edit/[id]
  };

  if (loadingProduct) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Add Product Variant" />
        <div className="flex justify-center items-center h-64">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!productId || !productDetails) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Add Product Variant" />
        <p className="text-red-500">Product details not available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName={`Add Variant for ${productDetails.name}`} />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 col-span-full">
          <VariantForm
            productId={productId}
            productPrice={productDetails.price}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
