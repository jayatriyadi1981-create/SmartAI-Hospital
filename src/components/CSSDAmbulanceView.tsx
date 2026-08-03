import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  FileCheck,
  QrCode,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Search,
  UserCheck,
  Flame,
  Printer,
  Download,
  Plus,
  X,
  Navigation,
  RefreshCw,
  PhoneCall,
  User,
  Building,
  Check
} from 'lucide-react';
import {
  MOCK_CSSD_BATCHES,
  MOCK_AMBULANCE_DISPATCHES,
  MOCK_MORTUARY_RECORDS,
  MOCK_MEDICAL_CERTIFICATES
} from '../data/mockData';
import { CSSDBatch, AmbulanceDispatch, MortuaryRecord, MedicalCertificate } from '../types';

export const CSSDAmbulanceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CSSD' | 'Ambulance' | 'Certificates' | 'Mortuary'>('CSSD');

  // State data
  const [cssdBatches, setCssdBatches] = useState<CSSDBatch[]>(MOCK_CSSD_BATCHES);
  const [ambulances, setAmbulances] = useState<AmbulanceDispatch[]>(MOCK_AMBULANCE_DISPATCHES);
  const [certificates, setCertificates] = useState<MedicalCertificate[]>(MOCK_MEDICAL_CERTIFICATES);
  const [mortuaryRecords, setMortuaryRecords] = useState<MortuaryRecord[]>(MOCK_MORTUARY_RECORDS);

  // Modals state
  const [isCssdModalOpen, setIsCssdModalOpen] = useState(false);
  const [isAmbulanceModalOpen, setIsAmbulanceModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [isMortuaryModalOpen, setIsMortuaryModalOpen] = useState(false);
  const [selectedCertificateToPrint, setSelectedCertificateToPrint] = useState<MedicalCertificate | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form state: New CSSD Batch
  const [newBatch, setNewBatch] = useState({
    batchNumber: `BATCH-2026-${Math.floor(100 + Math.random() * 900)}`,
    autoclaveMachineId: 'Autoclave Unit #03',
    sterilizationType: 'Steam Autoclave 134C' as CSSDBatch['sterilizationType'],
    instrumentSetName: 'Set Laparotomi Mayor OK-1',
    itemsCount: 32,
  });

  // Form state: New Ambulance Dispatch
  const [newAmb, setNewAmb] = useState({
    callSign: 'Ambulans Rescue 04',
    ambulanceType: 'Advance Life Support (ALS)' as AmbulanceDispatch['ambulanceType'],
    driverName: 'Pak Hendra (Sertifikasi BTCLS)',
    paramedicName: 'Ns. Faisal S.Kep',
    destinationLocation: 'Jl. Sudirman No. 45 (Kecelakaan Lalu Lintas)',
    gpsCoordinates: '-6.2088, 106.8456',
  });

  // Form state: New Certificate
  const [newCert, setNewCert] = useState({
    patientName: '',
    norm: '',
    certificateType: 'Surat Keterangan Sakit' as MedicalCertificate['certificateType'],
    issuedDoctor: 'dr. Ahmad Hidayat, Sp.PD',
    summaryNote: 'Diberikan istirahat sakit selama 3 hari kerja terhitung mulai tanggal 03 Agustus 2026.',
  });

  // Form state: New Mortuary Record
  const [newMortuary, setNewMortuary] = useState({
    deceasedName: '',
    norm: '',
    dateOfDeath: new Date().toISOString().split('T')[0],
    timeOfDeath: '08:30 WIB',
    causeofDeath: 'Cardiogenic Shock & Acute Myocardial Infarction',
    freezerBoxNumber: 'Box Cold Storage #03',
  });

  // Handlers: CSSD
  const handleAddCssdBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const item: CSSDBatch = {
      id: `cssd-${Date.now()}`,
      batchNumber: newBatch.batchNumber,
      autoclaveMachineId: newBatch.autoclaveMachineId,
      sterilizationType: newBatch.sterilizationType,
      instrumentSetName: newBatch.instrumentSetName,
      itemsCount: Number(newBatch.itemsCount),
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Sterilizing',
      biologicalIndicator: 'Testing',
    };
    setCssdBatches([item, ...cssdBatches]);
    setIsCssdModalOpen(false);
  };

  const handleAdvanceCssdStatus = (id: string) => {
    setCssdBatches((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const nextStatusMap: Record<CSSDBatch['status'], CSSDBatch['status']> = {
            Washing: 'Packing',
            Packing: 'Sterilizing',
            Sterilizing: 'Sterile Ready',
            'Sterile Ready': 'Distributed',
            Distributed: 'Distributed',
          };
          const nextStatus = nextStatusMap[b.status];
          return {
            ...b,
            status: nextStatus,
            biologicalIndicator: nextStatus === 'Sterile Ready' ? 'PASSED (Negative)' : b.biologicalIndicator,
          };
        }
        return b;
      })
    );
  };

  // Handlers: Ambulance
  const handleAddAmbulanceDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const item: AmbulanceDispatch = {
      id: `amb-${Date.now()}`,
      callSign: newAmb.callSign,
      ambulanceType: newAmb.ambulanceType,
      driverName: newAmb.driverName,
      paramedicName: newAmb.paramedicName,
      destinationLocation: newAmb.destinationLocation,
      status: 'En Route to Location',
      gpsCoordinates: newAmb.gpsCoordinates,
      etaMinutes: 12,
      aiFastestRoute: 'Jalur Tol Dalam Kota via Exit Semanggi -> Hindari Lampu Merah Kuningan (Bypass 4 menit).',
    };
    setAmbulances([item, ...ambulances]);
    setIsAmbulanceModalOpen(false);
  };

  const handleUpdateAmbulanceStatus = (id: string, status: AmbulanceDispatch['status']) => {
    setAmbulances((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, etaMinutes: status === 'Completed' ? 0 : a.etaMinutes } : a))
    );
  };

  // Handlers: Certificate
  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.patientName) return;
    const item: MedicalCertificate = {
      id: `cert-${Date.now()}`,
      patientName: newCert.patientName,
      norm: newCert.norm || `RM-2026-${Math.floor(100 + Math.random() * 900)}`,
      certificateType: newCert.certificateType,
      issuedDoctor: newCert.issuedDoctor,
      issueDate: new Date().toISOString().split('T')[0],
      summaryNote: newCert.summaryNote,
      verifiedStatus: 'Verified Official',
      digitalSignatureQr: `QR-SIG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    setCertificates([item, ...certificates]);
    setIsCertModalOpen(false);
    setNewCert({
      patientName: '',
      norm: '',
      certificateType: 'Surat Keterangan Sakit',
      issuedDoctor: 'dr. Ahmad Hidayat, Sp.PD',
      summaryNote: 'Diberikan istirahat sakit selama 3 hari kerja terhitung mulai tanggal 03 Agustus 2026.',
    });
  };

  // Handlers: Mortuary
  const handleAddMortuaryRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMortuary.deceasedName) return;
    const item: MortuaryRecord = {
      id: `mort-${Date.now()}`,
      deceasedName: newMortuary.deceasedName,
      norm: newMortuary.norm || `RM-2026-${Math.floor(100 + Math.random() * 900)}`,
      dateOfDeath: newMortuary.dateOfDeath,
      timeOfDeath: newMortuary.timeOfDeath,
      causeOfDeath: newMortuary.causeofDeath,
      freezerBoxNumber: newMortuary.freezerBoxNumber,
      releasingFamilyName: 'Keluarga Pasien',
      releaseStatus: 'In Storage',
      deathCertificateGenerated: true,
    };
    setMortuaryRecords([item, ...mortuaryRecords]);
    setIsMortuaryModalOpen(false);
    setNewMortuary({
      deceasedName: '',
      norm: '',
      dateOfDeath: new Date().toISOString().split('T')[0],
      timeOfDeath: '08:30 WIB',
      causeofDeath: 'Cardiogenic Shock & Acute Myocardial Infarction',
      freezerBoxNumber: 'Box Cold Storage #03',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                CSSD Sterilisasi, Emergency Ambulans & Surat Medis
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs sm:text-sm">
                Sistem sterilisasi instrumen kamar operasi, tracking GPS ambulans gawat darurat, penerbitan surat medis QR, & pemulasaraan jenazah.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('CSSD')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'CSSD'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-500" />
            CSSD Sterilisasi
          </button>
          <button
            onClick={() => setActiveTab('Ambulance')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'Ambulance'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4 text-indigo-500" />
            Ambulans GPS Dispatch
          </button>
          <button
            onClick={() => setActiveTab('Certificates')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'Certificates'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4 text-emerald-500" />
            Surat Medis & QR
          </button>
          <button
            onClick={() => setActiveTab('Mortuary')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'Mortuary'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-slate-500" />
            Pemulasaraan Jenazah
          </button>
        </div>
      </div>

      {/* Top KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">CSSD Batch Steril Ready</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {cssdBatches.filter((b) => b.status === 'Sterile Ready').length} Batch Set
            </p>
            <span className="text-[11px] text-slate-400">100% Biologi Pass</span>
          </div>
          <div className="p-3 bg-teal-500/10 text-teal-600 rounded-2xl">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Ambulans Active Dispatch</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">
              {ambulances.filter((a) => a.status !== 'Standby' && a.status !== 'Completed').length} Unit Operasional
            </p>
            <span className="text-[11px] text-indigo-600 font-bold">Rata-rata ETA 10 Mins</span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Surat Medis Diterbitkan</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{certificates.length} Berkas</p>
            <span className="text-[11px] text-emerald-600 font-medium">QR Tanda Tangan Digital Dokter</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <FileCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Cold Storage Pemulasaraan</p>
            <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-1">
              {mortuaryRecords.length} / 6 Box
            </p>
            <span className="text-[11px] text-slate-400">Suhu Terjaga -4°C</span>
          </div>
          <div className="p-3 bg-slate-500/10 text-slate-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB 1: CSSD STERILISASI */}
      {activeTab === 'CSSD' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Batch Sterilisasi Autoclave & Tracking Instrument Set Kamar Operasi (OK)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pengawasan siklus dekontaminasi, autoclave steam, pengujian indikator biologi, & pelabelan barcode steril.
              </p>
            </div>

            <button
              onClick={() => setIsCssdModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Buat Batch Autoclave Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cssdBatches.map((b) => (
              <div
                key={b.id}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5 hover:border-teal-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-black text-teal-700 dark:text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-md">
                      {b.batchNumber}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1.5">{b.instrumentSetName}</h4>
                    <p className="text-xs text-slate-500">
                      Mesin: <strong className="text-slate-700 dark:text-slate-300">{b.autoclaveMachineId}</strong> • Total ({b.itemsCount} pcs instrumen)
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 font-bold text-xs rounded-lg border ${
                      b.status === 'Sterile Ready'
                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                        : b.status === 'Sterilizing'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                        : b.status === 'Distributed'
                        ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {b.status === 'Sterile Ready' ? '✅ Siap Distribusi' : b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">Tipe Sterilisasi:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{b.sterilizationType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">Indikator Biologi:</span>
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {b.biologicalIndicator}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-700 gap-2">
                  <span>Mulai: {b.startTime} • Exp: <strong className="text-slate-800 dark:text-slate-200">{b.expiryDate}</strong></span>
                  
                  {b.status !== 'Distributed' && (
                    <button
                      onClick={() => handleAdvanceCssdStatus(b.id)}
                      className="px-3 py-1 bg-teal-600 text-white rounded-lg text-[11px] font-bold hover:bg-teal-700 transition"
                    >
                      Proses Selanjutnya →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: AMBULANCE DISPATCH & GPS */}
      {activeTab === 'Ambulance' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" />
                Smart Ambulance Fleet Dispatch & Tracking GPS Real-Time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Panggilan darurat ambulans 119/hospital emergency call, monitoring rute lalu lintas AI, & komunikasi paramedis.
              </p>
            </div>

            <button
              onClick={() => setIsAmbulanceModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Dispatch Ambulans Baru
            </button>
          </div>

          <div className="space-y-4">
            {ambulances.map((amb) => (
              <div
                key={amb.id}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5 hover:border-indigo-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-md">
                      {amb.ambulanceType}
                    </span>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-lg mt-1">{amb.callSign}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Driver: <strong className="text-slate-700 dark:text-slate-300">{amb.driverName}</strong> • Paramedis: {amb.paramedicName}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 font-bold text-xs rounded-lg inline-block ${
                        amb.status === 'En Route to Location' || amb.status === 'Transporting to ER'
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse'
                          : amb.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-blue-500/10 text-blue-600'
                      }`}
                    >
                      {amb.status}
                    </span>
                    {amb.etaMinutes > 0 && (
                      <p className="text-xs font-extrabold text-rose-600 mt-1">Estimasi Tiba (ETA): ~{amb.etaMinutes} Menit</p>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                    Lokasi Penjemputan / Tujuan: {amb.destinationLocation}
                  </p>
                  <p className="text-slate-500 font-mono text-[11px]">
                    Koordinat GPS: {amb.gpsCoordinates} (Telemetri Terhubung Ke Komando IGD)
                  </p>
                </div>

                {/* AI Route Recommendation */}
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2">
                  <Navigation className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block font-bold">Navigasi AI Traffic Route Optimization:</strong>
                    {amb.aiFastestRoute}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px] font-medium">Update Status:</span>
                    <button
                      onClick={() => handleUpdateAmbulanceStatus(amb.id, 'On Scene')}
                      className="px-2.5 py-1 bg-amber-500/10 text-amber-700 rounded text-[11px] font-bold hover:bg-amber-500/20"
                    >
                      Sampai Lokasi
                    </button>
                    <button
                      onClick={() => handleUpdateAmbulanceStatus(amb.id, 'Transporting to ER')}
                      className="px-2.5 py-1 bg-rose-500/10 text-rose-700 rounded text-[11px] font-bold hover:bg-rose-500/20"
                    >
                      Bawa Ke IGD RS
                    </button>
                    <button
                      onClick={() => handleUpdateAmbulanceStatus(amb.id, 'Completed')}
                      className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 rounded text-[11px] font-bold hover:bg-emerald-500/20"
                    >
                      Selesai / Standby
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEDICAL CERTIFICATES & QR VERIFICATION */}
      {activeTab === 'Certificates' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Penerbitan Surat Keterangan Medis Resmi & Verifikasi Digital QR
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Surat Sakit, Surat Sehat, Surat Bebas Narkoba, & Surat Rujukan yang dienkripsi QR digital legal.
              </p>
            </div>

            <button
              onClick={() => setIsCertModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Terbitkan Surat Medis Baru
            </button>
          </div>

          <div className="space-y-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5 hover:border-emerald-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-md">
                      {cert.certificateType}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">{cert.patientName}</h4>
                    <p className="text-xs text-slate-500">
                      {cert.norm} • DPJP: <strong className="text-slate-700 dark:text-slate-300">{cert.issuedDoctor}</strong> • Tgl Terbit: {cert.issueDate}
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 font-bold text-xs rounded-lg flex items-center gap-1.5 border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    {cert.verifiedStatus}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{cert.summaryNote}</p>
                </div>

                <div className="flex flex-wrap justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-xs gap-2">
                  <div className="flex items-center gap-2 font-mono text-slate-500 text-[11px]">
                    <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Digital Signature Token: {cert.digitalSignatureQr}</span>
                  </div>

                  <button
                    onClick={() => setSelectedCertificateToPrint(cert)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Lihat & Cetak Dokumen Resmi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MORTUARY RECORDS */}
      {activeTab === 'Mortuary' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-slate-500" />
                Manajemen Pemulasaraan Jenazah & Cold Storage Box
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencatatan Cause of Death (COD), penyimpanan freezer box, & proses penyerahan resmi ke keluarga.
              </p>
            </div>

            <button
              onClick={() => setIsMortuaryModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Catat Pemulasaraan Baru
            </button>
          </div>

          <div className="space-y-4">
            {mortuaryRecords.map((m) => (
              <div
                key={m.id}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{m.deceasedName}</h4>
                    <p className="text-xs text-slate-500 font-mono">
                      {m.norm} • Meninggal: {m.dateOfDeath} jam {m.timeOfDeath}
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 font-bold text-xs rounded-lg border border-emerald-500/20">
                    {m.releaseStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">Penyebab Kematian (COD):</span>
                    <span className="font-bold text-slate-900 dark:text-white">{m.causeOfDeath}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold text-[11px]">Lokasi Cold Storage:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{m.freezerBoxNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE CSSD BATCH */}
      {isCssdModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Buat Batch Autoclave Sterilisasi Baru
              </h3>
              <button
                onClick={() => setIsCssdModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCssdBatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Set Instrumen OK</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Set Orthopedi Hemiarthroplasty OK-2"
                  value={newBatch.instrumentSetName}
                  onChange={(e) => setNewBatch({ ...newBatch, instrumentSetName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Mesin Autoclave</label>
                  <select
                    value={newBatch.autoclaveMachineId}
                    onChange={(e) => setNewBatch({ ...newBatch, autoclaveMachineId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Autoclave Unit #01">Autoclave Steam Unit #01</option>
                    <option value="Autoclave Unit #02">Autoclave Steam Unit #02</option>
                    <option value="Autoclave Unit #03">Autoclave Plasma Low-Temp #03</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Jumlah Alat (Pcs)</label>
                  <input
                    type="number"
                    required
                    value={newBatch.itemsCount}
                    onChange={(e) => setNewBatch({ ...newBatch, itemsCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Tipe Sterilisasi</label>
                <select
                  value={newBatch.sterilizationType}
                  onChange={(e) => setNewBatch({ ...newBatch, sterilizationType: e.target.value as CSSDBatch['sterilizationType'] })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                >
                  <option value="Steam Autoclave 134C">Steam Autoclave (134°C High Pressure)</option>
                  <option value="Plasma Sterilization">Plasma Sterilization (Suhu Rendah Sensitive)</option>
                  <option value="ETO Gas">Ethylene Oxide (ETO Gas)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCssdModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Proses Sterilisasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DISPATCH AMBULANCE */}
      {isAmbulanceModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Truck className="w-5 h-5 text-indigo-500" />
                Dispatch Emergency Ambulans Baru
              </h3>
              <button
                onClick={() => setIsAmbulanceModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAmbulanceDispatch} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Call Sign Unit</label>
                <input
                  type="text"
                  required
                  value={newAmb.callSign}
                  onChange={(e) => setNewAmb({ ...newAmb, callSign: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Tipe Unit Ambulans</label>
                  <select
                    value={newAmb.ambulanceType}
                    onChange={(e) => setNewAmb({ ...newAmb, ambulanceType: e.target.value as AmbulanceDispatch['ambulanceType'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Advance Life Support (ALS)">ALS (Ventilator & Monitor Defibrilator)</option>
                    <option value="Basic Life Support (BLS)">BLS (Pertolongan Pertama Standard)</option>
                    <option value="Transport Emergency">Transport Pasien Antar Faskes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Driver</label>
                  <input
                    type="text"
                    required
                    value={newAmb.driverName}
                    onChange={(e) => setNewAmb({ ...newAmb, driverName: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Paramedis Pengawal</label>
                <input
                  type="text"
                  required
                  value={newAmb.paramedicName}
                  onChange={(e) => setNewAmb({ ...newAmb, paramedicName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Lokasi Penjemputan / Kejadian Emergency</label>
                <textarea
                  rows={2}
                  required
                  value={newAmb.destinationLocation}
                  onChange={(e) => setNewAmb({ ...newAmb, destinationLocation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAmbulanceModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Kirim Ambulans Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE MEDICAL CERTIFICATE */}
      {isCertModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                Penerbitan Surat Keterangan Medis
              </h3>
              <button
                onClick={() => setIsCertModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: An. Rizky Pratama"
                  value={newCert.patientName}
                  onChange={(e) => setNewCert({ ...newCert, patientName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">No Rekam Medis</label>
                  <input
                    type="text"
                    placeholder="RM-2026-xxxx"
                    value={newCert.norm}
                    onChange={(e) => setNewCert({ ...newCert, norm: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Jenis Surat</label>
                  <select
                    value={newCert.certificateType}
                    onChange={(e) => setNewCert({ ...newCert, certificateType: e.target.value as MedicalCertificate['certificateType'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Surat Keterangan Sakit">Surat Keterangan Sakit Istirahat</option>
                    <option value="Surat Keterangan Sehat">Surat Keterangan Sehat Fisik</option>
                    <option value="Medical Check Up (MCU)">Medical Check Up (MCU)</option>
                    <option value="Surat Kematian">Surat Keterangan Kematian (COD)</option>
                    <option value="Surat Kelahiran">Surat Keterangan Kelahiran</option>
                    <option value="Surat Vaksinasi">Surat Keterangan Vaksinasi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Dokter Penanggung Jawab (DPJP)</label>
                <input
                  type="text"
                  required
                  value={newCert.issuedDoctor}
                  onChange={(e) => setNewCert({ ...newCert, issuedDoctor: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Isi Keterangan Medis</label>
                <textarea
                  rows={3}
                  required
                  value={newCert.summaryNote}
                  onChange={(e) => setNewCert({ ...newCert, summaryNote: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCertModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Terbitkan Surat Digital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE MORTUARY */}
      {isMortuaryModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-slate-500" />
                Catat Pemulasaraan Jenazah Baru
              </h3>
              <button
                onClick={() => setIsMortuaryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMortuaryRecord} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Jenazah</label>
                <input
                  type="text"
                  required
                  value={newMortuary.deceasedName}
                  onChange={(e) => setNewMortuary({ ...newMortuary, deceasedName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">No RM</label>
                  <input
                    type="text"
                    placeholder="RM-2026-xxxx"
                    value={newMortuary.norm}
                    onChange={(e) => setNewMortuary({ ...newMortuary, norm: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Jam Meninggal</label>
                  <input
                    type="text"
                    value={newMortuary.timeOfDeath}
                    onChange={(e) => setNewMortuary({ ...newMortuary, timeOfDeath: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Penyebab Kematian (COD)</label>
                <input
                  type="text"
                  required
                  value={newMortuary.causeofDeath}
                  onChange={(e) => setNewMortuary({ ...newMortuary, causeofDeath: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Lokasi Box Cold Storage</label>
                <select
                  value={newMortuary.freezerBoxNumber}
                  onChange={(e) => setNewMortuary({ ...newMortuary, freezerBoxNumber: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                >
                  <option value="Box Cold Storage #01">Box Cold Storage #01</option>
                  <option value="Box Cold Storage #02">Box Cold Storage #02</option>
                  <option value="Box Cold Storage #03">Box Cold Storage #03</option>
                  <option value="Box Cold Storage #04">Box Cold Storage #04</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMortuaryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-sm"
                >
                  Simpan Data Pemulasaraan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DOCUMENT OFFICIAL PRINT PREVIEW */}
      {selectedCertificateToPrint && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCertificateToPrint(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Document Header Letterhead */}
            <div className="border-b-2 border-slate-900 dark:border-white pb-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-wide uppercase">
                  RUMAH SAKIT UMUM DAERAH SMART MEDIKA
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Jl. Kesehatan Raya No. 100, Jakarta Selatan • Telp: (021) 555-0199 • Email: info@smartmedika.go.id
              </p>
              <div className="text-[10px] font-mono text-emerald-600 font-bold uppercase tracking-widest pt-1">
                TERINTEGRASI SATUSEHAT KEMENKES RI & BPJS BRIDGING V-CLAIM
              </div>
            </div>

            {/* Document Body */}
            <div className="space-y-4 text-xs text-slate-900 dark:text-white">
              <div className="text-center font-bold text-sm underline uppercase tracking-wider">
                {selectedCertificateToPrint.certificateType}
              </div>

              <div className="space-y-2 leading-relaxed">
                <p>Yang bertanda tangan di bawah ini dokter pemeriksa RSUD Smart Medika menerangkan bahwa:</p>
                <table className="w-full font-medium ml-4 space-y-1">
                  <tbody>
                    <tr>
                      <td className="w-36 text-slate-500">Nama Pasien</td>
                      <td>: <strong className="text-slate-900 dark:text-white">{selectedCertificateToPrint.patientName}</strong></td>
                    </tr>
                    <tr>
                      <td className="text-slate-500">No Rekam Medis</td>
                      <td className="font-mono">: {selectedCertificateToPrint.norm}</td>
                    </tr>
                    <tr>
                      <td className="text-slate-500">Tanggal Pemeriksaan</td>
                      <td>: {selectedCertificateToPrint.issueDate}</td>
                    </tr>
                  </tbody>
                </table>

                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 font-serif italic text-sm text-slate-800 dark:text-slate-200">
                  "{selectedCertificateToPrint.summaryNote}"
                </div>
              </div>

              {/* Signature Section */}
              <div className="flex justify-between items-end pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center space-y-1">
                  <QrCode className="w-12 h-12 text-emerald-600 mx-auto" />
                  <span className="text-[10px] font-mono font-bold text-emerald-700 block">VERIFIED QR SEAL</span>
                  <span className="text-[9px] text-slate-500 font-mono block">{selectedCertificateToPrint.digitalSignatureQr}</span>
                </div>

                <div className="text-right space-y-1 text-xs">
                  <p className="text-slate-500">Jakarta, {selectedCertificateToPrint.issueDate}</p>
                  <p className="font-semibold text-slate-600">Dokter Pemeriksa,</p>
                  <div className="h-12"></div>
                  <p className="font-extrabold underline">{selectedCertificateToPrint.issuedDoctor}</p>
                  <p className="text-[10px] text-slate-500">SIP: 503/449/SIP-DS/2026</p>
                </div>
              </div>
            </div>

            {/* Footer Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedCertificateToPrint(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert(`Mencetak dokumen resmi ${selectedCertificateToPrint.certificateType} untuk ${selectedCertificateToPrint.patientName}...`);
                  setSelectedCertificateToPrint(null);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Cetak Ke Printer PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
