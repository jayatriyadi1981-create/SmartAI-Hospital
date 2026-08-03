/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  Check
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = notifications.filter(
    (n) => activeFilter === 'All' || n.category === activeFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-5 shadow-2xl flex flex-col justify-between text-slate-100">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-cyan-400" />
              <h2 className="font-bold text-base text-white">Center Notifikasi Live</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-between mt-3 mb-3">
            <div className="flex gap-1 overflow-x-auto text-xs pb-1 custom-scrollbar">
              {['All', 'Emergency', 'Laboratorium', 'BPJS', 'Farmasi', 'Keuangan'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`rounded-lg px-2.5 py-1 font-semibold whitespace-nowrap text-[11px] transition ${
                    activeFilter === cat
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-cyan-400 hover:underline shrink-0"
            >
              Tandai Dibaca
            </button>
          </div>

          <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`rounded-xl border p-3.5 space-y-1 text-xs transition ${
                  item.priority === 'urgent'
                    ? 'border-rose-500/40 bg-rose-950/20'
                    : item.priority === 'high'
                    ? 'border-amber-500/40 bg-amber-950/20'
                    : 'border-slate-800 bg-slate-950/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{item.timestamp}</span>
                </div>
                <h4 className="font-bold text-white text-xs">{item.title}</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Push Notifications Disinkronkan dengan Sistem RSUD Smart Medika
          </p>
        </div>
      </div>
    </div>
  );
};
