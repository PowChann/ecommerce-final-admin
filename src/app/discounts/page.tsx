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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface Discount {
  id: string;
  code: string; // Mã giảm giá (tối đa 5 ký tự, không null, duy nhất)
  value: number; // Giá trị giảm giá (số nguyên, không null)
  usageLimit: number; // Số lần sử dụng tối đa (số nguyên, không null, mặc định 10) - tương ứng với maxUsageCount
  timesUsed: number; // Số lần đã sử dụng hiện tại (số nguyên, không null, mặc định 0) - tương ứng với currentUsageCount
  createdAt: string; // Timestamp, tự động tạo khi tạo mới
  updatedAt: string; // Timestamp, tự động cập nhật khi có thay đổi
}

const discountSchema = z.object({
  code: z.string().min(1, "Code is required").max(5, "Code must be at most 5 characters long"),
  value: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Value must be a positive number")
  ),
  usageLimit: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().min(1, "Usage limit must be at least 1")
  ),
});

type DiscountFormData = z.infer<typeof discountSchema>;

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<DiscountFormData>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: "",
      value: 0,
      usageLimit: 10,
    },
  });
  
  const fetchDiscounts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/discounts");
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setDiscounts(data);
    } catch (error: any) {
      console.error("Failed to fetch discounts", error);
      toast.error(error.response?.data?.message || "Failed to fetch discounts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const onSubmit = async (data: DiscountFormData) => {
    try {
      const payload = {
        ...data,
        value: data.value,
        usageLimit: data.usageLimit,
      };

      if (editingId) {
        await api.put(`/discounts/${editingId}`, payload);
        toast.success("Discount updated successfully!");
      } else {
        await api.post("/discounts", payload);
        toast.success("Discount created successfully!");
      }
      
      setEditingId(null);
      reset({ code: "", value: 0, usageLimit: 10 }); // Reset form
      fetchDiscounts(); // Refresh list
    } catch (error: any) {
      console.error("Failed to save discount", error);
      toast.error(error.response?.data?.message || "Failed to save discount.");
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingId(discount.id);
    setValue("code", discount.code);
    setValue("value", discount.value);
    setValue("usageLimit", discount.usageLimit);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount?")) return;
    try {
      await api.delete(`/discounts/${id}`);
      toast.success("Discount deleted successfully!");
      fetchDiscounts(); // Refresh list
    } catch (error: any) {
      console.error("Failed to delete discount", error);
      toast.error(error.response?.data?.message || "Failed to delete discount.");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    reset({ code: "", value: 0, usageLimit: 10 }); // Clear form
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="p-6.5">
                <InputGroup
                  label="Coupon Code"
                  type="text"
                  placeholder="e.g. SUMMER2025"
                  {...register("code")}
                  required
                  className="mb-4.5"
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.code.message}
                  </p>
                )}

                <InputGroup
                  label="Value (Amount or %)"
                  type="number"
                  placeholder="e.g. 10"
                  {...register("value", { valueAsNumber: true })}
                  required
                  className="mb-4.5"
                />
                {errors.value && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.value.message}
                  </p>
                )}

                <InputGroup
                  label="Usage Limit"
                  type="number"
                  placeholder="e.g. 100"
                  {...register("usageLimit", { valueAsNumber: true })}
                  required
                  className="mb-4.5"
                />
                {errors.usageLimit && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.usageLimit.message}
                  </p>
                )}

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
                            <TableHead>Time Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
                        ) : discounts.length === 0 ? (
                             <TableRow><TableCell colSpan={5} className="text-center">No active discounts</TableCell></TableRow>
                        ) : (
                            discounts.map(discount => (
                                <TableRow key={discount.id}>
                                    <TableCell className="font-bold">{discount.code}</TableCell>
                                    <TableCell>{discount.value}</TableCell>
                                    <TableCell>{discount.timesUsed} / {discount.usageLimit}</TableCell>
                                    <TableCell>{dayjs(discount.createdAt).format("DD/MM/YYYY")}</TableCell>
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