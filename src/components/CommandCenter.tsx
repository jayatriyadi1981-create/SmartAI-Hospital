import React, { useState } from 'react';
import {
  Radio,
  Building2,
  Bed,
  PhoneCall,
  Scissors,
  Activity,
  AlertTriangle,
  MapPin,
  Clock,
  ShieldAlert,
  Navigation,
  CheckCircle2,
  RefreshCw,
  Users,
  Zap,
  Flame,
  Send,
  Siren,
  Bot,
  Sparkles,
  Compass,
  BedDouble,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import {
  BUILDINGS_STATUS,
  OPERATING_ROOMS,
  AMBULANCES
} from '../data/mockData';

export const CommandCenter: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>(BUILDINGS_STATUS[0].id);
  const [activeTab, setActiveTab] = useState<'map' | 'surgery' | 'fleet' | 'triage_telemetry'>('map');

  // Interactive Ambulance Dispatcher Modal
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedAmbulance, setSelectedAmbulance] = useState<any>(null);
  const [dispatchLocation, setDispatchLocation] = useState('Tol Dalam Kota KM 12 - Kecelakaan Lalu Lintas');
  const [dispatchParamedic, setDispatchParamedic] = useState('dr. Maya / Ns. Hendra');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  // Red Code Emergency Alarm State
  const [codeRedActive, setCodeRedActive] = useState(false);
  const [codeRedLocation, setCodeRedLocation] = useState('Gedung Utama (A) - Lantai 3 (ICU Sentral)');

  // OR Surgery Local State Override
  const [orRooms, setOrRooms] = useState(OPERATING_ROOMS);
  const [selectedOrForEdit, setSelectedOrForEdit] = useState<any | null>(null);

  // Fleet Local State
  const [fleetData, setFleetData] = useState(AMBULANCES);

  // AI Voice Incident Command Log
  const [incidentLogs, setIncidentLogs] = useState<Array<{ time: string; level: 'critical' | 'warning' | 'info'; title: string; desc: string }>>([
    { time: '08:14', level: 'critical', title: 'Peringatan Triage IGD Red Zone', desc: 'Pasien Trauma STEMI Akut dirujuk via Ambulance AMB-01, estimasi tiba 8 menit.' },
    { time: '08:02', level: 'info', title: 'Persiapan OK-03 (Bedah Tulang)', desc: 'Sterilisasi instrumen Ortopedi selesai. Tim Anestesi meluncur ke OK-03.' },
    { time: '07:45', level: 'warning', title: 'Kapasitas ICU Sentral 92%', desc: 'Sisa 1 Bed ICU Kosong. Sistem AI merekomendasikan konversi Bed HCU L-4.' },
  ]);

  const handleDispatchAmbulance = (amb: any) => {
    setSelectedAmbulance(amb);
    setDispatchModalOpen(true);
    setDispatchSuccess(false);
  };

  const confirmDispatch = () => {
    if (!selectedAmbulance) return;
    setFleetData(prev =>
      prev.map(a =>
        a.id === selectedAmbulance.id
          ? {
              ...a,
              status: 'Dispatched',
              location: dispatchLocation,
              paramedic: dispatchParamedic,
              destination: 'IGD Utama RSUD Smart Medika',
              etaMinutes: 12
            }
          : a
      )
    );
    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchModalOpen(false);
      setDispatchSuccess(false);
    }, 1500);
  };

  const toggleOrStatus = (id: string, newStatus: string) => {
    setOrRooms(prev =>
      prev.map(room => (room.id === id ? { ...room, status: newStatus as any } : room))
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Code Red Siren Alert Banner if Active */}
      {codeRedActive && (
        <div className="rounded-2xl border-2 border-rose-500 bg-rose-950/90 p-4 text-white shadow-2xl animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500 text-white font-black animate-bounce">
              <Siren className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-rose-500 px-2 py-0.5 text-xs font-black uppercase tracking-widest text-white">
                  CODE RED EMERGENCY ACTIVE
                </span>
                <span className="text-xs text-rose-200 font-mono">08:24:12 WIB</span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5">
                Kondisi Darurat Kebakaran / Evakuasi Media Dideklarasikan: {codeRedLocation}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setCodeRedActive(false)}
            className="rounded-xl bg-slate-900 border border-rose-400 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
          >
            Matikan Sirine Code Red
          </button>
        </div>
      )}

      {/* Command Center Main Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-rose-500/30 bg-slate-900/90 p-5 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-inner">
            <Radio className="h-8 w-8 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                COMMAND CENTER & OPERATIONAL MAP
              </h1>
              <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" /> LIVE TELEMETRY 24/7
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Pusat Komando Operasional Terpadu: Monitoring Realtime Gedung, Bed Occupancy, Kamar Operasi (OK Sentral), Fleet Emergency Ambulance, & AI Incident Dispatcher.
            </p>
          </div>
        </div>

        {/* Action Controls & Emergency Siren Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCodeRedActive(!codeRedActive)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition shadow-lg ${
              codeRedActive
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-rose-950/80 text-rose-300 border border-rose-500/40 hover:bg-rose-900'
            }`}
          >
            <Siren className="h-4 w-4" />
            {codeRedActive ? 'Code Red Berlangsung!' : 'Deklarasikan Code Red'}
          </button>

          {/* View Tabs */}
          <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
            <button
              onClick={() => setActiveTab('map')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'map' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Peta Gedung & Bed
            </button>
            <button
              onClick={() => setActiveTab('surgery')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'surgery' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Kamar Operasi (OK)
            </button>
            <button
              onClick={() => setActiveTab('fleet')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'fleet' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Armada Ambulance
            </button>
            <button
              onClick={() => setActiveTab('triage_telemetry')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                activeTab === 'triage_telemetry' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-300 hover:text-white'
              }`}
            >
              Log Insiden & AI Dispatch
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: PETA KAWASAN & BED SCHEMATICS */}
      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Building Schematics Grid */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-400" />
                Peta Kawasan RSUD Smart Medika (6 Gedung Utama)
              </h3>
              <span className="text-xs text-slate-400">Pilih Gedung untuk Detail Telemetry</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BUILDINGS_STATUS.map((b) => {
                const isSelected = selectedBuilding === b.id;
                const occPct = b.totalBeds > 0 ? Math.round((b.occupiedBeds / b.totalBeds) * 100) : 0;

                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBuilding(b.id)}
                    className={`rounded-xl border p-4 text-left transition relative overflow-hidden ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                        {b.code}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          b.status === 'Emergency Alert'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                            : b.status === 'High Occupancy'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h4 className="mt-2 font-bold text-white text-xs truncate" title={b.name}>
                      {b.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">{b.floors} Lantai Total</p>

                    {b.totalBeds > 0 && (
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-300 font-mono">
                          <span>Bed: {b.occupiedBeds}/{b.totalBeds}</span>
                          <span>{occPct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              occPct > 85 ? 'bg-rose-500' : occPct > 70 ? 'bg-amber-500' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${occPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Building Info */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-sm font-bold text-cyan-300">
                  Detail Gedung: {BUILDINGS_STATUS.find((b) => b.id === selectedBuilding)?.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  {BUILDINGS_STATUS.find((b) => b.id === selectedBuilding)?.code}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Total Kapasitas Bed:</span>
                  <span className="font-bold text-white font-mono">
                    {BUILDINGS_STATUS.find((b) => b.id === selectedBuilding)?.totalBeds || 0} Bed
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Terisi (Occupied):</span>
                  <span className="font-bold text-cyan-400 font-mono">
                    {BUILDINGS_STATUS.find((b) => b.id === selectedBuilding)?.occupiedBeds || 0} Bed
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Bed Kosong (Ready):</span>
                  <span className="font-bold text-emerald-400 font-mono">
                    {(BUILDINGS_STATUS.find((b) => b.id === selectedBuilding)?.totalBeds || 0) - (BUILDINGS_STATUS.find((b) => b.id === selectedBuilding)?.occupiedBeds || 0)} Bed
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Operasi / Prosedur Aktif:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {BUILDINGS_STATUS.find((b) => b.id === selectedBuilding)?.activeSurgeries || 0} Prosedur
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Sensor Lingkungan Gedung OK:
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tekanan udara negatif isolasi -15 Pa (Sesuai Standar), Suhu Sentral 19°C, Suplai Oksigen Sentral 6.2 Bar (Stabil).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OPERATING ROOMS (OK SENTRAL) */}
      {activeTab === 'surgery' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scissors className="h-4 w-4 text-cyan-400" />
                Status 6 Kamar Operasi Sentral (Central Operating Theatre)
              </h3>
              <p className="text-xs text-slate-400">Monitoring & Kontrol Operasi Realtime</p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" /> All OR Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {orRooms.map((ok) => (
              <div
                key={ok.id}
                className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs transition hover:border-cyan-500/50"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{ok.name}</h4>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      ok.status === 'In Progress'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : ok.status === 'Preparing'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : ok.status === 'Sterilizing'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {ok.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-slate-300">
                  <div>
                    <span className="text-slate-400">Prosedur Bedah: </span>
                    <span className="font-semibold text-cyan-300">{ok.procedure}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Dokter Operator: </span>
                    <span className="font-medium text-slate-200">{ok.doctor}</span>
                  </div>
                  {ok.patientRM && (
                    <div>
                      <span className="text-slate-400">RM Pasien: </span>
                      <span className="font-mono text-slate-200">{ok.patientRM}</span>
                    </div>
                  )}
                  {ok.startTime && (
                    <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-800">
                      Mulai: {ok.startTime} {ok.estimatedEndTime ? `| Est Selesai: ${ok.estimatedEndTime}` : ''}
                    </div>
                  )}
                </div>

                {/* Quick Status Control Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-[10px]">
                  <span className="text-slate-500">Ubah Status:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleOrStatus(ok.id, 'In Progress')}
                      className="rounded bg-rose-500/20 px-2 py-0.5 font-bold text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition"
                    >
                      Operasi
                    </button>
                    <button
                      onClick={() => toggleOrStatus(ok.id, 'Sterilizing')}
                      className="rounded bg-blue-500/20 px-2 py-0.5 font-bold text-blue-300 border border-blue-500/30 hover:bg-blue-500 hover:text-white transition"
                    >
                      Steril
                    </button>
                    <button
                      onClick={() => toggleOrStatus(ok.id, 'Available')}
                      className="rounded bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition"
                    >
                      Ready
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FLEET AMBULANCE LIVE TRACKER */}
      {activeTab === 'fleet' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-rose-400" />
                Monitoring Armada Emergency Ambulance (GPS Live Dispatcher)
              </h3>
              <p className="text-xs text-slate-400">Manajemen Penjemputan Pasien Kritis & Evakuasi Medis Emergency Hotline 119</p>
            </div>
            <span className="text-xs text-rose-400 font-mono font-bold bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/30">
              Hotline 119 Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fleetData.map((amb) => (
              <div
                key={amb.id}
                className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm flex items-center gap-2">
                    <Navigation className="h-4 w-4 text-cyan-400" />
                    {amb.code}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      amb.status === 'Dispatched' || amb.status === 'On Scene'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                        : amb.status === 'Returning'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}
                  >
                    {amb.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Driver & Paramedik:</span>
                    <span className="font-medium">{amb.driver} / {amb.paramedic}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lokasi GPS Saat Ini:</span>
                    <span className="font-medium text-cyan-300">{amb.location}</span>
                  </div>
                </div>

                {amb.etaMinutes && (
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                    <span className="text-slate-400">Tujuan: {amb.destination}</span>
                    <span className="font-bold text-amber-400 font-mono">
                      ETA: ~{amb.etaMinutes} Menit
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 flex justify-end">
                  <button
                    onClick={() => handleDispatchAmbulance(amb)}
                    className="rounded-xl bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                  >
                    Dispatch / Penugasan Baru
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: LOG INSIDEN & AI DISPATCH */}
      {activeTab === 'triage_telemetry' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-400" /> Log Telemetri Insiden & AI Dispatch Assistant
            </h3>
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
              AI Command Engine Active
            </span>
          </div>

          <div className="space-y-3">
            {incidentLogs.map((log, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{log.time}</span>
                    <h4 className="font-bold text-xs text-slate-100">{log.title}</h4>
                  </div>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                      log.level === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : log.level === 'warning'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {log.level.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{log.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ambulance Dispatch Modal */}
      {dispatchModalOpen && selectedAmbulance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Siren className="h-5 w-5 text-rose-400" />
              Dispatch Penugasan: {selectedAmbulance.code}
            </h3>

            {!dispatchSuccess ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Lokasi Kejadian / Penjemputan:</label>
                  <input
                    type="text"
                    value={dispatchLocation}
                    onChange={(e) => setDispatchLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Tim Paramedik & Dokter:</label>
                  <input
                    type="text"
                    value={dispatchParamedic}
                    onChange={(e) => setDispatchParamedic(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setDispatchModalOpen(false)}
                    className="rounded-xl bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    onClick={confirmDispatch}
                    className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-400"
                  >
                    Kirim Ambulance
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-2">
                <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-white">Ambulance Berhasil Dispatched!</h4>
                <p className="text-xs text-slate-400">Sirene & GPS Live Tracking diaktifkan untuk {selectedAmbulance.code}.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
