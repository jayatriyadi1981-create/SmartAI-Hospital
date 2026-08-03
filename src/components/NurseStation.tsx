/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ClipboardList,
  Activity,
  AlertCircle,
  Plus,
  Shield,
  FileText,
  UserCheck,
  Search,
  Filter,
  Thermometer,
  Heart,
  Eye,
  AlertTriangle,
  Send,
  X,
  Printer,
  CheckSquare
} from 'lucide-react';
import { NurseTask } from '../types';
import { MOCK_NURSE_TASKS } from '../data/mockData';

interface VitalSignRecord {
  id: string;
  patientName: string;
  bedName: string;
  systolic: number;
  diastolic: number;
  heartRate: number;
  respirationRate: number;
  temperature: number;
  spO2: number;
  avpu: 'Alert' | 'Voice' | 'Pain' | 'Unresponsive';
  ewsScore: number;
  timestamp: string;
  nurseName: string;
}

export const NurseStation: React.FC = () => {
  const [tasks, setTasks] = useState<NurseTask[]>(MOCK_NURSE_TASKS);
  const [activeTab, setActiveTab] = useState<'Tasks' | 'VitalsEWS' | 'Handover' | 'SafetyChecklist'>('Tasks');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [selectedWard, setSelectedWard] = useState<string>('Semua Ruangan');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal New Task
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskPatient, setNewTaskPatient] = useState('Ahmad Dahlan');
  const [newTaskBed, setNewTaskBed] = useState('Mawar 101-A');
  const [newTaskType, setNewTaskType] = useState<NurseTask['taskType']>('Pemberian Obat');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('14:30 WIB');

  // Vital Signs State
  const [vitalsList, setVitalsList] = useState<VitalSignRecord[]>([
    {
      id: 'vital-1',
      patientName: 'Ahmad Dahlan',
      bedName: 'Mawar 101-A',
      systolic: 150,
      diastolic: 90,
      heartRate: 88,
      respirationRate: 20,
      temperature: 37.2,
      spO2: 98,
      avpu: 'Alert',
      ewsScore: 3,
      timestamp: '12:00 WIB',
      nurseName: 'Ns. Maya Kusuma'
    },
    {
      id: 'vital-2',
      patientName: 'Dewi Lestari',
      bedName: 'Melati 201-B',
      systolic: 120,
      diastolic: 80,
      heartRate: 76,
      respirationRate: 18,
      temperature: 36.6,
      spO2: 99,
      avpu: 'Alert',
      ewsScore: 0,
      timestamp: '11:30 WIB',
      nurseName: 'Ns. Rina Astuti'
    },
    {
      id: 'vital-3',
      patientName: 'Budi Santoso',
      bedName: 'ICU Bed 02',
      systolic: 175,
      diastolic: 105,
      heartRate: 112,
      respirationRate: 26,
      temperature: 38.5,
      spO2: 92,
      avpu: 'Voice',
      ewsScore: 8,
      timestamp: '12:15 WIB',
      nurseName: 'Ns. Tri Wahyuni'
    }
  ]);

  // Vitals Form Input
  const [vitalPatient, setVitalPatient] = useState('Ahmad Dahlan (Mawar 101-A)');
  const [vSystolic, setVSystolic] = useState(130);
  const [vDiastolic, setVDiastolic] = useState(85);
  const [vHR, setVHR] = useState(80);
  const [vRR, setVRR] = useState(18);
  const [vTemp, setVTemp] = useState(36.8);
  const [vSpO2, setVSpO2] = useState(98);
  const [vAVPU, setVAVPU] = useState<'Alert' | 'Voice' | 'Pain' | 'Unresponsive'>('Alert');

  // Shift Handover SBAR State
  const [handoverNotes, setHandoverNotes] = useState([
    {
      id: 'ho-1',
      patientName: 'Ahmad Dahlan (Mawar 101-A)',
      shiftFrom: 'Shift Pagi (Ns. Maya)',
      shiftTo: 'Shift Sore (Ns. Tri)',
      situation: 'Pasien mengeluh pusing dan tengkuk terasa berat.',
      background: 'Riwayat Hipertensi Grade 2 sejak 5 tahun, dirawat H+2 pasca observasi cephalgia.',
      assessment: 'TD 150/90 mmHg, HR 88x/m, SpO2 98%. EWS Score 3 (Kuning - Observasi Ketat).',
      recommendation: 'Lanjutkan Captopril 25mg p.o. ekstra jika TD > 160/100, observasi TTV per 2 jam, pertahankan posisi semi-Fowler.',
      time: '14:00 WIB'
    },
    {
      id: 'ho-2',
      patientName: 'Dewi Lestari (Melati 201-B)',
      shiftFrom: 'Shift Pagi (Ns. Rina)',
      shiftTo: 'Shift Sore (Ns. Tri)',
      situation: 'Pasien tenang, keluhan batuk berdahak berkurang.',
      background: 'Post-op Appendectomy H+1, infus RL 20 tpm lancar.',
      assessment: 'TTV stabil TD 120/80, Nadi 76, Temp 36.6C, Flatus (+), Luka op kering.',
      recommendation: 'Mobilisasi bertahap (duduk/jalan halus), injeksi Analgesik jam 16:00, ganti verband besok pagi.',
      time: '14:05 WIB'
    }
  ]);

  const [sbarPatient, setSbarPatient] = useState('Ahmad Dahlan (Mawar 101-A)');
  const [sbarShiftFrom, setSbarShiftFrom] = useState('Shift Sore');
  const [sbarShiftTo, setSbarShiftTo] = useState('Shift Malam');
  const [sbarSituation, setSbarSituation] = useState('');
  const [sbarBackground, setSbarBackground] = useState('');
  const [sbarAssessment, setSbarAssessment] = useState('');
  const [sbarRecommendation, setSbarRecommendation] = useState('');

  // Fall Risk Assessment (Morse Scale)
  const [fallHistory, setFallHistory] = useState<number>(0); // 0 or 25
  const [secondaryDiagnosis, setSecondaryDiagnosis] = useState<number>(15); // 0 or 15
  const [ambulatoryAid, setAmbulatoryAid] = useState<number>(15); // 0, 15, or 30
  const [ivTherapy, setIvTherapy] = useState<number>(20); // 0 or 20
  const [gaitState, setGaitState] = useState<number>(10); // 0, 10, or 20
  const [mentalStatus, setMentalStatus] = useState<number>(0); // 0 or 15

  // Emergency Trolley Checklist
  const [trolleyChecked, setTrolleyChecked] = useState({
    defibrillator: true,
    suctionMachine: true,
    emergencyMedKit: true,
    oxygenTank: true,
    ambubag: true,
    laryngoscope: true
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper NEWS2 / EWS Score Calculation
  const calculateNEWS2 = (sbp: number, hr: number, rr: number, temp: number, spo2: number, avpu: string): number => {
    let score = 0;
    // RR
    if (rr <= 8 || rr >= 25) score += 3;
    else if (rr >= 21) score += 2;
    else if (rr <= 11) score += 1;

    // SpO2
    if (spo2 <= 91) score += 3;
    else if (spo2 <= 93) score += 2;
    else if (spo2 <= 95) score += 1;

    // SBP
    if (sbp <= 90 || sbp >= 220) score += 3;
    else if (sbp <= 100) score += 2;
    else if (sbp <= 110) score += 1;

    // HR
    if (hr <= 40 || hr >= 131) score += 3;
    else if (hr >= 111) score += 2;
    else if (hr <= 50 || hr >= 91) score += 1;

    // Temp
    if (temp <= 35.0) score += 3;
    else if (temp >= 39.1) score += 2;
    else if (temp <= 36.0 || temp >= 38.1) score += 1;

    // AVPU
    if (avpu !== 'Alert') score += 3;

    return score;
  };

  const currentEws = calculateNEWS2(vSystolic, vHR, vRR, vTemp, vSpO2, vAVPU);

  const handleCompleteTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, status: 'Completed', nurseName: 'Ns. Maya Kusuma' } : t))
    );
    showToast('Tugas keperawatan berhasil ditandai Selesai.');
  };

  const handleCreateNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskDesc.trim()) return;
    const newEntry: NurseTask = {
      id: `task-${Date.now()}`,
      patientId: 'pat-new',
      patientName: newTaskPatient,
      bedName: newTaskBed,
      taskType: newTaskType,
      description: newTaskDesc,
      scheduledTime: newTaskTime,
      status: 'Pending'
    };
    setTasks([newEntry, ...tasks]);
    setShowNewTaskModal(false);
    setNewTaskDesc('');
    showToast(`Tugas baru "${newTaskType}" untuk ${newTaskPatient} berhasil ditambahkan.`);
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    const ews = calculateNEWS2(vSystolic, vHR, vRR, vTemp, vSpO2, vAVPU);
    const parts = vitalPatient.split(' (');
    const pName = parts[0];
    const bName = parts[1] ? parts[1].replace(')', '') : 'Bed Inpatient';

    const newRec: VitalSignRecord = {
      id: `vital-${Date.now()}`,
      patientName: pName,
      bedName: bName,
      systolic: vSystolic,
      diastolic: vDiastolic,
      heartRate: vHR,
      respirationRate: vRR,
      temperature: vTemp,
      spO2: vSpO2,
      avpu: vAVPU,
      ewsScore: ews,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      nurseName: 'Ns. Maya Kusuma'
    };

    setVitalsList([newRec, ...vitalsList]);
    showToast(`Pencatatan TTV & EWS Score (${ews}) untuk ${pName} berhasil disimpan.`);
  };

  const handleAddSBARHandover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbarSituation.trim() || !sbarRecommendation.trim()) return;

    setHandoverNotes([
      {
        id: `ho-${Date.now()}`,
        patientName: sbarPatient,
        shiftFrom: sbarShiftFrom,
        shiftTo: sbarShiftTo,
        situation: sbarSituation,
        background: sbarBackground || 'Kondisi stabil, tidak ada riwayat alergi baru.',
        assessment: sbarAssessment || 'TTV dalam batas aman.',
        recommendation: sbarRecommendation,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB'
      },
      ...handoverNotes
    ]);

    setSbarSituation('');
    setSbarBackground('');
    setSbarAssessment('');
    setSbarRecommendation('');
    showToast('Catatan SBAR Handover berhasil ditambahkan ke log shift!');
  };

  // Filtered Tasks
  const filteredTasks = tasks.filter(task => {
    const matchesWard =
      selectedWard === 'Semua Ruangan' || task.bedName.toLowerCase().includes(selectedWard.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter;
    const matchesSearch =
      task.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.taskType.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesWard && matchesStatus && matchesSearch;
  });

  const morseTotalScore = fallHistory + secondaryDiagnosis + ambulatoryAid + ivTherapy + gaitState + mentalStatus;
  const getFallRiskLevel = (score: number) => {
    if (score >= 45) return { label: 'Risiko Tinggi (Gelang Kuning)', color: 'text-red-400 bg-red-500/20 border-red-500/40' };
    if (score >= 25) return { label: 'Risiko Sedang', color: 'text-amber-400 bg-amber-500/20 border-amber-500/40' };
    return { label: 'Risiko Rendah', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40' };
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-teal-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl border border-teal-300 animate-bounce flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 border border-teal-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4 text-teal-300" /> Smart Nurse Station & Ward Care Operations
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Nurse Station & Manajemen Asuhan Keperawatan
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Daftar Tugas Perawat, Form TTV & Early Warning Score (EWS/NEWS2), Handover Shift SBAR, & Keselamatan Pasien.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('Tasks')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'Tasks' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tugas Keperawatan ({tasks.filter(t => t.status === 'Pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('VitalsEWS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'VitalsEWS' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pencatatan TTV & EWS
          </button>
          <button
            onClick={() => setActiveTab('Handover')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'Handover' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Handover Shift SBAR
          </button>
          <button
            onClick={() => setActiveTab('SafetyChecklist')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'SafetyChecklist' ? 'bg-teal-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Checklist Risk & Alkes
          </button>
        </div>
      </div>

      {/* VIEW 1: NURSING TASKS */}
      {activeTab === 'Tasks' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Cari pasien / tugas..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Ward Filter */}
                <select
                  value={selectedWard}
                  onChange={e => setSelectedWard(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                >
                  <option value="Semua Ruangan">Semua Ruangan</option>
                  <option value="Mawar">Bangsal Mawar</option>
                  <option value="Melati">Bangsal Melati</option>
                  <option value="Flamboyan">Bangsal Flamboyan</option>
                  <option value="ICU">Unit ICU</option>
                </select>

                {/* Status Filter */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setStatusFilter('All')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] ${statusFilter === 'All' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    Semua ({tasks.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('Pending')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] ${statusFilter === 'Pending' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    Pending ({tasks.filter(t => t.status === 'Pending').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('Completed')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] ${statusFilter === 'Completed' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                  >
                    Selesai ({tasks.filter(t => t.status === 'Completed').length})
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowNewTaskModal(true)}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow transition-all shrink-0"
              >
                <Plus className="w-4 h-4" /> Tambah Instruksi / Tugas Baru
              </button>
            </div>

            {/* Task Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                      task.status === 'Completed'
                        ? 'bg-slate-950/60 border-slate-800/80 opacity-80'
                        : 'bg-slate-950 border-teal-500/30 shadow-md hover:border-teal-400'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-300 rounded text-[10px] font-bold border border-teal-500/30">
                          {task.taskType}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" /> {task.scheduledTime}
                        </span>
                      </div>

                      <div className="font-bold text-white text-sm">
                        {task.patientName} <span className="text-xs text-teal-400 font-mono">({task.bedName})</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-500 font-mono">
                        {task.nurseName ? `Dilakukan: ${task.nurseName}` : 'Status: Menunggu Tindakan'}
                      </span>

                      {task.status !== 'Completed' ? (
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 shadow transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Tandai Selesai
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-slate-500 text-xs">
                  Tidak ada tugas keperawatan yang sesuai filter.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: VITAL SIGNS & EWS (EARLY WARNING SCORE) */}
      {activeTab === 'VitalsEWS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Form Input TTV & Kalkulator EWS</span>
              <span className="text-[10px] text-slate-400 font-mono">NEWS2 Standard</span>
            </h2>

            <form onSubmit={handleSaveVitals} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pilih Pasien & Bed</label>
                <select
                  value={vitalPatient}
                  onChange={e => setVitalPatient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Ahmad Dahlan (Mawar 101-A)">Ahmad Dahlan (Mawar 101-A)</option>
                  <option value="Dewi Lestari (Melati 201-B)">Dewi Lestari (Melati 201-B)</option>
                  <option value="Budi Santoso (ICU Bed 02)">Budi Santoso (ICU Bed 02)</option>
                  <option value="Siti Aminah (Flamboyan 304)">Siti Aminah (Flamboyan 304)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tekanan Darah Systolic</label>
                  <input
                    type="number"
                    value={vSystolic}
                    onChange={e => setVSystolic(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tekanan Darah Diastolic</label>
                  <input
                    type="number"
                    value={vDiastolic}
                    onChange={e => setVDiastolic(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Heart Rate (Nadi bpm)</label>
                  <input
                    type="number"
                    value={vHR}
                    onChange={e => setVHR(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Respiration (Napas x/m)</label>
                  <input
                    type="number"
                    value={vRR}
                    onChange={e => setVRR(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Suhu Celcius (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={vTemp}
                    onChange={e => setVTemp(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Saturasi Oksigen SpO2 (%)</label>
                  <input
                    type="number"
                    value={vSpO2}
                    onChange={e => setVSpO2(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tingkat Kesadaran (AVPU)</label>
                <select
                  value={vAVPU}
                  onChange={e => setVAVPU(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Alert">Alert (Sadar Penuh)</option>
                  <option value="Voice">Voice (Merespon Suara)</option>
                  <option value="Pain">Pain (Merespon Nyeri)</option>
                  <option value="Unresponsive">Unresponsive (Tidak Sadar)</option>
                </select>
              </div>

              {/* Automatic EWS Calculated Display */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  currentEws >= 7
                    ? 'bg-red-950/40 border-red-500/50 text-red-300'
                    : currentEws >= 5
                    ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                    : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                }`}
              >
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider">Hasil Kalkulasi EWS Score</div>
                  <div className="font-bold text-sm">
                    {currentEws >= 7 ? 'EWS Tinggi (Kritis) - Notifikasi Dokter DPJP' : currentEws >= 5 ? 'EWS Sedang (Observasi 1 Jam)' : 'EWS Rendah (Stabil)'}
                  </div>
                </div>
                <div className="text-2xl font-black font-mono px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                  {currentEws}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
              >
                Simpan Hasil Pemeriksaan TTV
              </button>
            </form>
          </div>

          {/* Historical Logs (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Riwayat Observasi TTV & EWS Pasien Inpatient</span>
              <span className="text-xs text-teal-400 font-mono">Live Sync SIMRS</span>
            </h2>

            <div className="space-y-3">
              {vitalsList.map(rec => (
                <div key={rec.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <div>
                      <span className="font-bold text-white">{rec.patientName}</span>
                      <span className="text-teal-400 font-mono text-[11px] ml-2">({rec.bedName})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[10px] font-mono">{rec.timestamp}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
                          rec.ewsScore >= 7
                            ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse'
                            : rec.ewsScore >= 5
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}
                      >
                        EWS: {rec.ewsScore}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Tekanan Darah</span>
                      <span className="font-bold text-white font-mono">{rec.systolic}/{rec.diastolic} mmHg</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Nadi / HR</span>
                      <span className="font-bold text-cyan-300 font-mono">{rec.heartRate} bpm</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Respirasi / SpO2</span>
                      <span className="font-bold text-white font-mono">{rec.respirationRate} x/m • {rec.spO2}%</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-slate-400 block text-[10px]">Suhu / Kesadaran</span>
                      <span className="font-bold text-amber-300 font-mono">{rec.temperature}°C • {rec.avpu}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: SHIFT HANDOVER (SBAR) */}
      {activeTab === 'Handover' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* SBAR Form (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="font-bold text-white text-sm border-b border-slate-800 pb-3">
              Input Handover Shift Pasien SBAR
            </h2>

            <form onSubmit={handleAddSBARHandover} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Pilih Pasien</label>
                <select
                  value={sbarPatient}
                  onChange={e => setSbarPatient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  <option value="Ahmad Dahlan (Mawar 101-A)">Ahmad Dahlan (Mawar 101-A)</option>
                  <option value="Dewi Lestari (Melati 201-B)">Dewi Lestari (Melati 201-B)</option>
                  <option value="Budi Santoso (ICU Bed 02)">Budi Santoso (ICU Bed 02)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Shift Dari</label>
                  <select
                    value={sbarShiftFrom}
                    onChange={e => setSbarShiftFrom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Shift Pagi">Shift Pagi</option>
                    <option value="Shift Sore">Shift Sore</option>
                    <option value="Shift Malam">Shift Malam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Shift Kepada</label>
                  <select
                    value={sbarShiftTo}
                    onChange={e => setSbarShiftTo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Shift Sore">Shift Sore</option>
                    <option value="Shift Malam">Shift Malam</option>
                    <option value="Shift Pagi">Shift Pagi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-teal-400 font-bold mb-1">S - Situation (Kondisi Terkini)</label>
                <textarea
                  required
                  rows={2}
                  value={sbarSituation}
                  onChange={e => setSbarSituation(e.target.value)}
                  placeholder="Keluhan utama, masalah keselamatan terkini..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-cyan-400 font-bold mb-1">B - Background (Latar Belakang Klinis)</label>
                <textarea
                  rows={2}
                  value={sbarBackground}
                  onChange={e => setSbarBackground(e.target.value)}
                  placeholder="Diagnosa, tindakan bedah, riwayat medis penting..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-amber-400 font-bold mb-1">A - Assessment (Hasil Penilaian TTV/Lab)</label>
                <textarea
                  rows={2}
                  value={sbarAssessment}
                  onChange={e => setSbarAssessment(e.target.value)}
                  placeholder="TTV terakhir, skala nyeri, hasil lab kritis..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-bold mb-1">R - Recommendation (Rencana & Instruksi)</label>
                <textarea
                  required
                  rows={2}
                  value={sbarRecommendation}
                  onChange={e => setSbarRecommendation(e.target.value)}
                  placeholder="Obat jam berikut, rencana rontgen, edukasi keluarga..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
              >
                Simpan Handover Shift SBAR
              </button>
            </form>
          </div>

          {/* SBAR Log Cards (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="font-bold text-white text-sm border-b border-slate-800 pb-3">
              Log Serah Terima Pasien (SBAR Shift Log)
            </h2>

            <div className="space-y-4">
              {handoverNotes.map(ho => (
                <div key={ho.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <span className="font-bold text-teal-300 text-sm">{ho.patientName}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{ho.time} • {ho.shiftFrom} → {ho.shiftTo}</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-teal-400 font-bold block mb-0.5">S (Situation):</span>
                      <p className="text-slate-200">{ho.situation}</p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-cyan-400 font-bold block mb-0.5">B (Background):</span>
                      <p className="text-slate-300">{ho.background}</p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-amber-400 font-bold block mb-0.5">A (Assessment):</span>
                      <p className="text-slate-300">{ho.assessment}</p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-emerald-400 font-bold block mb-0.5">R (Recommendation):</span>
                      <p className="text-slate-200">{ho.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: SAFETY CHECKLIST & ALKES */}
      {activeTab === 'SafetyChecklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Morse Fall Risk Calculator (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Pengkajian Risiko Jatuh Pasien (Morse Fall Scale)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getFallRiskLevel(morseTotalScore).color}`}>
                {getFallRiskLevel(morseTotalScore).label}
              </span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="block text-slate-300">1. Riwayat Jatuh (3 Bulan Terakhir)</label>
                <select
                  value={fallHistory}
                  onChange={e => setFallHistory(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value={0}>Tidak Pernah / Tidak Ada (Skor 0)</option>
                  <option value={25}>Pernah Jatuh (Skor 25)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300">2. Diagnosa Sekunder / Komorbiditas</label>
                <select
                  value={secondaryDiagnosis}
                  onChange={e => setSecondaryDiagnosis(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value={0}>Tidak Ada (Skor 0)</option>
                  <option value={15}>Ada Diagnosa Sekunder (Skor 15)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300">3. Alat Bantu Jalan</label>
                <select
                  value={ambulatoryAid}
                  onChange={e => setAmbulatoryAid(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value={0}>Mandiri / Bedrest (Skor 0)</option>
                  <option value={15}>Tongkat / Kruk / Walker (Skor 15)</option>
                  <option value={30}>Memegang Cengkeraman Meja/Dinding (Skor 30)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300">4. Terpasang Terapi Infus / Heparin Lock</label>
                <select
                  value={ivTherapy}
                  onChange={e => setIvTherapy(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value={0}>Tidak Terpasang (Skor 0)</option>
                  <option value={20}>Terpasang Infus (Skor 20)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-300">5. Gaya Berjalan / Cara Berdiri</label>
                <select
                  value={gaitState}
                  onChange={e => setGaitState(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value={0}>Normal / Tidak Dapat Berjalan (Skor 0)</option>
                  <option value={10}>Lemah / Perlu Sandaran (Skor 10)</option>
                  <option value={20}>Terganggu / Langkah Pincang (Skor 20)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">Total Skor Morse</div>
                  <div className="text-xl font-bold font-mono text-white">{morseTotalScore} Poin</div>
                </div>
                <button
                  onClick={() => showToast(`Status Risiko Jatuh diset ke: ${getFallRiskLevel(morseTotalScore).label}`)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg text-xs"
                >
                  Pasang Gelang Kuning
                </button>
              </div>
            </div>
          </div>

          {/* Emergency Trolley & Equipment Checklist (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-teal-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Checklist Kesiapan Troli Emergency & Alkes Shift</span>
              <span className="text-[10px] text-emerald-400 font-mono">Verified Safe</span>
            </h2>

            <div className="space-y-2 text-xs">
              {Object.entries(trolleyChecked).map(([key, val]) => (
                <label
                  key={key}
                  className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 cursor-pointer hover:border-teal-500/50"
                >
                  <span className="capitalize font-bold text-slate-200">
                    {key === 'defibrillator'
                      ? 'Defibrillator Biphasic + Gel'
                      : key === 'suctionMachine'
                      ? 'Mesin Suction Sentral / Portable'
                      : key === 'emergencyMedKit'
                      ? 'Troli Obat Kritis (Epinefrin, SA, Amiodaron)'
                      : key === 'oxygenTank'
                      ? 'Tabung O2 Cadangan & Flowmeter'
                      : key === 'ambubag'
                      ? 'Ambubag Dewasa & Masker Oksigen'
                      : 'Laryngoscope Set & Intubasi Tube'}
                  </span>
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={() => setTrolleyChecked({ ...trolleyChecked, [key]: !val })}
                    className="w-4 h-4 accent-teal-500 rounded cursor-pointer"
                  />
                </label>
              ))}

              <button
                onClick={() => showToast('Checklist Troli Emergency Shift berhasil diverifikasi & disegel!')}
                className="w-full mt-2 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all"
              >
                Verifikasi Checklist Kesiapan Shift
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NEW TASK */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Tambah Instruksi Keperawatan Baru</h3>
              <button onClick={() => setShowNewTaskModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={newTaskPatient}
                  onChange={e => setNewTaskPatient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Ruangan / Bed</label>
                  <input
                    type="text"
                    required
                    value={newTaskBed}
                    onChange={e => setNewTaskBed(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Waktu Pelaksanaan</label>
                  <input
                    type="text"
                    required
                    value={newTaskTime}
                    onChange={e => setNewTaskTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Jenis Tindakan</label>
                <select
                  value={newTaskType}
                  onChange={e => setNewTaskType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Pemberian Obat">Pemberian Obat</option>
                  <option value="Vital Sign">Pemeriksaan Vital Sign</option>
                  <option value="Infus">Ganti Infus / IV Line</option>
                  <option value="Perawatan Luka">Perawatan Luka / Wound Care</option>
                  <option value="Kateter">Kateter Urine</option>
                  <option value="Mobilisasi">Mobilisasi Pasien</option>
                  <option value="Edukasi">Edukasi Pasien / Keluarga</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detail Instruksi</label>
                <textarea
                  required
                  rows={3}
                  value={newTaskDesc}
                  onChange={e => setNewTaskDesc(e.target.value)}
                  placeholder="Detail instruksi tindakan perawat..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  Simpan Tugas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
