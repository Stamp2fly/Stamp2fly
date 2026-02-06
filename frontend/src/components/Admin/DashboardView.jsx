import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileCheck, Clock, DollarSign, AlertTriangle, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DashboardView = () => {
    const stats = [
        { label: 'Applications Received', value: '1,254', change: '+12.5%', icon: FileCheck, color: 'blue' },
        { label: 'Pending Documents', value: '18', change: '+3 new', icon: AlertTriangle, color: 'red' },
        { label: 'Total Revenue', value: '₹8,54,300', change: '+20.1%', icon: DollarSign, color: 'emerald' },
        { label: 'Active Users', value: '821', change: '+56 this week', icon: Users, color: 'purple' },
    ];

    const applicationStatusData = [
      { name: 'Approved', value: 450, color: 'var(--color-emerald)' },
      { name: 'In Progress', value: 300, color: 'var(--color-blue)' },
      { name: 'Action Needed', value: 150, color: 'var(--color-yellow)' },
      { name: 'Rejected', value: 50, color: 'var(--color-red)' },
    ];

    const recentActivities = [
        { text: 'New application from John Doe for USA visa.', time: '2m ago', user: 'JD' },
        { text: 'Missing bank statement for Jane Smith (S2F-1003).', time: '1h ago', user: 'JS' },
        { text: 'Payment of ₹6800 received from David W.', time: '2h ago', user: 'DW' },
        { text: 'Support ticket #8812 resolved.', time: '3h ago', user: 'AD' },
    ];
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-slate-800">Dashboard</motion.h1>
            
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(stat => (
                    <motion.div key={stat.label} variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border-t-4" style={{ borderTopColor: `var(--color-${stat.color})` }}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-3xl font-bold text-slate-800 my-2">{stat.value}</p>
                                <p className={`text-sm font-medium text-${stat.color}-600`}>{stat.change}</p>
                            </div>
                            <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                                <stat.icon className={`w-6 h-6 text-${stat.color}-800`} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <motion.div variants={itemVariants} className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Application Status</h2>
                    <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={applicationStatusData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={90}/>
                                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}}/>
                                <Bar dataKey="value" barSize={25} radius={[0, 5, 5, 0]}>
                                    {applicationStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                             <motion.div key={index} variants={itemVariants} className="flex items-start space-x-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm flex-shrink-0">{activity.user}</div>
                                <div className="flex-grow">
                                    <p className="text-sm text-slate-700 leading-tight">{activity.text}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                                </div>
                                <button className="text-slate-400 hover:text-slate-700">
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};
export default DashboardView;