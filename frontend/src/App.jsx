import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from '@/pages/HomePage';
import ApplicationPage from '@/pages/ApplicationPage';
import PricingPage from '@/pages/PricingPage';
import AdminDashboard from '@/pages/AdminDashboard';
import FaqPage from '@/pages/FaqPage';
import ContactPage from '@/pages/ContactPage';
import ConsultationPage from '@/pages/ConsultationPage';
import PaymentPage from '@/pages/PaymentPage';
import AuthPage from '@/pages/AuthPage';
import UserDashboard from '@/pages/UserDashboard';
import BlogsPage from '@/pages/BlogsPage';
import BlogDetailsPage from '@/pages/BlogDetailsPage.jsx';
import { Toaster } from '@/components/ui/toaster';
import { VisaProvider } from '@/contexts/VisaContext';
import { ApplicationProvider } from '@/contexts/ApplicationContext';
import { FaqProvider } from '@/contexts/FaqContext';
import AboutUsPage from './pages/AboutUsPage';
import ServicesPage from './pages/ServicesPage';
// import UaeVisaStatusPage from './pages/UaeVisaStatusPage';

const normalizeRole = (role) => {
  if (!role || typeof role !== 'string') {
    return '';
  }

  return role.toLowerCase().replace(/[\s-]+/g, '_');
};

const isAdminRole = (role) => {
  const normalized = normalizeRole(role);
  return normalized === 'super_admin' || normalized === 'team' || normalized === 'admin';
};

const getRoleFromToken = (token) => {
  try {
    if (!token || token.split('.').length < 2) {
      return '';
    }
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.role || '';
  } catch {
    return '';
  }
};

const isTokenValid = (token) => {
  try {
    if (!token || token.split('.').length < 2) {
      return false;
    }

    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload?.exp) {
      return false;
    }

    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

const useAuth = () => {
  const readAuthState = () => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    let user = null;
    try {
      user = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      user = null;
    }

    const hasValidToken = isTokenValid(token);
    const role = hasValidToken ? (user?.role || getRoleFromToken(token)) : '';

    if (!hasValidToken && token) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }

    return {
      isAuthenticated: hasValidToken,
      isAdmin: isAdminRole(role),
    };
  };

  const login = () => {
    return readAuthState();
  };

  const logout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  const authState = readAuthState();

  return {
    ...authState,
    login,
    logout,
  };
};

const ProtectedRoute = ({ children, isAuthenticated, isAdmin }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AuthenticatedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const LegacyVisaRequirementRedirect = () => {
  const { destination } = useParams();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  if (destination) {
    params.set('destination', destination);
  }

  return <Navigate to={`/?${params.toString()}`} replace />;
};

function App() {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  
  return (
    <HelmetProvider>
      <ApplicationProvider>
        <VisaProvider>
          <FaqProvider>
            <Router>
              <div className="min-h-screen bg-white font-sans">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/visa-requirements/:destination" element={<LegacyVisaRequirementRedirect />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/apply" element={<ApplicationPage />} />
                  <Route path="/financial-documents" element={<Navigate to="/apply" replace />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/blogs" element={<BlogsPage />} />
                  <Route path="/blogs/:slug" element={<BlogDetailsPage />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route path="/signup" element={<AuthPage />} />
                  <Route
                    path="/dashboard"
                    element={
                      <AuthenticatedRoute isAuthenticated={isAuthenticated}>
                        <UserDashboard />
                      </AuthenticatedRoute>
                    }
                  />
                  <Route path="/admin/login" element={<Navigate to="/login" replace />} />
                  <Route path="/consultation" element={<ConsultationPage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  {/* <Route path="/uae-visa-status" element={<UaeVisaStatusPage />} /> */}
                  
                  <Route 
                    path="/admin/*" 
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated} isAdmin={isAdmin}>
                        <AdminDashboard onLogout={logout} />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </FaqProvider>
        </VisaProvider>
      </ApplicationProvider>
    </HelmetProvider>
  );
}

export default App;
