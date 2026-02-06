import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Inbox, CheckCircle, Clock, User, MessageSquare } from 'lucide-react';

const mockTickets = [
  { id: 8810, subject: "Question about photo specs", user: "John Doe", status: "Open", priority: "High", agent: "Unassigned" },
  { id: 8811, subject: "Payment failed", user: "Mary J.", status: "In Progress", priority: "High", agent: "Alice" },
  { id: 8812, subject: "How to track my application?", user: "Peter Jones", status: "Resolved", priority: "Low", agent: "Bob" },
];

const statusConfig = {
    Open: { color: 'red', icon: Inbox },
    'In Progress': { color: 'yellow', icon: Clock },
    Resolved: { color: 'emerald', icon: CheckCircle },
};
const agents = ['Alice', 'Bob', 'Charlie', 'Unassigned'];

const SupportPanelView = () => {
    const [tickets, setTickets] = useState(mockTickets);
    const { toast } = useToast();

    const handleTicketUpdate = (id, field, value) => {
        setTickets(tickets.map(t => t.id === id ? { ...t, [field]: value } : t));
        toast({ title: `Ticket #${id} Updated`, description: `${field} set to ${value}`});
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-800">Support Panel</h1>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-4">Ticket ID</th>
                                <th className="px-6 py-4">Subject</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Agent</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => {
                                const Icon = statusConfig[ticket.status].icon;
                                const color = statusConfig[ticket.status].color;
                                return (
                                <tr key={ticket.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-800">#{ticket.id}</td>
                                    <td className="px-6 py-4">{ticket.subject}</td>
                                    <td className="px-6 py-4">{ticket.user}</td>
                                    <td className="px-6 py-4">
                                        <Select value={ticket.status} onValueChange={(val) => handleTicketUpdate(ticket.id, 'status', val)}>
                                            <SelectTrigger className={`w-[150px] text-xs font-semibold h-8 border-${color}-300 bg-${color}-100 text-${color}-800`}>
                                                <div className="flex items-center">
                                                    <Icon className={`mr-2 h-4 w-4`}/>
                                                    <SelectValue />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.keys(statusConfig).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Select value={ticket.agent} onValueChange={(val) => handleTicketUpdate(ticket.id, 'agent', val)}>
                                            <SelectTrigger className="w-[150px] h-8"><SelectValue /></SelectTrigger>
                                            <SelectContent>{agents.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                                        </Select>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="mr-2 h-4 w-4"/> View
                                        </Button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default SupportPanelView;