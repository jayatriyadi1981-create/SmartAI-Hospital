/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  User,
  Stethoscope,
  Pill,
  FileSpreadsheet,
  Building2,
  ChevronRight
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (viewId: string) => void;
}

const SEARCH_MOCKS = [
  { type: 'Pasien', title: 'Ahmad Dahlan (RM-2026-8812)', subtitle: 'Kamar Inap Gedung B Lt. 3 Bed 12', view: 'Pasien' },
  { type: 'Pasien', title: 'Siti Rahma (RM-2026-9041)', subtitle: 'ICU Gedung C Bed 4', view: 'Pasien' },
  { type: 'Dokter', title: 'dr. Ahmad Subagyo, Sp.BS', subtitle: 'Bedah Saraf - Jadwal OK 1', view: 'HRD' },
  { type: 'Dokter', title: 'dr. Maya Rosadi, Sp.BTKV', subtitle: 'Bedah Jantung - Jadwal OK 2', view: 'HRD' },
  { type: 'Obat', title: 'Paracetamol Infusion 10mg/ml 100ml', subtitle: 'Stok Depo Utama: 85 vial', view: 'Farmasi' },
  { type: 'Diagnosa', title: 'ICD-10 I10: Essential (primary) hypertension', subtitle: 'Tercover BPJS Kesehatan', view: 'Settings' },
  { type: 'Ruangan', title: 'Kamar Operasi 1 (OK 1)', subtitle: 'Gedung Bedah D Lt. 2', view: 'Command Center' },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent, but we handle Escape
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = SEARCH_MOCKS.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/80 p-4 pt-20 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl text-slate-100">
        <div className="flex items-center border-b border-slate-800 px-4 py-3">
          <Search className="h-5 w-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Ketik Nama Pasien, Nomor RM, Dokter, Kode ICD, Obat, Ruangan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent px-3 text-sm text-white placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onNavigate(item.view);
                  onClose();
                }}
                className="flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs hover:bg-slate-800 transition group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
                      {item.type}
                    </span>
                    <span className="font-bold text-white group-hover:text-cyan-300 transition">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{item.subtitle}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400" />
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              Tidak ada data yang cocok dengan pencarian "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
