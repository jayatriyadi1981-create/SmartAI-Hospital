import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  Calendar,
  FileText,
  AlertTriangle,
  Sparkles,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Activity,
  Heart,
  ChevronRight,
  Eye,
  RefreshCw,
  Plus,
  Stethoscope,
  Pill,
  CreditCard,
  Edit,
  Printer,
  QrCode,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Download,
  Building,
  Bed,
  UserPlus,
  Check,
  Hash,
  Share2,
  Maximize2
} from 'lucide-react';
import { Patient, PatientTimelineEvent, PatientAISummary } from '../types';
import { MOCK_PATIENTS, MOCK_PATIENT_TIMELINES, MOCK_PATIENT_AI_SUMMARIES } from '../data/mockData';

interface PatientManagementProps {
  onSelectPatientForEMR?: (patient: Patient) => void;
  onAddNewPatient?: () => void;
  onNavigateToPolyclinic?: (patient: Patient) => void;
  onNavigateToInpatient?: (patient: Patient) => void;
}

export const PatientManagement: React.FC<PatientManagementProps> = ({
  onSelectPatientForEMR,
  onAddNewPatient,
  onNavigateToPolyclinic,
  onNavigateToInpatient
}) => {
  const [patientsList, setPatientsList] = useState<Patient[]>(MOCK_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(MOCK_PATIENTS[0]);
  const [activeTab, setActiveTab] = useState<'demography' | 'timeline' | 'vitals' | 'bpjs' | 'documents'>('demography');

  // AI Summary state
  const [aiSummary, setAiSummary] = useState<PatientAISummary | null>(MOCK_PATIENT_AI_SUMMARIES[0]);
  const [isGeneratingAISummary, setIsGeneratingAISummary] = useState(false);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPrintCardOpen, setIsPrintCardOpen] = useState(false);
  const [isPrintLabelOpen, setIsPrintLabelOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Patient>>({});

  // Filter patients
  const filteredPatients = patientsList.filter(p => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nik.includes(searchQuery) ||
      p.phone.includes(searchQuery);
    const matchesCat = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'Semua' || p.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Generate AI Summary for selected patient
  const handleGenerateAISummary = async (patient: Patient) => {
    setIsGeneratingAISummary(true);
    try {
      const res = await fetch('/api/ai/patient-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMessage: `Buatkan resume medis ringkas executive summary untuk pasien ${patient.fullName}, RM ${patient.norm}, Umur 44th dengan riwayat ${patient.chronicConditions?.join(', ')} dan Alergi ${patient.allergies?.join(', ')}.`,
          patientName: patient.fullName,
          medicalContext: `Pasien ${patient.category}, Status ${patient.status}`
        })
      });
      const data = await res.json();

      setAiSummary({
        patientId: patient.id,
        summaryText: data.reply || `Pasien ${patient.fullName} (${patient.norm}) terdaftar dengan status ${patient.status}. Memiliki riwayat ${patient.chronicConditions?.join(', ')} dan alergi ${patient.allergies?.join(', ')}.`,
        chronicDiseaseHistory: patient.chronicConditions || ['Tidak ada catatan kronis'],
        drugAllergies: patient.allergies || ['Tidak ada alergi obat'],
        surgicalHistory: ['Apendektomi Laparoskopi (2022)'],
        currentHealthStatus: patient.status,
        highRiskFactors: patient.allergies?.length ? ['Risiko Alergi Obat Anfilaksis', 'Hipertensi Grade II'] : ['Faktor Risiko Rendah'],
        aiGeneratedAt: new Date().toLocaleString('id-ID')
      });
    } catch (e) {
      setAiSummary({
        patientId: patient.id,
        summaryText: `Resume Medis AI: Pasien ${patient.fullName} (${patient.norm}) memiliki riwayat ${patient.chronicConditions?.join(', ') || 'sehat'}. Memerlukan evaluasi rutin tanda vital dan kontrol kepatuhan minum obat.`,
        chronicDiseaseHistory: patient.chronicConditions || [],
        drugAllergies: patient.allergies || [],
        surgicalHistory: [],
        currentHealthStatus: patient.status,
        highRiskFactors: patient.allergies || [],
        aiGeneratedAt: new Date().toLocaleString('id-ID')
      });
    } finally {
      setIsGeneratingAISummary(false);
    }
  };

  const handleOpenEditModal = (p: Patient) => {
    setEditFormData({ ...p });
    setIsEditModalOpen(true);
  };

  const handleSavePatientEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.id) return;

    setPatientsList(prev =>
      prev.map(p => (p.id === editFormData.id ? ({ ...p, ...editFormData } as Patient) : p))
    );

    if (selectedPatient && selectedPatient.id === editFormData.id) {
      setSelectedPatient({ ...selectedPatient, ...editFormData } as Patient);
    }

    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-slate-700/80 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4 text-cyan-400" /> Direktori Master Data Pasien & Patient Dossier
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Master Data Pasien (EMR Central Registry)
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Pengelolaan Data Demografi Pasien, Riwayat Klinis, V-Claim BPJS, Label Barcode RM, dan Resume Medis AI Terpadu.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onAddNewPatient && (
            <button
              onClick={onAddNewPatient}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all text-xs"
            >
              <Plus className="w-4 h-4" /> Registrasi Pasien Baru
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Search & Patient Directory List, Right Detail Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search & Patient List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
          {/* Search Bar & Category Filter */}
          <div className="space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Cari Nama Pasien, No. RM, NIK, atau HP..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <span className="text-slate-500 font-semibold px-1">Penjamin:</span>
                {['Semua', 'Pasien BPJS', 'Pasien Asuransi', 'Pasien Umum'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <span className="text-slate-500 font-semibold px-1">Status:</span>
                {['Semua', 'Aktif', 'Rawat Jalan', 'Rawat Inap'].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedStatus === st
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Cards List */}
          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                Tidak ada pasien yang sesuai dengan kriteria pencarian.
              </div>
            ) : (
              filteredPatients.map(p => {
                const isSelected = selectedPatient?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      handleGenerateAISummary(p);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={p.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                            alt={p.fullName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-700"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-slate-900 ${
                              p.status === 'Rawat Inap'
                                ? 'bg-amber-400'
                                : p.status === 'Rawat Jalan'
                                ? 'bg-cyan-400'
                                : 'bg-emerald-400'
                            }`}
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-xs flex items-center gap-1.5">
                            {p.fullName}
                            <span className="text-[10px] text-slate-400 font-mono">({p.gender === 'Laki-laki' ? 'L' : 'P'})</span>
                          </div>
                          <div className="text-[11px] font-mono text-cyan-400 font-semibold mt-0.5">{p.norm}</div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300 font-medium">
                          {p.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{p.phone}</span>
                      </div>
                    </div>

                    {/* Badges for Allergies / Conditions */}
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      {p.allergies && p.allergies.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-red-950/60 border border-red-500/40 text-red-300 rounded text-[9px] font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" /> Alergi: {p.allergies.join(', ')}
                        </span>
                      )}
                      {p.chronicConditions && p.chronicConditions.length > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-950/60 border border-amber-500/40 text-amber-300 rounded text-[9px] font-medium">
                          {p.chronicConditions.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Patient Dossier (7 cols) */}
        {selectedPatient ? (
          <div className="lg:col-span-7 space-y-5">
            {/* Patient Master Card Header */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPatient.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                    alt={selectedPatient.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedPatient.fullName}</h2>
                      <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono rounded font-bold">
                        {selectedPatient.norm}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                      <span>NIK: <span className="font-mono text-slate-200 font-semibold">{selectedPatient.nik}</span></span>
                      <span>•</span>
                      <span>{selectedPatient.gender}, {selectedPatient.birthPlace}, {selectedPatient.birthDate}</span>
                      <span>•</span>
                      <span className="text-cyan-400 font-bold">Gol. {selectedPatient.bloodType}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => handleOpenEditModal(selectedPatient)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 transition"
                    title="Edit Demografi Pasien"
                  >
                    <Edit className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => setIsPrintCardOpen(true)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 transition"
                    title="Cetak Kartu Berobat RM"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Kartu RM</span>
                  </button>

                  <button
                    onClick={() => setIsPrintLabelOpen(true)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 text-xs flex items-center gap-1.5 transition"
                    title="Cetak Stiker Barcode Rekam Medis"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400" />
                    <span>Stiker</span>
                  </button>

                  {onSelectPatientForEMR && (
                    <button
                      onClick={() => onSelectPatientForEMR(selectedPatient)}
                      className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3.5 py-2 rounded-xl shadow-lg transition-all text-xs"
                    >
                      <Stethoscope className="w-3.5 h-3.5" /> Buka EMR Dokter
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Navigation Tabs inside Dossier */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar text-xs">
                {[
                  { id: 'demography', label: 'Ringkasan & Demografi', icon: UserCheck },
                  { id: 'timeline', label: 'Linimasa Rekam Medis', icon: Clock },
                  { id: 'vitals', label: 'Tanda Vital & Diagnosis', icon: Heart },
                  { id: 'bpjs', label: 'BPJS V-Claim & Penjamin', icon: ShieldCheck },
                  { id: 'documents', label: 'Lampiran Dokumen', icon: FileText }
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
                          : 'bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: RINGKASAN & DEMOGRAFI */}
              {activeTab === 'demography' && (
                <div className="space-y-4 animate-fade-in">
                  {/* AI Executive Resume Box */}
                  <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-cyan-400" /> Resume Medis Eksekutif (AI Assistant Engine)
                      </div>
                      <button
                        onClick={() => handleGenerateAISummary(selectedPatient)}
                        disabled={isGeneratingAISummary}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
                      >
                        <RefreshCw className={`w-3 h-3 ${isGeneratingAISummary ? 'animate-spin' : ''}`} />
                        Segarkan AI
                      </button>
                    </div>

                    {aiSummary ? (
                      <div className="space-y-3 text-xs">
                        <p className="text-slate-200 leading-relaxed bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                          {aiSummary.summaryText}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-red-950/30 border border-red-500/30 rounded-lg p-3">
                            <div className="text-[11px] font-bold text-red-300 mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Warning Alergi Obat
                            </div>
                            <div className="text-slate-300">
                              {aiSummary.drugAllergies.length ? aiSummary.drugAllergies.join(', ') : 'Tidak ada riwayat alergi obat.'}
                            </div>
                          </div>

                          <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-3">
                            <div className="text-[11px] font-bold text-amber-300 mb-1 flex items-center gap-1">
                              <Activity className="w-3.5 h-3.5 text-amber-400" /> Penyakit Kronis & Risiko
                            </div>
                            <div className="text-slate-300">
                              {aiSummary.chronicDiseaseHistory.length ? aiSummary.chronicDiseaseHistory.join(', ') : 'Tidak ada catatan penyakit kronis.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 py-3 text-center">
                        Memuat resume medis AI...
                      </div>
                    )}
                  </div>

                  {/* Demographic Full Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Agama & Suku</span>
                      <div className="font-semibold text-slate-200">{selectedPatient.religion} • {selectedPatient.nationality}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Pekerjaan</span>
                      <div className="font-semibold text-slate-200">{selectedPatient.occupation}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Status Pernikahan</span>
                      <div className="font-semibold text-slate-200">{selectedPatient.maritalStatus}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-slate-500 text-[10px]">No. HP / WhatsApp</span>
                      <div className="font-mono font-semibold text-cyan-300">{selectedPatient.phone}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Email Pasien</span>
                      <div className="font-semibold text-slate-200 truncate">{selectedPatient.email || '-'}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-0.5">
                      <span className="text-slate-500 text-[10px]">Tanggal Registrasi</span>
                      <div className="font-mono font-semibold text-slate-200">{selectedPatient.registeredAt}</div>
                    </div>
                  </div>

                  {/* Address & Emergency Contact Card */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold block mb-0.5">Alamat Tempat Tinggal:</span>
                      <p className="text-slate-200 leading-snug">
                        {selectedPatient.address}, Kecamatan {selectedPatient.district}, {selectedPatient.city}, Provinsi {selectedPatient.province} ({selectedPatient.postalCode})
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="text-slate-500 font-semibold block mb-0.5">Kontak Penanggung Jawab Darurat:</span>
                        <p className="text-slate-200">
                          {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relationship}) - <span className="font-mono text-cyan-300 font-semibold">{selectedPatient.emergencyContact.phone}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Direct Workflow Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    {onNavigateToPolyclinic && (
                      <button
                        onClick={() => onNavigateToPolyclinic(selectedPatient)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                      >
                        <UserPlus className="w-4 h-4 text-cyan-400" />
                        Daftarkan Ke Rawat Jalan / Poliklinik
                      </button>
                    )}

                    {onNavigateToInpatient && (
                      <button
                        onClick={() => onNavigateToInpatient(selectedPatient)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-indigo-300 font-bold p-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition"
                      >
                        <Bed className="w-4 h-4 text-indigo-400" />
                        Proses Admisi Rawat Inap
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: LINIMASA REKAM MEDIS */}
              {activeTab === 'timeline' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-cyan-400" /> History Kronologis Kunjungan Pasien
                    </h3>
                    <span className="text-[10px] text-slate-400">{MOCK_PATIENT_TIMELINES.length} Peristiwa Terdaftar</span>
                  </div>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                    {MOCK_PATIENT_TIMELINES.map((tl, idx) => (
                      <div key={tl.id} className="relative group">
                        <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-cyan-500 flex items-center justify-center text-[9px] font-bold text-cyan-400">
                          {idx + 1}
                        </div>

                        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1.5 hover:border-slate-700 transition-all">
                          <div className="flex items-center justify-between text-slate-400 text-[11px]">
                            <span className="font-semibold text-cyan-400">{tl.category}</span>
                            <span>{tl.timestamp}</span>
                          </div>
                          <div className="font-bold text-white">{tl.title}</div>
                          <p className="text-slate-300 leading-snug">{tl.description}</p>
                          <div className="text-[10px] text-slate-500 flex items-center gap-2 pt-1 border-t border-slate-900">
                            <span>Petugas/DPJP: {tl.doctorOrOfficer}</span>
                            <span>•</span>
                            <span>Lokasi: {tl.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TANDA VITAL & REKAM MEDIS */}
              {activeTab === 'vitals' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px]">Tekanan Darah (TD)</div>
                      <div className="text-lg font-mono font-bold text-cyan-300">120/80 mmHg</div>
                      <span className="text-[10px] text-emerald-400">Normal Range</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px]">Laju Nadi (HR)</div>
                      <div className="text-lg font-mono font-bold text-emerald-400">82 x/menit</div>
                      <span className="text-[10px] text-emerald-400">Reguler</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px]">Suhu Tubuh</div>
                      <div className="text-lg font-mono font-bold text-amber-300">36.8 °C</div>
                      <span className="text-[10px] text-slate-400">Afebris</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                      <div className="text-slate-400 text-[10px]">Saturasi O2 (SpO2)</div>
                      <div className="text-lg font-mono font-bold text-sky-300">98%</div>
                      <span className="text-[10px] text-sky-400">Udara Bebas</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
                    <h4 className="font-bold text-white text-xs flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" /> Riwayat Diagnosa Utama (ICD-10)
                    </h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">Dispepsia / Gastritis Akut (K30)</div>
                          <p className="text-slate-400 text-[11px] mt-0.5">Konsultasi Poli Penyakit Dalam • dr. Budi Hartono, Sp.PD</p>
                        </div>
                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded text-[10px] font-mono font-bold">
                          28 Jul 2026
                        </span>
                      </div>
                      <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">Hipertensi Essensial Primer (I10)</div>
                          <p className="text-slate-400 text-[11px] mt-0.5">Pemeriksaan Rutin Rawat Jalan</p>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded text-[10px] font-mono">
                          12 Mei 2026
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BPJS V-CLAIM & PENJAMIN */}
              {activeTab === 'bpjs' && (
                <div className="space-y-4 animate-fade-in text-xs">
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      <div>
                        <div className="font-bold text-emerald-300 text-sm">Status BPJS Kesehatan: AKTIF</div>
                        <p className="text-slate-300 text-[11px]">Terverifikasi Web-Service V-Claim BPJS Bridging System v2.0</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs">
                      KELAS 1 BPJS
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px]">Nomor Kartu BPJS</span>
                      <div className="font-mono font-bold text-cyan-300 text-sm">{selectedPatient.bpjsCardNo || '0001849201928'}</div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px]">Faskes Tingkat 1 (FKTP)</span>
                      <div className="font-semibold text-slate-200 text-xs">Puskesmas Kebayoran Baru</div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px]">Asuransi Swasta Tambahan</span>
                      <div className="font-semibold text-slate-200 text-xs">{selectedPatient.insuranceProvider || 'Prudential Health Co-Pay'}</div>
                    </div>
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-slate-500 text-[10px]">No. Polis Asuransi</span>
                      <div className="font-mono font-semibold text-slate-200 text-xs">{selectedPatient.insuranceNo || 'PRU-88291029'}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LAMPIRAN DOKUMEN */}
              {activeTab === 'documents' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fade-in">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-center hover:border-cyan-500/50 transition">
                    <FileText className="w-8 h-8 text-cyan-400 mx-auto" />
                    <div className="font-bold text-white text-xs">Scan KTP Pasien</div>
                    <p className="text-[10px] text-slate-400">PDF / JPG • Terverifikasi OCR</p>
                    <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-lg text-[11px]">
                      Lihat Dokumen
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-center hover:border-cyan-500/50 transition">
                    <CreditCard className="w-8 h-8 text-emerald-400 mx-auto" />
                    <div className="font-bold text-white text-xs">Kartu BPJS Kesehatan</div>
                    <p className="text-[10px] text-slate-400">PDF / JPG • Terverifikasi BPJS</p>
                    <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-semibold rounded-lg text-[11px]">
                      Lihat Dokumen
                    </button>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2 text-center hover:border-cyan-500/50 transition">
                    <FileSpreadsheet className="w-8 h-8 text-amber-400 mx-auto" />
                    <div className="font-bold text-white text-xs">Surat Rujukan FKTP</div>
                    <p className="text-[10px] text-slate-400">Masa berlaku s/d Sep 2026</p>
                    <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold rounded-lg text-[11px]">
                      Lihat Dokumen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
            Pilih pasien dari daftar sebelah kiri untuk melihat rekam medis lengkap.
          </div>
        )}
      </div>

      {/* MODAL: EDIT PATIENT DEMOGRAPHY */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 custom-scrollbar space-y-5">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Edit className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-base">Edit Demografi & Data Pasien</h3>
                <p className="text-xs text-slate-400">Nomor Rekam Medis: <span className="font-mono text-cyan-300">{editFormData.norm}</span></p>
              </div>
            </div>

            <form onSubmit={handleSavePatientEdits} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap Pasien</label>
                  <input
                    type="text"
                    required
                    value={editFormData.fullName || ''}
                    onChange={e => setEditFormData({ ...editFormData, fullName: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">NIK (16 Digit KTP)</label>
                  <input
                    type="text"
                    required
                    value={editFormData.nik || ''}
                    onChange={e => setEditFormData({ ...editFormData, nik: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. HP / WhatsApp</label>
                  <input
                    type="text"
                    value={editFormData.phone || ''}
                    onChange={e => setEditFormData({ ...editFormData, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. Kartu BPJS</label>
                  <input
                    type="text"
                    value={editFormData.bpjsCardNo || ''}
                    onChange={e => setEditFormData({ ...editFormData, bpjsCardNo: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1">Alamat Lengkap</label>
                  <input
                    type="text"
                    value={editFormData.address || ''}
                    onChange={e => setEditFormData({ ...editFormData, address: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kategori Penjamin</label>
                  <select
                    value={editFormData.category || 'Pasien BPJS'}
                    onChange={e => setEditFormData({ ...editFormData, category: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Pasien BPJS">Pasien BPJS</option>
                    <option value="Pasien Asuransi">Pasien Asuransi</option>
                    <option value="Pasien Umum">Pasien Umum</option>
                    <option value="Pasien Baru">Pasien Baru</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Status Keberadaan</label>
                  <select
                    value={editFormData.status || 'Aktif'}
                    onChange={e => setEditFormData({ ...editFormData, status: e.target.value as any })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Rawat Jalan">Rawat Jalan</option>
                    <option value="Rawat Inap">Rawat Inap</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simpan Perubahan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINT RM PATIENT CARD PREVIEW */}
      {isPrintCardOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            <button
              onClick={() => setIsPrintCardOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-white text-base">Kartu Berobat Pasien RSUD</h3>
              <p className="text-xs text-slate-400">Pratinjau Cetak Kartu RM Fisik / Digital</p>
            </div>

            {/* Visual Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border-2 border-cyan-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden font-sans space-y-4">
              <div className="flex justify-between items-start border-b border-cyan-500/30 pb-3">
                <div>
                  <div className="text-xs font-black tracking-wider text-cyan-300 uppercase">RSUD SMART MEDIKA</div>
                  <div className="text-[9px] text-slate-400">KARTU REKAM MEDIS ELEKTRONIK</div>
                </div>
                <QrCode className="w-10 h-10 text-cyan-400" />
              </div>

              <div>
                <div className="text-[10px] text-slate-400">NAMA PASIEN</div>
                <div className="text-base font-bold text-white tracking-wide">{selectedPatient.fullName}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-[9px] text-slate-400">NO. REKAM MEDIS (RM)</div>
                  <div className="font-mono font-bold text-cyan-300 text-sm">{selectedPatient.norm}</div>
                </div>
                <div>
                  <div className="text-[9px] text-slate-400">NIK PASIEN</div>
                  <div className="font-mono text-slate-300">{selectedPatient.nik}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setIsPrintCardOpen(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Cetak Kartu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PRINT RM BARCODE STICKER LABEL */}
      {isPrintLabelOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <button
              onClick={() => setIsPrintLabelOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-bold text-white text-base text-center">Stiker Label RM Pasien</h3>

            {/* Sticker Preview Box */}
            <div className="bg-white text-slate-950 p-4 rounded-xl space-y-2 font-mono text-xs shadow-inner border border-slate-300">
              <div className="flex justify-between items-center border-b border-slate-300 pb-1 font-bold text-[11px]">
                <span>RSUD SMART MEDIKA</span>
                <span>{selectedPatient.gender === 'Laki-laki' ? 'L' : 'P'}</span>
              </div>
              <div className="font-bold text-sm text-slate-900">{selectedPatient.fullName}</div>
              <div className="text-[11px]">RM: <span className="font-bold">{selectedPatient.norm}</span> | Tgl Lahir: {selectedPatient.birthDate}</div>
              <div className="text-[10px] text-slate-700">NIK: {selectedPatient.nik}</div>
              <div className="pt-2 text-center">
                <div className="font-bold text-lg tracking-widest bg-slate-100 py-1 border border-dashed border-slate-400">
                  |||||| ||| ||||||| ||||
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">{selectedPatient.norm}</div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsPrintLabelOpen(false)}
                className="w-full py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Cetak Stiker (Thermal)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
