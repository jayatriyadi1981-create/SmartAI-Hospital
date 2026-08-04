import React, { useState } from 'react';
import {
  Pill,
  Search,
  Plus,
  AlertTriangle,
  Barcode,
  TrendingUp,
  RefreshCw,
  Layers,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  Filter,
  ArrowRightLeft,
  PackageCheck,
  ShieldAlert,
  Brain,
  X
} from 'lucide-react';
import { MOCK_DRUG_MASTER, MOCK_DRUG_BATCHES, MOCK_DRUG_DISPENSES } from '../data/mockData';
import { DrugMaster, DrugBatch, DrugDispense } from '../types';
import { useHospitalData } from '../context/HospitalDataContext';

export const PharmacyView: React.FC = () => {
  const { addPrescription, addActivityLog, addNotification } = useHospitalData();
  const [drugs, setDrugs] = useState<DrugMaster[]>(MOCK_DRUG_MASTER);
  const [batches, setBatches] = useState<DrugBatch[]>(MOCK_DRUG_BATCHES);
  const [dispenses, setDispenses] = useState<DrugDispense[]>(MOCK_DRUG_DISPENSES);
  const [activeTab, setActiveTab] = useState<'master' | 'batches' | 'dispense' | 'compounding' | 'narcotics' | 'ai_insights'>('master');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Input Data Modals state
  const [showAddDrugModal, setShowAddDrugModal] = useState(false);
  const [newDrugName, setNewDrugName] = useState('');
  const [newDrugCategory, setNewDrugCategory] = useState('Antibiotik');
  const [newDrugUnit, setNewDrugUnit] = useState('Tablet');
  const [newDrugFormula, setNewDrugFormula] = useState('');
  const [newDrugStock, setNewDrugStock] = useState(1000);
  const [newDrugMinStock, setNewDrugMinStock] = useState(200);
  const [newDrugUnitPrice, setNewDrugUnitPrice] = useState(1500);
  const [newDrugSellingPrice, setNewDrugSellingPrice] = useState(2500);
  const [newDrugSupplier, setNewDrugSupplier] = useState('PT Dexa Medica');

  // Input Batch Modal State
  const [showAddBatchModal, setShowAddBatchModal] = useState(false);
  const [batchDrugName, setBatchDrugName] = useState('Paracetamol 500mg');
  const [batchNumber, setBatchNumber] = useState(`B-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [batchExpDate, setBatchExpDate] = useState('2028-12-31');
  const [batchQuantity, setBatchQuantity] = useState(500);

  // Input Dispense / Prescriptions Modal State
  const [showAddDispenseModal, setShowAddDispenseModal] = useState(false);
  const [dispensePatientName, setDispensePatientName] = useState('Budi Santoso');
  const [dispenseDoctorName, setDispenseDoctorName] = useState('dr. Hendra, Sp.PD');
  const [dispenseDrugName, setDispenseDrugName] = useState('Amoxicillin 500mg');
  const [dispenseDosage, setDispenseDosage] = useState('3x1 Tab (Sesudah Makan)');

  // Compounding / Racikan State
  const [racikanName, setRacikanName] = useState('Puyer Batuk Anak No. 1');
  const [racikanTotalBungkus, setRacikanTotalBungkus] = useState(10);
  const [racikanItems, setRacikanItems] = useState([
    { drugName: 'Paracetamol 500mg Tab', dosePerBungkusMg: 125, mgPerTab: 500, totalTabsNeeded: 2.5 },
    { drugName: 'Ambroxol 30mg Tab', dosePerBungkusMg: 15, mgPerTab: 30, totalTabsNeeded: 5 },
    { drugName: 'CTM 4mg Tab', dosePerBungkusMg: 1, mgPerTab: 4, totalTabsNeeded: 2.5 }
  ]);

  // AI Drug Interaction Simulation
  const [simDrug1, setSimDrug1] = useState('Ceftriaxone Inj 1 Gram');
  const [simDrug2, setSimDrug2] = useState('Calcium IV Solution');
  const [interactionResult, setInteractionResult] = useState<string | null>(null);

  const handleCreateDrug = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDrugName) return;
    const newObj: DrugMaster = {
      id: `drg-${Date.now()}`,
      code: `OBT-${Math.floor(100 + Math.random() * 900)}`,
      name: newDrugName,
      category: newDrugCategory,
      formula: newDrugFormula || `${newDrugName} Active Formula`,
      unit: newDrugUnit,
      minStock: Number(newDrugMinStock),
      currentStock: Number(newDrugStock),
      unitPrice: Number(newDrugUnitPrice),
      sellingPrice: Number(newDrugSellingPrice),
      fastMovingStatus: 'Fast Moving',
      supplierName: newDrugSupplier,
      barcode: `899${Math.floor(1000000 + Math.random() * 9000000)}`,
      aiRestockForecastDays: 20,
      drugInteractions: []
    };
    setDrugs([newObj, ...drugs]);
    addNotification({
      title: 'Master Obat Baru Ditambahkan',
      message: `${newObj.name} (${newObj.code}) berhasil didaftarkan ke database Farmasi.`,
      category: 'Farmasi',
      type: 'normal'
    });
    addActivityLog(`Tambah Master Obat ${newObj.name}`, 'Farmasi & E-Prescribing');
    setShowAddDrugModal(false);
    setNewDrugName('');
    setNewDrugFormula('');
  };

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: DrugBatch = {
      id: `batch-${Date.now()}`,
      drugMasterId: 'drg-01',
      drugName: batchDrugName,
      batchNumber: batchNumber,
      expiryDate: batchExpDate,
      quantityInStock: Number(batchQuantity),
      manufactureDate: '2025-01-01',
      supplier: 'PT Kalbe Farma',
      storageLocation: 'Gudang Utama - Rak A3'
    };
    setBatches([newBatch, ...batches]);
    addNotification({
      title: 'Batch FEFO Obat Baru Masuk',
      message: `Batch ${newBatch.batchNumber} (${newBatch.drugName}) exp: ${newBatch.expiryDate} telah ditambahkan.`,
      category: 'Farmasi',
      type: 'normal'
    });
    addActivityLog(`Tambah Batch FEFO ${newBatch.batchNumber}`, 'Farmasi & E-Prescribing');
    setShowAddBatchModal(false);
  };

  const handleCreateDispense = (e: React.FormEvent) => {
    e.preventDefault();
    addPrescription({
      patientName: dispensePatientName,
      doctorName: dispenseDoctorName,
      items: [{ drugName: dispenseDrugName, dosage: dispenseDosage, frequency: '3x1', durationDays: 5, route: 'Oral', instructions: 'Sesudah makan' }]
    });
    const newDispense: DrugDispense = {
      id: `disp-${Date.now()}`,
      prescriptionNumber: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: dispensePatientName,
      norm: `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      dispenseDate: new Date().toLocaleTimeString('id-ID'),
      pharmacistName: 'Apt. Rina, S.Farm',
      status: 'Dispensed',
      items: [{ drugName: dispenseDrugName, quantity: 10, unitPrice: 2000, totalPrice: 20000 }]
    };
    setDispenses([newDispense, ...dispenses]);
    setShowAddDispenseModal(false);
  };

  const filteredDrugs = drugs.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || d.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const checkInteraction = () => {
    if (simDrug1.includes('Ceftriaxone') && simDrug2.includes('Calcium')) {
      setInteractionResult(
        '⚠️ KONTRAINDIKASI BERAT: Presipitasi Ceftriaxone-Kalsium dalam saluran IV dapat berakibat fatal pada organ paru/ginjal. Jangan dicampur!'
      );
    } else if (simDrug1.includes('Fentanyl') && simDrug2.includes('Benzodiazepine')) {
      setInteractionResult(
        '⚠️ HIGH RISK: Potensi depresi pernapasan berat & sedasi dalam. Memerlukan pemantauan kapnografi terus-menerus di ICU.'
      );
    } else {
      setInteractionResult('✅ Aman: Tidak ditemukan interaksi obat merugikan tingkat mayor dalam database AI Drug Engine.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-teal-500/30 bg-gradient-to-r from-slate-900 via-teal-950/40 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/40 shadow-inner">
              <Pill className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Smart Pharmacy Management</h1>
                <span className="rounded-full bg-teal-500/20 px-3 py-0.5 text-xs font-bold text-teal-300 border border-teal-500/30">
                  FEFO & AI-Guided
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Sistem pengelolaan farmasi terpadu: Master Obat, Batch FEFO, Narkotika/Psikotropika, Dispensing & AI Interaction Engine.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddBatchModal(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-semibold text-teal-300 border border-teal-500/30 hover:bg-slate-700 transition"
            >
              <Plus className="h-4 w-4" />
              + Input Batch FEFO
            </button>
            <button
              onClick={() => setShowAddDispenseModal(true)}
              className="flex items-center gap-2 rounded-lg bg-slate-800 px-3.5 py-2 text-xs font-semibold text-cyan-300 border border-cyan-500/30 hover:bg-slate-700 transition"
            >
              <Plus className="h-4 w-4" />
              + Input Resep / Dispensing
            </button>
            <button
              onClick={() => setShowAddDrugModal(true)}
              className="flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 shadow-lg transition"
            >
              <Plus className="h-4 w-4" />
              + Input Master Obat
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'master' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Pill className="h-4 w-4" />
          Master Obat & Stock ({drugs.length})
        </button>
        <button
          onClick={() => setActiveTab('batches')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'batches' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Layers className="h-4 w-4" />
          Batch FEFO & Expired Tracking ({batches.length})
        </button>
        <button
          onClick={() => setActiveTab('dispense')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'dispense' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <PackageCheck className="h-4 w-4" />
          Dispensing & e-Prescription ({dispenses.length})
        </button>
        <button
          onClick={() => setActiveTab('compounding')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'compounding' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          Kalkulator Obat Racikan (Puyer)
        </button>
        <button
          onClick={() => setActiveTab('narcotics')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'narcotics' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          Buku Register Narkotika / Psikotropika
        </button>
        <button
          onClick={() => setActiveTab('ai_insights')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'ai_insights' ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Brain className="h-4 w-4 text-cyan-400" />
          AI Drug Interaction & Restock Engine
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'master' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari kode obat, nama generik, atau merk dagang..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 py-2 px-3 text-sm text-slate-200 focus:border-teal-500 focus:outline-none"
              >
                <option value="All">Semua Kategori</option>
                <option value="Antibiotik">Antibiotik</option>
                <option value="Antidiabetes">Antidiabetes</option>
                <option value="Kardiologi">Kardiologi</option>
                <option value="Narkotika">Narkotika</option>
              </select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Kode & Nama Obat</th>
                    <th className="px-4 py-3">Kategori & Formula</th>
                    <th className="px-4 py-3">Stok Saat Ini</th>
                    <th className="px-4 py-3">Harga Beli / Jual</th>
                    <th className="px-4 py-3">Analisis Fast/Slow</th>
                    <th className="px-4 py-3">AI Restock Forecast</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDrugs.map((drug) => {
                    const isLow = drug.currentStock <= drug.minStock;
                    return (
                      <tr key={drug.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-100">{drug.name}</div>
                          <div className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <Barcode className="h-3 w-3 text-teal-400" /> {drug.code} • Barcode: {drug.barcode}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block rounded-md bg-slate-800 px-2 py-0.5 text-xs text-teal-300 font-medium">
                            {drug.category}
                          </span>
                          <div className="text-xs text-slate-400 mt-1">{drug.formula}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-base ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                              {drug.currentStock} {drug.unit}
                            </span>
                            {isLow && (
                              <span className="flex items-center gap-1 rounded bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                                <AlertTriangle className="h-3 w-3" /> RESTOCK NOW
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">Min. Stock: {drug.minStock} {drug.unit}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="text-slate-200">Rp {drug.sellingPrice.toLocaleString('id-ID')}</div>
                          <div className="text-xs text-slate-500">HPP: Rp {drug.unitPrice.toLocaleString('id-ID')}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              drug.fastMovingStatus === 'Fast Moving'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {drug.fastMovingStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-cyan-300 font-medium text-xs">
                            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Habis dlm ~{drug.aiRestockForecastDays} hari
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => {
                              const qty = Number(prompt('Jumlah Tambah Stok Mutation:', '100'));
                              if (qty) {
                                setDrugs(
                                  drugs.map((d) => (d.id === drug.id ? { ...d, currentStock: d.currentStock + qty } : d))
                                );
                              }
                            }}
                            className="rounded bg-slate-800 px-2.5 py-1 text-xs text-teal-300 hover:bg-teal-500 hover:text-slate-950 transition font-medium"
                          >
                            + Mutasi Stok
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab Batch FEFO */}
      {activeTab === 'batches' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Layers className="h-5 w-5 text-teal-400" /> Penelusuran Batch & FEFO (First Expired, First Out)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Sistem otomatis memprioritaskan nomor batch dengan tanggal kedaluwarsa paling dekat untuk dispensing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {batches.map((b) => (
              <div key={b.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <span className="rounded bg-teal-500/20 px-2 py-0.5 text-xs font-bold text-teal-300 border border-teal-500/30">
                    Prioritas FEFO #{b.fefoPriority}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-base">{b.drugName}</h4>
                <p className="text-xs font-mono text-cyan-400 mt-0.5">Batch: {b.batchNumber}</p>

                <div className="mt-4 space-y-2 text-xs text-slate-300 border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tanggal Expired:</span>
                    <span className="font-semibold text-rose-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {b.expiredDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Jumlah Stok Batch:</span>
                    <span className="font-bold text-slate-100">{b.quantity} unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Lokasi Rak Depo:</span>
                    <span className="text-slate-300">{b.warehouseLocation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Dispensing & e-Prescription */}
      {activeTab === 'dispense' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <PackageCheck className="h-5 w-5 text-teal-400" /> Penyerahan Obat (Dispensing & Compounding)
            </h3>
            <button
              onClick={() => {
                const newDisp: DrugDispense = {
                  id: `dsp-${Date.now()}`,
                  prescriptionId: `RX-2026-${Math.floor(100 + Math.random() * 900)}`,
                  patientName: 'Rudi Hermawan',
                  norm: 'RM-2026-005',
                  unitType: 'Outpatient',
                  dispensedItems: [{ drugName: 'Amlodipine 10mg', dosage: '1 x 1 Tab', quantity: 30, batchNumber: 'B26-0105X' }],
                  dispensedBy: 'Apt. Farida Nur, S.Farm',
                  dispenseTime: new Date().toLocaleTimeString('id-ID'),
                  status: 'Ready for Patient',
                  narcoticLedgerChecked: true
                };
                setDispenses([newDisp, ...dispenses]);
              }}
              className="rounded bg-teal-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition"
            >
              + Proses e-Prescription Baru
            </button>
          </div>

          <div className="space-y-3">
            {dispenses.map((dsp) => (
              <div key={dsp.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-base">{dsp.patientName}</span>
                      <span className="text-xs text-slate-400 font-mono">({dsp.norm})</span>
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-cyan-300">{dsp.unitType}</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      No. Resep: {dsp.prescriptionId} • Petugas: {dsp.dispensedBy} • Waktu: {dsp.dispenseTime}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {dsp.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 border-t border-slate-800 pt-3">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Item Obat Diberikan (Batch Verified):</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {dsp.dispensedItems.map((item, idx) => (
                      <div key={idx} className="rounded bg-slate-900 p-2.5 border border-slate-800 text-xs flex justify-between">
                        <div>
                          <div className="font-semibold text-slate-200">{item.drugName}</div>
                          <div className="text-slate-400 text-[11px]">Dosis: {item.dosage}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-teal-400">{item.quantity} Unit</span>
                          <div className="text-[10px] text-slate-500 font-mono">Batch: {item.batchNumber}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Compounding / Racikan */}
      {activeTab === 'compounding' && (
        <div className="space-y-4 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" /> Kalkulator Obat Racikan & Compounding Apoteker
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kalkulasi otomatis jumlah tablet/kapsul utuh yang dibutuhkan berdasarkan dosis per bungkus/kapsul dan total kemasan.
              </p>
            </div>
            <button
              onClick={() => {
                const drugName = prompt('Nama Bahan/Obat (Contoh: Salbutamol 2mg Tab):', 'Salbutamol 2mg Tab');
                const dose = Number(prompt('Dosis Per Bungkus (mg):', '1'));
                const mgPerTab = Number(prompt('Kekuatan per Tablet (mg):', '2'));
                if (drugName && dose && mgPerTab) {
                  const tabsNeeded = (dose * racikanTotalBungkus) / mgPerTab;
                  setRacikanItems([...racikanItems, { drugName, dosePerBungkusMg: dose, mgPerTab, totalTabsNeeded: tabsNeeded }]);
                }
              }}
              className="rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
            >
              + Tambah Komponen Bahan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="text-xs text-slate-300 font-semibold block">Nama Formulasi Racikan:</label>
              <input
                type="text"
                value={racikanName}
                onChange={(e) => setRacikanName(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              />

              <label className="text-xs text-slate-300 font-semibold block">Jumlah Bungkus / Kapsul (dtd):</label>
              <input
                type="number"
                value={racikanTotalBungkus}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setRacikanTotalBungkus(val);
                  setRacikanItems(racikanItems.map(it => ({
                    ...it,
                    totalTabsNeeded: (it.dosePerBungkusMg * val) / it.mgPerTab
                  })));
                }}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-xs text-slate-100 focus:border-amber-500 focus:outline-none font-bold"
              />
              <div className="text-[11px] text-amber-300/80 bg-amber-500/10 p-2 rounded border border-amber-500/20">
                💡 Mode: <strong>divide in partes aequales (dtd)</strong> - Dosis dihitung per kemasan puyer.
              </div>
            </div>

            <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Rincian Bahan Obat Utuh Yang Diambil</h4>
              <div className="space-y-2">
                {racikanItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs">
                    <div>
                      <div className="font-bold text-slate-100">{item.drugName}</div>
                      <div className="text-slate-400 text-[11px]">Dosis per bungkus: {item.dosePerBungkusMg} mg • Kekuatan Tab: {item.mgPerTab} mg</div>
                    </div>
                    <div className="text-right">
                      <div className="text-amber-400 font-extrabold text-sm">{item.totalTabsNeeded} Tab</div>
                      <div className="text-[10px] text-slate-500">
                        ({item.dosePerBungkusMg}mg x {racikanTotalBungkus} / {item.mgPerTab}mg)
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => alert(`Etiket Obat Racikan "${racikanName}" Siap Cetak (3x1 Puyer)`)}
                  className="rounded bg-teal-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 transition"
                >
                  Cetak Etiket & Label Racikan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Narkotika / Psikotropika */}
      {activeTab === 'narcotics' && (
        <div className="rounded-xl border border-rose-500/30 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-rose-300 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-rose-400" /> Buku Register Narkotika & Psikotropika Digital
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pencatatan ketat real-time penerimaan, pengeluaran, sisa stok, dan berita acara pemusnahan obat tergolong Narkotika/Psikotropika sesuai regulasi Kemenkes & BPOM.
              </p>
            </div>
            <button
              onClick={() => alert('Berita Acara Rekonsiliasi Narkotika Siap Dicetak untuk Laporan Dinkes')}
              className="rounded bg-rose-500/20 px-3 py-1.5 text-xs font-bold text-rose-300 border border-rose-500/40 hover:bg-rose-500/30 transition"
            >
              Export Laporan Dinkes / BPOM
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Tanggal & Waktu</th>
                  <th className="p-3">Nama Obat Narkotika</th>
                  <th className="p-3">Masuk / Keluar</th>
                  <th className="p-3">Pasien / Dokter Resep</th>
                  <th className="p-3">Sisa Stok Akhir</th>
                  <th className="p-3">Verifikasi Apoteker</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className="hover:bg-slate-800/40">
                  <td className="p-3 font-mono">2026-08-02 08:30</td>
                  <td className="p-3 font-semibold text-rose-300">Fentanyl Inj 0.05 mg/ml (2 ml)</td>
                  <td className="p-3 text-rose-400 font-bold">- 2 Ampul (Keluar)</td>
                  <td className="p-3">RM-2026-003 (Siti Aminah) • Dr. Anestesi</td>
                  <td className="p-3 font-bold text-slate-100">45 Ampul</td>
                  <td className="p-3 font-semibold text-teal-400">Apt. Farida (Verified)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab AI Interaction Engine */}
      {activeTab === 'ai_insights' && (
        <div className="space-y-5 bg-slate-900/60 p-5 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Brain className="h-5 w-5 text-cyan-400" /> AI Drug Interaction & Substitution Simulation Engine
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Evaluasi otomatis potensi interaksi obat, penyesuaian dosis ginjal/hati, serta rekomendasi substitusi obat generik setara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-4">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" /> Simulasi Interaksi 2 Obat (AI Checker)
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Obat Pertama:</label>
                  <input
                    type="text"
                    value={simDrug1}
                    onChange={(e) => setSimDrug1(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Obat Kedua:</label>
                  <input
                    type="text"
                    value={simDrug2}
                    onChange={(e) => setSimDrug2(e.target.value)}
                    className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={checkInteraction}
                  className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 py-2 text-xs font-bold text-slate-950 hover:brightness-110 transition shadow-lg"
                >
                  Analisis Interaksi Obat Sekarang
                </button>
              </div>

              {interactionResult && (
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/30 p-3 text-xs text-slate-200 leading-relaxed">
                  {interactionResult}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-teal-400" /> AI Forecast Restock & Procurement Recommendation
              </h4>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="rounded bg-slate-900 p-3 border border-slate-800">
                  <div className="flex justify-between font-bold text-rose-300">
                    <span>Amlodipine Besylate 10 mg</span>
                    <span>3 Hari lagi stok 0</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    AI menyarankan penerbitan PR (Purchase Request) otomatis sebanyak 2,000 tablet ke PT Sanbe Farma.
                  </p>
                </div>

                <div className="rounded bg-slate-900 p-3 border border-slate-800">
                  <div className="flex justify-between font-bold text-emerald-300">
                    <span>Ceftriaxone Inj 1 Gram</span>
                    <span>Stok Optimal (14 Hari)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tren penggunaan konsisten 25 vial/hari di ruang perawatan Inpatient.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 1: Input Master Obat Baru */}
      {showAddDrugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-teal-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white">Input Master Obat Baru</h3>
              </div>
              <button
                onClick={() => setShowAddDrugModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDrug} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Obat & Sediaan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Amoxicillin 500mg Cap"
                  value={newDrugName}
                  onChange={(e) => setNewDrugName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Kategori Obat</label>
                  <select
                    value={newDrugCategory}
                    onChange={(e) => setNewDrugCategory(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Antibiotik">Antibiotik</option>
                    <option value="Analgesik / Antiinflamasi">Analgesik / Antiinflamasi</option>
                    <option value="Kardiovaskular">Kardiovaskular</option>
                    <option value="Antidiabetes">Antidiabetes</option>
                    <option value="Antihistamin">Antihistamin</option>
                    <option value="Multivitamin">Multivitamin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Satuan Sediaan</label>
                  <select
                    value={newDrugUnit}
                    onChange={(e) => setNewDrugUnit(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Kapsul">Kapsul</option>
                    <option value="Botol / Sirup">Botol / Sirup</option>
                    <option value="Vial / Injeksi">Vial / Injeksi</option>
                    <option value="Tube / Salep">Tube / Salep</option>
                    <option value="Ampul">Ampul</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Stok Awal</label>
                  <input
                    type="number"
                    value={newDrugStock}
                    onChange={(e) => setNewDrugStock(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Batas Min Stok</label>
                  <input
                    type="number"
                    value={newDrugMinStock}
                    onChange={(e) => setNewDrugMinStock(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Harga Beli (IDR)</label>
                  <input
                    type="number"
                    value={newDrugUnitPrice}
                    onChange={(e) => setNewDrugUnitPrice(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Harga Jual (IDR)</label>
                  <input
                    type="number"
                    value={newDrugSellingPrice}
                    onChange={(e) => setNewDrugSellingPrice(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Supplier / PBF</label>
                <input
                  type="text"
                  value={newDrugSupplier}
                  onChange={(e) => setNewDrugSupplier(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDrugModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-500 px-5 py-2 font-bold text-slate-950 hover:bg-teal-400 shadow-lg"
                >
                  Simpan Master Obat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Input Batch FEFO Obat Baru */}
      {showAddBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-teal-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-teal-400" />
                <h3 className="text-lg font-bold text-white">Input Batch FEFO Obat</h3>
              </div>
              <button
                onClick={() => setShowAddBatchModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Obat</label>
                <select
                  value={batchDrugName}
                  onChange={(e) => setBatchDrugName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                >
                  {drugs.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nomor Batch (Lot Number)</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Tanggal Expired (FEFO)</label>
                  <input
                    type="date"
                    required
                    value={batchExpDate}
                    onChange={(e) => setBatchExpDate(e.target.value)}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Jumlah Masuk (Stok Batch)</label>
                  <input
                    type="number"
                    required
                    value={batchQuantity}
                    onChange={(e) => setBatchQuantity(Number(e.target.value))}
                    className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBatchModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-teal-500 px-5 py-2 font-bold text-slate-950 hover:bg-teal-400 shadow-lg"
                >
                  Simpan Batch FEFO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Input Resep / Dispensing Baru */}
      {showAddDispenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Input Resep / Dispensing Manual</h3>
              </div>
              <button
                onClick={() => setShowAddDispenseModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDispense} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={dispensePatientName}
                  onChange={(e) => setDispensePatientName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Dokter Penulis Resep</label>
                <input
                  type="text"
                  required
                  value={dispenseDoctorName}
                  onChange={(e) => setDispenseDoctorName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Nama Obat</label>
                <select
                  value={dispenseDrugName}
                  onChange={(e) => setDispenseDrugName(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                >
                  {drugs.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Dosis & Aturan Pakai</label>
                <input
                  type="text"
                  required
                  value={dispenseDosage}
                  onChange={(e) => setDispenseDosage(e.target.value)}
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 p-2.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddDispenseModal(false)}
                  className="rounded-lg bg-slate-800 px-4 py-2 text-slate-300 hover:bg-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-cyan-500 px-5 py-2 font-bold text-slate-950 hover:bg-cyan-400 shadow-lg"
                >
                  Simpan Dispensing Resep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
