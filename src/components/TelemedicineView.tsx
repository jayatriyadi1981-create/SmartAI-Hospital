/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  FileText,
  Pill,
  Send,
  Activity,
  Heart,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  Share2,
  Maximize2,
  MessageSquare,
  Plus,
  Tv
} from 'lucide-react';
import { MOCK_PATIENTS } from '../data/mockData';

export const TelemedicineView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'consultation' | 'eprescription' | 'rpm' | 'schedule'>('consultation');
  
  // Video Stream Simulation Controls
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);
  const [activePatient, setActivePatient] = useState(MOCK_PATIENTS[0]);

  // Live AI Transcript
  const [aiTranscript, setAiTranscript] = useState([
    { sender: 'Pasien (Ahmad Dahlan)', time: '10:02', text: 'Selamat pagi dokter, saya mengeluh pusing di kepala bagian belakang dan leher kaku sejak semalam.' },
    { sender: 'Dokter (dr. Budi Hartono)', time: '10:03', text: 'Selamat pagi Pak Ahmad. Apakah ada keluhan mual, pandangan kabur, atau tensi naik sebelumnya?' },
    { sender: 'Pasien (Ahmad Dahlan)', time: '10:03', text: 'Saya sempat cek pakai tensimeter digital di rumah semalam, angkanya 150/90.' },
    { sender: 'AI Clinical Assistant', time: '10:04', text: '💡 Auto-Suggest SOAP: Subjective: Cephalgia occipital & neck stiffness. Tensimeter mandiri: 150/90 mmHg. Diagnosa awal: Suspek Hipertensi Derajat 1 (ICD-10 I10).' }
  ]);

  // E-Prescription Telemedicine State
  const [teleDrugs, setTeleDrugs] = useState([
    { drugName: 'Amlodipine Besylate 5mg', dose: '1x1 Tablet Pagi', qty: 30, note: 'Sesudah makan' },
    { drugName: 'Paracetamol 500mg', dose: '3x1 Tablet bila pusing', qty: 10, note: 'PRN pusing' }
  ]);

  // Remote Patient Monitoring (RPM) Live Feed
  const [rpmVitals, setRpmVitals] = useState({
    bp: '148/88 mmHg',
    hr: 82,
    spO2: 98,
    glucose: 135,
    lastSync: '10 detik lalu via SmartWatch / Bluetooth Oximeter'
  });

  return (
    <div className="space-y-6 text-slate-100 p-2 sm:p-4">
      {/* Banner Header */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
              <Video className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">Telemedicine & AI Smart Consultation Studio</h1>
                <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live WebRTC Studio
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Konsultasi Dokter-Pasien Jarak Jauh HD, AI Live Medical Transcribe, E-Prescribing Langsung Kirim WA & Integrasi IoT RPM.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Sesi Telemedis Baru Dijadwalkan & Link WA Terkirim ke Pasien!')}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg transition"
            >
              <Plus className="h-4 w-4" />
              Jadwalkan Konsultasi Pasien
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'consultation', label: 'Ruang Video Call HD & AI Transcribe', icon: Video },
          { id: 'eprescription', label: 'E-Prescription & Surat Izin Sakit', icon: Pill },
          { id: 'rpm', label: 'Remote Patient Monitoring (IoT RPM)', icon: Activity },
          { id: 'schedule', label: 'Jadwal & Antrian Online Pasien', icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium transition ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: VIDEO CONSULTATION STUDIO */}
      {activeTab === 'consultation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Stream Frame */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
              {/* Background Patient Stream Simulation */}
              {isCallActive ? (
                <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
                    alt="Patient Video Stream"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60"></div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center text-slate-500 space-y-2">
                  <PhoneOff className="w-12 h-12 text-rose-500/80" />
                  <p className="text-sm font-semibold text-slate-400">Panggilan Telemedis Berakhir</p>
                </div>
              )}

              {/* Video Stream Header Overlay */}
              <div className="relative z-10 flex items-center justify-between bg-slate-950/70 backdrop-blur-md p-3 rounded-xl border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img
                    src={activePatient.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                    alt={activePatient.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-cyan-400"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm">{activePatient.fullName}</h3>
                    <p className="text-[10px] text-cyan-300 font-mono">RM: {activePatient.norm} • NIK: {activePatient.nik}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span> REC 00:14:28
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    HD 1080p WebRTC
                  </span>
                </div>
              </div>

              {/* PIP Doctor Self View Overlay */}
              {isCallActive && (
                <div className="absolute right-4 bottom-20 w-36 aspect-video bg-slate-900 border-2 border-cyan-500/60 rounded-xl overflow-hidden shadow-2xl z-10">
                  <img
                    src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300"
                    alt="Doctor Self View"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[9px] text-slate-200 font-bold">
                    dr. Budi, Sp.PD
                  </div>
                </div>
              )}

              {/* Bottom Video Controls Bar */}
              <div className="relative z-10 flex items-center justify-between bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                      isAudioOn ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}
                  >
                    {isAudioOn ? <Mic className="w-4 h-4 text-cyan-400" /> : <MicOff className="w-4 h-4 text-red-400" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                      isVideoOn ? 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700' : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}
                  >
                    {isVideoOn ? <Video className="w-4 h-4 text-cyan-400" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                  </button>

                  <button
                    onClick={() => alert('Membuka Gambar PACS DICOM Hasil Rontgen Pasien untuk Di-share ke Layar')}
                    className="p-2.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition flex items-center gap-1.5 text-xs font-semibold"
                  >
                    <Tv className="w-4 h-4 text-amber-400" /> Share PACS Image
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsCallActive(!isCallActive)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg ${
                      isCallActive ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    }`}
                  >
                    <PhoneOff className="w-4 h-4" />
                    {isCallActive ? 'Akhiri Sesi Telemedis' : 'Mulai Panggilan'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* AI Transcriber & Clinical Assistant Sidebar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Live AI Transcribe & SOAP
                </h4>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  Gemini Medical NLP
                </span>
              </div>

              {/* Transcript Chat Stream */}
              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1 text-xs">
                {aiTranscript.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border ${
                      msg.sender.includes('AI')
                        ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                        : msg.sender.includes('Dokter')
                        ? 'bg-slate-800/80 border-slate-700 text-slate-200'
                        : 'bg-slate-950 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-bold opacity-75 mb-1">
                      <span>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                alert('Catatan SOAP otomatis ditransfer ke Lembar Rekam Medis (EMR) Pasien!');
              }}
              className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:brightness-110 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
            >
              <FileText className="w-4 h-4" /> Transfer Transcript ke EMR Pasien
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: E-PRESCRIPTION TELEMEDICINE */}
      {activeTab === 'eprescription' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-400" /> Penerbitan E-Resep Telemedis & Surat Keterangan
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                E-Prescription resmi bertanda tangan digital terhubung ke Kurir Farmasi RS & WhatsApp Pasien.
              </p>
            </div>
            <button
              onClick={() => {
                const name = prompt('Nama Obat E-Resep Baru:', 'Candesartan 8mg');
                if (name) {
                  setTeleDrugs([...teleDrugs, { drugName: name, dose: '1x1 Tab Malam', qty: 30, note: 'Sesudah makan' }]);
                }
              }}
              className="bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-teal-400 transition"
            >
              + Tambah Obat E-Resep
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Daftar Obat E-Prescription Telemedis</h4>
              {teleDrugs.map((d, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <div>
                    <div className="font-bold text-white text-sm">{d.drugName}</div>
                    <div className="text-slate-400 mt-0.5">Aturan Pakai: {d.dose} • Keterangan: {d.note}</div>
                  </div>
                  <div className="text-right font-mono font-bold text-cyan-400">
                    {d.qty} Tablet
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <QrCode className="w-4 h-4 text-cyan-400" /> QR Verifikasi Digital Resep
              </h4>
              <div className="flex justify-center p-4 bg-white rounded-xl">
                <div className="text-slate-950 font-mono text-center text-xs">
                  <div className="font-bold text-sm">TELE-RX-2026-9901</div>
                  <div className="text-[10px] text-slate-600 mt-1">[QR-CODE-VERIFIED-SATUSEHAT]</div>
                </div>
              </div>
              <button
                onClick={() => alert('E-Resep Telemedis Berhasil Terkirim ke WhatsApp Pasien & Depo Farmasi!')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4" /> Kirim E-Resep via WA Pasien
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REMOTE PATIENT MONITORING (RPM) */}
      {activeTab === 'rpm' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400 animate-pulse" /> Tele-Monitoring Tanda Vital Pasien (IoT RPM)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pemantauan jarak jauh via alat medis Bluetooth terhubung (Tensimeter, Oximeter, CGMS, ECG Patch).
              </p>
            </div>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
              Status Sinkronisasi: Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 text-xs font-semibold">Tekanan Darah (NIBP)</span>
              <div className="text-2xl font-black text-rose-400">{rpmVitals.bp}</div>
              <p className="text-[10px] text-slate-500">{rpmVitals.lastSync}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 text-xs font-semibold">Laju Jantung (HR)</span>
              <div className="text-2xl font-black text-cyan-400 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-bounce" /> {rpmVitals.hr} bpm
              </div>
              <p className="text-[10px] text-slate-500">Irama Sinus Normal</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 text-xs font-semibold">Saturasi Oksigen (SpO2)</span>
              <div className="text-2xl font-black text-emerald-400">{rpmVitals.spO2}%</div>
              <p className="text-[10px] text-slate-500">Normal Range</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 text-xs font-semibold">Gula Darah Sewaktu (CGM)</span>
              <div className="text-2xl font-black text-amber-400">{rpmVitals.glucose} mg/dL</div>
              <p className="text-[10px] text-slate-500">Sensor Dexcom G7 Connected</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SCHEDULE & QUEUE */}
      {activeTab === 'schedule' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" /> Antrian Sesi Telemedis Hari Ini
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Ahmad Dahlan', time: '10:00 WIB', status: 'Sedang Berlangsung', doctor: 'dr. Budi Hartono, Sp.PD' },
              { name: 'Siti Rahmawati', time: '10:30 WIB', status: 'Menunggu Dokter', doctor: 'dr. Budi Hartono, Sp.PD' },
              { name: 'Dewi Lestari', time: '11:00 WIB', status: 'Terkonfirmasi', doctor: 'dr. Anisa, Sp.A' }
            ].map((q, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <div>
                  <div className="font-bold text-white text-sm">{q.name}</div>
                  <div className="text-slate-400 mt-0.5">Jadwal: {q.time} • Dokter: {q.doctor}</div>
                </div>
                <span className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                  q.status === 'Sedang Berlangsung' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300'
                }`}>
                  {q.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
