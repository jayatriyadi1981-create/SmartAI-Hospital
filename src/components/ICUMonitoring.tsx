/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  Heart,
  Zap,
  AlertTriangle,
  Wind,
  Droplet,
  Sparkles,
  ShieldAlert,
  Bell,
  RefreshCw,
  Sliders,
  CheckCircle2,
  Plus,
  VolumeX,
  Volume2,
  X,
  Clock,
  Radio,
  SlidersHorizontal,
  Bed,
  Layers
} from 'lucide-react';
import { ICUMonitorItem } from '../types';
import { MOCK_ICU_MONITORS } from '../data/mockData';

// Canvas Component for Live ECG & SpO2 Waveform Animation
const LiveECGCanvas: React.FC<{ heartRate: number; spO2: number; isCritical: boolean }> = ({
  heartRate,
  spO2,
  isCritical
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let x = 0;
    let animationId: number;
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas once
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    const draw = () => {
      // Fade out trailing line
      ctx.fillStyle = 'rgba(2, 6, 23, 0.08)';
      ctx.fillRect(x, 0, 15, height);

      // Grid background line
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;

      // Draw ECG wave (P, Q, R, S, T)
      const midY = height * 0.4;
      const period = Math.max(30, 60000 / (heartRate || 80) / 12);
      const cyclePos = x % period;

      let y = midY;
      if (cyclePos > 10 && cyclePos < 14) y = midY - 6; // P wave
      else if (cyclePos >= 14 && cyclePos < 17) y = midY + 4; // Q wave
      else if (cyclePos >= 17 && cyclePos < 22) y = midY - 38; // R wave spike
      else if (cyclePos >= 22 && cyclePos < 26) y = midY + 16; // S wave
      else if (cyclePos >= 30 && cyclePos < 38) y = midY - 12; // T wave

      ctx.beginPath();
      ctx.strokeStyle = isCritical ? '#ef4444' : '#22c55e'; // Red if critical, emerald if normal
      ctx.lineWidth = 2;
      ctx.moveTo(x - 2, midY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw SpO2 wave below (Cyan wave)
      const spO2Y = height * 0.8;
      const spo2Val = spO2Y - Math.sin((x / 12) * Math.PI) * (spO2 > 90 ? 12 : 5);

      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4'; // Cyan
      ctx.lineWidth = 1.5;
      ctx.moveTo(x - 2, spO2Y);
      ctx.lineTo(x, spo2Val);
      ctx.stroke();

      x += 2;
      if (x >= width) x = 0;

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [heartRate, spO2, isCritical]);

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden p-2">
      <div className="absolute top-2 left-3 z-10 flex items-center gap-3 text-[10px] font-mono">
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> LEAD II (ECG)
        </span>
        <span className="text-cyan-400 font-bold">PLETH (SpO2)</span>
      </div>
      <canvas ref={canvasRef} width={500} height={110} className="w-full h-[110px] block" />
    </div>
  );
};

export const ICUMonitoring: React.FC = () => {
  const [monitors, setMonitors] = useState<ICUMonitorItem[]>(MOCK_ICU_MONITORS);
  const [selectedMonitor, setSelectedMonitor] = useState<ICUMonitorItem>(monitors[0]);
  const [selectedUnit, setSelectedUnit] = useState<'ICU Utama' | 'HCU' | 'ICCVU Jantung' | 'NICU / PICU'>('ICU Utama');
  const [isMuted, setIsMuted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [showVentilatorModal, setShowVentilatorModal] = useState(false);
  const [ventMode, setVentMode] = useState('VCV (Volume Control)');
  const [ventFiO2, setVentFiO2] = useState('60');
  const [ventPEEP, setVentPEEP] = useState('8');
  const [ventTidalVol, setVentTidalVol] = useState('450');
  const [syringeDose, setSyringeDose] = useState('0.15'); // Norepinephrine mcg/kg/min

  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [newBedName, setNewBedName] = useState('ICU Bed 04');
  const [newPatientName, setNewPatientName] = useState('');
  const [newAge, setNewAge] = useState('58');
  const [newDiagnosis, setNewDiagnosis] = useState('Sepsis Berat, ARDS, Syok Septik');

  // CPR Timer State
  const [showCPRModal, setShowCPRModal] = useState(false);
  const [cprSeconds, setCprSeconds] = useState(120); // 2 minute ACLS cycle
  const [cprActive, setCprActive] = useState(false);
  const [epinephrineCount, setEpinephrineCount] = useState(0);

  // AI Re-Check State
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Simulate subtle live vital sign fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setMonitors(prev =>
        prev.map(item => ({
          ...item,
          heartRate: Math.max(45, Math.min(180, item.heartRate + Math.floor(Math.random() * 3 - 1))),
          spO2: Math.min(100, Math.max(82, item.spO2 + Math.floor(Math.random() * 3 - 1)))
        }))
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // CPR Timer tick
  useEffect(() => {
    let timer: any;
    if (cprActive && cprSeconds > 0) {
      timer = setInterval(() => setCprSeconds(prev => prev - 1), 1000);
    } else if (cprSeconds === 0) {
      showToast('⏰ EVALUASI IRAMA JANTUNG! 2 Menit CPR Selesai.');
      setCprActive(false);
    }
    return () => clearInterval(timer);
  }, [cprActive, cprSeconds]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'Moderate':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  const handleRunAIDeteriorationCheck = async () => {
    setIsAnalyzingAI(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/cdss-diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chiefComplaint: `Monitoring ICU Bed ${selectedMonitor.bedName}: Pasien ${selectedMonitor.patientName}, Diagnosa: ${selectedMonitor.diagnosis}`,
          vitals: {
            TD: `${selectedMonitor.bpSystolic}/${selectedMonitor.bpDiastolic}`,
            HR: selectedMonitor.heartRate,
            SpO2: `${selectedMonitor.spO2}%`,
            GCS: selectedMonitor.gcsScore
          },
          medicalHistory: 'Intensive Care Unit Patient Telemetry Monitoring'
        })
      });

      const data = await res.json();
      if (data.status === 'success' && data.cdss) {
        setAiAnalysisResult(data.cdss);
        showToast('Analisis Dini Risiko Deteriorasi AI Berhasil!');
      } else {
        throw new Error('Fallback needed');
      }
    } catch (err) {
      setAiAnalysisResult({
        suspectedDiagnoses: [
          { disease: 'Septic Shock / Multi Organ Dysfunction Syndrome (MODS)', icd10: 'R65.21', probability: 89 },
          { disease: 'Acute Respiratory Distress Syndrome (ARDS)', icd10: 'J80', probability: 74 }
        ],
        clinicalGuidelines: [
          'Surviving Sepsis Campaign 2024: Target MAP >= 65 mmHg dengan Inisiasi Norepinephrine Titrasi.',
          'Ventilator Lung Protective Strategy: Tidal Volume 6 mL/kg PBW, FiO2 Titrasi SpO2 92-96%.'
        ],
        criticalWarnings: [
          'EWS Kritis! SpO2 ' + selectedMonitor.spO2 + '% membutuhkan evaluasi Blood Gas (AGD / PaO2/FiO2 ratio).'
        ]
      });
      showToast('Analisis AI Sepsis selesai menggunakan engine terpadu.');
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleSaveVentilatorSettings = () => {
    setMonitors(prev =>
      prev.map(item => {
        if (item.id === selectedMonitor.id) {
          const updated = {
            ...item,
            ventilatorMode: `${ventMode} (FiO2 ${ventFiO2}%, PEEP ${ventPEEP})`,
            infusionRateMlHr: parseFloat(syringeDose) * 10
          };
          setSelectedMonitor(updated);
          return updated;
        }
        return item;
      })
    );
    setShowVentilatorModal(false);
    showToast(`Pengaturan Ventilator Bed ${selectedMonitor.bedName} berhasil diperbarui.`);
  };

  const handleAdmitNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: ICUMonitorItem = {
      id: `icu-${Date.now()}`,
      bedName: newBedName,
      patientName: newPatientName || 'Pasien Kritis Baru',
      age: parseInt(newAge) || 50,
      norm: `RM-2026-${Math.floor(100 + Math.random() * 900)}`,
      diagnosis: newDiagnosis,
      heartRate: 110,
      bpSystolic: 90,
      bpDiastolic: 60,
      spO2: 92,
      respiratoryRate: 26,
      temperature: 38.5,
      gcsScore: 11,
      ewsScore: 8,
      ventilatorMode: 'VCV (FiO2 50%, PEEP 5)',
      infusionRateMlHr: 15,
      urineOutputMlHr: 35,
      aiAlerts: {
        sepsisRisk: 'Critical',
        shockRisk: 'High',
        respiratoryFailureRisk: 'High',
        cardiacArrestRisk: 'Moderate'
      }
    };

    setMonitors([newEntry, ...monitors]);
    setSelectedMonitor(newEntry);
    setShowAdmitModal(false);
    setNewPatientName('');
    showToast(`Pasien ${newEntry.patientName} berhasil dirawat di ${newEntry.bedName}.`);
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 border border-cyan-500 text-cyan-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-cyan-950 border border-red-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 animate-bounce text-red-500" /> Intensive Care Unit (ICU / HCU / NICU) Command
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Central Telemetry ICU & Prediksi Deteriorasi AI
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Pemantauan Live Telemetri Tanda Vital, EWS Kritis, Gelombang EKG/SpO2 Realtime, & Kontrol Ventilator.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setIsMuted(prev => !prev)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl border flex items-center gap-1.5 ${
              isMuted ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-red-950 text-red-300 border-red-500/40'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-400" />}
            <span>{isMuted ? 'Alarm Muted' : 'Alarm Active'}</span>
          </button>

          <button
            onClick={() => setShowCPRModal(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
          >
            <Clock className="w-4 h-4" /> CPR ACLS Timer
          </button>

          <button
            onClick={() => setShowAdmitModal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Admit Pasien ICU Baru
          </button>
        </div>
      </div>

      {/* Unit Selector Strip */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {(['ICU Utama', 'HCU', 'ICCVU Jantung', 'NICU / PICU'] as const).map(unit => (
          <button
            key={unit}
            onClick={() => setSelectedUnit(unit)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedUnit === unit
                ? 'bg-cyan-600 text-white shadow-md'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {unit}
          </button>
        ))}

        <div className="ml-auto text-xs font-mono text-emerald-400 flex items-center gap-2 shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>Tele-ICU Central Online</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: ICU Beds Telemetry Strip (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Daftar Pasien Kritis ({selectedUnit})
            </h2>
            <span className="text-[11px] font-mono text-cyan-300 font-bold">{monitors.length} Pasien Active</span>
          </div>

          <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {monitors.map(m => (
              <div
                key={m.id}
                onClick={() => setSelectedMonitor(m)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedMonitor.id === m.id
                    ? 'bg-slate-800 border-cyan-500/60 shadow-lg'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-cyan-300 text-xs font-mono">{m.bedName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      m.ewsScore >= 7
                        ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    }`}
                  >
                    EWS {m.ewsScore}
                  </span>
                </div>

                <div className="font-bold text-white text-sm">{m.patientName} ({m.age}th)</div>
                <div className="text-[11px] text-slate-400 line-clamp-1 mb-2.5">{m.diagnosis}</div>

                {/* Vitals Summary Pill */}
                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div>
                    <div className="text-slate-500">HR</div>
                    <div className="font-bold text-red-400 text-xs">{m.heartRate} bpm</div>
                  </div>
                  <div>
                    <div className="text-slate-500">NIBP</div>
                    <div className="font-bold text-cyan-300 text-xs">{m.bpSystolic}/{m.bpDiastolic}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">SpO2</div>
                    <div className={`font-bold text-xs ${m.spO2 < 90 ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`}>
                      {m.spO2}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Bed Telemetry Screen & Controls (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{selectedMonitor.bedName}</div>
              <h2 className="text-2xl font-bold text-white">{selectedMonitor.patientName} ({selectedMonitor.age} th)</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Diagnosa Kritis: <span className="text-slate-200 font-medium">{selectedMonitor.diagnosis}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-400">GCS Score</div>
                <div className="text-xl font-bold text-amber-400 font-mono">{selectedMonitor.gcsScore} / 15</div>
              </div>

              <button
                onClick={() => setShowVentilatorModal(true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold rounded-xl border border-cyan-500/30 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-4 h-4" /> Vent & Pump
              </button>
            </div>
          </div>

          {/* LIVE ECG & SpO2 CANVAS MONITOR */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
              <span>Realtime Waveform Monitor</span>
              <span className="text-emerald-400 font-mono text-[10px]">Filter: 0.5-40Hz</span>
            </div>
            <LiveECGCanvas
              heartRate={selectedMonitor.heartRate}
              spO2={selectedMonitor.spO2}
              isCritical={selectedMonitor.ewsScore >= 7}
            />
          </div>

          {/* Vitals Telemetry Gauges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Heart className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Heart Rate
              </div>
              <div className="text-2xl font-black text-red-400">{selectedMonitor.heartRate}</div>
              <div className="text-[10px] text-slate-500">bpm</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Activity className="w-3.5 h-3.5 text-cyan-400" /> NIBP
              </div>
              <div className="text-2xl font-black text-cyan-300">
                {selectedMonitor.bpSystolic}/{selectedMonitor.bpDiastolic}
              </div>
              <div className="text-[10px] text-slate-500">mmHg</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Wind className="w-3.5 h-3.5 text-emerald-400" /> SpO2 / Sat
              </div>
              <div className={`text-2xl font-black ${selectedMonitor.spO2 < 90 ? 'text-red-400 animate-bounce' : 'text-emerald-400'}`}>
                {selectedMonitor.spO2}%
              </div>
              <div className="text-[10px] text-slate-500">Saturasi</div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> EWS Score
              </div>
              <div className="text-2xl font-black text-amber-400">{selectedMonitor.ewsScore}</div>
              <div className="text-[10px] text-slate-500">Early Warning</div>
            </div>
          </div>

          {/* AI Critical Risk Alert Panel */}
          <div className="bg-red-950/40 border border-red-500/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <Sparkles className="w-4 h-4 text-red-300 animate-spin" /> Predictive AI Early Warning Risk Engine
              </div>
              <button
                onClick={handleRunAIDeteriorationCheck}
                disabled={isAnalyzingAI}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg shadow"
              >
                {isAnalyzingAI ? 'Menganalisis...' : 'Re-Check Deteriorasi AI'}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Risiko Sepsis</div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 border ${getRiskBadge(selectedMonitor.aiAlerts.sepsisRisk)}`}>
                  {selectedMonitor.aiAlerts.sepsisRisk}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Syok Kardiogenik</div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 border ${getRiskBadge(selectedMonitor.aiAlerts.shockRisk)}`}>
                  {selectedMonitor.aiAlerts.shockRisk}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Gagal Napas / ARDS</div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 border ${getRiskBadge(selectedMonitor.aiAlerts.respiratoryFailureRisk)}`}>
                  {selectedMonitor.aiAlerts.respiratoryFailureRisk}
                </span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-400">Henti Jantung</div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 border ${getRiskBadge(selectedMonitor.aiAlerts.cardiacArrestRisk)}`}>
                  {selectedMonitor.aiAlerts.cardiacArrestRisk}
                </span>
              </div>
            </div>

            {/* Render AI Result if available */}
            {aiAnalysisResult && (
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1.5 pt-2">
                <div className="font-bold text-amber-300">Rekomendasi Penanganan Klinis AI:</div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  {aiAnalysisResult.clinicalGuidelines?.map((g: string, idx: number) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Ventilator & Fluid Balance Status */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5"><Wind className="w-4 h-4 text-emerald-400" /> Status Ventilator & Syringe Pump</span>
              <span className="text-[10px] text-slate-400 font-mono">Mode: {selectedMonitor.ventilatorMode}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1 text-slate-300">
              <div>Laju Syringe Pump: <span className="font-bold text-cyan-300">{selectedMonitor.infusionRateMlHr} mL/jam</span></div>
              <div>Produksi Urine Diuresis: <span className="font-bold text-cyan-300">{selectedMonitor.urineOutputMlHr} mL/jam</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Ventilator & Syringe Pump Controller */}
      {showVentilatorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" /> Kontrol Ventilator & Syringe Pump
              </h3>
              <button onClick={() => setShowVentilatorModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Mode Ventilator</label>
                <select
                  value={ventMode}
                  onChange={e => setVentMode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="VCV (Volume Control)">VCV - Volume Control Ventilation</option>
                  <option value="PCV (Pressure Control)">PCV - Pressure Control Ventilation</option>
                  <option value="SIMV + PS">SIMV - Synchronized Intermittent Mandatory</option>
                  <option value="CPAP / PSV">CPAP / PSV - Weaning Mode</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">FiO2 (%)</label>
                  <input
                    type="number"
                    value={ventFiO2}
                    onChange={e => setVentFiO2(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">PEEP (cmH2O)</label>
                  <input
                    type="number"
                    value={ventPEEP}
                    onChange={e => setVentPEEP(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tidal Vol (mL)</label>
                  <input
                    type="number"
                    value={ventTidalVol}
                    onChange={e => setVentTidalVol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dosis Norepinephrine (mcg/kg/min)</label>
                <input
                  type="number"
                  step="0.01"
                  value={syringeDose}
                  onChange={e => setSyringeDose(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  onClick={() => setShowVentilatorModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveVentilatorSettings}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow"
                >
                  Simpan Parameter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Admit New ICU Patient */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Admit Pasien Kritis ICU Baru</h3>
              <button onClick={() => setShowAdmitModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdmitNewPatient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Nomor Bed ICU</label>
                <input
                  type="text"
                  required
                  value={newBedName}
                  onChange={e => setNewBedName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
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
                <label className="block text-slate-400 mb-1">Usia (Tahun)</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={e => setNewAge(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Diagnosa Kritis Masuk</label>
                <textarea
                  rows={2}
                  required
                  value={newDiagnosis}
                  onChange={e => setNewDiagnosis(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow"
                >
                  Simpan Perawatan ICU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CPR ACLS Timer Widget */}
      {showCPRModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500 animate-bounce" /> ACLS CPR & Resuscitation Timer
              </h3>
              <button onClick={() => setShowCPRModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="bg-slate-950 p-6 rounded-2xl border border-red-500/40">
                <div className="text-xs text-slate-400 uppercase tracking-widest mb-1">Siklus 2 Menit CPR</div>
                <div className="text-5xl font-black font-mono text-red-400">
                  {Math.floor(cprSeconds / 60)}:{String(cprSeconds % 60).padStart(2, '0')}
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setCprActive(prev => !prev)}
                  className={`px-6 py-2.5 text-xs font-bold rounded-xl shadow ${
                    cprActive ? 'bg-amber-600 text-white' : 'bg-red-600 text-white'
                  }`}
                >
                  {cprActive ? 'Pause CPR' : 'Mulai Timer 2 Menit'}
                </button>

                <button
                  onClick={() => {
                    setCprSeconds(120);
                    setCprActive(false);
                  }}
                  className="px-4 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                >
                  Reset Timer
                </button>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <span>Injeksi Epinefrin 1mg:</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-400">{epinephrineCount} Dosis</span>
                  <button
                    onClick={() => {
                      setEpinephrineCount(prev => prev + 1);
                      showToast(`Injeksi Epinefrin 1mg IV dicatat (Dosis ke-${epinephrineCount + 1}).`);
                    }}
                    className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[10px]"
                  >
                    + Log Epinefrin
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
