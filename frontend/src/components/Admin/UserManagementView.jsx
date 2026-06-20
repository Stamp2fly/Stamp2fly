import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, Edit, Trash2, KeyRound, Search, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteAdminUser, getNormalUsers } from "@/api/adminApi";

const UserManagementView = () => {
  const authUser = JSON.parse(localStorage.getItem("authUser") || "null");
  const isSuperAdmin = authUser?.role === "super_admin";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getNormalUsers();
        setUsers(data || []);
      } catch (error) {
        toast({
          title: "Failed to load users",
          description:
            error?.response?.data?.message || "Could not load user list.",
          variant: "destructive",
        });
        console.error("Users fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const handleAction = (action, userName) => {
    toast({
      title: `${action} Clicked`,
      description: `Action "${action}" for user ${userName} is not implemented yet.`,
    });
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!userId) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${userName}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      await deleteAdminUser(userId);
      setUsers((prev) => (prev || []).filter((user) => user._id !== userId));
      toast({
        title: "User deleted",
        description: `${userName} has been removed.`,
        className: "bg-emerald-600 text-white",
      });
    } catch (error) {
      toast({
        title: "Delete failed",
        description: error?.response?.data?.message || "Could not delete user.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || user.phone || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-4 font-medium">
                  User
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Joined Date
                </th>
                <th scope="col" className="px-6 py-4 font-medium">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 font-medium text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-10 text-slate-500">
                    No users found
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user._id} className="bg-white hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">
                        {(user.fullName || user.phone || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold">
                          {user.fullName || "User"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {user.email || user.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-1">
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleAction("View History", user.fullName || "User")
                        }
                      >
                        <Eye className="h-5 w-5 text-slate-500" />
                      </Button> */}
                      {/* <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleAction(
                            "Reset Password",
                            user.fullName || "User"
                          )
                        }
                      >
                        <KeyRound className="h-5 w-5 text-slate-500" />
                      </Button> */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleDeleteUser(user._id, user.fullName || "User")
                        }
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default UserManagementView;
