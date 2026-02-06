import React from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight, BarChart2, MapPin, Monitor } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

const VisitorManagementView = () => {
    const trafficData = [
        { name: 'Mon', visitors: 400 },
        { name: 'Tue', visitors: 300 },
        { name: 'Wed', visitors: 600 },
        { name: 'Thu', visitors: 800 },
        { name: 'Fri', visitors: 700 },
        { name: 'Sat', visitors: 900 },
        { name: 'Sun', visitors: 1100 },
    ];
    
    const countryData = [
        { name: 'India', value: 400, fill: '#4ade80' },
        { name: 'USA', value: 300, fill: '#3b82f6' },
        { name: 'UAE', value: 200, fill: '#facc15' },
        { name: 'UK', value: 100, fill: '#f87171' },
    ];

    const topPages = [
        { path: '/visa-requirements/united-arab-emirates', views: '2,450' },
        { path: '/', views: '1,890' },
        { path: '/pricing', views: '980' },
        { path: '/contact', views: '450' },
    ];
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-8">
            <motion.h1 variants={itemVariants} className="text-3xl font-bold text-slate-800">Visitor Analytics</motion.h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><BarChart2 className="w-5 h-5 mr-2 text-blue-500"/>Traffic This Week</h2>
                    <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trafficData}>
                                <XAxis dataKey="name" tick={{fill: '#475569', fontSize: 12}}/>
                                <YAxis tick={{fill: '#475569', fontSize: 12}}/>
                                <Tooltip cursor={{fill: 'rgba(241, 245, 249, 0.5)'}} contentStyle={{background: '#fff', border: '1px solid #e2e8f0', borderRadius: '0.5rem'}}/>
                                <Bar dataKey="visitors" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><MapPin className="w-5 h-5 mr-2 text-emerald-500"/>Visitors by Country</h2>
                    <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                                <Pie data={countryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} >
                                    {countryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                 <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Monitor className="w-5 h-5 mr-2 text-purple-500"/>Top Pages</h2>
                 <div className="space-y-3">
                     {topPages.map(page => (
                         <div key={page.path} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                             <p className="font-medium text-slate-700 truncate">{page.path}</p>
                             <p className="font-bold text-slate-800">{page.views} views</p>
                         </div>
                     ))}
                 </div>
            </motion.div>
        </motion.div>
    );
};

export default VisitorManagementView;