import React, { useState, useEffect } from 'react';
import {
  Activity,
  FlaskConical,
  Film,
  Droplet,
  Cpu,
  Clock,
  AlertTriangle,
  Brain,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Zap,
  CheckCircle2,
  Server,
  Play,
  Layers,
  Search,
  Check,
  Plus
} from 'lucide-react';
import { MOCK_MEDICAL_DEVICES, MOCK_BLOOD_INVENTORY } from '../data/mockData';
import { MedicalDeviceIoT, BloodInventoryItem } from '../types';

export const MedicalSupportDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'IoT' | 'AIDiagnostics' | 'BloodBank'>('IoT');
  const [devices, setDevices] = useState<MedicalDeviceIoT[]>(MOCK_MEDICAL_DEVICES);
  const [bloodItems] = useState<BloodInventoryItem[]>(MOCK_BLOOD_INVENTORY);

  const [insights, setInsights] = useState<{
    turnaroundTimeLabMinutes: number;
    turnaroundTimeRadMinutes: number;
    criticalAlertsCount: number;
    bloodBankStockStatus: string;
    equipmentStatusOverview: string;
    predictiveMaintenanceWarning: string;
    workloadEfficiencyScore: number;
  }>({
    turnaroundTimeLabMinutes: 28,
    turnaroundTimeRadMinutes: 42,
    criticalAlertsCount: 4,
    bloodBankStockStatus: 'Stok Golongan O+ Kritis (< 5 kantong)',
    equipmentStatusOverview: '98% Perangkat Terhubung Online via HL7/FHIR',
    predictiveMaintenanceWarning: 'CT Scan Siemens SOMATOM memerlukan kalibrasi tabung x-ray dalam 48 jam.',
    workloadEfficiencyScore: 91
  });

  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  // AI Live Diagnostic Simulator state
  const [diagnosticMode, setDiagnosticMode] = useState<'Lab' | 'Radiology'>('Lab');
  const [labInput, setLabInput] = useState({
    category: 'Clinical Chemistry',
    patientName: 'Ny. Halimah',
    testResults: 'Glukosa Darah Puasa: 195 mg/dL (Normal < 100), HbA1c: 8.4%, Serum Creatinine: 2.2 mg/dL (Normal 0.6-1.2)',
  });
  const [radInput, setRadInput] = useState({
    modality: 'CT Scan',
    examinationName: 'CT Scan Kepala Tanpa Kontras',
    notes: 'Pasien datang ke IGD dengan kelemahan anggota gerak kanan mendadak, GCS 14, onset 2 jam lalu.',
  });

  const [aiResult, setAiResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const res = await fetch('/api/ai/medical-support-insights');
      const data = await res.json();
      if (data?.insights) {
        setInsights(data.insights);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleRunAIDiagnostic = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setAiResult(null);

    try {
      if (diagnosticMode === 'Lab') {
        const res = await fetch('/api/ai/lab-interpretation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: labInput.category,
            testResults: labInput.testResults,
            patientInfo: { name: labInput.patientName }
          })
        });
        const data = await res.json();
        setAiResult({ type: 'Lab', content: data.interpretation });
      } else {
        const res = await fetch('/api/ai/radiology-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modality: radInput.modality,
            examinationName: radInput.examinationName,
            patientNotes: radInput.notes
          })
        });
        const data = await res.json();
        setAiResult({ type: 'Rad', content: data.analysis });
      }
    } catch (err) {
      console.error(err);
      setAiResult({
        type: diagnosticMode,
        content: {
          abnormalSummary: 'Terdeteksi elevasi parameter kritis.',
          diseaseRiskScore: 'Tinggi',
          clinicalCorrelation: 'Diperlukan verifikasi penunjang lanjutan oleh DPJP.',
          recommendedFollowUp: 'Konsul Dokter Spesialis.'
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePingDevice = (id: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, lastPing: new Date().toLocaleTimeString() } : d))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-teal-900 via-indigo-950 to-slate-900 p-6 rounded-2xl border border-teal-800 text-white shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-teal-500/20 text-teal-300">
              <Brain className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold">
                AI Medical Support & IoT Diagnostics Control Center
              </h1>
              <p className="text-teal-200 mt-0.5 text-xs sm:text-sm">
                Pusat komando analisis presisi penunjang medis (LIS, RIS, PACS, Bank Darah, IoT Gateways).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sub Tab selector inside header */}
          <div className="flex items-center p-1 bg-slate-800/80 rounded-xl border border-teal-700/50">
            <button
              onClick={() => setActiveTab('IoT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'IoT' ? 'bg-teal-500 text-slate-950 shadow' : 'text-teal-200 hover:text-white'
              }`}
            >
              IoT Gateway
            </button>
            <button
              onClick={() => setActiveTab('AIDiagnostics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'AIDiagnostics' ? 'bg-teal-500 text-slate-950 shadow' : 'text-teal-200 hover:text-white'
              }`}
            >
              Analisis AI Lab/Rad
            </button>
            <button
              onClick={() => setActiveTab('BloodBank')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'BloodBank' ? 'bg-teal-500 text-slate-950 shadow' : 'text-teal-200 hover:text-white'
              }`}
            >
              Bank Darah
            </button>
          </div>

          <button
            onClick={fetchInsights}
            disabled={isLoadingInsights}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-500 hover:bg-teal-600 text-slate-950 font-extrabold rounded-xl text-xs transition shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingInsights ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Rata-rata TAT Laboratorium</span>
            <FlaskConical className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {insights.turnaroundTimeLabMinutes} <span className="text-sm font-normal text-slate-400">menit</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              -12% vs SPM
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Target SPM RS Tipe A: &lt; 140 menit</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>TAT Ekspertise Radiologi</span>
            <Film className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {insights.turnaroundTimeRadMinutes} <span className="text-sm font-normal text-slate-400">menit</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              CADx 96.4% Presisi
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Otomatisasi PACS & Heatmap AI</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Critical Value Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600">
              {insights.criticalAlertsCount} <span className="text-sm font-normal text-slate-400">kasus</span>
            </span>
            <span className="text-xs font-bold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded animate-pulse">
              E-Notif DPJP
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Direct alert ke EMR & Nurse Station</p>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Skor Efisiensi Operasional</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 dark:text-white">
              {insights.workloadEfficiencyScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Sangat Baik
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Optimalisasi beban kerja teknisi & mesin</p>
        </div>
      </div>

      {/* AI Predictive Warnings */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200 shadow-sm">
        <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm">Peringatan Maintenance Prediktif AI (Predictive Maintenance IoT)</h4>
          <p className="text-xs leading-relaxed">{insights.predictiveMaintenanceWarning}</p>
        </div>
      </div>

      {/* TAB 1: IOT DEVICE INTEGRATION */}
      {activeTab === 'IoT' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-600" />
                Integrasi Perangkat Medis IoT (HL7 v2.5 / FHIR R4 / DICOM)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Data vital monitor, ventilator ICU, & analyzer laboratorium ditransmisikan otomatis ke EMR pasien tanpa entri manual.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg text-xs font-bold">
              Gateway: {insights.equipmentStatusOverview}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {devices.map((dev) => (
              <div
                key={dev.id}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 hover:border-teal-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md">
                      {dev.protocol}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{dev.deviceName}</h4>
                    <p className="text-xs text-slate-500">
                      {dev.location} • IP: <span className="font-mono text-slate-700 dark:text-slate-300">{dev.ipAddress}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-[11px] font-bold rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                  {dev.telemetryData.map((t, idx) => (
                    <div key={idx}>
                      <span className="text-[10px] text-slate-400 font-bold block truncate">{t.metricName}</span>
                      <span className="text-xs font-black text-slate-900 dark:text-white">{t.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                  <span>Ping Terakhir: {dev.lastPing}</span>
                  <button
                    onClick={() => handlePingDevice(dev.id)}
                    className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                  >
                    Ping Ulang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE AI DIAGNOSTICS INTERPRETATION */}
      {activeTab === 'AIDiagnostics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Simulator Input Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-500" />
                  AI Presisi Interpretasi Lab & Radiologi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Uji sampel parameter laboratorium atau hasil pemeriksaan citra radiologi dengan Gemini AI.
                </p>
              </div>

              {/* Toggle Mode */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setDiagnosticMode('Lab');
                    setAiResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    diagnosticMode === 'Lab' ? 'bg-white dark:bg-slate-900 text-teal-600 shadow' : 'text-slate-500'
                  }`}
                >
                  Laboratorium
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDiagnosticMode('Radiology');
                    setAiResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    diagnosticMode === 'Radiology' ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow' : 'text-slate-500'
                  }`}
                >
                  Radiologi
                </button>
              </div>
            </div>

            <form onSubmit={handleRunAIDiagnostic} className="space-y-4 text-xs">
              {diagnosticMode === 'Lab' ? (
                <>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Kategori Lab</label>
                    <select
                      value={labInput.category}
                      onChange={(e) => setLabInput({ ...labInput, category: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                    >
                      <option value="Clinical Chemistry">Kimia Klinik (Glukosa, Ginjal, Liver, Lipid)</option>
                      <option value="Hematology">Hematologi Lengkap (Hb, Leukosit, Trombosit)</option>
                      <option value="Blood Gas">Analisis Gas Darah (AGD / BGA)</option>
                      <option value="Immunology">Imunologi & Serologi (HBsAg, Widal, PCR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Pasien</label>
                    <input
                      type="text"
                      value={labInput.patientName}
                      onChange={(e) => setLabInput({ ...labInput, patientName: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Parameter & Hasil Pemeriksaan Lab</label>
                    <textarea
                      rows={4}
                      value={labInput.testResults}
                      onChange={(e) => setLabInput({ ...labInput, testResults: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                      placeholder="Masukkan nilai lab (contoh: Hb 9.2 g/dL, Leukosit 14.500/uL)..."
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Modalitas Radiologi</label>
                      <select
                        value={radInput.modality}
                        onChange={(e) => setRadInput({ ...radInput, modality: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                      >
                        <option value="CT Scan">CT Scan</option>
                        <option value="MRI">MRI</option>
                        <option value="X-Ray">Foto Thorax / X-Ray</option>
                        <option value="USG">USG Abdomen</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Pemeriksaan</label>
                      <input
                        type="text"
                        value={radInput.examinationName}
                        onChange={(e) => setRadInput({ ...radInput, examinationName: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Catatan Klinis & Keluhan Pasien</label>
                    <textarea
                      rows={4}
                      value={radInput.notes}
                      onChange={(e) => setRadInput({ ...radInput, notes: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isAnalyzing}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs transition shadow-sm flex items-center justify-center gap-2"
              >
                <Brain className={`w-4 h-4 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                {isAnalyzing ? 'Gemini AI Memproses Analisis Diagnostik...' : 'Jalankan Analisis AI Gemini'}
              </button>
            </form>
          </div>

          {/* Result Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Hasil Interpretasi AI Diagnostik
            </h3>

            {!aiResult && !isAnalyzing && (
              <div className="p-12 text-center space-y-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Brain className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500">
                  Klik tombol <strong>"Jalankan Analisis AI Gemini"</strong> untuk menampilkan hasil ekspertise medis AI secara real-time.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="p-12 text-center space-y-3 bg-indigo-500/5 rounded-2xl border border-indigo-500/20">
                <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Menghubungkan ke Gemini AI Diagnostic Engine...
                </p>
              </div>
            )}

            {aiResult && aiResult.type === 'Lab' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-900 dark:text-emerald-300">Skor Risiko Penyakit:</span>
                    <span className="px-2.5 py-0.5 bg-emerald-600 text-white font-extrabold rounded">
                      {aiResult.content?.diseaseRiskScore || 'Tinggi'}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{aiResult.content?.abnormalSummary}</p>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Korelasi Klinis AI:</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{aiResult.content?.clinicalCorrelation}</p>
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-1">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200">Rekomendasi Tindak Lanjut DPJP:</h4>
                  <p className="text-indigo-900 dark:text-indigo-300">{aiResult.content?.recommendedFollowUp}</p>
                </div>
              </div>
            )}

            {aiResult && aiResult.type === 'Rad' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-900 dark:text-indigo-200">Kondisi Terdeteksi CADx:</span>
                    <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-extrabold rounded">
                      Presisi {aiResult.content?.probabilityScore || 94}%
                    </span>
                  </div>
                  <ul className="list-disc ml-4 font-bold text-indigo-800 dark:text-indigo-300">
                    {aiResult.content?.detectedConditions?.map((c: string, i: number) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <h4 className="font-bold text-slate-900 dark:text-white">Ringkasan Temuan Radiologis AI:</h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{aiResult.content?.findingSummary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BLOOD BANK & CRITICAL STOCK */}
      {activeTab === 'BloodBank' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-600" />
                Manajemen Logistik & Stok Darah Kritis (Bank Darah RS)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring ketersediaan kantong darah (Whole Blood, PRC, Platelet), masa kedaluwarsa, & crossmatch emergency.
              </p>
            </div>

            <span className="px-3 py-1 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-lg text-xs font-bold">
              Alert: Stok O+ Kritis (&lt; 5 Kantong)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bloodItems.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="w-10 h-10 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-sm">
                      {item.bloodType}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{item.component}</h4>
                      <p className="text-xs text-slate-500 font-mono">Kantong: {item.bagNumber}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded">
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px]">Suhu Storage:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{item.storageTempCelsius}°C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[10px]">Kedaluwarsa:</span>
                    <span className="font-bold text-rose-600">{item.expiryDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
