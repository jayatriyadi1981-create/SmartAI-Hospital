/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import { User, UserRole } from '../types';
import { INITIAL_HOSPITAL } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentRole: UserRole;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-1001',
  name: 'Dr. dr. Hendra Prasetyo, Sp.PD, MARS',
  email: 'direktur.hendra@smartmedika.go.id',
  role: 'Direktur',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200',
  department: 'Direksi Utama',
  hospitalId: INITIAL_HOSPITAL.id,
  hospitalName: INITIAL_HOSPITAL.name,
  mfaEnabled: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEFAULT_USER);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const login = (email: string, role: UserRole = 'Direktur') => {
    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: email.split('@')[0].toUpperCase().replace('.', ' '),
      email: email,
      role: role,
      avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200',
      department: role === 'Dokter' || role === 'Dokter Spesialis' ? 'Pelayanan Medis' : 'Manajemen',
      hospitalId: INITIAL_HOSPITAL.id,
      hospitalName: INITIAL_HOSPITAL.name,
      mfaEnabled: true,
    };
    setUser(newUser);
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    setShowLoginModal(true);
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        currentRole: user?.role || 'Direktur',
        login,
        logout,
        switchRole,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
