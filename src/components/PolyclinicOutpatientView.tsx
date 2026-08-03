import React, { useState } from 'react';
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Volume2,
  Sparkles,
  Search,
  Filter,
  Plus,
  FileText,
  Pill,
  FlaskConical,
  Scan,
  RefreshCw,
  HeartPulse,
  Activity,
  Bed,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  ChevronRight,
  Printer,
  X,
  Send,
  AlertTriangle,
  BrainCircuit,
  Building2,
  Calendar
} from 'lucide-react';
import { Patient } from '../types';
import { MOCK_PATIENTS } from '../data/mockData';

interface PolyclinicPatient {
  id: string;
  queueNo: string;
  patient: Patient;
  polyName: string;
  doctorName: string;
  scheduleTime: string;
  status: 'Menunggu' | 'Dipanggil' | 'Diperiksa' | 'Selesai' | 'Rawat Inap';
  vitalSigns?: {
    bp: string;
    hr: string;
    temp: string;
    spo2: string;
    rr: string;
    weight: string;
    height: string;
  };
  complaint: string;
  triagePriority: 'Hijau (Normal)' | 'Kuning (Urgent)' | 'Merah (Emergency)';
  sepStatus: string;
  soapNotes?: {
    subjective: string;
    objective: string;
    assessment: string;
    icd10Code: string;
    plan: string;
    prescriptions: string[];
  };
}

const INITIAL_POLY_PATIENTS: PolyclinicPatient[] = [
  {
    id: 'poly-1',
    queueNo: 'POLI-A-001',
    patient: MOCK_PATIENTS[0],
    polyName: 'Poli Penyakit Dalam',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    scheduleTime: '08:30 WIB',
    status: 'Diperiksa',
    vitalSigns: { bp: '130/85', hr: '88x/m', temp: '36.8°C', spo2: '98%', rr: '18x/m', weight: '68kg', height: '170cm' },
    complaint: 'Mual muntah sejak 2 hari, nyeri ulu hati tembus ke punggung setelah makan pedas.',
    triagePriority: 'Kuning (Urgent)',
    sepStatus: 'SEP-20260803-001 (Aktif)',
    soapNotes: {
      subjective: 'Pasien mengeluh nyeri ulu hati (epigastrium) persisten, mual, dan kembung.',
      objective: 'Nyeri tekan epigastrium (+), bising usus normal, TTV stabil.',
      assessment: 'Dispepsia Organik / Gastritis Akut',
      icd10Code: 'K30 - Dyspepsia',
      plan: 'Inj Omeprazole 40mg IV, Sucralfate Syrup 3x1 Cth, Domperidone 3x10mg ac.',
      prescriptions: ['Omeprazole 20mg Tab 2x1', 'Sucralfate Syrup 100ml 3x1 Cth', 'Domperidone 10mg Tab 3x1']
    }
  },
  {
    id: 'poly-2',
    queueNo: 'POLI-A-002',
    patient: MOCK_PATIENTS[1],
    polyName: 'Poli Penyakit Dalam',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    scheduleTime: '09:00 WIB',
    status: 'Menunggu',
    vitalSigns: { bp: '140/90', hr: '92x/m', temp: '37.1°C', spo2: '97%', rr: '20x/m', weight: '72kg', height: '165cm' },
    complaint: 'Kontrol ulang hipertensi & cek rutin gula darah puasa.',
    triagePriority: 'Hijau (Normal)',
    sepStatus: 'SEP-20260803-002 (Aktif)',
  },
  {
    id: 'poly-3',
    queueNo: 'POLI-B-001',
    patient: MOCK_PATIENTS[2],
    polyName: 'Poli Jantung & Pembuluh Darah',
    doctorName: 'dr. Sarah Wijaya, Sp.JP',
    scheduleTime: '09:15 WIB',
    status: 'Menunggu',
    vitalSigns: { bp: '125/80', hr: '78x/m', temp: '36.5°C', spo2: '99%', rr: '16x/m', weight: '60kg', height: '158cm' },
    complaint: 'Dada terasa berdebar-debar saat beraktivitas berat.',
    triagePriority: 'Hijau (Normal)',
    sepStatus: 'SEP-20260803-003 (Aktif)'
  },
  {
    id: 'poly-4',
    queueNo: 'POLI-C-001',
    patient: MOCK_PATIENTS[3],
    polyName: 'Poli Anak & Tumbuh Kembang',
    doctorName: 'dr. Anisa Putri, Sp.A',
    scheduleTime: '09:30 WIB',
    status: 'Selesai',
    vitalSigns: { bp: '110/70', hr: '100x/m', temp: '38.2°C', spo2: '98%', rr: '22x/m', weight: '18kg', height: '110cm' },
    complaint: 'Demam tinggi naik turun 3 hari disertai batuk pilek.',
    triagePriority: 'Hijau (Normal)',
    sepStatus: 'SEP-20260803-004 (Selesai)'
  }
];

export const PolyclinicOutpatientView: React.FC<{ onOpenEMR?: (patient: Patient) => void }> = ({
  onOpenEMR
}) => {
  const [patients, setPatients] = useState<PolyclinicPatient[]>(INITIAL_POLY_PATIENTS);
  const [selectedPoly, setSelectedPoly] = useState<string>('Semua Poli');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');
  const [searchQuery, setSearchQuery] = useState('');
  const [callingQueue, setCallingQueue] = useState<string | null>(null);

  // Selected Patient for Consultation / Examination Modal
  const [activePatientForExam, setActivePatientForExam] = useState<PolyclinicPatient | null>(null);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  // Vital Signs Input Modal
  const [activePatientForVitals, setActivePatientForVitals] = useState<PolyclinicPatient | null>(null);
  const [vitalsFormData, setVitalsFormData] = useState({
    bp: '120/80',
    hr: '80x/m',
    temp: '36.5°C',
    spo2: '98%',
    rr: '18x/m',
    weight: '65kg',
    height: '168cm'
  });

  // Doctor Consultation Form
  const [doctorSubjective, setDoctorSubjective] = useState('');
  const [doctorObjective, setDoctorObjective] = useState('');
  const [doctorAssessment, setDoctorAssessment] = useState('');
  const [doctorIcd10, setDoctorIcd10] = useState('');
  const [doctorPlan, setDoctorPlan] = useState('');
  const [doctorRxInput, setDoctorRxInput] = useState('');
  const [isSavingSOAP, setIsSavingSOAP] = useState(false);

  const polyList = [
    'Semua Poli',
    'Poli Penyakit Dalam',
    'Poli Jantung & Pembuluh Darah',
    'Poli Anak & Tumbuh Kembang',
    'Poli Kebidanan & Kandungan',
    'Poli Bedah Saraf',
    'Poli THT'
  ];

  const filteredPatients = patients.filter(p => {
    const matchesPoly = selectedPoly === 'Semua Poli' || p.polyName === selectedPoly;
    const matchesStatus = selectedStatus === 'Semua Status' || p.status === selectedStatus;
    const matchesQuery =
      p.patient.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patient.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.queueNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPoly && matchesStatus && matchesQuery;
  });

  // Call Patient Sound Trigger Simulation
  const handleCallPatient = (p: PolyclinicPatient) => {
    setCallingQueue(p.queueNo);
    setPatients(prev =>
      prev.map(item => (item.id === p.id ? { ...item, status: 'Dipanggil' } : item))
    );

    setTimeout(() => {
      setCallingQueue(null);
    }, 3000);
  };

  const handleOpenExaminationModal = (p: PolyclinicPatient) => {
    setActivePatientForExam(p);
    setDoctorSubjective(p.soapNotes?.subjective || p.complaint);
    setDoctorObjective(
      p.soapNotes?.objective ||
        `Keadaan Umum: Baik, Kesadaran: Compos Mentis. TTV: TD ${p.vitalSigns?.bp || '120/80'}, HR ${p.vitalSigns?.hr || '80'}, Temp ${p.vitalSigns?.temp || '36.5'}, SpO2 ${p.vitalSigns?.spo2 || '98%'}.`
    );
    setDoctorAssessment(p.soapNotes?.assessment || 'Dispepsia Organik');
    setDoctorIcd10(p.soapNotes?.icd10Code || 'K30 - Dyspepsia');
    setDoctorPlan(p.soapNotes?.plan || 'Pemberian Terapi Medikamentosa, Diet Lambung lunak.');
    setDoctorRxInput(p.soapNotes?.prescriptions?.join('\n') || 'Omeprazole 20mg 2x1\nSucralfate Syrup 3x1 Cth');
    setIsExamModalOpen(true);
  };

  const handleSaveSOAPConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatientForExam) return;

    setIsSavingSOAP(true);
    setTimeout(() => {
      setPatients(prev =>
        prev.map(item =>
          item.id === activePatientForExam.id
            ? {
                ...item,
                status: 'Selesai',
                soapNotes: {
                  subjective: doctorSubjective,
                  objective: doctorObjective,
                  assessment: doctorAssessment,
                  icd10Code: doctorIcd10,
                  plan: doctorPlan,
                  prescriptions: doctorRxInput.split('\n').filter(Boolean)
                }
              }
            : item
        )
      );
      setIsSavingSOAP(false);
      setIsExamModalOpen(false);
    }, 600);
  };

  const handleSaveVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatientForVitals) return;

    setPatients(prev =>
      prev.map(item =>
        item.id === activePatientForVitals.id
          ? { ...item, vitalSigns: { ...vitalsFormData } }
          : item
      )
    );
    setActivePatientForVitals(null);
  };

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Stethoscope className="w-4 h-4 text-cyan-400" /> Poliklinik & Rawat Jalan (Outpatient Management)
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Pelayanan Poliklinik Rawat Jalan & Antrian Cerdas
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manajemen Pemanggilan Antrian Poliklinik, Pemeriksaan Tanda Vital Perawat, Konsultasi Dokter SOAP, e-Prescription & V-Claim SEP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono">
            <span className="text-slate-400">Total Pasien Hari Ini: </span>
            <span className="text-cyan-300 font-bold">{patients.length} Pasien</span>
          </div>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Total Antrian</div>
          <div className="text-2xl font-bold text-white font-mono">{patients.length}</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Menunggu Dipanggil</div>
          <div className="text-2xl font-bold text-amber-300 font-mono">
            {patients.filter(p => p.status === 'Menunggu').length}
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Sedang Diperiksa</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono">
            {patients.filter(p => p.status === 'Diperiksa' || p.status === 'Dipanggil').length}
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Selesai Layanan</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {patients.filter(p => p.status === 'Selesai').length}
          </div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Rata-Rata Waktu (AWT)</div>
          <div className="text-2xl font-bold text-sky-300 font-mono">12 Menit</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-1">
          <div className="text-slate-400 font-medium">Bridging SEP BPJS</div>
          <div className="text-2xl font-bold text-emerald-300 font-mono">100% Valid</div>
        </div>
      </div>

      {/* Audio Calling Active Alert Banner */}
      {callingQueue && (
        <div className="bg-cyan-950/90 border-2 border-cyan-400 rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <Volume2 className="w-8 h-8 text-cyan-300 animate-pulse" />
            <div>
              <div className="text-xs font-bold text-cyan-200 uppercase tracking-widest">MEMANGGIL ANTRIAN POLIKLINIK</div>
              <div className="text-lg font-black text-white font-mono">
                NOMOR ANTRIAN: <span className="text-cyan-300">{callingQueue}</span>
              </div>
            </div>
          </div>
          <span className="px-3 py-1 bg-cyan-500 text-slate-950 font-black rounded-lg text-xs">
            SUARA SPEAKER ACTIVE
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Poliklinik:</span>
            <select
              value={selectedPoly}
              onChange={e => setSelectedPoly(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {polyList.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <span className="text-xs text-slate-400 font-medium ml-2">Status:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Semua Status">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dipanggil">Dipanggil</option>
              <option value="Diperiksa">Diperiksa</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari nama pasien, No. RM, atau Antrian..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Polyclinic Patient List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPatients.map(p => (
            <div
              key={p.id}
              className={`bg-slate-950 border rounded-2xl p-4 space-y-3 transition-all shadow-md relative ${
                p.status === 'Diperiksa'
                  ? 'border-cyan-500/80 bg-cyan-950/20'
                  : p.status === 'Dipanggil'
                  ? 'border-amber-500/80 bg-amber-950/20'
                  : p.status === 'Selesai'
                  ? 'border-emerald-500/40 opacity-90'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Header Queue & Status */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-300 font-mono font-black text-sm rounded-lg border border-cyan-500/30">
                    {p.queueNo}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{p.polyName}</span>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                    p.status === 'Menunggu'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : p.status === 'Dipanggil'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                      : p.status === 'Diperiksa'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {/* Patient Basic Details */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{p.patient.fullName}</h3>
                  <span className="font-mono text-cyan-400 text-xs font-semibold">{p.patient.norm}</span>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span>{p.patient.gender} • {p.patient.birthDate}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">{p.sepStatus}</span>
                </div>

                <div className="text-[11px] text-slate-300 pt-1">
                  <span className="text-slate-500 font-semibold">DPJP Dokter:</span> {p.doctorName}
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 mt-2">
                  <span className="text-cyan-400 font-bold block mb-0.5">Keluhan Utama & Anamnesis:</span>
                  {p.complaint}
                </div>

                {/* Vital Signs Grid Display */}
                {p.vitalSigns ? (
                  <div className="grid grid-cols-4 gap-1.5 pt-1 text-[10px] text-center font-mono">
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">TD</span>
                      <span className="text-cyan-300 font-bold">{p.vitalSigns.bp}</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Nadi</span>
                      <span className="text-emerald-400 font-bold">{p.vitalSigns.hr}</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">Suhu</span>
                      <span className="text-amber-300 font-bold">{p.vitalSigns.temp}</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[9px]">SpO2</span>
                      <span className="text-sky-300 font-bold">{p.vitalSigns.spo2}</span>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActivePatientForVitals(p);
                    }}
                    className="w-full py-1.5 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 rounded-xl text-[11px] font-bold mt-2 flex items-center justify-center gap-1.5"
                  >
                    <HeartPulse className="w-3.5 h-3.5" /> Input Tanda Vital Perawat
                  </button>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs gap-2">
                <button
                  onClick={() => handleCallPatient(p)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold rounded-xl text-[11px] flex items-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Panggil
                </button>

                <button
                  onClick={() => handleOpenExaminationModal(p)}
                  className="flex-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-[11px] flex items-center justify-center gap-1.5 shadow"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Pemeriksaan EMR Dokter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL: INPUT VITAL SIGNS BY NURSE */}
      {activePatientForVitals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100">
            <button
              onClick={() => setActivePatientForVitals(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <HeartPulse className="w-6 h-6 text-amber-400" />
              <div>
                <h3 className="font-bold text-white text-base">Input Tanda Vital (Nurse Triage)</h3>
                <p className="text-xs text-slate-400">{activePatientForVitals.patient.fullName} ({activePatientForVitals.queueNo})</p>
              </div>
            </div>

            <form onSubmit={handleSaveVitals} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tekanan Darah (TD)</label>
                  <input
                    type="text"
                    required
                    value={vitalsFormData.bp}
                    onChange={e => setVitalsFormData({ ...vitalsFormData, bp: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Laju Nadi (HR)</label>
                  <input
                    type="text"
                    required
                    value={vitalsFormData.hr}
                    onChange={e => setVitalsFormData({ ...vitalsFormData, hr: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Suhu Tubuh (°C)</label>
                  <input
                    type="text"
                    required
                    value={vitalsFormData.temp}
                    onChange={e => setVitalsFormData({ ...vitalsFormData, temp: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Saturasi O2 (SpO2)</label>
                  <input
                    type="text"
                    required
                    value={vitalsFormData.spo2}
                    onChange={e => setVitalsFormData({ ...vitalsFormData, spo2: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Laju Napas (RR)</label>
                  <input
                    type="text"
                    value={vitalsFormData.rr}
                    onChange={e => setVitalsFormData({ ...vitalsFormData, rr: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Berat Badan (BB)</label>
                  <input
                    type="text"
                    value={vitalsFormData.weight}
                    onChange={e => setVitalsFormData({ ...vitalsFormData, weight: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActivePatientForVitals(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Simpan Tanda Vital
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DOCTOR SOAP CONSULTATION & EMR EXAMINATION */}
      {isExamModalOpen && activePatientForExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 custom-scrollbar space-y-5">
            <button
              onClick={() => setIsExamModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
              <Stethoscope className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="font-bold text-white text-base">Lembar Pemeriksaan Dokter Poliklinik (SOAP)</h3>
                <p className="text-xs text-slate-400">
                  Pasien: <span className="text-white font-bold">{activePatientForExam.patient.fullName}</span> ({activePatientForExam.patient.norm}) • {activePatientForExam.polyName}
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSOAPConsultation} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-bold text-cyan-300">[S] Subjective - Anamnesis & Keluhan Pasien</label>
                <textarea
                  rows={2}
                  required
                  value={doctorSubjective}
                  onChange={e => setDoctorSubjective(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-cyan-300">[O] Objective - Pemeriksaan Fisik & Tanda Vital</label>
                <textarea
                  rows={2}
                  required
                  value={doctorObjective}
                  onChange={e => setDoctorObjective(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block font-bold text-cyan-300">[A] Assessment - Diagnosa Dokter</label>
                  <input
                    type="text"
                    required
                    value={doctorAssessment}
                    onChange={e => setDoctorAssessment(e.target.value)}
                    placeholder="Contoh: Dispepsia Organik / Gastritis Akut"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-cyan-300">Kode ICD-10 Utama</label>
                  <input
                    type="text"
                    required
                    value={doctorIcd10}
                    onChange={e => setDoctorIcd10(e.target.value)}
                    placeholder="K30 - Dyspepsia"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-cyan-300">[P] Plan - Tatalaksana & Instruksi Klinis</label>
                <textarea
                  rows={2}
                  value={doctorPlan}
                  onChange={e => setDoctorPlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block font-bold text-emerald-400">e-Prescription (Resep Obat Elektronik Depo Farmasi)</label>
                <textarea
                  rows={3}
                  value={doctorRxInput}
                  onChange={e => setDoctorRxInput(e.target.value)}
                  placeholder="Omeprazole 20mg 2x1&#10;Sucralfate Syrup 3x1 Cth"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                {onOpenEMR && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsExamModalOpen(false);
                      onOpenEMR(activePatientForExam.patient);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> Buka Rekam Medis EMR Lengkap
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExamModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl text-xs"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingSOAP}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingSOAP ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Simpan SOAP & Selesaikan Konsultasi
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
