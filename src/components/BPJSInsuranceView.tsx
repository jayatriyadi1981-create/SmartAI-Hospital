import React, { useState } from 'react';
import {
  ShieldCheck,
  FileCheck,
  Fingerprint,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Search,
  Plus,
  RefreshCw,
  Clock,
  Send,
  Building,
  HelpCircle
} from 'lucide-react';
import { MOCK_BPJS_CLAIMS } from '../data/mockData';
import { BPJSSEPClaim } from '../types';

export const BPJSInsuranceView: React.FC = () => {
  const [claims, setClaims] = useState<BPJSSEPClaim[]>(MOCK_BPJS_CLAIMS);
  const [activeTab, setActiveTab] = useState<'vclaim' | 'eklaim' | 'risk_ai'>('vclaim');
  const [searchTerm, setSearchTerm] = useState('');

  const [newSepModal, setNewSepModal] = useState(false);
  const [sepBpjsNo, setSepBpjsNo] = useState('0001428819231');
  const [sepPatientName, setSepPatientName] = useState('Ahmad Dahlan');

  const createSep = () => {
    const newClaim: BPJSSEPClaim = {
      id: `bpjs-${Date.now()}`,
      sepNumber: `0001R0010826V000${Math.floor(100 + Math.random() * 900)}`,
      patientName: sepPatientName,
      bpjsCardNumber: sepBpjsNo,
      norm: 'RM-2026-001',
      serviceType: 'Rawat Jalan (RJTP)',
      inacbgCode: 'Q-5-24-I',
      inacbgDescription: 'Pemeriksaan Kesehatan Rawat Jalan Sp.PD',
      estimatedClaimAmount: 240000,
      approvedClaimAmount: 0,
      claimStatus: 'SEP Issued',
      aiRejectionRisk: 'Low',
      aiRiskNotes: 'Dapat diterbitkan SEP. Fingerprint terverifikasi di V-Claim Bridging.'
    };
    setClaims([newClaim, ...claims]);
    setNewSepModal(false);
    alert(`SEP BPJS ${newClaim.sepNumber} Berhasil Diterbitkan via Bridging VClaim 2.0!`);
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">BPJS V-Claim, INA-CBG & Insurance Bridging</h1>
                <span className="rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                  SATUSEHAT Ready
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Penerbitan SEP Realtime, Bridging VClaim 2.0, Verifikasi Fingerprint, e-Klaim INA-CBG & AI Audit Klaim Anti-Pending.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewSepModal(true)}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 shadow-lg transition"
            >
              <Plus className="h-4 w-4" />
              Terbitkan SEP BPJS Baru
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('vclaim')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'vclaim' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          VClaim & SEP Active ({claims.length})
        </button>
        <button
          onClick={() => setActiveTab('eklaim')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'eklaim' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Building className="h-4 w-4" />
          e-Klaim INA-CBG Grouping
        </button>
        <button
          onClick={() => setActiveTab('risk_ai')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'risk_ai' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-cyan-400" />
          AI Claim Risk Predictor (Anti-Pending)
        </button>
      </div>

      {/* TAB VCLAIM */}
      {activeTab === 'vclaim' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari Nomor SEP, No Kartu BPJS, atau Nama Pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Fingerprint className="h-4 w-4 text-emerald-400" /> Fingerprint Terminal: <span className="text-emerald-400 font-bold">ONLINE (100% Match)</span>
            </div>
          </div>

          <div className="space-y-4">
            {claims.map((cl) => (
              <div key={cl.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-lg">{cl.patientName}</span>
                      <span className="text-xs text-slate-400 font-mono">No. BPJS: {cl.bpjsCardNumber}</span>
                      <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300">{cl.serviceType}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                      No. SEP: <span className="text-indigo-400 font-semibold">{cl.sepNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold border ${
                        cl.claimStatus === 'Approved' || cl.claimStatus === 'Paid BPJS'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : cl.claimStatus === 'Disputed / Pending'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                      }`}
                    >
                      {cl.claimStatus}
                    </span>

                    <button
                      onClick={() => alert(`Submit Klaim e-Klaim INA-CBG untuk SEP ${cl.sepNumber}`)}
                      className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition"
                    >
                      Submit e-Klaim
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[11px]">Kode & Deskripsi INA-CBG:</div>
                    <div className="font-bold text-slate-200">{cl.inacbgCode} - {cl.inacbgDescription}</div>
                    <div className="text-cyan-400 font-mono font-bold mt-1">
                      Estimasi Tarif CBG: Rp {cl.estimatedClaimAmount.toLocaleString('id-ID')}
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[11px]">AI Audit Anti-Pending:</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cl.aiRejectionRisk === 'Low' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {cl.aiRejectionRisk}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{cl.aiRiskNotes}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB E-KLAIM INA-CBG GROUPER */}
      {activeTab === 'eklaim' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-400" /> E-Klaim INA-CBG 5.8 Grouping Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kalkulator Grouping INA-CBG berdasarkan Diagnosa Utama, Sekunder, Prosedur ICD-9-CM, dan Level Keparahan (Severity Level I, II, III).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {claims.map((cl) => (
              <div key={cl.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-100 text-sm">{cl.patientName}</span>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-mono px-2 py-0.5 rounded">
                    {cl.inacbgCode}
                  </span>
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  {cl.inacbgDescription}
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-xs">
                  <span className="text-slate-400">Tarif Grouping:</span>
                  <span className="font-extrabold text-emerald-400 font-mono">Rp {cl.estimatedClaimAmount.toLocaleString('id-ID')}</span>
                </div>
                <button
                  onClick={() => alert(`Proses Re-Grouping INA-CBG untuk ${cl.patientName}`)}
                  className="w-full bg-slate-800 hover:bg-indigo-600 text-indigo-200 hover:text-white text-xs font-semibold py-2 rounded-lg transition"
                >
                  Hitung Ulang Grouping INA-CBG
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB AI CLAIM RISK PREDICTOR */}
      {activeTab === 'risk_ai' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" /> AI Claim Audit Engine (Anti-Pending & Dispute Avoidance)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Pemeriksaan berkas klaim otomatis sebelum disubmit ke verifikator BPJS untuk mencegah klaim pending/dispute.
            </p>
          </div>

          <div className="space-y-3">
            {claims.map((cl) => (
              <div key={cl.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{cl.patientName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      cl.aiRejectionRisk === 'Low' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      Risk: {cl.aiRejectionRisk}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{cl.aiRiskNotes}</p>
                </div>
                <button
                  onClick={() => alert(`Saran AI Auto-Fix Diterapkan pada berkas klaim ${cl.sepNumber}`)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 transition"
                >
                  Terapkan Auto-Fix AI
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New SEP Modal */}
      {newSepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-indigo-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-slate-100 text-lg border-b border-slate-800 pb-2">
              Terbitkan SEP BPJS Kesehatan (Bridging VClaim 2.0)
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Nomor Kartu BPJS Pasien:</label>
                <input
                  type="text"
                  value={sepBpjsNo}
                  onChange={(e) => setSepBpjsNo(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 p-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Nama Pasien Sesuai Kartu:</label>
                <input
                  type="text"
                  value={sepPatientName}
                  onChange={(e) => setSepPatientName(e.target.value)}
                  className="w-full rounded border border-slate-700 bg-slate-950 p-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setNewSepModal(false)}
                className="flex-1 rounded-lg bg-slate-800 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
              >
                Batal
              </button>
              <button
                onClick={createSep}
                className="flex-1 rounded-lg bg-indigo-500 py-2.5 text-xs font-bold text-white hover:bg-indigo-400"
              >
                Cetak SEP Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
