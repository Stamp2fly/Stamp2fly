import React, { createContext, useState, useContext, useCallback } from 'react';
import { toast } from '@/components/ui/use-toast';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentApplication, setCurrentApplication] = useState(() => {
    const saved = sessionStorage.getItem('currentApplication');
    return saved ? JSON.parse(saved) : null;
  });

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };
  
  const saveToSessionStorage = (key, data) => {
    sessionStorage.setItem(key, JSON.stringify(data));
  };

  const startApplication = (initialData) => {
    const app = { ...initialData, id: `APP-${Date.now()}` };
    setCurrentApplication(app);
    saveToSessionStorage('currentApplication', app);
    return app;
  };

  const updateCurrentApplication = (updates) => {
    setCurrentApplication(prev => {
      const newApp = { ...prev, ...updates };
      saveToSessionStorage('currentApplication', newApp);
      return newApp;
    });
  };

  const submitCurrentApplication = (finalData) => {
    const appToSubmit = { ...currentApplication, ...finalData, submittedAt: new Date().toISOString() };
    setApplications(prev => {
      const updatedApps = [...prev, appToSubmit];
      saveToLocalStorage('applications', updatedApps);
      return updatedApps;
    });
    sessionStorage.removeItem('currentApplication');
    setCurrentApplication(null);
    return appToSubmit;
  };


  const value = {
    applications,
    currentApplication,
    startApplication,
    updateCurrentApplication,
    submitCurrentApplication,
  };

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};