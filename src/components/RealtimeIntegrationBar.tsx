/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  FileText,
  Pill,
  TestTube,
  Radio,
  Bed,
  CreditCard,
  Calendar,
  Zap,
  RefreshCw,
  Sparkles,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Database
} from 'lucide-react';
import { useHospitalData } from '../context/HospitalDataContext';

export const RealtimeIntegrationBar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedPatient,
    navigateToPatientModule,
    isRealtimeActive,
    setIsRealtimeActive,
    lastSyncedTime,
    triggerSimulatedLiveUpdate,
    liveMetrics,
    activityLogs
  } = useHospitalData();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const activeModuleLinks = [
    { label: 'EMR', view: 'Medical Record', icon: FileText, color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40' },
    { label: 'Poli', view: 'Rawat Jalan', icon: Building2, color: 'text-indigo-400 bg-indigo-950/60 border-indigo-500/40' },
    { label: 'IGD', view: 'IGD', icon: Activity, color: 'text-rose-400 bg-rose-950/60 border-rose-500/40' },
    { label: 'Resep Farmasi', view: 'Farmasi', icon: Pill, color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' },
    { label: 'Lab LIS', view: 'Laboratorium', icon: TestTube, color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
    { label: 'Radiologi', view: 'Radiologi', icon: Radio, color: 'text-teal-400 bg-teal-950/60 border-teal-500/40' },
    { label: 'Rawat Inap', view: 'Rawat Inap', icon: Bed, color: 'text-blue-400 bg-blue-950/60 border-blue-500/40' },
    { label: 'Billing / BPJS', view: 'Keuangan', icon: CreditCard, color: 'text-violet-400 bg-violet-950/60 border-violet-500/40' },
    { label: 'Jadwal OK', view: 'Kamar Operasi', icon: Calendar, color: 'text-purple-400 bg-purple-950/60 border-purple-500/40' }
  ];

  return (
    <div className="bg-slate-950 border-b border-cyan-500/30 text-slate-100 px-4 py-2 text-xs shadow-xl relative z-20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Real-time Status Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRealtimeActive(!isRealtimeActive)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold border transition-all ${
              isRealtimeActive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Klik untuk Jeda/Aktifkan Sinkronisasi Real-Time"
          >
            <span className={`h-2 w-2 rounded-full ${isRealtimeActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
            <span>{isRealtimeActive ? 'LIVE SYNC REAL-TIME' : 'PAUSED'}</span>
          </button>

          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Sync Time: {lastSyncedTime}
          </span>

          <button
            onClick={triggerSimulatedLiveUpdate}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 hover:bg-slate-800 hover:text-cyan-300 transition"
            title="Pemicu Manual Simulasi Real-Time"
          >
            <RefreshCw className="h-3.5 w-3.5 animate-spin-once" />
          </button>
        </div>

        {/* Selected Active Patient Cross-Link Launcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl">
          <UserCheck className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="hidden sm:block text-[11px]">
            <span className="text-slate-400">Pasien Terpilih: </span>
            <strong className="text-white font-bold">{selectedPatient.name}</strong>
            <span className="text-cyan-300 font-mono ml-1.5">({selectedPatient.medicalRecordNumber})</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar max-w-xs md:max-w-md lg:max-w-none">
            {activeModuleLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => navigateToPatientModule(selectedPatient, item.view)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-extrabold border-cyan-400 shadow-md'
                      : `${item.color} hover:brightness-125`
                  }`}
                  title={`Lompat Langsung ke ${item.label} Pasien Ini`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Metrics Pulse Summary */}
        <div className="hidden xl:flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">Pasien:</span>
            <span className="text-cyan-300 font-bold">{liveMetrics.totalPatientsToday}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">BOR:</span>
            <span className="text-emerald-300 font-bold">{liveMetrics.borPct}%</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <span className="text-slate-400">ICU:</span>
            <span className="text-rose-400 font-bold">{liveMetrics.activeICU} Bed</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Database className="h-3 w-3 text-indigo-400" />
            <span className="text-indigo-300 font-bold">{liveMetrics.satuSehatSyncedCount} FHIR</span>
          </div>
        </div>

        {/* Toggle Realtime Logs Expand Drawer */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition"
        >
          <span>Stream Event Live ({activityLogs.length})</span>
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Expanded Live Event Stream Stream Log */}
      {isExpanded && (
        <div className="mt-2 pt-2 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-1">
          <div className="md:col-span-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2 max-h-36 overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1">
              <span>STREAM AKTIVITAS & INTEGRASI INTER-MODUL REAL-TIME</span>
              <span className="text-emerald-400">✓ Auto-Sync Active</span>
            </div>
            <div className="space-y-1">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-center justify-between text-[11px] font-mono py-0.5 border-b border-slate-800/50 last:border-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-cyan-400 font-bold">[{log.timestamp}]</span>
                    <span className="text-slate-300 font-sans truncate">{log.actionName}</span>
                  </div>
                  <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-indigo-300 border border-slate-700 shrink-0">
                    {log.moduleName}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-slate-400 border-b border-slate-800 pb-1 flex items-center justify-between">
                <span>MATRIKS CROSS-LINK LIVE</span>
                <Sparkles className="h-3 w-3 text-amber-400" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
                <div>
                  <span className="text-slate-400 block">PENDING FARMASI:</span>
                  <span className="text-amber-400 font-bold font-mono">{liveMetrics.pendingPharmacy} Resep</span>
                </div>
                <div>
                  <span className="text-slate-400 block">PASIEN IGD ACTIVE:</span>
                  <span className="text-rose-400 font-bold font-mono">{liveMetrics.activeIGD} Pasien</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                triggerSimulatedLiveUpdate();
                alert('Pemicu Simulasi Real-Time Berhasil! Data Vitals ICU, Resep Farmasi, & SATUSEHAT updated.');
              }}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 py-1.5 text-[10px] font-bold text-white shadow hover:brightness-110 transition flex items-center justify-center gap-1"
            >
              <Zap className="h-3 w-3 text-amber-300" />
              <span>Simulasi Event Medis Baru</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
