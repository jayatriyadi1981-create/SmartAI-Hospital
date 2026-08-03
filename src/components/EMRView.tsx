/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Stethoscope,
  Mic,
  MicOff,
  Sparkles,
  AlertTriangle,
  Activity,
  Heart,
  Pill,
  FileCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Printer,
  ChevronRight,
  ShieldAlert,
  Search,
  User,
  Clock,
  Send,
  Check
} from 'lucide-react';
import { Patient, MedicalRecord, VitalSign, SOAPNote } from '../types';
import { MOCK_PATIENTS, MOCK_MEDICAL_RECORDS, MOCK_CLINICAL_ALERTS } from '../data/mockData';

interface EMRViewProps {
  patient?: Patient;
  onSaveRecord?: (record: MedicalRecord) => void;
}

export const EMRView: React.FC<EMRViewProps> = ({
  patient = MOCK_PATIENTS[0],
  onSaveRecord
}) => {
  const [selectedPatient, setSelectedPatient] = useState<Patient>(patient);
  const [activeTab, setActiveTab] = useState<'SOAP' | 'Vitals' | 'Prescriptions' | 'LabRadio' | 'Consent'>('SOAP');
  
  // Voice Dictation Simulation
  const [isDictating, setIsDictating] = useState(false);
  const [dictationText, setDictationText] = useState(
    'Pasien mengeluh pusing tengkuk berat sejak 2 hari, lemas, dan sering haus malam hari. TD 155 per 95, Nadi 92. Diagnosa Hipertensi Esensial ICD-10 I10 dan Diabetes Mellitus Tipe 2. Berikan Amlodipine 10mg pagi, Metformin 500mg dua kali sehari.'
  );
  const [isProcessingAI, setIsProcessingAI] = useState(false);

  // SOAP State
  const [soap, setSoap] = useState<SOAPNote>({
    id: 'soap-new',
    medicalRecordId: 'mr-new',
    patientId: selectedPatient.id,
    doctorId: 'doc-001',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    timestamp: new Date().toLocaleString('id-ID'),
    subjective: 'Pasien mengeluhkan pusing tengkuk berat sejak 2 hari, lemas, dan sering haus malam hari.',
    objective: 'TD 155/95 mmHg, HR 92x/m, RR 20x/m, Suhu 36.8C, SpO2 98%, BMI 27.6 (Overweight).',
    assessment: '1. Essential Primary Hypertension (ICD-10: I10)\n2. Non-insulin-dependent Diabetes Mellitus (ICD-10: E11)',
    plan: '1. Amlodipine 10mg 1x1 tab pagi\n2. Metformin 500mg 2x1 tab d.c.\n3. Cek HbA1c & Profil Lipid rutin\n4. Edukasi diet rendah garam & kalori',
    version: 1
  });

  // Vital Signs Form
  const [vitals, setVitals] = useState<VitalSign>({
    id: 'vs-new',
    patientId: selectedPatient.id,
    timestamp: new Date().toLocaleString('id-ID'),
    systolic: 155,
    diastolic: 95,
    heartRate: 92,
    respiratoryRate: 20,
    temperature: 36.8,
    spO2: 98,
    weightKg: 78,
    heightCm: 168,
    bmi: 27.6,
    painScore: 3,
    gcsScore: 15
  });

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState([
    { drugName: 'Amlodipine 10mg Tab', dosage: '10mg', frequency: '1x Sehari Pagi', duration: '30 Hari' },
    { drugName: 'Metformin 500mg Tab', dosage: '500mg', frequency: '2x Sehari Sesudah Makan', duration: '30 Hari' }
  ]);

  // Drug Interaction Alert State
  const [drugWarning, setDrugWarning] = useState<string | null>(
    selectedPatient.allergies?.includes('Penicillin')
      ? 'CRITICAL ALERT: Pasien memiliki riwayat ALERGI PENICILLIN. Hindari antibiotik turunan Penisilin & Sefalosporin Gen-1.'
      : null
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Handle Voice Dictation Processing with AI
  const handleProcessVoiceDictation = async () => {
    setIsProcessingAI(true);
    try {
      const res = await fetch('/api/ai/voice-dictation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dictationText: dictationText,
          doctorRole: 'Dokter Spesialis Penyakit Dalam'
        })
      });
      const data = await res.json();
      
      if (data.status === 'success' && data.soap) {
        setSoap(prev => ({
          ...prev,
          subjective: data.soap.subjective || prev.subjective,
          objective: data.soap.objective || prev.objective,
          assessment: data.soap.assessment || prev.assessment,
          plan: data.soap.plan || prev.plan
        }));
      }
    } catch (e) {
      // Fallback
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Add Prescription Item
  const handleAddPrescription = () => {
    setPrescriptions([...prescriptions, { drugName: 'Candesartan 16mg Tab', dosage: '16mg', frequency: '1x Sehari Malam', duration: '30 Hari' }]);
  };

  // Remove Prescription
  const handleRemovePrescription = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  // Save Medical Record
  const handleSaveEMR = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 border border-teal-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4" /> Rekam Medis Elektronik (EMR / RME)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Lembar Pemeriksaan Dokter & Catatan SOAP AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pencatatan SOAP terintegrasi dikte suara AI, ICD-10 auto-suggest, E-Prescribing, dan Peringatan Alergi Obat.
          </p>
        </div>

        {/* Selected Patient Selector Header */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3 shrink-0">
          <img
            src={selectedPatient.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
            alt={selectedPatient.fullName}
            className="w-10 h-10 rounded-full object-cover border border-cyan-500/50"
          />
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              {selectedPatient.fullName}
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                {selectedPatient.norm}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              NIK: {selectedPatient.nik} • {selectedPatient.gender}, {selectedPatient.bloodType}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Allergy Clinical Alert Banner */}
      {drugWarning && (
        <div className="bg-red-950/70 border border-red-500/60 rounded-xl p-4 flex items-start gap-3 animate-pulse">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-0.5">
            <div className="font-bold text-red-200 uppercase tracking-wide">Peringatan Kritis Keselamatan Pasien (Patient Safety Alert)</div>
            <div className="text-red-300">{drugWarning}</div>
          </div>
        </div>
      )}

      {/* Main EMR Tab Workspace */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'SOAP', label: 'Catatan SOAP & Dikte AI', icon: FileText },
            { id: 'Vitals', label: 'Tanda Vital & Grafik', icon: Activity },
            { id: 'Prescriptions', label: 'Resep Elektronik (E-Prescribing)', icon: Pill },
            { id: 'LabRadio', label: 'Order Lab & Radiologi', icon: Stethoscope },
            { id: 'Consent', label: 'Informed Consent & Rujukan', icon: FileCheck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap border ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: SOAP & VOICE DICTATION */}
        {activeTab === 'SOAP' && (
          <div className="space-y-6 animate-fade-in">
            {/* Voice Dictation AI Bar */}
            <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Dikte Suara Dokter & Auto-Generator SOAP AI
                </div>
                <button
                  onClick={() => setIsDictating(!isDictating)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                    isDictating
                      ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isDictating ? (
                    <>
                      <MicOff className="w-3.5 h-3.5 text-red-400" /> Merekam Suara Dokter...
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 text-cyan-400" /> Merekam Dikte Suara
                    </>
                  )}
                </button>
              </div>

              <textarea
                rows={2}
                value={dictationText}
                onChange={e => setDictationText(e.target.value)}
                placeholder="Diktekan keluhan, pemeriksaan fisik, dan rencana terapi dokter..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleProcessVoiceDictation}
                  disabled={isProcessingAI}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-4 py-2 rounded-lg text-xs flex items-center gap-2 shadow transition-all disabled:opacity-50"
                >
                  {isProcessingAI ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-200" /> Memproses Dikte AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> Formatkan ke Lembar SOAP
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* SOAP Grid Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* S: Subjective */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">S</span>
                  Subjective (Anamnesis & Keluhan Pasien)
                </label>
                <textarea
                  rows={4}
                  value={soap.subjective}
                  onChange={e => setSoap({ ...soap, subjective: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* O: Objective */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">O</span>
                  Objective (Pemeriksaan Fisik & Vital Sign)
                </label>
                <textarea
                  rows={4}
                  value={soap.objective}
                  onChange={e => setSoap({ ...soap, objective: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* A: Assessment */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">A</span>
                    Assessment (Diagnosa ICD-10)
                  </label>
                  <div className="flex items-center gap-1">
                    {['I10', 'E11.9', 'J45.909', 'K29.7', 'A09'].map((icd) => (
                      <button
                        key={icd}
                        type="button"
                        onClick={() => {
                          if (!soap.assessment.includes(icd)) {
                            setSoap({ ...soap, assessment: soap.assessment + `\n- Diagnosa ICD-10 Kode: ${icd}` });
                          }
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-300 px-1.5 py-0.5 rounded text-slate-300 border border-slate-700 transition"
                      >
                        +{icd}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  rows={4}
                  value={soap.assessment}
                  onChange={e => setSoap({ ...soap, assessment: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* P: Plan */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-[10px]">P</span>
                  Plan (Rencana Terapi & Tindakan)
                </label>
                <textarea
                  rows={4}
                  value={soap.plan}
                  onChange={e => setSoap({ ...soap, plan: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VITAL SIGNS */}
        {activeTab === 'Vitals' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Tekanan Darah (Sistolik / Diastolik)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={vitals.systolic}
                    onChange={e => setVitals({ ...vitals, systolic: Number(e.target.value) })}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-sm text-center text-white font-bold"
                  />
                  <span>/</span>
                  <input
                    type="number"
                    value={vitals.diastolic}
                    onChange={e => setVitals({ ...vitals, diastolic: Number(e.target.value) })}
                    className="w-16 bg-slate-900 border border-slate-700 rounded p-1 text-sm text-center text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-400">mmHg</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Laju Nadi (Heart Rate)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={vitals.heartRate}
                    onChange={e => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                    className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-sm text-center text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-400">bpm</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Suhu Tubuh</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={vitals.temperature}
                    onChange={e => setVitals({ ...vitals, temperature: Number(e.target.value) })}
                    className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-sm text-center text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-400">°C</span>
                </div>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px]">Saturasi Oksigen (SpO2)</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={vitals.spO2}
                    onChange={e => setVitals({ ...vitals, spO2: Number(e.target.value) })}
                    className="w-20 bg-slate-900 border border-slate-700 rounded p-1 text-sm text-center text-white font-bold"
                  />
                  <span className="text-[10px] text-slate-400">%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: E-PRESCRIBING */}
        {activeTab === 'Prescriptions' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="w-4 h-4 text-cyan-400" /> Resep Elektronik & Racikan Obat
              </h3>
              <button
                onClick={handleAddPrescription}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Obat
              </button>
            </div>

            <div className="space-y-2">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Nama Obat & Sediaan</span>
                    <input
                      type="text"
                      value={rx.drugName}
                      onChange={e => {
                        const updated = [...prescriptions];
                        updated[idx].drugName = e.target.value;
                        setPrescriptions(updated);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white w-full"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Dosis & Aturan Pakai</span>
                    <input
                      type="text"
                      value={rx.frequency}
                      onChange={e => {
                        const updated = [...prescriptions];
                        updated[idx].frequency = e.target.value;
                        setPrescriptions(updated);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white w-full"
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block">Durasi Pemberian</span>
                    <input
                      type="text"
                      value={rx.duration}
                      onChange={e => {
                        const updated = [...prescriptions];
                        updated[idx].duration = e.target.value;
                        setPrescriptions(updated);
                      }}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white w-full"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleRemovePrescription(idx)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Terakhir disimpan: {soap.timestamp}
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Rekam Medis Berhasil Disimpan!
              </span>
            )}
            <button
              onClick={handleSaveEMR}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all text-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Simpan EMR & Verifikasi DPJP
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
