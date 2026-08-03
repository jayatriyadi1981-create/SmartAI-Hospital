import React, { useState } from 'react';
import {
  FlaskConical,
  TestTube,
  Barcode,
  AlertTriangle,
  Brain,
  CheckCircle2,
  Clock,
  Activity,
  FileSpreadsheet,
  Search,
  Filter,
  RefreshCw,
  Cpu,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Download,
  Plus,
  Printer,
  Play,
  Zap,
  PhoneCall,
  X,
  FileText,
  Sliders,
  Check
} from 'lucide-react';
import { MOCK_LAB_ORDERS, MOCK_PATIENTS } from '../data/mockData';
import { LabOrder, LabCategory } from '../types';

export const LISView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'worklist' | 'analyzer' | 'qc' | 'barcode'>('worklist');
  const [orders, setOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(MOCK_LAB_ORDERS[0] || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isEditingResults, setIsEditingResults] = useState(false);
  const [editedResults, setEditedResults] = useState<any[]>([]);

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCriticalModal, setShowCriticalModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [criticalLogNotes, setCriticalLogNotes] = useState('');
  const [criticalLogged, setCriticalLogged] = useState(false);

  // New Order Form state
  const [newPatientId, setNewPatientId] = useState(MOCK_PATIENTS[0]?.id || '');
  const [newCategory, setNewCategory] = useState<LabCategory>('Clinical Chemistry');
  const [newPriority, setNewPriority] = useState<'CITO' | 'Rutin'>('Rutin');
  const [newDoctor, setNewDoctor] = useState('dr. Budi Hartono, Sp.PD-KGEH');
  const [newTubeType, setNewTubeType] = useState('EDTA (Ungu)');
  const [newTestName, setNewTestName] = useState('Glukosa Darah Puasa');

  // Analyzer Simulator Feed Logs
  const [analyzerLogs, setAnalyzerLogs] = useState<
    Array<{ id: string; time: string; machine: string; barcode: string; test: string; val: string; status: string }>
  >([
    { id: 'log-1', time: '10:42:15', machine: 'Cobas c501 Chemistry', barcode: 'LAB-992018', test: 'Glukosa Puasa', val: '185 mg/dL', status: 'ACK (200 OK)' },
    { id: 'log-2', time: '10:40:02', machine: 'Sysmex XN-1000', barcode: 'LAB-992019', test: 'Hemoglobin', val: '13.8 g/dL', status: 'ACK (200 OK)' },
    { id: 'log-3', time: '10:35:48', machine: 'BD Phoenix M50', barcode: 'LAB-992020', test: 'Kultur Darah', val: 'In Incubation (12h)', status: 'Processing' }
  ]);
  const [isSimulatingFeed, setIsSimulatingFeed] = useState(false);

  const categories: string[] = [
    'All',
    'Clinical Chemistry',
    'Hematology',
    'Immunology',
    'Serology',
    'Microbiology',
    'Parasitology',
    'Urinalysis',
    'Blood Gas',
    'PCR / Molecular',
    'Hormone'
  ];

  const filteredOrders = orders.filter((ord) => {
    const matchesCat = selectedCategory === 'All' || ord.category === selectedCategory;
    const matchesSearch =
      ord.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.specimenBarcode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const runAiLabInterpretation = async (order: LabOrder) => {
    setIsAiAnalyzing(true);
    try {
      const res = await fetch('/api/ai/lab-interpretation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: order.category,
          testResults: order.results,
          patientInfo: { name: order.patientName, norm: order.norm }
        })
      });
      const data = await res.json();
      if (data?.interpretation) {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, aiInterpretation: data.interpretation } : o))
        );
        setSelectedOrder((prev) =>
          prev && prev.id === order.id ? { ...prev, aiInterpretation: data.interpretation } : prev
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleSimulateAnalyzerFeed = () => {
    setIsSimulatingFeed(true);
    setTimeout(() => {
      const newLog = {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString(),
        machine: 'Roche Cobas c501',
        barcode: `LAB-${Math.floor(100000 + Math.random() * 900000)}`,
        test: 'Serum Creatinine & Ureum',
        val: '1.9 mg/dL (High)',
        status: 'ACK (200 OK)'
      };
      setAnalyzerLogs((prev) => [newLog, ...prev]);
      setIsSimulatingFeed(false);
    }, 1200);
  };

  const handleCreateNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = MOCK_PATIENTS.find((p) => p.id === newPatientId) || MOCK_PATIENTS[0];
    const newBarcode = `LAB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrd: LabOrder = {
      id: `lab-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      norm: patient.norm,
      orderDoctor: newDoctor,
      category: newCategory,
      specimenBarcode: newBarcode,
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Sample Collected',
      criticalAlert: newPriority === 'CITO',
      analyzerMachine: 'Cobas c501 Chemistry Analyzer',
      results: [
        { testCode: 'TEST-01', testName: newTestName, resultValue: 'Pending', unit: 'mg/dL', referenceRange: '70 - 110', flag: 'Normal' }
      ]
    };
    setOrders([newOrd, ...orders]);
    setSelectedOrder(newOrd);
    setShowOrderModal(false);
  };

  const handleSaveResultEdits = () => {
    if (!selectedOrder) return;
    const updated = { ...selectedOrder, results: editedResults, status: 'Result Verified' as const };
    setOrders((prev) => prev.map((o) => (o.id === selectedOrder.id ? updated : o)));
    setSelectedOrder(updated);
    setIsEditingResults(false);
  };

  const handleRilisEMR = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'Validated' as const } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'Validated' });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Validated':
      case 'Result Verified':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Analyzer Testing':
      case 'In Laboratory':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Sample Collected':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default:
        return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
              <FlaskConical className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Laboratorium Sentral (LIS)
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Sistem Informasi Laboratorium Sentral: Manajemen sampel, Auto-Analyzer HL7/ASTM, Quality Control (QC), & AI Interpretasi Hasil.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-lg text-xs font-semibold">
            <Cpu className="w-4 h-4" />
            HL7 Auto-LIS Connected
          </div>
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition text-sm font-semibold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            + Sample Order Baru
          </button>
        </div>
      </div>

      {/* QC & Critical Quick Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">QC Kimia Klinik</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Roche Cobas c501</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-xs rounded font-medium">Passed</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">QC Hematologi</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Sysmex XN-1000</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-xs rounded font-medium">Passed</span>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-8 h-8 text-amber-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">QC Mikrobiologi</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">BD Phoenix M50</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-amber-500/10 text-amber-600 text-xs rounded font-medium">Calibrating</span>
        </div>
        <div
          onClick={() => setShowCriticalModal(true)}
          className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-900/50 flex items-center justify-between cursor-pointer hover:bg-rose-50/50 transition"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Critical Values</p>
              <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">1 Nilai Kritis Diminta</p>
            </div>
          </div>
          <span className="px-2 py-1 bg-rose-500 text-white text-xs rounded font-semibold animate-pulse">Lapor DPJP</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('worklist')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'worklist'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Worklist & Hasil Lab ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('analyzer')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'analyzer'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Automated Analyzer Feed (HL7/ASTM)
        </button>

        <button
          onClick={() => setActiveTab('qc')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'qc'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          QC Quality Control & Kalibrasi
        </button>

        <button
          onClick={() => setActiveTab('barcode')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'barcode'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Barcode className="w-4 h-4" />
          Pencetakan Barcode & Label Spesimen
        </button>
      </div>

      {/* TAB 1: WORKLIST & HASIL */}
      {activeTab === 'worklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Worklist Filters (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari pasien / No RM / Barcode..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Horizontal Category Selector */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Worklist List */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                <span>WORKLIST LABORATORIUM ({filteredOrders.length})</span>
                <span>STATUS</span>
              </div>
              {filteredOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">Tidak ada sampel laboratorium ditemukan.</div>
              ) : (
                filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    onClick={() => {
                      setSelectedOrder(ord);
                      setIsEditingResults(false);
                      setEditedResults(ord.results ? JSON.parse(JSON.stringify(ord.results)) : []);
                    }}
                    className={`p-4 cursor-pointer transition flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                      selectedOrder?.id === ord.id ? 'bg-teal-50/50 dark:bg-teal-950/20 border-l-4 border-teal-500' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">{ord.patientName}</span>
                        <span className="text-xs text-slate-400">({ord.norm})</span>
                        {ord.criticalAlert && (
                          <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[10px] font-bold rounded animate-pulse">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Barcode className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ord.specimenBarcode}</span>
                        <span>•</span>
                        <span className="font-medium text-teal-600 dark:text-teal-400">{ord.category}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{ord.orderDate}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs border font-medium inline-block ${getStatusBadge(ord.status)}`}>
                        {ord.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Selected Order Detail & AI Interpretation (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {selectedOrder ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
                {/* Order Header & Barcode */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedOrder.patientName}</h2>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
                        {selectedOrder.norm}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusBadge(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Dokter Pengirim: <span className="font-semibold">{selectedOrder.orderDoctor}</span> | Analyzer: <span className="font-semibold">{selectedOrder.analyzerMachine}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowBarcodeModal(true)}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <Barcode className="w-4 h-4" />
                      Cetak Barcode
                    </button>
                  </div>
                </div>

                {/* Lab Test Results Table */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-teal-600" />
                      Hasil Parameter Laboratorium
                    </h3>

                    {!isEditingResults ? (
                      <button
                        onClick={() => {
                          setIsEditingResults(true);
                          setEditedResults(JSON.parse(JSON.stringify(selectedOrder.results)));
                        }}
                        className="px-3 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-600 border border-teal-200 dark:border-teal-800 text-xs font-semibold rounded-lg hover:bg-teal-100 transition"
                      >
                        Edit / Entry Manual
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsEditingResults(false)}
                          className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSaveResultEdits}
                          className="px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-lg flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Simpan Hasil
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                        <tr>
                          <th className="p-3">Nama Tes</th>
                          <th className="p-3">Hasil</th>
                          <th className="p-3">Satuan</th>
                          <th className="p-3">Nilai Rujukan</th>
                          <th className="p-3">Flag Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                        {(!isEditingResults ? selectedOrder.results : editedResults).map((res, idx) => (
                          <tr key={idx} className={res.flag === 'Critical' ? 'bg-rose-50/50 dark:bg-rose-950/20' : ''}>
                            <td className="p-3">
                              <span className="font-semibold text-slate-900 dark:text-white">{res.testName}</span>
                              <span className="block text-[11px] text-slate-400">{res.testCode}</span>
                            </td>
                            <td className="p-3">
                              {isEditingResults ? (
                                <input
                                  type="text"
                                  value={res.resultValue}
                                  onChange={(e) => {
                                    const next = [...editedResults];
                                    next[idx].resultValue = e.target.value;
                                    setEditedResults(next);
                                  }}
                                  className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border rounded text-xs font-bold text-slate-900 dark:text-white"
                                />
                              ) : (
                                <span
                                  className={`font-bold ${
                                    res.flag === 'Critical'
                                      ? 'text-rose-600'
                                      : res.flag === 'High'
                                      ? 'text-amber-600'
                                      : res.flag === 'Low'
                                      ? 'text-blue-600'
                                      : 'text-slate-900 dark:text-white'
                                  }`}
                                >
                                  {res.resultValue}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-xs text-slate-500">{res.unit}</td>
                            <td className="p-3 text-xs text-slate-500">{res.referenceRange}</td>
                            <td className="p-3">
                              {isEditingResults ? (
                                <select
                                  value={res.flag}
                                  onChange={(e) => {
                                    const next = [...editedResults];
                                    next[idx].flag = e.target.value;
                                    setEditedResults(next);
                                  }}
                                  className="px-2 py-1 bg-white dark:bg-slate-800 border rounded text-xs font-semibold"
                                >
                                  <option value="Normal">Normal</option>
                                  <option value="High">High</option>
                                  <option value="Low">Low</option>
                                  <option value="Critical">Critical</option>
                                </select>
                              ) : (
                                <>
                                  {res.flag === 'Critical' && (
                                    <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[10px] font-bold">
                                      KRITIS
                                    </span>
                                  )}
                                  {res.flag === 'High' && (
                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded text-[10px] font-bold">
                                      TINGGI ↑
                                    </span>
                                  )}
                                  {res.flag === 'Low' && (
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 rounded text-[10px] font-bold">
                                      RENDAH ↓
                                    </span>
                                  )}
                                  {res.flag === 'Normal' && (
                                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded text-[10px] font-medium">
                                      Normal
                                    </span>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* AI Laboratory Interpretation Module */}
                <div className="p-5 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-slate-50 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/50 rounded-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-indigo-600 text-white rounded-xl shadow-sm">
                        <Brain className="w-5 h-5" />
                      </span>
                      <div>
                        <h4 className="font-bold text-indigo-950 dark:text-indigo-200 text-base">
                          AI Laboratory Diagnostic & Interpretation Engine
                        </h4>
                        <p className="text-xs text-indigo-600 dark:text-indigo-400">
                          Model Gemini 3.6 - Analisis abnormalitas, delta check & korelasi klinis otomatis.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => runAiLabInterpretation(selectedOrder)}
                      disabled={isAiAnalyzing}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isAiAnalyzing ? 'animate-spin' : ''}`} />
                      {isAiAnalyzing ? 'Memproses AI...' : 'Jalankan AI Interpretasi'}
                    </button>
                  </div>

                  {selectedOrder.aiInterpretation ? (
                    <div className="space-y-3 bg-white/80 dark:bg-slate-900/80 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                            Ringkasan Abnormalitas
                          </span>
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-1">
                            {selectedOrder.aiInterpretation.abnormalSummary}
                          </p>
                        </div>
                        <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-lg">
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                            Prediksi Risiko Penyakit
                          </span>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                            {selectedOrder.aiInterpretation.diseaseRiskScore}
                          </p>
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
                          Korelasi Klinis
                        </span>
                        <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                          {selectedOrder.aiInterpretation.clinicalCorrelation}
                        </p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-2 text-xs text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold">Rekomendasi Tindak Lanjut: </span>
                          <span>{selectedOrder.aiInterpretation.recommendedFollowUp}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-indigo-200 dark:border-indigo-800 rounded-xl">
                      Klik button "Jalankan AI Interpretasi" untuk menganalisis hasil lab ini secara otomatis dengan AI.
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Lembar Hasil Lab (PDF)
                  </button>
                  <button
                    onClick={() => handleRilisEMR(selectedOrder.id)}
                    disabled={selectedOrder.status === 'Validated'}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition ${
                      selectedOrder.status === 'Validated'
                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {selectedOrder.status === 'Validated' ? 'Sudah Dirilis ke EMR' : 'Verifikasi Hasil & Rilis ke EMR Pasien'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
                Pilih order laboratorium dari list di sebelah kiri untuk melihat rincian hasil & interpretasi AI.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AUTOMATED ANALYZER FEED (HL7/ASTM) */}
      {activeTab === 'analyzer' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-teal-600" />
                Live Automated Analyzer Simulator (HL7 v2.5 / ASTM Interface)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemantauan data mentah (raw feed stream) dari instrumen laboratorium otomatis Roche Cobas, Sysmex, BD Phoenix.
              </p>
            </div>
            <button
              onClick={handleSimulateAnalyzerFeed}
              disabled={isSimulatingFeed}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow transition"
            >
              <Zap className={`w-4 h-4 ${isSimulatingFeed ? 'animate-bounce' : ''}`} />
              Simulasikan Transmisi Data HL7
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Roche Cobas c501</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded">ONLINE</span>
              </div>
              <p className="text-xs text-slate-500">Protokol: HL7 v2.5 MSH/OBR/OBX</p>
              <p className="text-[11px] text-teal-600 font-mono font-bold">Throughput: 600 tests/hour</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Sysmex XN-1000</span>
                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded">ONLINE</span>
              </div>
              <p className="text-xs text-slate-500">Protokol: ASTM E1381 / E1394</p>
              <p className="text-[11px] text-teal-600 font-mono font-bold">Throughput: 100 samples/hour</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900 dark:text-white">BD Phoenix M50</span>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded">CALIBRATING</span>
              </div>
              <p className="text-xs text-slate-500">Protokol: HL7 v2.5 Micro</p>
              <p className="text-[11px] text-amber-600 font-mono font-bold">Incubation Cycle Running</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Log Receiver Interfacing HL7 (Real-time Stream)</h4>
            <div className="bg-slate-950 text-slate-200 rounded-xl p-4 font-mono text-xs space-y-2 max-h-60 overflow-y-auto">
              {analyzerLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                  <div className="space-x-2">
                    <span className="text-slate-500">[{log.time}]</span>
                    <span className="text-teal-400 font-bold">[{log.machine}]</span>
                    <span className="text-amber-300">Barcode: {log.barcode}</span>
                    <span className="text-white">• {log.test}: {log.val}</span>
                  </div>
                  <span className="text-emerald-400 font-bold">{log.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: QC QUALITY CONTROL & KALIBRASI */}
      {activeTab === 'qc' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Quality Control (QC) & Westgard Rules Compliance
              </h3>
              <p className="text-xs text-slate-500">
                Grafik Levey-Jennings & Kontrol Presisi Akurasi Hasil Reagen Laboratorium.
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-500/20">
              Semua Mesin Lolos QC Level 1 & Level 2
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Levey-Jennings Graphic Simulator */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Grafik Levey-Jennings: Glukosa Kontrol Level 1 (Cobas c501)
              </h4>
              <div className="h-40 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex flex-col justify-between text-[10px] font-mono">
                <div className="flex justify-between text-rose-500 border-b border-dashed border-rose-300 pb-1">
                  <span>+3 SD (108 mg/dL)</span>
                  <span>Upper Limit</span>
                </div>
                <div className="flex justify-between text-amber-500 border-b border-dashed border-amber-300 pb-1">
                  <span>+2 SD (104 mg/dL)</span>
                  <span>Warning</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold border-b border-emerald-400 pb-1">
                  <span>Mean (100 mg/dL)</span>
                  <span>Target Center</span>
                </div>
                <div className="flex justify-between text-amber-500 border-b border-dashed border-amber-300 pb-1">
                  <span>-2 SD (96 mg/dL)</span>
                  <span>Warning</span>
                </div>
                <div className="flex justify-between text-rose-500 border-b border-dashed border-rose-300 pb-1">
                  <span>-3 SD (92 mg/dL)</span>
                  <span>Lower Limit</span>
                </div>
              </div>
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Westgard Rule 1-2s Passed: Tidak ada deviasi di atas 2SD.
              </p>
            </div>

            {/* Calibration Logs */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Log Kalibrasi Reagen Terakhir
              </h4>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">C-Reactive Protein (CRP) Kit</span>
                    <span className="block text-[10px] text-slate-400">Lot: #CRP-2026-09A • Reagen Roche</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded">02 Aug 2026</span>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Troponin I High Sensitivity</span>
                    <span className="block text-[10px] text-slate-400">Lot: #TNI-8812B • Reagen Abbott</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded">01 Aug 2026</span>
                </div>

                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">HbA1c Enzymatic Assay</span>
                    <span className="block text-[10px] text-slate-400">Lot: #HBA-0012 • Reagen Bio-Rad</span>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 text-[10px] font-bold rounded">Due In 2 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: BARCODE & LABEL SPESIMEN */}
      {activeTab === 'barcode' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Barcode className="w-5 h-5 text-teal-600" />
              Pencetakan Barcode & Panduan Tabung Spesimen
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standar pelabelan spesimen sesuai jenis tabung sampel darah dan urinalisis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-purple-900 dark:text-purple-300">EDTA (Tutup Ungu)</span>
                <span className="w-4 h-4 rounded-full bg-purple-600 inline-block"></span>
              </div>
              <p className="text-xs text-purple-800 dark:text-purple-200">Untuk pemeriksaan Hematologi Rutin, HbA1c, Golongan Darah, LED.</p>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 dark:bg-rose-950/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-rose-900 dark:text-rose-300">Serum Clot Activator (Merah)</span>
                <span className="w-4 h-4 rounded-full bg-rose-600 inline-block"></span>
              </div>
              <p className="text-xs text-rose-800 dark:text-rose-200">Untuk Kimia Klinik, Serologi, Imunologi, Hormon, & Elektrolit.</p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-amber-900 dark:text-amber-300">Fluoride (Tutup Abu-abu)</span>
                <span className="w-4 h-4 rounded-full bg-amber-500 inline-block"></span>
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-200">Khusus Glukosa Darah Puasa & Glukosa 2 Jam PP (Menghambat glikolisis).</p>
            </div>

            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/50 dark:bg-sky-950/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-sky-900 dark:text-sky-300">Sodium Sitrat (Biru Muda)</span>
                <span className="w-4 h-4 rounded-full bg-sky-500 inline-block"></span>
              </div>
              <p className="text-xs text-sky-800 dark:text-sky-200">Pemeriksaan Koagulasi Darah (PT, APTT, Fibrinogen, D-Dimer).</p>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2 max-w-md">
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Cetak Label Thermal Barcode 1D / QR Code</h4>
              <p className="text-xs text-slate-500">
                Hubungkan ke Printer Thermal Zebra/Sato via Bluetooth/USB untuk mencetak sticker label spesimen secara langsung.
              </p>
            </div>
            <button
              onClick={() => setShowBarcodeModal(true)}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4" />
              Buka Preview Printer Thermal Label
            </button>
          </div>
        </div>
      )}

      {/* MODAL 1: CREATE NEW SAMPLE ORDER */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TestTube className="w-5 h-5 text-teal-600" />
                + Order Sampel Laboratorium Baru
              </h3>
              <button onClick={() => setShowOrderModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateNewOrder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Pilih Pasien</label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Kategori Pemeriksaan</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as LabCategory)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Clinical Chemistry">Clinical Chemistry</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Immunology">Immunology</option>
                    <option value="Microbiology">Microbiology</option>
                    <option value="Blood Gas">Blood Gas</option>
                    <option value="Urinalysis">Urinalysis</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Prioritas Pemeriksaan</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Rutin">Rutin Standard</option>
                    <option value="CITO">CITO (Emergency Darurat)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Tes Utama</label>
                <input
                  type="text"
                  value={newTestName}
                  onChange={(e) => setNewTestName(e.target.value)}
                  placeholder="Misal: Darah Lengkap, HbA1c, Profile Lipid"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Jenis Tabung Spesimen</label>
                  <select
                    value={newTubeType}
                    onChange={(e) => setNewTubeType(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="EDTA (Ungu)">EDTA (Ungu)</option>
                    <option value="Serum Clot (Merah)">Serum Clot (Merah)</option>
                    <option value="Fluoride (Abu-abu)">Fluoride (Abu-abu)</option>
                    <option value="Sodium Sitrat (Biru)">Sodium Sitrat (Biru)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Dokter DPJP Pengirim</label>
                  <input
                    type="text"
                    value={newDoctor}
                    onChange={(e) => setNewDoctor(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Buat Order & Generate Barcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CRITICAL VALUE NOTIFICATION LOG */}
      {showCriticalModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-rose-300 dark:border-rose-900 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                Lapor Nilai Kritis Laboratorium (Critical Alert)
              </h3>
              <button onClick={() => setShowCriticalModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200 text-xs space-y-1">
              <p className="font-bold text-rose-900 dark:text-rose-200">Pasien: Ahmad Dahlan (RM-2026-001)</p>
              <p className="text-rose-800 dark:text-rose-300">
                Nilai Kritis: <span className="font-bold">Serum Creatinine 2.1 mg/dL (Critical)</span>
              </p>
              <p className="text-slate-500">Standar Keselamatan Pasien: Wajib dilaporkan ke DPJP dalam &lt; 15 menit.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Catatan Konfirmasi Telepon DPJP</label>
                <textarea
                  rows={3}
                  value={criticalLogNotes}
                  onChange={(e) => setCriticalLogNotes(e.target.value)}
                  placeholder="Misal: Sudah ditelpon ke dr. Budi Hartono Sp.PD jam 10:45. Diterima oleh Ns. Dewi. Instruksi: Cek ulang urin 24 jam & IVFD RL."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              {criticalLogged && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Notifikasi Nilai Kritis Berhasil Dicatat ke Log Audit Keselamatan Pasien!
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCriticalModal(false)}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-600"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setCriticalLogged(true);
                  setTimeout(() => setShowCriticalModal(false), 1500);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" />
                Simpan Bukti Pelaporan Telepon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BARCODE PREVIEW */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4 text-center">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Label Barcode Spesimen</h3>
              <button onClick={() => setShowBarcodeModal(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-4 bg-white border-2 border-slate-800 rounded-xl space-y-2 text-slate-900">
              <p className="font-extrabold text-sm">{selectedOrder?.patientName || 'Ahmad Dahlan'}</p>
              <p className="text-xs font-semibold">{selectedOrder?.norm || 'RM-2026-001'} | Laki-laki</p>
              <div className="my-3 py-2 border-y border-slate-300 flex flex-col items-center justify-center">
                <Barcode className="w-36 h-12 text-slate-900" />
                <span className="font-mono text-xs font-extrabold tracking-widest mt-1">
                  {selectedOrder?.specimenBarcode || 'LAB-992018'}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-600">
                {selectedOrder?.category || 'Clinical Chemistry'} • Tabung EDTA (Ungu)
              </p>
            </div>

            <button
              onClick={() => {
                alert('Mencetak label ke printer thermal Zebra ZD420...');
                setShowBarcodeModal(false);
              }}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Cetak Sticker Thermal Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

