"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import InputGroup from "@/components/form-elements/InputGroup";
import { Select } from "@/components/form-elements/select";
import api from "@/services/api";
import { Brand, Category, ProductVariant, Product } from "@/types/backend"; // Import ProductVariant
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TrashIcon } from "@/assets/icons"; // Import TrashIcon
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VariantFormModal } from "@/components/products/VariantFormModal"; // Import VariantFormModal
import { ImageUpload } from "@/components/upload/ImageUpload"; // Import ImageUpload


const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
     <path d="M13.75 3.01L14.99 4.25L4.49 14.75H3.25V13.51L13.75 3.01ZM13.75 0.5C13.41 0.5 13.07 0.63 12.81 0.89L11.37 2.33L15.66 6.62L17.10 5.18C17.63 4.65 17.63 3.8 17.10 3.27L14.72 0.89C14.46 0.63 14.12 0.5 13.75 0.5ZM10.66 3.04L2 11.7V16H6.3L14.96 7.34L10.66 3.04Z" />
  </svg>
);


const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Price must be a positive number")
  ),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  imageUrl: z.string().url("Image URL must be a valid URL").min(1, "Product image is required"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface EditProductClientProps {
    id: string;
}

export function EditProductClient({ id }: EditProductClientProps) { // Component renamed to EditProductClient
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // Variant states
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [variantLoading, setVariantLoading] = useState(true);
  const [isVariantFormOpen, setIsVariantFormOpen] = useState(false);
  const [currentVariant, setCurrentVariant] = useState<ProductVariant | null>(null);

  const fetchVariants = useCallback(async () => {
    setVariantLoading(true);
    try {
      const variantsRes = await api.get(`/product-variants/${id}`);
      const productVariants = Array.isArray(variantsRes.data) ? variantsRes.data : variantsRes.data.data || [];
      setVariants(productVariants);
    } catch (error) {
      console.error("Error fetching variants", error);
      toast.error("Failed to load product variants.");
      setVariants([]);
    } finally {
      setVariantLoading(false);
    }
  }, [id]);

  // Fetch product data, categories/brands, and variants
  useEffect(() => {
    const fetchData = async () => {
      try {
        setProductLoading(true);
        setVariantLoading(true);
        const [productRes, catRes, brandRes] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
          api.get("/brands"),
        ]);
        
        // Product data
        const productData: Product = productRes.data.data;
        if (productData) {
          reset({
            name: productData.name,
            price: productData.price,
            description: productData.description || "",
            categoryId: productData.categoryId || "",
            brandId: productData.brandId || "",
            imageUrl: productData.images && productData.images.length > 0 ? productData.images[0] : "",
          });
        }

        // Categories
        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];
        setCategories(cats);

        // Brands
        const brs = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data.data || [];
        setBrands(brs);

        await fetchVariants(); // Fetch variants after product data

      } catch (error) {
        console.error("Error fetching data for product edit", error);
        toast.error("Failed to load product data.");
        router.push("/products"); // Redirect if product not found or error
      } finally {
        setProductLoading(false);
      }
    };
    fetchData();
  }, [id, reset, router, fetchVariants]);

  const handleSubmitForm = async (data: ProductFormData) => {
    setLoading(true);

    try {
      const payload = {
        ...data,
        images: [data.imageUrl], // Backend expects array of strings
      };

      await api.put(`/products/${id}`, payload);
      toast.success("Product updated successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Failed to update product", error);
      toast.error("Failed to update product. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;
    try {
      await api.delete(`/product-variants/${variantId}`);
      toast.success("Variant deleted successfully!");
      fetchVariants(); // Re-fetch variants to update the list
    } catch (error: any) {
      console.error("Failed to delete variant", error);
      toast.error(error.response?.data?.message || "Failed to delete variant.");
    }
  };

  if (productLoading) {
    return (
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <Breadcrumb pageName="Edit Product" />
        <div className="flex justify-center items-center h-64">
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Edit Product" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 col-span-full">
          {/* Product Details Form */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Product Details
              </h3>
            </div>
            <form onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="p-6.5">
                <InputGroup
                  label="Product Name"
                  type="text"
                  placeholder="Enter product name"
                  required
                  {...register("name")}
                  className="mb-4.5"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}

                <InputGroup
                  label="Price"
                  type="number"
                  placeholder="Enter price"
                  required
                  {...register("price", { valueAsNumber: true })}
                  className="mb-4.5"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.price.message}
                  </p>
                )}

                <div className="mb-4.5">
                   <label className="mb-2.5 block text-black dark:text-white">
                     Description
                   </label>
                   <textarea
                     rows={6}
                     placeholder="Enter product description"
                     className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                     {...register("description")}
                   ></textarea>
                   {errors.description && (
                     <p className="text-red-500 text-sm mt-1">
                       {errors.description.message}
                     </p>
                   )}
                </div>

                <Select
                  label="Category"
                  placeholder="Select Category"
                  items={categories.map((c) => ({ value: c.id, label: c.name }))}
                  className="mb-4.5"
                  value={watch("categoryId")}
                  onChange={(e) => setValue("categoryId", e.target.value)}
                />
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.categoryId.message}
                  </p>
                )}

                <Select
                  label="Brand"
                  placeholder="Select Brand"
                  items={brands.map((b) => ({ value: b.id, label: b.name }))}
                  className="mb-4.5"
                  value={watch("brandId")}
                  onChange={(e) => setValue("brandId", e.target.value)}
                />
                {errors.brandId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brandId.message}
                  </p>
                )}
                
                 <ImageUpload
                  label="Product Image"
                  value={watch("imageUrl")}
                  onChange={(url) => setValue("imageUrl", url)}
                  error={errors.imageUrl?.message}
                  className="mb-6"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Product"}
                </button>
              </div>
            </form>
          </div>

          {/* Product Variants Management */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3 flex justify-between items-center">
              <h3 className="font-semibold text-dark dark:text-white">
                Product Variants
              </h3>
              <button
                onClick={() => {
                  setCurrentVariant(null);
                  setIsVariantFormOpen(true);
                }}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90"
              >
                Add Variant
              </button>
            </div>
            <div className="p-6.5">
              {variantLoading ? (
                <p>Loading variants...</p>
              ) : variants.length === 0 ? (
                <p>No variants found for this product.</p>
              ) : (
                <div className="max-w-full overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                        <TableHead>SKU</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Attributes</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {variants.map((variant) => (
                        <TableRow key={variant.id} className="border-[#eee] dark:border-dark-3">
                          <TableCell>{variant.sku}</TableCell>
                          <TableCell>${variant.price.toLocaleString()}</TableCell>
                          <TableCell>{variant.quantity}</TableCell>
                          <TableCell>
                            {Object.entries(variant.attributes).map(([key, value]) => (
                              <span key={key} className="block text-sm text-gray-600">
                                {key}: {value}
                              </span>
                            ))}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-x-3.5">
                              <button
                                onClick={() => {
                                  setCurrentVariant(variant);
                                  setIsVariantFormOpen(true);
                                }}
                                className="hover:text-primary"
                              >
                                <span className="sr-only">Edit</span>
                                <EditIcon />
                              </button>
                              <button
                                onClick={() => handleDeleteVariant(variant.id)}
                                className="hover:text-red-500"
                              >
                                <span className="sr-only">Delete</span>
                                <TrashIcon />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <VariantFormModal
        isOpen={isVariantFormOpen}
        onClose={() => {
          setIsVariantFormOpen(false);
          setCurrentVariant(null);
        }}
        productId={id}
        editingVariant={currentVariant}
        onSave={fetchVariants}
      />
    </div>
  );
}