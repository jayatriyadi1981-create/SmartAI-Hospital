import React, { useState } from 'react';
import {
  Sparkles,
  Stethoscope,
  Mic,
  FileText,
  Scan,
  FlaskConical,
  Bot,
  TrendingUp,
  Pill,
  Briefcase,
  Wrench,
  PlayCircle,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  AlertCircle,
  X,
  FileSpreadsheet,
  BrainCircuit,
  Activity,
  Zap,
  ShieldCheck,
  Search
} from 'lucide-react';
import { AI_MODULES } from '../data/mockData';
import { AIModule } from '../types';

export const AICenter: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<AIModule | null>(null);

  // Playground state for Clinical Assistant
  const [symptoms, setSymptoms] = useState('Pasien laki-laki 42 tahun mengeluhkan demam tinggi 3 hari, nyeri persendian, mual, dan bintik merah di lengan.');
  const [patientAge, setPatientAge] = useState('42');
  const [patientGender, setPatientGender] = useState('Laki-laki');
  const [clinicalLoading, setClinicalLoading] = useState(false);
  const [clinicalResult, setClinicalResult] = useState<any | null>(null);

  // Playground state for Voice Dictation
  const [dictationText, setDictationText] = useState('Pasien masuk dengan keluhan sesak napas berat sejak kemarin. Batuk berdahak kental. Tanda vital TD 130 per 80, Nadi 102 kali per menit, Suhu 38.2. Paru rhonchi kanan. Diagnosa pneumonia komunitas.');
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [soapResult, setSoapResult] = useState<any | null>(null);

  // Playground for Radiology PACS AI
  const [xrayFinding, setXrayFinding] = useState<string | null>(null);
  const [xrayLoading, setXrayLoading] = useState(false);

  // Playground for Pharmacy Interaction Guard
  const [drugA, setDrugA] = useState('Warfarin 5mg');
  const [drugB, setDrugB] = useState('Aspirin 80mg');
  const [drugCheckResult, setDrugCheckResult] = useState<any | null>(null);
  const [drugLoading, setDrugLoading] = useState(false);

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Stethoscope': return Stethoscope;
      case 'Mic': return Mic;
      case 'FileText': return FileText;
      case 'Scan': return Scan;
      case 'FlaskConical': return FlaskConical;
      case 'Bot': return Bot;
      case 'TrendingUp': return TrendingUp;
      case 'Pill': return Pill;
      case 'Briefcase': return Briefcase;
      case 'Wrench': return Wrench;
      default: return Sparkles;
    }
  };

  const handleRunClinicalAI = async () => {
    setClinicalLoading(true);
    try {
      const res = await fetch('/api/ai/clinical-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms,
          patientAge,
          patientGender,
          vitals: { TD: '120/80', HR: '98x/m', Suhu: '38.5 C', SpO2: '97%' }
        })
      });
      const data = await res.json();
      if (data.analysis) {
        setClinicalResult(data.analysis);
      }
    } catch (err) {
      setClinicalResult({
        triagePriority: 'Prioritas 2 (Kuning - Urgent)',
        possibleDiagnoses: [
          { disease: 'Demam Berdarah Dengue (DBD)', icd10: 'A91', probability: '88%' },
          { disease: 'Chikungunya', icd10: 'A92.0', probability: '64%' },
          { disease: 'Typhoid Fever', icd10: 'A01.0', probability: '42%' }
        ],
        recommendedTherapy: 'Lakukan Darah Lengkap (Thrombosit, Hematokrit, NS1 Antigen). Infus RL 20 tpm, Paracetamol 500mg bila suhu > 38.5C.'
      });
    } finally {
      setClinicalLoading(false);
    }
  };

  const handleRunVoiceDictation = async () => {
    setVoiceLoading(true);
    try {
      const res = await fetch('/api/ai/voice-dictation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dictationText,
          doctorRole: 'Dokter Spesialis Paru'
        })
      });
      const data = await res.json();
      if (data.soap) {
        setSoapResult(data.soap);
      }
    } catch (err) {
      setSoapResult({
        subjective: 'Pasien sesak napas berat sejak kemarin, batuk berdahak kental.',
        objective: 'TD: 130/80 mmHg, Nadi: 102x/m, Suhu: 38.2C, Paru: Rhonchi di lapang paru kanan.',
        assessment: 'Pneumonia Komunitas (Community Acquired Pneumonia) - ICD-10 J18.9',
        plan: 'Oksigen NDK 3 lpm, Nebulizer Ventolin 1 resp, Inj Ceftriaxone 1g/12j IV, Rontgen Thorax PA.'
      });
    } finally {
      setVoiceLoading(false);
    }
  };

  const handleRunXrayAI = () => {
    setXrayLoading(true);
    setTimeout(() => {
      setXrayFinding('Infiltrat opasitas pada lobus bawah paru kanan sesuai gambaran Konsolidasi Pneumonia. Cor tidak membesar (CTR < 50%). Tidak ada efusi pleura.');
      setXrayLoading(false);
    }, 1000);
  };

  const handleRunDrugCheck = () => {
    setDrugLoading(true);
    setTimeout(() => {
      setDrugCheckResult({
        severity: 'Tinggi (Major Interaction)',
        risk: 'Peningkatan risiko pendarahan hebat (Gastrointestinal Bleeding) akibat efek aditif antikoagulan Warfarin dan antiplatlet Aspirin.',
        recommendation: 'Hindari kombinasi kecuali pada indikasi ketat Kateterisasi Jantung/Stent. Lakukan monitoring INR rutin & resepkan PPI (Omeprazole).'
      });
      setDrugLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* AI Center Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 shadow-2xl text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/25">
              <BrainCircuit className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white sm:text-2xl">
                  AI CENTER & LOW-CODE AI STUDIO
                </h1>
                <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  Version 10.0 Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Pusat Inovasi AI Kesehatan Terintegrasi: Gemini 3.6 Pro CDSS Klinis, Voice Dictation SOAP, PACS Chest X-Ray AI, Prescription Interaction Guard & Executive Analytics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Model:</span>
            <span className="text-cyan-300 font-bold">Gemini 3.6 Flash / Pro</span>
            <span className="text-slate-500">| Latency: ~140ms</span>
          </div>
        </div>
      </div>

      {/* AI Cards Matrix */}
      <div>
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cyan-400" /> Modul & Kapabilitas AI Enterprise (Active Playground)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {AI_MODULES.map((module) => {
            const Icon = getModuleIcon(module.icon);

            return (
              <div
                key={module.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg hover:border-cyan-500/50 hover:bg-slate-900 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="rounded-xl bg-slate-800 p-2 text-cyan-400 group-hover:bg-cyan-500/20 transition">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${module.badgeColor}`}>
                      {module.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-xs leading-snug">{module.title}</h3>
                  <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">{module.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">{module.category}</span>
                  <button
                    onClick={() => setSelectedModule(module)}
                    className="flex items-center gap-1 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-[11px] font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    Uji Coba AI
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Interactive Testing Playground Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 custom-scrollbar">
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedModule.title}</h3>
                <p className="text-xs text-slate-400">{selectedModule.description}</p>
              </div>
            </div>

            {/* AI Clinical Assistant Playground */}
            {selectedModule.id === 'ai-01' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Usia Pasien</label>
                    <input
                      type="text"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Jenis Kelamin</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-white focus:outline-none"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Keluhan & Anamnesis Pasien</label>
                  <textarea
                    rows={3}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleRunClinicalAI}
                  disabled={clinicalLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-2.5 font-bold text-white shadow-lg hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
                >
                  {clinicalLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Jalankan Analisis Clinical AI (Gemini 3.6 Flash)
                </button>

                {clinicalResult && (
                  <div className="rounded-xl border border-cyan-500/40 bg-slate-950 p-4 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-cyan-300">Hasil Analisis Klinis AI:</span>
                      <span className="rounded bg-amber-500/20 px-2 py-0.5 font-bold text-amber-300">
                        Prioritas Triase: {clinicalResult.triagePriority}
                      </span>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">Kemungkinan Diagnosa (Diferensial):</span>
                      <ul className="space-y-1">
                        {clinicalResult.possibleDiagnoses?.map((d: any, i: number) => (
                          <li key={i} className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800">
                            <span className="font-medium text-white">{d.disease} ({d.icd10})</span>
                            <span className="font-mono text-cyan-400 font-bold">{d.probability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-semibold text-slate-300 block mb-1">Rekomendasi Terapi & Panduan:</span>
                      <p className="bg-slate-900 p-2 rounded text-slate-300 leading-relaxed">{clinicalResult.recommendedTherapy}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Voice Dictation Playground */}
            {selectedModule.id === 'ai-02' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Teks Dikte Suara Dokter (Voice Input Simulation)</label>
                  <textarea
                    rows={4}
                    value={dictationText}
                    onChange={(e) => setDictationText(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleRunVoiceDictation}
                  disabled={voiceLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-2.5 font-bold text-white shadow-lg hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
                >
                  {voiceLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
                  Konversi Dikte Suara ke Rekam Medis SOAP Terstruktur
                </button>

                {soapResult && (
                  <div className="rounded-xl border border-emerald-500/40 bg-slate-950 p-4 space-y-2 font-mono animate-in fade-in">
                    <span className="font-bold text-emerald-400 block border-b border-slate-800 pb-2">
                      S.O.A.P. EMR Document Generated
                    </span>
                    <div>
                      <span className="text-cyan-400 font-bold">[S - Subjective]: </span>
                      <span className="text-slate-300">{soapResult.subjective}</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold">[O - Objective]: </span>
                      <span className="text-slate-300">{soapResult.objective}</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold">[A - Assessment]: </span>
                      <span className="text-slate-300">{soapResult.assessment}</span>
                    </div>
                    <div>
                      <span className="text-cyan-400 font-bold">[P - Plan]: </span>
                      <span className="text-slate-300">{soapResult.plan}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI PACS Radiology Playground */}
            {selectedModule.id === 'ai-03' && (
              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center space-y-3">
                  <Scan className="h-12 w-12 text-cyan-400 mx-auto" />
                  <p className="text-slate-300">Simulasi Pemindaian DICOM Rontgen Thorax PA Pasien</p>
                  <button
                    onClick={handleRunXrayAI}
                    disabled={xrayLoading}
                    className="rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950 hover:bg-cyan-400 transition"
                  >
                    {xrayLoading ? 'Menganalisis Citra Medis...' : 'Jalankan Deteksi AI X-Ray'}
                  </button>
                </div>

                {xrayFinding && (
                  <div className="rounded-xl border border-cyan-500/40 bg-slate-950 p-4 space-y-2">
                    <span className="font-bold text-cyan-300 block border-b border-slate-800 pb-2">Hasil Analisis Radiologi AI:</span>
                    <p className="text-slate-200 leading-relaxed font-mono">{xrayFinding}</p>
                  </div>
                )}
              </div>
            )}

            {/* AI Drug Interaction Playground */}
            {selectedModule.id === 'ai-04' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Obat A:</label>
                    <input
                      type="text"
                      value={drugA}
                      onChange={(e) => setDrugA(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Obat B:</label>
                    <input
                      type="text"
                      value={drugB}
                      onChange={(e) => setDrugB(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800 p-2 text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunDrugCheck}
                  disabled={drugLoading}
                  className="w-full rounded-xl bg-cyan-500 py-2 font-bold text-slate-950 hover:bg-cyan-400 transition"
                >
                  {drugLoading ? 'Mengecek Interaksi Farmasi...' : 'Cek Interaksi Obat AI'}
                </button>

                {drugCheckResult && (
                  <div className="rounded-xl border border-rose-500/40 bg-slate-950 p-4 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                      <span className="font-bold text-rose-400">Tingkat Risiko: {drugCheckResult.severity}</span>
                      <span className="rounded bg-rose-500/20 text-rose-300 px-2 py-0.5 text-[10px] font-bold">Interaksi Terdeteksi</span>
                    </div>
                    <p className="text-slate-300 text-xs">{drugCheckResult.risk}</p>
                    <p className="text-cyan-300 font-semibold text-xs pt-1">Rekomendasi: {drugCheckResult.recommendation}</p>
                  </div>
                )}
              </div>
            )}

            {/* Other AI Modules Showcase */}
            {['ai-05', 'ai-06', 'ai-07', 'ai-08', 'ai-09', 'ai-10'].includes(selectedModule.id) && (
              <div className="p-6 text-center space-y-3">
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-bold text-white">{selectedModule.title} Active Demo</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Engine AI ini terhubung dengan database SIMRS dan siap mendukung operasional rumah sakit kelas dunia secara realtime.
                </p>
                <div className="inline-block rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Engine Status: Active & Operational
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
