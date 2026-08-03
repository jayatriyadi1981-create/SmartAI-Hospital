import React, { useState } from 'react';
import {
  Bed,
  Building,
  Users,
  Clock,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Sliders,
  DollarSign,
  Plus,
  UserPlus,
  ArrowRight,
  X,
  FileText,
  ShieldCheck,
  Stethoscope,
  HeartPulse,
  Activity,
  Printer,
  ChevronRight,
  LogOut,
  ArrowLeftRight
} from 'lucide-react';
import { BedItem, WardClass, BedStatus, Patient } from '../types';
import { MOCK_BEDS, MOCK_WARD_METRICS, MOCK_PATIENTS } from '../data/mockData';

export const InpatientBedManagement: React.FC<{
  onOpenEMRForPatient?: (patient: Patient) => void;
}> = ({ onOpenEMRForPatient }) => {
  const [beds, setBeds] = useState<BedItem[]>(MOCK_BEDS);
  const [selectedClass, setSelectedClass] = useState<string>('Semua');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua');
  const [selectedWard, setSelectedWard] = useState<string>('Semua Bangsal');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
  const [selectedBedForAdmission, setSelectedBedForAdmission] = useState<BedItem | null>(null);

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedBedForTransfer, setSelectedBedForTransfer] = useState<BedItem | null>(null);

  const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
  const [selectedBedForDischarge, setSelectedBedForDischarge] = useState<BedItem | null>(null);

  // Form State for Bed Admission
  const [admitPatientName, setAdmitPatientName] = useState('Budi Santoso');
  const [admitNorm, setAdmitNorm] = useState('RM-2026-0088');
  const [admitDoctor, setAdmitDoctor] = useState('dr. Budi Hartono, Sp.PD');
  const [admitNurse, setAdmitNurse] = useState('Ns. Ratna Sari, S.Kep');

  // Form State for Room Transfer
  const [targetBedId, setTargetBedId] = useState('');

  const filteredBeds = beds.filter(b => {
    if (selectedClass !== 'Semua' && b.wardClass !== selectedClass) return false;
    if (selectedStatus !== 'Semua' && b.status !== selectedStatus) return false;
    if (selectedWard !== 'Semua Bangsal' && !b.wardName.toLowerCase().includes(selectedWard.toLowerCase())) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchBed = b.wardName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
      const matchPatient = b.currentPatientName?.toLowerCase().includes(q) || b.norm?.toLowerCase().includes(q);
      if (!matchBed && !matchPatient) return false;
    }
    return true;
  });

  const getStatusBadge = (status: BedStatus) => {
    switch (status) {
      case 'Kosong':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'Terisi':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
      case 'Cleaning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'Maintenance':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      case 'Reserved':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'Transfer':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  const handleUpdateStatus = (id: string, newStatus: BedStatus) => {
    setBeds(prev =>
      prev.map(b => (b.id === id ? { ...b, status: newStatus, currentPatientName: newStatus === 'Kosong' ? undefined : b.currentPatientName } : b))
    );
  };

  const handleOpenAdmitModal = (bed: BedItem) => {
    setSelectedBedForAdmission(bed);
    setIsAdmitModalOpen(true);
  };

  const handleConfirmAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBedForAdmission) return;

    setBeds(prev =>
      prev.map(b =>
        b.id === selectedBedForAdmission.id
          ? {
              ...b,
              status: 'Terisi',
              currentPatientName: admitPatientName,
              norm: admitNorm,
              doctorInCharge: admitDoctor,
              nurseInCharge: admitNurse,
              admissionDate: '03 Agu 2026',
              estimatedDischargeDate: '07 Agu 2026'
            }
          : b
      )
    );

    setIsAdmitModalOpen(false);
  };

  const handleConfirmDischarge = (bed: BedItem) => {
    setBeds(prev =>
      prev.map(b =>
        b.id === bed.id
          ? {
              ...b,
              status: 'Cleaning',
              currentPatientName: undefined,
              norm: undefined,
              doctorInCharge: undefined,
              nurseInCharge: undefined
            }
          : b
      )
    );
    setIsDischargeModalOpen(false);
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBedForTransfer || !targetBedId) return;

    const sourceBed = selectedBedForTransfer;
    setBeds(prev =>
      prev.map(b => {
        if (b.id === sourceBed.id) {
          return {
            ...b,
            status: 'Cleaning',
            currentPatientName: undefined,
            norm: undefined
          };
        }
        if (b.id === targetBedId) {
          return {
            ...b,
            status: 'Terisi',
            currentPatientName: sourceBed.currentPatientName,
            norm: sourceBed.norm,
            doctorInCharge: sourceBed.doctorInCharge,
            nurseInCharge: sourceBed.nurseInCharge,
            admissionDate: sourceBed.admissionDate,
            estimatedDischargeDate: sourceBed.estimatedDischargeDate
          };
        }
        return b;
      })
    );

    setIsTransferModalOpen(false);
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Bed className="w-4 h-4 text-indigo-400" /> Rawat Inap & Bed Management Operations (Ward Control)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Sistem Manajemen Rawat Inap & Peta Tempat Tidur
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Pemantauan BOR (Bed Occupancy Rate), Ploting Bed Pasien Admisi, Pindah Bangsal, CPPT EMR Dokter & Resume Discharge.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              const emptyBed = beds.find(b => b.status === 'Kosong');
              if (emptyBed) handleOpenAdmitModal(emptyBed);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl shadow-lg transition-all text-xs"
          >
            <UserPlus className="w-4 h-4" /> Admisi Pasien Rawat Inap Baru
          </button>
        </div>
      </div>

      {/* Ward Indicator Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Bed Occupancy (BOR)</div>
          <div className="text-2xl font-bold text-indigo-300 font-mono">{MOCK_WARD_METRICS.borPercent}%</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Length of Stay (LOS)</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">{MOCK_WARD_METRICS.losDays} Hari</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Turn Over Interval (TOI)</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">{MOCK_WARD_METRICS.toiDays} Hari</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Bed Turn Over (BTO)</div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">{MOCK_WARD_METRICS.btoTimes}x</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Bed Terisi</div>
          <div className="text-2xl font-bold text-white font-mono">{beds.filter(b => b.status === 'Terisi').length} Bed</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Bed Kosong Siap Pakai</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{beds.filter(b => b.status === 'Kosong').length} Bed</div>
        </div>
      </div>

      {/* AI Bed Forecasting Tip */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-4 shadow-xl flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <div className="font-bold text-indigo-300">Prediksi Kapasitas AI & Proyeksi Discharge Bed</div>
          <p className="text-slate-300 leading-relaxed">
            {MOCK_WARD_METRICS.aiPrediction}
          </p>
        </div>
      </div>

      {/* Filter and Bed List Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Bangsal:
            </span>
            <select
              value={selectedWard}
              onChange={e => setSelectedWard(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Semua Bangsal">Semua Bangsal</option>
              <option value="Kirana">Gedung Kirana (VVIP/VIP)</option>
              <option value="Melati">Gedung Melati (Kelas 1/2)</option>
              <option value="Dahlia">Gedung Dahlia (Kelas 3)</option>
              <option value="ICU">Unit ICU / ICCU</option>
            </select>

            <span className="text-slate-400 font-medium ml-2">Kelas Bed:</span>
            {['Semua', 'VVIP', 'VIP', 'Kelas 1', 'ICU'].map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedClass === cls
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cls}
              </button>
            ))}

            <span className="text-slate-400 font-medium ml-2">Status:</span>
            {['Semua', 'Terisi', 'Kosong', 'Cleaning'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedStatus === st
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari Bed, Bangsal, Pasien..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Bed Cards Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeds.map(bed => (
            <div
              key={bed.id}
              className={`bg-slate-950 border rounded-2xl p-4 space-y-3 transition-all shadow-md relative ${
                bed.status === 'Terisi'
                  ? 'border-indigo-500/60 bg-indigo-950/20'
                  : bed.status === 'Kosong'
                  ? 'border-emerald-500/50 bg-emerald-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div>
                  <h3 className="font-bold text-white text-sm">{bed.wardName}</h3>
                  <div className="text-[11px] text-slate-400">
                    {bed.wardClass} • <span className="font-mono text-cyan-300">Rp {bed.dailyRate.toLocaleString('id-ID')}</span>/malam
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(bed.status)}`}>
                  {bed.status}
                </span>
              </div>

              {bed.status === 'Terisi' ? (
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 text-sm">{bed.currentPatientName}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{bed.norm}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    DPJP Dokter: <span className="text-slate-200 font-semibold">{bed.doctorInCharge}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Perawat Penanggung Jawab: <span className="text-slate-200 font-semibold">{bed.nurseInCharge}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono pt-1 flex justify-between border-t border-slate-900">
                    <span>Masuk: {bed.admissionDate}</span>
                    <span>Est. Pulang: {bed.estimatedDischargeDate}</span>
                  </div>
                </div>
              ) : (
                <div className="py-5 text-center text-xs text-slate-500 space-y-2">
                  <p>{bed.status === 'Kosong' ? 'Tempat tidur kosong dan siap dialokasikan pasien.' : `Kondisi bed saat ini: ${bed.status}`}</p>
                  {bed.status === 'Kosong' && (
                    <button
                      onClick={() => handleOpenAdmitModal(bed)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                    >
                      Plotting Pasien Di Bed Ini
                    </button>
                  )}
                </div>
              )}

              {/* Status & Patient Workflow Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] gap-2">
                {bed.status === 'Terisi' ? (
                  <>
                    <button
                      onClick={() => {
                        setSelectedBedForTransfer(bed);
                        setIsTransferModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl font-semibold flex items-center gap-1"
                      title="Pindah Bangsal / Kamar"
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" /> Pindah Bed
                    </button>

                    <button
                      onClick={() => {
                        setSelectedBedForDischarge(bed);
                        setIsDischargeModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl font-semibold flex items-center gap-1"
                      title="Proses Kepulangan Pasien"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Discharge
                    </button>

                    {onOpenEMRForPatient && (
                      <button
                        onClick={() => {
                          const matchingPatient = MOCK_PATIENTS.find(p => p.norm === bed.norm) || MOCK_PATIENTS[0];
                          onOpenEMRForPatient(matchingPatient);
                        }}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-1"
                      >
                        <Stethoscope className="w-3.5 h-3.5" /> EMR Rawat Inap
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-1 w-full justify-end">
                    <span className="text-slate-500 text-[10px] mr-2">Ubah Status:</span>
                    <button
                      onClick={() => handleUpdateStatus(bed.id, 'Kosong')}
                      className="px-2 py-1 bg-emerald-950 hover:bg-emerald-800 text-emerald-300 rounded text-[10px]"
                    >
                      Kosong
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(bed.id, 'Cleaning')}
                      className="px-2 py-1 bg-amber-950 hover:bg-amber-800 text-amber-300 rounded text-[10px]"
                    >
                      Cleaning
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(bed.id, 'Maintenance')}
                      className="px-2 py-1 bg-red-950 hover:bg-red-800 text-red-300 rounded text-[10px]"
                    >
                      Maint
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: ADMISSION / PLOTTING BED BARU */}
      {isAdmitModalOpen && selectedBedForAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <button
              onClick={() => setIsAdmitModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <UserPlus className="w-6 h-6 text-indigo-400" />
              <div>
                <h3 className="font-bold text-white text-base">Plotting Admisi Pasien Rawat Inap</h3>
                <p className="text-xs text-slate-400">
                  Bed: <span className="font-bold text-white">{selectedBedForAdmission.wardName}</span> ({selectedBedForAdmission.wardClass})
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmAdmission} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Pasien Rawat Inap</label>
                <input
                  type="text"
                  required
                  value={admitPatientName}
                  onChange={e => setAdmitPatientName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. Rekam Medis (RM)</label>
                  <input
                    type="text"
                    required
                    value={admitNorm}
                    onChange={e => setAdmitNorm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">DPJP Dokter Penanggung Jawab</label>
                  <input
                    type="text"
                    required
                    value={admitDoctor}
                    onChange={e => setAdmitDoctor(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Perawat Penanggung Jawab Shifting</label>
                <input
                  type="text"
                  required
                  value={admitNurse}
                  onChange={e => setAdmitNurse(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between text-slate-300">
                <span>Tarif Kamar per Malam:</span>
                <span className="font-mono font-bold text-cyan-300">Rp {selectedBedForAdmission.dailyRate.toLocaleString('id-ID')}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdmitModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simpan & Plotting Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISCHARGE CLEARANCE PASIEN */}
      {isDischargeModalOpen && selectedBedForDischarge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <button
              onClick={() => setIsDischargeModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <LogOut className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="font-bold text-white text-base">Proses Discharge / Kepulangan Pasien</h3>
                <p className="text-xs text-slate-400">{selectedBedForDischarge.currentPatientName} ({selectedBedForDischarge.wardName})</p>
              </div>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Lama Rawat (LOS):</span>
                <span className="font-bold text-cyan-300">4 Hari</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Persetujuan Resume Medis DPJP:</span>
                <span className="font-bold text-emerald-400">Terverifikasi</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Billing Clearance Kasir:</span>
                <span className="font-bold text-emerald-400">Lunas / Verifikasi BPJS</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-snug">
              Proses discharge akan mengosongkan status pasien di bed ini dan mengubah status tempat tidur menjadi <span className="font-bold text-amber-300 font-mono">Cleaning</span>.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsDischargeModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleConfirmDischarge(selectedBedForDischarge)}
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Konfirmasi Discharge Pasien
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ROOM TRANSFER / PINDAH BED */}
      {isTransferModalOpen && selectedBedForTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <button
              onClick={() => setIsTransferModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <ArrowLeftRight className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-base">Proses Pindah Bed / Bangsal</h3>
                <p className="text-xs text-slate-400">Pasien: {selectedBedForTransfer.currentPatientName}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmTransfer} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bed Asal Saat Ini</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedBedForTransfer.wardName} (${selectedBedForTransfer.wardClass})`}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pilih Bed Tujuan (Kosong)</label>
                <select
                  required
                  value={targetBedId}
                  onChange={e => setTargetBedId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-semibold"
                >
                  <option value="">-- Pilih Bed Kosong --</option>
                  {beds
                    .filter(b => b.status === 'Kosong')
                    .map(b => (
                      <option key={b.id} value={b.id}>
                        {b.wardName} - {b.wardClass} (Rp {b.dailyRate.toLocaleString('id-ID')}/malam)
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Konfirmasi Pindah Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
