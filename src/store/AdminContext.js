"use client";

import React, { createContext, useContext, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentUser = session?.user ? {
    id: session.user.id,
    name: session.user.name || 'Admin User',
    email: session.user.email,
    role: session.user.role || 'super_admin',
  } : null;

  const state = {
    currentUser,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <AdminContext.Provider value={{
      state,
      logout,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar
    }}>
      {children}
    </AdminContext.Provider>
  );
}



export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
