"use client";

import { useRouter, useParams } from "next/navigation";
import { VariantForm } from "@/components/products/VariantForm";
import Breadcrumb from "@/components/ui/breadcrumb";
import { useEffect, useState } from "react";
import api from "@/services/api";
import toast from "react-hot-toast";
import { ProductVariant, Product } from "@/types/backend"; // Import Product for price

interface EditProductVariantPageProps {
  // params: { // No longer needed as useParams hook will be used
  //   id: string; // This is the variant ID
  // };
}

export default function EditProductVariantPage({}: EditProductVariantPageProps) { // No longer receiving params as prop
  const router = useRouter();
  const params = useParams(); // Use useParams hook
  const variantId = params.id as string; // Assert as string

  const [variantDetails, setVariantDetails] = useState<ProductVariant | null>(null);
  const [productDetails, setProductDetails] = useState<Product | null>(null); // To get product price
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    if (variantId) {
      const fetchDetails = async () => {
        try {
          setLoadingDetails(true);
          // Fetch individual variant details from the new backend endpoint
          const variantRes = await api.get(`/product-variants/detail/${variantId}`);
          const fetchedVariant = variantRes.data.data;
          setVariantDetails(fetchedVariant);

          // Fetch product details for price (and possibly name in breadcrumb)
          if (fetchedVariant?.productId) {
            const productRes = await api.get(`/products/${fetchedVariant.productId}`);
            setProductDetails(productRes.data.data);
          }

        } catch (error) {
          console.error("Error fetching variant or product details:", error);
          toast.error("Failed to load variant details.");
          router.push("/products"); // Redirect if details not found or error
        } finally {
          setLoadingDetails(false);
        }
      };
      fetchDetails();
    } else {
      toast.error("Variant ID is missing.");
      router.push("/products");
    }
  }, [variantId, router]);

  const handleSuccess = () => {
    toast.success("Variant updated successfully!");
    // Navigate back to the product's edit page
    if (productDetails?.id) {
        router.push(`/products/edit/${productDetails.id}`); // Corrected path
    } else {
        router.push("/products"); // Fallback
    }
  };

  const handleCancel = () => {
    // Navigate back to the product's edit page
    if (productDetails?.id) {
        router.push(`/products/edit/${productDetails.id}`); // Corrected path
    } else {
        router.push("/products"); // Fallback
    }
  };

  if (loadingDetails) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Edit Product Variant" />
        <div className="flex justify-center items-center h-64">
          <p>Loading variant details...</p>
        </div>
      </div>
    );
  }

  if (!variantDetails) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Edit Product Variant" />
        <p className="text-red-500">Variant details not available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName={`Edit Variant for ${productDetails?.name || 'Product'}`} />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 col-span-full">
          <VariantForm
            productId={variantDetails.productId}
            initialData={variantDetails}
            productPrice={productDetails?.price} // Pass product price for context/placeholder
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </div>
  );
}
