/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Building2,
  Sparkles,
  CheckCircle2,
  Clock,
  UserPlus,
  FileSpreadsheet,
  Stethoscope,
  Pill,
  FlaskConical,
  Scan,
  ShieldCheck,
  Receipt,
  Users,
  Calendar,
  ArrowRight
} from 'lucide-react';

interface PlaceholderModuleViewProps {
  moduleTitle: string;
  onNavigate: (viewId: string) => void;
}

export const PlaceholderModuleView: React.FC<PlaceholderModuleViewProps> = ({
  moduleTitle,
  onNavigate
}) => {
  const isPrompt2Target = [
    'Pendaftaran',
    'Pasien',
    'Medical Record',
    'Rawat Jalan',
    'BPJS'
  ].includes(moduleTitle);

  return (
    <div className="space-y-6 pb-12">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
              MODUL ENTERPRISE HMS
            </span>
            <span className="text-xs text-slate-400">| RSUD Smart Medika</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl mt-1">
            MODUL: {moduleTitle.toUpperCase()}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Integrasi Layanan & Otomatisasi Alur Kerja Medis Terintegrasi AI Platform.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isPrompt2Target ? (
            <span className="rounded-xl bg-cyan-500/20 border border-cyan-500/40 px-3 py-1.5 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Target Pengembangan Utama Prompt 2
            </span>
          ) : (
            <span className="rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              Sistem Aktif & Terhubung
            </span>
          )}
        </div>
      </div>

      {/* Interactive Module Showcase Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
              1. Status Konektivitas Data
            </span>
            <p className="text-xs text-slate-300">
              Terhubung dengan PostgreSQL Master Database & REST API Microservices.
            </p>
            <span className="inline-block font-mono text-[11px] text-emerald-400">
              API Status: 200 OK
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
              2. Integrasi AI Engine
            </span>
            <p className="text-xs text-slate-300">
              Mendukung otomatisasi verifikasi data, OCR dokumen, dan AI Assistant.
            </p>
            <span className="inline-block font-mono text-[11px] text-cyan-400">
              AI Model: Gemini 3.6 Flash
            </span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
            <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider block">
              3. Hak Akses Security (RBAC)
            </span>
            <p className="text-xs text-slate-300">
              Akses terbatas sesuai dengan Role Pengguna yang aktif saat ini.
            </p>
            <span className="inline-block font-mono text-[11px] text-amber-400">
              Audit Logs: Recorded
            </span>
          </div>
        </div>

        {isPrompt2Target && (
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-5 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                Preview Fitur Modul {moduleTitle} di Prompt 2
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Pada Prompt 2, modul ini akan dikembangkan secara komprehensif mencakup: Form Pendaftaran Pasien Baru/Lama, Master Patient Index (MPI), EMR SOAP Form, Smart Queue AI (Antrian Cerdas), dan Bridging BPJS V-Claim 4.0!
              </p>
            </div>

            <button
              onClick={() => onNavigate('AI Center')}
              className="flex items-center gap-2 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-xs font-bold text-white hover:from-blue-500 hover:to-cyan-500 transition shadow-lg shadow-cyan-500/20"
            >
              <span>Uji Coba AI Clinical Assistant</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
