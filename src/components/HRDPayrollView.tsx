import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Award,
  CalendarCheck,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Search,
  FileText,
  UserCheck,
  TrendingUp,
  Sparkles,
  Download,
  Stethoscope,
  X
} from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_SHIFT_ATTENDANCE } from '../data/mockData';
import { EmployeeRecord, ShiftAttendanceRecord } from '../types';
import { useHospitalData } from '../context/HospitalDataContext';

export const HRDPayrollView: React.FC = () => {
  const { addNotification, addActivityLog } = useHospitalData();
  const [employees, setEmployees] = useState<EmployeeRecord[]>(MOCK_EMPLOYEES);
  const [attendances] = useState<ShiftAttendanceRecord[]>(MOCK_SHIFT_ATTENDANCE);
  const [activeTab, setActiveTab] = useState<'employees' | 'credentialing' | 'payroll' | 'attendance'>('employees');
  const [searchTerm, setSearchTerm] = useState('');

  const [payslipModal, setPayslipModal] = useState<EmployeeRecord | null>(null);

  // Modal 1: Input Data Dokter State
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [docName, setDocName] = useState('');
  const [docSpec, setDocSpec] = useState('Spesialis Penyakit Dalam');
  const [docDept, setDocDept] = useState('Poliklinik Dalam');
  const [docStr, setDocStr] = useState(`31.1.2.${Math.floor(100 + Math.random() * 900)}.${Math.floor(10 + Math.random() * 90)}.${Math.floor(10000 + Math.random() * 90000)}`);
  const [docStrExp, setDocStrExp] = useState('2029-12-31');
  const [docSip, setDocSip] = useState(`503/${Math.floor(100 + Math.random() * 900)}/SIP-DOK/2026`);
  const [docSipExp, setDocSipExp] = useState('2029-12-31');
  const [docSalary, setDocSalary] = useState(12500000);
  const [docJasaMedis, setDocJasaMedis] = useState(8500000);

  // Modal 2: Input Data Perawat State
  const [showAddNurseModal, setShowAddNurseModal] = useState(false);
  const [nurseName, setNurseName] = useState('');
  const [nurseRole, setNurseRole] = useState('Perawat Penanggung Jawab');
  const [nurseDept, setNurseDept] = useState('IGD & Triage');
  const [nurseStr, setNurseStr] = useState(`31.2.1.${Math.floor(100 + Math.random() * 900)}.${Math.floor(10 + Math.random() * 90)}.${Math.floor(10000 + Math.random() * 90000)}`);
  const [nurseStrExp, setNurseStrExp] = useState('2028-10-15');
  const [nurseSikp, setNurseSikp] = useState(`503/${Math.floor(100 + Math.random() * 900)}/SIKP/2026`);
  const [nurseSalary, setNurseSalary] = useState(6500000);

  // Modal 3: Input Data Karyawan State
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Staf Billing & Kasir');
  const [empDept, setEmpDept] = useState('Keuangan & Billing RCM');
  const [empStatus, setEmpStatus] = useState('Tetap');
  const [empSalary, setEmpSalary] = useState(5500000);

  const handleCreateDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;
    const formattedName = docName.startsWith('dr.') ? docName : `dr. ${docName}`;
    const newDoc: EmployeeRecord = {
      id: `emp-doc-${Date.now()}`,
      employeeNip: `DOK-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formattedName,
      role: docSpec,
      department: docDept,
      strNumber: docStr,
      strExpiryDate: docStrExp,
      sipNumber: docSip,
      sipExpiryDate: docSipExp,
      employmentStatus: 'Tetap',
      basicSalary: Number(docSalary),
      medicalFeeShare: Number(docJasaMedis),
      kpiScore: 95,
      credentialStatus: 'Valid'
    };
    setEmployees([newDoc, ...employees]);
    addNotification({
      title: 'Dokter Baru Terdaftar',
      message: `${newDoc.name} (${newDoc.role}) telah didaftarkan ke SIMRS & STR/SIP Verified.`,
      category: 'Pasien',
      type: 'normal'
    });
    addActivityLog(`Input Data Dokter Baru: ${newDoc.name} [${newDoc.role}]`, 'HRD & Credentialing');
    setShowAddDoctorModal(false);
    setDocName('');
  };

  const handleCreateNurse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nurseName) return;
    const formattedName = nurseName.startsWith('Ns.') || nurseName.startsWith('Suster') ? nurseName : `Ns. ${nurseName}, S.Kep`;
    const newNurse: EmployeeRecord = {
      id: `emp-nrs-${Date.now()}`,
      employeeNip: `PRW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formattedName,
      role: nurseRole,
      department: nurseDept,
      strNumber: nurseStr,
      strExpiryDate: nurseStrExp,
      sipNumber: nurseSikp,
      sipExpiryDate: nurseStrExp,
      employmentStatus: 'Tetap',
      basicSalary: Number(nurseSalary),
      medicalFeeShare: 1500000,
      kpiScore: 92,
      credentialStatus: 'Valid'
    };
    setEmployees([newNurse, ...employees]);
    addNotification({
      title: 'Perawat Baru Terdaftar',
      message: `${newNurse.name} (${newNurse.role}) ditempatkan di ${newNurse.department}.`,
      category: 'Pasien',
      type: 'normal'
    });
    addActivityLog(`Input Data Perawat Baru: ${newNurse.name} [${newNurse.department}]`, 'HRD & Credentialing');
    setShowAddNurseModal(false);
    setNurseName('');
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName) return;
    const newEmp: EmployeeRecord = {
      id: `emp-stf-${Date.now()}`,
      employeeNip: `STF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: empName,
      role: empRole,
      department: empDept,
      strNumber: '-',
      strExpiryDate: '-',
      sipNumber: '-',
      sipExpiryDate: '-',
      employmentStatus: empStatus,
      basicSalary: Number(empSalary),
      medicalFeeShare: 0,
      kpiScore: 88,
      credentialStatus: 'Valid'
    };
    setEmployees([newEmp, ...employees]);
    addNotification({
      title: 'Karyawan Baru Terdaftar',
      message: `${newEmp.name} (${newEmp.role}) bergabung di divisi ${newEmp.department}.`,
      category: 'Finance',
      type: 'normal'
    });
    addActivityLog(`Input Data Karyawan Baru: ${newEmp.name} [${newEmp.role}]`, 'HRD & Credentialing');
    setShowAddEmployeeModal(false);
    setEmpName('');
  };

  return (
    <div className="space-y-6">
      {/* Banner Header */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
              <Briefcase className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Human Resource, Payroll & Credentialing</h1>
                <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  STR / SIP Auto-Monitor
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Pengelolaan SDM Rumah Sakit: Kredensial Tenaga Medis (STR/SIP), Absensi Face Recognition AI, Remunerasi Jasa Medis & Payroll Digital.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddDoctorModal(true)}
              className="flex items-center gap-2 rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 shadow-lg transition"
            >
              <Stethoscope className="h-4 w-4" />
              + Input Data Dokter
            </button>
            <button
              onClick={() => setShowAddNurseModal(true)}
              className="flex items-center gap-2 rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-lg transition"
            >
              <UserCheck className="h-4 w-4" />
              + Input Data Perawat
            </button>
            <button
              onClick={() => setShowAddEmployeeModal(true)}
              className="flex items-center gap-2 rounded-lg bg-cyan-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-cyan-500 shadow-lg transition"
            >
              <Briefcase className="h-4 w-4" />
              + Input Data Karyawan
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('employees')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'employees' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          Master Pegawai & Dokter ({employees.length})
        </button>
        <button
          onClick={() => setActiveTab('credentialing')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'credentialing' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Award className="h-4 w-4" />
          Kredensial, STR & SIP Expired Tracker
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'attendance' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <CalendarCheck className="h-4 w-4" />
          Absensi Face Recognition & Shift
        </button>
        <button
          onClick={() => setActiveTab('payroll')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'payroll' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <DollarSign className="h-4 w-4" />
          Payroll & Remunerasi Jasa Medis
        </button>
      </div>

      {/* TAB MASTER EMPLOYEES */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama pegawai, NIP, atau peranan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="text-xs font-mono text-slate-400">
              Total Staff Aktif: <span className="text-cyan-400 font-bold">{employees.length} Orang</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employees.map((emp) => (
              <div key={emp.id} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-100 text-base">{emp.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">{emp.employeeNip} • {emp.department}</p>
                  </div>
                  <span className="rounded bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                    {emp.role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-500 block text-[10px]">No. STR Resmi:</span>
                    <span className="font-mono text-slate-200">{emp.strNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">No. SIP Resmi:</span>
                    <span className="font-mono text-slate-200">{emp.sipNumber || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Status Kredensial:</span>
                    <span
                      className={`font-bold ${
                        emp.credentialStatus === 'Valid' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {emp.credentialStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Skor KPI Kinerja:</span>
                    <span className="font-bold text-cyan-400">{emp.kpiScore} / 100</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 text-xs">
                  <button
                    onClick={() => setPayslipModal(emp)}
                    className="text-cyan-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <FileText className="h-3.5 w-3.5" /> Lihat Slip Gaji & Jasa Medis
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CREDENTIALING */}
      {activeTab === 'credentialing' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" /> Pemantauan Otomatis Masa Berlaku STR & SIP (Kredensialing)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sistem memberikan peringatan otomatis 60 hari sebelum STR/SIP habis masa berlaku untuk proses Re-credentialing Komite Medis/Keperawatan.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Nama Tenaga Medis</th>
                  <th className="p-3">Jabatan & Unit</th>
                  <th className="p-3">Masa Berlaku STR</th>
                  <th className="p-3">Masa Berlaku SIP</th>
                  <th className="p-3">Status Kredensial</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-semibold text-slate-100">{emp.name}</td>
                    <td className="p-3">{emp.role} • {emp.department}</td>
                    <td className="p-3 font-mono">{emp.strExpiryDate || '-'}</td>
                    <td className="p-3 font-mono">{emp.sipExpiryDate || '-'}</td>
                    <td className="p-3 font-bold">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] ${
                          emp.credentialStatus === 'Valid'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {emp.credentialStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => alert(`Proses Re-credentialing Komite Medis diinisiasi untuk ${emp.name}`)}
                        className="rounded bg-slate-800 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition"
                      >
                        Re-Credential
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB ATTENDANCE & SHIFT */}
      {activeTab === 'attendance' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-cyan-400" /> Absensi Face Recognition AI & Penjadwalan Shift
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Presensi biometrik pengenalan wajah real-time terintegrasi jadwal IGD, ICU, OK, & Poliklinik.
              </p>
            </div>
            <button
              onClick={() => alert('Jadwal Shift Bulanan Tenaga Medis Otomatis Dibuat oleh AI Scheduler!')}
              className="rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              + AI Auto-Roster Shift
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendances.map((att) => (
              <div key={att.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{att.employeeName}</h4>
                    <p className="text-xs text-slate-400">Shift: <span className="text-cyan-300 font-semibold">{att.shiftType}</span></p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    att.status === 'Present' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {att.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">Jam Masuk:</span>
                    <span className="text-slate-200">{att.checkInTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Jam Keluar:</span>
                    <span className="text-slate-200">{att.checkOutTime || 'On Duty'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Akurasi AI Face Match:</span>
                    <span className="text-cyan-400 font-bold">{att.faceMatchAccuracy}% Match</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">Jam Lembur:</span>
                    <span className="text-amber-400">{att.overtimeHours} Jam</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB PAYROLL & REMUNERASI */}
      {activeTab === 'payroll' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-400" /> Payroll & Remunerasi Jasa Medis Dokter
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kalkulasi otomatis Gaji Pokok, Bagi Hasil Jasa Medis (Jamed) per Kasus/Tindakan, Potongan PPh 21, dan BPJS Ketenagakerjaan.
              </p>
            </div>
            <button
              onClick={() => alert('Transfer Payroll Massal Rp 342.800.000 Berhasil Diproses via Host-to-Host Bank Mandiri/BCA!')}
              className="rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shadow-lg"
            >
              🚀 Eksekusi Payroll Massal Host-to-Host Bank
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Nama Pegawai / Dokter</th>
                  <th className="p-3">Gaji Pokok</th>
                  <th className="p-3">Jasa Medis / Remunerasi</th>
                  <th className="p-3">Potongan PPh 21 & BPJS</th>
                  <th className="p-3">Take Home Pay</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {employees.map((emp) => {
                  const pot = 850000;
                  const thp = emp.basicSalary + emp.medicalFeeShare - pot;
                  return (
                    <tr key={emp.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-100">
                        {emp.name}
                        <div className="text-[10px] text-slate-400 font-mono">{emp.employeeNip} • {emp.role}</div>
                      </td>
                      <td className="p-3 font-mono">Rp {emp.basicSalary.toLocaleString('id-ID')}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">Rp {emp.medicalFeeShare.toLocaleString('id-ID')}</td>
                      <td className="p-3 font-mono text-rose-400">- Rp {pot.toLocaleString('id-ID')}</td>
                      <td className="p-3 font-mono text-cyan-300 font-extrabold">Rp {thp.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setPayslipModal(emp)}
                          className="rounded bg-slate-800 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition font-semibold"
                        >
                          Cetak Slip
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payslip Modal */}
      {payslipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-slate-100 text-lg">Slip Gaji & Jasa Medis Digital</h3>
              <button onClick={() => setPayslipModal(null)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="font-bold text-sm text-cyan-300">{payslipModal.name}</div>
              <p className="text-slate-400 font-mono text-[11px]">{payslipModal.employeeNip} • {payslipModal.role}</p>

              <div className="border-t border-slate-800 pt-3 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Gaji Pokok:</span>
                  <span>Rp {payslipModal.basicSalary.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Jasa Medis / Remunerasi:</span>
                  <span className="text-emerald-400 font-bold">Rp {payslipModal.medicalFeeShare.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-[10px]">
                  <span>Potongan BPJS & PPh 21:</span>
                  <span>- Rp 850,000</span>
                </div>
                <div className="flex justify-between font-bold text-cyan-300 text-sm border-t border-slate-800 pt-2 font-sans">
                  <span>TAKE HOME PAY:</span>
                  <span>Rp {(payslipModal.basicSalary + payslipModal.medicalFeeShare - 850000).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`PDF Slip Gaji Resmi terenkripsi dikirim ke WhatsApp / Email ${payslipModal.name}`);
                setPayslipModal(null);
              }}
              className="w-full rounded-xl bg-cyan-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              Kirim Slip Gaji via WhatsApp & PDF
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: INPUT DATA DOKTER */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-teal-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white">Input Data Dokter Baru</h3>
              </div>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Dokter & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: dr. Anindya Putri, Sp.A"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Spesialisasi / Peranan</label>
                  <select
                    value={docSpec}
                    onChange={(e) => setDocSpec(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Spesialis Penyakit Dalam">Spesialis Penyakit Dalam (Sp.PD)</option>
                    <option value="Spesialis Anak">Spesialis Anak (Sp.A)</option>
                    <option value="Spesialis Bedah Umum">Spesialis Bedah Umum (Sp.B)</option>
                    <option value="Spesialis Jantung & Pembuluh Darah">Spesialis Jantung (Sp.JP)</option>
                    <option value="Dokter Umum">Dokter Umum (Poliklinik / IGD)</option>
                    <option value="Spesialis Anestesiologi">Spesialis Anestesi (Sp.An)</option>
                    <option value="Spesialis Radiologi">Spesialis Radiologi (Sp.Rad)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Poliklinik / Unit Tugas</label>
                  <select
                    value={docDept}
                    onChange={(e) => setDocDept(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Poliklinik Dalam">Poliklinik Penyakit Dalam</option>
                    <option value="Poliklinik Anak">Poliklinik Anak</option>
                    <option value="Poliklinik Bedah">Poliklinik Bedah</option>
                    <option value="Poliklinik Jantung">Poliklinik Jantung</option>
                    <option value="Instalasi Gawat Darurat (IGD)">Instalasi Gawat Darurat (IGD)</option>
                    <option value="Instalasi Bedah Sentral (OK)">Instalasi Bedah Sentral (OK)</option>
                    <option value="ICU / HCU">ICU / HCU</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Nomor STR Resmi</label>
                  <input
                    type="text"
                    value={docStr}
                    onChange={(e) => setDocStr(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Masa Berlaku STR</label>
                  <input
                    type="date"
                    value={docStrExp}
                    onChange={(e) => setDocStrExp(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Nomor SIP Resmi</label>
                  <input
                    type="text"
                    value={docSip}
                    onChange={(e) => setDocSip(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Masa Berlaku SIP</label>
                  <input
                    type="date"
                    value={docSipExp}
                    onChange={(e) => setDocSipExp(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Gaji Pokok (IDR)</label>
                  <input
                    type="number"
                    value={docSalary}
                    onChange={(e) => setDocSalary(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Estimasi Remunerasi / Jasa Medis</label>
                  <input
                    type="number"
                    value={docJasaMedis}
                    onChange={(e) => setDocJasaMedis(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-500 px-5 py-2 font-bold text-slate-950 hover:bg-teal-400 shadow-lg"
                >
                  Simpan Data Dokter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: INPUT DATA PERAWAT */}
      {showAddNurseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Input Data Perawat Baru</h3>
              </div>
              <button
                onClick={() => setShowAddNurseModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNurse} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Perawat & Gelar *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ns. Siti Rahma, S.Kep"
                  value={nurseName}
                  onChange={(e) => setNurseName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Jabatan Keperawatan</label>
                  <select
                    value={nurseRole}
                    onChange={(e) => setNurseRole(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Perawat Kepala Ruangan">Perawat Kepala Ruangan (Karung)</option>
                    <option value="Perawat Penanggung Jawab">Perawat Penanggung Jawab (PJ Shift)</option>
                    <option value="Perawat Pelaksana">Perawat Pelaksana</option>
                    <option value="Perawat Anestesi / OK">Perawat Anestesi / Instrumentator</option>
                    <option value="Perawat Triage IGD">Perawat Triage IGD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Ruangan / Stasiun Tugas</label>
                  <select
                    value={nurseDept}
                    onChange={(e) => setNurseDept(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="IGD & Triage">IGD & Triage</option>
                    <option value="Ruang Rawat Inap Lt. 2 (Mawar)">Ruang Rawat Inap Lt. 2 (Mawar)</option>
                    <option value="Ruang Rawat Inap Lt. 3 (Melati)">Ruang Rawat Inap Lt. 3 (Melati)</option>
                    <option value="ICU / HCU Central">ICU / HCU Central</option>
                    <option value="Instalasi Bedah Sentral">Instalasi Bedah Sentral (OK)</option>
                    <option value="Poliklinik Rawat Jalan">Poliklinik Rawat Jalan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Nomor STR Keperawatan</label>
                  <input
                    type="text"
                    value={nurseStr}
                    onChange={(e) => setNurseStr(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Masa Berlaku STR</label>
                  <input
                    type="date"
                    value={nurseStrExp}
                    onChange={(e) => setNurseStrExp(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Nomor SIKP (Surat Izin Kerja)</label>
                  <input
                    type="text"
                    value={nurseSikp}
                    onChange={(e) => setNurseSikp(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Gaji Pokok (IDR)</label>
                  <input
                    type="number"
                    value={nurseSalary}
                    onChange={(e) => setNurseSalary(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddNurseModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-5 py-2 font-bold text-slate-950 hover:bg-emerald-400 shadow-lg"
                >
                  Simpan Data Perawat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: INPUT DATA KARYAWAN */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Input Data Karyawan / Staf Baru</h3>
              </div>
              <button
                onClick={() => setShowAddEmployeeModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Lengkap Karyawan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rudi Hermawan, S.Kom"
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Jabatan</label>
                  <input
                    type="text"
                    required
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Departemen / Divisi</label>
                  <select
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Keuangan & Billing RCM">Keuangan & Billing RCM</option>
                    <option value="Pendaftaran & Admisi">Pendaftaran & Admisi Pasien</option>
                    <option value="IT & SIMRS Administrator">IT & SIMRS Administrator</option>
                    <option value="Logistik & Farmasi">Logistik & Gudang Farmasi</option>
                    <option value="Rekam Medis (RMIK)">Rekam Medis (RMIK)</option>
                    <option value="Laboratorium / Radiologi Staff">Laboratorium / Radiologi Admin</option>
                    <option value="Keamanan & Driver Ambulans">Keamanan & Driver Ambulans</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Status Kepegawaian</label>
                  <select
                    value={empStatus}
                    onChange={(e) => setEmpStatus(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Tetap">Pegawai Tetap</option>
                    <option value="Kontrak">Pegawai Kontrak</option>
                    <option value="Outsource">Outsource</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Gaji Pokok (IDR)</label>
                  <input
                    type="number"
                    value={empSalary}
                    onChange={(e) => setEmpSalary(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-5 py-2 font-bold text-slate-950 hover:bg-cyan-400 shadow-lg"
                >
                  Simpan Data Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
