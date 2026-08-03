/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Users,
  Volume2,
  Clock,
  Sparkles,
  AlertTriangle,
  Play,
  SkipForward,
  CheckCircle2,
  Tv,
  QrCode,
  CreditCard,
  Building2,
  Activity,
  ArrowRight,
  Printer,
  RefreshCw,
  Search,
  ChevronRight
} from 'lucide-react';
import { QueueItem } from '../types';
import { MOCK_QUEUES } from '../data/mockData';

export const SmartQueueView: React.FC = () => {
  const [queues, setQueues] = useState<QueueItem[]>(MOCK_QUEUES);
  const [activeTab, setActiveTab] = useState<'Dashboard' | 'DisplayTV' | 'SelfServiceKiosk'>('Dashboard');
  const [selectedPolyFilter, setSelectedPolyFilter] = useState<string>('Semua');
  const [currentlyCalling, setCurrentlyCalling] = useState<QueueItem | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Kiosk Check-in Form
  const [kioskCode, setKioskCode] = useState('');
  const [kioskCheckedIn, setKioskCheckedIn] = useState<QueueItem | null>(null);

  // Filtered Queues
  const filteredQueues = queues.filter(q => {
    if (selectedPolyFilter === 'Semua') return true;
    return q.category === selectedPolyFilter;
  });

  // Call Queue Function
  const handleCallQueue = (item: QueueItem) => {
    setCurrentlyCalling(item);
    setIsAudioPlaying(true);

    // Update status in list
    setQueues(prev =>
      prev.map(q => {
        if (q.id === item.id) {
          return { ...q, status: 'Calling', calledAt: new Date().toLocaleTimeString('id-ID') };
        }
        return q;
      })
    );

    // Browser Speech Synthesis for calling queue number
    if ('speechSynthesis' in window) {
      const textToSpeak = `Nomor antrian ${item.queueNumber}, pasien ${item.patientName}, silakan menuju ${item.polyName}.`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.onend = () => setIsAudioPlaying(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsAudioPlaying(false), 2500);
    }
  };

  // Complete Queue
  const handleCompleteQueue = (id: string) => {
    setQueues(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'Completed' } : q))
    );
    if (currentlyCalling?.id === id) {
      setCurrentlyCalling(null);
    }
  };

  // Skip Queue
  const handleSkipQueue = (id: string) => {
    setQueues(prev =>
      prev.map(q => (q.id === id ? { ...q, status: 'Skipped' } : q))
    );
  };

  // Self Service Kiosk Check-In
  const handleKioskCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const generated: QueueItem = {
      id: `q-${Date.now()}`,
      queueNumber: `A-0${Math.floor(16 + Math.random() * 20)}`,
      patientId: 'pat-kiosk',
      patientName: 'Pasien Anjungan Mandiri',
      norm: kioskCode || 'RM-2026-8819',
      polyName: 'Poli Penyakit Dalam',
      doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
      category: 'Rawat Jalan',
      serviceType: 'BPJS',
      status: 'Waiting',
      estimatedWaitMinutes: 10,
      priorityScore: 2
    };

    setQueues([generated, ...queues]);
    setKioskCheckedIn(generated);
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 border border-sky-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Volume2 className="w-4 h-4" /> Smart Queue AI & Display System
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Manajemen Antrian Cerdas & Anjungan Mandiri
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Sistem panggil antrian suara AI, estimasi waktu tunggu cerdas, dan layar display ruang tunggu publik.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('Dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'Dashboard' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Dashboard Panggilan
          </button>
          <button
            onClick={() => setActiveTab('DisplayTV')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'DisplayTV' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" /> Display TV Publik
          </button>
          <button
            onClick={() => setActiveTab('SelfServiceKiosk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'SelfServiceKiosk' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" /> Kiosk Check-In
          </button>
        </div>
      </div>

      {/* VIEW 1: DASHBOARD PANGGILAN */}
      {activeTab === 'Dashboard' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Calling Card (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 border border-sky-500/40 rounded-2xl p-5 shadow-xl text-center space-y-4 relative overflow-hidden">
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center justify-center gap-2">
                <Volume2 className="w-4 h-4 animate-bounce" /> Panggilan Antrian Aktif
              </div>

              {currentlyCalling ? (
                <div className="space-y-3 py-2 animate-fade-in">
                  <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-200 font-mono">
                    {currentlyCalling.queueNumber}
                  </div>
                  <div className="font-bold text-white text-base">{currentlyCalling.patientName}</div>
                  <div className="text-xs text-slate-400">{currentlyCalling.polyName} ({currentlyCalling.doctorName})</div>

                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => handleCallQueue(currentlyCalling)}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium rounded-xl flex items-center gap-1.5"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Panggil Ulang
                    </button>
                    <button
                      onClick={() => handleCompleteQueue(currentlyCalling.id)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-xl flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </button>
                    <button
                      onClick={() => handleSkipQueue(currentlyCalling.id)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-medium rounded-xl flex items-center gap-1.5"
                    >
                      <SkipForward className="w-3.5 h-3.5" /> Lewati
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-slate-500 text-xs">
                  Tidak ada nomor antrian yang sedang dipanggil. Klik tombol "Panggil" pada daftar sebelah kanan.
                </div>
              )}
            </div>

            {/* AI Queue Optimization Tip */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <Sparkles className="w-4 h-4 text-sky-300" /> Analisis AI Antrian & Kepadatan
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rata-rata waktu tunggu pasien saat ini adalah <span className="font-bold text-sky-300">12.4 menit</span>. AI merekomendasikan pembukaan loket pendaftaran tambahan di Poli Penyakit Dalam untuk mencegah penumpukan jam 11:00.
              </p>
            </div>
          </div>

          {/* Queue List Table (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            {/* Filter Category */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
                {['Semua', 'Rawat Jalan', 'IGD', 'Laboratorium', 'Farmasi'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedPolyFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                      selectedPolyFilter === cat
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <span className="text-xs text-slate-400 font-mono">Total: {filteredQueues.length} Antrian</span>
            </div>

            {/* Queue Table */}
            <div className="space-y-2">
              {filteredQueues.map(item => (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl border border-sky-500/30 flex items-center justify-center font-bold font-mono text-cyan-300 text-lg shrink-0">
                      {item.queueNumber}
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs flex items-center gap-2">
                        {item.patientName}
                        <span className="text-[10px] text-slate-400 font-mono">({item.norm})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.polyName} • <span className="text-slate-300">{item.doctorName}</span>
                      </div>
                      {item.aiDelayAlert && (
                        <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-1">
                          <AlertTriangle className="w-3 h-3" /> {item.aiDelayReason}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 border-slate-800 pt-2 sm:pt-0">
                    <div className="text-right text-[11px]">
                      <div className="text-slate-400">Estimasi: <span className="font-bold text-sky-300">{item.estimatedWaitMinutes} menit</span></div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-0.5 ${
                          item.status === 'Calling'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : item.status === 'In Service'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : item.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCallQueue(item)}
                      className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Panggil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DISPLAY TV PUBLIK */}
      {activeTab === 'DisplayTV' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-bold text-sky-400 uppercase tracking-widest">SISTEM ANTRIAN TERPADU PUBLIK</div>
              <h2 className="text-2xl font-bold text-white">RSUD SMART MEDIKA - RUANG TUNGGU UTAMA</h2>
            </div>
            <div className="text-right font-mono text-sm text-cyan-400">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {queues.slice(0, 6).map(q => (
              <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3 shadow-lg">
                <div className="text-xs text-sky-400 font-bold uppercase">{q.polyName}</div>
                <div className="text-6xl font-extrabold font-mono text-cyan-300 tracking-wider">{q.queueNumber}</div>
                <div className="font-bold text-white text-sm">{q.patientName}</div>
                <div className="text-xs text-slate-400">{q.doctorName}</div>
                <span className="inline-block px-3 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-bold">
                  {q.status === 'Calling' ? 'SEDANG DIPANGGIL' : q.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: SELF SERVICE KIOSK */}
      {activeTab === 'SelfServiceKiosk' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-xl mx-auto space-y-6 shadow-2xl text-center">
          <div className="space-y-2">
            <QrCode className="w-12 h-12 text-sky-400 mx-auto" />
            <h2 className="text-2xl font-bold text-white">Anjungan Mandiri Check-In (Kiosk)</h2>
            <p className="text-xs text-slate-400">Scan QR Code Bukti Pendaftaran Online atau Masukkan No. RM / NIK Anda.</p>
          </div>

          {!kioskCheckedIn ? (
            <form onSubmit={handleKioskCheckIn} className="space-y-4">
              <input
                type="text"
                required
                value={kioskCode}
                onChange={e => setKioskCode(e.target.value)}
                placeholder="Masukkan No. RM atau NIK KTP..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-center text-sm text-white font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-bold rounded-xl text-sm shadow-xl transition-all"
              >
                Cetak Karcis Antrian Mandiri
              </button>
            </form>
          ) : (
            <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-6 space-y-4 font-mono text-xs animate-fade-in">
              <div className="text-emerald-400 font-bold text-sm">CHECK-IN MANDIRI BERHASIL!</div>
              <div className="text-5xl font-extrabold text-cyan-300 py-2">{kioskCheckedIn.queueNumber}</div>
              <div className="text-slate-300">{kioskCheckedIn.polyName}</div>
              <button
                onClick={() => setKioskCheckedIn(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                Kembali ke Beranda Kiosk
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
