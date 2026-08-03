/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Clock,
  CloudSun,
  Shield,
  ChevronDown,
  User as UserIcon,
  LogOut,
  Sparkles,
  PhoneCall,
  UserPlus,
  PlusCircle,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onNavigate: (viewId: string) => void;
  onOpenLandingPage?: () => void;
}

const ALL_ROLES: UserRole[] = [
  'Super Admin',
  'Hospital Owner',
  'Direktur',
  'Wakil Direktur',
  'Manajemen',
  'Dokter',
  'Dokter Spesialis',
  'Perawat',
  'Bidan',
  'Farmasi',
  'Laboratorium',
  'Radiologi',
  'Kasir',
  'Pendaftaran',
  'Keuangan',
  'HRD',
  'Gudang',
  'Teknisi',
  'Marketing',
  'Customer Service',
  'IT Support',
  'Pasien'
];

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenNotifications,
  unreadCount,
  onNavigate,
  onOpenLandingPage
}) => {
  const { user, currentRole, switchRole, logout, setShowLoginModal } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [timeString, setTimeString] = useState<string>('');
  const [dateString, setDateString] = useState<string>('');
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' WIB'
      );
      setDateString(
        now.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-slate-900/90 px-4 text-slate-100 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/90 transition-colors">
      {/* Left: Hospital Info & Realtime Clock */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onOpenLandingPage ? onOpenLandingPage() : onNavigate('Dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
          title="Kembali ke Landing Page Utama"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-2 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                RSUD SMART MEDIKA
              </h1>
              <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300 border border-cyan-500/30">
                Kelas A
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Hospital AI Platform Enterprise</p>
          </div>
        </div>

        {/* Real-time Clock & Weather */}
        <div className="hidden lg:flex items-center gap-3 border-l border-slate-800 pl-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="font-mono font-medium text-cyan-300">{timeString}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">{dateString}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/50">
            <CloudSun className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-medium text-slate-200">28°C Jakarta</span>
            <span className="text-[10px] text-slate-400">(Cerah)</span>
          </div>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex-1 max-w-md mx-4">
        <button
          onClick={onOpenSearch}
          className="group flex w-full items-center justify-between rounded-xl border border-slate-700/60 bg-slate-800/50 px-3.5 py-2 text-xs text-slate-400 hover:border-cyan-500/50 hover:bg-slate-800/80 transition"
        >
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-slate-400 group-hover:text-cyan-400 transition" />
            <span>Cari Pasien, RM, Dokter, Obat, Invoice (Ctrl+K)...</span>
          </div>
          <kbd className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Menu */}
        <div className="relative">
          <button
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-cyan-500 transition"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="hidden md:inline">Aksi Cepat</span>
            <ChevronDown className="h-3.5 w-3.5 opacity-80" />
          </button>

          {showQuickActions && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Aksi Cepat Medis
              </div>
              <button
                onClick={() => {
                  onNavigate('Pendaftaran');
                  setShowQuickActions(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-cyan-400 transition"
              >
                <UserPlus className="h-4 w-4 text-cyan-400" />
                Pendaftaran Pasien Baru
              </button>
              <button
                onClick={() => {
                  onNavigate('AI Center');
                  setShowQuickActions(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-200 hover:bg-slate-800 hover:text-cyan-400 transition"
              >
                <Sparkles className="h-4 w-4 text-indigo-400" />
                Konsultasi Clinical AI
              </button>
              <button
                onClick={() => {
                  onNavigate('Command Center');
                  setShowQuickActions(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition"
              >
                <PhoneCall className="h-4 w-4 text-rose-400" />
                Panggil Ambulance / Code Red
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700 hover:text-white transition"
          title="Notifikasi"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-slate-900 animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-800/60 text-slate-300 hover:border-slate-700 hover:text-white transition"
          title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400" />
          )}
        </button>

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-900/50 transition"
          >
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-semibold">{currentRole}</span>
            <ChevronDown className="h-3 w-3" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 custom-scrollbar">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-800 pb-1.5 mb-1">
                Ganti Role Akses (RBAC Testing)
              </div>
              {ALL_ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    switchRole(r);
                    setShowRoleMenu(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs text-left transition ${
                    currentRole === r
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{r}</span>
                  {currentRole === r && <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-800 transition"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-8 w-8 rounded-full border border-cyan-500/40 object-cover"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-60 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3 mb-2">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border border-cyan-500 object-cover"
                  />
                  <div className="overflow-hidden">
                    <div className="truncate text-xs font-bold text-white">{user.name}</div>
                    <div className="truncate text-[11px] text-slate-400">{user.email}</div>
                    <span className="inline-block mt-1 rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-cyan-300">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onNavigate('Settings');
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition"
                >
                  <UserIcon className="h-4 w-4 text-slate-400" />
                  Pengaturan Akun & Profil
                </button>

                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition mt-1"
                >
                  <LogOut className="h-4 w-4 text-rose-400" />
                  Keluar dari Sistem
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-500 transition"
          >
            Masuk / Login
          </button>
        )}
      </div>
    </header>
  );
};
