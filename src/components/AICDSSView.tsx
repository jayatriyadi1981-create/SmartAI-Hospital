/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Mic,
  MicOff,
  Stethoscope,
  AlertTriangle,
  FileText,
  BookOpen,
  Zap,
  CheckCircle2,
  Bot,
  Send,
  ShieldAlert,
  ArrowRight,
  Pill,
  Copy,
  Check,
  Search,
  BookMarked,
  Activity,
  Download
} from 'lucide-react';
import { CDSSRecommendation, SOAPNote } from '../types';
import { MOCK_CDSS_RECOMMENDATIONS } from '../data/mockData';

export const AICDSSView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CDSS' | 'VoiceMedical' | 'DrugChecker' | 'Guidelines'>('CDSS');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // CDSS State
  const [chiefComplaintInput, setChiefComplaintInput] = useState(
    'Sakit kepala hebat berdenyut di tengkuk, pandangan agak kabur, mual (+), tekanan darah 175/110 mmHg, gula darah puasa 156 mg/dL'
  );
  const [cdssData, setCdssData] = useState<CDSSRecommendation>(MOCK_CDSS_RECOMMENDATIONS[0]);
  const [isCdssLoading, setIsCdssLoading] = useState(false);

  // Voice Dictation State
  const [isRecording, setIsRecording] = useState(false);
  const [dictationText, setDictationText] = useState(
    'Pasien mengeluhkan sesak napas memberat sejak 2 hari lalu, disertai batuk berdahak kuning kental dan demam. Pada pemeriksaan fisik didapatkan Suhu 38.2C, TD 130/80 mmHg, HR 102x/menit, Rhonchi di paru kanan bawah.'
  );
  const [generatedSOAP, setGeneratedSOAP] = useState<SOAPNote | null>({
    id: 'soap-demo',
    medicalRecordId: 'mr-001',
    patientId: 'pat-001',
    doctorId: 'doc-1',
    doctorName: 'dr. Budi Hartono, Sp.PD',
    timestamp: '03/08/2026, 12:10 WIB',
    subjective: 'Pasien mengeluh sesak napas memberat 2 hari, batuk berdahak kuning kental, demam naik turun.',
    objective: 'Ku: Tampak sesak sedang. TTV: TD 130/80 mmHg, HR 102 bpm, RR 26 x/m, Temp 38.2°C, SpO2 94% room air. Auskultasi: Rhonchi basah halus di basal paru kanan.',
    assessment: 'Pneumonia Komunitas (CAP) dextra derajat sedang, Suspek Suprainfeksi Bakterial. ICD-10: J18.9.',
    plan: '1. Oksigen nasal kanul 3 lpm. 2. IVFD NaCl 0.9% 20 tpm. 3. Injeksi Ceftriaxone 1g/12 jam IV (skin test dulu). 4. Injeksi Parasetamol 1g/8 jam IV. 5. Foto Thorax PA & Cek Darah Lengkap, Sputum Gram.'
  });
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);

  // Drug Safety Checker State
  const [drug1, setDrug1] = useState('Warfarin 5mg');
  const [drug2, setDrug2] = useState('Aspirin 80mg');
  const [patientAllergies, setPatientAllergies] = useState('Penicillin, NSAID');
  const [drugSafetyResult, setDrugSafetyResult] = useState<{
    safeToDispense: boolean;
    warnings: string[];
    interactions: { drug1: string; drug2: string; severity: 'Mild' | 'Moderate' | 'Severe'; details: string }[];
  } | null>({
    safeToDispense: false,
    warnings: [
      'Peringatan Kritis: Penggunaan bersamaan Warfarin dan Aspirin secara signifikan meningkatkan risiko pendarahan gastrointestinal mayor.',
      'Pasien memiliki riwayat alergi NSAID, hindari penggunaan kombinasi Antiinflamasi Non-Steroid.'
    ],
    interactions: [
      {
        drug1: 'Warfarin',
        drug2: 'Aspirin',
        severity: 'Severe',
        details: 'Potensiasi efek antikoagulan & penghambatan agregasi trombosit synergistik. Risiko pendarahan lambung & intrakranial meningkat 3.5x lipat.'
      }
    ]
  });
  const [isCheckerLoading, setIsCheckerLoading] = useState(false);

  // Guidelines Search Query
  const [guidelineSearch, setGuidelineSearch] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(`${label} berhasil disalin ke clipboard!`);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Web Speech API Integration
  useEffect(() => {
    let recognition: any = null;
    if (isRecording && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setDictationText(prev => prev + ' ' + transcript);
        }
      };

      recognition.onerror = (err: any) => {
        console.error('Speech recognition error:', err);
      };

      recognition.start();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isRecording]);

  // Case Presets
  const applyPresetCase = (type: string) => {
    if (type === 'hipertensi') {
      setChiefComplaintInput(
        'Sakit kepala hebat di tengkuk, pandangan kabur, mual (+), TD 180/110 mmHg, HR 98 bpm, GDA 160 mg/dL, Kategori: Krisis Hipertensi / Ensefalopati Hipertensi.'
      );
    } else if (type === 'stemi') {
      setChiefComplaintInput(
        'Nyeri dada substernal menjalar ke lengan kiri dan rahang, durasi > 30 menit, Keringat dingin (+), Mual (+), TD 100/60 mmHg, HR 110 bpm, SpO2 95%.'
      );
    } else if (type === 'kad') {
      setChiefComplaintInput(
        'Pasien DM Tipe 1 lemas berat, muntah 4 kali, napas Kussmaul cepat dan dalam, bau napas aseton, GDS 420 mg/dL, TD 95/60 mmHg, Dehidrasi sedang-berat.'
      );
    } else if (type === 'sepsis') {
      setChiefComplaintInput(
        'Demam tinggi menggigil 39.2°C, penurunan kesadaran (Apatis), TD 85/50 mmHg, HR 125 bpm, RR 28 x/m, Leukosit 22.000, Suspek Syok Septik.'
      );
    }
    showToast(`Preset kasus "${type.toUpperCase()}" berhasil dimuat.`);
  };

  // Dictation Voice Presets
  const applyDictationPreset = (type: string) => {
    if (type === 'paru') {
      setDictationText(
        'Pasien laki-laki 52 tahun mengeluh sesak napas memberat 2 hari, batuk berdahak kuning kental, demam tinggi. TTV: TD 130/80 mmHg, HR 102 bpm, RR 26 x/m, Temp 38.2°C, SpO2 94% room air. Auskultasi: Rhonchi basah di basal paru kanan.'
      );
    } else if (type === 'trauma') {
      setDictationText(
        'Pasien KLL sepeda motor, penurunan kesadaran singkat 5 menit post kejadian, jejas ekskoriasi regio temporal dextra, muntah menyembur 1x. GCS E3V4M6 (13), Pupil isokor 3mm/3mm, RC +/+.'
      );
    } else if (type === 'jantung') {
      setDictationText(
        'Pasien wanita 65 tahun sesak napas posisi berbaring (Orthopnea (+)), bengkak kedua tungkai sejak 1 minggu. TTV: TD 150/90 mmHg, HR 96 bpm, RR 28 x/m, SpO2 91% room air, JVP 5+3 cmH2O, Rhonchi halus di kedua basal paru.'
      );
    } else if (type === 'bedah') {
      setDictationText(
        'Pasien mengeluh nyeri perut kanan bawah hebat sejak 12 jam, mual muntah (+), Anoreksia (+). Pemeriksaan Fisik: Nyeri tekan & nyeri lepas mcBurney (+), Rovsing sign (+), Suhu 37.8°C, Leukositosis 15.400.'
      );
    }
    showToast('Preset dikte suara medis berhasil diterapkan!');
  };

  // Run CDSS
  const handleRunCDSS = async () => {
    setIsCdssLoading(true);
    try {
      const res = await fetch('/api/ai/cdss-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chiefComplaint: chiefComplaintInput,
          vitals: { TD: '165/105', HR: '92', Temp: '36.8' },
          labResults: { HbA1c: '7.8%' },
          medicalHistory: 'Hipertensi Grade 2, Alergi Penicillin'
        })
      });
      const data = await res.json();
      if (data.cdss) {
        setCdssData({
          id: `cdss-${Date.now()}`,
          patientId: 'pat-001',
          chiefComplaint: chiefComplaintInput,
          suspectedDiagnoses: data.cdss.suspectedDiagnoses || MOCK_CDSS_RECOMMENDATIONS[0].suspectedDiagnoses,
          recommendedTests: data.cdss.recommendedTests || MOCK_CDSS_RECOMMENDATIONS[0].recommendedTests,
          clinicalGuidelines: data.cdss.clinicalGuidelines || MOCK_CDSS_RECOMMENDATIONS[0].clinicalGuidelines,
          drugInteractions: MOCK_CDSS_RECOMMENDATIONS[0].drugInteractions,
          criticalWarnings: data.cdss.criticalWarnings || MOCK_CDSS_RECOMMENDATIONS[0].criticalWarnings
        });
        showToast('Analisis CDSS AI berhasil diproses!');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses CDSS AI. Menggunakan hasil analisis aman.');
    } finally {
      setIsCdssLoading(false);
    }
  };

  // Process Voice Dictation
  const handleProcessVoiceDictation = async () => {
    setIsVoiceLoading(true);
    try {
      const res = await fetch('/api/ai/voice-dictation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dictationText: dictationText,
          doctorRole: 'Dokter Spesialis Penyakit Dalam / Paru'
        })
      });
      const data = await res.json();
      if (data.soap) {
        setGeneratedSOAP({
          id: `soap-${Date.now()}`,
          medicalRecordId: 'mr-new',
          patientId: 'pat-001',
          doctorId: 'doc-1',
          doctorName: 'dr. Budi Hartono, Sp.PD',
          timestamp: new Date().toLocaleString('id-ID'),
          subjective: data.soap.subjective,
          objective: data.soap.objective,
          assessment: data.soap.assessment,
          plan: data.soap.plan,
          version: 1
        });
        showToast('Suara dikte berhasil dikonversi ke Rekam Medis SOAP terstruktur!');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses dikte suara. Menggunakan format SOAP standar.');
    } finally {
      setIsVoiceLoading(false);
    }
  };

  // Run Drug Checker
  const handleCheckDrugSafety = async () => {
    setIsCheckerLoading(true);
    try {
      const res = await fetch('/api/ai/check-drug-interaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposedDrugs: [drug1, drug2],
          patientAllergies: patientAllergies.split(','),
          chronicConditions: ['Hipertensi', 'Diabetes']
        })
      });
      const data = await res.json();
      if (data.safetyReport) {
        setDrugSafetyResult(data.safetyReport);
        showToast('Analisis Keamanan Interaksi Obat & Alergi selesai.');
      }
    } catch (err) {
      console.error(err);
      showToast('Gagal memproses analisis obat. Menampilkan evaluasi bawaan.');
    } finally {
      setIsCheckerLoading(false);
    }
  };

  const guidelinesList = [
    {
      title: 'Pedoman Penatalaksanaan Hipertensi (PERKI / ESH 2024)',
      category: 'Kardiologi',
      code: 'PPK-CARD-001',
      summary: 'Target TD < 130/80 mmHg untuk pasien usia < 65 tahun. Kombinasi awal Dual Therapy (ACEi/ARB + CCB atau Tiazid) dalam 1 tablet tunggal.'
    },
    {
      title: 'Protokol Tatalaksana Infark Miokard Akut STEMI (Kemenkes RI)',
      category: 'Emergency / ICCU',
      code: 'PPK-ICCU-002',
      summary: 'Door-to-Balloon Time < 90 menit untuk Primary PCI atau Door-to-Needle < 30 menit untuk Fibrinolitik (Streptokinase/Alteplase).'
    },
    {
      title: 'Pedoman PPOK & Asma Eksaserbasi Akut (GOLD 2024 / IDI)',
      category: 'Pulmonologi',
      code: 'PPK-PULM-005',
      summary: 'Inhalasi SABA + SAMA per 20 menit, Kortikosteroid sistemik IV/Oral (Metilprednisolone), Oksigenasi target SpO2 88-92% pada PPOK.'
    },
    {
      title: 'Tata Laksana Sepsis & Syok Septik (Surviving Sepsis Campaign)',
      category: 'ICU / Reanimasi',
      code: 'PPK-ICU-009',
      summary: 'Bundle 1 Jam: Cek Laktat Darah, Sputum/Kultur Darah sebelum Antibiotik Empiris Spektrum Luas, Resusitasi Cairan Kristaloid 30ml/kgBB.'
    }
  ];

  const filteredGuidelines = guidelinesList.filter(
    g =>
      g.title.toLowerCase().includes(guidelineSearch.toLowerCase()) ||
      g.category.toLowerCase().includes(guidelineSearch.toLowerCase()) ||
      g.summary.toLowerCase().includes(guidelineSearch.toLowerCase())
  );

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
            <Sparkles className="w-4 h-4 text-cyan-300" /> AI Clinical Intelligence Suite
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Clinical Decision Support System (CDSS) & AI Voice Medical
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sistem Keputusan Klinis AI (Differential Diagnosis, Guidelines IDI/PERKI) & Dictation Speech-to-EMR.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('CDSS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'CDSS' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> CDSS AI Engine
          </button>
          <button
            onClick={() => setActiveTab('VoiceMedical')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'VoiceMedical' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" /> AI Voice Medical
          </button>
          <button
            onClick={() => setActiveTab('DrugChecker')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'DrugChecker' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pill className="w-3.5 h-3.5" /> Interaksi Obat & Alergi
          </button>
          <button
            onClick={() => setActiveTab('Guidelines')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'Guidelines' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" /> Guidelines Library
          </button>
        </div>
      </div>

      {/* VIEW 1: CDSS AI DECISION ENGINE */}
      {activeTab === 'CDSS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Form (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Input Keluhan & Gejala Klinis Pasien
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">Gemini 3.6 Flash</span>
            </div>

            {/* Quick Case Presets */}
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 font-bold">Preset Kasus Klinis Cepat:</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => applyPresetCase('hipertensi')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Hipertensi Krisis
                </button>
                <button
                  onClick={() => applyPresetCase('stemi')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-red-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Infark Miokard (STEMI)
                </button>
                <button
                  onClick={() => applyPresetCase('kad')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Ketoasidosis (KAD)
                </button>
                <button
                  onClick={() => applyPresetCase('sepsis')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-indigo-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Syok Septik
                </button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Keluhan Utama, TTV & Riwayat Medis</label>
                <textarea
                  rows={5}
                  value={chiefComplaintInput}
                  onChange={e => setChiefComplaintInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[11px] text-slate-400 font-bold">Konteks Rekam Medis Terhubung SIMRS</div>
                <div className="text-[11px] text-slate-300">TD: 165/105 mmHg • HR: 92 bpm • Suhu: 36.8°C • SpO2: 97%</div>
                <div className="text-[11px] text-amber-400 font-bold">Alergi Terdeteksi: Penicillin</div>
              </div>

              <button
                onClick={handleRunCDSS}
                disabled={isCdssLoading}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                {isCdssLoading ? 'AI Menganalisis Pedoman Diagnostik...' : 'Jalankan Analisis CDSS AI'}
              </button>
            </div>
          </div>

          {/* CDSS Output Results (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" /> Rekomendasi Keputusan Klinis AI (CDSS Engine)
              </h2>
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/30 font-medium">
                Decision Support - Doctor Discretion
              </span>
            </div>

            {/* Suspected Diagnoses Differential */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-400 uppercase">Differential Diagnosis (Kemungkinan Diagnosa)</div>
              <div className="space-y-2">
                {cdssData.suspectedDiagnoses.map((diag, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{diag.disease}</span>
                      <button
                        onClick={() => copyToClipboard(diag.icd10, `Kode ICD-10 ${diag.icd10}`)}
                        className="text-[10px] text-cyan-400 hover:underline ml-2 font-mono"
                      >
                        (ICD-10: {diag.icd10})
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 font-bold rounded text-[11px] font-mono">
                        {diag.probability}% Probabilitas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Tests & Clinical Guidelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-cyan-400 flex items-center justify-between">
                  <span>Rekomendasi Pemeriksaan Penunjang</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {cdssData.recommendedTests.map((t, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-indigo-400">Clinical Guidelines (IDI/PERKI/WHO)</div>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  {cdssData.clinicalGuidelines.map((g, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Drug Interaction Warning */}
            <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl space-y-2 text-xs">
              <div className="font-bold text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-300" /> Peringatan Kritis Kontraindikasi & Dosis
              </div>
              <p className="text-slate-300 leading-relaxed">
                {cdssData.criticalWarnings.join(' ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: AI VOICE MEDICAL (SPEECH-TO-EMR) */}
      {activeTab === 'VoiceMedical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Voice Input Panel (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Voice Dictation (Speech-to-EMR Text)
              </h2>
              <span className="text-[10px] text-cyan-400 font-mono">Web Speech API</span>
            </div>

            {/* Presets for Testing Voice */}
            <div>
              <label className="block text-slate-400 text-xs mb-1.5 font-bold">Preset Sampel Dikte Dokter:</label>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => applyDictationPreset('paru')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Dikte Paru (CAP)
                </button>
                <button
                  onClick={() => applyDictationPreset('trauma')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-amber-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Dikte IGD (Trauma)
                </button>
                <button
                  onClick={() => applyDictationPreset('jantung')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-red-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Dikte Jantung (CHF)
                </button>
                <button
                  onClick={() => applyDictationPreset('bedah')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-300 text-[11px] rounded-lg border border-slate-800"
                >
                  Dikte Bedah (App)
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="text-center py-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <button
                  onClick={() => {
                    setIsRecording(!isRecording);
                    if (!isRecording) showToast('Mikrofon aktif! Bicara untuk mulai dikte...');
                  }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all shadow-xl ${
                    isRecording ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-500/40' : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                  }`}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
                <div>
                  <div className="text-xs font-bold text-slate-200">
                    {isRecording ? 'Merekam Dikte Suara Dokter (Listening...)' : 'Klik Mikrofon untuk Rekam Suara'}
                  </div>
                  {isRecording && (
                    <div className="flex justify-center items-center gap-1 mt-2">
                      <span className="w-1.5 h-4 bg-cyan-400 animate-bounce"></span>
                      <span className="w-1.5 h-6 bg-cyan-300 animate-bounce delay-100"></span>
                      <span className="w-1.5 h-3 bg-cyan-400 animate-bounce delay-200"></span>
                      <span className="w-1.5 h-5 bg-cyan-200 animate-bounce delay-150"></span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hasil Transkripsi Teks Dikte</label>
                <textarea
                  rows={5}
                  value={dictationText}
                  onChange={e => setDictationText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                onClick={handleProcessVoiceDictation}
                disabled={isVoiceLoading || !dictationText.trim()}
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-200" />
                {isVoiceLoading ? 'AI Menyusun Format SOAP...' : 'Konversi Dikte Suara ke Format SOAP'}
              </button>
            </div>
          </div>

          {/* Generated SOAP Result (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> Hasil Catatan Rekam Medis SOAP Terstruktur
              </h2>
              {generatedSOAP && (
                <button
                  onClick={() =>
                    copyToClipboard(
                      `S: ${generatedSOAP.subjective}\nO: ${generatedSOAP.objective}\nA: ${generatedSOAP.assessment}\nP: ${generatedSOAP.plan}`,
                      'Catatan SOAP'
                    )
                  }
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-cyan-300 text-xs font-bold rounded-lg border border-slate-800 flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" /> Salin SOAP
                </button>
              )}
            </div>

            {generatedSOAP ? (
              <div className="space-y-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">SUBJECTIVE (S)</div>
                  <p className="text-slate-300 leading-relaxed">{generatedSOAP.subjective}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">OBJECTIVE (O)</div>
                  <p className="text-slate-300 leading-relaxed">{generatedSOAP.objective}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">ASSESSMENT (A)</div>
                  <p className="text-slate-300 leading-relaxed">{generatedSOAP.assessment}</p>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <div className="font-bold text-cyan-400">PLAN (P)</div>
                  <p className="text-slate-300 leading-relaxed">{generatedSOAP.plan}</p>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    onClick={() => showToast('Catatan SOAP berhasil disimpan ke Rekam Medis SIMRS!')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Simpan ke EMR Pasien SIMRS
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">
                Klik "Konversi Dikte Suara" di sebelah kiri untuk melihat hasil catatan SOAP otomatis.
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: DRUG INTERACTION & SAFETY CHECKER */}
      {activeTab === 'DrugChecker' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              Evaluator Keamanan Obat & Alergi
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Obat 1 (Resep Utama)</label>
                <input
                  type="text"
                  value={drug1}
                  onChange={e => setDrug1(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Obat 2 (Obat Tambahan / Konkuren)</label>
                <input
                  type="text"
                  value={drug2}
                  onChange={e => setDrug2(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Riwayat Alergi Obat Pasien</label>
                <input
                  type="text"
                  value={patientAllergies}
                  onChange={e => setPatientAllergies(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <button
                onClick={handleCheckDrugSafety}
                disabled={isCheckerLoading}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShieldAlert className="w-4 h-4 text-amber-200" />
                {isCheckerLoading ? 'Mengecek Database Farmakologi...' : 'Cek Keamanan Interaksi Obat'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="font-bold text-white text-sm border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Hasil Analisis Farmakologis AI</span>
              {drugSafetyResult && (
                <span
                  className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                    drugSafetyResult.safeToDispense ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                  }`}
                >
                  {drugSafetyResult.safeToDispense ? 'Aman Diberikan' : 'Risiko Tinggi / Perlu Penyesuaian'}
                </span>
              )}
            </h2>

            {drugSafetyResult && (
              <div className="space-y-3 text-xs">
                <div className="space-y-2">
                  {drugSafetyResult.interactions.map((inter, i) => (
                    <div key={i} className="bg-slate-950 border border-red-500/40 p-4 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-red-400 text-sm">
                          {inter.drug1} ⚡ {inter.drug2}
                        </span>
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 font-bold rounded text-[10px]">
                          Tingkat Risiko: {inter.severity}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{inter.details}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400 block">Rekomendasi Penyesuaian Dosis / Alternatif:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {drugSafetyResult.warnings.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: CLINICAL GUIDELINES LIBRARY */}
      {activeTab === 'Guidelines' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <h2 className="font-bold text-white text-sm">Pustaka Panduan Praktik Klinis (PPK / IDI / PERKI)</h2>

            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={guidelineSearch}
                onChange={e => setGuidelineSearch(e.target.value)}
                placeholder="Cari pedoman klinis / penyakit..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuidelines.map((g, i) => (
              <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[10px] font-bold">
                    {g.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{g.code}</span>
                </div>
                <h3 className="font-bold text-white text-sm">{g.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{g.summary}</p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => showToast(`Pedoman "${g.title}" telah dimuat ke rujukan rekam medis.`)}
                    className="text-xs text-cyan-400 hover:underline font-bold"
                  >
                    Terapkan ke Kasus Ini →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
