import React, { useState } from 'react';
import {
  Globe,
  MessageSquare,
  QrCode,
  CheckCircle2,
  X,
  Send,
  Sparkles,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  ShieldCheck,
  Building2,
  Printer,
  ExternalLink,
  ChevronRight,
  Bot,
  Copy,
  Check,
  Upload,
  RefreshCw
} from 'lucide-react';
import { useHospitalData } from '../context/HospitalDataContext';
import { Patient } from '../types';

interface OnlineAndWhatsappRegModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'online' | 'whatsapp';
}

export const OnlineAndWhatsappRegModal: React.FC<OnlineAndWhatsappRegModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'online'
}) => {
  const { addPatient, addNotification, addActivityLog } = useHospitalData();
  const [activeTab, setActiveTab] = useState<'online' | 'whatsapp'>(defaultTab);

  // ------------------------------------------------------------------------
  // ONLINE REGISTRATION STATE
  // ------------------------------------------------------------------------
  const [onlineCategory, setOnlineCategory] = useState<'BPJS' | 'Umum' | 'Asuransi'>('BPJS');
  const [onlinePoly, setOnlinePoly] = useState('Poli Penyakit Dalam');
  const [onlineDoctor, setOnlineDoctor] = useState('dr. Budi Hartono, Sp.PD-KGEH');
  const [onlineDate, setOnlineDate] = useState('2026-08-04');
  const [onlineShift, setOnlineShift] = useState('Pagi (08:00 - 12:00 WIB)');
  const [onlineNik, setOnlineNik] = useState('');
  const [onlineName, setOnlineName] = useState('');
  const [onlinePhone, setOnlinePhone] = useState('');
  const [onlineBpjsNo, setOnlineBpjsNo] = useState('');
  const [onlineGender, setOnlineGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrDone, setOcrDone] = useState(false);
  const [submittedOnlineTicket, setSubmittedOnlineTicket] = useState<{
    norm: string;
    bookingCode: string;
    queueNumber: string;
    patientName: string;
    poly: string;
    doctor: string;
    date: string;
    shift: string;
    category: string;
  } | null>(null);

  // ------------------------------------------------------------------------
  // WHATSAPP REGISTRATION STATE
  // ------------------------------------------------------------------------
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string; card?: any }>>([
    {
      sender: 'bot',
      text: 'Selamat datang di layanan Pendaftaran WhatsApp Bot RSUD Smart Medika AI 🏥🤖.\n\nKetik format pendaftaran di bawah ini atau klik tombol menu untuk memulai pendaftaran cepat:\n\nFormat: *DAFTAR#NIK#NAMA#POLI#TANGGAL#JENIS*\nContoh: *DAFTAR#3171011508820001#Budi Santoso#Poli Dalam#2026-08-04#BPJS*',
      time: '10:00'
    }
  ]);
  const [waInputText, setWaInputText] = useState('');
  const [waQuickNik, setWaQuickNik] = useState('');
  const [waQuickName, setWaQuickName] = useState('');
  const [waQuickPoly, setWaQuickPoly] = useState('Poli Penyakit Dalam');
  const [waQuickDate, setWaQuickDate] = useState('2026-08-04');
  const [waQuickCategory, setWaQuickCategory] = useState<'BPJS' | 'Umum' | 'Asuransi'>('BPJS');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // OCR Simulator
  const handleOcrScan = () => {
    setIsScanningOCR(true);
    setTimeout(() => {
      setOnlineNik('3171021405910003');
      setOnlineName('HENDRA WIJAYA, S.T.');
      setOnlinePhone('081298765432');
      setOnlineBpjsNo('0001982736412');
      setOcrDone(true);
      setIsScanningOCR(false);
    }, 1200);
  };

  // Submit Online Form
  const handleSubmitOnline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onlineName || !onlineNik) return;

    const norm = `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const bookingCode = `WEB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const queueNumber = `A-0${Math.floor(10 + Math.random() * 30)}`;

    const newPatientData: Partial<Patient> = {
      norm,
      nik: onlineNik,
      fullName: onlineName,
      phone: onlinePhone || '081234567890',
      gender: onlineGender,
      category: onlineCategory === 'BPJS' ? 'Pasien BPJS' : onlineCategory === 'Asuransi' ? 'Pasien Asuransi' : 'Pasien Umum',
      bpjsCardNo: onlineBpjsNo || undefined,
      registeredAt: new Date().toLocaleString('id-ID'),
      status: 'Aktif'
    };

    addPatient(newPatientData);
    addNotification({
      title: 'Pendaftaran Online Pasien Baru',
      message: `${onlineName} mendaftar online via Portal Web untuk ${onlinePoly} (${onlineDate}).`,
      category: 'Pasien',
      type: 'normal'
    });
    addActivityLog(`Pendaftaran Online Web: ${onlineName} [${bookingCode}]`, 'Portal Pasien Online');

    setSubmittedOnlineTicket({
      norm,
      bookingCode,
      queueNumber,
      patientName: onlineName,
      poly: onlinePoly,
      doctor: onlineDoctor,
      date: onlineDate,
      shift: onlineShift,
      category: onlineCategory
    });
  };

  // Submit WA Message/Chat
  const handleSendWaChat = (textToSend?: string) => {
    const rawText = textToSend || waInputText;
    if (!rawText.trim()) return;

    const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    // Append user message
    const updatedMessages = [
      ...waMessages,
      { sender: 'user' as const, text: rawText, time: timeStr }
    ];
    setWaMessages(updatedMessages);
    setWaInputText('');

    // Process Bot response
    setTimeout(() => {
      const isRegCommand = rawText.toUpperCase().includes('DAFTAR') || rawText.includes('#');
      let name = 'Pasien WhatsApp';
      let nik = '3171098877665544';
      let poly = 'Poli Penyakit Dalam';

      if (rawText.includes('#')) {
        const parts = rawText.split('#');
        if (parts.length >= 3) {
          nik = parts[1].trim() || nik;
          name = parts[2].trim() || name;
          if (parts[3]) poly = parts[3].trim();
        }
      } else if (waQuickName) {
        name = waQuickName;
        nik = waQuickNik || nik;
        poly = waQuickPoly;
      }

      const bookingCode = `WA-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const queueNo = `WA-0${Math.floor(10 + Math.random() * 25)}`;
      const norm = `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      if (isRegCommand || rawText.toLowerCase().includes('1') || rawText.toLowerCase().includes('daftar')) {
        addPatient({
          norm,
          nik,
          fullName: name,
          phone: '0812-3456-7890',
          category: waQuickCategory === 'BPJS' ? 'Pasien BPJS' : 'Pasien Umum',
          registeredAt: new Date().toLocaleString('id-ID'),
          status: 'Aktif'
        });

        addNotification({
          title: 'Pendaftaran WhatsApp Berhasil',
          message: `${name} berhasil mendaftar via WhatsApp Bot [${bookingCode}]`,
          category: 'Pasien',
          type: 'normal'
        });
        addActivityLog(`Pendaftaran WhatsApp Bot: ${name} [${bookingCode}]`, 'WhatsApp Integration');

        setWaMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `✅ *PENDAFTARAN WHATSAPP BERHASIL!*\n\nTerima kasih *${name}*, pendaftaran Anda telah dikonfirmasi oleh RSUD Smart Medika AI.\n\n📌 *Detail Booking:*\n- Kode Booking: *${bookingCode}*\n- Nomor RM: *${norm}*\n- Nomor Antrean: *${queueNo}*\n- Poliklinik: *${poly}*\n- Dokter: *dr. Budi Hartono, Sp.PD*\n- Tanggal Kunjungan: *${waQuickDate}*\n\n📱 *Langkah Selanjutnya:*\nSilakan tunjukkan QR Code / Kode Booking ini saat tiba di Anjungan Mandiri (Kiosk) RS untuk cetak gelang & karcis antrean otomatis.`,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            card: {
              bookingCode,
              queueNo,
              norm,
              name,
              poly,
              date: waQuickDate
            }
          }
        ]);
      } else {
        setWaMessages(prev => [
          ...prev,
          {
            sender: 'bot',
            text: `Terima kasih! Ketik *1* untuk pendaftaran BPJS, *2* untuk pendaftaran Umum, atau ketik *JADWAL* untuk melihat jadwal dokter spesialis hari ini.`,
            time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    }, 800);
  };

  const handleCopyWaLink = () => {
    const link = "https://wa.me/6281234567890?text=Halo%20RS%20Smart%20Medika,%20Saya%20ingin%20daftar%20berobat%20online";
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-fade-in">
      <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-cyan-500/40 bg-slate-900 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-lg text-slate-950 font-bold">
              {activeTab === 'online' ? <Globe className="h-5 w-5" /> : <MessageSquare className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Portal Pendaftaran Pasien Digital</h2>
                <span className="rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                  Online & WhatsApp Integrated
                </span>
              </div>
              <p className="text-xs text-slate-400">Pendaftaran mandiri 24/7 tanpa antre di loket rumah sakit</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6 py-2.5 gap-3">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'online'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" />
            1. Pendaftaran Online (Web Portal)
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'whatsapp'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            2. Pendaftaran via WhatsApp (WA Bot)
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-100">
          {/* TAB 1: ONLINE WEB PORTAL */}
          {activeTab === 'online' && (
            <div className="space-y-6">
              {!submittedOnlineTicket ? (
                <form onSubmit={handleSubmitOnline} className="space-y-6">
                  {/* Category Selection */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Pilih Jenis Penjaminan Pasien *
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'BPJS', label: 'Pasien BPJS Kesehatan', sub: 'Integrasi V-Claim SEP Otomatis' },
                        { id: 'Umum', label: 'Pasien Umum / Bayar Mandiri', sub: 'Kartu Kredit / QRIS / Cash' },
                        { id: 'Asuransi', label: 'Pasien Asuransi Swasta', sub: 'Prudential, Allianz, Admedika' }
                      ].map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setOnlineCategory(item.id as any)}
                          className={`p-3 rounded-xl border text-left transition ${
                            onlineCategory === item.id
                              ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <div className="text-xs font-bold text-white">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* AI KTP / BPJS OCR Scanner */}
                  <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Auto-Scan KTP & Kartu BPJS dengan AI OCR</h4>
                        <p className="text-[11px] text-slate-300">
                          Upload atau foto KTP/BPJS untuk mengisi form pendaftaran otomatis dalam 2 detik.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOcrScan}
                      disabled={isScanningOCR}
                      className="flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shrink-0 disabled:opacity-50"
                    >
                      {isScanningOCR ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Menganalisis Dokumen...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" /> Scan KTP & BPJS AI
                        </>
                      )}
                    </button>
                  </div>

                  {ocrDone && (
                    <div className="bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-3 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      Data NIK & BPJS berhasil diekstrak otomatis dari KTP Pasien!
                    </div>
                  )}

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">NIK KTP Pasien (16 Digit) *</label>
                      <input
                        type="text"
                        required
                        maxLength={16}
                        placeholder="Contoh: 3171011508820001"
                        value={onlineNik}
                        onChange={(e) => setOnlineNik(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Nama Lengkap Pasien *</label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Hendra Wijaya, S.T."
                        value={onlineName}
                        onChange={(e) => setOnlineName(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Nomor Telepon / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081298765432"
                        value={onlinePhone}
                        onChange={(e) => setOnlinePhone(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    {onlineCategory === 'BPJS' && (
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Nomor Kartu BPJS Kesehatan</label>
                        <input
                          type="text"
                          placeholder="Contoh: 0001849201928"
                          value={onlineBpjsNo}
                          onChange={(e) => setOnlineBpjsNo(e.target.value)}
                          className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white font-mono focus:border-cyan-500 focus:outline-none"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Tujuan Poliklinik Berobat *</label>
                      <select
                        value={onlinePoly}
                        onChange={(e) => setOnlinePoly(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                        <option value="Poli Anak & Tumbuh Tumbuh">Poli Anak</option>
                        <option value="Poli Bedah Umum">Poli Bedah Umum</option>
                        <option value="Poli Jantung & Pembuluh Darah">Poli Jantung & Pembuluh Darah</option>
                        <option value="Poli Kebidanan & Kandungan (Obgyn)">Poli Kebidanan & Kandungan</option>
                        <option value="Poli Mata">Poli Mata</option>
                        <option value="Poli Gigi & Mulut">Poli Gigi & Mulut</option>
                        <option value="Poli Saraf">Poli Saraf</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Dokter DPJP Spesialis *</label>
                      <select
                        value={onlineDoctor}
                        onChange={(e) => setOnlineDoctor(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="dr. Budi Hartono, Sp.PD-KGEH">dr. Budi Hartono, Sp.PD-KGEH</option>
                        <option value="dr. Anindya Putri, Sp.A">dr. Anindya Putri, Sp.A</option>
                        <option value="dr. Rahmat Hidayat, Sp.B">dr. Rahmat Hidayat, Sp.B</option>
                        <option value="dr. Maya Kartika, Sp.JP">dr. Maya Kartika, Sp.JP</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Tanggal Rencana Berobat *</label>
                      <input
                        type="date"
                        required
                        value={onlineDate}
                        onChange={(e) => setOnlineDate(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Shift Kunjungan *</label>
                      <select
                        value={onlineShift}
                        onChange={(e) => setOnlineShift(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-white focus:border-cyan-500 focus:outline-none"
                      >
                        <option value="Pagi (08:00 - 12:00 WIB)">Shift Pagi (08:00 - 12:00 WIB)</option>
                        <option value="Siang (13:00 - 16:00 WIB)">Shift Siang (13:00 - 16:00 WIB)</option>
                        <option value="Sore (17:00 - 20:00 WIB)">Shift Sore (17:00 - 20:00 WIB)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-xs font-bold text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-lg transition"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Kirim Pendaftaran Online & Dapatkan E-Tiket
                    </button>
                  </div>
                </form>
              ) : (
                /* E-TIKET ANTRIAN ONLINE SUCCESS RESULT */
                <div className="space-y-6 max-w-xl mx-auto animate-fade-in">
                  <div className="text-center space-y-2">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xl">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Pendaftaran Online Berhasil!</h3>
                    <p className="text-xs text-slate-400">
                      E-Tiket Antrean & Kode Booking Anda telah diterbitkan dan tersimpan di sistem RSUD Smart Medika.
                    </p>
                  </div>

                  {/* Printable Ticket Card */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4 font-mono text-xs shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 px-3 py-1 text-[10px] font-bold rounded-bl-xl">
                      PORTAL ONLINE VERIFIED
                    </div>

                    <div className="border-b border-dashed border-slate-800 pb-3">
                      <div className="font-bold text-cyan-400 text-sm">RSUD SMART MEDIKA GENERAL HOSPITAL</div>
                      <div className="text-slate-400 text-[10px]">Tiket Antrean Pendaftaran Online Web Portal</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-slate-200">
                      <div>
                        <span className="text-slate-500 text-[10px] block">KODE BOOKING ONLINE</span>
                        <span className="text-base font-bold text-cyan-400">{submittedOnlineTicket.bookingCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">NOMOR ANTREAN POLI</span>
                        <span className="text-base font-bold text-emerald-400">{submittedOnlineTicket.queueNumber}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">NAMA PASIEN</span>
                        <span className="font-bold text-white">{submittedOnlineTicket.patientName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">NOMOR RM</span>
                        <span className="text-slate-300">{submittedOnlineTicket.norm}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">POLIKLINIK</span>
                        <span className="text-slate-200">{submittedOnlineTicket.poly}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[10px] block">TANGGAL & SHIFT</span>
                        <span className="text-slate-200">{submittedOnlineTicket.date} ({submittedOnlineTicket.shift.split(' ')[0]})</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-center">
                      <QrCode className="h-28 w-28 text-slate-100" />
                      <p className="text-[10px] text-slate-400">
                        Scan QR ini di Kiosk Anjungan Mandiri RS saat kedatangan untuk cetak fisik gelang pasien.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => setSubmittedOnlineTicket(null)}
                      className="rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition"
                    >
                      Daftar Pasien Lain
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-slate-700 transition"
                      >
                        <Printer className="h-4 w-4" /> Cetak Tiket
                      </button>
                      <button
                        onClick={onClose}
                        className="rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                      >
                        Selesai
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WHATSAPP BOT INTEGRATION */}
          {activeTab === 'whatsapp' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Official WA Details & Info */}
              <div className="lg:col-span-1 space-y-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-5 space-y-4 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 font-bold shadow-lg">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">WhatsApp RSUD Smart Medika</h3>
                      <p className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Official Verified Business
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Nomor Bot WA:</span>
                      <span className="font-mono font-bold text-white">0812-3456-7890</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Jam Operasional Bot:</span>
                      <span className="text-emerald-400 font-bold">24 Jam Non-Stop</span>
                    </div>
                  </div>

                  {/* QR Code Scan WhatsApp */}
                  <div className="flex flex-col items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-center">
                    <QrCode className="h-24 w-24 text-emerald-400" />
                    <p className="text-[10px] text-slate-400">Scan dengan WhatsApp Kamera HP Anda</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleCopyWaLink}
                      className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition"
                    >
                      {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      {copiedLink ? 'Link WA Tersalin!' : 'Salin Link Direct WA'}
                    </button>

                    <a
                      href="https://wa.me/6281234567890?text=Halo%20RS%20Smart%20Medika,%20Saya%20ingin%20daftar%20berobat%20online"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg transition"
                    >
                      <ExternalLink className="h-4 w-4" /> Buka WhatsApp Langsung
                    </a>
                  </div>
                </div>

                {/* Direct WA Form Helper */}
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 text-xs">
                  <h4 className="font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" /> Form Cepat WA Direct
                  </h4>
                  <div>
                    <label className="block text-slate-400 mb-1">Nama Pasien</label>
                    <input
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={waQuickName}
                      onChange={(e) => setWaQuickName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">NIK Pasien</label>
                    <input
                      type="text"
                      placeholder="16 digit NIK KTP"
                      value={waQuickNik}
                      onChange={(e) => setWaQuickNik(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-white font-mono"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (!waQuickName) return;
                      handleSendWaChat(`DAFTAR#${waQuickNik || '317109887766'}#${waQuickName}#${waQuickPoly}#${waQuickDate}#${waQuickCategory}`);
                    }}
                    className="w-full rounded-xl bg-slate-800 border border-emerald-500/40 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500 hover:text-slate-950 transition"
                  >
                    Kirim Form via Chat Simulator
                  </button>
                </div>
              </div>

              {/* Right Column: Live Interactive WhatsApp Simulator */}
              <div className="lg:col-span-2 flex flex-col rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden h-[500px]">
                {/* WA Chat Header */}
                <div className="flex items-center justify-between bg-slate-900 px-4 py-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white font-bold">
                        RS
                      </div>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        RSUD Smart Medika WA Bot <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      </h4>
                      <p className="text-[10px] text-emerald-400">Online • Balasan Otomatis Instant</p>
                    </div>
                  </div>
                </div>

                {/* WA Chat Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                  {waMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-xs whitespace-pre-line shadow-md ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60'
                        }`}
                      >
                        {msg.text}

                        {/* If Bot message contains booking card */}
                        {msg.card && (
                          <div className="mt-3 rounded-xl bg-slate-950 p-3 border border-emerald-500/40 font-mono space-y-1.5 text-[11px]">
                            <div className="text-cyan-400 font-bold flex items-center justify-between">
                              <span>E-TIKET ANTREAN WA</span>
                              <span className="text-emerald-400">{msg.card.queueNo}</span>
                            </div>
                            <div className="text-slate-300">Kode Booking: {msg.card.bookingCode}</div>
                            <div className="text-slate-300">No. RM: {msg.card.norm}</div>
                            <div className="text-slate-300">Pasien: {msg.card.name}</div>
                            <div className="text-slate-300">Tujuan: {msg.card.poly}</div>
                          </div>
                        )}
                        <span className="block text-[9px] opacity-70 text-right mt-1">{msg.time}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Action Chips */}
                <div className="bg-slate-900 p-2 flex items-center gap-2 overflow-x-auto border-t border-slate-800 no-scrollbar">
                  {[
                    'DAFTAR#3171011508820001#Budi Santoso#Poli Dalam#2026-08-04#BPJS',
                    'Daftar Pasien BPJS',
                    'Daftar Pasien Umum',
                    'Cek Jadwal Dokter'
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendWaChat(chip)}
                      className="px-3 py-1 bg-slate-800 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-semibold whitespace-nowrap transition"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* WA Chat Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendWaChat();
                  }}
                  className="bg-slate-900 p-3 flex items-center gap-2 border-t border-slate-800"
                >
                  <input
                    type="text"
                    placeholder="Ketik pesan pendaftaran WhatsApp..."
                    value={waInputText}
                    onChange={(e) => setWaInputText(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
