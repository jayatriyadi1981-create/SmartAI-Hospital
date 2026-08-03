/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Bed,
  Clock,
  Sparkles,
  AlertTriangle,
  Stethoscope,
  Scissors,
  FileSpreadsheet,
  Download,
  Filter,
  CheckCircle2,
  PieChart as PieChartIcon,
  ShieldCheck,
  Building2,
  DollarSign,
  Search,
  Calendar,
  Layers
} from 'lucide-react';
const WARD_METRICS_LIST = [
  { wardId: 'w1', wardName: 'Gedung Teratai (VVIP & VIP)', totalBeds: 60, occupiedBeds: 48, borPct: 80.0, avgLOSDays: 3.2, toiDays: 1.1 },
  { wardId: 'w2', wardName: 'Ruang Mawar (Kelas 1 Rawat Inap)', totalBeds: 120, occupiedBeds: 94, borPct: 78.3, avgLOSDays: 4.1, toiDays: 1.3 },
  { wardId: 'w3', wardName: 'Ruang Melati (Kelas 2 Rawat Inap)', totalBeds: 180, occupiedBeds: 142, borPct: 78.8, avgLOSDays: 4.8, toiDays: 1.2 },
  { wardId: 'w4', wardName: 'Ruang Anggrek (Kelas 3 BPJS)', totalBeds: 210, occupiedBeds: 158, borPct: 75.2, avgLOSDays: 5.2, toiDays: 1.5 },
  { wardId: 'w5', wardName: 'ICU & Intensive Care Unit', totalBeds: 40, occupiedBeds: 32, borPct: 80.0, avgLOSDays: 6.8, toiDays: 0.8 },
  { wardId: 'w6', wardName: 'NICU / PICU Anak', totalBeds: 25, occupiedBeds: 18, borPct: 72.0, avgLOSDays: 7.4, toiDays: 1.0 }
];

export const ClinicalDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'inm' | 'financial' | 'export'>('overview');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Bulan Ini (Agustus 2026)');
  const [selectedUnit, setSelectedUnit] = useState<string>('Semua Unit');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [aiReportQuery, setAiReportQuery] = useState<string>('');
  const [aiReportResult, setAiReportResult] = useState<string | null>(null);

  // Sample INM Kemenkes Indicators Data
  const [inmMetrics] = useState([
    { id: 'INM-01', name: 'Kepatuhan Kebersihan Tangan (Hand Hygiene)', targetPct: 85, achievedPct: 94.2, status: 'Memenuhi Target', category: 'Keselamatan Pasien' },
    { id: 'INM-02', name: 'Kepatuhan Penggunaan Alat Pelindung Diri (APD)', targetPct: 100, achievedPct: 98.8, status: 'Mendekati Target', category: 'Keselamatan Pasien' },
    { id: 'INM-03', name: 'Kepatuhan Identifikasi Pasien (2 Identitas)', targetPct: 100, achievedPct: 100.0, status: 'Memenuhi Target', category: 'Keselamatan Pasien' },
    { id: 'INM-04', name: 'Waktu Tanggap Operasi Seksio Sesarea Emergensi (< 30 m)', targetPct: 80, achievedPct: 88.5, status: 'Memenuhi Target', category: 'Pelayanan Medis' },
    { id: 'INM-05', name: 'Waktu Tunggu Pelayanan Rawat Jalan (< 60 m)', targetPct: 80, achievedPct: 86.4, status: 'Memenuhi Target', category: 'Efisiensi Pelayanan' },
    { id: 'INM-06', name: 'Penundaan Operasi Elektif (< 5%)', targetPct: 5, achievedPct: 2.1, status: 'Memenuhi Target', category: 'Kamar Operasi' },
    { id: 'INM-07', name: 'Kepatuhan Waktu Visite Dokter Spesialis (08:00 - 14:00)', targetPct: 80, achievedPct: 91.0, status: 'Memenuhi Target', category: 'Pelayanan Medis' },
    { id: 'INM-08', name: 'Pelaporan Hasil Kritis Laboratorium (< 30 m)', targetPct: 100, achievedPct: 97.5, status: 'Memenuhi Target', category: 'Penunjang Medis' },
    { id: 'INM-09', name: 'Kepatuhan Penggunaan Formularium Nasional (FORNAS BPJS)', targetPct: 80, achievedPct: 92.3, status: 'Memenuhi Target', category: 'Farmasi & Billing' },
    { id: 'INM-10', name: 'Kepatuhan Alur Clinical Pathway (CP Sepsis, Stroke, Infark)', targetPct: 80, achievedPct: 89.7, status: 'Memenuhi Target', category: 'Mutu Klinik' },
    { id: 'INM-11', name: 'Kepatuhan Upaya Pencegahan Risiko Pasien Jatuh', targetPct: 100, achievedPct: 99.1, status: 'Memenuhi Target', category: 'Keperawatan' },
    { id: 'INM-12', name: 'Kecepatan Waktu Tanggap Komplain Pasien (< 24 Jam)', targetPct: 80, achievedPct: 95.0, status: 'Memenuhi Target', category: 'Kepuasan Pasien' },
    { id: 'INM-13', name: 'Kepuasan Pasien & Keluarga (NPS Score)', targetPct: 76, achievedPct: 88.4, status: 'Memenuhi Target', category: 'Kepuasan Pasien' },
  ]);

  // Sample Financial & BPJS Claims Analytics
  const financialSummary = {
    totalRevenueMonthly: 4850000000,
    bpjsClaimsRevenue: 3120000000,
    privateInsuranceRevenue: 1150000000,
    outOfPocketRevenue: 580000000,
    avgInaCbgMarginPct: 18.4,
    unbilledClaimsCount: 14,
    unbilledClaimsValue: 185000000,
    topICDCodes: [
      { code: 'I10', title: 'Essential (primary) hypertension', count: 420, avgCost: 850000, cbgCode: 'I-4-10-I' },
      { code: 'E11', title: 'Non-insulin-dependent diabetes mellitus', count: 380, avgCost: 1200000, cbgCode: 'E-4-10-II' },
      { code: 'J45', title: 'Asthma bronchiale', count: 210, avgCost: 950000, cbgCode: 'J-4-10-I' },
      { code: 'O80', title: 'Single spontaneous delivery', count: 185, avgCost: 3500000, cbgCode: 'O-6-10-I' },
      { code: 'K29.7', title: 'Gastritis, unspecified', count: 175, avgCost: 750000, cbgCode: 'K-4-10-I' }
    ]
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Laporan Analytics ${activeTab.toUpperCase()} (${selectedPeriod}) berhasil di-generate dan diunduh dalam format ${format.toUpperCase()}!`);
    }, 1200);
  };

  const handleRunAiAnalytics = () => {
    if (!aiReportQuery.trim()) return;
    setAiReportResult('Memproses analisis AI...');
    setTimeout(() => {
      setAiReportResult(
        `Hasil Analisis AI untuk "${aiReportQuery}":\n` +
        `• Tren kunjungan meningkat 14.2% di Poli Penyakit Dalam pada hari Senin & Kamis.\n` +
        `• BOR Rawat Inap Ruang Melati mencapai 92%, disarankan redistribution bed ke Ruang Mawar (BOR 64%).\n` +
        `• Klaim BPJS Ina-CBGs mengalami margin tertinggi pada kelompok kasus I-4-10-I (Hypertension) sebesar +22.4%.`
      );
    }, 1000);
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6 pb-12">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 border border-blue-500/30 rounded-2xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-cyan-400" /> Clinical Quality & Operational Intelligence
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Laporan & Analytics Mutu Rumah Sakit
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Integrasi Dashboard Indikator Nasional Mutu (INM Kemenkes), BOR/LOS Rawat Inap, Financial RCM, & AI Executive Reporting.
          </p>
        </div>

        {/* Global Filter & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="Hari Ini">Hari Ini (3 Agustus 2026)</option>
            <option value="Minggu Ini">Minggu Ini (27 Jul - 3 Ags)</option>
            <option value="Bulan Ini (Agustus 2026)">Bulan Ini (Agustus 2026)</option>
            <option value="Triwulan III 2026">Triwulan III 2026</option>
            <option value="Tahun 2026">Tahun 2026</option>
          </select>

          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 focus:border-cyan-500 focus:outline-none"
          >
            <option value="Semua Unit">Semua Unit & Poliklinik</option>
            <option value="Rawat Jalan">Instalasi Rawat Jalan</option>
            <option value="Rawat Inap">Instalasi Rawat Inap</option>
            <option value="IGD">IGD & Critical Care</option>
            <option value="Kamar Operasi">Kamar Operasi (OK)</option>
            <option value="Laboratorium">Laboratorium & Radiologi</option>
          </select>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition"
            >
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Activity className="h-4 w-4" />
          Ringkasan Pelayanan Medis
        </button>

        <button
          onClick={() => setActiveTab('inm')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'inm'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Indikator Nasional Mutu (INM Kemenkes)
        </button>

        <button
          onClick={() => setActiveTab('financial')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'financial'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <DollarSign className="h-4 w-4 text-amber-400" />
          Analytics Keuangan & BPJS Claim
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'export'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Sparkles className="h-4 w-4 text-indigo-400" />
          AI Analytics Query & Generator Laporan
        </button>
      </div>

      {/* TAB 1: OVERVIEW & OPERATIONAL KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Primary KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Pasien Rawat Jalan</div>
              <div className="text-2xl font-bold text-cyan-300 font-mono">845 Orang</div>
              <div className="text-[10px] text-emerald-400 font-bold">+8.2% vs kemarin</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Kunjungan IGD</div>
              <div className="text-2xl font-bold text-red-400 font-mono">111 Pasien</div>
              <div className="text-[10px] text-slate-400">Avg Triage: 4.2 m</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Operasi OK</div>
              <div className="text-2xl font-bold text-amber-300 font-mono">18 Prosedur</div>
              <div className="text-[10px] text-emerald-400 font-bold">100% WHO Safety</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">BOR Rawat Inap</div>
              <div className="text-2xl font-bold text-indigo-300 font-mono">75.7%</div>
              <div className="text-[10px] text-indigo-400 font-bold">Optimal 75-85%</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Avg Waiting Time</div>
              <div className="text-2xl font-bold text-emerald-300 font-mono">12.4 Min</div>
              <div className="text-[10px] text-emerald-400 font-bold">Standar Permenkes</div>
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Readmission Rate</div>
              <div className="text-2xl font-bold text-sky-300 font-mono">1.8%</div>
              <div className="text-[10px] text-emerald-400 font-bold">Rendah (Sangat Baik)</div>
            </div>
          </div>

          {/* AI Clinical Insights Section */}
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-cyan-300">
                <Sparkles className="w-5 h-5 text-cyan-200" /> AI Executive Clinical Insights & Early Warnings
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/30">
                Model: Gemini 3.6 Flash Medical
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-amber-400 flex items-center justify-between">
                  <span>Tren Kasus Infeksi Saluran Napas & DHF</span>
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Deteksi lonjakan kasus Demam Berdarah (DHF) sebesar +18% dalam 3 hari terakhir di wilayah Kecamatan Kebayoran. Persiapkan buffer stok cairan IV Ringer Laktat & Trombosit Darah.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-cyan-300 flex items-center justify-between">
                  <span>Puncak Antrian Poli Penyakit Dalam</span>
                  <Clock className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Puncak kedatangan pasien Poli Penyakit Dalam diprediksi jam 10:15 - 11:30. Disarankan penambahan 1 dokter asistensi untuk mengurangi waktu tunggu pasien BPJS.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="font-bold text-emerald-400 flex items-center justify-between">
                  <span>Efisiensi Kamar Operasi (OK)</span>
                  <Scissors className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Tingkat utilisasi Kamar Operasi 1 & 3 mencapai 88%. Seluruh prosedur emergency PCI & Orthopedi berjalan sesuai jadwal tanpa penundaan bermakna.
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Ward Metrics Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Bed className="h-5 w-5 text-indigo-400" /> Analisis Utilisasi Bed Per Ruangan Rawat Inap (BOR, LOS, BTO, TOI)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Nama Ruangan Ward</th>
                    <th className="p-3">Kapasitas Bed</th>
                    <th className="p-3">Bed Terisi</th>
                    <th className="p-3">BOR (%)</th>
                    <th className="p-3">Average LOS (Hari)</th>
                    <th className="p-3">Turn Over Interval (TOI)</th>
                    <th className="p-3">Status Efisiensi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {WARD_METRICS_LIST.map((w) => (
                    <tr key={w.wardId} className="hover:bg-slate-800/60 transition">
                      <td className="p-3 font-semibold text-white font-sans">{w.wardName}</td>
                      <td className="p-3 text-slate-300">{w.totalBeds} Bed</td>
                      <td className="p-3 text-slate-200">{w.occupiedBeds} Bed</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold ${
                          w.borPct > 85 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {w.borPct}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{w.avgLOSDays} Hari</td>
                      <td className="p-3 text-slate-400">{w.toiDays} Hari</td>
                      <td className="p-3 font-sans">
                        <span className="rounded bg-slate-800 px-2.5 py-1 text-[10px] font-bold text-cyan-300">
                          {w.borPct > 85 ? 'Kapasitas Tinggi' : 'Optimal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INDIKATOR NASIONAL MUTU (INM KEMENKES) */}
      {activeTab === 'inm' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" /> Indikator Nasional Mutu (INM) Kemenkes RI
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Laporan capaian 13 indikator mutu pelayanan kesehatan sesuai Permenkes No. 30 Tahun 2022.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                Capaian Rata-Rata RS: 94.6% (Sangat Baik)
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Kode INM</th>
                  <th className="p-3">Indikator Mutu Pelayanan</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Target Standard</th>
                  <th className="p-3">Capaian RS (%)</th>
                  <th className="p-3">Status Indikator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {inmMetrics.map((inm) => (
                  <tr key={inm.id} className="hover:bg-slate-800/60 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400">{inm.id}</td>
                    <td className="p-3 font-semibold text-white">{inm.name}</td>
                    <td className="p-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {inm.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-300">≥ {inm.targetPct}%</td>
                    <td className="p-3 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              inm.achievedPct >= inm.targetPct ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                            style={{ width: `${Math.min(inm.achievedPct, 100)}%` }}
                          />
                        </div>
                        <span className={`font-bold ${
                          inm.achievedPct >= inm.targetPct ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {inm.achievedPct}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inm.achievedPct >= inm.targetPct
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {inm.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FINANCIAL & BPJS CLAIMS ANALYTICS */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Total Pendapatan Bulan Ini</span>
              <h3 className="text-2xl font-bold text-emerald-400 font-mono">
                Rp {(financialSummary.totalRevenueMonthly / 1000000000).toFixed(2)} Miliar
              </h3>
              <p className="text-[11px] text-slate-400">Target RKAT Tercapai 104%</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Klaim BPJS Kesehatan (Ina-CBGs)</span>
              <h3 className="text-2xl font-bold text-cyan-300 font-mono">
                Rp {(financialSummary.bpjsClaimsRevenue / 1000000000).toFixed(2)} Miliar
              </h3>
              <p className="text-[11px] text-cyan-400">Porsi 64.3% Total Omset</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Asuransi Swasta & Corporate</span>
              <h3 className="text-2xl font-bold text-indigo-300 font-mono">
                Rp {(financialSummary.privateInsuranceRevenue / 1000000000).toFixed(2)} Miliar
              </h3>
              <p className="text-[11px] text-slate-400">Porsi 23.7% Total Omset</p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-400 font-semibold">Margin Klaim Ina-CBGs</span>
              <h3 className="text-2xl font-bold text-amber-300 font-mono">
                +{financialSummary.avgInaCbgMarginPct}%
              </h3>
              <p className="text-[11px] text-amber-400">{financialSummary.unbilledClaimsCount} Unbilled Claims (Pending)</p>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-cyan-400" /> Top 5 Diagnosa Terbanyak & Cost Per Case (Ina-CBGs)
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Kode ICD-10</th>
                    <th className="p-3">Deskripsi Diagnosa Utama</th>
                    <th className="p-3">Kode Tarif Ina-CBGs</th>
                    <th className="p-3">Total Kasus</th>
                    <th className="p-3">Rata-rata Cost / Pasien</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {financialSummary.topICDCodes.map((icd) => (
                    <tr key={icd.code} className="hover:bg-slate-800/60 transition">
                      <td className="p-3 font-bold text-cyan-400">{icd.code}</td>
                      <td className="p-3 font-semibold text-white font-sans">{icd.title}</td>
                      <td className="p-3 text-amber-300">{icd.cbgCode}</td>
                      <td className="p-3 text-slate-200">{icd.count} Kasus</td>
                      <td className="p-3 text-emerald-300">Rp {icd.avgCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AI ANALYTICS QUERY & EXPORT */}
      {activeTab === 'export' && (
        <div className="space-y-6 bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" /> AI Natural Language Reporting & Executive Export
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ketik pertanyaan operasional atau buat kustomisasi laporan analytics secara otomatis dengan AI.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Misal: Tampilkan tren kunjungan pasien IGD berdasar jam kedatangan..."
                value={aiReportQuery}
                onChange={(e) => setAiReportQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRunAiAnalytics()}
                className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-4 py-2.5 text-xs focus:border-indigo-500 focus:outline-none"
              />
              <button
                onClick={handleRunAiAnalytics}
                className="rounded-xl bg-indigo-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-400 transition"
              >
                Analisis AI
              </button>
            </div>

            {aiReportResult && (
              <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/30 text-xs text-indigo-200 whitespace-pre-line leading-relaxed">
                {aiReportResult}
              </div>
            )}
          </div>

          <div className="border-t border-slate-800 pt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Format Laporan Resmi: Disetujui Komite Mutu & Direksi RS (PDF / Excel / CSV)
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleExport('pdf')}
                className="rounded-xl bg-rose-500 px-4 py-2 text-xs font-bold text-white hover:bg-rose-400 transition"
              >
                Unduh PDF Laporan Eksekutif
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
              >
                Unduh Spreadsheet Excel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
