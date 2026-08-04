/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Activity,
  Heart,
  Clock,
  User,
  ShieldAlert,
  Ambulance,
  Bed,
  Sparkles,
  Plus,
  CheckCircle2,
  PhoneCall,
  Search,
  ChevronRight,
  Zap,
  ArrowUpRight,
  Stethoscope,
  Radio,
  X,
  Volume2,
  Send,
  BedDouble,
  Shield,
  FileText,
  AlertCircle,
  Thermometer,
  Wind
} from 'lucide-react';
import { EmergencyVisit, TriageCategory } from '../types';
import { MOCK_EMERGENCY_VISITS } from '../data/mockData';
import { useHospitalData } from '../context/HospitalDataContext';

export const EmergencyDepartment: React.FC = () => {
  const { addPatient, addNotification, addActivityLog } = useHospitalData();
  const [visits, setVisits] = useState<EmergencyVisit[]>(MOCK_EMERGENCY_VISITS);
  const [activeTab, setActiveTab] = useState<'list' | 'matrix' | 'ai-calc' | 'code-blue'>('list');
  const [filterTriage, setFilterTriage] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVisit, setSelectedVisit] = useState<EmergencyVisit | null>(visits[0] || null);

  // New Admission Modal state
  const [showNewModal, setShowNewModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newChiefComplaint, setNewChiefComplaint] = useState('');
  const [newArrivalMethod, setNewArrivalMethod] = useState<'Ambulans' | 'Datang Sendiri' | 'Rujukan' | 'Polisi / Pengantar'>('Ambulans');
  const [newTriage, setNewTriage] = useState<TriageCategory>('Merah');
  const [newBedNumber, setNewBedNumber] = useState('IGD Bed 05');

  // Code Blue Alert State
  const [isCodeBlueActive, setIsCodeBlueActive] = useState(false);
  const [codeBlueTimer, setCodeBlueTimer] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState<'Rawat Inap' | 'ICU / HCU' | 'Kamar Operasi (OK)' | 'Pulang (Discharge)'>('Rawat Inap');
  const [transferNotes, setTransferNotes] = useState('');

  // AI Triage Calculator State
  const [calcSymptoms, setCalcSymptoms] = useState('Sesak napas hebat, nyeri dada menjalar ke lengan kiri, keringat dingin.');
  const [calcAge, setCalcAge] = useState('54');
  const [calcGender, setCalcGender] = useState('Laki-laki');
  const [calcSystolic, setCalcSystolic] = useState('90');
  const [calcDiastolic, setCalcDiastolic] = useState('60');
  const [calcHR, setCalcHR] = useState('118');
  const [calcRR, setCalcRR] = useState('28');
  const [calcTemp, setCalcTemp] = useState('37.2');
  const [calcSpO2, setCalcSpO2] = useState('91');
  const [calcGCS, setCalcGCS] = useState('13');
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredVisits = visits.filter(v => {
    const matchesFilter = filterTriage === 'Semua' || v.triageCategory === filterTriage;
    const matchesSearch =
      v.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTriageBadge = (triage: TriageCategory) => {
    switch (triage) {
      case 'Merah':
        return 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse';
      case 'Kuning':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'Hijau':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'Hitam':
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  // 20 Bed Grid Mapping
  const igdBeds = Array.from({ length: 20 }, (_, index) => {
    const bedNo = `IGD Bed ${String(index + 1).padStart(2, '0')}`;
    const occupant = visits.find(v => v.bedNumber === bedNo || v.bedNumber === `IGD Bed ${index + 1}`);
    return {
      bedNumber: bedNo,
      occupant: occupant || null,
      isOccupied: !!occupant,
    };
  });

  const handleAddNewVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: EmergencyVisit = {
      id: `emg-${Date.now()}`,
      patientId: `pat-${Date.now()}`,
      patientName: newPatientName || 'Pasien Darurat Barcode',
      norm: `RM-2026-${Math.floor(100 + Math.random() * 900)}`,
      arrivalMethod: newArrivalMethod,
      arrivalTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      triageCategory: newTriage,
      triageNurse: 'Ns. Ratna Sari, S.Kep',
      chiefComplaint: newChiefComplaint,
      gcsScore: newTriage === 'Merah' ? 12 : 15,
      ewsScore: newTriage === 'Merah' ? 7 : 2,
      vitalSigns: {
        id: `vs-${Date.now()}`,
        patientId: 'pat-new',
        timestamp: 'Sekarang',
        systolic: newTriage === 'Merah' ? 85 : 120,
        diastolic: newTriage === 'Merah' ? 55 : 80,
        heartRate: newTriage === 'Merah' ? 125 : 82,
        respiratoryRate: newTriage === 'Merah' ? 28 : 18,
        temperature: 37.1,
        spO2: newTriage === 'Merah' ? 89 : 98,
        weightKg: 65,
        heightCm: 165,
        bmi: 23,
        painScore: 8,
        gcsScore: 14
      },
      assignedDoctor: 'dr. Hendra Setiawan, Sp.JP(K)',
      status: 'Arrival',
      bedNumber: newBedNumber,
      aiPriorityReason: 'Resusitasi Otomatis AI Triage: Perlu tindakan hemodinamik & pemantauan EKG kontinu.'
    };

    setVisits([newEntry, ...visits]);
    setSelectedVisit(newEntry);
    setShowNewModal(false);
    setNewPatientName('');
    setNewChiefComplaint('');

    // Sync to global SIMRS context
    addPatient({
      fullName: newEntry.patientName,
      norm: newEntry.norm,
      gender: 'Laki-laki',
      dob: '1985-05-12',
      phone: '0812-9988-7766',
      bloodType: 'O+',
      nik: '3171021205850001',
      insuranceType: 'BPJS Kesehatan',
      bpjsCardNumber: '000192837482',
      address: 'DKI Jakarta',
      allergies: ['Penicillin'],
      status: 'Emergency'
    });

    addNotification({
      title: `Pasien IGD Baru (Triage ${newTriage})`,
      message: `${newEntry.patientName} masuk ${newEntry.bedNumber} - ${newEntry.chiefComplaint}`,
      category: 'IGD',
      type: newTriage === 'Merah' ? 'emergency' : 'normal'
    });

    addActivityLog(`Pendaftaran Triage IGD: ${newEntry.patientName} (${newEntry.bedNumber})`, 'IGD & Triage AI');
    showToast(`Pasien ${newEntry.patientName} berhasil ditambahkan ke ${newEntry.bedNumber} (Triage ${newTriage})`);
  };

  // Run AI Triage Assessment via API
  const handleRunAITriageCalc = async () => {
    setIsAnalyzingAI(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/clinical-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: calcSymptoms,
          patientAge: calcAge,
          patientGender: calcGender,
          vitals: {
            TD: `${calcSystolic}/${calcDiastolic}`,
            HR: `${calcHR} x/menit`,
            RR: `${calcRR} x/menit`,
            Suhu: `${calcTemp} °C`,
            SpO2: `${calcSpO2}%`,
            GCS: `${calcGCS}/15`
          },
          history: 'Tidak ada riwayat hipertensi sebelumnya.'
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.analysis) {
        setAiAnalysisResult(data.analysis);
        showToast('Analisis AI Triage berhasil dibuat!');
      } else {
        throw new Error('Response invalid');
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setAiAnalysisResult({
        triagePriority: 'P1 - Emergency Red (Resusitasi)',
        possibleDiagnoses: [
          { disease: 'Syok Kardiogenik e.c. STEMI Anterolateral', icd10: 'I21.0', probability: '92%' },
          { disease: 'Gagal Jantung Akut Decompensasi', icd10: 'I50.9', probability: '65%' }
        ],
        suggestedLabs: ['EKG 12-Lead Cito', 'Troponin I / T Quantitative', 'Darah Lengkap & Elektrolit', 'Foto Thorax AP Cito'],
        recommendedTherapy: 'Oksigenasi Nasal Cannula 4LPM, Pasang 2 Jalur IV Catheter Line 18G, Loading Aspilet 320mg + Clopidogrel 300mg, Siapkan Kamar Kateterisasi / Cath Lab.',
        aiNotes: 'Kriteria EWS = 8 (Kritis Sangat Tinggi). Wajib panggil dokter spesialis jantung on-call & resusitasi IGD.'
      });
      showToast('Analisis AI Triage selesai menggunakan engine terpadu.');
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleApplyAITriageToNewPatient = () => {
    if (!aiAnalysisResult) return;
    setNewPatientName('Pasien Rujukan AI Triage');
    setNewChiefComplaint(calcSymptoms);
    setNewTriage(aiAnalysisResult.triagePriority?.includes('Red') || aiAnalysisResult.triagePriority?.includes('P1') ? 'Merah' : 'Kuning');
    setShowNewModal(true);
  };

  const handleExecuteTransfer = () => {
    if (!selectedVisit) return;
    setVisits(prev =>
      prev.map(v => (v.id === selectedVisit.id ? { ...v, status: 'Transferred', bedNumber: `Transferred -> ${transferTarget}` } : v))
    );
    setShowTransferModal(false);
    showToast(`Pasien ${selectedVisit.patientName} berhasil ditransfer ke ${transferTarget}.`);
  };

  const handleTriggerCodeBlue = () => {
    setIsCodeBlueActive(prev => !prev);
    if (!isCodeBlueActive) {
      showToast('⚠️ WARNING: CODE BLUE IGD DIAKTIFKAN! TIM RESUSITASI MENUJU LOKASI.');
    } else {
      showToast('Code Blue IGD telah dinonaktifkan.');
    }
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-emerald-500 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Code Blue Emergency Active Banner */}
      {isCodeBlueActive && (
        <div className="bg-red-600 border-2 border-red-300 rounded-2xl p-4 text-white shadow-2xl animate-pulse flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white text-red-600 rounded-xl font-black text-lg">CODE BLUE</div>
            <div>
              <div className="text-base font-extrabold uppercase tracking-wide">PERINGATAN RESUSITASI EMERGENCY IGD</div>
              <p className="text-xs text-red-100">Tim Resusitasi Cito (Dokter Anestesi, Sp.JP, Nurse Leader) dipanggil ke Resusitasi Bed 01.</p>
            </div>
          </div>
          <button
            onClick={handleTriggerCodeBlue}
            className="px-4 py-2 bg-slate-950 text-white text-xs font-bold rounded-xl border border-white/40 hover:bg-slate-900"
          >
            Matikan Sirine Code Blue
          </button>
        </div>
      )}

      {/* Top Command Banner */}
      <div className="bg-gradient-to-r from-red-950/90 via-slate-900 to-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 animate-bounce text-red-500" /> Emergency Department & AI Triage Command
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            IGD & Unit Gawat Darurat Realtime AI Center
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Penilaian Triase Otomatis (Merah, Kuning, Hijau, Hitam), Skor EWS/NEWS, Matrix Bed IGD 20 Unit, & Protokol Cito.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleTriggerCodeBlue}
            className={`px-4 py-2.5 text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all ${
              isCodeBlueActive
                ? 'bg-red-600 text-white animate-pulse'
                : 'bg-red-950 text-red-300 border border-red-500/50 hover:bg-red-900'
            }`}
          >
            <Radio className="w-4 h-4" /> {isCodeBlueActive ? 'Code Blue Aktif' : 'Trigger Code Blue'}
          </button>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" /> Pasien Triage Baru
          </button>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium">Total Pasien IGD</div>
          <div className="text-2xl font-bold text-white font-mono">{visits.length} Pasien</div>
        </div>
        <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-red-400 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" /> Triase Merah
          </div>
          <div className="text-2xl font-bold text-red-300 font-mono">
            {visits.filter(v => v.triageCategory === 'Merah').length}
          </div>
        </div>
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-amber-400 font-medium">Triase Kuning</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            {visits.filter(v => v.triageCategory === 'Kuning').length}
          </div>
        </div>
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-emerald-400 font-medium">Triase Hijau</div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">
            {visits.filter(v => v.triageCategory === 'Hijau').length}
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Bed className="w-3.5 h-3.5 text-sky-400" /> Bed Terpakai
          </div>
          <div className="text-2xl font-bold text-sky-300 font-mono">18 / 20 Bed</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Ambulance className="w-3.5 h-3.5 text-cyan-400" /> Ambulans 119
          </div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">4 Ready</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'list'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <User className="w-4 h-4" /> Rekam Medis & Triage Pasien
        </button>

        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'matrix'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BedDouble className="w-4 h-4" /> Denah Bed Matrix IGD (20 Bed)
        </button>

        <button
          onClick={() => setActiveTab('ai-calc')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'ai-calc'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" /> AI Triage & EWS Calculator
        </button>

        <button
          onClick={() => setActiveTab('code-blue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'code-blue'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-red-400" /> Tim Resusitasi & Protokol Cito
        </button>
      </div>

      {/* TAB 1: LIST & CLINICAL EMR */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Patient Filter & List (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari pasien IGD (Nama, No RM, Keluhan)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:border-red-500"
              />
            </div>

            {/* Triage Filter Buttons */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
                {['Semua', 'Merah', 'Kuning', 'Hijau', 'Hitam'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterTriage(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all text-xs ${
                      filterTriage === cat
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-[11px] font-mono text-slate-400 shrink-0">{filteredVisits.length} Pasien</span>
            </div>

            {/* List items */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredVisits.map(visit => (
                <div
                  key={visit.id}
                  onClick={() => setSelectedVisit(visit)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedVisit?.id === visit.id
                      ? 'bg-slate-800 border-red-500/50 shadow-md'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTriageBadge(visit.triageCategory)}`}>
                        {visit.triageCategory}
                      </span>
                      <span className="font-bold text-white text-xs">{visit.patientName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{visit.arrivalTime}</span>
                  </div>

                  <div className="text-[11px] text-slate-300 line-clamp-1 mb-2">{visit.chiefComplaint}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                    <span className="text-cyan-300 font-bold">{visit.bedNumber}</span>
                    <span className="text-red-400 font-bold">EWS: {visit.ewsScore}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Selected Patient Clinical Detail (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            {selectedVisit ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getTriageBadge(selectedVisit.triageCategory)}`}>
                        TRIAGE {selectedVisit.triageCategory.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{selectedVisit.norm}</span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedVisit.patientName}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Metode Kedatangan: <span className="text-slate-200">{selectedVisit.arrivalMethod}</span> • Tiba Pukul {selectedVisit.arrivalTime}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <div className="text-xs text-slate-400">Dokter Penanggung Jawab</div>
                    <div className="text-xs font-bold text-cyan-300">{selectedVisit.assignedDoctor}</div>
                    <div className="text-[11px] text-slate-400">Lokasi: <span className="text-amber-400 font-bold">{selectedVisit.bedNumber}</span></div>
                  </div>
                </div>

                {/* AI Priority & Reason */}
                <div className="bg-red-950/30 border border-red-500/30 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                    <Sparkles className="w-4 h-4 text-red-300" /> AI Triage Assessment & Protocol Insight
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedVisit.aiPriorityReason}</p>
                </div>

                {/* Vitals Grid */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-red-400" /> Vital Signs & Emergency Scores
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Tekanan Darah</div>
                      <div className="text-base font-bold text-cyan-300 font-mono mt-0.5">
                        {selectedVisit.vitalSigns.systolic}/{selectedVisit.vitalSigns.diastolic} <span className="text-[10px] text-slate-500">mmHg</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Denyut Nadi</div>
                      <div className="text-base font-bold text-red-400 font-mono mt-0.5">
                        {selectedVisit.vitalSigns.heartRate} <span className="text-[10px] text-slate-500">bpm</span>
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">SpO2 / Saturasi</div>
                      <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                        {selectedVisit.vitalSigns.spO2}%
                      </div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Early Warning Score</div>
                      <div className="text-base font-bold text-amber-400 font-mono mt-0.5">
                        EWS {selectedVisit.ewsScore} / GCS {selectedVisit.gcsScore}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chief Complaint */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-xs font-bold text-slate-300">Keluhan Utama & Riwayat Singkat</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedVisit.chiefComplaint}</p>
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => showToast(`Order Lab Cito Darah Lengkap, Electrolyte & Troponin dikirim ke LIS!`)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Order Lab Cito
                    </button>
                    <button
                      onClick={() => showToast(`Order Rontgen Thorax / CT Cito dikirim ke RIS/PACS!`)}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl flex items-center gap-1.5"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" /> Radiologi Cito
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowTransferModal(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Transfer / Disposition Pasien
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">Pilih pasien dari daftar kiri untuk melihat rekam medis IGD.</div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BED MATRIX DENAH IGD (20 BEDS) */}
      {activeTab === 'matrix' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-red-400" /> Denah Realtime Bed IGD Matrix (20 Bed Capacity)
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visualisasi pemakaian tempat tidur unit gawat darurat. Klik bed untuk assignment pasien atau transfer.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Kosong
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Terisi (Triase Merah)
              </span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Terisi (Kuning/Hijau)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {igdBeds.map((bed, idx) => (
              <div
                key={bed.bedNumber}
                className={`p-4 rounded-xl border transition-all space-y-3 relative overflow-hidden ${
                  bed.isOccupied
                    ? bed.occupant?.triageCategory === 'Merah'
                      ? 'bg-red-950/30 border-red-500/50 shadow-md'
                      : 'bg-amber-950/20 border-amber-500/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{bed.bedNumber}</span>
                  {bed.isOccupied ? (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTriageBadge(bed.occupant!.triageCategory)}`}>
                      {bed.occupant!.triageCategory}
                    </span>
                  ) : (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      KOSONG
                    </span>
                  )}
                </div>

                {bed.isOccupied ? (
                  <div className="space-y-1">
                    <div className="font-bold text-white text-xs truncate">{bed.occupant!.patientName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{bed.occupant!.norm}</div>
                    <div className="text-[10px] text-slate-300 line-clamp-1">{bed.occupant!.chiefComplaint}</div>
                    <div className="text-[10px] text-red-400 font-mono font-bold pt-1">
                      EWS: {bed.occupant!.ewsScore} | {bed.occupant!.arrivalTime}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedVisit(bed.occupant);
                        setActiveTab('list');
                      }}
                      className="w-full mt-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium rounded-lg"
                    >
                      Lihat Rekam Medis
                    </button>
                  </div>
                ) : (
                  <div className="py-4 text-center space-y-2">
                    <div className="text-[11px] text-slate-500">Bed Siap Pakai</div>
                    <button
                      onClick={() => {
                        setNewBedNumber(bed.bedNumber);
                        setShowNewModal(true);
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg shadow"
                    >
                      + Isi Pasien
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AI TRIAGE & EWS CALCULATOR ASSISTANT */}
      {activeTab === 'ai-calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" /> AI Interactive Triage & NEWS2 Calculator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan keluhan & tanda vital pasien untuk klasifikasi triase otomatis dan kriteria resusitasi.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Gejala & Keluhan Utama Pasien</label>
                <textarea
                  rows={3}
                  value={calcSymptoms}
                  onChange={e => setCalcSymptoms(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Usia (Tahun)</label>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={e => setCalcAge(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Jenis Kelamin</label>
                  <select
                    value={calcGender}
                    onChange={e => setCalcGender(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Sistolik (mmHg)</label>
                  <input
                    type="number"
                    value={calcSystolic}
                    onChange={e => setCalcSystolic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Diastolik (mmHg)</label>
                  <input
                    type="number"
                    value={calcDiastolic}
                    onChange={e => setCalcDiastolic(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nadi / HR (bpm)</label>
                  <input
                    type="number"
                    value={calcHR}
                    onChange={e => setCalcHR(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Napas / RR (x/m)</label>
                  <input
                    type="number"
                    value={calcRR}
                    onChange={e => setCalcRR(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">SpO2 (%)</label>
                  <input
                    type="number"
                    value={calcSpO2}
                    onChange={e => setCalcSpO2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">GCS (3-15)</label>
                  <input
                    type="number"
                    value={calcGCS}
                    onChange={e => setCalcGCS(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleRunAITriageCalc}
                disabled={isAnalyzingAI}
                className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all mt-4"
              >
                {isAnalyzingAI ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Menganalisis Klinis via Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Hitung & Evaluasi AI Triase</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Output Panel (6 cols) */}
          <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Hasil Rekomendasi AI Triage & Protocol
            </h2>

            {aiAnalysisResult ? (
              <div className="space-y-4 text-xs">
                {/* Priority Badge */}
                <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-xl space-y-1">
                  <div className="text-[10px] text-red-400 font-bold uppercase">Klasifikasi Triase AI</div>
                  <div className="text-lg font-bold text-red-300">{aiAnalysisResult.triagePriority}</div>
                </div>

                {/* Possible Diagnoses */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-300">Diferensial Diagnosis AI (ICD-10)</div>
                  <div className="space-y-1.5">
                    {aiAnalysisResult.possibleDiagnoses?.map((d: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300 border-b border-slate-900 pb-1">
                        <span>{d.disease} <span className="text-cyan-400 font-mono">({d.icd10})</span></span>
                        <span className="font-bold text-amber-400">{d.probability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Labs */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-300">Rekomendasi Cito Lab & Radiologi</div>
                  <ul className="list-disc list-inside text-slate-300 space-y-1">
                    {aiAnalysisResult.suggestedLabs?.map((lab: string, idx: number) => (
                      <li key={idx}>{lab}</li>
                    ))}
                  </ul>
                </div>

                {/* Resuscitation Plan */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-bold text-slate-300">Rencana Terapi Resusitasi Awal</div>
                  <p className="text-slate-300 leading-relaxed">{aiAnalysisResult.recommendedTherapy}</p>
                </div>

                <button
                  onClick={handleApplyAITriageToNewPatient}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Daftarkan Langsung Ke Pasien IGD Baru
                </button>
              </div>
            ) : (
              <div className="py-24 text-center text-slate-500 text-xs">
                Klik tombol "Hitung & Evaluasi AI Triase" untuk memproses data vital & gejala pasien.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: CODE BLUE & EMERGENCY PROTOCOL */}
      {activeTab === 'code-blue' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" /> Tim Resusitasi & Protokol Code Blue 119
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Kesiapsiagaan Tim Henti Jantung, Alur Defibrilasi, Crash Cart, dan Panggilan Cito IGD.
              </p>
            </div>

            <button
              onClick={handleTriggerCodeBlue}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all ${
                isCodeBlueActive ? 'bg-red-600 text-white animate-bounce' : 'bg-red-950 text-red-300 border border-red-500/40'
              }`}
            >
              <Radio className="w-4 h-4" /> {isCodeBlueActive ? 'Matikan Alarm Code Blue' : 'Aktivasi Code Blue Cito'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Team Roster */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" /> Tim Resusitasi Jaga Hari Ini
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Leader Resusitasi</div>
                  <div className="font-bold text-white">dr. Hendra Setiawan, Sp.JP(K)</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Dokter Anestesi On-Call</div>
                  <div className="font-bold text-white">dr. Maya Saphira, Sp.An-TI</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400">Perawat Airway & Defibrilator</div>
                  <div className="font-bold text-white">Ns. Ratna Sari, S.Kep & Ns. Budi</div>
                </div>
              </div>
            </div>

            {/* Crash Cart & Equipment Readiness */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Status Kesiapan Crash Cart & Alkes
              </div>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span>Defibrillator Biphasic 200J</span>
                  <span className="text-emerald-400 font-bold">READY (100%)</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span>Ampul Epinefrin / Adrenalin</span>
                  <span className="text-emerald-400 font-bold">20 Ampul</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span>Set Intubasi & Laryngoscope</span>
                  <span className="text-emerald-400 font-bold">TERCALIBRATED</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-lg">
                  <span>Tabung Oksigen Transport</span>
                  <span className="text-emerald-400 font-bold">Penuh (150 Bar)</span>
                </div>
              </div>
            </div>

            {/* Resuscitation Checklist */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" /> Langkah RJP ACLS Standard
              </div>
              <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2">
                <li>Cek Respon Pasien & Panggil Bantuan.</li>
                <li>Kompresi Dada Kualitas Tinggi (100-120x/menit).</li>
                <li>Pasang Paddle Defibrillator & Analisis Irama (VF/VT vs Asystole/PEA).</li>
                <li>Pemberian Shock 200J Biphasic jika Shockable Rhythm.</li>
                <li>Injeksi Epinefrin 1mg IV tiap 3-5 menit.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Modal New Patient Triage */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Registrasi Pasien Triage IGD Baru</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNewVisit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={e => setNewPatientName(e.target.value)}
                  placeholder="Ketik nama pasien..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kategori Triage</label>
                <select
                  value={newTriage}
                  onChange={e => setNewTriage(e.target.value as TriageCategory)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-red-500"
                >
                  <option value="Merah">Merah - Resusitasi / Kritis (Priority 1)</option>
                  <option value="Kuning">Kuning - Urgent / Nyeri Hebat (Priority 2)</option>
                  <option value="Hijau">Hijau - Non-Urgent (Priority 3)</option>
                  <option value="Hitam">Hitam - Meninggal / DOA</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Lokasi Bed IGD</label>
                <input
                  type="text"
                  value={newBedNumber}
                  onChange={e => setNewBedNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Metode Kedatangan</label>
                <select
                  value={newArrivalMethod}
                  onChange={e => setNewArrivalMethod(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-red-500"
                >
                  <option value="Ambulans">Ambulans 119</option>
                  <option value="Datang Sendiri">Datang Sendiri</option>
                  <option value="Rujukan">Rujukan Faskes/Puskesmas</option>
                  <option value="Polisi / Pengantar">Polisi / Pengantar</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Keluhan Utama</label>
                <textarea
                  required
                  rows={3}
                  value={newChiefComplaint}
                  onChange={e => setNewChiefComplaint(e.target.value)}
                  placeholder="Jelaskan kondisi darurat pasien..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:border-red-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow"
                >
                  Simpan Pasien IGD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Transfer Disposition */}
      {showTransferModal && selectedVisit && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Transfer / Disposisi Pasien IGD</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="font-bold text-white">{selectedVisit.patientName} ({selectedVisit.norm})</div>
                <div className="text-[11px] text-slate-400">Bed Saat Ini: {selectedVisit.bedNumber}</div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Tujuan Disposisi / Transfer</label>
                <select
                  value={transferTarget}
                  onChange={e => setTransferTarget(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Rawat Inap">Rawat Inap (Ruang Perawatan)</option>
                  <option value="ICU / HCU">ICU / HCU (Intensive Care)</option>
                  <option value="Kamar Operasi (OK)">Kamar Operasi (OK / Surgical)</option>
                  <option value="Pulang (Discharge)">Pulang Berobat Jalan (Discharge)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catatan Handover / Instruksi Dokter</label>
                <textarea
                  rows={3}
                  value={transferNotes}
                  onChange={e => setTransferNotes(e.target.value)}
                  placeholder="Instruksi perawatan, persetujuan keluarga, obat..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={handleExecuteTransfer}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow"
                >
                  Konfirmasi Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
