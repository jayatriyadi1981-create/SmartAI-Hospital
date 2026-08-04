import React, { useState } from 'react';
import {
  Film,
  ZoomIn,
  ZoomOut,
  Move,
  Sliders,
  Ruler,
  Maximize2,
  Sparkles,
  Layers,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Download,
  Share2,
  Eye,
  FileText,
  Search,
  Scan,
  Activity,
  ChevronRight,
  Plus,
  Printer,
  Upload,
  Box,
  Sun,
  ShieldCheck,
  X,
  FileUp,
  Check
} from 'lucide-react';
import { MOCK_RADIOLOGY_ORDERS, MOCK_PATIENTS } from '../data/mockData';
import { RadiologyOrder, RadiologyModality } from '../types';
import { useHospitalData } from '../context/HospitalDataContext';

export const RISPACSView: React.FC = () => {
  const { addRadiologyOrder, addNotification, addActivityLog } = useHospitalData();
  const [orders, setOrders] = useState<RadiologyOrder[]>(MOCK_RADIOLOGY_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<RadiologyOrder | null>(MOCK_RADIOLOGY_ORDERS[0] || null);
  const [activeTab, setActiveTab] = useState<'PACS' | 'RIS' | 'Report' | 'Import'>('PACS');
  const [selectedModality, setSelectedModality] = useState<string>('All');

  // Interactive Viewer State
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [currentSlice, setCurrentSlice] = useState<number>(12);
  const [totalSlices] = useState<number>(32);
  const [showAiOverlay, setShowAiOverlay] = useState<boolean>(true);
  const [measurementMode, setMeasurementMode] = useState<boolean>(false);
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [is3DRender, setIs3DRender] = useState<boolean>(false);
  const [presetWl, setPresetWl] = useState<'Normal' | 'Bone' | 'SoftTissue' | 'Lung' | 'Brain'>('Normal');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);

  // Expertise Report Form State
  const [reportIndication, setReportIndication] = useState('Nyeri dada sebelah kiri tembus ke belakang, batuk berdahak 2 minggu.');
  const [reportTechnique] = useState('Pemeriksaan Thorax AP/PA posisi berdiri dengan inspirasi cukup.');
  const [reportFindings, setReportFindings] = useState('Cor: Ukuran dan bentuk normal, CTR < 50%. Pulmo: Corakan bronkovaskular meningkat, tampak infiltrat halus di segmen apikal lobus superior pulmo dextra.');
  const [reportImpression, setReportImpression] = useState('Gambar Radiologi Thorax menyokong gambaran Tuberculosis Pulmonum Duplex Aktif.');
  const [reportRecommendation, setReportRecommendation] = useState('Saran: Cek Dahak Sputum BTA / GeneXpert & Evaluasi Radiologi 2 bulan pasca OAT.');
  const [isReportSigned, setIsReportSigned] = useState(false);

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);

  // New Order State
  const [newPatientId, setNewPatientId] = useState(MOCK_PATIENTS[0]?.id || '');
  const [newModality, setNewModality] = useState<RadiologyModality>('CT Scan');
  const [newExamName, setNewExamName] = useState('CT Scan Thorax Kontras');
  const [newDoctor, setNewDoctor] = useState('dr. Syaiful, Sp.P');
  const [newPriority, setNewPriority] = useState<'CITO' | 'Rutin'>('CITO');
  const [newContrast, setNewContrast] = useState('Ya (Iopamiro 300mg)');

  const modalities: string[] = ['All', 'X-Ray', 'CT Scan', 'MRI', 'USG', 'Mammography', 'DEXA'];

  const filteredOrders = orders.filter((o) => {
    return selectedModality === 'All' || o.modality === selectedModality;
  });

  const handleApplyPreset = (preset: 'Normal' | 'Bone' | 'SoftTissue' | 'Lung' | 'Brain') => {
    setPresetWl(preset);
    switch (preset) {
      case 'Bone':
        setContrast(140);
        setBrightness(120);
        break;
      case 'SoftTissue':
        setContrast(110);
        setBrightness(95);
        break;
      case 'Lung':
        setContrast(130);
        setBrightness(80);
        break;
      case 'Brain':
        setContrast(125);
        setBrightness(105);
        break;
      default:
        setContrast(100);
        setBrightness(100);
        break;
    }
  };

  const runAiRadiologyAnalysis = async (order: RadiologyOrder) => {
    setIsAiProcessing(true);
    try {
      const res = await fetch('/api/ai/radiology-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modality: order.modality,
          examinationName: order.examinationName,
          patientNotes: order.radiologyReport
        })
      });
      const data = await res.json();
      if (data?.analysis) {
        setOrders((prev) =>
          prev.map((o) => (o.id === order.id ? { ...o, aiAnalysis: data.analysis } : o))
        );
        setSelectedOrder((prev) => (prev && prev.id === order.id ? { ...prev, aiAnalysis: data.analysis } : prev));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = MOCK_PATIENTS.find((p) => p.id === newPatientId) || MOCK_PATIENTS[0];
    const newOrd: RadiologyOrder = {
      id: `rad-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.fullName,
      norm: patient.norm,
      modality: newModality,
      examinationName: newExamName,
      orderDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      orderDoctor: newDoctor,
      radiologistName: 'dr. Hendra Sp.Rad',
      technicianName: 'Rad. Supriadi, Amd.Rad',
      status: 'Scheduled',
      dicomStudyId: `1.2.840.113619.2.${Math.floor(100000 + Math.random() * 900000)}`,
      radiologyReport: 'Pemeriksaan dalam antrian PACS.'
    };
    setOrders([newOrd, ...orders]);
    setSelectedOrder(newOrd);
    addRadiologyOrder(newOrd);
    addNotification({
      title: 'Order Radiologi Baru (PACS)',
      message: `${newOrd.modality} (${newOrd.examinationName}) untuk ${newOrd.patientName} berhasil terdaftar.`,
      category: 'Laboratorium',
      type: 'normal'
    });
    addActivityLog(`Penerbitan Order PACS Radiologi ${newOrd.modality} (${newOrd.patientName})`, 'Radiologi & PACS DICOM');
    setShowOrderModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Film className="w-6 h-6" />
            </span>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Radiologi & PACS DICOM Center
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Radiology Information System (RIS), 3D DICOM Viewer, Visual Heatmap CADx AI, & Penulisan Ekspertise Radiolog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition text-xs font-bold shadow-sm"
          >
            <Plus className="w-4 h-4" />
            + Order Radiologi Baru
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('PACS')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'PACS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Scan className="w-4 h-4" />
          PACS DICOM 3D Viewer
        </button>

        <button
          onClick={() => setActiveTab('RIS')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'RIS'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          RIS Worklist ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('Report')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'Report'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Brain className="w-4 h-4" />
          Penulisan Ekspertise Radiolog
        </button>

        <button
          onClick={() => setActiveTab('Import')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'Import'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          Import DICOM Study
        </button>
      </div>

      {/* Modality Selector Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {modalities.map((mod) => (
          <button
            key={mod}
            onClick={() => setSelectedModality(mod)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition ${
              selectedModality === mod
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
            }`}
          >
            {mod}
          </button>
        ))}
      </div>

      {/* TAB 1: PACS DICOM 3D VIEWER */}
      {activeTab === 'PACS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Study List Pane (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">PACS DICOM Archive ({filteredOrders.length})</h3>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">
                DICOM 3.0 Connected
              </span>
            </div>

            <div className="space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    selectedOrder?.id === ord.id
                      ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 font-bold rounded text-[10px]">
                        {ord.modality}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{ord.patientName}</h4>
                      <p className="text-xs text-slate-500">{ord.norm} • {ord.examinationName}</p>
                    </div>
                    {ord.aiAnalysis && (
                      <span className="p-1 rounded bg-indigo-600 text-white" title="AI Overlay Ready">
                        <Brain className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Dokter: {ord.radiologistName}</span>
                    <span className="font-semibold text-slate-600 dark:text-slate-300">{ord.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Canvas / PACS Viewer Pane (8 cols) */}
          <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 text-white shadow-xl flex flex-col justify-between min-h-[650px]">
            {/* DICOM Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoomLevel((z) => Math.min(z + 20, 250))}
                  className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel((z) => Math.max(z - 20, 50))}
                  className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setZoomLevel(100);
                    setBrightness(100);
                    setContrast(100);
                    setIsInverted(false);
                    setPresetWl('Normal');
                  }}
                  className="p-2 rounded hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium"
                >
                  Reset
                </button>
                <div className="h-4 w-px bg-slate-800 mx-1" />
                <button
                  onClick={() => setMeasurementMode(!measurementMode)}
                  className={`p-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                    measurementMode ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Ruler className="w-4 h-4" />
                  Caliper
                </button>

                <button
                  onClick={() => setIsInverted(!isInverted)}
                  className={`p-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                    isInverted ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  Invert Color
                </button>

                <button
                  onClick={() => setIs3DRender(!is3DRender)}
                  className={`p-2 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
                    is3DRender ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <Box className="w-4 h-4" />
                  3D Volume
                </button>
              </div>

              {/* W/L Presets */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-bold">W/L Preset:</span>
                {(['Normal', 'Bone', 'SoftTissue', 'Lung', 'Brain'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => handleApplyPreset(p)}
                    className={`px-2 py-1 rounded text-[10px] font-bold ${
                      presetWl === p ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAiOverlay(!showAiOverlay)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    showAiOverlay ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Brain className="w-4 h-4" />
                  AI CADx Heatmap {showAiOverlay ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Slice Slider Carousel */}
            <div className="flex items-center gap-3 bg-slate-900/60 p-2 rounded-lg border border-slate-800">
              <span className="text-xs font-mono text-indigo-300">Slice: {currentSlice} / {totalSlices}</span>
              <input
                type="range"
                min="1"
                max={totalSlices}
                value={currentSlice}
                onChange={(e) => setCurrentSlice(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Main DICOM Image Display Viewport */}
            <div className="relative flex-1 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-900 group min-h-[380px]">
              {/* DICOM Metadata Overlay Corners */}
              <div className="absolute top-3 left-3 text-xs font-mono text-emerald-400 space-y-0.5 pointer-events-none z-10 bg-black/60 p-2 rounded">
                <p className="font-bold">{selectedOrder?.patientName || 'PATIENT NAME'}</p>
                <p>{selectedOrder?.norm || 'RM-XXXX'}</p>
                <p>Modality: {selectedOrder?.modality || 'CT Scan'}</p>
              </div>

              <div className="absolute top-3 right-3 text-xs font-mono text-indigo-300 text-right space-y-0.5 pointer-events-none z-10 bg-black/60 p-2 rounded">
                <p>Study UID: {selectedOrder?.dicomStudyId || '1.2.840.113619'}</p>
                <p>Zoom: {zoomLevel}% | Slice {currentSlice}</p>
                <p>W: {contrast * 2} L: {brightness * 2}</p>
              </div>

              {/* Simulated DICOM Medical Image Canvas */}
              <div
                className="transition-all duration-150 relative"
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) ${isInverted ? 'invert(100%)' : ''}`
                }}
              >
                <img
                  src={
                    selectedOrder?.modality === 'CT Scan'
                      ? 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
                      : 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800'
                  }
                  alt="DICOM Scan"
                  className="max-h-[350px] object-contain rounded border border-slate-800"
                />

                {/* AI CADx Visual Heatmap Overlay */}
                {showAiOverlay && selectedOrder?.aiAnalysis && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <div className="absolute top-[35%] left-[45%] w-24 h-24 rounded-full bg-rose-500/40 blur-xl animate-pulse border-2 border-rose-500/80 flex items-center justify-center">
                        <span className="text-[10px] font-bold bg-rose-600 text-white px-1.5 py-0.5 rounded shadow">
                          Lesion ({selectedOrder.aiAnalysis.probabilityScore}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Measurement Line Simulation */}
              {measurementMode && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-indigo-900/80 border border-indigo-400 text-indigo-200 px-3 py-1 rounded text-xs font-mono">
                  Pengukuran Lesi: 24.5 mm (+420 HU Hounsfield Units)
                </div>
              )}
            </div>

            {/* AI Finding & Radiologist Report Bar */}
            <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-400" />
                  <h4 className="font-bold text-sm text-indigo-200">Hasil Temuan AI CADx Scanner</h4>
                </div>
                <button
                  onClick={() => selectedOrder && runAiRadiologyAnalysis(selectedOrder)}
                  disabled={isAiProcessing}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiProcessing ? 'animate-spin' : ''}`} />
                  {isAiProcessing ? 'Memproses AI...' : 'Jalankan AI CADx Scanner'}
                </button>
              </div>

              {selectedOrder?.aiAnalysis ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 font-bold block">Kondisi Terdeteksi:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedOrder.aiAnalysis.detectedConditions.map((cond, i) => (
                        <span key={i} className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded font-semibold">
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Akurasi & Keparahan:</span>
                    <p className="text-emerald-400 font-bold text-sm mt-0.5">
                      {selectedOrder.aiAnalysis.probabilityScore}% Probabilitas ({selectedOrder.aiAnalysis.severityScore})
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block">Ringkasan Temuan:</span>
                    <p className="text-slate-300 mt-0.5 line-clamp-2">
                      {selectedOrder.aiAnalysis.findingSummary}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Belum ada overlay AI CADx. Klik button "Jalankan AI CADx Scanner".</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RIS WORKLIST & JADWAL */}
      {activeTab === 'RIS' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Worklist Radiologi (RIS Examination Queue)
              </h3>
              <p className="text-xs text-slate-500">
                Antrian pemeriksaan radiologi berdasarkan modalitas & status ekspertise.
              </p>
            </div>
            <button
              onClick={() => setShowOrderModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              + Order Radiologi Baru
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Nama Pasien / RM</th>
                  <th className="p-3">Modalitas & Pemeriksaan</th>
                  <th className="p-3">Dokter Pengirim</th>
                  <th className="p-3">Dokter Radiolog</th>
                  <th className="p-3">Waktu Order</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3">
                      <span className="font-bold text-slate-900 dark:text-white block">{ord.patientName}</span>
                      <span className="text-xs text-slate-400">{ord.norm}</span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 text-xs font-bold rounded">
                        {ord.modality}
                      </span>
                      <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                        {ord.examinationName}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-slate-600 dark:text-slate-400">{ord.orderDoctor}</td>
                    <td className="p-3 text-xs text-slate-600 dark:text-slate-400">{ord.radiologistName}</td>
                    <td className="p-3 text-xs text-slate-500">{ord.orderDate}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold">
                        {ord.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActiveTab('PACS');
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow"
                      >
                        <Scan className="w-3.5 h-3.5" />
                        Buka PACS
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PENULISAN EKSPERTISE RADIOLOG */}
      {activeTab === 'Report' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                Penulisan Ekspertise Radiolog (Report Writer Template)
              </h3>
              <p className="text-xs text-slate-500">
                Laporan resmi ekspertise radiologi terstruktur dengan dukungan AI Auto-Drafting & Tanda Tangan Digital.
              </p>
            </div>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-lg text-xs font-bold border border-indigo-500/20">
              Pasien Active: {selectedOrder?.patientName || 'Ahmad Dahlan'} ({selectedOrder?.examinationName})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Indikasi Klinis Pasien</label>
                <textarea
                  rows={2}
                  value={reportIndication}
                  onChange={(e) => setReportIndication(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Teknik Pemeriksaan</label>
                <input
                  type="text"
                  value={reportTechnique}
                  disabled
                  className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border rounded-xl text-xs text-slate-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Temuan Radiologis (Findings)</label>
                <textarea
                  rows={4}
                  value={reportFindings}
                  onChange={(e) => setReportFindings(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Kesan Radiologi (Impression)</label>
                <textarea
                  rows={3}
                  value={reportImpression}
                  onChange={(e) => setReportImpression(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Rekomendasi / Saran</label>
                <textarea
                  rows={2}
                  value={reportRecommendation}
                  onChange={(e) => setReportRecommendation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">Tanda Tangan Digital Radiolog</span>
                  {isReportSigned && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      TERVERIFIKASI
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">dr. Hendra Sp.Rad (SIP: 449/SIP-RAD/2026)</p>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setIsReportSigned(true)}
                    disabled={isReportSigned}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
                  >
                    {isReportSigned ? 'Sudah Ditandatangani' : 'Sahkan & Tanda Tangan Digital'}
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    Cetak Laporan Ekspertise (PDF)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IMPORT DICOM STUDY */}
      {activeTab === 'Import' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              Upload & Import File DICOM (.dcm / .zip)
            </h3>
            <p className="text-xs text-slate-500">
              Unggah file citra medis DICOM langsung dari USB / CD Patient untuk dimasukkan ke PACS Archive RS.
            </p>
          </div>

          <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 dark:bg-indigo-950/10 rounded-2xl p-12 text-center space-y-4">
            <FileUp className="w-12 h-12 text-indigo-600 mx-auto animate-bounce" />
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base">Drag & Drop File DICOM atau Folder Study di sini</h4>
              <p className="text-xs text-slate-500 mt-1">Mendukung format Standard DICOM 3.0 (.dcm, .dicom, file zip archive)</p>
            </div>

            <button
              onClick={() => alert('Pilih file DICOM dari disk lokal...')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow"
            >
              Pilih File DICOM
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREATE NEW RADIOLOGY ORDER */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-600" />
                + Permintaan Order Radiologi Baru
              </h3>
              <button onClick={() => setShowOrderModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-4">
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
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Modalitas</label>
                  <select
                    value={newModality}
                    onChange={(e) => setNewModality(e.target.value as RadiologyModality)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="CT Scan">CT Scan</option>
                    <option value="MRI">MRI</option>
                    <option value="X-Ray">X-Ray Thorax/Bone</option>
                    <option value="USG">USG Abdomen</option>
                    <option value="Mammography">Mammography</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Prioritas Pemeriksaan</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="CITO">CITO (Cepat / Emergency)</option>
                    <option value="Rutin">Rutin Standard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Nama Pemeriksaan Radiologi</label>
                <input
                  type="text"
                  value={newExamName}
                  onChange={(e) => setNewExamName(e.target.value)}
                  placeholder="Misal: CT Scan Abdomen 3 Fase Kontras"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Media Kontras</label>
                  <input
                    type="text"
                    value={newContrast}
                    onChange={(e) => setNewContrast(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Dokter Pengirim</label>
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
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow"
                >
                  Kirim Request Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

