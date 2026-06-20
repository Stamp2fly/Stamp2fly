import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Save, User, Shield, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { getTeamMembers, createAdminUser, deleteAdminUser } from '@/api/adminApi';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RolesPermissionsView = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const authUser = JSON.parse(localStorage.getItem('authUser') || 'null');
  const isSuperAdmin = authUser?.role === 'super_admin';
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [teamForm, setTeamForm] = useState({ fullName: '', phone: '', email: '', role: 'team' });
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const data = await getTeamMembers();
        setTeamMembers(data || []);
      } catch (error) {
        toast({
          title: 'Failed to load team members',
          description: error?.response?.data?.message || 'Could not load team members.',
          variant: 'destructive',
        });
        console.error('Team members fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [toast]);

  const handleAddUser = () => {
    toast({ 
      title: "Feature not enabled", 
      description: "Use the User Management page to create team members.",
      variant: 'info'
    });
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!isSuperAdmin || teamForm.role !== 'team') {
      toast({
        title: 'Access denied',
        description: 'Only super admin can create team accounts.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const payload = {
        fullName: teamForm.fullName,
        phone: teamForm.phone,
        role: 'team',
      };
      if (teamForm.email && teamForm.email.trim() !== '') payload.email = teamForm.email.trim();

      const newTeamMember = await createAdminUser(payload);

      setTeamMembers((prev) => [newTeamMember, ...(prev || [])]);

      toast({
        title: 'Team member created',
        description: `${newTeamMember.fullName} has been added as team member.`,
        className: 'bg-emerald-600 text-white',
      });

      setTeamForm({ fullName: '', phone: '', email: '', role: 'team' });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Failed to create team member',
        description: error?.response?.data?.message || 'An error occurred.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!userId) return;
    const confirmDelete = window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`);
    if (!confirmDelete) return;

    try {
      await deleteAdminUser(userId);
      setTeamMembers((prev) => (prev || []).filter((m) => m._id !== userId));
      toast({
        title: 'User deleted',
        description: `${userName} has been removed.`,
        className: 'bg-green-500 text-white',
      });
    } catch (error) {
      toast({
        title: 'Delete failed',
        description: error?.response?.data?.message || 'Could not delete user.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = () => {
    toast({ 
      title: "Roles Saved!", 
      description: "Team member roles have been confirmed.",
      className: "bg-green-500 text-white"
    });
  };

  const filteredTeamMembers = teamMembers.filter(member =>
    (member.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.email || member.phone || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Roles & Permissions</h1>
        <div className="flex space-x-4">
            {isSuperAdmin && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Team Member
                  </Button>
                </DialogTrigger>
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
            )}
            <Button onClick={handleSave} className="bg-slate-800 hover:bg-slate-900 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input 
            placeholder="Search team members..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-4">Team Member</th>
                <th scope="col" className="px-6 py-4">Role</th>
                <th scope="col" className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTeamMembers.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center py-10 text-slate-500">
                    No team members found
                  </td>
                </tr>
              )}
              {filteredTeamMembers.map(member => (
                <tr key={member._id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                        {(member.fullName || member.phone || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{member.fullName || 'Team Member'}</div>
                        <div className="text-sm text-gray-500">{member.email || member.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-gray-500" />
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                        Team
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteUser(member._id, member.fullName)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Team Role Information</h3>
        <p className="text-sm text-blue-800">
          All team members have the <strong>Team</strong> role, which allows them to manage applications, visit records, user data, and visa-related content. They cannot access role management or create other team members.
        </p>
      </div>
    </motion.div>
  );
};

export default RolesPermissionsView;