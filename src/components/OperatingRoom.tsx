/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Scissors,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Plus,
  Activity,
  AlertTriangle,
  Calendar,
  CheckSquare,
  FileText,
  Search,
  Sliders,
  Check,
  X,
  Layers,
  Thermometer,
  Shield,
  Zap,
  Gauge
} from 'lucide-react';
import { OperationSchedule, OperationStage } from '../types';
import { MOCK_OPERATION_SCHEDULES } from '../data/mockData';

export const OperatingRoom: React.FC = () => {
  const [schedules, setSchedules] = useState<OperationSchedule[]>(MOCK_OPERATION_SCHEDULES);
  const [selectedOp, setSelectedOp] = useState<OperationSchedule>(schedules[0]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'matrix' | 'who' | 'instrument' | 'aldrete'>('schedule');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Operation Schedule Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newRoom, setNewRoom] = useState('OK 4 - Orthopedi & Traumatologi');
  const [newPatientName, setNewPatientName] = useState('');
  const [newNorm, setNewNorm] = useState('RM-2026-00412');
  const [newProcedure, setNewProcedure] = useState('ORIF Fracture Femur Sinistra');
  const [newSurgeon, setNewSurgeon] = useState('dr. Bambang Suherman, Sp.OT(K)');
  const [newAnesthesiologist, setNewAnesthesiologist] = useState('dr. Maya Saphira, Sp.An-TI');
  const [newOpType, setNewOpType] = useState<'Elektif' | 'Cito Emergency'>('Elektif');

  // Instrument Counter State
  const [kassaInitial, setKassaInitial] = useState(20);
  const [kassaFinal, setKassaFinal] = useState(20);
  const [jarumInitial, setJarumInitial] = useState(10);
  const [jarumFinal, setJarumFinal] = useState(10);
  const [instrumenInitial, setInstrumenInitial] = useState(15);
  const [instrumenFinal, setInstrumenFinal] = useState(15);

  // Aldrete Score Calculator State
  const [aldreteActivity, setAldreteActivity] = useState(2); // 0, 1, 2
  const [aldreteRespiration, setAldreteRespiration] = useState(2);
  const [aldreteCirculation, setAldreteCirculation] = useState(2);
  const [aldreteConsciousness, setAldreteConsciousness] = useState(2);
  const [aldreteSpO2, setAldreteSpO2] = useState(2);

  const totalAldrete = aldreteActivity + aldreteRespiration + aldreteCirculation + aldreteConsciousness + aldreteSpO2;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateStage = (stage: OperationStage) => {
    setSchedules(prev =>
      prev.map(item => (item.id === selectedOp.id ? { ...item, actualStage: stage } : item))
    );
    setSelectedOp(prev => ({ ...prev, actualStage: stage }));
    showToast(`Tahapan operasi ${selectedOp.patientName} diperbarui ke -> ${stage}`);
  };

  const handleToggleWHO = (checkKey: 'signInDone' | 'timeOutDone' | 'signOutDone') => {
    setSchedules(prev =>
      prev.map(item => {
        if (item.id === selectedOp.id) {
          const updatedWHO = {
            ...item.whoChecklist,
            [checkKey]: !item.whoChecklist[checkKey]
          };
          const updated = { ...item, whoChecklist: updatedWHO };
          setSelectedOp(updated);
          return updated;
        }
        return item;
      })
    );
    showToast(`WHO Checklist stage ${checkKey} diperbarui.`);
  };

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: OperationSchedule = {
      id: `op-${Date.now()}`,
      operatingRoomName: newRoom,
      patientId: `pat-${Date.now()}`,
      patientName: newPatientName || 'Pasien Operasi Baru',
      norm: newNorm,
      procedureName: newProcedure,
      type: newOpType as any,
      surgeonName: newSurgeon,
      anesthesiologistName: newAnesthesiologist,
      scrubNurseName: 'Ns. Siti Rahma, S.Kep',
      scheduledTime: '13:00 - 15:30 WIB',
      actualStage: 'Pre-op',
      estimatedDurationMins: 120,
      aiDelayPredictionMins: 0,
      whoChecklist: {
        signInDone: false,
        timeOutDone: false,
        signOutDone: false
      }
    };

    setSchedules([newEntry, ...schedules]);
    setSelectedOp(newEntry);
    setShowScheduleModal(false);
    setNewPatientName('');
    showToast(`Jadwal Operasi ${newEntry.procedureName} berhasil ditambahkan di ${newEntry.operatingRoomName}.`);
  };

  // 6 Operating Theatre Rooms Status
  const roomsMatrix = [
    { name: 'OK 1 (Bedah Sentral / General)', status: 'Sedang Operasi', op: schedules[0] || null },
    { name: 'OK 2 (Jantung & Pembuluh Darah)', status: 'Sedang Operasi', op: schedules[1] || null },
    { name: 'OK 3 (Bedah Syaraf / Neuro)', status: 'Time Out / Persiapan', op: schedules[2] || null },
    { name: 'OK 4 (Orthopedi & Traumatologi)', status: 'Sterilisasi / Ready', op: null },
    { name: 'OK 5 (Mata & THT - Minimal Invasif)', status: 'Ready / Kosong', op: null },
    { name: 'OK 6 (Cito Emergency IGD)', status: 'Siap Cito Emergency', op: null }
  ];

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-slate-900 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Scissors className="w-4 h-4 text-cyan-400" /> Operating Theatre Suite Command
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Kamar Operasi (OK) & Keselamatan Bedah WHO
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Jadwal Tindakan Operatif, WHO Surgical Safety Checklist, Sterilitas Instrument, & Score Pemulihan PACU Aldrete.
          </p>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Schedule Operasi Baru
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'schedule'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4" /> Jadwal & Tahapan Operasi Aktif
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'matrix'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Status 6 Kamar Operasi (OK 1 - OK 6)
        </button>

        <button
          onClick={() => setActiveTab('who')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'who'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> WHO Surgical Safety Checklist
        </button>

        <button
          onClick={() => setActiveTab('instrument')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'instrument'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CheckSquare className="w-4 h-4 text-amber-300" /> Hitung Kassa & Instrument Steril
        </button>

        <button
          onClick={() => setActiveTab('aldrete')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'aldrete'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Gauge className="w-4 h-4 text-sky-300" /> Skor Pemulihan PACU (Aldrete)
        </button>
      </div>

      {/* TAB 1: SCHEDULE & STAGES */}
      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Operation Schedules List (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Jadwal Operasi Hari Ini ({schedules.length})
              </h2>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {schedules.map(op => (
                <div
                  key={op.id}
                  onClick={() => setSelectedOp(op)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    selectedOp.id === op.id
                      ? 'bg-slate-800 border-cyan-500/60 shadow-lg'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-cyan-300 text-xs font-mono">{op.operatingRoomName}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        op.type === 'Cito Emergency'
                          ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}
                    >
                      {op.type}
                    </span>
                  </div>

                  <div className="font-bold text-white text-sm">{op.patientName} ({op.norm})</div>
                  <div className="text-xs text-amber-300 font-medium mb-2">{op.procedureName}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                    <span>Dokter: {op.surgeonName}</span>
                    <span className="text-emerald-400 font-bold">{op.actualStage}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Surgical Detail & Stage Controller (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{selectedOp.operatingRoomName}</span>
                <h2 className="text-xl font-bold text-white">{selectedOp.procedureName}</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Pasien: <span className="text-white font-bold">{selectedOp.patientName}</span> ({selectedOp.norm}) • Waktu: {selectedOp.scheduledTime}
                </p>
              </div>

              <div className="text-right text-xs">
                <div className="text-slate-400">Operator Utama</div>
                <div className="font-bold text-cyan-300">{selectedOp.surgeonName}</div>
                <div className="text-slate-400 text-[11px]">Anestesi: {selectedOp.anesthesiologistName}</div>
              </div>
            </div>

            {/* Stage Progress Changer */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Update Tahapan Operasi Realtime</div>
              <div className="flex flex-wrap items-center gap-2">
                {(['Pre-op', 'Time Out', 'Operasi', 'Recovery', 'Post-op'] as OperationStage[]).map(stg => (
                  <button
                    key={stg}
                    onClick={() => handleUpdateStage(stg)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedOp.actualStage === stg
                        ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            {/* WHO Checklist Overview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Status WHO Safety Checklist
                </div>
                <button
                  onClick={() => setActiveTab('who')}
                  className="text-xs text-cyan-400 hover:underline font-bold"
                >
                  Buka Detail WHO Checklist →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-2.5 rounded-lg border ${selectedOp.whoChecklist.signInDone ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  Sign In (Induksi)
                </div>
                <div className={`p-2.5 rounded-lg border ${selectedOp.whoChecklist.timeOutDone ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  Time Out (Insisi)
                </div>
                <div className={`p-2.5 rounded-lg border ${selectedOp.whoChecklist.signOutDone ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                  Sign Out (Recovery)
                </div>
              </div>
            </div>

            {/* AI Estimation & Risk */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-200" /> Estimasi Durasi Operasi & Analisis Efisiensi AI
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Estimasi durasi prosedur: <span className="font-bold text-cyan-300">{selectedOp.estimatedDurationMins} menit</span>. Prediksi potensi delay tim operasional: <span className="font-bold text-amber-400">+{selectedOp.aiDelayPredictionMins} menit</span>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROOM MATRIX OK 1 - OK 6 */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" /> Denah Status 6 Kamar Operasi (Operating Theatre)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Monitoring langsung penggunaan ruang bedah, kesiapan ruang, dan sterilisasi antar tindakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomsMatrix.map((rm, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="font-bold text-white text-xs">{rm.name}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    rm.status.includes('Sedang') ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {rm.status}
                  </span>
                </div>

                {rm.op ? (
                  <div className="space-y-1.5 text-xs">
                    <div className="font-bold text-cyan-300">{rm.op.procedureName}</div>
                    <div className="text-slate-300">Pasien: {rm.op.patientName}</div>
                    <div className="text-slate-400 text-[11px]">Operator: {rm.op.surgeonName}</div>
                    <div className="text-amber-400 font-bold font-mono text-[11px]">Tahap: {rm.op.actualStage}</div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-slate-500 text-xs">Kamar Operasi Siap / Steril</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WHO SAFETY CHECKLIST */}
      {activeTab === 'who' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" /> WHO Surgical Safety Checklist ({selectedOp.procedureName})
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kepatuhan 3 Tahap Keselamatan Bedah Pasien (KPRS / Standar Akreditasi Kemenkes).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sign In */}
            <div
              onClick={() => handleToggleWHO('signInDone')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedOp.whoChecklist.signInDone
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <div className="font-bold text-sm">1. SIGN IN (Sebelum Induksi Anestesi)</div>
                <p className="text-xs opacity-80 mt-1">Konfirmasi identitas, lokasi insisi, persetujuan tindakan, pengecekan mesin anestesi & oksigenasi.</p>
              </div>
              <CheckCircle2 className={`w-6 h-6 shrink-0 ${selectedOp.whoChecklist.signInDone ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>

            {/* Time Out */}
            <div
              onClick={() => handleToggleWHO('timeOutDone')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedOp.whoChecklist.timeOutDone
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <div className="font-bold text-sm">2. TIME OUT (Sebelum Insisi Kulit)</div>
                <p className="text-xs opacity-80 mt-1">Perkenalan seluruh tim medis, konfirmasi profilaksis antibiotik 60 menit sebelumnya & verifikasi foto rontgen/CT Scan.</p>
              </div>
              <CheckCircle2 className={`w-6 h-6 shrink-0 ${selectedOp.whoChecklist.timeOutDone ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>

            {/* Sign Out */}
            <div
              onClick={() => handleToggleWHO('signOutDone')}
              className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                selectedOp.whoChecklist.signOutDone
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}
            >
              <div>
                <div className="font-bold text-sm">3. SIGN OUT (Sebelum Pasien Keluar Kamar Operasi)</div>
                <p className="text-xs opacity-80 mt-1">Konfirmasi kelengkapan jumlah kassa, instrumen, jarum, dan pelabelan spesimen patologi anatomi.</p>
              </div>
              <CheckCircle2 className={`w-6 h-6 shrink-0 ${selectedOp.whoChecklist.signOutDone ? 'text-emerald-400' : 'text-slate-600'}`} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STERILE INSTRUMENT & SPONGE COUNTER */}
      {activeTab === 'instrument' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-300" /> Penghitungan Kassa, Jarum & Instrumen Steril
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Memastikan tidak ada kassa/alat tertinggal di area luka insisi sebelum penutupan fasia.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Kassa */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Kassa / Sponges</div>
                <div className="text-[10px] text-slate-400">Target: Jumlah Awal = Jumlah Akhir</div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400">Awal: </span>
                  <input
                    type="number"
                    value={kassaInitial}
                    onChange={e => setKassaInitial(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center font-mono text-cyan-300"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Akhir: </span>
                  <input
                    type="number"
                    value={kassaFinal}
                    onChange={e => setKassaFinal(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center font-mono text-cyan-300"
                  />
                </div>
                <span className={`px-2.5 py-1 rounded font-bold ${kassaInitial === kassaFinal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 animate-bounce'}`}>
                  {kassaInitial === kassaFinal ? 'LENGKAP' : 'TIDAK COCOK'}
                </span>
              </div>
            </div>

            {/* Jarum */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Jarum Jahit / Suture Needles</div>
                <div className="text-[10px] text-slate-400">Target: Jumlah Awal = Jumlah Akhir</div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400">Awal: </span>
                  <input
                    type="number"
                    value={jarumInitial}
                    onChange={e => setJarumInitial(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center font-mono text-cyan-300"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Akhir: </span>
                  <input
                    type="number"
                    value={jarumFinal}
                    onChange={e => setJarumFinal(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center font-mono text-cyan-300"
                  />
                </div>
                <span className={`px-2.5 py-1 rounded font-bold ${jarumInitial === jarumFinal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 animate-bounce'}`}>
                  {jarumInitial === jarumFinal ? 'LENGKAP' : 'TIDAK COCOK'}
                </span>
              </div>
            </div>

            {/* Instrumen Bedah */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-white">Instrumen Bedah (Klem, Pinset, Gunting)</div>
                <div className="text-[10px] text-slate-400">Target: Jumlah Awal = Jumlah Akhir</div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-400">Awal: </span>
                  <input
                    type="number"
                    value={instrumenInitial}
                    onChange={e => setInstrumenInitial(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center font-mono text-cyan-300"
                  />
                </div>
                <div>
                  <span className="text-slate-400">Akhir: </span>
                  <input
                    type="number"
                    value={instrumenFinal}
                    onChange={e => setInstrumenFinal(parseInt(e.target.value) || 0)}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-center font-mono text-cyan-300"
                  />
                </div>
                <span className={`px-2.5 py-1 rounded font-bold ${instrumenInitial === instrumenFinal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 animate-bounce'}`}>
                  {instrumenInitial === instrumenFinal ? 'LENGKAP' : 'TIDAK COCOK'}
                </span>
              </div>
            </div>

            <button
              onClick={() => showToast('Pemeriksaan instrumen berhasil diverifikasi & ditandatangani Scrub Nurse!')}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
            >
              Verifikasi & Tanda Tangan Perawat Instrumen
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: ALDRETE PACU SCORE CALCULATOR */}
      {activeTab === 'aldrete' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl max-w-3xl mx-auto">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Gauge className="w-5 h-5 text-sky-300" /> Skor Pemulihan Anestesi Aldrete (PACU Recovery)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kriteria pemindahan pasien dari ruang pemulihan (PACU) ke ruang rawat inap (Syarat Skor &gt;= 9).
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Total Skor Aldrete</div>
              <div className={`text-3xl font-black font-mono ${totalAldrete >= 9 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {totalAldrete} / 10
              </div>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            {/* Motorik */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white">1. Aktivitas Motorik (Aktivitas Gerak)</div>
              <select
                value={aldreteActivity}
                onChange={e => setAldreteActivity(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value={2}>2 - Mampu menggerakkan 4 ekstremitas atas perintah</option>
                <option value={1}>1 - Mampu menggerakkan 2 ekstremitas</option>
                <option value={0}>0 - Tidak mampu menggerakkan ekstremitas (lumpuh)</option>
              </select>
            </div>

            {/* Respirasi */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white">2. Pernapasan / Respirasi</div>
              <select
                value={aldreteRespiration}
                onChange={e => setAldreteRespiration(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value={2}>2 - Mampu bernapas dalam & batuk secara adekuat</option>
                <option value={1}>1 - Dipsnea / pernapasan dangkal & terbatas</option>
                <option value={0}>0 - Apnea / butuh bantuan ventilator</option>
              </select>
            </div>

            {/* Sirkulasi */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white">3. Sirkulasi (Tekanan Darah)</div>
              <select
                value={aldreteCirculation}
                onChange={e => setAldreteCirculation(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value={2}>2 - Tekanan darah ±20% dari pra-anestesi</option>
                <option value={1}>1 - Tekanan darah ±20% - 50% dari pra-anestesi</option>
                <option value={0}>0 - Tekanan darah berbeda &gt;50% dari pra-anestesi</option>
              </select>
            </div>

            {/* Kesadaran */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white">4. Tingkat Kesadaran</div>
              <select
                value={aldreteConsciousness}
                onChange={e => setAldreteConsciousness(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value={2}>2 - Sadar penuh & berorientasi baik</option>
                <option value={1}>1 - Bangun jika dipanggil / dipanggil nama</option>
                <option value={0}>0 - Tidak ada respon / belum sadar</option>
              </select>
            </div>

            {/* SpO2 */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-bold text-white">5. Saturasi Oksigen (SpO2)</div>
              <select
                value={aldreteSpO2}
                onChange={e => setAldreteSpO2(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white"
              >
                <option value={2}>2 - SpO2 &gt; 92% pada udara bebas (ruangan)</option>
                <option value={1}>1 - Butuh suplemen O2 cannula untuk SpO2 &gt; 90%</option>
                <option value={0}>0 - SpO2 &lt; 90% dengan suplemen O2</option>
              </select>
            </div>

            <div className={`p-4 rounded-xl border text-center font-bold ${
              totalAldrete >= 9 ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300' : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
            }`}>
              {totalAldrete >= 9
                ? 'PASIEN SIAP PINDAH KE RUANG RAWAT INAP (ALDRETE SKOR >= 9)'
                : 'PASIEN HARUS TETAP DI PACU UNTUK OBSERVASI KETAT'}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Schedule New Operation */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Jadwalkan Tindakan Operasi Baru</h3>
              <button onClick={() => setShowScheduleModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Kamar Operasi (OK)</label>
                <select
                  value={newRoom}
                  onChange={e => setNewRoom(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="OK 1 - Bedah Sentral General">OK 1 - Bedah Sentral General</option>
                  <option value="OK 2 - Jantung & Pembuluh Darah">OK 2 - Jantung & Pembuluh Darah</option>
                  <option value="OK 3 - Bedah Syaraf Neuro">OK 3 - Bedah Syaraf Neuro</option>
                  <option value="OK 4 - Orthopedi & Traumatologi">OK 4 - Orthopedi & Traumatologi</option>
                  <option value="OK 5 - Mata & THT Minimal Invasif">OK 5 - Mata & THT Minimal Invasif</option>
                  <option value="OK 6 - Cito Emergency IGD">OK 6 - Cito Emergency IGD</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  placeholder="Ketik nama pasien..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Prosedur Tindakan Bedah</label>
                <input
                  type="text"
                  required
                  value={newProcedure}
                  onChange={e => setNewProcedure(e.target.value)}
                  placeholder="Contoh: Laparoscopy Cholecystectomy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Operator Utama</label>
                  <input
                    type="text"
                    value={newSurgeon}
                    onChange={e => setNewSurgeon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tipe Operasi</label>
                  <select
                    value={newOpType}
                    onChange={e => setNewOpType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Elektif">Elektif</option>
                    <option value="Cito Emergency">Cito Emergency</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow"
                >
                  Simpan Jadwal OK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
