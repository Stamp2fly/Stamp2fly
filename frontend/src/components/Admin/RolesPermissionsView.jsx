import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Save, User, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@stamp2fly.com', role: 'Super Admin' },
  { id: 2, name: 'Alice', email: 'alice@stamp2fly.com', role: 'Support Agent' },
  { id: 3, name: 'Bob', email: 'bob@stamp2fly.com', role: 'Document Processor' },
  { id: 4, name: 'Charlie', email: 'charlie@stamp2fly.com', role: 'Content Editor' },
];

const roles = ['Super Admin', 'Support Agent', 'Document Processor', 'Content Editor'];

const RolesPermissionsView = () => {
  const [users, setUsers] = useState(mockUsers);
  const { toast } = useToast();

  const handleAddUser = () => {
    toast({ title: "Feature in progress", description: "Adding new admin users is not yet implemented." });
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };
  
  const handleSave = () => {
      toast({ title: "Roles Saved!", description: "User roles have been updated.", className: "bg-green-500 text-white"});
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Roles & Permissions</h1>
        <div className="flex space-x-4">
            <Button variant="outline" onClick={handleAddUser}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Admin User
            </Button>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">User</th>
                <th scope="col" className="px-6 py-4">Role</th>
                <th scope="col" className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-bold">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Select value={user.role} onValueChange={(val) => handleRoleChange(user.id, val)}>
                      <SelectTrigger className="w-[200px] h-9">
                        <div className="flex items-center">
                            <Shield className="mr-2 h-4 w-4 text-gray-500"/>
                            <SelectValue/>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="ghost" size="icon"><Trash2 className="h-5 w-5 text-red-500" /></Button>
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

export default RolesPermissionsView;