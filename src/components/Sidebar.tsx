/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Radio,
  Sparkles,
  UserPlus,
  Users,
  Stethoscope,
  BedDouble,
  Activity,
  HeartPulse,
  Baby,
  Syringe,
  Scissors,
  Pill,
  FlaskConical,
  Scan,
  FileSpreadsheet,
  HeartHandshake,
  Video,
  ShieldCheck,
  Receipt,
  Warehouse,
  Boxes,
  Briefcase,
  Megaphone,
  BarChart3,
  Calendar,
  Settings,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Database,
  Droplet,
  Utensils,
  Truck,
  Flame,
  Brain,
  Globe,
  Bot,
  Network,
  Code2
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onSelectView: (viewId: string) => void;
}

interface NavGroup {
  groupName: string;
  items: {
    id: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    Utama: true,
    'Pelayanan Medis': true,
    'Penunjang & EMR': true,
    'Manajemen & Keuangan': false,
    'Sistem & Dok': true,
  });

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const navGroups: NavGroup[] = [
    {
      groupName: 'Utama',
      items: [
        { id: 'Dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'Command Center', label: 'Command Center', icon: Radio, badge: 'LIVE', badgeColor: 'bg-rose-500 text-white' },
        { id: 'AI Center', label: 'AI Center Platform', icon: Sparkles, badge: 'PRO', badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' },
      ],
    },
    {
      groupName: 'Pelayanan Medis',
      items: [
        { id: 'Pendaftaran', label: 'Pendaftaran & Admisi', icon: UserPlus },
        { id: 'Pasien', label: 'Master Data Pasien', icon: Users },
        { id: 'Rawat Jalan', label: 'Rawat Jalan (Poliklinik)', icon: Stethoscope },
        { id: 'Rawat Inap', label: 'Rawat Inap & Bed', icon: BedDouble },
        { id: 'IGD', label: 'IGD & Triage AI', icon: Activity, badge: '119', badgeColor: 'bg-red-500 text-white' },
        { id: 'ICU', label: 'ICU / HCU Monitor', icon: HeartPulse, badge: 'AI', badgeColor: 'bg-cyan-500 text-slate-950 font-bold' },
        { id: 'Kamar Operasi', label: 'Kamar Operasi (OK)', icon: Scissors, badge: 'WHO', badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
        { id: 'Nurse Station', label: 'Nurse Station', icon: HeartHandshake },
        { id: 'CDSS AI', label: 'CDSS & Voice AI', icon: Sparkles, badge: 'NEW', badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' },
        { id: 'Clinical Orders', label: 'e-Prescription & Orders', icon: Pill, badge: 'E-Rx', badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
      ],
    },
    {
      groupName: 'Penunjang & EMR',
      items: [
        { id: 'Laboratorium', label: 'Laboratorium Sentral (LIS)', icon: FlaskConical, badge: 'AI', badgeColor: 'bg-teal-500 text-slate-950 font-bold' },
        { id: 'Radiologi', label: 'Radiologi & PACS DICOM', icon: Scan, badge: 'CADx', badgeColor: 'bg-indigo-600 text-white font-bold' },
        { id: 'Bank Darah', label: 'Bank Darah & Transfusi', icon: Droplet, badge: 'P1', badgeColor: 'bg-rose-500 text-white' },
        { id: 'Gizi & Rehab', label: 'Gizi, Diet & Fisioterapi', icon: Utensils },
        { id: 'CSSD & Services', label: 'CSSD, Ambulans & Surat', icon: Truck },
        { id: 'Medical Support AI', label: 'AI Support Dashboard', icon: Brain, badge: 'PRO', badgeColor: 'bg-cyan-500 text-slate-950 font-bold' },
        { id: 'Farmasi', label: 'Smart Pharmacy & FEFO', icon: Pill, badge: 'AI', badgeColor: 'bg-teal-500 text-slate-950 font-bold' },
        { id: 'Medical Record', label: 'Rekam Medis (EMR)', icon: FileSpreadsheet },
        { id: 'Telemedicine', label: 'Telemedicine & AI', icon: Video },
        { id: 'BPJS', label: 'BPJS V-Claim & Bridging', icon: ShieldCheck, badge: 'VClaim', badgeColor: 'bg-indigo-600 text-white font-bold' },
      ],
    },
    {
      groupName: 'Enterprise & Bisnis',
      items: [
        { id: 'Keuangan', label: 'Keuangan & Billing RCM', icon: Receipt, badge: 'RCM', badgeColor: 'bg-emerald-500 text-slate-950 font-bold' },
        { id: 'Inventory', label: 'Inventory & Procurement', icon: Warehouse, badge: 'SCM', badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
        { id: 'Gudang', label: 'Multi-Gudang & Assets', icon: Boxes },
        { id: 'HRD', label: 'HRD, Payroll & Credential', icon: Briefcase, badge: 'SIP', badgeColor: 'bg-cyan-500 text-slate-950 font-bold' },
        { id: 'Marketing', label: 'CRM & Marketing Automation', icon: Megaphone, badge: 'WA', badgeColor: 'bg-rose-500 text-white font-bold' },
        { id: 'Executive BI', label: 'Executive BI & AI NLQ', icon: LayoutDashboard, badge: 'CEO', badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold' },
        { id: 'Smart Ecosystem', label: 'Smart AI Hospital Ecosystem', icon: Globe, badge: '6.0', badgeColor: 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500 text-slate-950 font-bold' },
        { id: 'AI Agent Ecosystem', label: 'Agentic AI Ecosystem', icon: Bot, badge: '7.0', badgeColor: 'bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 text-white font-bold' },
        { id: 'Healthcare Ecosystem', label: 'Healthcare Super Ecosystem', icon: Network, badge: '8.0', badgeColor: 'bg-gradient-to-r from-teal-400 via-emerald-500 to-cyan-500 text-slate-950 font-bold' },
        { id: 'Developer Platform', label: 'Developer & Studio PaaS', icon: Code2, badge: '9.0', badgeColor: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 text-white font-bold' },
        { id: 'Production Operations', label: 'Production Ops & Enterprise', icon: ShieldCheck, badge: '10.0', badgeColor: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-bold' },
      ],
    },
    {
      groupName: 'Sistem & Dok',
      items: [
        { id: 'Laporan', label: 'Laporan & Analytics', icon: BarChart3 },
        { id: 'Calendar', label: 'Kalender & Jadwal Operasi', icon: Calendar },
        { id: 'Settings', label: 'Master Data & Settings', icon: Settings },
        { id: 'Architecture Docs', label: 'Arsitektur & DB Schema', icon: Database, badge: 'PGSQL', badgeColor: 'bg-indigo-600 text-white' },
      ],
    },
  ];

  return (
    <aside
      className={`relative z-20 flex flex-col border-r border-slate-800 bg-slate-950 text-slate-300 transition-all duration-300 custom-scrollbar ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-5 z-40 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 shadow-lg hover:border-cyan-500 hover:text-cyan-400 transition"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Sidebar Header / Brand Subtitle */}
      {!collapsed && (
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>NAVIGASI MODUL HMS</span>
            <span className="text-[10px] text-cyan-400 font-mono">v1.0-TAHAP1</span>
          </div>
        </div>
      )}

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.groupName] ?? true;

          return (
            <div key={group.groupName} className="space-y-1">
              {!collapsed && (
                <button
                  onClick={() => toggleGroup(group.groupName)}
                  className="flex w-full items-center justify-between px-2.5 py-1 text-[11px] font-bold tracking-wider text-slate-400 uppercase hover:text-slate-200 transition"
                >
                  <span>{group.groupName}</span>
                  {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                </button>
              )}

              {(isOpen || collapsed) && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectView(item.id)}
                        title={collapsed ? item.label : undefined}
                        className={`group relative flex w-full items-center rounded-xl px-2.5 py-2 text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold shadow-md shadow-blue-500/20'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-cyan-400'
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 shrink-0 transition-transform ${
                            isActive ? 'text-white' : 'text-slate-400 group-hover:text-cyan-400 group-hover:scale-110'
                          }`}
                        />

                        {!collapsed && (
                          <div className="ml-3 flex flex-1 items-center justify-between overflow-hidden">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                                  item.badgeColor || 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {isActive && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-cyan-400 shadow-glow" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Footer Status */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-[11px] text-slate-400">
              Microservices REST API: <span className="font-mono text-emerald-400">Online</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
