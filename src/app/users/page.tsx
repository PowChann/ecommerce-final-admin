"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/services/api";
import { User } from "@/types/backend";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/users/admin/all", {
          params: { page, limit: 10 },
        });
        
        if (response.data && Array.isArray(response.data.data)) {
           setUsers(response.data.data);
           setTotalPages(response.data.meta?.totalPages || 1);
        } else if (Array.isArray(response.data)) {
           setUsers(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [page]);

  const toggleBan = async (user: User) => {
    const newStatus = !user.banned;
    if (!confirm(`Are you sure you want to ${newStatus ? "BAN" : "UNBAN"} this user?`)) return;

    try {
      await api.put(`/users/admin/${user.id}`, { banned: newStatus });
      setUsers(users.map(u => u.id === user.id ? { ...u, banned: newStatus } : u));
    } catch (error) {
      console.error("Failed to update ban status", error);
      alert("Failed to update ban status"); // Keep alert for API errors for now
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user PERMANENTLY?")) return;
    try {
      await api.delete(`/users/admin/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
      alert("Failed to delete user"); // Keep alert for API errors for now
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
      <Breadcrumb pageName="Users" />

      <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2 [&>th]:py-4 [&>th]:text-base [&>th]:text-dark [&>th]:dark:text-white">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                   <TableCell colSpan={6} className="text-center py-10">No Users Found</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-[#eee] dark:border-dark-3">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role.toUpperCase()}
                        </span>
                    </TableCell>
                    <TableCell>
                        {user.banned ? (
                            <span className="text-red-500 font-semibold">BANNED</span>
                        ) : (
                            <span className="text-green-500">Active</span>
                        )}
                    </TableCell>
                    <TableCell>
                        {dayjs(user.createdAt).format("MMM DD, YYYY")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => toggleBan(user)}
                            className={`text-xs px-3 py-1 border rounded text-white w-20 ${user.banned ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                        >
                            {user.banned ? 'Unban' : 'Ban'}
                        </button>
                        <button 
                            onClick={() => deleteUser(user.id)}
                            className="text-xs px-3 py-1 border border-red-200 text-red-600 rounded hover:bg-red-50 w-20"
                        >
                            Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-4 gap-2">
          <button 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}