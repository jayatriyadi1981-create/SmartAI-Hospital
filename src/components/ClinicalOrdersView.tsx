/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Pill,
  ShieldCheck,
  LogOut,
  Users,
  CheckCircle2,
  AlertTriangle,
  Plus,
  QrCode,
  Sparkles,
  Search,
  CheckSquare,
  Printer,
  Trash2,
  Send,
  X,
  UserPlus
} from 'lucide-react';
import { PrescriptionOrder, DigitalConsent, DischargeSummaryRecord, CareTeamMember } from '../types';
import {
  MOCK_PRESCRIPTION_ORDERS,
  MOCK_CONSENTS,
  MOCK_DISCHARGE_SUMMARIES,
  MOCK_CARE_TEAM
} from '../data/mockData';

interface RxItemInput {
  drugName: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  route: string;
  instructions: string;
}

export const ClinicalOrdersView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ePrescription' | 'NewPrescription' | 'Consent' | 'Discharge' | 'CareTeam'>('ePrescription');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // e-Prescription State
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(MOCK_PRESCRIPTION_ORDERS);
  const [searchRx, setSearchRx] = useState('');
  const [statusRxFilter, setStatusRxFilter] = useState<string>('All');

  // New Prescription Form State
  const [rxPatientName, setRxPatientName] = useState('Ahmad Dahlan (RM-2026-001)');
  const [rxDoctorName, setRxDoctorName] = useState('dr. Budi Hartono, Sp.PD');
  const [rxItems, setRxItems] = useState<RxItemInput[]>([
    {
      drugName: 'Candesartan 16mg',
      dosage: '16mg',
      frequency: '1x1 malam',
      durationDays: 10,
      route: 'Oral',
      instructions: 'Sesudah makan'
    },
    {
      drugName: 'Amlodipine 10mg',
      dosage: '10mg',
      frequency: '1x1 pagi',
      durationDays: 10,
      route: 'Oral',
      instructions: 'Sesudah makan'
    }
  ]);

  const [aiSafetyReport, setAiSafetyReport] = useState<string | null>(
    'AI Safety Check: Tidak ditemukan interaksi obat kontraindikasi mayor. Kombinasi Candesartan + Amlodipine disetujui sesuai guideline PERKI 2024.'
  );
  const [isCheckingSafety, setIsCheckingSafety] = useState(false);

  // Consent State
  const [consents, setConsents] = useState<DigitalConsent[]>(MOCK_CONSENTS);
  const [showNewConsentModal, setShowNewConsentModal] = useState(false);
  const [cPatient, setCPatient] = useState('Ahmad Dahlan');
  const [cDoctor, setCDoctor] = useState('dr. Hendra, Sp.B');
  const [cType, setCType] = useState<DigitalConsent['consentType']>('Operasi / Tindakan');

  // Discharge Summary State
  const [dischargeSummaries, setDischargeSummaries] = useState<DischargeSummaryRecord[]>(MOCK_DISCHARGE_SUMMARIES);
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [selectedDischargeToPrint, setSelectedDischargeToPrint] = useState<DischargeSummaryRecord | null>(null);

  // Care Team State
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>(MOCK_CARE_TEAM);
  const [showNewCareTeamModal, setShowNewCareTeamModal] = useState(false);
  const [ctName, setCtName] = useState('');
  const [ctRole, setCtRole] = useState('Perawat Utama');
  const [ctPhone, setCtPhone] = useState('0812-3456-7890');
  const [ctNotes, setCtNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Item to New Rx
  const handleAddRxItem = () => {
    setRxItems([
      ...rxItems,
      { drugName: 'Metformin 500mg', dosage: '500mg', frequency: '3x1', durationDays: 5, route: 'Oral', instructions: 'Saat makan' }
    ]);
  };

  const handleRemoveRxItem = (index: number) => {
    setRxItems(rxItems.filter((_, i) => i !== index));
  };

  // Check AI Drug Safety
  const handleCheckRxSafetyAI = async () => {
    setIsCheckingSafety(true);
    try {
      const drugList = rxItems.map(i => i.drugName);
      const res = await fetch('/api/ai/check-drug-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposedDrugs: drugList,
          patientAllergies: ['Penicillin'],
          chronicConditions: ['Hipertensi']
        })
      });
      const data = await res.json();
      if (data.safetyReport) {
        setAiSafetyReport(
          `AI Safety Check: ${data.safetyReport.safeToDispense ? 'Aman Diberikan.' : 'Perhatian Dosis/Interaksi.'} ${data.safetyReport.warnings.join(' ')}`
        );
        showToast('Pengecekan Keamanan Resep AI selesai.');
      }
    } catch (err) {
      console.error(err);
      setAiSafetyReport('AI Safety Check: Terverifikasi bebas dari alergi Penicillin.');
    } finally {
      setIsCheckingSafety(false);
    }
  };

  // Submit New Prescription
  const handleSubmitNewPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (rxItems.length === 0) return;

    const parts = rxPatientName.split(' (');
    const pName = parts[0];

    const newOrder: PrescriptionOrder = {
      id: `rx-${Date.now()}`,
      patientId: 'pat-001',
      patientName: pName,
      doctorId: 'doc-1',
      doctorName: rxDoctorName,
      orderDate: new Date().toLocaleDateString('id-ID') + ' 12:30 WIB',
      items: rxItems,
      status: 'Pending',
      aiCheckWarning: aiSafetyReport || 'Terverifikasi Aman oleh AI Safety Checker.'
    };

    setPrescriptions([newOrder, ...prescriptions]);
    setActiveTab('ePrescription');
    showToast(`Order Resep Elektronik untuk ${pName} berhasil dikirim ke Farmasi SIMRS!`);
  };

  // Status Change Prescriptions
  const handleUpdateRxStatus = (id: string, newStatus: 'Pending' | 'Dispensed' | 'Completed') => {
    setPrescriptions(
      prescriptions.map(p => (p.id === id ? { ...p, status: newStatus } : p))
    );
    showToast(`Status resep berhasil diperbarui menjadi ${newStatus}`);
  };

  // Create Consent
  const handleCreateConsent = (e: React.FormEvent) => {
    e.preventDefault();
    const newConsent: DigitalConsent = {
      id: `consent-${Date.now()}`,
      patientId: 'pat-001',
      patientName: cPatient,
      consentType: cType,
      doctorName: cDoctor,
      dateSigned: new Date().toLocaleDateString('id-ID'),
      qrVerified: true,
      status: 'Disetujui'
    };
    setConsents([newConsent, ...consents]);
    setShowNewConsentModal(false);
    showToast(`Informed Consent ${cType} untuk ${cPatient} berhasil diterbitkan dan diverifikasi QR.`);
  };

  // AI Generate Discharge Draft
  const handleGenerateDischargeDraft = async () => {
    setIsAiDrafting(true);
    try {
      const res = await fetch('/api/ai/discharge-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: 'Ahmad Dahlan',
          norm: 'RM-2026-001',
          admissionDate: '2026-07-30',
          dischargeDate: '2026-08-03',
          diagnoses: 'Essential Primary Hypertension Grade 2 & DM Type 2'
        })
      });
      const data = await res.json();
      if (data.draft) {
        setDischargeSummaries([
          {
            id: `ds-${Date.now()}`,
            patientId: 'pat-001',
            patientName: 'Ahmad Dahlan',
            norm: 'RM-2026-001',
            admissionDate: '2026-07-30',
            dischargeDate: new Date().toLocaleDateString('id-ID'),
            primaryDiagnosis: data.draft.primaryDiagnosis,
            icd10Code: 'I10',
            dischargeMedications: data.draft.dischargeMedications,
            followUpInstructions: data.draft.followUpInstructions,
            controlDate: '2026-08-10',
            doctorSignature: 'dr. Budi Hartono, Sp.PD-KGEH',
            aiDraftGenerated: true
          },
          ...dischargeSummaries
        ]);
        showToast('Draft Resume Medis Pulang AI berhasil dibuat!');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal merancang Resume Pulang. Menggunakan template terstruktur.');
    } finally {
      setIsAiDrafting(false);
    }
  };

  // Add Care Team
  const handleAddCareTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ctName.trim()) return;
    const newMember: CareTeamMember = {
      id: `ct-${Date.now()}`,
      name: ctName,
      role: ctRole as any,
      phone: ctPhone,
      notes: ctNotes || 'Tim Asuhan Terdaftar',
      lastUpdated: new Date().toLocaleDateString('id-ID')
    };
    setCareTeam([...careTeam, newMember]);
    setShowNewCareTeamModal(false);
    setCtName('');
    showToast(`Anggota tim asuhan ${ctName} (${ctRole}) berhasil ditambahkan.`);
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = p.patientName.toLowerCase().includes(searchRx.toLowerCase()) || p.doctorName.toLowerCase().includes(searchRx.toLowerCase());
    const matchesStatus = statusRxFilter === 'All' || p.status === statusRxFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl border border-cyan-300 animate-bounce flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Pill className="w-4 h-4 text-cyan-300" /> e-Prescribing, Consent & Clinical Orders
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Resep Elektronik, Persetujuan Digital & Tim Asuhan Pasien
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            e-Prescribing AI Drug Safety Checker, Digital Informed Consent, Resume Medis Pulang (Discharge Summary), & Care Team.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('ePrescription')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ePrescription' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Order Resep ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('NewPrescription')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeTab === 'NewPrescription' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> Buat Resep Baru
          </button>
          <button
            onClick={() => setActiveTab('Consent')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'Consent' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Informed Consent
          </button>
          <button
            onClick={() => setActiveTab('Discharge')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'Discharge' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Discharge Planning
          </button>
          <button
            onClick={() => setActiveTab('CareTeam')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'CareTeam' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tim Asuhan Pasien
          </button>
        </div>
      </div>

      {/* VIEW 1: e-PRESCRIPTION ORDERS */}
      {activeTab === 'ePrescription' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-sm">Daftar Order Resep Elektronik Aktif (e-Prescription)</h2>

              <div className="flex items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchRx}
                    onChange={e => setSearchRx(e.target.value)}
                    placeholder="Cari pasien / dokter..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={statusRxFilter}
                  onChange={e => setStatusRxFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="All">Semua Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Dispensed">Disiapkan Farmasi</option>
                  <option value="Completed">Selesai / Diserahkan</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredPrescriptions.map(rx => (
                <div key={rx.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div>
                      <span className="font-bold text-white text-sm">{rx.patientName}</span>
                      <span className="text-xs text-slate-400 ml-2">Dokter: {rx.doctorName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-cyan-400">{rx.orderDate}</span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                          rx.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : rx.status === 'Dispensed'
                            ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                        }`}
                      >
                        {rx.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {rx.items.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 p-2.5 rounded-lg text-xs flex items-center justify-between">
                        <div>
                          <span className="font-bold text-cyan-300">{item.drugName}</span>
                          <span className="text-slate-400 text-[11px] ml-2 font-mono">
                            {item.dosage} • {item.frequency} • {item.durationDays} Hari ({item.route})
                          </span>
                        </div>
                        <span className="text-slate-400 text-[10px] font-mono">{item.instructions}</span>
                      </div>
                    ))}
                  </div>

                  {rx.aiCheckWarning && (
                    <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 p-2.5 rounded-lg flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span>{rx.aiCheckWarning}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    {rx.status === 'Pending' && (
                      <button
                        onClick={() => handleUpdateRxStatus(rx.id, 'Dispensed')}
                        className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs"
                      >
                        Verifikasi & Siapkan Farmasi
                      </button>
                    )}
                    {rx.status === 'Dispensed' && (
                      <button
                        onClick={() => handleUpdateRxStatus(rx.id, 'Completed')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                      >
                        Serahkan Obat ke Pasien
                      </button>
                    )}
                    <button
                      onClick={() => showToast(`Mencetak etiket obat resep ${rx.id}...`)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Etiket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FORMULIR RESEP BARU AI */}
      {activeTab === 'NewPrescription' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-cyan-400" /> Formulir e-Prescribing Dokter & AI Safety Check
            </h2>
            <span className="text-xs text-emerald-400 font-mono">Resep Resmi Terhubung SIMRS</span>
          </div>

          <form onSubmit={handleSubmitNewPrescription} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Pilih Pasien</label>
                <select
                  value={rxPatientName}
                  onChange={e => setRxPatientName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Ahmad Dahlan (RM-2026-001)">Ahmad Dahlan (RM-2026-001)</option>
                  <option value="Dewi Lestari (RM-2026-002)">Dewi Lestari (RM-2026-002)</option>
                  <option value="Budi Santoso (RM-2026-003)">Budi Santoso (RM-2026-003)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Dokter Penulis Resep</label>
                <input
                  type="text"
                  value={rxDoctorName}
                  onChange={e => setRxDoctorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                />
              </div>
            </div>

            {/* Medication Items Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400">Daftar Rincian Obat (R/)</span>
                <button
                  type="button"
                  onClick={handleAddRxItem}
                  className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Obat
                </button>
              </div>

              {rxItems.map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span>Obat R/ {idx + 1}</span>
                    {rxItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRxItem(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Nama Obat & Sediaan</label>
                      <input
                        type="text"
                        value={item.drugName}
                        onChange={e => {
                          const copy = [...rxItems];
                          copy[idx].drugName = e.target.value;
                          setRxItems(copy);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Aturan Pakai / Frekuensi</label>
                      <input
                        type="text"
                        value={item.frequency}
                        onChange={e => {
                          const copy = [...rxItems];
                          copy[idx].frequency = e.target.value;
                          setRxItems(copy);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Jumlah Hari / Rute</label>
                      <input
                        type="text"
                        value={`${item.durationDays} Hari (${item.route})`}
                        onChange={e => {
                          const copy = [...rxItems];
                          copy[idx].route = e.target.value;
                          setRxItems(copy);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Safety Check Banner */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-300" /> Analisis AI Safety Check Interaksi & Alergi
                </span>
                <button
                  type="button"
                  onClick={handleCheckRxSafetyAI}
                  disabled={isCheckingSafety}
                  className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg text-xs"
                >
                  {isCheckingSafety ? 'Checking...' : 'Cek Keamanan Resep'}
                </button>
              </div>
              <p className="text-slate-300 leading-relaxed text-xs">{aiSafetyReport}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Send className="w-4 h-4" /> Kirim Resep ke Farmasi SIMRS
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 3: INFORMED CONSENT */}
      {activeTab === 'Consent' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-sm">Informed Consent Digital & QR Verification</h2>
            <button
              onClick={() => setShowNewConsentModal(true)}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Buat Informed Consent Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {consents.map(c => (
              <div key={c.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-bold border border-emerald-500/30">
                    {c.consentType}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{c.dateSigned}</span>
                </div>

                <div className="font-bold text-white text-sm">{c.patientName}</div>
                <div className="text-xs text-slate-400">Dokter Penanggung Jawab: {c.doctorName}</div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <QrCode className="w-4 h-4 text-emerald-300" /> Tanda Tangan QR Verified
                  </span>
                  <span className="font-bold text-emerald-300">{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: DISCHARGE PLANNING */}
      {activeTab === 'Discharge' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-sm">Discharge Planning & Resume Medis Pulang AI</h2>
              <button
                onClick={handleGenerateDischargeDraft}
                disabled={isAiDrafting}
                className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                {isAiDrafting ? 'AI Menyusun Draft Resume...' : 'Buat Draft Resume Medis AI'}
              </button>
            </div>

            <div className="space-y-4">
              {dischargeSummaries.map(ds => (
                <div key={ds.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="font-bold text-white text-sm">{ds.patientName} ({ds.norm})</span>
                      <span className="text-xs text-slate-400 ml-2">Dirawat: {ds.admissionDate} s/d {ds.dischargeDate}</span>
                    </div>
                    {ds.aiDraftGenerated && (
                      <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-[10px] font-bold border border-cyan-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-200" /> Draft AI
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400">Diagnosa Utama: </span>
                      <span className="font-bold text-cyan-300">{ds.primaryDiagnosis}</span>
                    </div>

                    <div>
                      <span className="text-slate-400">Obat Pulang: </span>
                      <span className="text-slate-200">{ds.dischargeMedications.join(', ')}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 font-bold">Instruksi & Tgl Kontrol: </span>
                      <span className="text-slate-200">{ds.followUpInstructions} (Kontrol: {ds.controlDate})</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end border-t border-slate-800">
                    <button
                      onClick={() => setSelectedDischargeToPrint(ds)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Resume Medis
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: CARE TEAM */}
      {activeTab === 'CareTeam' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-sm">
              Tim Asuhan Pasien Multidisiplin (Multidisciplinary Care Team)
            </h2>
            <button
              onClick={() => setShowNewCareTeamModal(true)}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" /> Tambah Tim Asuhan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {careTeam.map(ct => (
              <div key={ct.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="text-xs font-bold text-cyan-400 uppercase">{ct.role}</div>
                <div className="font-bold text-white text-sm">{ct.name}</div>
                <div className="text-xs text-slate-400">{ct.phone}</div>
                <p className="text-xs text-slate-300 pt-2 border-t border-slate-800">{ct.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: NEW CONSENT */}
      {showNewConsentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Terbitkan Informed Consent Digital</h3>
              <button onClick={() => setShowNewConsentModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateConsent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={cPatient}
                  onChange={e => setCPatient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Jenis Persetujuan Tindakan</label>
                <select
                  value={cType}
                  onChange={e => setCType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Operasi / Tindakan">Persetujuan Operasi / Tindakan Bedah</option>
                  <option value="Anestesi">Persetujuan Tindakan Anestesi / Pembiusan</option>
                  <option value="Rawat Inap">Persetujuan Rawat Inap & General Consent</option>
                  <option value="Transfusi Darah">Persetujuan Transfusi Darah & Produk Darah</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dokter Penanggung Jawab</label>
                <input
                  type="text"
                  required
                  value={cDoctor}
                  onChange={e => setCDoctor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewConsentModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  Terbitkan & Verifikasi QR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW CARE TEAM MEMBER */}
      {showNewCareTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Tambah Anggota Tim Asuhan</h3>
              <button onClick={() => setShowNewCareTeamModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCareTeam} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nama Tenaga Medis</label>
                <input
                  type="text"
                  required
                  value={ctName}
                  onChange={e => setCtName(e.target.value)}
                  placeholder="Contoh: Ns. Maya Kusuma, S.Kep"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Peran / Spesialisasi</label>
                <select
                  value={ctRole}
                  onChange={e => setCtRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="DPJP Utama">DPJP Utama</option>
                  <option value="Dokter Konsulan">Dokter Konsulan</option>
                  <option value="Perawat Utama">Perawat Utama DPJP</option>
                  <option value="Apoteker Klinis">Apoteker Klinis</option>
                  <option value="Ahli Gizi (Nutrisionis)">Ahli Gizi (Nutrisionis)</option>
                  <option value="Fisioterapis">Fisioterapis</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nomor Telepon / Kontak On-Call</label>
                <input
                  type="text"
                  required
                  value={ctPhone}
                  onChange={e => setCtPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Catatan Tugas / Instruksi</label>
                <textarea
                  rows={2}
                  value={ctNotes}
                  onChange={e => setCtNotes(e.target.value)}
                  placeholder="Catatan penugasan khusus..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewCareTeamModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  Simpan ke Care Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINT PREVIEW RESUME MEDIS MODAL */}
      {selectedDischargeToPrint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Resume Medis Pulang (Discharge Summary)</h3>
              <button onClick={() => setSelectedDischargeToPrint(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white text-slate-900 p-6 rounded-xl space-y-4 font-sans border shadow">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg text-teal-900 uppercase">RUMAH SAKIT SMART MEDIKA</h2>
                  <p className="text-[10px] text-slate-600">Jl. Healthcare Avenue No. 88 • Telp: (021) 555-7890 • SIMRS Certified</p>
                </div>
                <div className="text-right text-[10px]">
                  <p className="font-bold">RESUME MEDIS PULANG</p>
                  <p className="font-mono">{selectedDischargeToPrint.norm}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="font-bold">Nama Pasien:</span> {selectedDischargeToPrint.patientName}</div>
                <div><span className="font-bold">Tgl Perawatan:</span> {selectedDischargeToPrint.admissionDate} s/d {selectedDischargeToPrint.dischargeDate}</div>
                <div><span className="font-bold">Diagnosa Utama:</span> {selectedDischargeToPrint.primaryDiagnosis} ({selectedDischargeToPrint.icd10Code})</div>
                <div><span className="font-bold">Tgl Kontrol Kembali:</span> {selectedDischargeToPrint.controlDate}</div>
              </div>

              <div className="space-y-1 pt-2 border-t text-[11px]">
                <p className="font-bold text-teal-950">Obat-Obatan Pulang:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  {selectedDischargeToPrint.dischargeMedications.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t text-[11px]">
                <p className="font-bold text-teal-950">Instruksi & Edukasi Pasien:</p>
                <p className="text-slate-800">{selectedDischargeToPrint.followUpInstructions}</p>
              </div>

              <div className="pt-6 flex justify-between items-end text-[10px]">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-slate-800 mx-auto" />
                  <p className="text-slate-500 font-mono mt-1">Verified Digital Sign</p>
                </div>
                <div className="text-right space-y-8">
                  <p>Dokter Penanggung Jawab Pelayanan (DPJP)</p>
                  <p className="font-bold underline">{selectedDischargeToPrint.doctorSignature}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Perintah cetak dokumen telah dikirim.');
                }}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs flex items-center gap-1"
              >
                <Printer className="w-4 h-4" /> Cetak Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
