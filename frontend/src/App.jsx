import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from '@/pages/HomePage';
import ApplicationPage from '@/pages/ApplicationPage';
import PricingPage from '@/pages/PricingPage';
import AdminDashboard from '@/pages/AdminDashboard';
import VisaRequirementPage from '@/pages/VisaRequirementPage';
import AdminLogin from '@/pages/AdminLogin';
import FaqPage from '@/pages/FaqPage';
import ContactPage from '@/pages/ContactPage';
import ConsultationPage from '@/pages/ConsultationPage';
import PaymentPage from '@/pages/PaymentPage';
import { Toaster } from '@/components/ui/toaster';
import { VisaProvider } from '@/contexts/VisaContext';
import { ApplicationProvider } from '@/contexts/ApplicationContext';
import AboutUsPage from './pages/AboutUsPage';
import ServicesPage from './pages/ServicesPage';
import UaeVisaStatusPage from './pages/UaeVisaStatusPage';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('isAdminAuthenticated') === 'true');

  const login = () => {
    localStorage.setItem('isAdminAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
};

const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  
  return (
    <HelmetProvider>
      <ApplicationProvider>
        <VisaProvider>
          <Router>
            <div className="min-h-screen bg-white font-sans">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/visa-requirements/:destination" element={<VisaRequirementPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/apply" element={<ApplicationPage />} />
                <Route path="/financial-documents" element={<Navigate to="/apply" replace />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/consultation" element={<ConsultationPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/uae-visa-status" element={<UaeVisaStatusPage />} />
                
                <Route path="/admin/login" element={<AdminLogin onLogin={login} />} />
                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <AdminDashboard onLogout={logout} />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </VisaProvider>
      </ApplicationProvider>
    </HelmetProvider>
  );
}

export default App;
