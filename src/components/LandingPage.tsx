/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  Bot,
  Stethoscope,
  Scissors,
  Pill,
  CreditCard,
  CheckCircle2,
  TrendingUp,
  Clock,
  Users,
  Globe,
  ArrowRight,
  Shield,
  FileText,
  PhoneCall,
  BarChart3,
  Award,
  ChevronRight,
  Play,
  KeyRound,
  LogIn,
  Sliders,
  HeartPulse,
  Database,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { OnlineAndWhatsappRegModal } from './OnlineAndWhatsappRegModal';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenLogin }) => {
  const { login } = useAuth();

  // Registration Modal State
  const [showRegModal, setShowRegModal] = useState(false);
  const [regModalTab, setRegModalTab] = useState<'online' | 'whatsapp'>('online');

  // ROI Calculator State
  const [bedCount, setBedCount] = useState<number>(250);
  const [outpatientCount, setOutpatientCount] = useState<number>(600);

  // Pricing State
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  // Calculated ROI
  const estimatedAnnualSavings = (bedCount * 4.2 + outpatientCount * 1.5).toFixed(1);
  const timeSavedMinutes = Math.min(165, Math.round(120 + (outpatientCount / 20)));

  const handleRoleQuickLogin = (role: UserRole, email: string) => {
    login(email, role);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* Top Floating Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-2.5 shadow-xl shadow-cyan-500/20">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white">
                SMART MEDIKA <span className="text-cyan-400">AI HOSPITAL</span>
              </span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                v2026 Enterprise
              </span>
            </div>
            <p className="text-[11px] text-slate-400">SIMRS Digital & Ekosistem AI Kesehatan Terpadu</p>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition">Fitur Utama AI</a>
          <a href="#roi-calculator" className="hover:text-cyan-400 transition">Kalkulator ROI</a>
          <a href="#role-demo" className="hover:text-cyan-400 transition">Demo Role Akses</a>
          <a href="#satusehat" className="hover:text-cyan-400 transition">Integrasi SATUSEHAT</a>
          <a href="#pricing" className="hover:text-cyan-400 transition">Paket Layanan</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition"
          >
            <LogIn className="h-3.5 w-3.5" />
            Menu Login
          </button>

          <button
            onClick={onEnterApp}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition animate-pulse"
          >
            <Sparkles className="h-4 w-4 text-cyan-200" />
            Masuk Aplikasi SIMRS
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-950/60 px-4 py-1.5 text-xs font-bold text-cyan-300 backdrop-blur-md shadow-lg shadow-cyan-500/10">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>PLATFORM SIMRS DIGITAL #1 DI INDONESIA — FULL AGENTIC AI & SATUSEHAT KEMENKES</span>
            <span className="rounded-full bg-cyan-400 text-slate-950 px-2 py-0.2 text-[10px] font-extrabold">NEW</span>
          </div>

          {/* High Impact High-CTR Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] max-w-5xl mx-auto">
            Revolusi Digital Rumah Sakit Masa Depan: <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Kurangi Antrian 85%, Hemat Operational Cost 40%, Zero Klaim BPJS Pending!
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Sistem Informasi Manajemen Rumah Sakit (SIMRS) Enterprise Tercanggih Berbasis <strong className="text-cyan-300 font-semibold">Autonomous CDSS AI</strong>, <strong className="text-cyan-300 font-semibold">Voice EMR</strong>, <strong className="text-cyan-300 font-semibold">Smart ICU Real-Time</strong>, Interoperabilitas FHIR <strong className="text-cyan-300 font-semibold">SATUSEHAT Kemenkes RI</strong>, & Bridging V-Claim BPJS Health 2.0.
          </p>

          {/* Dual CTAs & Patient Self-Registration Options */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-7 py-3.5 text-sm font-extrabold text-white shadow-2xl shadow-cyan-500/30 hover:scale-105 transition group"
            >
              <Zap className="h-5 w-5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Buka Aplikasi SIMRS Utama</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                setRegModalTab('online');
                setShowRegModal(true);
              }}
              className="flex items-center gap-2 rounded-2xl border border-cyan-500/50 bg-cyan-950/80 px-6 py-3.5 text-sm font-bold text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition shadow-xl"
            >
              <Globe className="h-5 w-5" />
              <span>🌐 Daftar Pasien Online</span>
            </button>

            <button
              onClick={() => {
                setRegModalTab('whatsapp');
                setShowRegModal(true);
              }}
              className="flex items-center gap-2 rounded-2xl border border-emerald-500/50 bg-emerald-950/80 px-6 py-3.5 text-sm font-bold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition shadow-xl"
            >
              <MessageSquare className="h-5 w-5" />
              <span>💬 Daftar via WhatsApp</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-sm font-bold text-slate-200 hover:border-cyan-400 hover:bg-slate-800 transition shadow-xl"
            >
              <KeyRound className="h-5 w-5 text-cyan-400" />
              <span>Login Multi-Role</span>
            </button>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto pt-8">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center shadow-xl backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">85%</div>
              <div className="text-xs text-slate-400 mt-1">Pemangkasan Waktu Antrian Pasien</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center shadow-xl backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">0%</div>
              <div className="text-xs text-slate-400 mt-1">Pending Berkas Klaim BPJS</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center shadow-xl backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">3 Detik</div>
              <div className="text-xs text-slate-400 mt-1">Pengisian CPPT EMR via Voice AI</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-center shadow-xl backdrop-blur-sm">
              <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">120+</div>
              <div className="text-xs text-slate-400 mt-1">RSUP / RSUD & Klinik Terintegrasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* HIGH CTR FEATURE HIGHLIGHTS */}
      <section id="features" className="py-16 px-4 sm:px-8 lg:px-12 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
              EKOSISTEM MODUL TERLENGKAP & TERCANGGIH
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Mengapa Rumah Sakit Terbaik Beralih ke SIMRS Digital AI?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Dirancang khusus untuk standar pelayanan medis tingkat lanjut, memadukan efisiensi operasional dengan keselamatan pasien.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-cyan-500/50 hover:shadow-2xl transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                Autonomous CDSS AI & Voice EMR
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dokter cukup berbicara 10 detik. AI secara otomatis mengonversi suara menjadi teks CPPT, merekomendasikan resep obat, & mengunci diagnosis ICD-10 dengan presisi 99.8%.
              </p>
              <div className="pt-2 text-xs text-cyan-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Coba Fitur CDSS AI</span> →
              </div>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-rose-500/50 hover:shadow-2xl transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 group-hover:scale-110 transition-transform">
                <HeartPulse className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition">
                AI Triage & Predictive ICU Sentinel
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Algoritma EWS (Early Warning System) AI menganalisis gelombang EKG, SpO2, & MAP real-time, mendeteksi potensi Cardiac Arrest & Sepsis 4 jam sebelum terjadi.
              </p>
              <div className="pt-2 text-xs text-rose-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Lihat ICU Sentinel Monitor</span> →
              </div>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-emerald-500/50 hover:shadow-2xl transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                BPJS V-Claim 2.0 & Auto Billing RCM
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verifikasi SEP otomatis, bridging V-Claim BPJS Health tanpa pending berkas. Proses klaim dana cair 28 hari lebih cepat tanpa hambatan birokrasi manual.
              </p>
              <div className="pt-2 text-xs text-emerald-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Cek Simulator V-Claim BPJS</span> →
              </div>
            </div>

            {/* Feature 4 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-indigo-500/50 hover:shadow-2xl transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">
                100% FHIR SATUSEHAT Kemenkes RI
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bridging API resmi SATUSEHAT Kemenkes untuk data Encounter, Condition, DiagnosticReport, MedicationRequest, & Observation secara real-time.
              </p>
              <div className="pt-2 text-xs text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Status Koneksi FHIR</span> →
              </div>
            </div>

            {/* Feature 5 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-amber-500/50 hover:shadow-2xl transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                <Pill className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition">
                Smart FEFO Pharmacy & Multi-Gudang
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manajemen stok obat otomatis berbasis First-Expired-First-Out (FEFO), mencegah kebocoran obat, obat kadaluarsa, & terhubung ke depo farmasi.
              </p>
              <div className="pt-2 text-xs text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Kelola Depo Obat</span> →
              </div>
            </div>

            {/* Feature 6 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4 hover:border-teal-500/50 hover:shadow-2xl transition group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">
                Executive BI & AI Command Center
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dashboard eksekutif real-time untuk Direksi Utama. Pantau Bed Occupancy Rate (BOR), Length of Stay (LOS), Turnaround Time (TAT), & Arus Kas RS.
              </p>
              <div className="pt-2 text-xs text-teal-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Buka Command Center</span> →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI CALCULATOR */}
      <section id="roi-calculator" className="py-16 px-4 sm:px-8 lg:px-12 bg-slate-900/60 border-t border-slate-800">
        <div className="max-w-5xl mx-auto rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
              SIMULATOR EFISIENSI RUMAH SAKIT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hitung Estimasi Penghematan Biaya & Waktu RS Anda
            </h2>
            <p className="text-xs text-slate-400">
              Geser parameter di bawah ini untuk melihat potensi ROI Rumah Sakit Anda setelah mengadopsi SIMRS Digital AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Controls */}
            <div className="space-y-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Jumlah Tempat Tidur (Bed Capacity):</span>
                  <span className="text-cyan-400 font-mono text-sm">{bedCount} Beds</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="10"
                  value={bedCount}
                  onChange={(e) => setBedCount(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-300">Jumlah Pasien Rawat Jalan / Hari:</span>
                  <span className="text-cyan-400 font-mono text-sm">{outpatientCount} Pasien</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={outpatientCount}
                  onChange={(e) => setOutpatientCount(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="space-y-4 bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 p-6 rounded-2xl border border-cyan-500/30 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                ESTIMASI DUKUNGAN BIAYA & EFISIENSI TAHUNAN
              </span>

              <div className="text-3xl sm:text-4xl font-black text-cyan-300 font-mono">
                Rp {estimatedAnnualSavings} Miliar / Tahun
              </div>
              <p className="text-xs text-slate-400">
                Dihemat dari efisiensi kertas (paperless), klaim BPJS zero-loss, & optimasi stok obat FEFO.
              </p>

              <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">WAKTU TUNGGU PASIEN:</span>
                  <span className="font-bold text-emerald-400 text-sm font-mono">Turun {timeSavedMinutes} Menit</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">VERIFIKASI BPJS:</span>
                  <span className="font-bold text-cyan-400 text-sm font-mono">Real-Time Instant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE-BASED QUICK DEMO ACCESS GRID */}
      <section id="role-demo" className="py-16 px-4 sm:px-8 lg:px-12 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-500/30">
              UJI COBA DEMO MULTI-ROLE (ONE-CLICK LOGIN)
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Pilih Role Akses Anda untuk Mencoba SIMRS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Klik salah satu role di bawah ini untuk langsung masuk ke dalam tampilan aplikasi SIMRS yang sesuai dengan tanggung jawab Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Role 1 */}
            <button
              onClick={() => handleRoleQuickLogin('Direktur', 'direktur.hendra@smartmedika.go.id')}
              className="text-left rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-cyan-500 hover:bg-slate-900 transition space-y-3 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  Direksi & Management
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white text-base">Direktur Utama (CEO)</h3>
              <p className="text-xs text-slate-400">
                Akses Executive BI, Command Center Real-Time, Laporan Keuangan, & AI Decision Support.
              </p>
              <div className="text-[11px] text-cyan-400 font-semibold pt-1">
                Login Instant Sebagai Direktur →
              </div>
            </button>

            {/* Role 2 */}
            <button
              onClick={() => handleRoleQuickLogin('Dokter Spesialis', 'dr.spesialis@smartmedika.go.id')}
              className="text-left rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-indigo-500 hover:bg-slate-900 transition space-y-3 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                  Pelayanan Medis
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white text-base">Dokter Spesialis / DPJP</h3>
              <p className="text-xs text-slate-400">
                Akses CDSS AI, Voice EMR CPPT, Order Clinical Orders, Lab LIS, & Radiologi PACS.
              </p>
              <div className="text-[11px] text-indigo-400 font-semibold pt-1">
                Login Instant Sebagai Dokter DPJP →
              </div>
            </button>

            {/* Role 3 */}
            <button
              onClick={() => handleRoleQuickLogin('Perawat', 'nurse.kepala@smartmedika.go.id')}
              className="text-left rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-emerald-500 hover:bg-slate-900 transition space-y-3 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Keperawatan
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white text-base">Perawat Nurse Station</h3>
              <p className="text-xs text-slate-400">
                Akses Bed Management Rawat Inap, EWS Vital Signs, Pendaftaran Rawat Jalan, & Antrian.
              </p>
              <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                Login Instant Sebagai Perawat →
              </div>
            </button>

            {/* Role 4 */}
            <button
              onClick={() => handleRoleQuickLogin('Farmasi', 'apt.farmasi@smartmedika.go.id')}
              className="text-left rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-amber-500 hover:bg-slate-900 transition space-y-3 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                  Kefarmasian
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white text-base">Kepala Depo Farmasi & Apoteker</h3>
              <p className="text-xs text-slate-400">
                Akses Dispensing Obat FEFO, e-Prescription, Multi-Gudang Logistik, & Interaksi Obat.
              </p>
              <div className="text-[11px] text-amber-400 font-semibold pt-1">
                Login Instant Sebagai Apoteker →
              </div>
            </button>

            {/* Role 5 */}
            <button
              onClick={() => handleRoleQuickLogin('Keuangan', 'finance.manager@smartmedika.go.id')}
              className="text-left rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-rose-500 hover:bg-slate-900 transition space-y-3 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-300 border border-rose-500/30">
                  Financial & Claims
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-rose-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white text-base">Manajer Billing & BPJS V-Claim</h3>
              <p className="text-xs text-slate-400">
                Akses Revenue Cycle Management (RCM), Verifikasi SEP BPJS, Invoice, & Kasir.
              </p>
              <div className="text-[11px] text-rose-400 font-semibold pt-1">
                Login Instant Sebagai Finance →
              </div>
            </button>

            {/* Role 6 */}
            <button
              onClick={() => handleRoleQuickLogin('Super Admin', 'admin.it@smartmedika.go.id')}
              className="text-left rounded-2xl border border-slate-800 bg-slate-900/90 p-5 hover:border-teal-500 hover:bg-slate-900 transition space-y-3 shadow-xl group"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-xl bg-teal-500/20 px-3 py-1 text-xs font-bold text-teal-300 border border-teal-500/30">
                  IT Administrator
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-white text-base">Super Admin IT RS</h3>
              <p className="text-xs text-slate-400">
                Akses Master Data ICD-10, Konfigurasi SATUSEHAT, User Roles RBAC, & Audit Logs SIEM.
              </p>
              <div className="text-[11px] text-teal-400 font-semibold pt-1">
                Login Instant Sebagai Admin IT →
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* PAKET LAYANAN & PRICING SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-8 lg:px-12 bg-slate-900/80 border-t border-slate-800 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/80 px-4 py-1.5 rounded-full border border-cyan-500/30">
              PAKET LAYANAN & LISENSI ENTERPRISE SIMRS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Pilihan Paket Implementasi Sesuai Skala Rumah Sakit & Faskes Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Investasi transparan tanpa biaya tersembunyi. Termasuk pembaruan regulasi Kemenkes SATUSEHAT, pemeliharaan sistem, & keamanan standar medis.
            </p>

            {/* Billing Toggle Switch */}
            <div className="flex items-center justify-center gap-3 pt-4">
              <span className={`text-xs font-bold transition ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                Tagihan Bulanan
              </span>

              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="relative inline-flex h-7 w-14 items-center rounded-full bg-slate-800 p-1 border border-slate-700 transition-colors focus:outline-none"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-cyan-400 transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-7 bg-emerald-400' : 'translate-x-0'
                  }`}
                />
              </button>

              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold transition ${billingCycle === 'yearly' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  Tagihan Tahunan
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300 border border-emerald-500/30">
                  HEMAT 20%
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Plan 1: Klinik & Faskes Pratama */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 flex flex-col justify-between space-y-6 hover:border-slate-700 transition shadow-2xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-slate-800 px-3 py-1 text-xs font-bold text-slate-300">
                    Faskes Pratama / Klinik
                  </span>
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>

                <h3 className="text-xl font-bold text-white">Paket Klinik & RS Pratama</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Solusi ideal untuk Klinik Pratama, Klinik Utama, RS Tipe D, & Puskesmas rawat inap skala kecil.
                </p>

                <div className="py-2 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-white">
                      Rp {billingCycle === 'yearly' ? '3,600,000' : '4,500,000'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ bulan</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <span className="text-[11px] text-emerald-400 font-medium block mt-1">
                      Ditagih Rp 43.2 Juta / tahun (Hemat Rp 10.8 Juta)
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Cakupan Fitur Termasuk:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Kapasitas s.d 30 Bed & Pasien Rawat Jalan Unlimited</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>SIMRS Core (Pendaftaran, Poliklinik, Kasir, Depo Obat)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Rekam Medis Elektronik (RME) Permenkes No. 24/2022</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Bridging SATUSEHAT Kemenkes (Encounter & Condition)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Manajemen Stok Obat FEFO & e-Prescription</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Dukungan Teknis Hotline Email & WA (08:00 - 17:00)</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 text-xs font-bold text-slate-200 hover:border-cyan-500 hover:text-cyan-300 transition"
              >
                Coba Demo Paket Pratama
              </button>
            </div>

            {/* Plan 2: RSUD / RS Swasta Tipe C & B (RECOMMENDED) */}
            <div className="rounded-3xl border-2 border-cyan-500 bg-slate-950 p-8 flex flex-col justify-between space-y-6 shadow-2xl shadow-cyan-500/20 relative scale-105 z-10">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 px-4 py-1 text-[11px] font-black text-white shadow-lg tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                PALING POPULER & TERLENGKAP
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                    RSUD / RS Tipe C & B
                  </span>
                  <Bot className="h-5 w-5 text-cyan-400" />
                </div>

                <h3 className="text-xl font-black text-white">Paket Enterprise AI Hospital</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Paket terpopuler untuk RSUD & RS Swasta yang menginginkan integrasi penuh CDSS AI, BPJS V-Claim, & SATUSEHAT FHIR.
                </p>

                <div className="py-2 border-y border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-cyan-300">
                      Rp {billingCycle === 'yearly' ? '14,800,000' : '18,500,000'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">/ bulan</span>
                  </div>
                  {billingCycle === 'yearly' && (
                    <span className="text-[11px] text-emerald-400 font-bold block mt-1">
                      Ditagih Rp 177.6 Juta / tahun (Hemat Rp 44.4 Juta)
                    </span>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                    Semua Fitur Pratama Plus:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-white">Kapasitas s.d 300 Bed & Multi Nurse Station</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-cyan-200">Autonomous CDSS AI & Voice EMR CPPT Scribe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="font-semibold text-white">Bridging V-Claim BPJS Health 2.0 (Zero Pending SEP)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Full SATUSEHAT FHIR R4 (Encounter, Condition, Lab, PACS)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Predictive ICU Sentinel (EWS Vital Signs Monitoring)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Executive BI Command Center & Real-Time BOR/LOS Analytics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>Pendampingan Migrasi Data On-Site & SLA Support 24/7</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-3.5 text-xs font-black text-white shadow-xl shadow-cyan-500/25 hover:from-cyan-400 hover:to-indigo-500 transition animate-pulse"
              >
                Buka Demo Paket Enterprise AI Sekarang →
              </button>
            </div>

            {/* Plan 3: RSUP & Holding Multi-Hospital */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 flex flex-col justify-between space-y-6 hover:border-indigo-500/50 transition shadow-2xl relative">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-xl bg-indigo-500/20 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                    RSUP / Holding Group
                  </span>
                  <Globe className="h-5 w-5 text-indigo-400" />
                </div>

                <h3 className="text-xl font-bold text-white">Paket RSUP & Holding Group</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Arsitektur Multi-Tenant, Private Cloud / On-Premise Hybrid untuk RSUP Kemenkes, RS Tipe A, & Holding RS BUMN/Swasta.
                </p>

                <div className="py-2 border-y border-slate-800/80">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-indigo-300">
                      Custom / Tailored
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium block mt-1">
                    Disesuaikan dengan jumlah cabang RS & infrastruktur server
                  </span>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Fasilitas Khusus Holding:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Kapasitas Bed & Pengguna Multi-Cabang Tanpa Batas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Dedicated AI Agent Model Training dengan Data Medis Internal RS</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Opsi Opsi Private Cloud / Dedicated On-Premise Server</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Sertifikasi ISO 27001, Disaster Recovery (DRC) Dual Active</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Custom Interoperabilitas Legacy HIS / SAP / Oracle ERP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span>Dedicated Senior Technical Account Manager & SLA 99.99%</span>
                    </li>
                  </ul>
                </div>
              </div>

              <button
                onClick={onEnterApp}
                className="w-full rounded-xl border border-indigo-500/50 bg-indigo-950/50 py-3 text-xs font-bold text-indigo-200 hover:bg-indigo-900/80 transition"
              >
                Konsultasi Paket Holding & Custom
              </button>
            </div>
          </div>

          {/* Included Guarantees & Features Bar */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
            <div className="space-y-1">
              <ShieldCheck className="h-5 w-5 text-emerald-400 mx-auto" />
              <div className="font-bold text-white">Jaminan Regulasi 100%</div>
              <div className="text-[11px] text-slate-400">Selalu terupdate dengan Permenkes & SATUSEHAT</div>
            </div>

            <div className="space-y-1">
              <Zap className="h-5 w-5 text-amber-400 mx-auto" />
              <div className="font-bold text-white">Implementasi Cepat 14 Hari</div>
              <div className="text-[11px] text-slate-400">Migrasi data otomatis tanpa mengganggu operasional</div>
            </div>

            <div className="space-y-1">
              <Database className="h-5 w-5 text-cyan-400 mx-auto" />
              <div className="font-bold text-white">Cloud Backup Otomatis</div>
              <div className="text-[11px] text-slate-400">Enkripsi AES-256 bit & backup berkala setiap jam</div>
            </div>

            <div className="space-y-1">
              <Users className="h-5 w-5 text-indigo-400 mx-auto" />
              <div className="font-bold text-white">Pelatihan SDM Lengkap</div>
              <div className="text-[11px] text-slate-400">Sertifikasi modul untuk dokter, perawat, & staf kasir</div>
            </div>
          </div>
        </div>
      </section>

      {/* SATUSEHAT & COMPLIANCE BADGES */}
      <section id="satusehat" className="py-12 px-4 sm:px-8 border-t border-slate-900 bg-slate-900/40">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Standar Keamanan & Regulasi Nasional Terverifikasi
            </h3>
            <p className="text-xs text-slate-400">
              Sesuai dengan Permenkes No. 24 Tahun 2022 Rekam Medis Elektronik & Kebijakan SATUSEHAT Kemenkes RI.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-1.5">
              <Database className="h-4 w-4 text-cyan-400" /> SATUSEHAT FHIR R4
            </div>
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-400" /> ISO 27001 Security
            </div>
            <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-400" /> BPJS V-Claim Certified
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cyan-400" />
            <span className="font-bold text-white">SMART MEDIKA AI HOSPITAL PLATFORM</span>
            <span className="text-slate-600">|</span>
            <span>© 2026 PT Smart Medika Digital Indonesia. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenLogin} className="hover:text-cyan-400 transition">Portal Login</button>
            <button onClick={onEnterApp} className="text-cyan-400 font-bold hover:underline">Masuk Dashboard App →</button>
          </div>
        </div>
      </footer>

      {/* ONLINE & WHATSAPP REGISTRATION MODAL */}
      <OnlineAndWhatsappRegModal
        isOpen={showRegModal}
        onClose={() => setShowRegModal(false)}
        defaultTab={regModalTab}
      />
    </div>
  );
};
