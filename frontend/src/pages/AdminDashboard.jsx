import React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Users, Bell, UserCircle, LogOut, Briefcase, FilePlus, FileSignature, ListChecks, HelpCircle, Shield, LifeBuoy, Database, FileJson, Megaphone, Globe, Settings
} from 'lucide-react';
import DashboardView from '@/components/Admin/DashboardView';
import ApplicationsView from '@/components/Admin/ApplicationsView';
import VisaManagementView from '@/components/Admin/VisaManagementView';
import AutomatedFormsView from '@/components/Admin/AutomatedFormsView';
import CoveringLetterView from '@/components/Admin/CoveringLetterView';
import ChecklistManagerView from '@/components/Admin/ChecklistManagerView';
import FaqManagerView from '@/components/Admin/FaqManagerView';
import UserManagementView from '@/components/Admin/UserManagementView';
import SupportPanelView from '@/components/Admin/SupportPanelView';
import RolesPermissionsView from '@/components/Admin/RolesPermissionsView';
import DataMigrationView from '@/components/Admin/DataMigrationView';
import SeoManagerView from '@/components/Admin/SeoManagerView';
import VisitorManagementView from '@/components/Admin/VisitorManagementView';
import ContentManagerView from '@/components/Admin/ContentManagerView';
import SiteSettingsView from '@/components/Admin/SiteSettingsView';

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/admin/login');
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Stamp2Fly</title>
        <meta name="description" content="Manage visa applications, website content, SEO, and users." />
      </Helmet>
      <div className="flex min-h-screen bg-slate-100 font-sans">
        <Sidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <AdminHeader onLogout={handleLogout} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardView />} />
              <Route path="/applications" element={<ApplicationsView />} />
              <Route path="/visa-management" element={<VisaManagementView />} />
              <Route path="/automated-forms" element={<AutomatedFormsView />} />
              <Route path="/covering-letters" element={<CoveringLetterView />} />
              <Route path="/checklists" element={<ChecklistManagerView />} />
              <Route path="/faqs" element={<FaqManagerView />} />
              <Route path="/content-management" element={<ContentManagerView />} />
              <Route path="/seo-management" element={<SeoManagerView />} />
              <Route path="/users" element={<UserManagementView />} />
              <Route path="/visitors" element={<VisitorManagementView />} />
              <Route path="/site-settings" element={<SiteSettingsView />} />
              <Route path="/support" element={<SupportPanelView />} />
              <Route path="/roles" element={<RolesPermissionsView />} />
              <Route path="/data-migration" element={<DataMigrationView />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
};

const Sidebar = ({ onLogout }) => {
  const mainNav = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/applications', icon: FileText, label: 'Applications' },
  ];
  
  const contentNav = [
    { path: '/admin/visa-management', icon: Briefcase, label: 'Visa Management' },
    { path: '/admin/checklists', icon: ListChecks, label: 'Checklists' },
    { path: '/admin/faqs', icon: HelpCircle, label: 'FAQ' },
    { path: '/admin/content-management', icon: FileJson, label: 'Content' },
  ];

  const automationNav = [
    { path: '/admin/automated-forms', icon: FilePlus, label: 'Automated Forms' },
    { path: '/admin/covering-letters', icon: FileSignature, label: 'Covering Letters' },
  ];

  const growthNav = [
    { path: '/admin/seo-management', icon: Megaphone, label: 'SEO' },
    { path: '/admin/visitors', icon: Globe, label: 'Visitor Analytics' },
  ];
  
  const siteManagementNav = [
    { path: '/admin/site-settings', icon: Settings, label: 'Site Settings' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/roles', icon: Shield, label: 'Roles & Permissions' },
  ];

  const supportNav = [
    { path: '/admin/support', icon: LifeBuoy, label: 'Support Center' },
    { path: '/admin/data-migration', icon: Database, label: 'Data & Migration' },
  ];

  const NavGroup = ({ title, items }) => (
    <div>
      {title && <h3 className="px-4 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>}
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/admin'}
          className={({ isActive }) => `flex items-center space-x-3 mx-2 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
            isActive
              ? 'bg-slate-900 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
          }`}
        >
          <item.icon className="w-5 h-5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </div>
  );

  return (
    <motion.div 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-64 bg-slate-800 text-white flex-col fixed h-full z-40 hidden lg:flex"
    >
      <div className="flex items-center justify-center h-20 border-b border-slate-700/50">
         <div className="inline-block w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mr-2">
            <span className="text-white font-bold text-xl">S</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tighter">Stamp2Fly</span>
      </div>
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        <NavGroup items={mainNav} />
        <NavGroup title="Content" items={contentNav} />
        <NavGroup title="Automation" items={automationNav} />
        <NavGroup title="Growth" items={growthNav} />
        <NavGroup title="Site Management" items={siteManagementNav} />
        <NavGroup title="Support & Data" items={supportNav} />
      </nav>
      <div className="px-4 py-4 border-t border-slate-700/50">
        <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 mx-2 px-3 py-2.5 rounded-md transition-colors text-sm font-medium text-slate-400 hover:bg-slate-700/50 hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
      </div>
    </motion.div>
  );
};

const AdminHeader = ({ onLogout }) => (
  <header className="bg-white/80 backdrop-blur-sm h-20 border-b flex items-center justify-between px-8 sticky top-0 z-30">
    <div>
      {/* Breadcrumbs or dynamic page title can be added here */}
    </div>
    <div className="flex items-center space-x-6">
       <button className="text-slate-500 hover:text-slate-800 relative">
        <Bell className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="flex items-center space-x-3 cursor-pointer group">
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
            <UserCircle className="w-6 h-6 text-slate-500" />
        </div>
        <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
        </div>
      </div>
    </div>
  </header>
);

export default AdminDashboard;