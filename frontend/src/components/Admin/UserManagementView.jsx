import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Trash2, KeyRound, Search, PlusCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john.d@example.com', joinDate: '2025-07-01', appCount: 1, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.s@example.com', joinDate: '2025-06-28', appCount: 2, status: 'Active' },
  { id: 3, name: 'Peter Jones', email: 'peter.j@example.com', joinDate: '2025-07-02', appCount: 0, status: 'Inactive' },
];

const UserManagementView = () => {
  const authUser = JSON.parse(localStorage.getItem('authUser') || 'null');
  const isSuperAdmin = authUser?.role === 'super_admin';
  const [users, setUsers] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    role: 'team',
  });
  const { toast } = useToast();

  const handleAction = (action, userName) => {
    toast({
      title: `${action} Clicked`,
      description: `Action "${action}" for user ${userName} is not implemented yet.`,
    });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTeam = (e) => {
    e.preventDefault();

    if (!isSuperAdmin) {
      toast({
        title: 'Access denied',
        description: 'Only super admin can create team accounts.',
        variant: 'destructive',
      });
      return;
    }

    const newMember = {
      id: Date.now(),
      name: teamForm.fullName,
      email: teamForm.email || `${teamForm.phone}@team.local`,
      joinDate: new Date().toISOString().slice(0, 10),
      appCount: 0,
      status: 'Active',
      role: teamForm.role,
    };

    setUsers((prev) => [newMember, ...prev]);
    setTeamForm({ fullName: '', phone: '', email: '', role: 'team' });
    setIsDialogOpen(false);

    toast({
      title: 'Team member created',
      description: `${newMember.name} has been added as ${newMember.role.replace('_', ' ')}.`,
      className: 'bg-emerald-600 text-white',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {isSuperAdmin && (
            <DialogTrigger asChild>
              <Button className="bg-slate-800 hover:bg-slate-900">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team Account</DialogTitle>
              <DialogDescription>
                Super admin can add team members here. The team member can then login using phone + OTP.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Full Name</label>
                <Input
                  value={teamForm.fullName}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Team member full name"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Phone</label>
                <Input
                  type="tel"
                  value={teamForm.phone}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email (optional)</label>
                <Input
                  type="email"
                  value={teamForm.email}
                  onChange={(e) => setTeamForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                <Select value={teamForm.role} onValueChange={(value) => setTeamForm((prev) => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full sm:w-auto">Create Team Member</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
                <th scope="col" className="px-6 py-4 font-medium">User</th>
                <th scope="col" className="px-6 py-4 font-medium">Joined Date</th>
                <th scope="col" className="px-6 py-4 font-medium">Applications</th>
                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                <th scope="col" className="px-6 py-4 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="bg-white hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 flex-shrink-0">{user.name.charAt(0)}</div>
                      <div>
                        <div className="font-bold">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        {user.role && <div className="text-xs text-slate-400 uppercase">{user.role.replace('_', ' ')}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{user.joinDate}</td>
                  <td className="px-6 py-4 text-center">{user.appCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleAction('View History', user.name)}><Eye className="h-5 w-5 text-slate-500"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAction('Reset Password', user.name)}><KeyRound className="h-5 w-5 text-slate-500"/></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleAction('Deactivate', user.name)}><Trash2 className="h-5 w-5 text-red-500"/></Button>
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