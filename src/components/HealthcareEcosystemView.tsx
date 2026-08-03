import React, { useState } from 'react';
import {
  Globe,
  Network,
  Building2,
  Stethoscope,
  Pill,
  TestTube,
  Radio,
  FileCheck2,
  Building,
  Activity,
  Watch,
  Truck,
  Send,
  QrCode,
  Smartphone,
  Users,
  Shield,
  TrendingUp,
  Brain,
  ShoppingBag,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  Plus,
  RefreshCw,
  Copy,
  Zap,
  Lock,
  Heart,
  Calendar,
  CreditCard,
  MapPin,
  Clock,
  ChevronRight,
  ShieldAlert,
  Server
} from 'lucide-react';
import {
  MOCK_NATIONAL_HEALTH_EXCHANGE,
  MOCK_PROVIDER_NETWORK,
  MOCK_WEARABLES_TELEMETRY,
  MOCK_SMART_AMBULANCE_UNITS,
  MOCK_CORPORATE_CLIENTS,
  MOCK_POPULATION_PREDICTIONS,
  MOCK_HEALTHCARE_MARKETPLACE,
  MOCK_DEVELOPER_KEYS
} from '../data/mockData';
import {
  NationalHealthExchangeNode,
  ProviderNetworkItem,
  WearableDeviceTelemetry,
  SmartAmbulanceTelemetry,
  CorporateMCUClient,
  PopulationHealthPrediction,
  HealthcareMarketplaceItem,
  DeveloperPortalKey
} from '../types';

export const HealthcareEcosystemView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'health_exchange'
    | 'provider_network'
    | 'patient_superapp'
    | 'rpm_wearables'
    | 'corporate_mcu'
    | 'population_health'
    | 'marketplace'
    | 'developer_portal'
  >('health_exchange');

  // Interactive States
  const [exchangeNodes, setExchangeNodes] = useState<NationalHealthExchangeNode[]>(MOCK_NATIONAL_HEALTH_EXCHANGE);
  const [providerList, setProviderList] = useState<ProviderNetworkItem[]>(MOCK_PROVIDER_NETWORK);
  const [wearablesList, setWearablesList] = useState<WearableDeviceTelemetry[]>(MOCK_WEARABLES_TELEMETRY);
  const [ambulanceUnits, setAmbulanceUnits] = useState<SmartAmbulanceTelemetry[]>(MOCK_SMART_AMBULANCE_UNITS);
  const [marketplaceItems, setMarketplaceItems] = useState<HealthcareMarketplaceItem[]>(MOCK_HEALTHCARE_MARKETPLACE);
  const [developerKeys, setDeveloperKeys] = useState<DeveloperPortalKey[]>(MOCK_DEVELOPER_KEYS);

  // Patient Super App State Simulation
  const [superAppActiveSection, setSuperAppActiveSection] = useState<'records' | 'referrals' | 'family' | 'wallet'>('records');
  const [walletBalance, setWalletBalance] = useState(2450000);
  const [familyMembers, setFamilyMembers] = useState([
    { name: 'Siti Aminah (Istri)', relation: 'Istri', age: 42, condition: 'Diabetes T2 - Terkontrol' },
    { name: 'Rian Dahlan (Anak Utama)', relation: 'Anak', age: 14, condition: 'Vaksinasi Lengkap' }
  ]);

  // Dev Portal State
  const [newKeyAppName, setNewKeyAppName] = useState('');
  const [newKeyOrgName, setNewKeyOrgName] = useState('');

  // Additional Modals State
  const [showAddProviderModal, setShowAddProviderModal] = useState(false);
  const [newProvName, setNewProvName] = useState('');
  const [newProvType, setNewProvType] = useState('Klinik Utama');
  const [newProvRegion, setNewProvRegion] = useState('DKI Jakarta');

  const [showAddAmbulanceModal, setShowAddAmbulanceModal] = useState(false);
  const [newAmbDriver, setNewAmbDriver] = useState('');
  const [newAmbParamedic, setNewAmbParamedic] = useState('');
  const [newAmbLocation, setNewAmbLocation] = useState('Jl. Sudirman No. 45, Jakarta');

  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Alat Kesehatan (Alkes)');
  const [newProdPrice, setNewProdPrice] = useState('1500000');
  const [newProdVendor, setNewProdVendor] = useState('PT Medika Nusantara');

  const handleSyncExchangeNode = (id: string) => {
    setExchangeNodes(prev =>
      prev.map(node =>
        node.id === id
          ? {
              ...node,
              recordsProcessedToday: node.recordsProcessedToday + Math.floor(Math.random() * 50) + 10,
              lastSyncTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : node
      )
    );
  };

  const handleGenerateDevKey = () => {
    if (!newKeyAppName || !newKeyOrgName) {
      alert('Mohon isi nama aplikasi dan nama organisasi.');
      return;
    }

    const newKey: DeveloperPortalKey = {
      id: `dev-${Date.now()}`,
      appName: newKeyAppName,
      organizationName: newKeyOrgName,
      apiKeyMasked: `sk_sandbox_${Math.random().toString(36).substring(2, 8)}...8a`,
      environment: 'Sandbox',
      rateLimitPerMin: 500,
      webhookUrl: `https://${newKeyAppName.toLowerCase().replace(/\s+/g, '')}.com/webhook`,
      requestsCount24h: 1,
      status: 'Active'
    };

    setDeveloperKeys(prev => [newKey, ...prev]);
    setNewKeyAppName('');
    setNewKeyOrgName('');
    alert('API Key Sandbox berhasil diterbitkan!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-teal-950/60 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-inner">
              <Globe className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Healthcare Super Ecosystem Platform</h1>
                <span className="rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-3 py-0.5 text-xs font-bold text-slate-950 shadow">
                  National Edition 8.0
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Ekosistem Layanan Kesehatan Terintegrasi Nasional: SATUSEHAT Interop, Provider Network, Patient Super App, Wearable RPM, Corporate MCU, Population AI & Open Developer API.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-teal-500/20 px-3.5 py-2 text-xs font-bold text-teal-300 border border-teal-500/40 flex items-center gap-2">
              <Network className="h-4 w-4 text-emerald-400" />
              100% Interoperabel FHIR R4
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('health_exchange')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'health_exchange'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Server className="h-4 w-4 text-emerald-400" />
          National Health Exchange
        </button>

        <button
          onClick={() => setActiveTab('provider_network')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'provider_network'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Network className="h-4 w-4 text-cyan-400" />
          Provider Network
        </button>

        <button
          onClick={() => setActiveTab('patient_superapp')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'patient_superapp'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Smartphone className="h-4 w-4 text-indigo-400" />
          Patient Super App
        </button>

        <button
          onClick={() => setActiveTab('rpm_wearables')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'rpm_wearables'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Watch className="h-4 w-4 text-rose-400" />
          Wearables & Smart Ambulance
        </button>

        <button
          onClick={() => setActiveTab('corporate_mcu')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'corporate_mcu'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Building className="h-4 w-4 text-amber-400" />
          Corporate MCU
        </button>

        <button
          onClick={() => setActiveTab('population_health')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'population_health'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Brain className="h-4 w-4 text-purple-400" />
          Population AI
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'marketplace'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="h-4 w-4 text-teal-300" />
          Marketplace
        </button>

        <button
          onClick={() => setActiveTab('developer_portal')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'developer_portal'
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Code2 className="h-4 w-4 text-cyan-300" />
          Developer Portal
        </button>
      </div>

      {/* TAB 1: NATIONAL HEALTH EXCHANGE */}
      {activeTab === 'health_exchange' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Globe className="h-5 w-5 text-teal-400" /> Gateway Pertukaran Data Kesehatan Nasional (National Health Exchange)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Sinkronisasi riwayat medis real-time dengan SATUSEHAT Kemenkes RI, BPJS Kesehatan, Master Patient Index, e-Klaim INA-CBG & National Lab Exchange.
              </p>
            </div>
            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30 font-mono">
              ● All Systems Live & Encrypted (AES-256)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exchangeNodes.map((node) => (
              <div key={node.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 hover:border-teal-500/50 transition shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{node.systemName}</h4>
                    <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Protocol: {node.protocol}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/30">
                    {node.status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rekam Medis Terproses Hari Ini:</span>
                    <strong className="text-cyan-400">{node.recordsProcessedToday.toLocaleString()} FHIR Bundles</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Terakhir Disinkronkan:</span>
                    <span className="text-slate-300">{node.lastSyncTimestamp}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-400">Patient Consent Verified:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Disetujui
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">Audit Log: Encrypted</span>
                  <button
                    onClick={() => handleSyncExchangeNode(node.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-teal-500/20 px-3 py-1.5 text-xs font-bold text-teal-300 border border-teal-500/40 hover:bg-teal-500 hover:text-slate-950 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Force Sync FHIR
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: HEALTHCARE PROVIDER NETWORK */}
      {activeTab === 'provider_network' && (
        <div className="space-y-6 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Network className="h-5 w-5 text-cyan-400" /> Jaringan Faskes Terinterkoneksi (Provider Network)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Konektivitas seamless antara Rumah Sakit, Klinik, Puskesmas, Apotek, Laboratorium, Radiologi & Fleet Ambulance.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-cyan-300 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30 font-mono">
                Interoperability: FHIR Mesh
              </span>
              <button
                onClick={() => setShowAddProviderModal(true)}
                className="rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition"
              >
                + Registrasi Provider Baru
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providerList.map((prov) => (
              <div key={prov.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{prov.name}</h4>
                    <span className="text-[10px] text-teal-300 font-bold bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                      {prov.type}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    ★ {prov.rating}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300 font-mono">
                  <div>Wilayah: <span className="text-slate-100">{prov.region}</span></div>
                  <div>Kontak: <span className="text-cyan-300">{prov.contactNumber}</span></div>
                  <div>Rujukan Aktif: <strong className="text-emerald-400">{prov.activeReferralsCount} Kasus</strong></div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {prov.interopStatus}
                  </span>
                  <button
                    onClick={() => alert(`Membuat Rujukan Digital ke ${prov.name}...`)}
                    className="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded text-[11px] font-bold border border-indigo-500/30 hover:bg-indigo-500 hover:text-white transition"
                  >
                    Kirim e-Referral
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PATIENT SUPER APP */}
      {activeTab === 'patient_superapp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mobile Screen Mockup */}
          <div className="lg:col-span-1 bg-slate-950 p-6 rounded-3xl border-4 border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-indigo-400" />
                <span className="font-bold text-slate-100 text-sm">Patient Super App</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                Online
              </span>
            </div>

            {/* Profile Card */}
            <div className="rounded-xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-indigo-950 p-4 border border-indigo-500/30 text-white space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Ahmad Dahlan</h4>
                  <span className="text-[11px] text-indigo-300 font-mono">NIK: 3174092108810002</span>
                </div>
                <div className="h-10 w-10 rounded-full bg-indigo-500/30 flex items-center justify-center font-bold text-indigo-300 border border-indigo-500/40">
                  AD
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-500/30 flex items-center justify-between text-xs">
                <span>Health Wallet:</span>
                <strong className="text-emerald-400 font-mono">Rp {walletBalance.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            {/* App Quick Menu */}
            <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
              <button
                onClick={() => setSuperAppActiveSection('records')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  superAppActiveSection === 'records' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <FileCheck2 className="h-4 w-4 text-cyan-400" />
                EMR Medis
              </button>

              <button
                onClick={() => setSuperAppActiveSection('referrals')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  superAppActiveSection === 'referrals' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Pill className="h-4 w-4 text-emerald-400" />
                e-Prescription
              </button>

              <button
                onClick={() => setSuperAppActiveSection('family')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  superAppActiveSection === 'family' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <Users className="h-4 w-4 text-amber-400" />
                Family
              </button>

              <button
                onClick={() => setSuperAppActiveSection('wallet')}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                  superAppActiveSection === 'wallet' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                <CreditCard className="h-4 w-4 text-rose-400" />
                Wallet
              </button>
            </div>
          </div>

          {/* Detailed Content Panel */}
          <div className="lg:col-span-2 bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            {superAppActiveSection === 'records' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <FileCheck2 className="h-5 w-5 text-cyan-400" /> Rekam Medis Terintegrasi FHIR (SATUSEHAT)
                </h3>
                <div className="space-y-3">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-100">Pemeriksaan Spesialis Jantung (Dr. Hendra, Sp.JP)</span>
                      <span className="text-slate-400 font-mono">02 Agustus 2026</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                      Diagnosis: Ischemic Heart Disease (I50.9). TD 140/90 mmHg. Diberikan e-Prescription Furosemide 40mg & CPG 75mg.
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-teal-400 pt-1 font-mono">
                      <span>SATUSEHAT FHIR Bundle Verified</span>
                      <button onClick={() => alert('Mengunduh resume medis PDF...')} className="underline text-indigo-400">Unduh Resume Medis</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {superAppActiveSection === 'family' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                    <Users className="h-5 w-5 text-amber-400" /> Anggota Keluarga Terhubung (Family Health)
                  </h3>
                  <button
                    onClick={() => {
                      const name = prompt('Masukkan Nama Anggota Keluarga:');
                      const rel = prompt('Hubungan Keluarga (Anak/Istri/Orang Tua):');
                      if (name && rel) {
                        setFamilyMembers(prev => [...prev, { name, relation: rel, age: 10, condition: 'Sehat / Monitoring' }]);
                      }
                    }}
                    className="flex items-center gap-1 rounded bg-amber-500/20 text-amber-300 px-3 py-1.5 text-xs font-bold border border-amber-500/30"
                  >
                    <Plus className="h-3.5 w-3.5" /> Tambah Anggota
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {familyMembers.map((fam, i) => (
                    <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-1">
                      <h4 className="font-bold text-slate-100">{fam.name}</h4>
                      <p className="text-slate-400">Hubungan: {fam.relation} • Usia: {fam.age} thn</p>
                      <span className="inline-block mt-1 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        {fam.condition}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {superAppActiveSection === 'wallet' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-rose-400" /> Digital Health Wallet & Kartu Asuransi BPJS
                </h3>
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span>Saldo Digital Health Wallet:</span>
                    <strong className="text-lg text-emerald-400 font-mono">Rp {walletBalance.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Kartu BPJS Kesehatan Digital:</span>
                    <span className="font-mono text-cyan-300 font-bold">0001248920192 (Aktif)</span>
                  </div>
                  <button
                    onClick={() => {
                      setWalletBalance(prev => prev + 500000);
                      alert('Top up Rp 500.000 berhasil!');
                    }}
                    className="w-full bg-indigo-500 text-white font-bold py-2 rounded-lg hover:bg-indigo-400 transition"
                  >
                    Top Up Saldo Health Wallet
                  </button>
                </div>
              </div>
            )}

            {superAppActiveSection === 'referrals' && (
              <div className="space-y-4">
                <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                  <Pill className="h-5 w-5 text-emerald-400" /> e-Prescription & Delivery Apotek Jaringan
                </h3>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-300 font-mono">e-Rx #RX-2026-8819</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">Disiapkan Apotek K-24</span>
                  </div>
                  <p className="text-slate-300">Item: Furosemide 40mg (10 Tab), Clopidogrel 75mg (30 Tab)</p>
                  <button onClick={() => alert('Instruksi pengiriman obat via Smart Courier diproses!')} className="bg-teal-500 text-slate-950 font-bold px-3 py-1.5 rounded hover:bg-teal-400 transition">
                    Minta Delivery Ke Rumah
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: WEARABLES & SMART AMBULANCE */}
      {activeTab === 'rpm_wearables' && (
        <div className="space-y-6">
          {/* Wearables Grid */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Watch className="h-5 w-5 text-rose-400" /> Telemetri Wearables Sync (Apple Health, Garmin, Fitbit, Samsung)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {wearablesList.map((wear) => (
                <div key={wear.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-100 text-xs">{wear.deviceName}</h4>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                      {wear.platform}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-bold">{wear.patientName}</p>

                  <div className="space-y-1 text-xs font-mono bg-slate-900 p-2.5 rounded border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Heart Rate:</span>
                      <strong className="text-rose-400">{wear.heartRateBpm} BPM</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Blood Pressure:</span>
                      <strong className="text-cyan-300">{wear.bloodPressureSystolicDiastolic}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SpO2:</span>
                      <strong className="text-emerald-400">{wear.spO2Percent}%</strong>
                    </div>
                  </div>

                  <div className={`p-2 rounded text-[11px] font-bold text-center ${
                    wear.aiEarlyWarningAlert === 'Normal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300 animate-pulse'
                  }`}>
                    AI Alert: {wear.aiEarlyWarningAlert}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Ambulance Fleet */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Truck className="h-5 w-5 text-amber-400" /> Smart Ambulance Emergency Fleet & Telemedicine
              </h3>
              <button
                onClick={() => setShowAddAmbulanceModal(true)}
                className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                + Dispatch Unit Ambulance
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambulanceUnits.map((amb) => (
                <div key={amb.unitId} className="rounded-xl border border-amber-500/30 bg-slate-950 p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <span className="font-bold font-mono text-xs text-amber-400">{amb.unitId}</span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded">
                      ETA: {amb.etaMinutes} Menit
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300 font-sans">
                    <div>Pengemudi / Paramedis: <strong>{amb.driverName} / {amb.paramedicName}</strong></div>
                    <div>Lokasi GPS: <span className="font-mono text-cyan-300">{amb.currentLocationGPS}</span></div>
                    <div>Kondisi Pasien: <strong className="text-rose-400">{amb.patientCondition}</strong></div>
                  </div>

                  <div className="p-2.5 bg-slate-900 rounded-lg text-xs font-mono border border-slate-800">
                    <span className="text-indigo-400 font-bold block mb-1">Rute AI Teroptimasi:</span>
                    {amb.aiRouteOptimization}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CORPORATE MCU */}
      {activeTab === 'corporate_mcu' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Building className="h-5 w-5 text-amber-400" /> Corporate Healthcare & Occupational Health
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_CORPORATE_CLIENTS.map((corp) => (
              <div key={corp.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{corp.companyName}</h4>
                    <span className="text-xs text-slate-400">{corp.industry}</span>
                  </div>
                  <span className="text-xs font-mono bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded font-bold">
                    {corp.totalEmployees} Karyawan
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Paket MCU:</span>
                    <span className="text-teal-300">{corp.mcuPackageName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Progress Selesai:</span>
                    <strong className="text-emerald-400">{corp.completedMcuPct}%</strong>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Fit To Work:</span>
                    <span className="text-emerald-300 font-bold">{corp.fitToWorkStatus.fit} Fit / {corp.fitToWorkStatus.fitWithRestriction} Catatan</span>
                  </div>
                </div>

                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-xs text-amber-300 font-sans">
                  ⚠️ Alert K3: {corp.occupationalHealthAlert}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: POPULATION HEALTH & OUTBREAK AI */}
      {activeTab === 'population_health' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" /> AI Population Health & Outbreak Prediction Dashboard
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Prediksi kluster wabah penyakit, cakupan vaksinasi regional, dan rekomendasi intervensi Dinas Kesehatan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_POPULATION_PREDICTIONS.map((pop) => (
              <div key={pop.id} className="rounded-xl border border-purple-500/30 bg-slate-950 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-slate-100 text-sm">{pop.diseaseName}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    pop.riskLevel.includes('Kritis') ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {pop.riskLevel}
                  </span>
                </div>

                <p className="text-xs text-cyan-300 font-mono">Wilayah: {pop.regionCode}</p>

                <div className="space-y-1 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Prediksi Kasus (30 Hari):</span>
                    <strong className="text-rose-400">{pop.predictedCasesNext30Days} Kasus</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Probabilitas Wabah AI:</span>
                    <strong className="text-purple-300">{pop.aiOutbreakProbabilityPct}%</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded text-xs text-slate-300 font-sans border border-slate-800">
                  <span className="text-teal-400 font-bold block mb-1">Rekomendasi Intervensi Kemenkes:</span>
                  {pop.recommendedIntervention}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: HEALTHCARE MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-teal-300" /> B2B & B2C Healthcare Marketplace
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Katalog resmi Alat Kesehatan terlisensi Kemenkes, Obat FORNAS, Paket MCU, Layanan Home Care & Rental Alkes.
              </p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="rounded-lg bg-teal-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-teal-400 transition shrink-0"
            >
              + Listing Produk / Alkes Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketplaceItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-32 object-cover rounded-lg border border-slate-800" />
                  <div>
                    <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold border border-teal-500/30">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-slate-100 text-xs mt-1.5 line-clamp-2">{item.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-400">Vendor: {item.vendorName}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Harga:</span>
                    <strong className="text-emerald-400 font-mono">Rp {item.priceIdr.toLocaleString('id-ID')}</strong>
                  </div>
                  <button
                    onClick={() => alert(`Memesan ${item.title}...`)}
                    className="w-full bg-teal-500 text-slate-950 font-bold py-1.5 rounded-lg text-xs hover:bg-teal-400 transition"
                  >
                    Beli / Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: DEVELOPER PORTAL */}
      {activeTab === 'developer_portal' && (
        <div className="space-y-6">
          {/* Key Generator Form */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-cyan-300" /> Developer Portal & Open API Key Management
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nama Aplikasi (e.g., Halodoc Adapter)"
                value={newKeyAppName}
                onChange={(e) => setNewKeyAppName(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Nama Organisasi / PT"
                value={newKeyOrgName}
                onChange={(e) => setNewKeyOrgName(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2 focus:border-teal-500 focus:outline-none"
              />
              <button
                onClick={handleGenerateDevKey}
                className="bg-teal-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg hover:bg-teal-400 transition"
              >
                + Generate Sandbox API Key
              </button>
            </div>
          </div>

          {/* Active Keys List */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-100 text-sm">Daftar API Key Partner Terdaftar</h4>

            <div className="space-y-3">
              {developerKeys.map((key) => (
                <div key={key.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-slate-100">{key.appName}</strong>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{key.environment}</span>
                    </div>
                    <p className="text-slate-400">{key.organizationName} • Key: <span className="font-mono text-cyan-300">{key.apiKeyMasked}</span></p>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-xs">
                    <span className="text-slate-400">Rate Limit: {key.rateLimitPerMin}/m</span>
                    <span className="text-emerald-400 font-bold">{key.requestsCount24h.toLocaleString()} reqs/24h</span>
                    <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">{key.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Provider */}
      {showAddProviderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Registrasi Faskes Provider Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Faskes / Klinik / RS:</label>
                <input
                  type="text"
                  placeholder="RS Mitra Husada Primary"
                  value={newProvName}
                  onChange={(e) => setNewProvName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Tipe Faskes:</label>
                <select
                  value={newProvType}
                  onChange={(e) => setNewProvType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Rumah Sakit Tipe A/B">Rumah Sakit Tipe A/B</option>
                  <option value="Klinik Utama">Klinik Utama</option>
                  <option value="Puskesmas Pembantu">Puskesmas Pembantu</option>
                  <option value="Laboratorium Klinik">Laboratorium Klinik</option>
                  <option value="Jaringan Apotek">Jaringan Apotek</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Wilayah / Kota:</label>
                <input
                  type="text"
                  placeholder="DKI Jakarta"
                  value={newProvRegion}
                  onChange={(e) => setNewProvRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddProviderModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newProvName) {
                    const newProv: ProviderNetworkItem = {
                      id: `prov-${Date.now()}`,
                      name: newProvName,
                      type: newProvType,
                      region: newProvRegion,
                      contactNumber: '+62 812-3456-7890',
                      interopStatus: 'Connected FHIR',
                      activeReferralsCount: 1,
                      rating: 4.8
                    };
                    setProviderList([...providerList, newProv]);
                    setShowAddProviderModal(false);
                    setNewProvName('');
                    alert(`Provider ${newProvName} berhasil ditambahkan ke Jaringan Faskes Nasional!`);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-xs text-slate-950 font-bold hover:bg-cyan-400"
              >
                Simpan Provider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Dispatch Ambulance */}
      {showAddAmbulanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Dispatch Smart Ambulance Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Pengemudi:</label>
                <input
                  type="text"
                  placeholder="Budi Santoso"
                  value={newAmbDriver}
                  onChange={(e) => setNewAmbDriver(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Nama Paramedis Medis:</label>
                <input
                  type="text"
                  placeholder="Ns. Rina Wati, S.Kep"
                  value={newAmbParamedic}
                  onChange={(e) => setNewAmbParamedic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Lokasi GPS Penjemputan:</label>
                <input
                  type="text"
                  placeholder="Jl. Sudirman No. 45, Jakarta"
                  value={newAmbLocation}
                  onChange={(e) => setNewAmbLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddAmbulanceModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newAmbDriver && newAmbParamedic) {
                    const unit: SmartAmbulanceTelemetry = {
                      unitId: `AMB-2026-${Math.floor(Math.random() * 90) + 10}`,
                      driverName: newAmbDriver,
                      paramedicName: newAmbParamedic,
                      currentLocationGPS: newAmbLocation,
                      destinationHospital: 'RSUD Smart Medika Hospital',
                      patientCondition: 'Emergency Transfer',
                      etaMinutes: 8,
                      vitals: { hr: 92, bp: '120/80', spo2: 98 },
                      aiRouteOptimization: 'Rute Bebas Macet via Tol Dalam Kota',
                      status: 'En Route to Scene'
                    };
                    setAmbulanceUnits([unit, ...ambulanceUnits]);
                    setShowAddAmbulanceModal(false);
                    setNewAmbDriver('');
                    setNewAmbParamedic('');
                    alert(`Ambulance ${unit.unitId} berhasil didispatch!`);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-xs text-slate-950 font-bold hover:bg-amber-400"
              >
                Dispatch Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Marketplace Product */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Tambah Listing Produk / Alkes</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Produk / Alkes / Obat:</label>
                <input
                  type="text"
                  placeholder="Defibrillator AED Portable 2026"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Kategori Marketplace:</label>
                <select
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-teal-500 focus:outline-none"
                >
                  <option value="Alat Kesehatan (Alkes)">Alat Kesehatan (Alkes)</option>
                  <option value="Obat & Farmasi FORNAS">Obat & Farmasi FORNAS</option>
                  <option value="Paket MCU Medical Checkup">Paket MCU Medical Checkup</option>
                  <option value="Rental & Sewa Alkes RS">Rental & Sewa Alkes RS</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Harga (IDR):</label>
                <input
                  type="number"
                  placeholder="25000000"
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Nama Vendor / Distributor:</label>
                <input
                  type="text"
                  placeholder="PT Kimia Farma Trading"
                  value={newProdVendor}
                  onChange={(e) => setNewProdVendor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newProdTitle) {
                    const item: HealthcareMarketplaceItem = {
                      id: `mk-${Date.now()}`,
                      title: newProdTitle,
                      category: 'Alat Kesehatan',
                      priceIdr: Number(newProdPrice) || 1000000,
                      vendorName: newProdVendor,
                      rating: 4.9,
                      stockQty: 50,
                      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
                      isBpomCertified: true
                    };
                    setMarketplaceItems([item, ...marketplaceItems]);
                    setShowAddProductModal(false);
                    setNewProdTitle('');
                    alert(`Produk ${newProdTitle} berhasil dipublikasikan ke Marketplace!`);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-teal-500 text-xs text-slate-950 font-bold hover:bg-teal-400"
              >
                Publish Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
