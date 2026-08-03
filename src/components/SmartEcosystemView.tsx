import React, { useState } from 'react';
import {
  Brain,
  Activity,
  Boxes,
  ShieldCheck,
  Building2,
  Wifi,
  Sparkles,
  Bot,
  Zap,
  Server,
  Layers,
  Heart,
  Globe,
  Lock,
  Cpu,
  AlertCircle,
  CheckCircle2,
  Clock,
  Radio,
  FileCode,
  Thermometer,
  Gauge,
  Video,
  Bed,
  RefreshCw,
  Sliders,
  DollarSign,
  Users,
  Search,
  Plus
} from 'lucide-react';
import {
  MOCK_IOT_DEVICES,
  MOCK_DIGITAL_TWIN_ROOMS,
  MOCK_RPM_DEVICES,
  MOCK_MULTI_HOSPITAL_TENANTS,
  MOCK_SATUSEHAT_FHIR_LOGS,
  MOCK_SECURITY_DEVOPS
} from '../data/mockData';
import {
  IoTDeviceSensor,
  DigitalTwinRoom,
  RPMDeviceData,
  MultiHospitalTenant,
  SatuSehatFHIRGatewayLog
} from '../types';

export const SmartEcosystemView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'copilot' | 'command_center' | 'digital_twin' | 'iot_rpm' | 'saas_multitenant' | 'satusehat_fhir' | 'security_devops'
  >('command_center');

  // IoT Devices state
  const [iotDevices] = useState<IoTDeviceSensor[]>(MOCK_IOT_DEVICES);
  const [digitalTwinRooms, setDigitalTwinRooms] = useState<DigitalTwinRoom[]>(MOCK_DIGITAL_TWIN_ROOMS);
  const [rpmDevices, setRpmDevices] = useState<RPMDeviceData[]>(MOCK_RPM_DEVICES);
  const [tenants, setTenants] = useState<MultiHospitalTenant[]>(MOCK_MULTI_HOSPITAL_TENANTS);
  const [fhirLogs, setFhirLogs] = useState<SatuSehatFHIRGatewayLog[]>(MOCK_SATUSEHAT_FHIR_LOGS);
  const [fhirSearch, setFhirSearch] = useState('');

  // Modals & Action States
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantDomain, setNewTenantDomain] = useState('');
  const [newTenantType, setNewTenantType] = useState('RS Tipe C (Kabupaten)');

  const [showAddRpmModal, setShowAddRpmModal] = useState(false);
  const [newRpmPatient, setNewRpmPatient] = useState('');
  const [newRpmNorm, setNewRpmNorm] = useState('');
  const [newRpmDeviceType, setNewRpmDeviceType] = useState('Smart Patch EKG 24 Jam');

  const [siemAuditRunning, setSiemAuditRunning] = useState(false);
  const [siemAuditResult, setSiemAuditResult] = useState<string | null>(null);

  // Copilot States
  const [patientContext, setPatientContext] = useState('RM-2026-001 (Ahmad Dahlan - Riwayat DM Tipe 2 + Hipertensi)');
  const [voiceDictationActive, setVoiceDictationActive] = useState(false);
  const [dictatedSOAP, setDictatedSOAP] = useState(
    'Pasien mengeluh sesak napas saat aktivitas ringan. Tekanan darah 140/90 mmHg, Nadi 88x/menit, SpO2 96% free air. Paru ronki basah halus di basal kanan.'
  );
  const [aiCopilotResult, setAiCopilotResult] = useState<{
    differentialDiagnosis: string[];
    suggestedICD10: string;
    clinicalGuideline: string;
    sepsisRiskPct: number;
  } | null>(null);

  const runAiCopilotAnalysis = () => {
    setAiCopilotResult({
      differentialDiagnosis: [
        'Congestive Heart Failure (CHF) NYHA Class II-III',
        'Acute Coronary Syndrome (ACS) NSTEMI',
        'Pneumonia Komunitas (CAP)'
      ],
      suggestedICD10: 'I50.9 - Heart failure, unspecified',
      clinicalGuideline: 'Pedoman PERKI 2023: Berikan Furosemid IV 20-40mg, Pantau EKG 12 Lead & Troponin I.',
      sepsisRiskPct: 18.5
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-inner">
              <Globe className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Smart AI Hospital Platform (Enterprise SaaS)</h1>
                <span className="rounded-full bg-cyan-500/20 px-3 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                  Global Enterprise 6.0
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Ekosistem Rumah Sakit Cerdas Terpadu: AI Copilot, 3D Digital Twin, IoT Medical Sensor, Remote Patient Monitoring, Multi-Tenant SaaS, SATUSEHAT FHIR & High Availability.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Sistem Kubernetes Cluster Multi-Region berjalan dalam status High Availability 99.99% Uptime.')}
              className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 border border-emerald-500/40"
            >
              <Server className="h-4 w-4" /> HA Uptime: 99.99%
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('command_center')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'command_center' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Activity className="h-4 w-4" />
          AI Command Center
        </button>
        <button
          onClick={() => setActiveTab('copilot')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'copilot' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Brain className="h-4 w-4 text-cyan-400" />
          AI Copilot (Doctor & Nurse)
        </button>
        <button
          onClick={() => setActiveTab('digital_twin')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'digital_twin' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Boxes className="h-4 w-4 text-purple-400" />
          3D Digital Twin RS
        </button>
        <button
          onClick={() => setActiveTab('iot_rpm')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'iot_rpm' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Wifi className="h-4 w-4 text-emerald-400" />
          IoT Medical & RPM
        </button>
        <button
          onClick={() => setActiveTab('saas_multitenant')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'saas_multitenant' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Building2 className="h-4 w-4 text-amber-400" />
          Multi-Tenant SaaS Holding
        </button>
        <button
          onClick={() => setActiveTab('satusehat_fhir')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'satusehat_fhir' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <FileCode className="h-4 w-4 text-cyan-400" />
          SATUSEHAT FHIR Gateway
        </button>
        <button
          onClick={() => setActiveTab('security_devops')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'security_devops' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="h-4 w-4 text-rose-400" />
          Cyber Security & DevOps
        </button>
      </div>

      {/* TAB 1: AI COMMAND CENTER */}
      {activeTab === 'command_center' && (
        <div className="space-y-6">
          {/* Status Matrix Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Seluruh Gedung</span>
              <div className="text-lg font-bold text-slate-100">4 Gedung Utama</div>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" /> HVAC & Gas Normal
              </span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Ketersediaan Bed</span>
              <div className="text-lg font-bold text-cyan-400">388 / 450 Occupied</div>
              <span className="text-[10px] text-amber-300 font-semibold">BOR 86.2%</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Kamar ICU & HCU</span>
              <div className="text-lg font-bold text-purple-400">18 / 20 Occupied</div>
              <span className="text-[10px] text-purple-300 font-semibold">2 Bed Kosong (Ready)</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Kamar Operasi (OK)</span>
              <div className="text-lg font-bold text-emerald-400">6 OK Active</div>
              <span className="text-[10px] text-slate-400">4 Tindakan Berlangsung</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Perangkat IoT Connected</span>
              <div className="text-lg font-bold text-cyan-400">1,248 Sensors</div>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Telemetry Stream</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">UGD Emergency Alert</span>
              <div className="text-lg font-bold text-rose-400">1 Red Zone Patient</div>
              <span className="text-[10px] text-rose-300 font-semibold">Prioritas Triase 1</span>
            </div>
          </div>

          {/* Realtime Live Activity Feed */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 space-y-4">
            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
              <Radio className="h-5 w-5 text-cyan-400 animate-pulse" /> Live Feed Telemetri Hospital Command Center
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-cyan-400 font-bold block text-sm border-b border-slate-800 pb-2">
                  IoT Critical Threshold Alert
                </span>
                <div className="flex items-start gap-3 bg-amber-950/30 p-3 rounded-lg border border-amber-500/30">
                  <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-300">Ventilator Hamilton-C6 (ICU Bed 02):</strong>
                    <p className="text-slate-300 mt-0.5">SpO2 pasien terdeteksi 92%. Peringatan awal desaturasi oksigen telah dikirim ke Nurse Station.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <span className="text-cyan-400 font-bold block text-sm border-b border-slate-800 pb-2">
                  Smart Bed & Fall Detection AI
                </span>
                <div className="flex items-start gap-3 bg-emerald-950/30 p-3 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-300">Smart Bed Stryker VVIP 204:</strong>
                    <p className="text-slate-300 mt-0.5">Sensor berat mendeteksi pergerakan pasien bangun dari tempat tidur. Alarm pengaman samping tempat tidur terpasang sempurna.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI COPILOT */}
      {activeTab === 'copilot' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-cyan-400" />
              <div>
                <h3 className="font-bold text-slate-100 text-lg">AI Medical & Nurse Copilot (Realtime Assistant)</h3>
                <p className="text-xs text-slate-400">Dikte Suara SOAP, ICD-10 Auto-Suggest, Panduan Klinis & Prediksi Risiko Sepsis/Readmisi</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Input Dikte & SOAP */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="text-slate-300 block font-semibold">Konteks Pasien Terpilih:</label>
              <input
                type="text"
                value={patientContext}
                onChange={(e) => setPatientContext(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2 text-slate-100 focus:border-cyan-500 focus:outline-none"
              />

              <div className="flex items-center justify-between pt-2">
                <label className="text-slate-300 font-semibold">Hasil Dikte Suara Dokter / Perawat (Auto SOAP):</label>
                <button
                  onClick={() => {
                    setVoiceDictationActive(!voiceDictationActive);
                    if (!voiceDictationActive) {
                      setDictatedSOAP(dictatedSOAP + ' Ditemukan ronki tambahan di basal kiri.');
                    }
                  }}
                  className={`flex items-center gap-1.5 rounded px-3 py-1 font-bold text-[11px] transition ${
                    voiceDictationActive
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-800 text-cyan-300 hover:bg-slate-700'
                  }`}
                >
                  <Radio className="h-3.5 w-3.5" />
                  {voiceDictationActive ? 'Merekam Suara...' : 'Mulai Voice Dictation'}
                </button>
              </div>

              <textarea
                rows={5}
                value={dictatedSOAP}
                onChange={(e) => setDictatedSOAP(e.target.value)}
                className="w-full rounded border border-slate-700 bg-slate-900 p-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none font-mono text-xs"
              />

              <button
                onClick={runAiCopilotAnalysis}
                className="w-full rounded-lg bg-cyan-500 py-2.5 font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                Analisis AI Copilot Sekarang
              </button>
            </div>

            {/* AI Copilot Output */}
            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-cyan-400 font-bold block text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> Hasil Analisis & Clinical Guidelines AI
              </span>

              {aiCopilotResult ? (
                <div className="space-y-3 leading-relaxed">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Differential Diagnosis (Prioritas Clinical AI):</span>
                    <ul className="list-disc list-inside font-semibold text-slate-200 mt-1 space-y-0.5">
                      {aiCopilotResult.differentialDiagnosis.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Rekomendasi ICD-10 Oramis:</span>
                    <span className="font-mono text-cyan-300 font-bold">{aiCopilotResult.suggestedICD10}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Panduan Klinis Evidence-Based:</span>
                    <p className="text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">{aiCopilotResult.clinicalGuideline}</p>
                  </div>

                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-slate-400 text-[11px]">Prediksi AI Risiko Sepsis:</span>
                    <span className="font-bold text-emerald-400">{aiCopilotResult.sepsisRiskPct}% (Risiko Rendah)</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 italic py-10 text-center">
                  Tekan "Analisis AI Copilot Sekarang" untuk mendapatkan rekomendasi klinis, diagnosis banding, dan kode ICD-10 otomatis.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 3D DIGITAL TWIN */}
      {activeTab === 'digital_twin' && (
        <div className="space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Boxes className="h-5 w-5 text-purple-400" /> Smart Hospital 3D Digital Twin Layout
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Visualisasi real-time kondisi fisik bangunan, suhu ruangan, kelembaban, tekanan gas medis, serta ketersediaan bed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {digitalTwinRooms.map((dt) => (
              <div key={dt.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{dt.roomNumber}</h4>
                    <p className="text-xs text-slate-400 font-mono">{dt.building} • {dt.floor}</p>
                  </div>
                  <span className="rounded bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300 border border-purple-500/30">
                    {dt.roomType}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900 p-2.5 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Suhu Ruangan:</span>
                    <span className="font-bold text-cyan-300">{dt.temperatureC} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Kelembaban (RH):</span>
                    <span className="font-bold text-cyan-300">{dt.humidityPct} %</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Tekanan Gas O2:</span>
                    <span className="font-bold text-emerald-400">{dt.medicalGasO2Psi} PSI</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Bed Terisi:</span>
                    <span className="font-bold text-amber-400">{dt.occupiedBeds} / {dt.totalBeds} Bed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: IOT MEDICAL & RPM */}
      {activeTab === 'iot_rpm' && (
        <div className="space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Wifi className="h-5 w-5 text-emerald-400" /> IoT Medical Devices & Remote Patient Monitoring (RPM)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Streaming telemetri sensor medis pasien terhubung dari ruang rawat inap maupun perangkat wearable pasien di rumah.
              </p>
            </div>
            <button
              onClick={() => setShowAddRpmModal(true)}
              className="rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition shrink-0"
            >
              + Hubungkan Perangkat RPM Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rpmDevices.map((rpm) => (
              <div key={rpm.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-base">{rpm.patientName}</h4>
                    <p className="text-xs text-slate-400 font-mono">{rpm.norm} • Device: {rpm.deviceType}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">Sync: {rpm.lastSyncTime}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs bg-slate-900 p-2.5 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Heart Rate:</span>
                    <span className="font-bold text-slate-200">{rpm.bpmRate} BPM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Tekanan Darah:</span>
                    <span className="font-bold text-slate-200">{rpm.sysBP}/{rpm.diaBP} mmHg</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">Gula Darah / SpO2:</span>
                    <span className="font-bold text-slate-200">{rpm.bloodSugarMgDl ? `${rpm.bloodSugarMgDl} mg/dL` : `${rpm.spO2Pct}%`}</span>
                  </div>
                </div>

                {rpm.aiAnomalyAlert && (
                  <div className="bg-rose-950/40 p-2.5 rounded border border-rose-500/40 text-xs text-rose-300 font-medium flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{rpm.aiAnomalyMessage}</span>
                    </div>
                    <button
                      onClick={() => {
                        setRpmDevices(prev =>
                          prev.map(item => item.id === rpm.id ? { ...item, aiAnomalyAlert: false } : item)
                        );
                        alert(`Alert Anomali untuk ${rpm.patientName} telah ditangani oleh Tim Perawat.`);
                      }}
                      className="bg-rose-500 text-white font-bold px-2.5 py-1 rounded text-[10px] shrink-0"
                    >
                      Selesaikan Alert
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: SAAS MULTI-TENANT */}
      {activeTab === 'saas_multitenant' && (
        <div className="space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-amber-400" /> Multi-Tenant SaaS & Multi-Hospital Management
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pengelolaan lisensi cabang rumah sakit, domain khusus tenant, penagihan langganan otomatis & branding kustom.
              </p>
            </div>
            <button
              onClick={() => setShowAddTenantModal(true)}
              className="rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shrink-0"
            >
              + Registrasi Cabang Tenant RS Baru
            </button>
          </div>

          <div className="space-y-3">
            {tenants.map((tn) => (
              <div key={tn.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-100 text-base">{tn.hospitalName}</h4>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300 font-mono">{tn.hospitalType}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    Domain: <span className="text-cyan-400 font-semibold">{tn.tenantDomain}</span> • Status SATUSEHAT: <span className="text-emerald-400 font-bold">{tn.satuSehatBridgeStatus}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Lisensi SaaS:</span>
                    <span className="font-bold text-amber-300">{tn.licenseTier}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Aktif Bed/User:</span>
                    <span className="font-bold text-slate-200">{tn.activeBeds} Bed / {tn.activeUsers} Users</span>
                  </div>
                  <button
                    onClick={() => alert(`Lisensi SaaS untuk ${tn.hospitalName} berhasil ditingkatkan ke Enterprise Unlimited!`)}
                    className="rounded bg-slate-800 px-3 py-1.5 text-xs text-amber-300 font-semibold hover:bg-amber-500 hover:text-slate-950 transition"
                  >
                    Upgrade Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SATUSEHAT FHIR */}
      {activeTab === 'satusehat_fhir' && (
        <div className="space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <FileCode className="h-5 w-5 text-cyan-400" /> SATUSEHAT Kemenkes & HL7/FHIR Integration Gateway
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Sinkronisasi otomatis rekam medis elektronik (RME) standar HL7 FHIR v4.0.1 ke DTO SATUSEHAT Kemenkes RI.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Cari Resource / NORM..."
                value={fhirSearch}
                onChange={(e) => setFhirSearch(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-200 rounded px-3 py-1.5 text-xs focus:border-cyan-500 focus:outline-none"
              />
              <button
                onClick={() => {
                  const newLog: SatuSehatFHIRGatewayLog = {
                    id: `fhir-${Date.now()}`,
                    resourceType: 'Encounter',
                    fhirId: `fhir-enc-${Math.random().toString(36).substring(2, 8)}`,
                    localNorm: 'RM-2026-9901',
                    syncTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
                    httpStatus: 201,
                    satusehatUuid: `ss-uuid-${Math.random().toString(36).substring(2, 10)}`,
                    responsePayload: '{"status":"created","code":201}'
                  };
                  setFhirLogs([newLog, ...fhirLogs]);
                  alert('FHIR Resource Encounter berhasil disinkronkan ke SATUSEHAT Kemenkes RI!');
                }}
                className="rounded-lg bg-cyan-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition shrink-0"
              >
                + Push Sync FHIR Baru
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Resource Type</th>
                  <th className="p-3">Local NORM</th>
                  <th className="p-3">Waktu Sync</th>
                  <th className="p-3">HTTP Status</th>
                  <th className="p-3">SATUSEHAT UUID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {fhirLogs
                  .filter(l => l.resourceType.toLowerCase().includes(fhirSearch.toLowerCase()) || l.localNorm.toLowerCase().includes(fhirSearch.toLowerCase()))
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-cyan-400">{log.resourceType}</td>
                      <td className="p-3 text-slate-200">{log.localNorm}</td>
                      <td className="p-3 text-slate-400">{log.syncTimestamp}</td>
                      <td className="p-3">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          {log.httpStatus} OK
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{log.satusehatUuid}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 7: SECURITY & DEVOPS */}
      {activeTab === 'security_devops' && (
        <div className="space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-rose-400" /> Cyber Security SIEM SOC & DevOps Kubernetes Center
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Pengawasan keamanan tingkat enterprise: Zero Trust MFA, SIEM Threat Detection, Enkripsi AES-256 & Kubernetes Auto-Scaling.
              </p>
            </div>
            <button
              onClick={() => {
                setSiemAuditRunning(true);
                setSiemAuditResult(null);
                setTimeout(() => {
                  setSiemAuditRunning(false);
                  setSiemAuditResult('Audit Keamanan SIEM Selesai: 0 Vulnerabilities Found. Enkripsi AES-256 & ISO 27001 Compliance Verified!');
                }, 1200);
              }}
              className="rounded-lg bg-rose-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-rose-400 transition shrink-0 flex items-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              {siemAuditRunning ? 'Memindai Vulnerability...' : 'Jalankan Audit Keamanan SIEM SOC'}
            </button>
          </div>

          {siemAuditResult && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <span>{siemAuditResult}</span>
              <button onClick={() => setSiemAuditResult(null)} className="text-slate-400 hover:text-slate-100">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 block text-[11px]">Status Cluster Kubernetes:</span>
              <div className="font-bold text-emerald-400 text-sm">{MOCK_SECURITY_DEVOPS.clusterStatus}</div>
              <p className="text-slate-400 text-[11px]">Multi-Zone Fallback enabled.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 block text-[11px]">Zero Trust & IAM MFA:</span>
              <div className="font-bold text-cyan-400 text-sm">ENFORCED 100%</div>
              <p className="text-slate-400 text-[11px]">Sertifikasi HIPAA & ISO 27001 Ready.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-slate-400 block text-[11px]">SIEM Security Threat Detection:</span>
              <div className="font-bold text-emerald-400 text-sm">0 Active Threats</div>
              <p className="text-slate-400 text-[11px]">Backups: {MOCK_SECURITY_DEVOPS.lastBackupTimestamp}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Tenant */}
      {showAddTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Registrasi Cabang Rumah Sakit (Tenant Baru)</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Rumah Sakit / Klinik:</label>
                <input
                  type="text"
                  placeholder="RS An-Nisa Medika"
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Domain Kustom Tenant:</label>
                <input
                  type="text"
                  placeholder="annisamedika.simrs-cloud.id"
                  value={newTenantDomain}
                  onChange={(e) => setNewTenantDomain(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Tipe Rumah Sakit:</label>
                <select
                  value={newTenantType}
                  onChange={(e) => setNewTenantType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                >
                  <option value="RS Tipe A (Rujukan Nasional)">RS Tipe A (Rujukan Nasional)</option>
                  <option value="RS Tipe B (Provinsi)">RS Tipe B (Provinsi)</option>
                  <option value="RS Tipe C (Kabupaten)">RS Tipe C (Kabupaten)</option>
                  <option value="Klinik Utama / Spesialis">Klinik Utama / Spesialis</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddTenantModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newTenantName) {
                    const tn: MultiHospitalTenant = {
                      id: `tenant-${Date.now()}`,
                      hospitalName: newTenantName,
                      tenantDomain: newTenantDomain || `${newTenantName.toLowerCase().replace(/\s+/g, '')}.simrs-cloud.id`,
                      hospitalType: newTenantType,
                      licenseTier: 'Enterprise Multi-Hospital',
                      activeBeds: 150,
                      activeUsers: 45,
                      satuSehatBridgeStatus: 'Connected Sync 100%',
                      subscriptionExpiry: '2027-12-31',
                      customBranding: { primaryColor: '#0284c7' }
                    };
                    setTenants([...tenants, tn]);
                    setShowAddTenantModal(false);
                    setNewTenantName('');
                    setNewTenantDomain('');
                    alert(`Tenant Cabang ${newTenantName} berhasil diregistrasi ke Cloud Multi-Tenant SaaS!`);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-xs text-slate-950 font-bold hover:bg-amber-400"
              >
                Simpan & Registrasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add RPM Device */}
      {showAddRpmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Hubungkan Perangkat RPM Medis Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Pasien:</label>
                <input
                  type="text"
                  placeholder="Siti Rahmawati"
                  value={newRpmPatient}
                  onChange={(e) => setNewRpmPatient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Nomor Rekam Medis (NORM):</label>
                <input
                  type="text"
                  placeholder="RM-2026-0089"
                  value={newRpmNorm}
                  onChange={(e) => setNewRpmNorm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Jenis Perangkat Remote Sensor:</label>
                <select
                  value={newRpmDeviceType}
                  onChange={(e) => setNewRpmDeviceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Smart Patch EKG 24 Jam">Smart Patch EKG 24 Jam</option>
                  <option value="Continuous Glucose Monitor (CGM)">Continuous Glucose Monitor (CGM)</option>
                  <option value="Pulse Oximeter & BP Monitor IoT">Pulse Oximeter & BP Monitor IoT</option>
                  <option value="Smart Holter Monitor">Smart Holter Monitor</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddRpmModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newRpmPatient) {
                    const dev: RPMDeviceData = {
                      id: `rpm-${Date.now()}`,
                      patientName: newRpmPatient,
                      norm: newRpmNorm || 'RM-2026-0999',
                      deviceType: newRpmDeviceType,
                      bpmRate: 78,
                      sysBP: 120,
                      diaBP: 80,
                      spO2Pct: 98,
                      lastSyncTime: 'Just Now',
                      aiAnomalyAlert: false
                    };
                    setRpmDevices([dev, ...rpmDevices]);
                    setShowAddRpmModal(false);
                    setNewRpmPatient('');
                    setNewRpmNorm('');
                    alert(`Perangkat RPM ${newRpmDeviceType} berhasil dihubungkan ke data stream ${newRpmPatient}!`);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-xs text-slate-950 font-bold hover:bg-emerald-400"
              >
                Hubungkan Device
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
