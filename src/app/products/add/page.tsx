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
import { uploadImageRequest } from "@/services/upload/api"; // Import upload service

const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  price: z.coerce.number().positive("Price must be a positive number"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  categoryId: z.string().min(1, "Category is required"),
  brandId: z.string().min(1, "Brand is required"),
  images: z.array(z.string().url("Image URL must be a valid URL")).min(1, "At least one product image is required"), // Now an array of URLs
});

type ProductFormData = z.infer<typeof productSchema>;

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false); // New state for image upload status
  const [processedFiles, setProcessedFiles] = useState<Set<string>>(new Set()); // To track uploaded files

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
      price: 0,
      description: "",
      categoryId: "",
      brandId: "",
      images: [], // Default to empty array of URLs
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
        
        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];
        const brs = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data.data || [];

        setCategories(cats);
        setBrands(brs);
      } catch (error) {
        console.error("Error fetching form options", error);
      }
    };
    fetchData();
  }, []);

  const handleImageChange = async (files: File[]) => {
    // Determine which files actually need uploading (not in processedFiles yet)
    const filesToUpload = files.filter(file => {
      const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
      return !processedFiles.has(fileKey);
    });

    if (filesToUpload.length === 0) {
      setIsUploadingImages(false); // Stop uploading if no files, or only removed
      // If all files were removed locally, `files` might be empty.
      // We should update the form images to reflect only the URLs that remain.
      // But `setValue("images", watch("images") || [])` keeps current images.
      // If we completely remove all local files, we need to clear current images too.
      // This is handled better by `handleRemoveImage`.
      return;
    }

    setIsUploadingImages(true); // Start uploading indicator

    const currentImages = watch("images") || []; // These are existing URLs
    let newUploadedUrls: string[] = [...currentImages];

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
                newUploadedUrls.push(imageUrl);
                setProcessedFiles(prev => new Set(prev).add(fileKey)); // Mark as processed
                toast.success("Uploaded successfully", { id: toastId });
            } else {
                toast.error("Failed to get image URL", { id: toastId });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image", { id: toastId });
        }
    });

    await Promise.allSettled(uploadPromises); // Wait for all uploads to finish
    setValue("images", newUploadedUrls); // Update form with all (old + new uploaded) URLs
    setIsUploadingImages(false); // End uploading indicator
  };
  
  const handleRemoveImage = (urlToRemove: string) => {
      const currentImages = watch("images") || [];
      const updatedImages = currentImages.filter(url => url !== urlToRemove);
      setValue("images", updatedImages);
      toast.success("Image removed.");
  };

  const handleSubmitForm = async (data: ProductFormData) => {
    setLoading(true);
    setIsUploadingImages(true); // Ensure image upload indicator is on during submission

    // Images are already uploaded via handleImageChange, data.images now contains URLs
    const payload = {
      name: data.name,
      description: data.description,
      price: data.price,
      categoryId: data.categoryId,
      brandId: data.brandId,
      images: data.images, // Array of URLs
    };

    try {
      await api.post("/products", payload); // Send JSON payload
      toast.success("Product created successfully!");
      router.push("/products");
    } catch (error) {
      console.error("Failed to create product", error);
      toast.error("Failed to create product. Please check inputs.");
    } finally {
      setLoading(false);
      setIsUploadingImages(false);
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
                  value={watch("images")} // Now watch("images") will contain URLs
                  onChange={handleImageChange}
                  onRemove={handleRemoveImage}
                  error={errors.images?.message as string}
                  uploading={isUploadingImages} // Pass uploading state
                  className="mb-6"
                />

                <button
                  type="submit"
                  disabled={loading || isUploadingImages} // Disable if form submitting or images uploading
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading || isUploadingImages ? "Creating..." : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
