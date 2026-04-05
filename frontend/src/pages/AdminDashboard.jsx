import React from 'react';
import { Helmet } from 'react-helmet';
import { NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, FileText, Users, Bell, UserCircle, LogOut, Briefcase, FilePlus, FileSignature, ListChecks, HelpCircle, Shield, LifeBuoy, Database, FileJson, Megaphone, Globe, Settings
} from 'lucide-react';
import DashboardView from '@/components/Admin/DashboardView';
import ApplicationsView from '@/components/Admin/ApplicationsView';
import VisaManagementView from '@/components/Admin/VisaManagementView';
import CoveringLetterView from '@/components/Admin/CoveringLetterView';
import ChecklistManagerView from '@/components/Admin/ChecklistManagerView';
import FaqManagerView from '@/components/Admin/FaqManagerView';
import UserManagementView from '@/components/Admin/UserManagementView';
import RolesPermissionsView from '@/components/Admin/RolesPermissionsView';

const normalizeRole = (role) => String(role || '').toLowerCase().replace(/[\s-]+/g, '_');

const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem('authUser') || 'null');
  } catch {
    return null;
  }
};

const roleLabel = (role) => {
  const normalized = normalizeRole(role);
  if (normalized === 'super_admin' || normalized === 'admin') {
    return 'Super Admin';
  }
  if (normalized === 'team') {
    return 'Team';
  }
  return 'User';
};

const AdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = getAuthUser();
  const normalizedRole = normalizeRole(authUser?.role);
  const isSuperAdmin = normalizedRole === 'super_admin' || normalizedRole === 'admin';
  const displayName = authUser?.fullName || authUser?.phone || 'Admin User';
  const currentAdminPath = location.pathname.replace(/^\/admin\/?/, '');

  const renderCurrentView = () => {
    if (!currentAdminPath) {
      return <DashboardView />;
    }

    if (currentAdminPath === 'applications') {
      return <ApplicationsView />;
    }

    if (currentAdminPath === 'visa-management') {
      return <VisaManagementView />;
    }

    if (currentAdminPath === 'covering-letters') {
      return <CoveringLetterView />;
    }

    if (currentAdminPath === 'checklists') {
      return <ChecklistManagerView />;
    }

    if (currentAdminPath === 'faqs') {
      return <FaqManagerView />;
    }

    if (currentAdminPath === 'users') {
      return <UserManagementView />;
    }

    // if (currentAdminPath === 'content-management') {
    //   return isSuperAdmin ? <ContentManagerView /> : <Navigate to="/admin" replace />;
    // }

    if (currentAdminPath === 'roles') {
      return isSuperAdmin ? <RolesPermissionsView /> : <Navigate to="/admin" replace />;
    }

    return <Navigate to="/admin" replace />;
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Stamp2Fly</title>
        <meta name="description" content="Manage visa applications, website content, SEO, and users." />
      </Helmet>
      <div className="flex min-h-screen bg-slate-100 font-sans">
        <Sidebar onLogout={handleLogout} isSuperAdmin={isSuperAdmin} />
        <div className="flex-1 flex flex-col lg:ml-64">
          <AdminHeader displayName={displayName} roleText={roleLabel(normalizedRole)} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderCurrentView()}
          </main>
        </div>
      </div>
    </>
  );
};

const Sidebar = ({ onLogout, isSuperAdmin }) => {
  const mainNav = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/applications', icon: FileText, label: 'Applications' },
  ];

  const contentNav = [
    { path: '/admin/visa-management', icon: Briefcase, label: 'Visa Management' },
    { path: '/admin/checklists', icon: ListChecks, label: 'Checklists' },
    { path: '/admin/faqs', icon: HelpCircle, label: 'FAQ' },
    { path: '/admin/covering-letters', icon: FileSignature, label: 'Covering Letters' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    ...(isSuperAdmin
      ? [
          // { path: '/admin/content-management', icon: FileJson, label: 'Content' },
          { path: '/admin/roles', icon: Shield, label: 'Roles & Permissions' },
        ]
      : []),
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
         <div className="inline-block w-8 h-8 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg items-center justify-center mr-2">
            <span className="text-white font-bold text-xl">S</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tighter">Stamp2Fly</span>
      </div>
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        <NavGroup items={mainNav} />
        <NavGroup title="Content" items={contentNav} />
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

const AdminHeader = ({ displayName, roleText }) => (
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
            <p className="text-sm font-semibold text-slate-800">{displayName}</p>
            <p className="text-xs text-slate-500">{roleText}</p>
        </div>
      </div>
    </div>
  </header>
);

export default AdminDashboard;