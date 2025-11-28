"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import InputGroup from "@/components/form-elements/InputGroup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/services/api";
import { Brand } from "@/types/backend";
import { useEffect, useState } from "react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "" });
  
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await api.get("/brands");
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setBrands(data);
    } catch (error) {
      console.error("Failed to fetch brands", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /*
    // TEMPORARILY DISABLED
    try {
      if (editingId) {
        await api.put(`/brands/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post("/brands", formData);
      }
      setFormData({ name: "" });
      fetchBrands();
    } catch (error) {
      console.error("Failed to save brand", error);
      alert("Failed to save brand");
    }
    */
    alert("Chức năng thêm/sửa thương hiệu đang tạm khóa.");
  };

  const handleEdit = (brand: Brand) => {
    // setEditingId(brand.id);
    // setFormData({ name: brand.name });
    alert("Chức năng chỉnh sửa đang tạm khóa.");
  };

  const handleDelete = async (id: string) => {
    /*
    // TEMPORARILY DISABLED
    if (!confirm("Delete this brand?")) return;
    try {
      await api.delete(`/brands/${id}`);
      setBrands(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Failed to delete brand", error);
      alert("Failed to delete brand");
    }
    */
    alert("Chức năng xóa đang tạm khóa.");
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "" });
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Brands" />

      <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
        {/* Form Section */}
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                {editingId ? "Edit Brand" : "Add New Brand"}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <InputGroup
                  label="Brand Name"
                  type="text"
                  placeholder="Enter brand name"
                  value={formData.name}
                  handleChange={(e) => setFormData({ name: e.target.value })}
                  required
                  className="mb-4.5"
                />
                <div className="flex gap-3">
                    <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90"
                    >
                    {editingId ? "Update" : "Create"}
                    </button>
                    {editingId && (
                         <button
                         type="button"
                         onClick={handleCancel}
                         className="flex w-full justify-center rounded bg-gray-500 p-3 font-medium text-white hover:bg-opacity-90"
                         >
                         Cancel
                         </button>
                    )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
             <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                Existing Brands
              </h3>
            </div>
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
                            <TableHead>Name</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={2}>Loading...</TableCell></TableRow>
                        ) : (
                            brands.map(brand => (
                                <TableRow key={brand.id}>
                                    <TableCell>{brand.name}</TableCell>
                                    <TableCell className="text-right">
                                        <button onClick={() => handleEdit(brand)} className="text-primary hover:underline mr-3">Edit</button>
                                        <button onClick={() => handleDelete(brand.id)} className="text-red-500 hover:underline">Delete</button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}