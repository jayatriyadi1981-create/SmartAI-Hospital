/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Receipt,
  DollarSign,
  PieChart,
  CreditCard,
  Building2,
  TrendingUp,
  FileSpreadsheet,
  QrCode,
  ShieldAlert,
  CheckCircle2,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Sparkles,
  Printer,
  X,
  FileCheck,
  AlertCircle,
  Filter,
  CheckSquare,
  RefreshCw,
  Send,
  Eye,
  FileText
} from 'lucide-react';
import { MOCK_GL_ACCOUNTS, MOCK_BILLING_INVOICES } from '../data/mockData';
import { GeneralLedgerAccount, BillingInvoice } from '../types';

interface BPJSClaimRecord {
  id: string;
  claimNo: string;
  patientName: string;
  norm: string;
  sepNumber: string;
  inaCbgCode: string;
  inaCbgDescription: string;
  inaCbgTariff: number;
  actualHospitalCost: number;
  claimStatus: 'Draft' | 'Grouping Verified' | 'Submitted V-Claim' | 'Approved Payout' | 'Disputed / Pending Revision';
  submissionDate: string;
  denialReason?: string;
  aiSuggestedFix?: string;
}

interface JournalEntryItem {
  id: string;
  date: string;
  journalNo: string;
  description: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  costCenter: string;
}

export const FinanceRCMView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'billing' | 'gl' | 'rcm' | 'leakage_ai'>('billing');
  const [invoices, setInvoices] = useState<BillingInvoice[]>(MOCK_BILLING_INVOICES);
  const [glAccounts, setGlAccounts] = useState<GeneralLedgerAccount[]>(MOCK_GL_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal States
  const [paymentModal, setPaymentModal] = useState<BillingInvoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Virtual Account' | 'Credit Card' | 'Cash' | 'BPJS Direct'>('QRIS');
  const [receiptModal, setReceiptModal] = useState<BillingInvoice | null>(null);
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [showNewCoaModal, setShowNewCoaModal] = useState(false);

  // New Invoice Form State
  const [newInvPatient, setNewInvPatient] = useState('Dr. Hendra Wijaya');
  const [newInvNorm, setNewInvNorm] = useState('RM-2026-01005');
  const [newInvVisitType, setNewInvVisitType] = useState<BillingInvoice['visitType']>('Rawat Jalan');
  const [newRegFee, setNewRegFee] = useState(50000);
  const [newConsultFee, setNewConsultFee] = useState(250000);
  const [newLabFee, setNewLabFee] = useState(350000);
  const [newRadFee, setNewRadFee] = useState(450000);
  const [newPharmFee, setNewPharmFee] = useState(220000);
  const [newRoomFee, setNewRoomFee] = useState(0);
  const [newProcFee, setNewProcFee] = useState(0);

  // New COA Account Form State
  const [newAccountCode, setNewAccountCode] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [newAccountCategory, setNewAccountCategory] = useState<GeneralLedgerAccount['category']>('Asset');
  const [newCostCenter, setNewCostCenter] = useState('Poliklinik');
  const [newInitialBalance, setNewInitialBalance] = useState(0);

  // RCM Claims Pipeline State
  const [claims, setClaims] = useState<BPJSClaimRecord[]>([
    {
      id: 'clm-001',
      claimNo: 'CLM/BPJS/2026/08/001',
      patientName: 'Ahmad Dahlan',
      norm: 'RM-2026-00812',
      sepNumber: '0001R0010826V000123',
      inaCbgCode: 'I-4-10-I',
      inaCbgDescription: 'Hipertensi Komplikasi Sedang - Berat (Rawat Inap Kelas 1)',
      inaCbgTariff: 6850000,
      actualHospitalCost: 6120000,
      claimStatus: 'Approved Payout',
      submissionDate: '2026-08-01'
    },
    {
      id: 'clm-002',
      claimNo: 'CLM/BPJS/2026/08/002',
      patientName: 'Siti Rahmawati',
      norm: 'RM-2026-00941',
      sepNumber: '0001R0010826V000124',
      inaCbgCode: 'J-4-15-II',
      inaCbgDescription: 'Pneumonia Komunitas Ringan - Sedang',
      inaCbgTariff: 5400000,
      actualHospitalCost: 5900000,
      claimStatus: 'Submitted V-Claim',
      submissionDate: '2026-08-02'
    },
    {
      id: 'clm-003',
      claimNo: 'CLM/BPJS/2026/08/003',
      patientName: 'Dewi Lestari',
      norm: 'RM-2026-01120',
      sepNumber: '0001R0010826V000125',
      inaCbgCode: 'Q-5-18-I',
      inaCbgDescription: 'Pemeriksaan Kesehatan Rawat Jalan Poliklinik Kronis',
      inaCbgTariff: 320000,
      actualHospitalCost: 310000,
      claimStatus: 'Disputed / Pending Revision',
      submissionDate: '2026-08-02',
      denialReason: 'Incomplete ICD-10 Secondary Diagnosis for Chronic Comorbidity',
      aiSuggestedFix: 'Tambahkan ICD-10 Secondary Code E11.9 (DM Tipe 2) dari EMR ke V-Claim lalu resubmit.'
    }
  ]);
  const [isSubmittingBatchClaim, setIsSubmittingBatchClaim] = useState(false);

  // Journal Entries Log State
  const [journalEntries, setJournalEntries] = useState<JournalEntryItem[]>([
    {
      id: 'je-101',
      date: '2026-08-03 08:30',
      journalNo: 'JRN/2026/08/001',
      description: 'Penerimaan Kasir Invoice INV/RS/2026/08/101 (Pasien Ahmad Dahlan)',
      accountCode: '1101-01',
      accountName: 'Kas Utama Kasir RS',
      debit: 1580000,
      credit: 0,
      costCenter: 'Kasir Sentral'
    },
    {
      id: 'je-102',
      date: '2026-08-03 08:30',
      journalNo: 'JRN/2026/08/001',
      description: 'Pendapatan Layanan Medis Rawat Jalan',
      accountCode: '4101-01',
      accountName: 'Pendapatan Rawat Jalan',
      debit: 0,
      credit: 1580000,
      costCenter: 'Poliklinik Penyakit Dalam'
    }
  ]);

  // AI Revenue Leakage Items State
  const [leakageAlerts, setLeakageAlerts] = useState([
    {
      id: 'leak-1',
      patientName: 'Budi Santoso',
      norm: 'RM-2026-003',
      invoiceId: 'inv-3',
      unbilledItem: 'Catheter Central Venous Line (CVL) & Set Steril ICU',
      detectedBy: 'IoT Infusion Pump Log & EHR Ward System',
      potentialValue: 1850000,
      status: 'Detected Unbilled'
    },
    {
      id: 'leak-2',
      patientName: 'Dewi Lestari',
      norm: 'RM-2026-01120',
      invoiceId: 'inv-4',
      unbilledItem: 'Pemeriksaan Troponin I Rapid Card (Lab Cito)',
      detectedBy: 'LIS Analyzer Automated Integration Bridge',
      potentialValue: 450000,
      status: 'Detected Unbilled'
    }
  ]);
  const [isScanningLeakage, setIsScanningLeakage] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Process Payment Action
  const processPayment = () => {
    if (!paymentModal) return;

    const updatedInvoices = invoices.map((inv) =>
      inv.id === paymentModal.id
        ? {
            ...inv,
            remainingBalance: 0,
            depositPaid: inv.totalAmount,
            paymentStatus: 'Paid Full' as const,
            paymentMethod
          }
        : inv
    );

    setInvoices(updatedInvoices);

    // Auto add journal entry
    const newJe1: JournalEntryItem = {
      id: `je-${Date.now()}-1`,
      date: new Date().toLocaleString('id-ID'),
      journalNo: `JRN/2026/08/${Math.floor(100 + Math.random() * 900)}`,
      description: `Pelunasan Kasir ${paymentModal.invoiceNumber} (${paymentModal.patientName}) via ${paymentMethod}`,
      accountCode: '1101-01',
      accountName: 'Kas & Bank Operasional RS',
      debit: paymentModal.remainingBalance,
      credit: 0,
      costCenter: 'Kasir Sentral'
    };

    const newJe2: JournalEntryItem = {
      id: `je-${Date.now()}-2`,
      date: new Date().toLocaleString('id-ID'),
      journalNo: newJe1.journalNo,
      description: `Pelepasan Piutang Pasien ${paymentModal.patientName}`,
      accountCode: '1103-01',
      accountName: 'Piutang Pasien Rawat Inap/Jalan',
      debit: 0,
      credit: paymentModal.remainingBalance,
      costCenter: 'Billing & Finance'
    };

    setJournalEntries([newJe1, newJe2, ...journalEntries]);
    showToast(`Pembayaran Rp ${paymentModal.remainingBalance.toLocaleString('id-ID')} via ${paymentMethod} LUNAS! Kuitansi terbit.`);
    setReceiptModal(paymentModal);
    setPaymentModal(null);
  };

  // Submit New Invoice
  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const total = newRegFee + newConsultFee + newLabFee + newRadFee + newPharmFee + newRoomFee + newProcFee;
    const inv: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV/RS/2026/08/${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: newInvPatient,
      norm: newInvNorm,
      visitType: newInvVisitType,
      registrationFee: newRegFee,
      consultationFee: newConsultFee,
      labFee: newLabFee,
      radiologyFee: newRadFee,
      pharmacyFee: newPharmFee,
      roomFee: newRoomFee,
      procedureFee: newProcFee,
      totalAmount: total,
      depositPaid: 0,
      remainingBalance: total,
      paymentStatus: 'Unpaid',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setInvoices([inv, ...invoices]);
    setShowNewInvoiceModal(false);
    showToast(`Invoice billing baru ${inv.invoiceNumber} berhasil diterbitkan.`);
  };

  // Create COA Account
  const handleCreateCoa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountCode.trim() || !newAccountName.trim()) return;

    const newAcc: GeneralLedgerAccount = {
      accountCode: newAccountCode,
      accountName: newAccountName,
      category: newAccountCategory,
      costCenter: newCostCenter,
      balance: newInitialBalance
    };

    setGlAccounts([...glAccounts, newAcc]);
    setShowNewCoaModal(false);
    setNewAccountCode('');
    setNewAccountName('');
    showToast(`Akun COA ${newAccountCode} - ${newAccountName} berhasil ditambahkan.`);
  };

  // Fix AI Revenue Leakage
  const handleFixLeakage = (leakId: string, value: number) => {
    setLeakageAlerts(leakageAlerts.filter(l => l.id !== leakId));
    // Update first unpaid invoice or add to list
    if (invoices.length > 0) {
      setInvoices(
        invoices.map((inv, idx) =>
          idx === 0
            ? {
                ...inv,
                procedureFee: inv.procedureFee + value,
                totalAmount: inv.totalAmount + value,
                remainingBalance: inv.remainingBalance + value
              }
            : inv
        )
      );
    }
    showToast(`Tindakan unbilled senilai Rp ${value.toLocaleString('id-ID')} berhasil ditambahkan ke Invoice Billing!`);
  };

  // Run AI Scan Leakage
  const handleRunAiLeakageScan = () => {
    setIsScanningLeakage(true);
    setTimeout(() => {
      setIsScanningLeakage(false);
      showToast('Scan AI Leakage Selesai: 2 item unbilled teridentifikasi.');
    }, 1200);
  };

  // Submit Batch Claims to BPJS V-Claim
  const handleSubmitBatchClaims = () => {
    setIsSubmittingBatchClaim(true);
    setTimeout(() => {
      setClaims(
        claims.map(c =>
          c.claimStatus === 'Submitted V-Claim' || c.claimStatus === 'Draft'
            ? { ...c, claimStatus: 'Grouping Verified' }
            : c
        )
      );
      setIsSubmittingBatchClaim(false);
      showToast('Batch Klaim V-Claim 4.0 berhasil diverifikasi dan dikirim ke portal BPJS!');
    }, 1500);
  };

  // Filter Invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.norm.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Financial KPIs
  const totalGrossRevenue = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalCollectedCash = invoices.reduce((acc, curr) => acc + curr.depositPaid, 0);
  const totalReceivables = invoices.reduce((acc, curr) => acc + curr.remainingBalance, 0);
  const totalBPJSClaims = claims.reduce((acc, curr) => acc + curr.inaCbgTariff, 0);

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-xl shadow-2xl border border-emerald-300 animate-bounce flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner Header */}
      <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-inner">
              <Receipt className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Finance, Billing & Revenue Cycle Management</h1>
                <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  RCM & Auto-Billing 4.0
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Sistem Pengelolaan Keuangan & Billing Kasir Otomatis, General Ledger COA, V-Claim BPJS, dan AI Revenue Leakage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNewInvoiceModal(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg transition"
            >
              <Plus className="h-4 w-4" />
              Buat Invoice Billing Baru
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Total Billing Gross</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            Rp {totalGrossRevenue.toLocaleString('id-ID')}
          </div>
          <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" /> Akumulasi Tagihan Terbit
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Kas Terkumpul (Collected)</span>
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-teal-300 font-mono">
            Rp {totalCollectedCash.toLocaleString('id-ID')}
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Pelunasan Kasir Lunas</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Piutang Billing (AR)</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-amber-400 font-mono">
            Rp {totalReceivables.toLocaleString('id-ID')}
          </div>
          <p className="text-[10px] text-amber-300 font-mono">Sisa Tagihan Belum Lunas</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-1">
          <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
            <span>Pipeline Klaim BPJS (RCM)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-cyan-300 font-mono">
            Rp {totalBPJSClaims.toLocaleString('id-ID')}
          </div>
          <p className="text-[10px] text-cyan-400 font-mono">Estimasi Tarif INA-CBGs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'billing' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          Kasir & Billing Otomatis ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab('gl')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'gl' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="h-4 w-4" />
          General Ledger & COA
        </button>
        <button
          onClick={() => setActiveTab('rcm')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'rcm' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Revenue Cycle (RCM & Klaim) ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('leakage_ai')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeTab === 'leakage_ai' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          AI Revenue Leakage Engine ({leakageAlerts.length})
        </button>
      </div>

      {/* TAB 1: BILLING & KASIR */}
      {activeTab === 'billing' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama pasien, NORM, atau nomor invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 font-medium"
              >
                <option value="All">Semua Status Payment</option>
                <option value="Unpaid">Unpaid (Belum Bayar)</option>
                <option value="Partial">Partial (Sebagian)</option>
                <option value="Paid Full">Paid Full (Lunas)</option>
                <option value="Insurance Claimed">Insurance Claimed</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredInvoices.map((inv) => (
              <div key={inv.id} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{inv.patientName}</span>
                      <span className="text-xs text-slate-400 font-mono">({inv.norm})</span>
                      <span className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-xs text-cyan-300 font-medium">
                        {inv.visitType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      No. Invoice: <span className="text-emerald-400 font-bold">{inv.invoiceNumber}</span> • Tanggal: {inv.createdDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-xl px-3 py-1 text-xs font-bold border ${
                        inv.paymentStatus === 'Paid Full'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : inv.paymentStatus === 'Partial'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      }`}
                    >
                      {inv.paymentStatus}
                    </span>

                    {inv.remainingBalance > 0 ? (
                      <button
                        onClick={() => setPaymentModal(inv)}
                        className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md transition"
                      >
                        Bayar Kasir
                      </button>
                    ) : (
                      <button
                        onClick={() => setReceiptModal(inv)}
                        className="rounded-xl bg-slate-800 px-3 py-2 text-xs font-bold text-cyan-300 hover:bg-slate-700 transition flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Lihat Receipt
                      </button>
                    )}

                    <button
                      onClick={() => setReceiptModal(inv)}
                      className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 transition"
                      title="Cetak Receipt"
                    >
                      <Printer className="h-4 w-4 text-emerald-400" />
                    </button>
                  </div>
                </div>

                {/* Rincian Komponen Billing Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">Pendaftaran:</span>
                    <span className="font-bold text-slate-200">Rp {inv.registrationFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">Konsultasi Dokter:</span>
                    <span className="font-bold text-slate-200">Rp {inv.consultationFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">Laboratorium:</span>
                    <span className="font-bold text-slate-200">Rp {inv.labFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">Radiologi & Imaging:</span>
                    <span className="font-bold text-slate-200">Rp {inv.radiologyFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">Obat & Farmasi:</span>
                    <span className="font-bold text-slate-200">Rp {inv.pharmacyFee.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 text-[10px] block font-medium">Kamar Inap & Tindakan:</span>
                    <span className="font-bold text-slate-200">Rp {(inv.roomFee + inv.procedureFee).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20">
                    <span className="text-emerald-400 font-bold text-[10px] block">TOTAL TAGIHAN:</span>
                    <span className="font-bold text-emerald-300 text-sm">Rp {inv.totalAmount.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GENERAL LEDGER & COA */}
      {activeTab === 'gl' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-emerald-400" /> Chart of Accounts (COA) & Ledger Buku Besar
              </h3>
              <button
                onClick={() => setShowNewCoaModal(true)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Akun COA Baru
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-3">Kode Akun</th>
                    <th className="p-3">Nama Akun (COA)</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3">Cost / Profit Center</th>
                    <th className="p-3 text-right">Saldo Saat Ini</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {glAccounts.map((acc) => (
                    <tr key={acc.accountCode} className="hover:bg-slate-800/40 font-mono">
                      <td className="p-3 font-bold text-cyan-400">{acc.accountCode}</td>
                      <td className="p-3 font-sans font-semibold text-slate-200">{acc.accountName}</td>
                      <td className="p-3 font-sans">
                        <span className="rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                          {acc.category}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-400">{acc.costCenter}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        Rp {acc.balance.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Real-time Journal Entries Table */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <FileText className="h-4 w-4 text-cyan-400" /> Log Jurnal Umum (General Journal Log Auto-Posted)
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-3">Waktu & No. Jurnal</th>
                    <th className="p-3">Deskripsi Transaksi</th>
                    <th className="p-3">Kode Akun</th>
                    <th className="p-3">Cost Center</th>
                    <th className="p-3 text-right">Debit</th>
                    <th className="p-3 text-right">Kredit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {journalEntries.map((je) => (
                    <tr key={je.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="text-slate-200 font-bold">{je.journalNo}</div>
                        <div className="text-[10px] text-slate-500">{je.date}</div>
                      </td>
                      <td className="p-3 font-sans text-slate-200">{je.description}</td>
                      <td className="p-3 text-cyan-400 font-bold">{je.accountCode} ({je.accountName})</td>
                      <td className="p-3 font-sans text-slate-400">{je.costCenter}</td>
                      <td className="p-3 text-right font-bold text-emerald-400">
                        {je.debit > 0 ? `Rp ${je.debit.toLocaleString('id-ID')}` : '-'}
                      </td>
                      <td className="p-3 text-right font-bold text-cyan-300">
                        {je.credit > 0 ? `Rp ${je.credit.toLocaleString('id-ID')}` : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RCM & CLAIMS PIPELINE */}
      {activeTab === 'rcm' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" /> Pipeline Klaim BPJS Kesehatan & Asuransi (INA-CBGs)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verifikasi agruping klaim, tarif INA-CBGs vs Biaya Riil RS, dan auto-submit ke V-Claim BPJS 4.0.
                </p>
              </div>

              <button
                onClick={handleSubmitBatchClaims}
                disabled={isSubmittingBatchClaim}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSubmittingBatchClaim ? 'animate-spin' : ''}`} />
                {isSubmittingBatchClaim ? 'Memproses V-Claim BPJS...' : 'Submit Batch Klaim V-Claim'}
              </button>
            </div>

            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div>
                      <span className="font-bold text-white text-sm">{claim.patientName}</span>
                      <span className="text-xs text-slate-400 ml-2 font-mono">({claim.norm})</span>
                      <span className="text-xs text-cyan-400 font-mono ml-2 font-semibold">SEP: {claim.sepNumber}</span>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        claim.claimStatus === 'Approved Payout'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : claim.claimStatus === 'Disputed / Pending Revision'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}
                    >
                      {claim.claimStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Kode & Agrupin INA-CBGs:</span>
                      <span className="font-bold text-cyan-300 font-mono">{claim.inaCbgCode}</span>
                      <p className="text-slate-300 text-[11px] mt-0.5">{claim.inaCbgDescription}</p>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Perbandingan Biaya:</span>
                      <div className="flex justify-between items-center font-mono mt-1">
                        <span className="text-emerald-400 font-bold">Tarif CBGs: Rp {claim.inaCbgTariff.toLocaleString('id-ID')}</span>
                        <span className="text-slate-300">Biaya Riil: Rp {claim.actualHospitalCost.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Selisih Margin RS:</span>
                      <span
                        className={`font-bold font-mono text-sm block mt-1 ${
                          claim.inaCbgTariff >= claim.actualHospitalCost ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {claim.inaCbgTariff >= claim.actualHospitalCost ? '+' : ''}
                        Rp {(claim.inaCbgTariff - claim.actualHospitalCost).toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  {claim.denialReason && (
                    <div className="bg-rose-950/30 border border-rose-500/30 p-3 rounded-lg text-xs space-y-1">
                      <div className="font-bold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-rose-300" /> Catatan Dispute / Fraud Checker: {claim.denialReason}
                      </div>
                      <p className="text-cyan-300 text-[11px] font-mono">
                        💡 AI Suggested Resolution: {claim.aiSuggestedFix}
                      </p>
                      <button
                        onClick={() => {
                          setClaims(
                            claims.map(c =>
                              c.id === claim.id
                                ? { ...c, claimStatus: 'Submitted V-Claim', denialReason: undefined }
                                : c
                            )
                          );
                          showToast('Revisi klaim berhasil disubmit kembali ke BPJS.');
                        }}
                        className="mt-1 px-2.5 py-1 bg-cyan-600 text-white font-bold rounded text-[10px]"
                      >
                        Terapkan Perbaikan AI & Re-Submit
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REVENUE LEAKAGE AI */}
      {activeTab === 'leakage_ai' && (
        <div className="space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-400" /> AI Revenue Leakage & Fraud Detection Engine
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Mendeteksi ketidaksesuaian antara BHP/Alkes terpakai pada sistem EMR/IoT dengan tagihan kasir billing.
              </p>
            </div>

            <button
              onClick={handleRunAiLeakageScan}
              disabled={isScanningLeakage}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow"
            >
              <Sparkles className={`w-4 h-4 text-cyan-200 ${isScanningLeakage ? 'animate-spin' : ''}`} />
              {isScanningLeakage ? 'Scanning EMR & IoT System...' : 'Jalankan Scan Leakage AI'}
            </button>
          </div>

          <div className="space-y-3">
            {leakageAlerts.map((leak) => (
              <div key={leak.id} className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <ShieldAlert className="h-4 w-4 text-cyan-400" /> Deteksi Unbilled Item: {leak.patientName} ({leak.norm})
                  </div>
                  <span className="font-bold text-amber-300 text-xs font-mono">
                    Potensi Terlewat: Rp {leak.potentialValue.toLocaleString('id-ID')}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed">
                  Terdeteksi pemakaian <strong className="text-amber-300">{leak.unbilledItem}</strong> via <span className="text-cyan-400">{leak.detectedBy}</span>, tetapi belum tercatat pada Billing Invoice.
                </p>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleFixLeakage(leak.id, leak.potentialValue)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow"
                  >
                    Auto-Add ke Invoice Billing
                  </button>
                </div>
              </div>
            ))}

            {leakageAlerts.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-xs font-mono">
                Semua pemakaian BHP & tindakan medis telah sesuai dengan Billing Kasir. Tidak ada kebocoran pendapatan.
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: PAYMENT KASIR */}
      {paymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 space-y-5 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-400" /> Pembayaran Billing Kasir
              </h3>
              <button onClick={() => setPaymentModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Pasien / NORM:</span>
                <span className="font-bold text-white">{paymentModal.patientName} ({paymentModal.norm})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Tagihan:</span>
                <span className="font-bold text-white">Rp {paymentModal.totalAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-1">
                <span className="text-slate-400">Sisa Harus Dibayar:</span>
                <span className="font-bold text-emerald-400 text-sm">Rp {paymentModal.remainingBalance.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 block">Pilih Kanal Pembayaran Integrasi:</label>
              <div className="grid grid-cols-2 gap-2">
                {(['QRIS', 'Virtual Account', 'Credit Card', 'Cash', 'BPJS Direct'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setPaymentMethod(m)}
                    className={`rounded-xl p-2.5 font-bold border transition text-center ${
                      paymentMethod === m
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod === 'QRIS' && (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-2">
                <QrCode className="w-20 h-20 text-emerald-400 mx-auto" />
                <p className="text-[10px] text-slate-400 font-mono">Scan QRIS Kasir RS via Mobile Banking / E-Wallet</p>
              </div>
            )}

            <button
              onClick={processPayment}
              className="w-full rounded-xl bg-emerald-500 py-3 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-xl transition"
            >
              Konfirmasi Pelunasan & Terbitkan E-Receipt
            </button>
          </div>
        </div>
      )}

      {/* MODAL: E-RECEIPT VIEWER */}
      {receiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Kuitansi Resmi E-Receipt Rumah Sakit</h3>
              <button onClick={() => setReceiptModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white text-slate-900 p-6 rounded-xl space-y-4 font-sans border shadow">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg text-emerald-950 uppercase">RUMAH SAKIT SMART MEDIKA</h2>
                  <p className="text-[10px] text-slate-600">Jl. Healthcare Avenue No. 88 • Telp: (021) 555-7890 • SIMRS Certified</p>
                </div>
                <div className="text-right text-[10px]">
                  <p className="font-bold text-emerald-900">KUITANSI LUNAS</p>
                  <p className="font-mono">{receiptModal.invoiceNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="font-bold">Pasien:</span> {receiptModal.patientName} ({receiptModal.norm})</div>
                <div><span className="font-bold">Tanggal:</span> {receiptModal.createdDate}</div>
                <div><span className="font-bold">Layanan:</span> {receiptModal.visitType}</div>
                <div><span className="font-bold">Metode Bayar:</span> {receiptModal.paymentMethod || 'Kasir Cash/QRIS'}</div>
              </div>

              <div className="space-y-1.5 border-t pt-2 text-[11px]">
                <div className="flex justify-between"><span>Biaya Pendaftaran</span><span>Rp {receiptModal.registrationFee.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Konsultasi Dokter</span><span>Rp {receiptModal.consultationFee.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Laboratorium</span><span>Rp {receiptModal.labFee.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Radiologi</span><span>Rp {receiptModal.radiologyFee.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between"><span>Obat & Farmasi</span><span>Rp {receiptModal.pharmacyFee.toLocaleString('id-ID')}</span></div>
                <div className="flex justify-between font-bold border-t border-slate-900 pt-1 text-emerald-900">
                  <span>TOTAL LUNAS</span>
                  <span>Rp {receiptModal.totalAmount.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-end text-[10px]">
                <div className="text-center">
                  <QrCode className="w-12 h-12 text-slate-900 mx-auto" />
                  <p className="text-slate-500 font-mono mt-1">Verified e-Receipt</p>
                </div>
                <div className="text-right">
                  <p>Petugas Kasir Sentral</p>
                  <p className="font-bold underline mt-6">Kasir RS Smart Medika</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                  showToast('Perintah cetak kuitansi berhasil dikirim.');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow"
              >
                <Printer className="w-4 h-4" /> Cetak Kuitansi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW INVOICE */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Terbitkan Invoice Billing Baru</h3>
              <button onClick={() => setShowNewInvoiceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Nama Pasien</label>
                  <input
                    type="text"
                    required
                    value={newInvPatient}
                    onChange={(e) => setNewInvPatient(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">NORM Pasien</label>
                  <input
                    type="text"
                    required
                    value={newInvNorm}
                    onChange={(e) => setNewInvNorm(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Jenis Kunjungan</label>
                <select
                  value={newInvVisitType}
                  onChange={(e) => setNewInvVisitType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                >
                  <option value="Rawat Jalan">Rawat Jalan</option>
                  <option value="Rawat Inap">Rawat Inap</option>
                  <option value="IGD">IGD Emergency</option>
                  <option value="MCU">Medical Check Up (MCU)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Biaya Konsultasi (Rp)</label>
                  <input
                    type="number"
                    value={newConsultFee}
                    onChange={(e) => setNewConsultFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Biaya Lab (Rp)</label>
                  <input
                    type="number"
                    value={newLabFee}
                    onChange={(e) => setNewLabFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Biaya Radiologi (Rp)</label>
                  <input
                    type="number"
                    value={newRadFee}
                    onChange={(e) => setNewRadFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Biaya Farmasi (Rp)</label>
                  <input
                    type="number"
                    value={newPharmFee}
                    onChange={(e) => setNewPharmFee(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  Terbitkan Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW COA */}
      {showNewCoaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Tambah Akun COA Baru</h3>
              <button onClick={() => setShowNewCoaModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoa} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Kode Akun COA</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 1105-02"
                  value={newAccountCode}
                  onChange={(e) => setNewAccountCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Akun (COA Name)</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Deposito Bank BCA Operational"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kategori Akun</label>
                <select
                  value={newAccountCategory}
                  onChange={(e) => setNewAccountCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Asset">Asset (Aset / Aktiva)</option>
                  <option value="Liability">Liability (Kewajiban / Pasiva)</option>
                  <option value="Equity">Equity (Ekuitas / Modal)</option>
                  <option value="Revenue">Revenue (Pendapatan)</option>
                  <option value="Expense">Expense (Beban / Operasional)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Cost Center / Unit</label>
                <input
                  type="text"
                  value={newCostCenter}
                  onChange={(e) => setNewCostCenter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewCoaModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
