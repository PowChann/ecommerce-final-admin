"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import InputGroup from "@/components/form-elements/InputGroup";
import { Select } from "@/components/form-elements/select";
import api from "@/services/api";
import { Brand, Category, Product } from "@/types/backend";
import { useRouter, useParams } from "next/navigation"; // useParams for client components
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams(); // Get dynamic route param
  
  const [loading, setLoading] = useState(false);
  // const [initialLoading, setInitialLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    categoryId: "",
    brandId: "",
    imageUrl: "", 
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  /*
  // TEMPORARILY DISABLED: Fetching specific product by ID
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        const [catRes, brandRes, productRes] = await Promise.all([
          api.get("/categories"),
          api.get("/brands"),
          api.get(`/products/${id}`),
        ]);
        
        const cats = Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [];
        const brs = Array.isArray(brandRes.data) ? brandRes.data : brandRes.data.data || [];
        setCategories(cats);
        setBrands(brs);

        const product: Product = productRes.data.data || productRes.data;
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description,
            categoryId: product.categoryId,
            brandId: product.brandId,
            imageUrl: product.images?.[0] || "",
        });

      } catch (error) {
        console.error("Error fetching data", error);
        alert("Failed to load product data");
        router.push("/products");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, router]);
  */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // setLoading(true);

    /*
    // TEMPORARILY DISABLED: Updating specific product
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        images: [formData.imageUrl],
      };

      await api.put(`/products/${id}`, payload);
      router.push("/products");
    } catch (error) {
      console.error("Failed to update product", error);
      alert("Failed to update product.");
    } finally {
      setLoading(false);
    }
    */
    alert("Chức năng chỉnh sửa sản phẩm đang tạm khóa.");
  };

  /*
  if (initialLoading) {
      return <div className="p-10">Loading product...</div>;
  }
  */

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Edit Product (Disabled)" />

      <div className="rounded-md bg-yellow-50 p-4 text-yellow-800 mb-6 border border-yellow-200">
        Chức năng chỉnh sửa chi tiết theo ID đang được tạm khóa để phát triển.
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 opacity-50 pointer-events-none">
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Edit Product
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <InputGroup
                  label="Product Name"
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  handleChange={handleChange}
                  required
                  className="mb-4.5"
                />

                <InputGroup
                  label="Price"
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  value={formData.price}
                  handleChange={handleChange}
                  required
                  className="mb-4.5"
                />

                <div className="mb-4.5">
                   <label className="mb-2.5 block text-black dark:text-white">
                     Description
                   </label>
                   <textarea
                     rows={6}
                     name="description"
                     placeholder="Enter product description"
                     value={formData.description}
                     onChange={handleChange}
                     className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                   ></textarea>
                </div>

                <Select
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  placeholder="Select Category"
                  items={categories.map((c) => ({ value: c.id, label: c.name }))}
                  className="mb-4.5"
                />

                <Select
                  label="Brand"
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  placeholder="Select Brand"
                  items={brands.map((b) => ({ value: b.id, label: b.name }))}
                  className="mb-4.5"
                />
                
                 <InputGroup
                  label="Image URL"
                  type="text"
                  name="imageUrl"
                  placeholder="Enter image URL"
                  value={formData.imageUrl}
                  handleChange={handleChange}
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
        </div>
      </div>
    </div>
  );
}
