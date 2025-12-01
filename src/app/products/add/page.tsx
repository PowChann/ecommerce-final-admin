"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import InputGroup from "@/components/form-elements/InputGroup";
import { Select } from "@/components/form-elements/select";
import api from "@/services/api";
import { Brand, Category } from "@/types/backend";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { ImageUpload } from "@/components/upload/ImageUpload"; // Import ImageUpload

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  price: z.coerce.number().positive("Price must be a positive number"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  images: z.array(z.any()).min(1, "At least one product image is required"), // Now an array of Files
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any, // Cast to any to resolve TS mismatch
    defaultValues: {
      name: "",
      price: 0, // Changed from "" to 0
      description: "",
      categoryId: "",
      brandId: "",
      images: [], // Default to empty array
    },
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          api.get("/categories"),
          api.get("/brands"),
        ]);
        
        // Handle varied response structures (array vs { data: array })
        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];
        const brs = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data.data || [];

        console.log("Categories fetched:", cats);
        console.log("Brands fetched:", brs);

        setCategories(cats);
        setBrands(brs);
      } catch (error) {
        console.error("Error fetching form options", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmitForm = async (data: ProductFormData) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("categoryId", data.categoryId);
    formData.append("brandId", data.brandId);

    // Append image files
    data.images.forEach((file) => {
      formData.append("product_images", file); // Key must match backend's upload.array()
    });

    try {
      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product created successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Failed to create product", error);
      toast.error("Failed to create product. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Add Product" />

      <div className="grid grid-cols-1 gap-9">
        <div className="flex flex-col gap-9 col-span-full">
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
                  className="mb-4.5"
                  {...register("name")}
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
                  className="mb-4.5"
                  {...register("price", { valueAsNumber: true })}
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
                  {...register("categoryId")}
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
                  {...register("brandId")}
                />
                {errors.brandId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.brandId.message}
                  </p>
                )}
                
                 <ImageUpload
                  label="Product Images"
                  value={watch("images") || []} // watch for initial display
                  onChange={(files) => setValue("images", files)} // Set array of File objects
                  error={errors.images?.message as string}
                  className="mb-6"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
