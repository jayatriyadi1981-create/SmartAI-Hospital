import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BarChart3,
  Bot,
  Sparkles,
  Send,
  Building2,
  BedDouble,
  Activity,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Users,
  Download,
  FileText,
  CheckCircle2,
  Zap,
  Award,
  AlertTriangle,
  Pill,
  RefreshCw,
  Calendar,
  Printer,
  Share2,
  Stethoscope,
  ChevronRight,
  ShieldCheck,
  TrendingDown,
  Layers,
  Sparkle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { MOCK_EXECUTIVE_BI } from '../data/mockData';
import { ExecutiveBIReport } from '../types';

// Mock Extended Data for Executive BI
const REVENUE_TREND_DATA = [
  { month: 'Jan', revenue: 34.2, expense: 24.1, profit: 10.1, bpjsClaim: 14.5 },
  { month: 'Feb', revenue: 36.5, expense: 25.0, profit: 11.5, bpjsClaim: 15.2 },
  { month: 'Mar', revenue: 38.0, expense: 26.2, profit: 11.8, bpjsClaim: 16.0 },
  { month: 'Apr', revenue: 39.8, expense: 27.5, profit: 12.3, bpjsClaim: 16.8 },
  { month: 'Mei', revenue: 41.2, expense: 28.1, profit: 13.1, bpjsClaim: 17.5 },
  { month: 'Jun', revenue: 40.5, expense: 28.0, profit: 12.5, bpjsClaim: 17.0 },
  { month: 'Jul', revenue: 42.8, expense: 29.4, profit: 13.4, bpjsClaim: 18.2 },
  { month: 'Agt (Forecast)', revenue: 45.2, expense: 30.1, profit: 15.1, bpjsClaim: 19.1 },
];

const UNIT_REVENUE_PIE = [
  { name: 'Rawat Inap & ICU', value: 42, color: '#0ea5e9' },
  { name: 'Poliklinik Rawat Jalan', value: 26, color: '#10b981' },
  { name: 'Kamar Operasi (OK)', value: 14, color: '#8b5cf6' },
  { name: 'Radiologi & Imaging', value: 9, color: '#f59e0b' },
  { name: 'Instalasi Farmasi', value: 6, color: '#ec4899' },
  { name: 'Laboratorium & PA', value: 3, color: '#06b6d4' },
];

const PAYER_MIX_DATA = [
  { name: 'BPJS Kesehatan', sharePct: 58, revenueM: 24.8, status: 'Stable Claims' },
  { name: 'Asuransi Swasta & Admedika', sharePct: 22, revenueM: 9.4, status: 'Fast Settlement' },
  { name: 'Pasien Umum / Self-Pay', sharePct: 15, revenueM: 6.4, status: 'Immediate Cash' },
  { name: 'Corporate MCU & Kemitraan', sharePct: 5, revenueM: 2.2, status: 'B2B Contract' },
];

const TOP_DOCTORS_PERFORMANCE = [
  { name: 'dr. Budi Hartono, Sp.PD-KGEH', specialty: 'Penyakit Dalam', outpatient: 342, surgeries: 48, revenueM: 57.5, satisfactionPct: 98.5 },
  { name: 'dr. Hendra Setiawan, Sp.JP(K)', specialty: 'Jantung & Pembuluh Darah', outpatient: 290, surgeries: 36, revenueM: 64.2, satisfactionPct: 99.1 },
  { name: 'dr. Ratna Dewi, Sp.OG(K)', specialty: 'Obgyn & Fetomaternal', outpatient: 310, surgeries: 42, revenueM: 48.0, satisfactionPct: 97.8 },
  { name: 'dr. Ahmad Subagyo, Sp.OT(K)', specialty: 'Bedah Tulang (Ortopedi)', outpatient: 220, surgeries: 54, revenueM: 52.8, satisfactionPct: 98.2 },
  { name: 'dr. Maya Indah, Sp.A(K)', specialty: 'Kesehatan Anak', outpatient: 380, surgeries: 12, revenueM: 32.4, satisfactionPct: 99.4 },
];

const BARBER_INDICATORS = [
  { name: 'BOR (Bed Occupancy Rate)', current: 86.4, standardMin: 75, standardMax: 85, unit: '%', status: 'Sangat Efisien (Tinggi)', statusColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/40' },
  { name: 'LOS (Length of Stay)', current: 3.6, standardMin: 3, standardMax: 12, unit: 'Hari', status: 'Sangat Baik (Fast Recovery)', statusColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/40' },
  { name: 'TOI (Turn Over Interval)', current: 1.1, standardMin: 1, standardMax: 3, unit: 'Hari', status: 'Turnaround Cepat', statusColor: 'text-indigo-400 bg-indigo-950/40 border-indigo-500/40' },
  { name: 'BTO (Bed Turn Over)', current: 4.8, standardMin: 4, standardMax: 5, unit: 'x / bed / bln', status: 'Optimasi Tinggi', statusColor: 'text-purple-400 bg-purple-950/40 border-purple-500/40' },
];

const FRAUD_PREVENTION_AUDITS = [
  { id: 'FR-101', title: 'Verifikasi Kode INA-CBG Diabetes dengan Komplikasi (ICD-10 E11.2)', severity: 'Rendah Risk', status: 'Clean Pass', valueSaved: 'Rp 42.000.000', note: 'AI tidak menemukan indikasi upcoding billing.' },
  { id: 'FR-102', title: 'Deteksi Unbilled Lab Services pada Pasien ICU Bed 03', severity: 'Sedang Risk', status: 'Auto Corrected', valueSaved: 'Rp 18.500.000', note: 'Item pemeriksaan AGD & Elektrolit terintegrasi ke billing final.' },
  { id: 'FR-103', title: 'Deteksi Duplicate Prescription Dispense pada Farmasi Rawat Jalan', severity: 'Kritis Risk', status: 'Blocked by AI', valueSaved: 'Rp 8.200.000', note: 'Ganda resep Amlodipine & Candesartan berhasil dicegah.' },
];

export const ExecutiveBIView: React.FC = () => {
  const [biReport] = useState<ExecutiveBIReport>(MOCK_EXECUTIVE_BI);
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'operations' | 'doctors' | 'pharmacy_inv' | 'fraud_audit' | 'board_export'>('overview');

  // Timeframe filter
  const [timeframe, setTimeframe] = useState<'this_month' | 'last_month' | 'q3_2026' | 'ytd'>('this_month');

  // Natural Language Executive Assistant Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; dataVisual?: string; timestamp?: string }>>([
    {
      sender: 'ai',
      text: 'Halo Bapak/Ibu Direksi! Saya AI Executive Business Assistant RS. Anda dapat menanyakan omzet, BOR, klaim BPJS, dokter produktif, hingga proyeksi keuangan bulan depan menggunakan bahasa sehari-hari.',
      timestamp: '08:00',
      dataVisual: '📊 Executive Summary Ready: Revenue Rp 42.8M (+12.4% MoM) | BOR 86.4% | Net Margin 31.3%'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Export State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleSendQuery = (customQ?: string) => {
    const query = customQ || inputQuery;
    if (!query.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsgs = [...chatMessages, { sender: 'user' as const, text: query, timestamp: currentTime }];
    setChatMessages(newMsgs);
    if (!customQ) setInputQuery('');
    setIsAiLoading(true);

    // AI Intelligence Query Processor
    setTimeout(() => {
      let aiAns = '';
      let vis = '';

      const lower = query.toLowerCase();
      if (lower.includes('omzet') || lower.includes('pendapatan') || lower.includes('revenue')) {
        aiAns = `Total omzet pendapatan RS bulan Juli 2026 tercatat **Rp 42.800.000.000** (+12.4% MoM). Unit Rawat Inap & ICU menyumbang kontribusi terbesar yaitu 42% (Rp 18.0 Miliar), disusul Poliklinik Rawat Jalan 26% (Rp 11.1 Miliar). Net profit margin bersih mencapai 31.3% (Rp 13.4 Miliar).`;
        vis = '📊 Revenue breakdown: Rawat Inap (42%), Poliklinik (26%), Kamar Operasi (14%), Radiologi (9%), Farmasi (6%), Lab (3%).';
      } else if (lower.includes('dokter') || lower.includes('produktif') || lower.includes('spesialis')) {
        aiAns = `Dokter paling produktif bulan ini berdasarkan kombinasi volume pasien dan pendapatan adalah **dr. Budi Hartono, Sp.PD-KGEH** (342 pasien outpatient, 48 endoskopi, Rp 57.5M revenue, satisfaction 98.5%) dan **dr. Hendra Setiawan, Sp.JP(K)** (290 pasien, Rp 64.2M revenue).`;
        vis = '🏆 Dokter Tertinggi: 1. dr. Hendra Setiawan (Rp 64.2M) | 2. dr. Budi Hartono (Rp 57.5M)';
      } else if (lower.includes('obat') || lower.includes('laris') || lower.includes('farmasi')) {
        aiAns = `Obat kategori Fast-Moving terlaris adalah **Ceftriaxone Inj 1 Gram** (480 vial/bulan) dan **Metformin 500 mg** (3.500 tab/bulan). Stok Amlodipine 10mg terdeteksi kritis (<120 tab), AI telah otomatis menerbitkan draft Purchase Request.`;
        vis = '💊 Fast Moving: Ceftriaxone & Metformin | Alert Restock: Amlodipine 10mg (3 hari sisa)';
      } else if (lower.includes('bpjs') || lower.includes('klaim') || lower.includes('sep')) {
        aiAns = `Total klaim BPJS Kesehatan pending verifikasi saat ini sebesar **Rp 3.200.000.000** (218 SEP). Tingkat risiko penolakan klaim (Rejection Risk) tergolong sangat rendah (1.8%), dengan potensi penyelamatan pendapatan dari pencegahan error coding sebesar Rp 68.700.000.`;
        vis = '🛡️ Status BPJS: Total Pending Rp 3.2 M | Risk Score: Low Risk (98.2% Clean Claims)';
      } else if (lower.includes('unit') || lower.includes('untung') || lower.includes('profit center')) {
        aiAns = `Profit Center paling menguntungkan adalah **Kamar Operasi (OK) & Radiologi Advanced (MRI 3.0T / CT Scan 128 Slice)** dengan Operating Margin mencapai 42.8%. Poliklinik Gigi & Spesialis Jantung menunjukkan pertumbuhan kunjungan tertinggi (+18.2% YoY).`;
        vis = '🏢 Top Profit Center: Kamar Operasi (42.8% Margin) & Radiologi Advanced (38.5% Margin)';
      } else if (lower.includes('prediksi') || lower.includes('bulan depan') || lower.includes('forecast')) {
        aiAns = `Berdasarkan Machine Learning Predictive Engine, proyeksi omzet bulan Agustus 2026 diperkirakan mencapai **Rp 45.200.000.000** (+5.6%). Indikator BOR diperkirakan stabil pada 87.2%, dan cash flow balance diproyeksikan bertambah menjadi Rp 21.1 Miliar.`;
        vis = '📈 Next Month Forecast: Revenue Rp 45.2 M | Net Margin Rp 15.1 M | BOR 87.2%';
      } else if (lower.includes('bor') || lower.includes('efisiensi') || lower.includes('barber')) {
        aiAns = `Indikator Barber Efisiensi RS: **BOR 86.4%** (Efisien), **LOS 3.6 Hari** (Pemulihan Cepat), **TOI 1.1 Hari** (Turnaround Cepat), dan **BTO 4.8x**. Rumah sakit berada pada kondisi operasional optimal standar Kemenkes RI.`;
        vis = '🛏️ Barber Matrix: BOR 86.4% | LOS 3.6d | TOI 1.1d | BTO 4.8x';
      } else {
        aiAns = `Ringkasan Posisi Eksekutif Realtime: Likuiditas Cash Balance sebesar **Rp 18.5 Miliar**, BOR Inpatient **86.4%**, Total Pasien Aktif Rawat Inap **342 Pasien**, dan Revenue Leakage Prevention Index mencapai **98.8%**. Rumah sakit sehat secara finansial dan operasional.`;
        vis = '🌐 Status RS: Highly Solvent & Financially Sound | Cash Balance Rp 18.5 M';
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiAns, dataVisual: vis, timestamp: currentTime }
      ]);
      setIsAiLoading(false);
    }, 500);
  };

  const triggerExport = () => {
    setExportModalOpen(true);
    setTimeout(() => {
      setExportSuccess(true);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 p-6 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 text-cyan-400 border border-cyan-500/40 shadow-inner">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-100">Executive BI & C-Level Control Center</h1>
                <span className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-0.5 text-xs font-bold text-slate-950 shadow">
                  Executive 10.0
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300 max-w-2xl">
                Dashboard Intelijen Bisnis Direksi: Realtime Financial Analytics, Indikator Efisiensi Barber (BOR, LOS, TOI, BTO), Natural Language AI Query, Fraud Audit & Board Deck Reporting.
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs font-medium text-slate-200 focus:border-cyan-500 focus:outline-none"
            >
              <option value="this_month">Bulan Ini (Juli 2026)</option>
              <option value="last_month">Bulan Lalu (Juni 2026)</option>
              <option value="q3_2026">Triwulan Q3 2026</option>
              <option value="ytd">Tahun Berjalan (YTD 2026)</option>
            </select>

            <button
              onClick={triggerExport}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition shadow-lg"
            >
              <Download className="h-4 w-4" /> Export Board Deck
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-800/80 pt-4">
          {[
            { id: 'overview', label: 'Ringkasan & AI NLQ', icon: Bot },
            { id: 'financials', label: 'Keuangan & Revenue', icon: DollarSign },
            { id: 'operations', label: 'Indikator Barber & BOR', icon: Activity },
            { id: 'doctors', label: 'Produktivitas Dokter', icon: Stethoscope },
            { id: 'pharmacy_inv', label: 'Keuangan Farmasi', icon: Pill },
            { id: 'fraud_audit', label: 'Fraud & Audit Billing', icon: ShieldAlert },
            { id: 'board_export', label: 'Board Deck Report', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Top KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 hover:border-cyan-500/40 transition">
          <span className="text-slate-400 text-[11px] block font-medium">Pendapatan Kotor:</span>
          <div className="text-lg font-bold text-emerald-400">Rp {(biReport.monthlyRevenue / 1000000000).toFixed(1)} M</div>
          <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-0.5">
            <ArrowUpRight className="h-3 w-3" /> +12.4% MoM
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 hover:border-cyan-500/40 transition">
          <span className="text-slate-400 text-[11px] block font-medium">Laba Bersih (Net Profit):</span>
          <div className="text-lg font-bold text-cyan-400">Rp {(biReport.netProfit / 1000000000).toFixed(1)} M</div>
          <span className="text-[10px] text-cyan-300 font-semibold">Margin 31.3%</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 hover:border-cyan-500/40 transition">
          <span className="text-slate-400 text-[11px] block font-medium">Likuiditas Cash:</span>
          <div className="text-lg font-bold text-indigo-400">Rp {(biReport.cashFlowBalance / 1000000000).toFixed(1)} M</div>
          <span className="text-[10px] text-slate-400">Escrow Bank Mandiri</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 hover:border-cyan-500/40 transition">
          <span className="text-slate-400 text-[11px] block font-medium">BOR (Bed Occupancy):</span>
          <div className="text-lg font-bold text-amber-400">{biReport.bedOccupancyRateBOR}%</div>
          <span className="text-[10px] text-amber-300 font-semibold">Standard Kemenkes</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 hover:border-cyan-500/40 transition">
          <span className="text-slate-400 text-[11px] block font-medium">Average LOS:</span>
          <div className="text-lg font-bold text-teal-400">{biReport.lengthOfStayLOS} Hari</div>
          <span className="text-[10px] text-slate-400">TOI: {biReport.turnOverIntervalTOI}d • BTO: {biReport.bedTurnOverBTO}x</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 hover:border-cyan-500/40 transition">
          <span className="text-slate-400 text-[11px] block font-medium">Pending BPJS SEP:</span>
          <div className="text-lg font-bold text-purple-400">Rp {(biReport.bpjsUnclaimedAmount / 1000000000).toFixed(1)} M</div>
          <span className="text-[10px] text-purple-300 font-semibold">218 SEP Claims</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-1 hover:border-cyan-500/40 transition">
          <span className="text-slate-400 text-[11px] block font-medium">Inpatients Aktif:</span>
          <div className="text-lg font-bold text-pink-400">{biReport.activeInpatients} Bed</div>
          <span className="text-[10px] text-pink-300 font-semibold">Terganti Teratur</span>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & AI NATURAL LANGUAGE QUERY */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Visual Highlights & Executive Strategic Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Revenue Trend Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-cyan-400" /> Tren Pendapatan, Beban & Laba Bersih (MoM 2026)
                  </h3>
                  <p className="text-xs text-slate-400">Perbandingan Revenue kotor vs Operating Expenses & Net Profit Margin (dalam Miliar Rupiah)</p>
                </div>
                <span className="rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  Forecast Q3 (+5.6%)
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px', color: '#f8fafc' }} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Area type="monotone" dataKey="revenue" name="Pendapatan (Miliar IDR)" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2} />
                    <Area type="monotone" dataKey="profit" name="Laba Bersih (Miliar IDR)" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                    <Line type="monotone" dataKey="expense" name="Beban Operasional" stroke="#f43f5e" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Strategic AI Bullet Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-cyan-950/40 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm">
                  <Sparkles className="h-4 w-4 text-cyan-400" /> Executive AI Strategic Highlights
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li><strong>Pertumbuhan Revenue:</strong> Naik +12.4% MoM dipicu oleh operasional Cathlab & MRI 3.0T.</li>
                  <li><strong>Efisiensi Bed (BOR 86.4%):</strong> Kapasitas VVIP & Kelas 1 terisi penuh, disarankan pembukaan 20 bed di Gedung Teratai Lantai 5.</li>
                  <li><strong>Resiko Fraud BPJS (Low):</strong> Model AI Audit berhasil menekan kebocoran piutang hingga 98.8%.</li>
                </ul>
              </div>

              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-emerald-950/40 p-4 space-y-3">
                <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Rekomendasi Tindakan Direksi
                </div>
                <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
                  <li><strong>E-Klaim Fast-Track:</strong> Eksekusi pengiriman 180 SEP clean claims ke BPJS minggu ini.</li>
                  <li><strong>Restock Amlodipine:</strong> Tanda tangani Purchase Approval senilai Rp 45M untuk stok farmasi.</li>
                  <li><strong>Inisiatif MCU Corporate:</strong> Perluas BTO paket MCU Executive ke PT Pertamina & BUMN.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI Executive Assistant Natural Language Query Sidebar */}
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5 space-y-4 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">AI Executive NLQ Assistant</h3>
                    <p className="text-[11px] text-slate-400">Bahasa Alami Intelijen Bisnis</p>
                  </div>
                </div>
                <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  Gemini 3.6
                </span>
              </div>

              {/* Quick Question Chips */}
              <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
                {[
                  'Berapa omzet bulan ini?',
                  'Dokter paling produktif?',
                  'Bagaimana BOR & Barber?',
                  'Berapa klaim BPJS pending?',
                  'Unit paling untung?',
                  'Prediksi omzet bulan depan?'
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendQuery(q)}
                    className="rounded-full bg-slate-800/80 px-2.5 py-1 text-slate-300 hover:bg-cyan-500 hover:text-slate-950 transition border border-slate-700/80 text-[11px]"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Message Chat Log */}
              <div className="mt-3 h-80 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-3 space-y-3 custom-scrollbar text-xs">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[90%] rounded-xl p-3 leading-relaxed text-xs ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-200 border border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1 opacity-75 text-[10px]">
                        <span>{msg.sender === 'user' ? 'Direksi' : 'AI Executive Assistant'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <div>{msg.text}</div>
                      {msg.dataVisual && (
                        <div className="mt-2 rounded-lg bg-slate-950 p-2 font-mono text-[11px] text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
                          <Sparkle className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                          <span>{msg.dataVisual}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="rounded-xl bg-slate-900 p-3 text-xs text-cyan-400 border border-slate-800 flex items-center gap-2">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Memproses query intelijen bisnis RS...
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Input Bar */}
            <div className="pt-2 flex items-center gap-2">
              <input
                type="text"
                placeholder="Ketik pertanyaan bisnis RS..."
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={() => handleSendQuery()}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FINANCIALS & REVENUE ENGINE */}
      {activeTab === 'financials' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Unit Revenue Share Pie Chart */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <PieIcon className="h-5 w-5 text-cyan-400" /> Kontribusi Pendapatan Per Unit Layanan (%)
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={UNIT_REVENUE_PIE}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    >
                      {UNIT_REVENUE_PIE.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payer Mix Distribution Table */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" /> Distribusi Pembayaran (Payer Mix)
              </h3>
              <div className="space-y-3">
                {PAYER_MIX_DATA.map((payer, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-slate-100">{payer.name}</div>
                      <div className="text-[11px] text-slate-400">{payer.status}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">Rp {payer.revenueM} M</div>
                      <div className="text-[10px] text-cyan-300 font-semibold">{payer.sharePct}% Total Share</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOSPITAL OPERATIONS & BARBER INDICATORS */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-400" /> Matriks Indikator Efisiensi Rawat Inap (Barber Diagram Kemenkes)
                </h3>
                <p className="text-xs text-slate-400">Standar Nasional Pengukuran Efisiensi Tempat Tidur Rumah Sakit</p>
              </div>
              <span className="rounded bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30">
                Status: Optimal
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {BARBER_INDICATORS.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                  <span className="text-xs font-medium text-slate-400">{item.name}</span>
                  <div className="text-2xl font-black text-slate-100">
                    {item.current} <span className="text-xs font-normal text-slate-400">{item.unit}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Standar Ideal: {item.standardMin} - {item.standardMax} {item.unit}
                  </div>
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CLINICAL & PHYSICIAN PRODUCTIVITY */}
      {activeTab === 'doctors' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" /> Leaderboard Produktivitas Dokter DPJP
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nama Dokter DPJP</th>
                    <th className="p-3">Spesialisasi</th>
                    <th className="p-3">Pasien Outpatient</th>
                    <th className="p-3">Tindakan Operasi</th>
                    <th className="p-3">Omzet Kontribusi</th>
                    <th className="p-3">Kepuasan Pasien</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {TOP_DOCTORS_PERFORMANCE.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-100 flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/20 text-[10px] text-cyan-300 font-bold">
                          {idx + 1}
                        </span>
                        {doc.name}
                      </td>
                      <td className="p-3 text-slate-400">{doc.specialty}</td>
                      <td className="p-3 font-semibold text-cyan-400">{doc.outpatient} Pasien</td>
                      <td className="p-3 font-semibold text-purple-400">{doc.surgeries} Kasus</td>
                      <td className="p-3 font-bold text-emerald-400">Rp {doc.revenueM} M</td>
                      <td className="p-3 text-yellow-300 font-bold">{doc.satisfactionPct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: PHARMACY & INVENTORY FINANCIAL HEALTH */}
      {activeTab === 'pharmacy_inv' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Pill className="h-5 w-5 text-pink-400" /> Analisis Keuangan Farmasi & Stok Fast/Slow Moving
            </h3>
            <p className="text-xs text-slate-400">Efisiensi FEFO & Minimasi Resiko Obat Kadaluarsa (Dead Stock Avoidance)</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Fast-Moving Drug Revenue:</span>
                <div className="text-xl font-bold text-emerald-400">Rp 4.2 Miliar</div>
                <span className="text-[10px] text-emerald-300">Turnover Rate: 12 hari</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Dead Stock Value Saved:</span>
                <div className="text-xl font-bold text-cyan-400">Rp 380 Juta</div>
                <span className="text-[10px] text-cyan-300">FEFO Auto Routing</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Restock Alert Critical:</span>
                <div className="text-xl font-bold text-rose-400">2 Item (Amlodipine, Cefotaxime)</div>
                <span className="text-[10px] text-rose-300">PR Auto Generated</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FRAUD DETECTOR & AUDIT BILLING */}
      {activeTab === 'fraud_audit' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Audit Log Deteksi Fraud & Leakage Billing
            </h3>
            <p className="text-xs text-slate-400">Sistem AI Otomatis Mencegah Dispute BPJS dan Kebocoran Revenue</p>

            <div className="space-y-3">
              {FRAUD_PREVENTION_AUDITS.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-cyan-400 font-bold">{item.id}</span>
                      <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                      <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{item.note}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">{item.status}</div>
                    <div className="text-[11px] font-semibold text-slate-300">Saved: {item.valueSaved}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: BOARD DECK & REPORT EXPORT */}
      {activeTab === 'board_export' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/80 p-6 space-y-4 shadow-xl text-center">
            <FileText className="h-12 w-12 text-cyan-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-100">C-Level Board Deck & Presentation Export</h3>
            <p className="text-xs text-slate-300 max-w-xl mx-auto">
              Hasilkan Laporan Resmi Direksi format PDF / Excel lengkap dengan AI Executive Summary, Grafik Keuangan, dan Matriks Efisiensi Barber untuk Rapat Pemegang Saham / Dewan Pengawas.
            </p>
            <button
              onClick={triggerExport}
              className="mt-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 transition shadow-xl inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Unduh Laporan Eksekutif PDF / Board Deck
            </button>
          </div>
        </div>
      )}

      {/* Export Modal Confirmation */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl space-y-4 text-center">
            {!exportSuccess ? (
              <div className="space-y-3 py-4">
                <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin mx-auto" />
                <h3 className="font-bold text-slate-100 text-base">Menyusun Board Deck Executive...</h3>
                <p className="text-xs text-slate-400">AI sedang mengekstrak grafik keuangan, indikator Barber, dan rekomendasi Direksi.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 mx-auto border border-emerald-500/40">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Board Deck Berhasil Diterbitkan!</h3>
                  <p className="text-xs text-slate-300 mt-1">Laporan Resmi Direksi (Juli 2026) siap diunduh atau dikirim ke email Dewan Komisaris.</p>
                </div>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setExportModalOpen(false);
                      setExportSuccess(false);
                    }}
                    className="rounded-xl bg-cyan-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
