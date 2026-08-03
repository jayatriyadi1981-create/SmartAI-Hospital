/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  UserCheck,
  Bed,
  Activity,
  Stethoscope,
  PieChart as PieIcon,
  UserPlus,
  HeartHandshake,
  Microscope,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  Wallet,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Building2,
  FileText,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import {
  INITIAL_STATS,
  PATIENT_VISIT_SERIES,
  REVENUE_MONTHLY_SERIES,
  BED_OCCUPANCY_DATA,
  TOP_DIAGNOSIS_DATA,
  TOP_POLI_DATA,
  AI_PREDICTIONS
} from '../data/mockData';

interface ExecutiveDashboardProps {
  onNavigate: (viewId: string) => void;
}

const COLORS = ['#06B6D4', '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];

export const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ onNavigate }) => {
  const { user, currentRole } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [aiBriefingLoading, setAiBriefingLoading] = useState<boolean>(false);
  const [aiBriefing, setAiBriefing] = useState<any | null>(null);

  const fetchExecutiveBriefing = async () => {
    setAiBriefingLoading(true);
    try {
      const res = await fetch('/api/ai/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: selectedTimeframe === 'today' ? 'Hari Ini' : selectedTimeframe === 'week' ? 'Minggu Ini' : 'Bulan Ini',
          metrics: {
            BOR: '75.7%',
            TotalPasien: 1248,
            RawatJalan: 845,
            RawatInap: 492,
            IGD: 111,
            RevenueToday: 'Rp 485.6M',
            RevenueMonth: 'Rp 14.82B',
            BPJSClaim: 'Rp 9.24B'
          }
        })
      });
      const data = await res.json();
      if (data.briefing) {
        setAiBriefing(data.briefing);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiBriefingLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return Users;
      case 'UserCheck': return UserCheck;
      case 'Bed': return Bed;
      case 'Activity': return Activity;
      case 'Stethoscope': return Stethoscope;
      case 'PieChart': return PieIcon;
      case 'UserPlus': return UserPlus;
      case 'HeartHandshake': return HeartHandshake;
      case 'Microscope': return Microscope;
      case 'DollarSign': return DollarSign;
      case 'TrendingUp': return TrendingUp;
      case 'ShieldCheck': return ShieldCheck;
      case 'CreditCard': return CreditCard;
      case 'Wallet': return Wallet;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 p-6 shadow-2xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-32 bottom-0 -mb-8 h-48 w-48 rounded-full bg-blue-600/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                EXECUTIVE COCKPIT
              </span>
              <span className="text-xs text-slate-400">| RSUD Smart Medika</span>
            </div>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">
              Selamat Datang, {user?.name || 'Direksi Utama'}
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl">
              Monitoring Real-time Rumah Sakit Berbasis AI. Akses lengkap indikator pelayanan klinis, efisiensi BOR, arus kas keuangan, dan prediksi operasional.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700">
              <button
                onClick={() => setSelectedTimeframe('today')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  selectedTimeframe === 'today' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Hari Ini
              </button>
              <button
                onClick={() => setSelectedTimeframe('week')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  selectedTimeframe === 'week' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Minggu Ini
              </button>
              <button
                onClick={() => setSelectedTimeframe('month')}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  selectedTimeframe === 'month' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bulan Ini
              </button>
            </div>

            <button
              onClick={fetchExecutiveBriefing}
              disabled={aiBriefingLoading}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-500 transition disabled:opacity-50"
            >
              {aiBriefingLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Sparkles className="h-4 w-4 text-cyan-200" />
              )}
              <span>Sintesis Laporan AI</span>
            </button>
          </div>
        </div>

        {/* AI Briefing Output Panel */}
        {aiBriefing && (
          <div className="mt-6 rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 animate-in fade-in">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                Ringkasan Eksekutif AI (Generated by Gemini 3.6)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <span className="font-semibold text-white block mb-1">Kinerja Operasional:</span>
                <p className="text-slate-300">{aiBriefing.executiveOverview}</p>
              </div>
              <div>
                <span className="font-semibold text-white block mb-1">Kesehatan Keuangan:</span>
                <p className="text-slate-300">{aiBriefing.financialPerformance}</p>
              </div>
            </div>
            {aiBriefing.operationalRecommendations && (
              <div className="mt-3 pt-3 border-t border-slate-800">
                <span className="font-semibold text-amber-400 text-xs block mb-1">
                  Rekomendasi Strategis Direksi:
                </span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {aiBriefing.operationalRecommendations.map((rec: string, idx: number) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 14 Key Stat Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            Statistik Utama Pelayanan & Keuangan (14 Key Metrics)
          </h2>
          <span className="text-xs text-slate-400">Update Terakhir: Real-time Live</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {INITIAL_STATS.map((stat) => {
            const IconComponent = getIcon(stat.iconName);
            const isUp = stat.trend === 'up';

            return (
              <div
                key={stat.id}
                className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 shadow-lg hover:border-cyan-500/40 hover:bg-slate-900 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-400 truncate max-w-[120px]" title={stat.title}>
                    {stat.title}
                  </span>
                  <div className="rounded-lg bg-slate-800 p-1.5 text-cyan-400 group-hover:bg-cyan-500/20 transition">
                    <IconComponent className="h-4 w-4" />
                  </div>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-lg font-black text-white tracking-tight">
                    {stat.value}
                  </span>
                  {stat.unit && <span className="text-[10px] text-slate-400 ml-1">{stat.unit}</span>}
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span
                    className={`flex items-center font-semibold ${
                      isUp ? 'text-emerald-400' : stat.trend === 'down' ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  >
                    {isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.change > 0 ? `+${stat.change}%` : `${stat.change}%`}
                  </span>
                  <span className="text-slate-500 truncate max-w-[90px]" title={stat.timeframe}>
                    {stat.timeframe}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Predictions Panel */}
      <div className="rounded-2xl border border-amber-500/30 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Zap className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Executive AI Insights & Prediksi Risiko</h3>
              <p className="text-xs text-slate-400">Peringatan otomatis berdasar analisis pembelajaran mesin terkini</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('AI Center')}
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:underline"
          >
            Buka AI Center →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {AI_PREDICTIONS.map((p) => (
            <div
              key={p.id}
              className={`rounded-xl border p-3.5 space-y-2 text-xs transition ${
                p.severity === 'high'
                  ? 'border-rose-500/40 bg-rose-950/20'
                  : p.severity === 'medium'
                  ? 'border-amber-500/40 bg-amber-950/20'
                  : 'border-blue-500/40 bg-blue-950/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                  {p.category}
                </span>
                <span className="font-mono text-[10px] font-bold text-cyan-400">
                  Confidence: {p.confidenceScore}%
                </span>
              </div>
              <h4 className="font-bold text-white text-xs leading-snug">{p.title}</h4>
              <p className="text-slate-300 text-[11px] leading-relaxed">{p.summary}</p>
              <div className="pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="font-semibold text-cyan-300 block">Rekomendasi AI:</span>
                <span className="text-slate-200">{p.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interactive Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Visits Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Tren Kunjungan Pasien Real-time</h3>
              <p className="text-xs text-slate-400">Kunjungan Poliklinik Rawat Jalan, Rawat Inap, dan IGD per jam</p>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
              Live Flow
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PATIENT_VISIT_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRJ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorIGD" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="rawatJalan" name="Rawat Jalan" stroke="#06B6D4" fillOpacity={1} fill="url(#colorRJ)" />
                <Area type="monotone" dataKey="rawatInap" name="Rawat Inap" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRI)" />
                <Area type="monotone" dataKey="igd" name="IGD Darurat" stroke="#EF4444" fillOpacity={1} fill="url(#colorIGD)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bed Occupancy Rate Donut & Progress */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white">Bed Occupancy Rate (BOR)</h3>
              <span className="text-xs font-mono font-bold text-cyan-400">75.7% Total</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Distribusi Okupansi Bed Per Kelas Perawatan</p>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={BED_OCCUPANCY_DATA}
                    dataKey="occupied"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {BED_OCCUPANCY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            {BED_OCCUPANCY_DATA.slice(0, 4).map((b, idx) => (
              <div key={b.category} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{b.category}</span>
                  <span className="text-slate-400 font-mono">
                    {b.occupied}/{b.total} ({b.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${b.percentage}%`,
                      backgroundColor: COLORS[idx % COLORS.length]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Interactive Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue & BPJS Claims Monthly Bar Chart */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Pendapatan vs Klaim BPJS (Miliar Rp)</h3>
              <p className="text-xs text-slate-400">Realisasi Pendapatan Pasien Umum, BPJS V-Claim, dan Asuransi Swasta</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_MONTHLY_SERIES} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="klaimBPJS" name="Klaim BPJS" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendapatanUmum" name="Pasien Umum" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="asuransiSwasta" name="Asuransi Swasta" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Diagnoses ICD-10 Horizontal Bar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Top 7 Diagnosa Penyakit (ICD-10)</h3>
              <p className="text-xs text-slate-400">Kasus terbanyak ditangani bulan ini</p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-400">ICD-10 Standard</span>
          </div>

          <div className="space-y-3 text-xs">
            {TOP_DIAGNOSIS_DATA.map((diag, idx) => {
              const maxCases = 350;
              const pct = (diag.cases / maxCases) * 100;

              return (
                <div key={diag.code} className="space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-2 truncate">
                      <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300">
                        {diag.code}
                      </span>
                      <span className="truncate font-medium text-slate-200">{diag.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0">{diag.cases} kasus</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
