import React, { useState } from 'react';
import {
  Megaphone,
  Users,
  Award,
  MessageSquare,
  Sparkles,
  Send,
  Plus,
  Search,
  CheckCircle2,
  TrendingUp,
  Heart,
  Share2,
  PhoneCall
} from 'lucide-react';
import { MOCK_CRM_MEMBERS, MOCK_MARKETING_CAMPAIGNS } from '../data/mockData';
import { CRMMember, MarketingCampaign } from '../types';

export const CRMMarketingView: React.FC = () => {
  const [members, setMembers] = useState<CRMMember[]>(MOCK_CRM_MEMBERS);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(MOCK_MARKETING_CAMPAIGNS);
  const [activeTab, setActiveTab] = useState<'loyalty' | 'campaigns' | 'feedback'>('loyalty');

  // Mock Feedback Complaints
  const [complaints, setComplaints] = useState([
    {
      id: 'CMP-001',
      patientName: 'Siti Rahmawati',
      norm: 'RM-2026-0089',
      date: '2026-08-02',
      unit: 'Poliklinik Kebidanan',
      rating: 9,
      category: 'NPS Promoters',
      comment: 'Pelayanan dokter dan suster sangat ramah. Waktu tunggu farmasi juga sangat cepat!',
      status: 'Resolved',
      sentiment: 'Positive'
    },
    {
      id: 'CMP-002',
      patientName: 'Ahmad Dahlan',
      norm: 'RM-2026-0012',
      date: '2026-08-01',
      unit: 'Instalasi Farmasi',
      rating: 6,
      category: 'NPS Passive',
      comment: 'Anrean kasir farmasi sedikit padat saat jam makan siang. Mohon ditambah loket.',
      status: 'In Progress',
      sentiment: 'Neutral'
    }
  ]);

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="rounded-xl border border-rose-500/30 bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-inner">
              <Megaphone className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">CRM, Patient Loyalty & Marketing Automation</h1>
                <span className="rounded-full bg-rose-500/20 px-3 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
                  Omnichannel WA & AI Target
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Layanan loyalitas pasien: Tiering VIP, Poin Reward, Kampanye Terjadwal WhatsApp, Segmentasi Kronis AI & NPS Feedback Survey.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const title = prompt('Judul Kampanye Broadcast WhatsApp Baru:', 'Pemeriksaan Kesehatan Jantung (MCU Cardio) Diskon 20%');
                if (title) {
                  const cmp: MarketingCampaign = {
                    id: `cmp-${Date.now()}`,
                    title,
                    channel: 'WhatsApp',
                    targetSegment: 'Executive VIP',
                    scheduledDate: new Date().toISOString().substring(0, 10),
                    sentCount: 1200,
                    conversionRate: 31.5,
                    aiTargetRecommendation: 'Kirimkan voucher diskon Rp 100.000 ke segmen Gold & Platinum VIP.',
                    status: 'Scheduled'
                  };
                  setCampaigns([cmp, ...campaigns]);
                }
              }}
              className="flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-400 shadow-lg transition"
            >
              <Plus className="h-4 w-4" />
              Buat Kampanye WhatsApp Baru
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('loyalty')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'loyalty' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Award className="h-4 w-4" />
          Pasien Loyalty Membership & Points ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'campaigns' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Megaphone className="h-4 w-4" />
          Marketing Automation & Segmentasi AI ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'feedback' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Voice of Patient (NPS Survey & Complaints)
        </button>
      </div>

      {/* TAB LOYALTY MEMBERS */}
      {activeTab === 'loyalty' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((m) => (
            <div key={m.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{m.patientName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{m.norm} • Segment: {m.segment}</p>
                </div>
                <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                  {m.tier}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px]">Poin Loyalitas:</span>
                  <span className="font-bold text-amber-400 text-base">{m.loyaltyPoints.toLocaleString('id-ID')} Poin</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Skor Kepuasan NPS:</span>
                  <span className="font-bold text-emerald-400 text-base">{m.npsScore} / 10 ⭐</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kontak WhatsApp:</span>
                  <span className="font-mono text-slate-200">{m.phoneWhatsApp}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Kunjungan Terakhir:</span>
                  <span className="text-slate-300">{m.lastVisitDate}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => alert(`Voucher Gratis Konsultasi Sp.PD / MCU Diskon 50% Berhasil Diterbitkan & Dikirim ke WA ${m.patientName}`)}
                  className="rounded bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
                >
                  Tukarkan Poin / Kirim Voucher VIP
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB CAMPAIGNS */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          {campaigns.map((cmp) => (
            <div key={cmp.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{cmp.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Kanal: {cmp.channel} • Target Segment: <span className="text-rose-300 font-semibold">{cmp.targetSegment}</span></p>
                </div>
                <span className="rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  {cmp.status}
                </span>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-cyan-300 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Rekomendasi AI: {cmp.aiTargetRecommendation}</span>
              </div>

              <div className="flex justify-between items-center text-xs text-slate-400 pt-1">
                <span>Penerima: {cmp.sentCount.toLocaleString('id-ID')} Pasien</span>
                <span className="font-bold text-emerald-400">Tingkat Konversi Reservasi: {cmp.conversionRate}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB VOICE OF PATIENT & COMPLAINTS */}
      {activeTab === 'feedback' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-rose-400" /> Voice of Patient (NPS Survey & Penanganan Keluhan)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Survei kepuasan pelanggan otomatis paska rawat inap/jalan & ticketing komplain pelayanan.
            </p>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{c.patientName} ({c.norm})</h4>
                    <p className="text-xs text-slate-400">Unit: {c.unit} • Tanggal: {c.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                      NPS Score: {c.rating}/10 ⭐
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 italic">
                  "{c.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
