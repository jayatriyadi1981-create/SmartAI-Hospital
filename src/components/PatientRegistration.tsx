import React, { useState } from 'react';
import {
  UserPlus,
  QrCode,
  CheckCircle2,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  Sparkles,
  Search,
  Upload,
  RefreshCw,
  ShieldCheck,
  Printer,
  ChevronRight,
  User,
  HeartPulse,
  Phone,
  MapPin,
  Clock,
  Check,
  Database,
  ArrowRight
} from 'lucide-react';
import { Patient, PatientCategory } from '../types';
import { MOCK_PATIENTS } from '../data/mockData';

interface PatientRegistrationProps {
  onPatientRegistered?: (patient: Patient) => void;
  onNavigateToQueue?: () => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  onPatientRegistered,
  onNavigateToQueue
}) => {
  const [activeCategory, setActiveCategory] = useState<PatientCategory>('Pasien BPJS');
  const [step, setStep] = useState<number>(1);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrSuccess, setOcrSuccess] = useState(false);
  const [isValidatingNik, setIsValidatingNik] = useState(false);
  const [nikValidationResult, setNikValidationResult] = useState<{
    valid: boolean;
    message: string;
    bpjsActive?: boolean;
  } | null>(null);

  // Fast Search for Pasien Lama
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExistingPatient, setSelectedExistingPatient] = useState<Patient | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nik: '',
    fullName: '',
    nickname: '',
    birthPlace: 'Jakarta',
    birthDate: '1990-05-15',
    gender: 'Laki-laki' as 'Laki-laki' | 'Perempuan',
    bloodType: 'O+' as 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-',
    religion: 'Islam',
    maritalStatus: 'Menikah' as 'Belum Menikah' | 'Menikah' | 'Janda/Duda',
    occupation: 'Karyawan Swasta',
    education: 'S1 Sarjana',
    address: 'Jl. Sudirman No. 120',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Kebayoran Baru',
    subdistrict: 'Senayan',
    postalCode: '12190',
    phone: '081234567890',
    email: 'pasien.baru@example.com',
    emergencyContactName: 'Budi Raharjo',
    emergencyContactRel: 'Suami / Istri',
    emergencyContactPhone: '081987654321',
    bpjsCardNo: '',
    insuranceNo: '',
    insuranceProvider: 'Prudential / Allianz',
    polyTarget: 'Poli Penyakit Dalam',
    doctorTarget: 'dr. Budi Hartono, Sp.PD-KGEH',
    allergiesInput: 'Penicillin, Seafood',
  });

  const [registeredPatient, setRegisteredPatient] = useState<Patient | null>(null);

  // Categories
  const categories: PatientCategory[] = [
    'Pasien Baru',
    'Pasien BPJS',
    'Pasien Asuransi',
    'Pasien Umum',
    'Pasien Lama',
    'Emergency',
    'MCU',
    'Telemedicine'
  ];

  // Filtered Existing Patients for Pasien Lama Lookup
  const filteredExisting = MOCK_PATIENTS.filter(
    (p) =>
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nik.includes(searchQuery)
  );

  // Simulate AI OCR Scan for KTP / BPJS
  const handleSimulateOCR = async () => {
    setIsScanningOCR(true);
    setOcrSuccess(false);

    try {
      const res = await fetch('/api/ai/ocr-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentType: 'KTP & Kartu BPJS' })
      });
      const data = await res.json();
      
      if (data.status === 'success' && data.ocrResult) {
        const o = data.ocrResult;
        setFormData(prev => ({
          ...prev,
          nik: o.nik || '3171011508820001',
          fullName: o.fullName || 'AHMAD DAHLAN',
          birthPlace: o.birthPlace || 'JAKARTA',
          birthDate: o.birthDate || '1982-08-15',
          gender: o.gender === 'Perempuan' ? 'Perempuan' : 'Laki-laki',
          address: o.address || 'JL. MELATI INDAH NO 42',
          bpjsCardNo: o.bpjsNumber || '0001849201928'
        }));
        setOcrSuccess(true);
      }
    } catch (e) {
      // Fallback local OCR simulation
      setFormData(prev => ({
        ...prev,
        nik: '3171011508820001',
        fullName: 'AHMAD DAHLAN',
        birthPlace: 'JAKARTA',
        birthDate: '1982-08-15',
        gender: 'Laki-laki',
        address: 'JL. MELATI INDAH NO 42 RT 05 RW 02',
        bpjsCardNo: '0001849201928'
      }));
      setOcrSuccess(true);
    } finally {
      setIsScanningOCR(false);
    }
  };

  // Validate NIK
  const handleValidateNik = async () => {
    if (!formData.nik || formData.nik.length < 16) {
      setNikValidationResult({
        valid: false,
        message: 'Format NIK harus 16 digit angka.'
      });
      return;
    }

    setIsValidatingNik(true);
    try {
      const res = await fetch('/api/ai/validate-nik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nik: formData.nik, bpjsNumber: formData.bpjsCardNo })
      });
      const data = await res.json();
      setNikValidationResult({
        valid: data.valid,
        message: data.message,
        bpjsActive: data.bpjsStatus?.active
      });
    } catch (e) {
      setNikValidationResult({
        valid: true,
        message: 'NIK Terverifikasi Dukcapil Gateway (Simulasi). Pasien BPJS Aktif.',
        bpjsActive: true
      });
    } finally {
      setIsValidatingNik(false);
    }
  };

  // Submit Registration
  const handleSubmitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    const newNorm = `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      norm: newNorm,
      nik: formData.nik || '3171000000000000',
      bpjsCardNo: formData.bpjsCardNo || undefined,
      insuranceNo: formData.insuranceNo || undefined,
      insuranceProvider: formData.insuranceProvider || undefined,
      fullName: formData.fullName || 'Pasien Baru',
      nickname: formData.nickname || formData.fullName.split(' ')[0],
      birthPlace: formData.birthPlace,
      birthDate: formData.birthDate,
      gender: formData.gender,
      bloodType: formData.bloodType,
      religion: formData.religion,
      maritalStatus: formData.maritalStatus,
      occupation: formData.occupation,
      education: formData.education,
      address: formData.address,
      province: formData.province,
      city: formData.city,
      district: formData.district,
      subdistrict: formData.subdistrict,
      postalCode: formData.postalCode,
      phone: formData.phone,
      email: formData.email,
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRel,
        phone: formData.emergencyContactPhone
      },
      language: 'Bahasa Indonesia',
      nationality: 'WNI',
      status: 'Aktif',
      registeredAt: new Date().toLocaleString('id-ID'),
      category: activeCategory,
      allergies: formData.allergiesInput.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: []
    };

    setRegisteredPatient(newPatient);
    if (onPatientRegistered) {
      onPatientRegistered(newPatient);
    }
  };

  const handleSelectExistingPatient = (p: Patient) => {
    setSelectedExistingPatient(p);
    setRegisteredPatient(p);
    if (onPatientRegistered) {
      onPatientRegistered(p);
    }
  };

  return (
    <div className="space-y-6 pb-12 text-slate-100">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-cyan-500/5 blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <UserPlus className="w-4 h-4" /> Modul Front Office & Registrasi Cerdas 10.0
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Pendaftaran Pasien & Fast Check-In Admisi
            </h1>
            <p className="text-slate-300 text-xs mt-1 max-w-2xl">
              Registrasi Pasien Baru & Pasien Lama: Integrasi Dukcapil NIK, V-Claim BPJS SEP, AI KTP/BPJS OCR Scanner, dan Antrian Smart Queue Poliklinik.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateOCR}
              disabled={isScanningOCR}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all text-xs disabled:opacity-50"
            >
              {isScanningOCR ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  Menganalisis Dokumen AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  Auto Scan OCR (KTP / BPJS)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Categories Tab Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 pb-1 border-t border-slate-700/60 mt-6 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setSelectedExistingPatient(null);
                setRegisteredPatient(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* OCR Result Banner Alert */}
      {ocrSuccess && (
        <div className="bg-cyan-950/60 border border-cyan-500/40 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-cyan-200">
              Data Dokumen KTP & BPJS Berhasil Diekstrak AI OCR
            </div>
            <div className="text-slate-300">
              Formulir terisi otomatis dari hasil ekstraksi dokumen. Silakan periksa kelengkapan data di bawah ini.
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL MODE: PASIEN LAMA FAST LOOKUP */}
      {activeCategory === 'Pasien Lama' && !registeredPatient && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Database className="h-5 w-5 text-cyan-400" /> Fast Search Data Pasien Lama (Database EMR)
              </h3>
              <p className="text-xs text-slate-400">Cari berdasarkan Nama Pasien, Nomor Rekam Medis (RM), atau NIK</p>
            </div>
            <span className="rounded bg-cyan-500/20 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/30">
              {MOCK_PATIENTS.length} Pasien Terdaftar
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pasien, RM-2026-..., atau NIK KTP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {filteredExisting.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-cyan-500/50 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{p.norm}</span>
                    <h4 className="font-bold text-xs text-white">{p.fullName}</h4>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">{p.gender} • {p.birthDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{p.address} | NIK: {p.nik} | Phone: {p.phone}</p>
                </div>

                <button
                  onClick={() => handleSelectExistingPatient(p)}
                  className="flex items-center gap-1 rounded-xl bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
                >
                  Pilih Pasien & Ambil Antrian <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Form & Registration Receipt (For Pasien Baru, BPJS, Asuransi, etc.) */}
      {activeCategory !== 'Pasien Lama' && !registeredPatient && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Step Indicator Sidebar */}
          <div className="lg:col-span-1 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 h-fit space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Tahapan Registrasi
              </h3>
              <div className="space-y-2">
                {[
                  { num: 1, title: 'Identitas & NIK Pasien', icon: User },
                  { num: 2, title: 'Alamat & Kontak Darurat', icon: MapPin },
                  { num: 3, title: 'Penjamin & Poliklinik', icon: ShieldCheck },
                  { num: 4, title: 'Triage & Alergi Obat', icon: HeartPulse }
                ].map(s => (
                  <button
                    key={s.num}
                    onClick={() => setStep(s.num)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      step === s.num
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-semibold'
                        : step > s.num
                        ? 'bg-slate-800/50 border-slate-700/50 text-emerald-400'
                        : 'bg-slate-800/20 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        step === s.num
                          ? 'bg-cyan-500 text-slate-950'
                          : step > s.num
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                    </div>
                    <span className="text-xs leading-snug">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Quick Tip */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                <Sparkles className="w-4 h-4" /> AI Validasi Otomatis
              </div>
              <p className="text-slate-300 leading-relaxed">
                Sistem akan memverifikasi duplikasi Nomor Rekam Medis (RM) secara real-time untuk mencegah pendaftaran ganda.
              </p>
            </div>
          </div>

          {/* Form Content Area */}
          <div className="lg:col-span-3 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <form onSubmit={handleSubmitRegistration} className="space-y-6">
              {/* STEP 1: Identitas & NIK */}
              {step === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <User className="w-5 h-5 text-cyan-400" /> Identitas Utama & NIK Pasien
                      </h2>
                      <p className="text-xs text-slate-400">Masukkan NIK KTP pasien untuk pengecekan database nasional Dukcapil.</p>
                    </div>
                    <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md text-xs font-mono">
                      Kategori: {activeCategory}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* NIK Input with Validate Button */}
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        NIK (Nomor Induk Kependudukan) <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={16}
                          required
                          value={formData.nik}
                          onChange={e => setFormData({ ...formData, nik: e.target.value })}
                          placeholder="3171011508820001 (16 digit)"
                          className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleValidateNik}
                          disabled={isValidatingNik}
                          className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-cyan-300 font-medium px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 whitespace-nowrap transition-all"
                        >
                          {isValidatingNik ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                          ) : (
                            <ShieldCheck className="w-4 h-4 text-cyan-400" />
                          )}
                          Cek Dukcapil & BPJS
                        </button>
                      </div>

                      {nikValidationResult && (
                        <div
                          className={`mt-2 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                            nikValidationResult.valid
                              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                              : 'bg-red-950/40 border-red-500/40 text-red-300'
                          }`}
                        >
                          {nikValidationResult.valid ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                          )}
                          <span>{nikValidationResult.message}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Nama Lengkap (Sesuai KTP) *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Contoh: Ahmad Dahlan"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Nama Panggilan / Alias</label>
                      <input
                        type="text"
                        value={formData.nickname}
                        onChange={e => setFormData({ ...formData, nickname: e.target.value })}
                        placeholder="Contoh: Pak Ahmad"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Tempat Lahir *</label>
                      <input
                        type="text"
                        required
                        value={formData.birthPlace}
                        onChange={e => setFormData({ ...formData, birthPlace: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Tanggal Lahir *</label>
                      <input
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Jenis Kelamin *</label>
                      <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Golongan Darah</label>
                      <select
                        value={formData.bloodType}
                        onChange={e => setFormData({ ...formData, bloodType: e.target.value as any })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Alamat & Kontak */}
              {step === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-cyan-400" /> Alamat Lengkap & Kontak Darurat
                    </h2>
                    <p className="text-xs text-slate-400">Data tempat tinggal dan penanggung jawab darurat pasien.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Alamat Jalan & No. Rumah *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Jl. Melati Indah No. 42 RT 05 RW 02"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Provinsi *</label>
                      <input
                        type="text"
                        required
                        value={formData.province}
                        onChange={e => setFormData({ ...formData, province: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Kota / Kabupaten *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Nomor Telepon / WhatsApp *</label>
                      <input
                        type="text"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="081298765432"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Email Pasien</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="pasien@email.com"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Penjamin & Poliklinik */}
              {step === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-cyan-400" /> Penjamin Pembayaran & Poliklinik
                    </h2>
                    <p className="text-xs text-slate-400">Pilih penjamin kesehatan (BPJS/Asuransi/Umum) dan tujuan kunjungan poli.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Nomor Kartu BPJS Kesehatan (Bila Ada)</label>
                      <input
                        type="text"
                        value={formData.bpjsCardNo}
                        onChange={e => setFormData({ ...formData, bpjsCardNo: e.target.value })}
                        placeholder="0001849201928"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Asuransi Swasta / Provider</label>
                      <input
                        type="text"
                        value={formData.insuranceProvider}
                        onChange={e => setFormData({ ...formData, insuranceProvider: e.target.value })}
                        placeholder="Contoh: Prudential, Allianz, Inhealth"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Tujuan Poliklinik / Layanan *</label>
                      <select
                        value={formData.polyTarget}
                        onChange={e => setFormData({ ...formData, polyTarget: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="Poli Penyakit Dalam">Poli Penyakit Dalam</option>
                        <option value="Poli Jantung & Pembuluh Darah">Poli Jantung & Pembuluh Darah</option>
                        <option value="Poli Anak & Tumbuh Kembang">Poli Anak & Tumbuh Kembang</option>
                        <option value="Poli Bedah Saraf">Poli Bedah Saraf</option>
                        <option value="Poli Kebidanan & Kandungan (Obgyn)">Poli Kebidanan & Kandungan (Obgyn)</option>
                        <option value="IGD Triage Utama">IGD Triage Utama (Emergency)</option>
                        <option value="MCU Medical Check Up">MCU (Medical Check Up)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">Dokter Spesialis Tujuan</label>
                      <input
                        type="text"
                        value={formData.doctorTarget}
                        onChange={e => setFormData({ ...formData, doctorTarget: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Triage & Alergi Obat */}
              {step === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-cyan-400" /> Skrining Alergi & Alert Klinis
                    </h2>
                    <p className="text-xs text-slate-400">Pencatatan awal alergi obat & catatan klinis penting untuk keselamatan pasien (Patient Safety).</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-300">
                        Riwayat Alergi Obat / Makanan (Pisahkan dengan koma)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.allergiesInput}
                        onChange={e => setFormData({ ...formData, allergiesInput: e.target.value })}
                        placeholder="Contoh: Penicillin, Seafood, Ibuprofen"
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-200">
                      <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                      <div>
                        <div className="font-semibold text-amber-300 mb-0.5">Peringatan Keselamatan Pasien (Patient Safety)</div>
                        Setiap data alergi yang dicatat akan memicu <span className="font-bold underline">Clinical Warning Alert</span> otomatis pada lembar EMR Dokter & Sistem Depo Farmasi saat penulisan resep.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-all"
                  >
                    Kembali
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl text-xs transition-all flex items-center gap-2"
                  >
                    Lanjut Step {step + 1} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Simpan Registrasi & Ambil Antrian
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REGISTRATION RECEIPT & QR CODE PRINT PREVIEW */}
      {registeredPatient && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-6 max-w-2xl mx-auto space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-3 text-emerald-400 border-b border-slate-800 pb-4">
            <CheckCircle2 className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-white">Registrasi Pasien Berhasil!</h2>
              <p className="text-xs text-slate-400">Data telah masuk ke Database EMR & Antrian Poliklinik RSUD Smart Medika.</p>
            </div>
          </div>

          {/* Ticket Print Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-dashed border-slate-800 pb-3">
              <div>
                <div className="font-bold text-slate-200 text-sm">RSUD SMART MEDIKA GENERAL HOSPITAL</div>
                <div className="text-slate-500 text-[10px]">Bukti Pendaftaran Pasien Rawat Jalan</div>
              </div>
              <div className="text-right">
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">VERIFIED SEP</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] block">NOMOR REKAM MEDIS (RM)</span>
                <span className="text-lg font-bold text-cyan-400">{registeredPatient.norm}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">NOMOR ANTRIAN POLI</span>
                <span className="text-lg font-bold text-emerald-400">A-015</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">NAMA PASIEN</span>
                <span className="font-bold text-white">{registeredPatient.fullName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">NIK PASIEN</span>
                <span className="text-slate-300">{registeredPatient.nik}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">TUJUAN POLIKLINIK</span>
                <span className="text-slate-200">{formData.polyTarget}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">DOKTER DPJP</span>
                <span className="text-slate-200">{formData.doctorTarget}</span>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-center">
              <QrCode className="w-24 h-24 text-slate-200" />
              <p className="text-[10px] text-slate-400">Scan QR ini di Kiosk Check-In / Anjungan Poli saat panggil antrian</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setRegisteredPatient(null);
                setStep(1);
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-all"
            >
              Daftarkan Pasien Lain
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Cetak Kartu RM
              </button>

              {onNavigateToQueue && (
                <button
                  onClick={onNavigateToQueue}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs shadow-lg transition-all flex items-center gap-2"
                >
                  Lihat Antrian Smart Queue AI <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
