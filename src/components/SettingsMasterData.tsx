/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Database,
  Building2,
  Stethoscope,
  Bed,
  Users,
  FileCode,
  Pill,
  FlaskConical,
  ShieldCheck,
  ShieldAlert,
  Search,
  Plus,
  Lock,
  UserX,
  Key,
  Globe,
  Radio,
  Server,
  Save,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';
import { MASTER_DATA_SAMPLE, AUDIT_LOGS } from '../data/mockData';

export const SettingsMasterData: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'master' | 'config' | 'rbac' | 'audit'>('master');
  const [searchTerm, setSearchTerm] = useState('');
  const [masterList, setMasterList] = useState(MASTER_DATA_SAMPLE);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Hospital Configuration Form State
  const [hospitalConfig, setHospitalConfig] = useState({
    hospitalName: 'RSUP Mangunkusumo Digital AI Hospital',
    faskesCodeBPJS: '0112R001',
    kemenkesId: 'RS-3171012',
    satusehatClientId: 'satusehat_client_prod_88291039',
    satusehatSecret: '••••••••••••••••••••••••',
    satusehatEnv: 'Production (Live API)',
    vclaimVersion: 'V-Claim 2.0 Bridging',
    autoBackupInterval: 'Setiap 6 Jam',
    enableAiAssist: true,
    enableVoiceEMR: true,
  });

  const [isSavedAlert, setIsSavedAlert] = useState(false);

  // Modal State for Adding Master Data
  const [showAddMasterModal, setShowAddMasterModal] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCat, setNewCat] = useState('Obat & Farmasi');
  const [newDetails, setNewDetails] = useState('');

  const filteredMaster = masterList.filter(
    (m) =>
      (selectedCategory === 'All' || m.category === selectedCategory) &&
      (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedAlert(true);
    setTimeout(() => {
      setIsSavedAlert(false);
    }, 3000);
  };

  const handleAddMasterItem = () => {
    if (!newCode || !newName) return;
    const newItem = {
      id: `m-${Date.now()}`,
      code: newCode,
      name: newName,
      category: newCat,
      status: 'Active',
      details: { spec: newDetails || 'Master data terdaftar resmi SIMRS' }
    };
    setMasterList([newItem, ...masterList]);
    setShowAddMasterModal(false);
    setNewCode('');
    setNewName('');
    setNewDetails('');
    alert(`Master Data "${newName}" (${newCode}) berhasil ditambahkan!`);
  };

  return (
    <div className="space-y-6 pb-12 text-slate-100 p-4 lg:p-6">
      {/* Settings Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <SettingsIcon className="w-4 h-4 text-cyan-400" /> Enterprise Hospital Master Data & Security Center
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Master Data & Pengaturan Sistem RS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan Master Data ICD-10, Formularium Obat, Bridging SATUSEHAT & BPJS, Hak Akses RBAC, & Audit Trail SIEM.
          </p>
        </div>

        <div className="flex flex-wrap rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('master')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'master' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Master Data RS
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'config' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Konfigurasi SIMRS
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'rbac' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Akses Roles (RBAC)
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'audit' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Audit Trail Logs
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER DATA RS */}
      {activeTab === 'master' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari Kode ICD-10, Nama Obat, Poliklinik, Dokter, Supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
              >
                <option value="All">Semua Kategori</option>
                <option value="Poliklinik">Poliklinik</option>
                <option value="Ruang Inap">Ruang Inap</option>
                <option value="Obat & Farmasi">Obat & Farmasi</option>
                <option value="Diagnosa ICD-10">Diagnosa ICD-10</option>
                <option value="Tindakan ICD-9-CM">Tindakan ICD-9-CM</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddMasterModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
            >
              <Plus className="h-4 w-4" />
              + Tambah Master Data Baru
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Kode Master</th>
                  <th className="p-3">Nama Master Data</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Detail Spesifikasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {filteredMaster.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/60 transition">
                    <td className="p-3 font-mono font-bold text-cyan-400">{item.code}</td>
                    <td className="p-3 font-semibold text-white">{item.name}</td>
                    <td className="p-3">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {JSON.stringify(item.details)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: KONFIGURASI SIMRS & BRIDGING */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-6">
          {isSavedAlert && (
            <div className="bg-emerald-950/60 border border-emerald-500/40 p-4 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>Pengaturan SIMRS dan Integrasi Bridging SATUSEHAT / BPJS berhasil disimpan!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-400" /> Identitas Faskes & Profil Rumah Sakit
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Nama Resmi Rumah Sakit:</label>
                  <input
                    type="text"
                    value={hospitalConfig.hospitalName}
                    onChange={(e) => setHospitalConfig({ ...hospitalConfig, hospitalName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">Kode BPJS Faskes:</label>
                    <input
                      type="text"
                      value={hospitalConfig.faskesCodeBPJS}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, faskesCodeBPJS: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-cyan-300 font-mono rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Kode Kemenkes RS:</label>
                    <input
                      type="text"
                      value={hospitalConfig.kemenkesId}
                      onChange={(e) => setHospitalConfig({ ...hospitalConfig, kemenkesId: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 text-cyan-300 font-mono rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Jadwal Auto-Backup Database:</label>
                  <select
                    value={hospitalConfig.autoBackupInterval}
                    onChange={(e) => setHospitalConfig({ ...hospitalConfig, autoBackupInterval: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-2.5 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Setiap 1 Jam">Setiap 1 Jam</option>
                    <option value="Setiap 6 Jam">Setiap 6 Jam (Rekomendasi)</option>
                    <option value="Setiap 24 Jam (Tengah Malam)">Setiap 24 Jam (Tengah Malam)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-emerald-400" /> Kemenkes SATUSEHAT & BPJS V-Claim Bridging
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">SATUSEHAT Client ID (FHIR R4):</label>
                  <input
                    type="text"
                    value={hospitalConfig.satusehatClientId}
                    onChange={(e) => setHospitalConfig({ ...hospitalConfig, satusehatClientId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-emerald-300 font-mono rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">SATUSEHAT Client Secret Key:</label>
                  <input
                    type="password"
                    value={hospitalConfig.satusehatSecret}
                    onChange={(e) => setHospitalConfig({ ...hospitalConfig, satusehatSecret: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-emerald-300 font-mono rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Environment Mode:</label>
                  <select
                    value={hospitalConfig.satusehatEnv}
                    onChange={(e) => setHospitalConfig({ ...hospitalConfig, satusehatEnv: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 text-emerald-300 rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none font-semibold"
                  >
                    <option value="Production (Live API)">Production (Live Kemenkes)</option>
                    <option value="Staging / Sandbox">Staging / Sandbox Testing</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition"
            >
              <Save className="h-4 w-4" />
              Simpan Konfigurasi SIMRS
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: MANAJEMEN AKSES ROLES (RBAC) */}
      {activeTab === 'rbac' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="h-5 w-5 text-indigo-400" /> Matriks Otorisasi Role-Based Access Control (RBAC)
            </h3>
            <span className="text-xs text-indigo-300 bg-indigo-500/10 px-3 py-1 rounded border border-indigo-500/30 font-mono">
              Compliant ISO 27001 & Permenkes No. 24 EMR Security
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Nama Role SIMRS</th>
                  <th className="p-3">Akses Rekam Medis (EMR)</th>
                  <th className="p-3">Resep & Farmasi</th>
                  <th className="p-3">Billing & BPJS Claim</th>
                  <th className="p-3">Master Data Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-sans">
                <tr className="hover:bg-slate-800/60 transition">
                  <td className="p-3 font-bold text-white">Dokter DPJP / Spesialis</td>
                  <td className="p-3 text-emerald-400 font-semibold">Full Read & Write (CPPT)</td>
                  <td className="p-3 text-emerald-400 font-semibold">Order e-Prescription</td>
                  <td className="p-3 text-slate-500">Read-Only Diagnosa</td>
                  <td className="p-3 text-rose-400">No Access</td>
                </tr>
                <tr className="hover:bg-slate-800/60 transition">
                  <td className="p-3 font-bold text-white">Perawat / Nurse Station</td>
                  <td className="p-3 text-emerald-400 font-semibold">Tanda Vital & Asuhan Keperawatan</td>
                  <td className="p-3 text-cyan-400 font-semibold">Verifikasi Dispensing</td>
                  <td className="p-3 text-slate-500">No Access</td>
                  <td className="p-3 text-rose-400">No Access</td>
                </tr>
                <tr className="hover:bg-slate-800/60 transition">
                  <td className="p-3 font-bold text-white">Apoteker / Farmasis Depo</td>
                  <td className="p-3 text-slate-400 font-semibold">Read-Only Diagnosa & Alergi</td>
                  <td className="p-3 text-emerald-400 font-semibold">Full Dispensing & Stok FEFO</td>
                  <td className="p-3 text-cyan-400 font-semibold">Struk Resep</td>
                  <td className="p-3 text-rose-400">No Access</td>
                </tr>
                <tr className="hover:bg-slate-800/60 transition">
                  <td className="p-3 font-bold text-white">Petugas Kasir & Billing BPJS</td>
                  <td className="p-3 text-slate-400 font-semibold">Resume Medis Discharge Only</td>
                  <td className="p-3 text-slate-500">No Access</td>
                  <td className="p-3 text-emerald-400 font-semibold">Full RCM & V-Claim SEP</td>
                  <td className="p-3 text-rose-400">No Access</td>
                </tr>
                <tr className="hover:bg-slate-800/60 transition">
                  <td className="p-3 font-bold text-white">Super Admin IT RS</td>
                  <td className="p-3 text-slate-400 font-semibold">Audit Logs Only</td>
                  <td className="p-3 text-slate-400 font-semibold">Audit Logs Only</td>
                  <td className="p-3 text-slate-400 font-semibold">Audit Logs Only</td>
                  <td className="p-3 text-emerald-400 font-bold">Full Admin Config</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL LOGS & CYBER SECURITY */}
      {activeTab === 'audit' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Security Audit Trail & SIEM User Activity Logs
            </h3>
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-emerald-400">ENCRYPTION: AES-256</span>
              <button
                onClick={() => alert('Vulnerability Security Scan Selesai! Tidak ditemukan celah kebocoran data (0 Threat Found).')}
                className="rounded bg-indigo-500/20 px-2.5 py-1 text-indigo-300 hover:bg-indigo-500 hover:text-white transition"
              >
                Scan Vulnerability
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Waktu</th>
                  <th className="p-3">Pengguna</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Aktivitas / Aksi</th>
                  <th className="p-3">Modul</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">Perangkat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900 font-mono text-[11px]">
                {AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/60 transition">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-semibold text-white font-sans">{log.userName}</td>
                    <td className="p-3 text-cyan-400 font-sans">{log.role}</td>
                    <td className="p-3 text-slate-200 font-sans">{log.action}</td>
                    <td className="p-3 text-slate-400">{log.module}</td>
                    <td className="p-3 text-slate-400">{log.ipAddress}</td>
                    <td className="p-3 text-slate-400">{log.device}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add Master Data Item */}
      {showAddMasterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Tambah Master Data Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Kode Master Data (Misal: ICD-10 / Kode Obat):</label>
                <input
                  type="text"
                  placeholder="I10.9 / FAR-0092"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Deskripsi Master Data:</label>
                <input
                  type="text"
                  placeholder="Amoxicillin Trihydrate 500mg Kaplet"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kategori Master:</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Obat & Farmasi">Obat & Farmasi</option>
                  <option value="Diagnosa ICD-10">Diagnosa ICD-10</option>
                  <option value="Tindakan ICD-9-CM">Tindakan ICD-9-CM</option>
                  <option value="Poliklinik">Poliklinik</option>
                  <option value="Ruang Inap">Ruang Inap</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Detail Spesifikasi / Keterangan:</label>
                <textarea
                  rows={2}
                  placeholder="Satuan: Kaplet, Kemasan: Dus 10x10..."
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddMasterModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddMasterItem}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-xs text-slate-950 font-bold hover:bg-cyan-400"
              >
                Simpan Master Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
