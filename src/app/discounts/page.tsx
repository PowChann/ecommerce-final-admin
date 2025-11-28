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
import { useEffect, useState } from "react";

interface Discount {
  id: string;
  code: string;
  value: number;
  usageLimit: number;
  timesUsed: number;
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    code: "",
    value: "",
    usageLimit: "",
  });
  
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/discounts");
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setDiscounts(data);
    } catch (error) {
      console.error("Failed to fetch discounts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    /*
    // TEMPORARILY DISABLED
    try {
      const payload = {
        ...formData,
        value: parseInt(formData.value),
        usageLimit: parseInt(formData.usageLimit),
      };

      if (editingId) {
        await api.put(`/discounts/${editingId}`, payload);
        setEditingId(null);
      } else {
        await api.post("/discounts", payload);
      }
      
      // Reset form
      setFormData({ code: "", value: "", usageLimit: "" });
      fetchDiscounts();
    } catch (error) {
      console.error("Failed to save discount", error);
      alert("Failed to save discount");
    }
    */
    alert("Chức năng thêm/sửa mã giảm giá đang tạm khóa.");
  };

  const handleEdit = (discount: Discount) => {
    // setEditingId(discount.id);
    // setFormData({
    //     code: discount.code,
    //     value: discount.value.toString(),
    //     usageLimit: discount.usageLimit.toString()
    // });
    alert("Chức năng chỉnh sửa đang tạm khóa.");
  };

  const handleDelete = async (id: string) => {
    /*
    // TEMPORARILY DISABLED
    if (!confirm("Delete this discount?")) return;
    try {
      await api.delete(`/discounts/${id}`);
      setDiscounts(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Failed to delete discount", error);
      alert("Failed to delete discount");
    }
    */
    alert("Chức năng xóa đang tạm khóa.");
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ code: "", value: "", usageLimit: "" });
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Discounts" />

      <div className="grid grid-cols-1 gap-9 md:grid-cols-2">
        {/* Form Section */}
        <div className="flex flex-col gap-9">
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-semibold text-dark dark:text-white">
                {editingId ? "Edit Discount" : "Create Discount"}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <InputGroup
                  label="Coupon Code"
                  type="text"
                  name="code"
                  placeholder="e.g. SUMMER2025"
                  value={formData.code}
                  handleChange={handleChange}
                  required
                  className="mb-4.5"
                />

                <InputGroup
                  label="Value (Amount or %)"
                  type="number"
                  name="value"
                  placeholder="e.g. 10"
                  value={formData.value}
                  handleChange={handleChange}
                  required
                  className="mb-4.5"
                />

                <InputGroup
                  label="Usage Limit"
                  type="number"
                  name="usageLimit"
                  placeholder="e.g. 100"
                  value={formData.usageLimit}
                  handleChange={handleChange}
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
                Active Discounts
              </h3>
            </div>
            <div className="p-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#F7F9FC] dark:bg-dark-2">
                            <TableHead>Code</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Used</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={4}>Loading...</TableCell></TableRow>
                        ) : discounts.length === 0 ? (
                             <TableRow><TableCell colSpan={4} className="text-center">No active discounts</TableCell></TableRow>
                        ) : (
                            discounts.map(discount => (
                                <TableRow key={discount.id}>
                                    <TableCell className="font-bold">{discount.code}</TableCell>
                                    <TableCell>{discount.value}</TableCell>
                                    <TableCell>{discount.timesUsed} / {discount.usageLimit}</TableCell>
                                    <TableCell className="text-right">
                                        <button onClick={() => handleEdit(discount)} className="text-primary hover:underline mr-3">Edit</button>
                                        <button onClick={() => handleDelete(discount.id)} className="text-red-500 hover:underline">Delete</button>
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