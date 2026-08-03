import React, { useState } from 'react';
import {
  Droplet,
  Users,
  Clock,
  Thermometer,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Barcode,
  Brain,
  RefreshCw,
  Plus,
  Activity,
  FileCheck2,
  Heart,
  X,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { MOCK_BLOOD_INVENTORY, MOCK_BLOOD_CROSSMATCH, MOCK_PATIENTS } from '../data/mockData';
import { BloodInventoryItem, BloodCrossmatch, BloodType } from '../types';

export const BloodBankView: React.FC = () => {
  const [inventory, setInventory] = useState<BloodInventoryItem[]>(MOCK_BLOOD_INVENTORY);
  const [crossmatches, setCrossmatches] = useState<BloodCrossmatch[]>(MOCK_BLOOD_CROSSMATCH);
  const [selectedBloodType, setSelectedBloodType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'stok' | 'crossmatch' | 'donor'>('stok');

  // Modals State
  const [showDonorModal, setShowDonorModal] = useState(false);
  const [showCrossmatchModal, setShowCrossmatchModal] = useState(false);

  // New Donor Form State
  const [donorName, setDonorName] = useState('Budi Prasetyo');
  const [donorNik, setDonorNik] = useState('3271041209880001');
  const [donorBloodType, setDonorBloodType] = useState<BloodType>('O+');
  const [donorHb, setDonorHb] = useState('14.2');
  const [donorBp, setDonorBp] = useState('120/80');
  const [donorComponent, setDonorComponent] = useState('PRC');

  // New Crossmatch Request Form State
  const [xmPatientId, setXmPatientId] = useState(MOCK_PATIENTS[0]?.id || '');
  const [xmBloodType, setXmBloodType] = useState<BloodType>('A+');
  const [xmComponent, setXmComponent] = useState('PRC');
  const [xmBagCount, setXmBagCount] = useState('2');
  const [xmUrgency, setXmUrgency] = useState<'CITO' | 'Rutin'>('CITO');

  const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredInventory = inventory.filter((item) => {
    const matchesType = selectedBloodType === 'All' || item.bloodType === selectedBloodType;
    const matchesSearch =
      item.bagNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.donorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    const newBag: BloodInventoryItem = {
      id: `bag-${Date.now()}`,
      bagNumber: `BB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      bloodType: donorBloodType,
      component: donorComponent,
      donorName: donorName,
      collectionDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Available',
      storageTempCelsius: 3.5
    };
    setInventory([newBag, ...inventory]);
    setShowDonorModal(false);
  };

  const handleCreateCrossmatch = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = MOCK_PATIENTS.find((p) => p.id === xmPatientId) || MOCK_PATIENTS[0];
    const newXm: BloodCrossmatch = {
      id: `xm-${Date.now()}`,
      patientName: patient.fullName,
      norm: patient.norm,
      bloodType: xmBloodType,
      requiredComponent: xmComponent,
      bagNumberAssigned: `BB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      compatibilityResult: 'Compatible (Match)',
      requestTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      technicianName: 'Analis Rina, Amd.AK'
    };
    setCrossmatches([newXm, ...crossmatches]);
    setShowCrossmatchModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Droplet className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Bank Darah & Transfusi (Blood Bank BDRS)
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Stok komponen darah, uji silang serasi (Gel Test Crossmatch), pemantauan suhu cold-chain & prediksi kebutuhan emergency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDonorModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            + Donor Darah Baru
          </button>
          <button
            onClick={() => setShowCrossmatchModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition shadow-sm"
          >
            <Activity className="w-4 h-4 text-rose-400" />
            + Request Crossmatch
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('stok')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'stok'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Droplet className="w-4 h-4" />
          Stok Darah & Cold-Chain
        </button>

        <button
          onClick={() => setActiveTab('crossmatch')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'crossmatch'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          Uji Silang Serasi (Crossmatch) ({crossmatches.length})
        </button>

        <button
          onClick={() => setActiveTab('donor')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'donor'
              ? 'border-rose-600 text-rose-600 dark:text-rose-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Heart className="w-4 h-4" />
          Skrining IMLTD & Pendonor
        </button>
      </div>

      {/* Blood Stock Status Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {bloodTypes.map((bt) => {
          const count = inventory.filter((i) => i.bloodType === bt && i.status === 'Available').length;
          return (
            <div
              key={bt}
              onClick={() => setSelectedBloodType(selectedBloodType === bt ? 'All' : bt)}
              className={`p-3.5 rounded-xl border text-center transition cursor-pointer ${
                selectedBloodType === bt
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                  : count < 2
                  ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-slate-900 dark:text-white'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white hover:border-rose-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <Droplet className={`w-4 h-4 ${selectedBloodType === bt ? 'text-white' : 'text-rose-500'}`} />
                <span className="font-extrabold text-sm">{bt}</span>
              </div>
              <p className="text-xl font-black mt-1">{count} <span className="text-xs font-normal">kantong</span></p>
              {count < 2 && (
                <span className="inline-block mt-1 text-[10px] bg-rose-500 text-white px-1.5 py-0.2 font-bold rounded">
                  KRITIS
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* TAB 1: STOK DARAH & COLD CHAIN */}
      {activeTab === 'stok' && (
        <div className="space-y-6">
          {/* AI Stock Prediction Banner */}
          <div className="p-5 bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white rounded-2xl border border-rose-800/60 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 rounded-xl shadow-sm">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base text-rose-100">AI Blood Bank Predictive Inventory Engine</h3>
                <p className="text-xs text-rose-300 mt-0.5">
                  Prediksi kebutuhan stok 7 hari ke depan berdasarkan jadwal operasi (OK) & estimasi kasus emergency IGD.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-rose-800/40 text-xs text-rose-200">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                Peringatan AI: <strong className="text-white">Golongan O+ & AB+</strong> diprediksi defisit 8 kantong menjelang akhir pekan.
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Droplet className="w-5 h-5 text-rose-500" />
                Inventaris Kantong Darah Terdata ({filteredInventory.length})
              </h3>
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari No Kantong / Donor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase font-bold">
                  <tr>
                    <th className="p-3">No. Kantong / Barcode</th>
                    <th className="p-3">Gol / Komponen</th>
                    <th className="p-3">Pendonor</th>
                    <th className="p-3">Kedaluwarsa</th>
                    <th className="p-3">Suhu Cold-Chain</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3 font-mono font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Barcode className="w-4 h-4 text-slate-400" />
                        {item.bagNumber}
                      </td>
                      <td className="p-3">
                        <span className="font-extrabold text-rose-600 bg-rose-500/10 px-1.5 py-0.5 rounded mr-1">
                          {item.bloodType}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">{item.component}</span>
                      </td>
                      <td className="p-3 text-slate-700 dark:text-slate-300">{item.donorName}</td>
                      <td className="p-3 text-slate-500">{item.expiryDate}</td>
                      <td className="p-3">
                        <span className="flex items-center gap-1 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          <Thermometer className="w-3.5 h-3.5" />
                          {item.storageTempCelsius}°C
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Available'
                              ? 'bg-emerald-500/10 text-emerald-600'
                              : item.status === 'Crossmatched'
                              ? 'bg-amber-500/10 text-amber-600'
                              : 'bg-rose-500/10 text-rose-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: UJI SILANG SERASI (CROSSMATCH) */}
      {activeTab === 'crossmatch' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Permintaan & Hasil Uji Silang Serasi (Gel Test Crossmatch)
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan reaksi aglutinasi Mayor & Minor serologi pasien penerima transfusi.
              </p>
            </div>
            <button
              onClick={() => setShowCrossmatchModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
            >
              <Plus className="w-4 h-4" />
              + Request Crossmatch Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {crossmatches.map((xm) => (
              <div key={xm.id} className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{xm.patientName}</h4>
                    <p className="text-xs text-slate-500">{xm.norm}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {xm.compatibilityResult}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Golongan & Komponen:</span>
                    <strong className="text-rose-600 font-bold">{xm.bloodType} ({xm.requiredComponent})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Kantong Ditugaskan:</span>
                    <strong className="font-mono text-slate-800 dark:text-slate-200">{xm.bagNumberAssigned}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Waktu Tes:</span>
                    <span className="text-slate-600">{xm.crossmatchDate}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                  <span>Analis: {xm.technicianName}</span>
                  <button onClick={() => window.print()} className="text-indigo-600 font-bold flex items-center gap-1 hover:underline">
                    <Printer className="w-3 h-3" />
                    Cetak Etiket
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SKRINING IMLTD & DONOR */}
      {activeTab === 'donor' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Skrining IMLTD (Infeksi Menular Lewat Transfusi Darah)
              </h3>
              <p className="text-xs text-slate-500">
                Pemeriksaan wajib HBsAg, Anti-HCV, Anti-HIV, & Syphilis (TPHA/VDRL) untuk jaminan keamanan transfusi.
              </p>
            </div>
            <button
              onClick={() => setShowDonorModal(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              + Registrasi Pendonor Baru
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-bold">
                <tr>
                  <th className="p-3">Nama Pendonor</th>
                  <th className="p-3">Golongan</th>
                  <th className="p-3">HBsAg (Hepatitis B)</th>
                  <th className="p-3">Anti-HCV</th>
                  <th className="p-3">Anti-HIV</th>
                  <th className="p-3">Syphilis</th>
                  <th className="p-3">Kelayakan Donor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold">Budi Prasetyo (NIK: 327104...)</td>
                  <td className="p-3 font-bold text-rose-600">O+</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-bold text-[11px]">
                      LOLOS (LAYAK)
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold">Siti Aminah (NIK: 317402...)</td>
                  <td className="p-3 font-bold text-rose-600">A+</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3 text-emerald-600 font-bold">Non-Reaktif</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full font-bold text-[11px]">
                      LOLOS (LAYAK)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: REGISTRASI PENDONOR BARU */}
      {showDonorModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-600" />
                + Registrasi Pendonor Darah Baru
              </h3>
              <button onClick={() => setShowDonorModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleRegisterDonor} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Lengkap Pendonor</label>
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">NIK KTP</label>
                  <input
                    type="text"
                    value={donorNik}
                    onChange={(e) => setDonorNik(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Golongan Darah</label>
                  <select
                    value={donorBloodType}
                    onChange={(e) => setDonorBloodType(e.target.value as BloodType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-rose-600"
                  >
                    {bloodTypes.map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Kadar HB (g/dL)</label>
                  <input
                    type="text"
                    value={donorHb}
                    onChange={(e) => setDonorHb(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Tekanan Darah</label>
                  <input
                    type="text"
                    value={donorBp}
                    onChange={(e) => setDonorBp(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Komponen</label>
                  <select
                    value={donorComponent}
                    onChange={(e) => setDonorComponent(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="PRC">PRC (Packed Red Cells)</option>
                    <option value="WB">WB (Whole Blood)</option>
                    <option value="TC">TC (Thrombocyte Concentrate)</option>
                    <option value="FFP">FFP (Fresh Frozen Plasma)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDonorModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Simpan Kantong Darah
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: REQUEST CROSSMATCH TRANSFUSI */}
      {showCrossmatchModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600" />
                + Request Transfusi & Crossmatch Gel Test
              </h3>
              <button onClick={() => setShowCrossmatchModal(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateCrossmatch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pilih Pasien Penerima Transfusi</label>
                <select
                  value={xmPatientId}
                  onChange={(e) => setXmPatientId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                >
                  {MOCK_PATIENTS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.norm}) - {p.gender}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Golongan Darah Pasien</label>
                  <select
                    value={xmBloodType}
                    onChange={(e) => setXmBloodType(e.target.value as BloodType)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-rose-600"
                  >
                    {bloodTypes.map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Prioritas Transfusi</label>
                  <select
                    value={xmUrgency}
                    onChange={(e) => setXmUrgency(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="CITO">CITO Emergency (Pendarahan/OK)</option>
                    <option value="Rutin">Rutin Terjadwal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Komponen Darah</label>
                  <select
                    value={xmComponent}
                    onChange={(e) => setXmComponent(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  >
                    <option value="PRC">PRC (Packed Red Cells)</option>
                    <option value="WB">WB (Whole Blood)</option>
                    <option value="TC">TC (Thrombocyte Concentrate)</option>
                    <option value="FFP">FFP (Fresh Frozen Plasma)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Kantong</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={xmBagCount}
                    onChange={(e) => setXmBagCount(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCrossmatchModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Proses Gel Test Crossmatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

