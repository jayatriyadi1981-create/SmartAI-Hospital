/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  HospitalInfo,
  StatCard,
  PatientVisitData,
  RevenueData,
  BedOccupancyData,
  TopPenyakitData,
  TopPoliData,
  AIModule,
  AIPrediction,
  BuildingStatus,
  OperatingRoomStatus,
  AmbulanceStatus,
  NotificationItem,
  CalendarEvent,
  MasterDataItem,
  AuditLogEntry,
  EmergencyVisit,
  BedItem,
  WardMetrics,
  ICUMonitorItem,
  OperationSchedule,
  NurseTask,
  CDSSRecommendation,
  PrescriptionOrder,
  DigitalConsent,
  DischargeSummaryRecord,
  CareTeamMember,
  LabOrder,
  RadiologyOrder,
  DICOMStudy,
  BloodInventoryItem,
  BloodCrossmatch,
  DietOrder,
  RehabSession,
  CSSDBatch,
  MedicalDeviceIoT,
  AmbulanceDispatch,
  MortuaryRecord,
  MedicalCertificate,
  DrugMaster,
  DrugBatch,
  DrugDispense,
  InventoryItem,
  PurchaseRequest,
  PurchaseOrder,
  SupplierVendor,
  AssetMaster,
  BiomedicalWorkOrder,
  GeneralLedgerAccount,
  BillingInvoice,
  BPJSSEPClaim,
  EmployeeRecord,
  ShiftAttendanceRecord,
  CRMMember,
  MarketingCampaign,
  ExecutiveBIReport,
  IoTDeviceSensor,
  DigitalTwinRoom,
  RPMDeviceData,
  MultiHospitalTenant,
  SatuSehatFHIRGatewayLog,
  SecurityDevOpsCenter,
  AIAgentItem,
  AIAgentWorkflowStep,
  HumanApprovalItem,
  KnowledgeBaseDocument,
  AIModelRouterItem,
  AIObservabilityMetric,
  AIChatMessage,
  NationalHealthExchangeNode,
  ProviderNetworkItem,
  WearableDeviceTelemetry,
  SmartAmbulanceTelemetry,
  CorporateMCUClient,
  PopulationHealthPrediction,
  HealthcareMarketplaceItem,
  DeveloperPortalKey,
  StudioWorkflowDefinition,
  StudioFormDefinition,
  StudioPluginItem,
  StudioEtlJob,
  StudioPromptDefinition,
  StudioAgentDefinition,
  StudioTenantConfig,
  ProductionClusterNode,
  SecurityThreatIncident,
  ComplianceFrameworkItem,
  FinOpsCostMetric,
  ServiceDeskTicket,
  FeatureFlagItem,
  ProductionReadinessItem
} from '../types';

export const INITIAL_HOSPITAL: HospitalInfo = {
  id: 'hosp-001',
  name: 'RSUD Smart Medika General Hospital',
  code: 'RSUD-SMGH-01',
  classType: 'A',
  address: 'Jl. Merdeka Sehat No. 100, Jakarta Pusat',
  phone: '(021) 555-8899',
  emergencyHotline: '119 / (021) 555-9911',
  logo: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200',
  totalBeds: 650,
};

export const INITIAL_STATS: StatCard[] = [
  {
    id: 's1',
    title: 'Total Pasien Hari Ini',
    value: 1248,
    unit: 'Pasien',
    change: 12.5,
    trend: 'up',
    timeframe: 'vs kemarin',
    category: 'operational',
    iconName: 'Users'
  },
  {
    id: 's2',
    title: 'Pasien Rawat Jalan',
    value: 845,
    unit: 'Orang',
    change: 8.2,
    trend: 'up',
    timeframe: '24 Poli Aktif',
    category: 'clinical',
    iconName: 'UserCheck'
  },
  {
    id: 's3',
    title: 'Pasien Rawat Inap',
    value: 492,
    unit: 'Bed In Use',
    change: 3.4,
    trend: 'up',
    timeframe: 'Kapasitas Total 650',
    category: 'occupancy',
    iconName: 'Bed'
  },
  {
    id: 's4',
    title: 'Pasien IGD Darurat',
    value: 111,
    unit: 'Triage In',
    change: -4.1,
    trend: 'down',
    timeframe: 'Avg Response 4.2 min',
    category: 'clinical',
    iconName: 'Activity'
  },
  {
    id: 's5',
    title: 'Operasi Hari Ini',
    value: 18,
    unit: 'Prosedur',
    change: 15.0,
    trend: 'up',
    timeframe: '6 Kamar Operasi',
    category: 'clinical',
    iconName: 'Stethoscope'
  },
  {
    id: 's6',
    title: 'Bed Occupancy Rate (BOR)',
    value: '75.7%',
    change: 2.1,
    trend: 'up',
    timeframe: 'Target Optimal 75-85%',
    category: 'occupancy',
    iconName: 'PieChart'
  },
  {
    id: 's7',
    title: 'Dokter Aktif Bertugas',
    value: 86,
    unit: 'Dokter',
    change: 0,
    trend: 'neutral',
    timeframe: 'Spesialis & Umum',
    category: 'operational',
    iconName: 'UserPlus'
  },
  {
    id: 's8',
    title: 'Perawat On Duty',
    value: 164,
    unit: 'Perawat',
    change: 4.5,
    trend: 'up',
    timeframe: 'Shift Pagi/Siang',
    category: 'operational',
    iconName: 'HeartHandshake'
  },
  {
    id: 's9',
    title: 'Laboratorium & Radiologi',
    value: 342,
    unit: 'Sampel/Scan',
    change: 18.3,
    trend: 'up',
    timeframe: 'AI Assisted 92%',
    category: 'clinical',
    iconName: 'Microscope'
  },
  {
    id: 's10',
    title: 'Pendapatan Hari Ini',
    value: 'Rp 485.6M',
    change: 9.4,
    trend: 'up',
    timeframe: 'Est Real-time',
    category: 'financial',
    iconName: 'DollarSign'
  },
  {
    id: 's11',
    title: 'Pendapatan Bulan Ini',
    value: 'Rp 14.82B',
    change: 14.2,
    trend: 'up',
    timeframe: 'Target Rp 16B',
    category: 'financial',
    iconName: 'TrendingUp'
  },
  {
    id: 's12',
    title: 'Klaim BPJS Terverifikasi',
    value: 'Rp 9.24B',
    change: 6.8,
    trend: 'up',
    timeframe: 'Verifikasi V-Claim AI',
    category: 'financial',
    iconName: 'ShieldCheck'
  },
  {
    id: 's13',
    title: 'Piutang Asuransi & Pasien',
    value: 'Rp 1.15B',
    change: -5.2,
    trend: 'down',
    timeframe: 'Aging < 30 hari',
    category: 'financial',
    iconName: 'CreditCard'
  },
  {
    id: 's14',
    title: 'Cash Flow Ratio',
    value: '1.42x',
    change: 3.1,
    trend: 'up',
    timeframe: 'Likuiditas Sangat Sehat',
    category: 'financial',
    iconName: 'Wallet'
  }
];

export const PATIENT_VISIT_SERIES: PatientVisitData[] = [
  { time: '07:00', rawatJalan: 60, rawatInap: 20, igd: 15, total: 95 },
  { time: '09:00', rawatJalan: 190, rawatInap: 35, igd: 22, total: 247 },
  { time: '11:00', rawatJalan: 260, rawatInap: 45, igd: 18, total: 323 },
  { time: '13:00', rawatJalan: 180, rawatInap: 30, igd: 25, total: 235 },
  { time: '15:00', rawatJalan: 110, rawatInap: 25, igd: 19, total: 154 },
  { time: '17:00', rawatJalan: 45, rawatInap: 15, igd: 12, total: 72 },
  { time: '19:00', rawatJalan: 20, rawatInap: 10, igd: 28, total: 58 }
];

export const REVENUE_MONTHLY_SERIES: RevenueData[] = [
  { month: 'Jan', pendapatanUmum: 3.2, klaimBPJS: 8.5, asuransiSwasta: 2.1, total: 13.8 },
  { month: 'Feb', pendapatanUmum: 3.5, klaimBPJS: 8.8, asuransiSwasta: 2.3, total: 14.6 },
  { month: 'Mar', pendapatanUmum: 3.8, klaimBPJS: 9.1, asuransiSwasta: 2.4, total: 15.3 },
  { month: 'Apr', pendapatanUmum: 3.4, klaimBPJS: 8.7, asuransiSwasta: 2.2, total: 14.3 },
  { month: 'Mei', pendapatanUmum: 4.1, klaimBPJS: 9.6, asuransiSwasta: 2.7, total: 16.4 },
  { month: 'Jun', pendapatanUmum: 3.9, klaimBPJS: 9.3, asuransiSwasta: 2.5, total: 15.7 },
  { month: 'Jul', pendapatanUmum: 4.3, klaimBPJS: 9.9, asuransiSwasta: 2.8, total: 17.0 }
];

export const BED_OCCUPANCY_DATA: BedOccupancyData[] = [
  { category: 'VVIP & VIP', total: 60, occupied: 48, available: 12, percentage: 80.0 },
  { category: 'Kelas 1', total: 120, occupied: 94, available: 26, percentage: 78.3 },
  { category: 'Kelas 2', total: 180, occupied: 142, available: 38, percentage: 78.8 },
  { category: 'Kelas 3', total: 210, occupied: 158, available: 52, percentage: 75.2 },
  { category: 'ICU / ICCU', total: 40, occupied: 32, available: 8, percentage: 80.0 },
  { category: 'NICU & PICU', total: 25, occupied: 18, available: 7, percentage: 72.0 },
  { category: 'Isolasi Medis', total: 15, occupied: 0, available: 15, percentage: 0 }
];

export const TOP_DIAGNOSIS_DATA: TopPenyakitData[] = [
  { code: 'I10', name: 'Essential (primary) hypertension', cases: 312, category: 'Kardiovaskular' },
  { code: 'E11', name: 'Non-insulin-dependent diabetes mellitus', cases: 284, category: 'Endokrin' },
  { code: 'J06.9', name: 'Acute upper respiratory infection', cases: 245, category: 'Respirasi' },
  { code: 'A91', name: 'Dengue haemorrhagic fever (DHF)', cases: 198, category: 'Infeksi' },
  { code: 'K29.7', name: 'Gastritis, unspecified', cases: 165, category: 'Pencernaan' },
  { code: 'I63.9', name: 'Cerebral infarction (Stroke Iskemik)', cases: 142, category: 'Neurologi' },
  { code: 'I21.9', name: 'Acute myocardial infarction (STEMI/NSTEMI)', cases: 98, category: 'Kardiovaskular' }
];

export const TOP_POLI_DATA: TopPoliData[] = [
  { name: 'Poli Penyakit Dalam', visits: 245, doctors: 12 },
  { name: 'Poli Anak & Tumbuh Kembang', visits: 182, doctors: 8 },
  { name: 'Poli Jantung & Pembuluh Darah', visits: 156, doctors: 7 },
  { name: 'Poli Kebidanan & Kandungan (Obgyn)', visits: 140, doctors: 9 },
  { name: 'Poli Saraf (Neurologi)', visits: 118, doctors: 6 },
  { name: 'Poli Bedah Sentral', visits: 94, doctors: 10 }
];

export const AI_MODULES: AIModule[] = [
  {
    id: 'ai-01',
    title: 'AI Clinical Assistant',
    description: 'Sistem pendukung keputusan klinis (CDSS) berbasis Gemini 3.6 Flash untuk analisis anamnesis, diferensial diagnosis, dan panduan terapi.',
    status: 'Ready',
    category: 'Clinical',
    icon: 'Stethoscope',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    id: 'ai-02',
    title: 'AI Voice Medical Dictation',
    description: 'Transkripsi rekam medis otomatis (Real-time Speech-to-Text SOAP) dalam Bahasa Indonesia dan terminologi medis latin.',
    status: 'Ready',
    category: 'Automation',
    icon: 'Mic',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    id: 'ai-03',
    title: 'AI OCR & Document Extractor',
    description: 'Pengenalan otomatis teks rujukan BPJS, hasil lab cetak, dan resep dokter untuk otomatisasi entri EMR.',
    status: 'Ready',
    category: 'Diagnostics',
    icon: 'FileText',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    id: 'ai-04',
    title: 'AI Radiology Chest & CT Imaging',
    description: 'Deteksi dini lesi paru, kardiomegali, fraktur, dan pendarahan intrakranial dengan prapembacaan AI dalam hitungan detik.',
    status: 'Running',
    category: 'Diagnostics',
    icon: 'Scan',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  },
  {
    id: 'ai-05',
    title: 'AI Laboratory Auto-Interpretation',
    description: 'Validasi otomatis sampel Darah Lengkap, Kimia Darah, dan Mikrobiologi dengan deteksi nilai kritis (Critical Alert).',
    status: 'Ready',
    category: 'Diagnostics',
    icon: 'FlaskConical',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    id: 'ai-06',
    title: 'AI Triage & Patient Chatbot',
    description: 'Asisten virtual 24/7 untuk triase awal pasien mandiri, reservasi jadwal dokter, dan FAQ asuransi.',
    status: 'Running',
    category: 'Clinical',
    icon: 'Bot',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20'
  },
  {
    id: 'ai-07',
    title: 'AI Predictive Hospital Operations',
    description: 'Prediksi lonjakan kunjungan IGD, waktu tinggal pasien (LOS), dan ketersediaan tempat tidur 7 hari ke depan.',
    status: 'Ready',
    category: 'Operations',
    icon: 'TrendingUp',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    id: 'ai-08',
    title: 'AI Pharmacy & Inventory Reordering',
    description: 'Prediksi tanggal kadaluarsa obat, penggunaan antibiotik rasional, dan restock otomatis sebelum habis.',
    status: 'Ready',
    category: 'Automation',
    icon: 'Pill',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    id: 'ai-09',
    title: 'AI Executive Briefing Assistant',
    description: 'Sintesis laporan harian direksi secara otomatis (Kinerja Keuangan, Klaim BPJS, Indikator Mutu RS, Alert Risiko).',
    status: 'Ready',
    category: 'Executive',
    icon: 'Briefcase',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
  },
  {
    id: 'ai-10',
    title: 'AI Maintenance & Asset Diagnostics',
    description: 'Monitoring telemetri alat kesehatan (MRI, CT-Scan, Ventilator) untuk pemeliharaan prediktif (Predictive Maintenance).',
    status: 'Coming Soon',
    category: 'Operations',
    icon: 'Wrench',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20'
  }
];

export const AI_PREDICTIONS: AIPrediction[] = [
  {
    id: 'p1',
    title: 'Prediksi Lonjakan Pasien IGD & ISPA (H+3)',
    category: 'Patient Surge',
    confidenceScore: 94,
    summary: 'Data cuaca dan tren 14 hari menunjukkan peningkatan indikasi Kasus ISPA & Influenza sebesar +28% dalam 72 jam mendatang.',
    recommendation: 'Jadwalkan 2 Dokter Tambahan & tingkatkan stok Salbutamol Nebulizer serta Oksigen Tabung di IGD.',
    severity: 'high',
    timeframe: '3 Hari Ke Depan'
  },
  {
    id: 'p2',
    title: 'Prediksi Bed Occupancy Rate (BOR) ICU',
    category: 'BOR Forecast',
    confidenceScore: 89,
    summary: 'ICU Utama diproyeksikan mencapai ketersediaan 0 bed (100% full) besok jam 14:00 berdasarkan 4 pasien post-op risiko tinggi.',
    recommendation: 'Siapkan 2 Bed Tambahan di HCU Gedung B dan percepat verifikasi kriteria pemindahan pasien stabil ke Ruang Inap.',
    severity: 'high',
    timeframe: 'Besok (24 Jam)'
  },
  {
    id: 'p3',
    title: 'Stok Obat Kritis: Parasetamol Infus & Insulin Glargine',
    category: 'Inventory',
    confidenceScore: 97,
    summary: 'Penggunaan Parasetamol Infus meningkat 40% akibat lonjakan demam. Sisa stok hanya mencukupi 1.8 hari.',
    recommendation: 'Picu pemesanan otomatis (Auto-PO) ke Distributor Kimia Farma sebesar 500 vial hari ini.',
    severity: 'medium',
    timeframe: '48 Jam'
  },
  {
    id: 'p4',
    title: 'Maintenance Alat Medis: CT-Scan 128 Slices (Gedung Radiologi)',
    category: 'Asset Maintenance',
    confidenceScore: 92,
    summary: 'Sensor tabung sinar-X mencatat getaran Anoda di atas batas toleransi normal. Risiko shut-down mendadak tinggi.',
    recommendation: 'Lakukan kalibrasi dan penggantian komponen preventif pada jam operasional terendah (Sabtu 22:00).',
    severity: 'low',
    timeframe: 'Akhir Pekan'
  }
];

export const BUILDINGS_STATUS: BuildingStatus[] = [
  {
    id: 'b1',
    name: 'Gedung Utama (Poliklinik & Adm)',
    code: 'GD-A',
    floors: 6,
    totalBeds: 0,
    occupiedBeds: 0,
    activeSurgeries: 0,
    status: 'Normal'
  },
  {
    id: 'b2',
    name: 'Gedung Rawat Inap A (VVIP / VIP / Kelas 1)',
    code: 'GD-B1',
    floors: 8,
    totalBeds: 180,
    occupiedBeds: 142,
    activeSurgeries: 0,
    status: 'Normal'
  },
  {
    id: 'b3',
    name: 'Gedung Rawat Inap B (Kelas 2 / Kelas 3)',
    code: 'GD-B2',
    floors: 8,
    totalBeds: 390,
    occupiedBeds: 300,
    activeSurgeries: 0,
    status: 'Normal'
  },
  {
    id: 'b4',
    name: 'Gedung Intensif (ICU / NICU / PICU)',
    code: 'GD-C',
    floors: 4,
    totalBeds: 65,
    occupiedBeds: 50,
    activeSurgeries: 0,
    status: 'High Occupancy'
  },
  {
    id: 'b5',
    name: 'Gedung Bedah & Central OR',
    code: 'GD-D',
    floors: 3,
    totalBeds: 15,
    occupiedBeds: 8,
    activeSurgeries: 5,
    status: 'Normal'
  },
  {
    id: 'b6',
    name: 'Gedung IGD & Trauma Center',
    code: 'GD-E',
    floors: 2,
    totalBeds: 40,
    occupiedBeds: 32,
    activeSurgeries: 1,
    status: 'Emergency Alert'
  }
];

export const OPERATING_ROOMS: OperatingRoomStatus[] = [
  { id: 'ok-1', name: 'Kamar Operasi 1 (Bedah Saraf)', procedure: 'Craniotomy Evakuasi EDH', doctor: 'dr. Ahmad Subagyo, Sp.BS', patientRM: 'RM-2026-8812', status: 'In Progress', startTime: '08:30', estimatedEndTime: '12:30' },
  { id: 'ok-2', name: 'Kamar Operasi 2 (Bedah Jantung)', procedure: 'CABG Off-Pump 3 Graft', doctor: 'dr. Maya Rosadi, Sp.BTKV', patientRM: 'RM-2026-9041', status: 'In Progress', startTime: '09:00', estimatedEndTime: '14:00' },
  { id: 'ok-3', name: 'Kamar Operasi 3 (Ortopedi)', procedure: 'Total Knee Replacement (TKR)', doctor: 'dr. Hendra Wijaya, Sp.OT', patientRM: 'RM-2026-7419', status: 'In Progress', startTime: '10:15', estimatedEndTime: '12:45' },
  { id: 'ok-4', name: 'Kamar Operasi 4 (Obgyn)', procedure: 'Sectio Caesarea Cito', doctor: 'dr. Siska Febriani, Sp.OG', patientRM: 'RM-2026-9932', status: 'Preparing', startTime: '11:30', estimatedEndTime: '12:30' },
  { id: 'ok-5', name: 'Kamar Operasi 5 (Bedah Umum)', procedure: 'Laparoscopic Cholecystectomy', doctor: 'dr. Rian Pramudya, Sp.B', patientRM: 'RM-2026-6120', status: 'Sterilizing', startTime: '13:00' },
  { id: 'ok-6', name: 'Kamar Operasi 6 (Mata / ENT)', procedure: 'Phacoemulsification Katarak', doctor: 'dr. Fitri Handayani, Sp.M', patientRM: 'RM-2026-5541', status: 'Available' }
];

export const AMBULANCES: AmbulanceStatus[] = [
  { id: 'amb-01', code: 'AMB-ALPHA-01 (Advanced Life Support)', driver: 'Budi Santoso', paramedic: 'Nrs. Tri Wahyuni', location: 'Jl. Sudirman KM 4', destination: 'IGD Utama RSUD', status: 'Dispatched', etaMinutes: 8 },
  { id: 'amb-02', code: 'AMB-ALPHA-02 (Trauma Response)', driver: 'Eko Prasetyo', paramedic: 'Nrs. Danang K', location: 'Gedung IGD', destination: 'Standby IGD', status: 'Available' },
  { id: 'amb-03', code: 'AMB-BETA-01 (Transport Pasien)', driver: 'Agus Gunawan', paramedic: 'Nrs. Ani Maryati', location: 'Puskesmas Gambir', destination: 'Rawat Inap Gedung B', status: 'On Scene', etaMinutes: 20 },
  { id: 'amb-04', code: 'AMB-BETA-02 (Neonatal Transport)', driver: 'Dedi Kurnia', paramedic: 'Bdn. Ratna Sari', location: 'RSIA Kartini', destination: 'NICU Gedung C', status: 'Returning', etaMinutes: 12 }
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Emergency Triage Red Code',
    message: 'Pasien Laki-laki 52th Trauma Kepala Akibat KLL tiba di IGD. Tim Neurotrauma diminta siapkan OK 1.',
    timestamp: '2 Menit Lalu',
    category: 'Emergency',
    read: false,
    priority: 'urgent'
  },
  {
    id: 'n2',
    title: 'AI Lab Critical Value Alert',
    message: 'Hasil Darah Pasien RM-2026-9041 (ICU Bed 4): Kalium Serum 6.8 mmol/L (Hyperkalemia Berat).',
    timestamp: '8 Menit Lalu',
    category: 'Laboratorium',
    read: false,
    priority: 'high'
  },
  {
    id: 'n3',
    title: 'Verifikasi V-Claim BPJS Selesai',
    message: 'Sistem AI BPJS V-Claim telah memverifikasi 142 klaim hari ini total Rp 1.48 Miliar tanpa kendala.',
    timestamp: '25 Menit Lalu',
    category: 'BPJS',
    read: true,
    priority: 'normal'
  },
  {
    id: 'n4',
    title: 'Alert Stok Obat Minimal',
    message: 'Stok Parasetamol Infus tersisa 85 vial (Batas minimal 100 vial). Auto-PO dikirim ke vendor.',
    timestamp: '1 Jam Lalu',
    category: 'Farmasi',
    read: true,
    priority: 'high'
  },
  {
    id: 'n5',
    title: 'Laporan Keuangan Harian Siap',
    message: 'Executive Financial Summary periode 02 Agustus 2026 telah dibuat oleh AI Executive Assistant.',
    timestamp: '2 Jam Lalu',
    category: 'Keuangan',
    read: true,
    priority: 'normal'
  }
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Operasi CABG Off-Pump (Jantung)', date: '2026-08-03', time: '08:00 - 13:00', category: 'Surgery', doctorOrHost: 'dr. Maya Rosadi, Sp.BTKV', location: 'Kamar Operasi 2', status: 'Scheduled' },
  { id: 'e2', title: 'Rapat Direksi & Audit Mutu RS', date: '2026-08-03', time: '09:30 - 11:30', category: 'Meeting', doctorOrHost: 'Direktur Utama RSUD', location: 'Ruang Rapat Senat Gedung Utama', status: 'Scheduled' },
  { id: 'e3', title: 'Visite Besar Intensive Care Unit (ICU)', date: '2026-08-03', time: '13:30 - 15:30', category: 'Doctor Schedule', doctorOrHost: 'Tim Dokter Spesialis Anestesi & KIC', location: 'Gedung C Floor 2', status: 'Scheduled' },
  { id: 'e4', title: 'Maintenance Tahunan MRI 3 Tesla', date: '2026-08-04', time: '20:00 - 02:00', category: 'Maintenance', doctorOrHost: 'Tim Teknisi Siemens Healthineers', location: 'Radiologi Gedung A', status: 'Scheduled' },
  { id: 'e5', title: 'Training Aplikasi Smart AI Platform untuk Perawat', date: '2026-08-05', time: '10:00 - 12:00', category: 'Training', doctorOrHost: 'IT Support & Clinical Specialist', location: 'Auditorium Lt. 5', status: 'Scheduled' }
];

export const AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'log-01', timestamp: '2026-08-02 22:35:12', userName: 'dr. Ahmad Subagyo, Sp.BS', role: 'Dokter Spesialis', action: 'Input Rekam Medis EMR & Anamnesis AI Assisted', module: 'Medical Record', ipAddress: '192.168.10.45', device: 'iPad Pro Hospital Managed', severity: 'Info' },
  { id: 'log-02', timestamp: '2026-08-02 22:30:04', userName: 'Nrs. Tri Wahyuni', role: 'Perawat', action: 'Verifikasi Triage IGD & Panggilan Emergency Code Red', module: 'IGD Center', ipAddress: '192.168.12.18', device: 'Workstation IGD 02', severity: 'Warning' },
  { id: 'log-03', timestamp: '2026-08-02 22:15:40', userName: 'Drs. Hendri, M.M.', role: 'Keuangan', action: 'Submit Batch Klaim BPJS Kesehatan V-Claim 4.0', module: 'BPJS Center', ipAddress: '192.168.20.102', device: 'Windows Workstation Keuangan', severity: 'Info' },
  { id: 'log-04', timestamp: '2026-08-02 21:50:11', userName: 'Super Admin System', role: 'Super Admin', action: 'Konfigurasi RBAC Role Dokter Spesialis & Modul AI Radiology', module: 'Settings RBAC', ipAddress: '10.0.0.1', device: 'Secure Admin Portal', severity: 'Info' },
  { id: 'log-05', timestamp: '2026-08-02 21:10:05', userName: 'Apt. Rina Lestari, S.Farm', role: 'Farmasi', action: 'Auto-PO Reorder Parasetamol Infus Disetujui', module: 'Farmasi & Gudang', ipAddress: '192.168.15.88', device: 'Terminal Depo Farmasi', severity: 'Info' }
];

export const MASTER_DATA_SAMPLE: MasterDataItem[] = [
  { id: 'm1', code: 'POL-01', name: 'Poli Penyakit Dalam (Internal Medicine)', category: 'Poliklinik', status: 'Active', details: { penanggungJawab: 'dr. Budi Hartono, Sp.PD-KGEH', kuotaHarian: 150 } },
  { id: 'm2', code: 'POL-02', name: 'Poli Anak & Tumbuh Kembang (Pediatrics)', category: 'Poliklinik', status: 'Active', details: { penanggungJawab: 'dr. Anita Melati, Sp.A', kuotaHarian: 120 } },
  { id: 'm3', code: 'ICD-I10', name: 'Essential (Primary) Hypertension', category: 'ICD-10 Diagnosa', status: 'Active', details: { deskripsi: 'Tekanan darah tinggi esensial tanpa penyebab spesifik', klaimBPJS: 'Tercover Standard' } },
  { id: 'm4', code: 'ICD-E11', name: 'Non-insulin-dependent Diabetes Mellitus', category: 'ICD-10 Diagnosa', status: 'Active', details: { deskripsi: 'Diabetes Tipe 2 dengan kontrol gula darah', klaimBPJS: 'Tercover Kronis' } },
  { id: 'm5', code: 'DRG-001', name: 'Paracetamol Infusion 10mg/ml 100ml', category: 'Obat & Alkes', status: 'Active', details: { stok: 85, hargaJual: 65000, eKatalog: true } },
  { id: 'm6', code: 'SUP-01', name: 'PT Kimia Farma Trading & Distribution', category: 'Supplier & Vendor', status: 'Active', details: { kontak: '021-3840123', email: 'order@kimiafarma.co.id' } }
];

// ==========================================
// TAHAP 2 MOCK DATASETS
// ==========================================

import {
  Patient,
  Appointment,
  QueueItem,
  MedicalRecord,
  PatientTimelineEvent,
  ClinicalAlert,
  PatientAISummary
} from '../types';

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    norm: 'RM-2026-00812',
    nik: '3171011508820001',
    bpjsCardNo: '0001849201928',
    fullName: 'Ahmad Dahlan',
    nickname: 'Ahmad',
    birthPlace: 'Jakarta',
    birthDate: '1982-08-15',
    gender: 'Laki-laki',
    bloodType: 'O+',
    religion: 'Islam',
    maritalStatus: 'Menikah',
    occupation: 'PNS / BUMN',
    education: 'S1 Sarjana',
    address: 'Jl. Melati Indah No. 42 RT 05 RW 02',
    province: 'DKI Jakarta',
    city: 'Jakarta Selatan',
    district: 'Kebayoran Baru',
    subdistrict: 'Gandaria Utara',
    postalCode: '12140',
    phone: '081298765432',
    email: 'ahmad.dahlan@example.com',
    emergencyContact: {
      name: 'Siti Aminah',
      relationship: 'Istri',
      phone: '081311223344'
    },
    language: 'Bahasa Indonesia',
    nationality: 'WNI',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    status: 'Rawat Inap',
    registeredAt: '2026-08-01 09:15',
    category: 'Pasien BPJS',
    allergies: ['Penicillin', 'Seafood'],
    chronicConditions: ['Hipertensi Gr. 2', 'Diabetes Tipe 2']
  },
  {
    id: 'pat-002',
    norm: 'RM-2026-00941',
    nik: '3174024403900003',
    bpjsCardNo: '0002938401923',
    insuranceNo: 'ALLIANZ-882910',
    insuranceProvider: 'Allianz Health',
    fullName: 'Siti Rahmawati',
    nickname: 'Siti',
    birthPlace: 'Bandung',
    birthDate: '1990-03-24',
    gender: 'Perempuan',
    bloodType: 'A+',
    religion: 'Islam',
    maritalStatus: 'Menikah',
    occupation: 'Karyawan Swasta',
    education: 'S1 Sarjana',
    address: 'Jl. Cempaka Putih Raya No. 18',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    district: 'Cempaka Putih',
    subdistrict: 'Cempaka Putih Barat',
    postalCode: '10520',
    phone: '081765432109',
    email: 'siti.rahma@example.com',
    emergencyContact: {
      name: 'Budi Santoso',
      relationship: 'Suami',
      phone: '081899887766'
    },
    language: 'Bahasa Indonesia',
    nationality: 'WNI',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    status: 'Rawat Inap',
    registeredAt: '2026-08-02 11:30',
    category: 'Pasien Asuransi',
    allergies: ['Sulfa Drugs'],
    chronicConditions: ['Asthma Bronchiale']
  },
  {
    id: 'pat-003',
    norm: 'RM-2026-01005',
    nik: '3201021210980005',
    fullName: 'Dr. Hendra Wijaya',
    nickname: 'Hendra',
    birthPlace: 'Surabaya',
    birthDate: '1978-10-12',
    gender: 'Laki-laki',
    bloodType: 'B+',
    religion: 'Kristen',
    maritalStatus: 'Menikah',
    occupation: 'Dosen / Pengajar',
    education: 'S3 Doktor',
    address: 'Komp. Dosen UI No. 7, Beji',
    province: 'Jawa Barat',
    city: 'Depok',
    district: 'Beji',
    subdistrict: 'Pondok Cina',
    postalCode: '16424',
    phone: '081122334455',
    email: 'hendra.wijaya@example.com',
    emergencyContact: {
      name: 'Maria Wijaya',
      relationship: 'Istri',
      phone: '081199887711'
    },
    language: 'Bahasa Indonesia & English',
    nationality: 'WNI',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    status: 'Rawat Jalan',
    registeredAt: '2026-08-02 14:00',
    category: 'Pasien Umum',
    allergies: ['NSAIDs / Ibuprofen'],
    chronicConditions: ['Dislipidemia']
  },
  {
    id: 'pat-004',
    norm: 'RM-2026-01120',
    nik: '3172035506010002',
    bpjsCardNo: '0003881029384',
    fullName: 'Dewi Lestari',
    nickname: 'Dewi',
    birthPlace: 'Semarang',
    birthDate: '2001-06-15',
    gender: 'Perempuan',
    bloodType: 'AB+',
    religion: 'Islam',
    maritalStatus: 'Belum Menikah',
    occupation: 'Mahasiswa',
    education: 'D3 Diploma',
    address: 'Jl. Salemba Tengah No. 89',
    province: 'DKI Jakarta',
    city: 'Jakarta Pusat',
    district: 'Senen',
    subdistrict: 'Paseban',
    postalCode: '10440',
    phone: '085712345678',
    email: 'dewi.lestari@example.com',
    emergencyContact: {
      name: 'Sri Suhartini',
      relationship: 'Ibu Kandung',
      phone: '085799001122'
    },
    language: 'Bahasa Indonesia',
    nationality: 'WNI',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    status: 'Aktif',
    registeredAt: '2026-08-02 15:45',
    category: 'Pasien BPJS',
    allergies: [],
    chronicConditions: []
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    appointmentCode: 'APT-20260803-001',
    patientId: 'pat-001',
    patientName: 'Ahmad Dahlan',
    norm: 'RM-2026-00812',
    nik: '3171011508820001',
    phone: '081298765432',
    polyName: 'Poli Penyakit Dalam',
    doctorId: 'doc-001',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    date: '2026-08-03',
    timeSlot: '09:00 - 09:30',
    serviceType: 'BPJS',
    status: 'Confirmed',
    queueNumber: 'A-012',
    estimatedWaitMinutes: 15,
    aiRecommendationReason: 'Rekomendasi AI: Jadwal kontrol tepat 14 hari pasca rawat inap, slot pagi untuk menghindari kepadatan Poli.',
    notes: 'Kontrol evaluasi hipertensi & cek HbA1c.'
  },
  {
    id: 'apt-002',
    appointmentCode: 'APT-20260803-002',
    patientId: 'pat-002',
    patientName: 'Siti Rahmawati',
    norm: 'RM-2026-00941',
    nik: '3174024403900003',
    phone: '081765432109',
    polyName: 'Poli Jantung & Pembuluh Darah',
    doctorId: 'doc-002',
    doctorName: 'dr. Maya Rosadi, Sp.BTKV',
    date: '2026-08-03',
    timeSlot: '10:00 - 10:30',
    serviceType: 'Asuransi',
    status: 'Confirmed',
    queueNumber: 'B-008',
    estimatedWaitMinutes: 20,
    aiRecommendationReason: 'Rekomendasi AI: Pemeriksaan Echocardiography berkala pasca tindakan balon kardiologi.',
    notes: 'Membawa hasil EKG minggu lalu.'
  },
  {
    id: 'apt-003',
    appointmentCode: 'APT-20260803-003',
    patientId: 'pat-003',
    patientName: 'Dr. Hendra Wijaya',
    norm: 'RM-2026-01005',
    nik: '3201021210980005',
    phone: '081122334455',
    polyName: 'Poli Bedah Saraf',
    doctorId: 'doc-003',
    doctorName: 'dr. Ahmad Subagyo, Sp.BS',
    date: '2026-08-03',
    timeSlot: '11:00 - 11:30',
    serviceType: 'Umum',
    status: 'Confirmed',
    queueNumber: 'BS-003',
    estimatedWaitMinutes: 10,
    aiRecommendationReason: 'Rekomendasi AI: Evaluasi keluhan Nyeri Punggung Bawah (LBP) dengan rujukan MRI Lumbal.',
    notes: 'Konsultasi hasil MRI Lumbal 3 Tesla.'
  }
];

export const MOCK_QUEUES: QueueItem[] = [
  {
    id: 'q-001',
    queueNumber: 'A-012',
    patientId: 'pat-001',
    patientName: 'Ahmad Dahlan',
    norm: 'RM-2026-00812',
    polyName: 'Poli Penyakit Dalam',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    category: 'Rawat Jalan',
    serviceType: 'BPJS',
    status: 'Calling',
    calledAt: '10:15:30',
    estimatedWaitMinutes: 0,
    priorityScore: 3,
    aiDelayAlert: false
  },
  {
    id: 'q-002',
    queueNumber: 'A-013',
    patientId: 'pat-004',
    patientName: 'Dewi Lestari',
    norm: 'RM-2026-01120',
    polyName: 'Poli Penyakit Dalam',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    category: 'Rawat Jalan',
    serviceType: 'BPJS',
    status: 'Waiting',
    estimatedWaitMinutes: 12,
    priorityScore: 2,
    aiDelayAlert: false
  },
  {
    id: 'q-003',
    queueNumber: 'IGD-005',
    patientId: 'pat-002',
    patientName: 'Siti Rahmawati',
    norm: 'RM-2026-00941',
    polyName: 'IGD Utama Triage Merah',
    doctorName: 'Tim Medis Emergency',
    category: 'IGD',
    serviceType: 'Emergency Priority',
    status: 'In Service',
    calledAt: '10:05:10',
    estimatedWaitMinutes: 0,
    priorityScore: 9,
    aiDelayAlert: true,
    aiDelayReason: 'Memerlukan resusitasi cairan cepat & bedah C-section cito.'
  },
  {
    id: 'q-004',
    queueNumber: 'LAB-028',
    patientId: 'pat-003',
    patientName: 'Dr. Hendra Wijaya',
    norm: 'RM-2026-01005',
    polyName: 'Laboratorium Sentral',
    doctorName: 'Petugas Analis Lab 2',
    category: 'Laboratorium',
    serviceType: 'Umum',
    status: 'Waiting',
    estimatedWaitMinutes: 8,
    priorityScore: 1,
    aiDelayAlert: false
  },
  {
    id: 'q-005',
    queueNumber: 'FAR-045',
    patientId: 'pat-001',
    patientName: 'Ahmad Dahlan',
    norm: 'RM-2026-00812',
    polyName: 'Depo Farmasi Rawat Jalan',
    doctorName: 'Apt. Rina Lestari, S.Farm',
    category: 'Farmasi',
    serviceType: 'BPJS',
    status: 'Waiting',
    estimatedWaitMinutes: 18,
    priorityScore: 2,
    aiDelayAlert: true,
    aiDelayReason: 'Sedang dilakukan racikan puyer khsusus & verifikasi interaksi obat oleh AI.'
  }
];

export const MOCK_PATIENT_TIMELINES: PatientTimelineEvent[] = [
  {
    id: 'tl-1',
    patientId: 'pat-001',
    timestamp: '2026-08-01 09:15',
    category: 'Registrasi',
    title: 'Registrasi Pasien BPJS Rawat Jalan',
    description: 'Pendaftaran loket via Anjungan Mandiri QR BPJS V-Claim 4.0',
    doctorOrOfficer: 'Petugas Pendaftaran Loket 2',
    location: 'Gedung A Utama Lt. 1',
    status: 'Completed'
  },
  {
    id: 'tl-2',
    patientId: 'pat-001',
    timestamp: '2026-08-01 09:45',
    category: 'Poli',
    title: 'Pemeriksaan Poli Penyakit Dalam',
    description: 'Anamnesis & Vital Sign TD: 155/95 mmHg, Nadi: 92x/m. Diagnosa Hipertensi & DM Tipe 2.',
    doctorOrOfficer: 'dr. Budi Hartono, Sp.PD-KGEH',
    location: 'Poliklinik Penyakit Dalam Room 102',
    status: 'Completed'
  },
  {
    id: 'tl-3',
    patientId: 'pat-001',
    timestamp: '2026-08-01 10:30',
    category: 'Lab',
    title: 'Pemeriksaan Darah Lengkap & HbA1c',
    description: 'Pengambilan sampel darah vena di Laboratorium Sentral',
    doctorOrOfficer: 'Tim Analis Lab Sentral',
    location: 'Lab Gedung B Lt. 1',
    status: 'Completed'
  },
  {
    id: 'tl-4',
    patientId: 'pat-001',
    timestamp: '2026-08-01 11:30',
    category: 'Farmasi',
    title: 'Pengambilan Obat Resep BPJS Kronis',
    description: 'Amlodipine 10mg, Metformin 500mg, Candesartan 16mg',
    doctorOrOfficer: 'Apt. Rina Lestari, S.Farm',
    location: 'Depo Farmasi Rawat Jalan',
    status: 'Completed'
  }
];

export const MOCK_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'mr-001',
    patientId: 'pat-001',
    visitDate: '2026-08-01 09:45',
    polyName: 'Poli Penyakit Dalam',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    visitType: 'Rawat Jalan',
    soap: {
      id: 'soap-101',
      medicalRecordId: 'mr-001',
      patientId: 'pat-001',
      doctorId: 'doc-001',
      doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
      timestamp: '2026-08-01 10:00',
      subjective: 'Pasien mengeluhkan pusing tengkuk berat sejak 2 hari, lemas, dan sering haus malam hari.',
      objective: 'TD 155/95 mmHg, HR 92x/m, RR 20x/m, Suhu 36.8C, SpO2 98%, BMI 27.4 (Overweight). Ekstremitas edema (-).',
      assessment: '1. Essential Primary Hypertension (ICD-10: I10)\n2. Non-insulin-dependent Diabetes Mellitus (ICD-10: E11)',
      plan: '1. Amlodipine 10mg 1x1 tab pagi\n2. Metformin 500mg 2x1 tab d.c.\n3. Cek HbA1c & Profil Lipid rutin\n4. Edukasi diet rendah garam & kalori',
      version: 1
    },
    primaryICD10: { code: 'I10', name: 'Essential (primary) hypertension' },
    secondaryICD10: [{ code: 'E11', name: 'Non-insulin-dependent diabetes mellitus' }],
    vitalSigns: {
      id: 'vs-101',
      patientId: 'pat-001',
      timestamp: '2026-08-01 09:30',
      systolic: 155,
      diastolic: 95,
      heartRate: 92,
      respiratoryRate: 20,
      temperature: 36.8,
      spO2: 98,
      weightKg: 78,
      heightCm: 168,
      bmi: 27.6,
      painScore: 3,
      gcsScore: 15
    },
    prescriptions: [
      { drugName: 'Amlodipine 10mg Tab', dosage: '10mg', frequency: '1x Sehari Pagi', duration: '30 Hari' },
      { drugName: 'Metformin 500mg Tab', dosage: '500mg', frequency: '2x Sehari Sesudah Makan', duration: '30 Hari' },
      { drugName: 'Candesartan 16mg Tab', dosage: '16mg', frequency: '1x Sehari Malam', duration: '30 Hari' }
    ],
    labOrders: [
      { testName: 'HbA1c Darah', result: '7.8% (Tinggi)', status: 'Done' },
      { testName: 'Glukosa Darah Puasa', result: '142 mg/dL', status: 'Done' }
    ],
    status: 'Closed'
  }
];

export const MOCK_CLINICAL_ALERTS: ClinicalAlert[] = [
  {
    id: 'ca-1',
    patientId: 'pat-001',
    alertType: 'Alergi',
    severity: 'Critical',
    description: 'Alergi Berat Penicillin (Anaphylactic Risk). DILARANG berikan golongan Penisilin & Sefalosporin Gen-1!',
    detectedAt: '2026-08-01'
  },
  {
    id: 'ca-2',
    patientId: 'pat-001',
    alertType: 'Hipertensi',
    severity: 'High',
    description: 'Hipertensi Derajat 2 Uncontrolled. Waspadai Krisis Hipertensi jika TD > 180/110 mmHg.',
    detectedAt: '2026-08-01'
  },
  {
    id: 'ca-3',
    patientId: 'pat-002',
    alertType: 'Risiko Jatuh',
    severity: 'Moderate',
    description: 'Skor Morse Fall Scale: 45 (Risiko Jatuh Sedang). Pasang Gelang Kuning & Pagar Pengaman Bed Inap.',
    detectedAt: '2026-08-02'
  }
];

export const MOCK_PATIENT_AI_SUMMARIES: PatientAISummary[] = [
  {
    patientId: 'pat-001',
    summaryText: 'Pasien Laki-laki 44th dengan riwayat Komorbiditas Kronis Hipertensi Grade 2 & Diabetes Melitus Tipe 2 terisi rutin dalam 6 bulan terakhir. Terdapat Alergi Kritis Golongan Penicillin. Kondisi hemodinamik saat ini stabil dengan terapi kontinyu Amlodipine & Metformin.',
    chronicDiseaseHistory: ['Hipertensi Primary (I10)', 'Diabetes Mellitus Type 2 (E11)'],
    drugAllergies: ['Penicillin', 'Amoxicillin', 'Seafood'],
    surgicalHistory: ['Appendectomy (2018)'],
    currentHealthStatus: 'Stabil, dalam terapi jalan rutin',
    highRiskFactors: ['Anaphylaxis Risk Penicillin', 'Cardiovascular Event Risk'],
    aiGeneratedAt: '2026-08-02 22:00'
  }
];

// ==========================================
// TAHAP 3: CLINICAL CARE SYSTEM MOCK DATA
// ==========================================

export const MOCK_EMERGENCY_VISITS: EmergencyVisit[] = [
  {
    id: 'emg-001',
    patientId: 'pat-003',
    patientName: 'Bambang Soeprapto',
    norm: 'RM-2026-003',
    arrivalMethod: 'Ambulans',
    arrivalTime: '22:15',
    triageCategory: 'Merah',
    triageNurse: 'Ns. Ratna Sari, S.Kep',
    chiefComplaint: 'Nyeri dada hebat menjalar ke lengan kiri, sesak napas berat, akral dingin',
    gcsScore: 14,
    ewsScore: 7,
    vitalSigns: {
      id: 'vs-emg1',
      patientId: 'pat-003',
      timestamp: '22:15',
      systolic: 90,
      diastolic: 60,
      heartRate: 122,
      respiratoryRate: 28,
      temperature: 36.2,
      spO2: 88,
      weightKg: 75,
      heightCm: 170,
      bmi: 26,
      painScore: 9,
      gcsScore: 14
    },
    assignedDoctor: 'dr. Hendra Setiawan, Sp.JP(K)',
    status: 'Treatment',
    bedNumber: 'IGD Resusitasi Bed 1',
    aiPriorityReason: 'Critical STEMI Alert: ST-Elevation & EWS 7. Memerlukan tindakan heparinisasi & katerisasi mendesak.'
  },
  {
    id: 'emg-002',
    patientId: 'pat-002',
    patientName: 'Siti Aminah',
    norm: 'RM-2026-002',
    arrivalMethod: 'Datang Sendiri',
    arrivalTime: '22:40',
    triageCategory: 'Kuning',
    triageNurse: 'Ns. Dewi Anggraini, S.Kep',
    chiefComplaint: 'Demam tinggi 39.2 C sejak 3 hari, lemas hebat, trombosit memburuk',
    gcsScore: 15,
    ewsScore: 4,
    vitalSigns: {
      id: 'vs-emg2',
      patientId: 'pat-002',
      timestamp: '22:40',
      systolic: 110,
      diastolic: 70,
      heartRate: 98,
      respiratoryRate: 22,
      temperature: 39.2,
      spO2: 97,
      weightKg: 55,
      heightCm: 158,
      bmi: 22,
      painScore: 4,
      gcsScore: 15
    },
    assignedDoctor: 'dr. Budi Hartono, Sp.PD',
    status: 'Observation',
    bedNumber: 'IGD Non-Bedah Bed 4',
    aiPriorityReason: 'Suspected Dengue Shock Warning: Pemantauan cairan intensif & cek Hb/Ht/Plt berkala.'
  },
  {
    id: 'emg-003',
    patientId: 'pat-005',
    patientName: 'Rudi Hermawan',
    norm: 'RM-2026-005',
    arrivalMethod: 'Polisi / Pengantar',
    arrivalTime: '23:00',
    triageCategory: 'Kuning',
    triageNurse: 'Ns. Ahmad Fauzi, S.Kep',
    chiefComplaint: 'Luka robek terbuka paha kanan akibat kecelakaan kerja, perdarahan terkontrol',
    gcsScore: 15,
    ewsScore: 2,
    vitalSigns: {
      id: 'vs-emg3',
      patientId: 'pat-005',
      timestamp: '23:00',
      systolic: 125,
      diastolic: 80,
      heartRate: 88,
      respiratoryRate: 18,
      temperature: 36.6,
      spO2: 99,
      weightKg: 68,
      heightCm: 172,
      bmi: 23,
      painScore: 6,
      gcsScore: 15
    },
    assignedDoctor: 'dr. Rian Pradipta, Sp.OT',
    status: 'Treatment',
    bedNumber: 'IGD Bedah Bed 2',
    aiPriorityReason: 'Trauma Sedang: Perlu hecting, profilaksis tetanus & x-ray femur kanan.'
  }
];

export const MOCK_BEDS: BedItem[] = [
  { id: 'bed-101a', wardName: 'Ruang Mawar 101-A', wardClass: 'VIP', status: 'Terisi', currentPatientId: 'pat-001', currentPatientName: 'Ahmad Dahlan', norm: 'RM-2026-001', doctorInCharge: 'dr. Budi Hartono, Sp.PD', nurseInCharge: 'Ns. Maya Kusuma', admissionDate: '2026-07-30', estimatedDischargeDate: '2026-08-04', dailyRate: 1500000 },
  { id: 'bed-101b', wardName: 'Ruang Mawar 101-B', wardClass: 'VIP', status: 'Kosong', dailyRate: 1500000 },
  { id: 'bed-201a', wardName: 'Ruang Melati 201-A', wardClass: 'Kelas 1', status: 'Cleaning', dailyRate: 800000 },
  { id: 'bed-201b', wardName: 'Ruang Melati 201-B', wardClass: 'Kelas 1', status: 'Terisi', currentPatientId: 'pat-004', currentPatientName: 'Dewi Lestari', norm: 'RM-2026-004', doctorInCharge: 'dr. Maya Indah, Sp.A', nurseInCharge: 'Ns. Rina Wijaya', admissionDate: '2026-08-01', estimatedDischargeDate: '2026-08-05', dailyRate: 800000 },
  { id: 'bed-301a', wardName: 'Ruang Anggrek 301-A', wardClass: 'VVIP', status: 'Reserved', dailyRate: 2500000 },
  { id: 'bed-icu01', wardName: 'ICU Isolasi Bed 01', wardClass: 'ICU', status: 'Terisi', currentPatientId: 'pat-003', currentPatientName: 'Bambang Soeprapto', norm: 'RM-2026-003', doctorInCharge: 'dr. Hendra Setiawan, Sp.JP', nurseInCharge: 'Ns. Tri Ananda', admissionDate: '2026-08-02', estimatedDischargeDate: '2026-08-10', dailyRate: 3500000 }
];

export const MOCK_WARD_METRICS: WardMetrics = {
  totalBeds: 650,
  occupiedBeds: 492,
  availableBeds: 158,
  borPercent: 75.7,
  losDays: 4.2,
  toiDays: 1.1,
  btoTimes: 5.8,
  aiPrediction: 'Prediksi AI: Puncak permintaan bed Rawat Inap Kelas 1 terjadi dalam 48 jam kedepan. Disarankan percepat discharge planning untuk 14 pasien teridentifikasi stabil.'
};

export const MOCK_ICU_MONITORS: ICUMonitorItem[] = [
  {
    id: 'icu-1',
    bedName: 'ICU-Bed 01',
    patientName: 'Bambang Soeprapto',
    norm: 'RM-2026-003',
    age: 58,
    diagnosis: 'Acute Coronary Syndrome STEMI Anterior & Cardiogenic Shock',
    heartRate: 118,
    bpSystolic: 88,
    bpDiastolic: 58,
    respiratoryRate: 24,
    temperature: 36.4,
    spO2: 93,
    ventilatorMode: 'SIMV (FiO2 50%)',
    infusionRateMlHr: 12.5,
    urineOutputMlHr: 25,
    gcsScore: 11,
    ewsScore: 8,
    aiAlerts: {
      sepsisRisk: 'Moderate',
      shockRisk: 'Critical',
      respiratoryFailureRisk: 'High',
      cardiacArrestRisk: 'High'
    }
  },
  {
    id: 'icu-2',
    bedName: 'ICU-Bed 02',
    patientName: 'Haryanto Tanujaya',
    norm: 'RM-2026-088',
    age: 64,
    diagnosis: 'Severe Sepsis ec Pneumonia Bilateral & ARDS',
    heartRate: 126,
    bpSystolic: 92,
    bpDiastolic: 60,
    respiratoryRate: 28,
    temperature: 38.9,
    spO2: 91,
    ventilatorMode: 'PC-V (FiO2 65%)',
    infusionRateMlHr: 20.0,
    urineOutputMlHr: 30,
    gcsScore: 9,
    ewsScore: 9,
    aiAlerts: {
      sepsisRisk: 'Critical',
      shockRisk: 'High',
      respiratoryFailureRisk: 'Critical',
      cardiacArrestRisk: 'Moderate'
    }
  }
];

export const MOCK_OPERATION_SCHEDULES: OperationSchedule[] = [
  {
    id: 'ok-01',
    operatingRoomName: 'Kamar Operasi 1 (Mayor)',
    patientId: 'pat-003',
    patientName: 'Bambang Soeprapto',
    norm: 'RM-2026-003',
    procedureName: 'Percutaneous Coronary Intervention (PCI) Primary / Pasang Stent Jantung',
    type: 'Emergency',
    surgeonName: 'dr. Hendra Setiawan, Sp.JP(K)',
    anesthesiologistName: 'dr. Lukman Hakim, Sp.An-KIC',
    scrubNurseName: 'Ns. Dian Pertiwi, S.Kep',
    scheduledTime: '08:00',
    estimatedDurationMins: 120,
    actualStage: 'Operasi',
    whoChecklist: {
      signInDone: true,
      timeOutDone: true,
      signOutDone: false
    },
    aiDelayPredictionMins: 0
  },
  {
    id: 'ok-02',
    operatingRoomName: 'Kamar Operasi 3 (Orthopedi)',
    patientId: 'pat-005',
    patientName: 'Rudi Hermawan',
    norm: 'RM-2026-005',
    procedureName: 'ORIF Femur Dekstra & Debridement Luka',
    type: 'Elective',
    surgeonName: 'dr. Rian Pradipta, Sp.OT',
    anesthesiologistName: 'dr. Siti Rahma, Sp.An',
    scrubNurseName: 'Ns. Joko Susilo, S.Kep',
    scheduledTime: '11:00',
    estimatedDurationMins: 180,
    actualStage: 'Pre-op',
    whoChecklist: {
      signInDone: true,
      timeOutDone: false,
      signOutDone: false
    },
    aiDelayPredictionMins: 15
  }
];

export const MOCK_NURSE_TASKS: NurseTask[] = [
  { id: 'nt-1', patientId: 'pat-001', patientName: 'Ahmad Dahlan', bedName: 'Mawar 101-A', taskType: 'Pemberian Obat', description: 'Injeksi Ceftriaxone 1gr IV & Amlodipine 10mg Oral', scheduledTime: '08:00', status: 'Completed', nurseName: 'Ns. Maya Kusuma' },
  { id: 'nt-2', patientId: 'pat-001', patientName: 'Ahmad Dahlan', bedName: 'Mawar 101-A', taskType: 'Vital Sign', description: 'Cek TTV berkala, Suhu & Tekanan Darah pasca injeksi', scheduledTime: '12:00', status: 'Pending' },
  { id: 'nt-3', patientId: 'pat-004', patientName: 'Dewi Lestari', bedName: 'Melati 201-B', taskType: 'Infus', description: 'Ganti Cairan Infus Ringer Laktat 500ml 20 tpm', scheduledTime: '10:30', status: 'Completed', nurseName: 'Ns. Rina Wijaya' },
  { id: 'nt-4', patientId: 'pat-003', patientName: 'Bambang Soeprapto', bedName: 'ICU-01', taskType: 'Perawatan Luka', description: 'Rawat luka tempat kanulasi arteri femoralis pasca PCI', scheduledTime: '14:00', status: 'Pending' }
];

export const MOCK_CDSS_RECOMMENDATIONS: CDSSRecommendation[] = [
  {
    id: 'cdss-1',
    patientId: 'pat-001',
    chiefComplaint: 'Sakit kepala berdenyut hebat di tengkuk, mata kabur ringan, riwayat TD 160/100',
    suspectedDiagnoses: [
      { disease: 'Essential Primary Hypertension Grade 2', probability: 88, icd10: 'I10' },
      { disease: 'Hypertensive Encephalopathy Early Stage', probability: 35, icd10: 'I67.4' },
      { disease: 'Tension-type Headache', probability: 15, icd10: 'G44.2' }
    ],
    recommendedTests: ['Profil Lipid Complete', 'Serum Creatinine & Ureum', 'ECG 12-Lead', 'Funduskopi Mata'],
    clinicalGuidelines: [
      'PERKI Guidelines 2024: Kombinasi CCB (Amlodipine) + ARB (Candesartan) untuk kontrol TD sasaran < 130/80 mmHg.',
      'ESC/EHS Hypertension Standard: Evaluasi kerusakan organ target (MOD).'
    ],
    drugInteractions: [
      { drug1: 'Amlodipine', drug2: 'Simvastatin 40mg', severity: 'Moderate', warning: 'Amlodipine meningkatkan paparan Simvastatin. Batasi dosis Simvastatin maks 20mg/hari untuk cegah rhabdomyolysis.' }
    ],
    criticalWarnings: ['Alergi Kritis Penicillin terdeteksi pada profil pasien. Jangan resepkan antibiotik Beta-Laktam!']
  }
];

export const MOCK_PRESCRIPTION_ORDERS: PrescriptionOrder[] = [
  {
    id: 'rx-101',
    patientId: 'pat-001',
    patientName: 'Ahmad Dahlan',
    doctorId: 'doc-1',
    doctorName: 'dr. Budi Hartono, Sp.PD-KGEH',
    orderDate: '2026-08-02',
    items: [
      { drugName: 'Amlodipine 10mg Tab', dosage: '10mg', frequency: '1x1 Pagi', durationDays: 30, route: 'Oral', instructions: 'Sesudah makan' },
      { drugName: 'Candesartan 16mg Tab', dosage: '16mg', frequency: '1x1 Malam', durationDays: 30, route: 'Oral', instructions: 'Sebelum tidur' },
      { drugName: 'Metformin 500mg Tab', dosage: '500mg', frequency: '2x1', durationDays: 30, route: 'Oral', instructions: 'Bersama suapan pertama' }
    ],
    status: 'Pending',
    aiCheckWarning: 'Tidak ada interaksi berbahaya terdeteksi. Dosis sesuai standar komorbiditas HT + DM.'
  }
];

export const MOCK_CONSENTS: DigitalConsent[] = [
  { id: 'cst-1', patientId: 'pat-003', patientName: 'Bambang Soeprapto', consentType: 'Operasi / Tindakan', doctorName: 'dr. Hendra Setiawan, Sp.JP(K)', dateSigned: '2026-08-02', qrVerified: true, status: 'Disetujui' },
  { id: 'cst-2', patientId: 'pat-005', patientName: 'Rudi Hermawan', consentType: 'Anestesi', doctorName: 'dr. Siti Rahma, Sp.An', dateSigned: '2026-08-02', qrVerified: true, status: 'Disetujui' }
];

export const MOCK_DISCHARGE_SUMMARIES: DischargeSummaryRecord[] = [
  {
    id: 'ds-101',
    patientId: 'pat-001',
    patientName: 'Ahmad Dahlan',
    norm: 'RM-2026-001',
    admissionDate: '2026-07-30',
    dischargeDate: '2026-08-03',
    primaryDiagnosis: 'Essential (primary) hypertension Grade 2',
    icd10Code: 'I10',
    dischargeMedications: ['Amlodipine 10mg 1x1 Pagi', 'Candesartan 16mg 1x1 Malam', 'Metformin 500mg 2x1 d.c.'],
    followUpInstructions: 'Kontrol rutin Poli Penyakit Dalam 1 minggu lagi. Bawa catatan tekanan darah harian. Hindari konsumsi asin.',
    controlDate: '2026-08-10',
    doctorSignature: 'dr. Budi Hartono, Sp.PD-KGEH',
    aiDraftGenerated: true
  }
];

// ==========================================
// TAHAP 4: MEDICAL SUPPORT SYSTEM MOCK DATA
// ==========================================

export const MOCK_LAB_ORDERS: LabOrder[] = [
  {
    id: 'lab-2026-001',
    patientId: 'pat-001',
    patientName: 'Ahmad Dahlan',
    norm: 'RM-2026-001',
    orderDoctor: 'dr. Budi Hartono, Sp.PD-KGEH',
    category: 'Clinical Chemistry',
    specimenBarcode: 'LAB-992018',
    orderDate: '2026-08-02 09:15',
    status: 'Validated',
    criticalAlert: true,
    analyzerMachine: 'Cobas c501 Chemistry Analyzer',
    results: [
      { testCode: 'GLU-F', testName: 'Glukosa Darah Puasa', resultValue: '185', unit: 'mg/dL', referenceRange: '70 - 110', flag: 'High' },
      { testCode: 'HBA1C', testName: 'HbA1c Glycated Hemoglobin', resultValue: '8.4', unit: '%', referenceRange: '< 5.7', flag: 'High' },
      { testCode: 'CREAT', testName: 'Serum Creatinine', resultValue: '2.1', unit: 'mg/dL', referenceRange: '0.7 - 1.3', flag: 'Critical' },
      { testCode: 'UREUM', testName: 'Ureum Darah', resultValue: '68', unit: 'mg/dL', referenceRange: '15 - 45', flag: 'High' },
      { testCode: 'EGFR', testName: 'eGFR Estimated GFR', resultValue: '34', unit: 'mL/min/1.73m2', referenceRange: '> 90', flag: 'Low' }
    ],
    aiInterpretation: {
      abnormalSummary: 'Peningkatan signifikan Glukosa Puasa (185 mg/dL), HbA1c (8.4%), dan Creatinine (2.1 mg/dL) dengan penurunan eGFR (34 mL/min).',
      diseaseRiskScore: 'Tinggi (Diabetic Nephropathy Stage 3)',
      clinicalCorrelation: 'Pasien mengalami nefropati diabetik akut/kronik sekunder akibat kontrol glikemik yang buruk.',
      recommendedFollowUp: 'Konsul Sp.PD-KGH (Ginjal Hipertensi), evaluasi Rasio Albumin-Kreatinin Urine (UACR), dan penyesuaian dosis obat antidiabetik renally adjusted.'
    }
  },
  {
    id: 'lab-2026-002',
    patientId: 'pat-003',
    patientName: 'Bambang Soeprapto',
    norm: 'RM-2026-003',
    orderDoctor: 'dr. Hendra Setiawan, Sp.JP(K)',
    category: 'Hematology',
    specimenBarcode: 'LAB-992019',
    orderDate: '2026-08-02 10:00',
    status: 'In Laboratory',
    criticalAlert: false,
    analyzerMachine: 'Sysmex XN-1000 Hematology',
    results: [
      { testCode: 'HB', testName: 'Hemoglobin', resultValue: '13.8', unit: 'g/dL', referenceRange: '13.0 - 17.0', flag: 'Normal' },
      { testCode: 'WBC', testName: 'Leukosit (WBC)', resultValue: '7.8', unit: 'x10^3/uL', referenceRange: '4.0 - 10.0', flag: 'Normal' },
      { testCode: 'PLT', testName: 'Trombosit (PLT)', resultValue: '245', unit: 'x10^3/uL', referenceRange: '150 - 450', flag: 'Normal' }
    ]
  }
];

export const MOCK_RADIOLOGY_ORDERS: RadiologyOrder[] = [
  {
    id: 'rad-2026-001',
    patientId: 'pat-005',
    patientName: 'Rudi Hermawan',
    norm: 'RM-2026-005',
    modality: 'CT Scan',
    examinationName: 'CT Scan Kepala Non-Kontras (Non-Contrast Brain CT)',
    orderDoctor: 'dr. Anisa Rahmawati, Sp.N',
    radiologistName: 'dr. Suryo Utomo, Sp.Rad(K)',
    technicianName: 'Radit, A.Md.Rad',
    orderDate: '2026-08-02 08:30',
    status: 'Verified',
    dicomStudyId: '1.2.840.113619.2.55.3.28311512',
    radiologyReport: 'Tampak lesi hipodens berbatas tegas pada lobus parietotemporalis kiri disertai edema perifokal ringan. Tidak tampak perdarahan intrakranial aktif maupun shift midline.\nKesan: Infark serebri akut (Stroke Iskemik Akut) regio parietotemporalis sinistra.',
    aiAnalysis: {
      detectedConditions: ['Acute Ischemic Stroke (Infark Serebri Kiri)', 'Perifocal Edema'],
      probabilityScore: 94,
      severityScore: 'Critical',
      findingSummary: 'Visual AI menemukan area hipodensitas bermakna di hemisfer kiri selaras dengan infark arteri serebri media (MCA).',
      heatmapCoordinates: 'x: 240, y: 180, radius: 45'
    }
  },
  {
    id: 'rad-2026-002',
    patientId: 'pat-002',
    patientName: 'Siti Aminah',
    norm: 'RM-2026-002',
    modality: 'X-Ray',
    examinationName: 'Foto Thorax AP/PA (Chest X-Ray)',
    orderDoctor: 'dr. Farhan, Sp.P',
    radiologistName: 'dr. Suryo Utomo, Sp.Rad(K)',
    technicianName: 'Sinta, A.Md.Rad',
    orderDate: '2026-08-02 09:45',
    status: 'Reading',
    dicomStudyId: '1.2.840.113619.2.55.3.28311513',
    radiologyReport: 'Tampak infiltrat kardiak & perihiler di lobus bawah kanan. Cor tak membesar. Sinus kostofrenikus lancip.\nKesan: Infiltrat Paru Kanan (Sesuai Pneumonia Lobaris).',
    aiAnalysis: {
      detectedConditions: ['Right Lower Lobe Pneumonia Infiltrate', 'Normal Cardiothoracic Ratio'],
      probabilityScore: 89,
      severityScore: 'Moderate',
      findingSummary: 'Deteksi Opasitas/Infiltrat Paru Kanan Bawah.'
    }
  }
];

export const MOCK_DICOM_STUDIES: DICOMStudy[] = [
  {
    studyInstanceUid: '1.2.840.113619.2.55.3.28311512',
    patientName: 'Rudi Hermawan',
    norm: 'RM-2026-005',
    modality: 'CT Scan',
    studyDate: '2026-08-02',
    studyDescription: 'CT Brain Non-Contrast',
    seriesCount: 3,
    imageCount: 48,
    sampleImageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    aiOverlayAvailable: true
  },
  {
    studyInstanceUid: '1.2.840.113619.2.55.3.28311513',
    patientName: 'Siti Aminah',
    norm: 'RM-2026-002',
    modality: 'X-Ray',
    studyDate: '2026-08-02',
    studyDescription: 'Chest X-Ray PA',
    seriesCount: 1,
    imageCount: 2,
    sampleImageUrl: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&q=80&w=800',
    aiOverlayAvailable: true
  }
];

export const MOCK_BLOOD_INVENTORY: BloodInventoryItem[] = [
  { id: 'bld-101', bloodType: 'O+', component: 'PRC (Packed Red Cells)', bagNumber: 'BAG-2026-8801', donorName: 'Dono Prasetyo', collectionDate: '2026-07-20', expiryDate: '2026-08-25', storageTempCelsius: 3.8, status: 'Available' },
  { id: 'bld-102', bloodType: 'A+', component: 'PRC (Packed Red Cells)', bagNumber: 'BAG-2026-8802', donorName: 'Eka Lestari', collectionDate: '2026-07-22', expiryDate: '2026-08-27', storageTempCelsius: 4.1, status: 'Crossmatched' },
  { id: 'bld-103', bloodType: 'B+', component: 'TC (Thrombocyte Concentrate)', bagNumber: 'BAG-2026-8803', donorName: 'Gita Gutawa', collectionDate: '2026-08-01', expiryDate: '2026-08-06', storageTempCelsius: 21.5, status: 'Available' },
  { id: 'bld-104', bloodType: 'AB+', component: 'FFP (Fresh Frozen Plasma)', bagNumber: 'BAG-2026-8804', donorName: 'Heri Susanto', collectionDate: '2026-07-15', expiryDate: '2027-07-15', storageTempCelsius: -22.0, status: 'Available' }
];

export const MOCK_BLOOD_CROSSMATCH: BloodCrossmatch[] = [
  { id: 'xm-1', patientName: 'Bambang Soeprapto', norm: 'RM-2026-003', bloodType: 'A+', requiredComponent: 'PRC (Packed Red Cells)', bagNumberAssigned: 'BAG-2026-8802', compatibilityResult: 'Compatible (Match)', technicianName: 'Anis, A.Md.AK', requestTime: '2026-08-02 10:15' }
];

export const MOCK_DIET_ORDERS: DietOrder[] = [
  { id: 'dt-1', patientName: 'Ahmad Dahlan', norm: 'RM-2026-001', wardBed: 'Mawar 101-A', dietType: 'Low Salt (RG)', caloriesKcal: 1700, foodAllergies: ['Penicillin (Alergi Obat, Makanan Bebas)'], nutritionistName: 'Santi Rahayu, S.Gz', mealDeliveryStatus: 'Meal Prepared', aiDietRecommendation: 'Diet Rendah Garam II (RG-2) & Kalori Seimbang 1700 kkal untuk mengontrol tekanan darah dan kadar gula puasa.' },
  { id: 'dt-2', patientName: 'Dewi Lestari', norm: 'RM-2026-004', wardBed: 'Melati 201-B', dietType: 'High Protein', caloriesKcal: 2100, foodAllergies: ['Udang / Seafood'], nutritionistName: 'Santi Rahayu, S.Gz', mealDeliveryStatus: 'In Transit', aiDietRecommendation: 'Tinggi Protein 2100 kkal untuk percepatan penyembuhan luka dan pemulihan stamina.' }
];

export const MOCK_REHAB_SESSIONS: RehabSession[] = [
  { id: 'rhb-1', patientName: 'Rudi Hermawan', norm: 'RM-2026-005', therapyType: 'Neurology Rehab', therapistName: 'Fis. Yudi Pratama, S.Ft', scheduledTime: '11:00', exercisePlan: 'Latihan Bobath & Range of Motion (ROM) pasif-aktif anggota gerak kanan pasca stroke.', progressNotes: 'Pasien mulai dapat melakukan fleksio siku dextra secara perlahan.', outcomeScore: 65, aiExerciseRecommendation: 'Tingkatkan durasi latihan koordinasi jari tangan kanan 15 menit 2 kali sehari.' }
];

export const MOCK_CSSD_BATCHES: CSSDBatch[] = [
  { id: 'cssd-01', batchNumber: 'BATCH-2026-0802-A', autoclaveMachineId: 'Autoclave Steam #1 (Getinge)', sterilizationType: 'Steam Autoclave 134C', instrumentSetName: 'Set Bedah Mayor Laparotomi #2', itemsCount: 32, startTime: '08:00', expiryDate: '2026-08-16', status: 'Sterile Ready', biologicalIndicator: 'PASSED (Negative)' },
  { id: 'cssd-02', batchNumber: 'BATCH-2026-0802-B', autoclaveMachineId: 'Autoclave Steam #2 (Getinge)', sterilizationType: 'Steam Autoclave 134C', instrumentSetName: 'Set Orthopedi Implan #1', itemsCount: 45, startTime: '10:30', expiryDate: '2026-08-16', status: 'Sterilizing', biologicalIndicator: 'Testing' }
];

export const MOCK_MEDICAL_DEVICES: MedicalDeviceIoT[] = [
  { id: 'dev-1', deviceName: 'Bedside Monitor Mindray BeneVision N17', location: 'ICU Bed 1', protocol: 'HL7 v2.5', ipAddress: '192.168.10.101', status: 'Online Active', lastPing: '1 detik lalu', telemetryData: [{ metricName: 'HR', value: '112 bpm' }, { metricName: 'NIBP', value: '88/54 mmHg' }, { metricName: 'SpO2', value: '92%' }] },
  { id: 'dev-2', deviceName: 'Ventilator Hamilton-G5', location: 'ICU Bed 1', protocol: 'IoT Gateway Direct', ipAddress: '192.168.10.102', status: 'Transmitting Data', lastPing: '2 detik lalu', telemetryData: [{ metricName: 'Mode', value: 'SIMV + PS' }, { metricName: 'FiO2', value: '55%' }, { metricName: 'PEEP', value: '8 cmH2O' }] },
  { id: 'dev-3', deviceName: 'Analyzer Chemistry Roche Cobas c501', location: 'Laboratorium Sentral', protocol: 'HL7 v2.5', ipAddress: '192.168.20.50', status: 'Online Active', lastPing: '5 detik lalu', telemetryData: [{ metricName: 'Status', value: 'Running QC Sample' }] }
];

export const MOCK_AMBULANCE_DISPATCHES: AmbulanceDispatch[] = [
  { id: 'amb-1', callSign: 'Ambulans 01 - ALS', ambulanceType: 'Advance Life Support (ALS)', driverName: 'Pak Joko', paramedicName: 'Ns. Ratna, S.Kep', destinationLocation: 'Jl. Sudirman No. 45 (Kasus Trauma Jalan Raya)', status: 'En Route to Location', gpsCoordinates: '-6.2088, 106.8456', etaMinutes: 8, aiFastestRoute: 'Jalur Bebas Hambatan Kuningan - Antisipasi Kemacetan Jam Makan Siang' }
];

export const MOCK_MORTUARY_RECORDS: MortuaryRecord[] = [
  { id: 'mort-1', deceasedName: 'Alm. Hendro Subroto', norm: 'RM-2026-099', dateOfDeath: '2026-08-01', timeOfDeath: '22:45', causeOfDeath: 'Cardiogenic Shock & Acute Myocardial Infarction', freezerBoxNumber: 'Cold Box #03', releasingFamilyName: 'Keluarga Bpk. Subroto', releaseStatus: 'Released to Family', deathCertificateGenerated: true }
];

export const MOCK_MEDICAL_CERTIFICATES: MedicalCertificate[] = [
  { id: 'cert-01', certificateType: 'Surat Keterangan Sakit', patientName: 'Ahmad Dahlan', norm: 'RM-2026-001', issuedDoctor: 'dr. Budi Hartono, Sp.PD-KGEH', issueDate: '2026-08-02', validDays: 3, summaryNote: 'Pasien diberikan istirahat sakit selama 3 hari terhitung mulai 02-08-2026 s/d 04-08-2026.', digitalSignatureQr: 'QR-CERT-OFFICIAL-2026-9901', verifiedStatus: 'Verified Official' }
];

export const MOCK_CARE_TEAM: CareTeamMember[] = [
  { id: 'ct-1', role: 'Dokter DPJP', name: 'dr. Budi Hartono, Sp.PD-KGEH', phone: '0812-9900-1122', notes: 'Penanggung jawab utama perawatan komorbid HT + DM.', lastUpdated: '2026-08-02 09:00' },
  { id: 'ct-2', role: 'Apoteker Klinis', name: 'Apt. Farida Nur, S.Farm', phone: '0813-4455-6677', notes: 'Edukasi kepatuhan minum obat antihipertensi & cek reaksi alergi.', lastUpdated: '2026-08-02 10:30' },
  { id: 'ct-3', role: 'Ahli Gizi', name: 'Siti Rahayu, S.Gz', phone: '0815-1122-3344', notes: 'Diet Rendah Garam II (RG-2) & Rendah Karbohidrat 1700 kkal.', lastUpdated: '2026-08-02 11:15' }
];

// ==========================================
// TAHAP 5: ENTERPRISE BUSINESS & OPERATIONS MOCK DATA
// ==========================================

export const MOCK_DRUG_MASTER: DrugMaster[] = [
  {
    id: 'drg-01',
    code: 'OBT-001-A',
    name: 'Ceftriaxone Inj 1 Gram',
    category: 'Antibiotik',
    formula: 'Ceftriaxone Sodium 1000 mg',
    unit: 'Vial',
    minStock: 200,
    currentStock: 480,
    unitPrice: 38000,
    sellingPrice: 52000,
    fastMovingStatus: 'Fast Moving',
    supplierName: 'PT Kalbe Farma Tbk',
    barcode: '8991001202611',
    aiRestockForecastDays: 14,
    drugInteractions: ['Calcium IV Solution (Precipitation Risk)', 'Warfarin (Enhances Anticoagulation)']
  },
  {
    id: 'drg-02',
    code: 'OBT-002-B',
    name: 'Metformin 500 mg Film Coated',
    category: 'Antidiabetes',
    formula: 'Metformin HCl 500 mg',
    unit: 'Tablet',
    minStock: 1000,
    currentStock: 3500,
    unitPrice: 450,
    sellingPrice: 750,
    fastMovingStatus: 'Fast Moving',
    supplierName: 'PT Dexa Medica',
    barcode: '8991002202622',
    aiRestockForecastDays: 28,
    drugInteractions: ['Contrast Agent Iodine (Risk of Lactic Acidosis - Hold 48h)']
  },
  {
    id: 'drg-03',
    code: 'OBT-003-C',
    name: 'Fentanyl Inj 0.05 mg/ml (2 ml)',
    category: 'Narkotika',
    formula: 'Fentanyl Citrate 100 mcg',
    unit: 'Ampul',
    minStock: 30,
    currentStock: 45,
    unitPrice: 65000,
    sellingPrice: 95000,
    fastMovingStatus: 'Slow Moving',
    supplierName: 'PT Kimia Farma Tbk',
    barcode: '8991003202633',
    aiRestockForecastDays: 45,
    drugInteractions: ['MAO Inhibitors', 'Benzodiazepine (Severe Respiratory Depression)']
  },
  {
    id: 'drg-04',
    code: 'OBT-004-D',
    name: 'Amlodipine Besylate 10 mg',
    category: 'Kardiologi',
    formula: 'Amlodipine 10 mg',
    unit: 'Tablet',
    minStock: 800,
    currentStock: 120, // Low stock alert!
    unitPrice: 350,
    sellingPrice: 600,
    fastMovingStatus: 'Fast Moving',
    supplierName: 'PT Sanbe Farma',
    barcode: '8991004202644',
    aiRestockForecastDays: 3,
    drugInteractions: ['Simvastatin (Max 20mg Simva recommended when combined)']
  }
];

export const MOCK_DRUG_BATCHES: DrugBatch[] = [
  { id: 'btc-101', drugId: 'drg-01', drugName: 'Ceftriaxone Inj 1 Gram', batchNumber: 'B26-0811A', expiredDate: '2027-02-15', quantity: 280, warehouseLocation: 'Depo Farmasi RI Rak A-01', fefoPriority: 1 },
  { id: 'btc-102', drugId: 'drg-01', drugName: 'Ceftriaxone Inj 1 Gram', batchNumber: 'B26-0920B', expiredDate: '2027-08-20', quantity: 200, warehouseLocation: 'Gudang Utama Farmasi Block B', fefoPriority: 2 },
  { id: 'btc-103', drugId: 'drg-04', drugName: 'Amlodipine Besylate 10 mg', batchNumber: 'B26-0105X', expiredDate: '2026-08-30', quantity: 120, warehouseLocation: 'Depo Farmasi RJ Rak B-04', fefoPriority: 1 }
];

export const MOCK_DRUG_DISPENSES: DrugDispense[] = [
  {
    id: 'dsp-001',
    prescriptionId: 'RX-2026-901',
    patientName: 'Ahmad Dahlan',
    norm: 'RM-2026-001',
    unitType: 'Inpatient',
    dispensedItems: [
      { drugName: 'Ceftriaxone Inj 1 Gram', dosage: '2 x 1 Vial IV', quantity: 6, batchNumber: 'B26-0811A' },
      { drugName: 'Metformin 500 mg', dosage: '3 x 1 Tab setelah makan', quantity: 30, batchNumber: 'B26-3301C' }
    ],
    dispensedBy: 'Apt. Farida Nur, S.Farm',
    dispenseTime: '2026-08-02 10:15',
    status: 'Dispensed',
    narcoticLedgerChecked: true
  }
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  { id: 'inv-01', itemCode: 'LOG-MED-01', itemName: 'Infusion Set Adult Sterile (Terumo)', category: 'Medical Supply', currentStock: 1450, minStock: 300, maxStock: 3000, unit: 'Pcs', warehouseName: 'Gudang Alkes Central', valuationTotal: 21750000, valuationMethod: 'FIFO', aiConsumptionTrend: 'High usage rate in ICU & ER (+15% YoY)' },
  { id: 'inv-02', itemCode: 'LOG-GAS-01', itemName: 'Tabung Gas Oksigen Medis 6m3 (High Purity)', category: 'Gas Medis', currentStock: 85, minStock: 25, maxStock: 150, unit: 'Tabung', warehouseName: 'Depo Gas Medis Sentral', valuationTotal: 12750000, valuationMethod: 'Average', aiConsumptionTrend: 'Stable consumption' },
  { id: 'inv-03', itemCode: 'LOG-BHP-02', itemName: 'Sarung Tangan Steril Latex Size M', category: 'BHP', currentStock: 240, minStock: 500, maxStock: 2000, unit: 'Box (50 pasang)', warehouseName: 'Gudang Alkes Central', valuationTotal: 18000000, valuationMethod: 'FEFO', aiConsumptionTrend: 'Stock below minimum! AI auto-PR generated.' }
];

export const MOCK_PURCHASE_REQUESTS: PurchaseRequest[] = [
  {
    id: 'pr-1001',
    prNumber: 'PR/LOG/2026/08/042',
    department: 'Keperawatan ICU & HCU',
    requestedBy: 'Ns. Ratna, S.Kep (Head Nurse ICU)',
    requestDate: '2026-08-01',
    items: [
      { itemName: 'Infusion Set Adult Sterile', quantity: 500, estimatedPrice: 15000 },
      { itemName: 'Sarung Tangan Steril Size M', quantity: 300, estimatedPrice: 75000 }
    ],
    totalEstimatedAmount: 30000000,
    status: 'Pending Approval',
    approvalLevelRequired: 'Level 2 Director'
  }
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-2001',
    poNumber: 'PO/RS/2026/07/119',
    prNumber: 'PR/LOG/2026/07/012',
    vendorName: 'PT Indofarma Global Medika',
    poDate: '2026-07-28',
    deliveryDueDate: '2026-08-04',
    totalAmount: 145000000,
    status: 'Partially Received',
    paymentTerms: 'NET 30 Hari'
  }
];

export const MOCK_SUPPLIERS: SupplierVendor[] = [
  { id: 'vnd-1', vendorName: 'PT Kalbe Farma Tbk', code: 'VND-KALBE-01', npwp: '01.234.567.8-012.000', category: 'Farmasi & Obat', contractStatus: 'Active Contract', performanceScore: 96, slaRating: '99.2%', aiVendorRating: 'Preferred Tier 1', contactPhone: '021-42873888' },
  { id: 'vnd-2', vendorName: 'PT Dexa Medica', code: 'VND-DEXA-02', npwp: '01.987.654.3-015.000', category: 'Farmasi & Obat', contractStatus: 'Active Contract', performanceScore: 92, slaRating: '97.8%', aiVendorRating: 'Preferred Tier 1', contactPhone: '021-7454111' },
  { id: 'vnd-3', vendorName: 'PT Siemens Healthineers Indonesia', code: 'VND-SIEMENS-03', npwp: '02.112.334.4-021.000', category: 'Alat Kesehatan', contractStatus: 'Active Contract', performanceScore: 98, slaRating: '99.8%', aiVendorRating: 'Preferred Tier 1', contactPhone: '021-25538000' }
];

export const MOCK_ASSET_MASTERS: AssetMaster[] = [
  { id: 'ast-01', assetCode: 'AST-RAD-001', name: 'MRI 3.0 Tesla Magnetom Vida (Siemens)', category: 'MRI', department: 'Radiologi Sentral', purchaseDate: '2024-03-15', acquisitionCost: 28500000000, currentValue: 22800000000, qrCodeTag: 'QR-AST-RAD-001', calibrationDueDate: '2026-11-20', status: 'Operational' },
  { id: 'ast-02', assetCode: 'AST-RAD-002', name: 'CT Scan 128 Slice Somatom Drive', category: 'CT Scan', department: 'Radiologi Sentral', purchaseDate: '2023-06-10', acquisitionCost: 16200000000, currentValue: 11340000000, qrCodeTag: 'QR-AST-RAD-002', calibrationDueDate: '2026-09-10', status: 'Operational' },
  { id: 'ast-03', assetCode: 'AST-ICU-005', name: 'Ventilator Servo-u Getinge', category: 'Ventilator', department: 'ICU Utama', purchaseDate: '2025-01-20', acquisitionCost: 850000000, currentValue: 765000000, qrCodeTag: 'QR-AST-ICU-005', calibrationDueDate: '2026-08-15', status: 'Under Maintenance' }
];

export const MOCK_BIOMEDICAL_WORK_ORDERS: BiomedicalWorkOrder[] = [
  { id: 'wo-101', woNumber: 'WO-BIO-2026-089', assetName: 'Ventilator Servo-u Getinge', assetCode: 'AST-ICU-005', maintenanceType: 'Preventive Maintenance', technicianName: 'Tek. Heru Setiawan, Amd.TEM', createdDate: '2026-08-01', downtimeHours: 4, mtbfHours: 2160, mttrHours: 2.5, status: 'In Progress', aiFailureRiskScore: 18 }
];

export const MOCK_GL_ACCOUNTS: GeneralLedgerAccount[] = [
  { accountCode: '100-101', accountName: 'Kas Utama Operasional RS', category: 'Asset', balance: 2850000000, costCenter: 'Finance Central' },
  { accountCode: '100-102', accountName: 'Bank Mandiri Escrow Rekening Operational', category: 'Asset', balance: 14200000000, costCenter: 'Finance Central' },
  { accountCode: '110-201', accountName: 'Piutang Klaim BPJS Kesehatan', category: 'Asset', balance: 8450000000, costCenter: 'RCM & Bridging' },
  { accountCode: '400-101', accountName: 'Pendapatan Layanan Rawat Jalan', category: 'Revenue', balance: 12400000000, costCenter: 'Poliklinik' },
  { accountCode: '400-102', accountName: 'Pendapatan Layanan Rawat Inap & ICU', category: 'Revenue', balance: 28900000000, costCenter: 'Inpatient Dept' }
];

export const MOCK_BILLING_INVOICES: BillingInvoice[] = [
  {
    id: 'inv-901',
    invoiceNumber: 'INV/RS/2026/08/001',
    patientName: 'Ahmad Dahlan',
    norm: 'RM-2026-001',
    visitType: 'Rawat Inap',
    registrationFee: 150000,
    consultationFee: 750000,
    labFee: 1250000,
    radiologyFee: 1800000,
    pharmacyFee: 2450000,
    roomFee: 3600000,
    procedureFee: 1500000,
    totalAmount: 11500000,
    depositPaid: 5000000,
    remainingBalance: 6500000,
    paymentMethod: 'QRIS',
    paymentStatus: 'Partial',
    createdDate: '2026-08-02'
  }
];

export const MOCK_BPJS_CLAIMS: BPJSSEPClaim[] = [
  {
    id: 'bpjs-01',
    sepNumber: '0001R0010826V000123',
    patientName: 'Ahmad Dahlan',
    bpjsCardNumber: '0001428819231',
    norm: 'RM-2026-001',
    serviceType: 'Rawat Inap (RITP)',
    inacbgCode: 'I-4-10-I',
    inacbgDescription: 'Infark Miokard Akut dengan Komplikasi Berat',
    estimatedClaimAmount: 18400000,
    approvedClaimAmount: 18400000,
    claimStatus: 'Verification Pending',
    aiRejectionRisk: 'Low',
    aiRiskNotes: 'Dokumen resume medis, hasil EKG, dan troponin I lengkap serta sesuai ICD-10 I21.0 & ICD-9-CM 88.56.'
  },
  {
    id: 'bpjs-02',
    sepNumber: '0001R0010826V000124',
    patientName: 'Siti Aminah',
    bpjsCardNumber: '0001928371922',
    norm: 'RM-2026-002',
    serviceType: 'Rawat Jalan (RJTP)',
    inacbgCode: 'Q-5-24-II',
    inacbgDescription: 'Pemeriksaan Kesehatan Diabetes Mellitus Tipe 2',
    estimatedClaimAmount: 380000,
    approvedClaimAmount: 0,
    claimStatus: 'Disputed / Pending',
    aiRejectionRisk: 'High Risk (Coding Error)',
    aiRiskNotes: 'AI Warning: Kode ICD-10 E11.9 membutuhkan lampiran HbA1c <3 bulan terakhir. Mohon attach file LIS sebelum submit e-Klaim.'
  }
];

export const MOCK_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp-101',
    employeeNip: 'NIP-19820512-001',
    name: 'dr. Budi Hartono, Sp.PD-KGEH',
    role: 'Dokter Spesialis',
    department: 'Poliklinik Penyakit Dalam',
    strNumber: '31.1.1.100.2.18.09211',
    strExpiryDate: '2028-05-12',
    sipNumber: '503/412/SIP/2023',
    sipExpiryDate: '2028-05-12',
    employmentStatus: 'Mitra Dokter',
    basicSalary: 15000000,
    medicalFeeShare: 42500000,
    kpiScore: 96,
    credentialStatus: 'Valid'
  },
  {
    id: 'emp-102',
    employeeNip: 'NIP-19910814-045',
    name: 'Ns. Ratna Kusuma, S.Kep',
    role: 'Perawat',
    department: 'Keperawatan ICU',
    strNumber: '31.2.1.200.3.19.11223',
    strExpiryDate: '2026-09-30', // Expiring soon!
    sipNumber: '503/890/SIP-P/2022',
    sipExpiryDate: '2026-09-30',
    employmentStatus: 'Tetap',
    basicSalary: 6800000,
    medicalFeeShare: 1200000,
    kpiScore: 92,
    credentialStatus: 'Expiring Soon'
  }
];

export const MOCK_SHIFT_ATTENDANCE: ShiftAttendanceRecord[] = [
  {
    id: 'att-1',
    employeeName: 'Ns. Ratna Kusuma, S.Kep',
    nip: 'NIP-19910814-045',
    date: '2026-08-02',
    shiftType: 'Morning (07:00-15:00)',
    checkInTime: '06:48',
    checkOutTime: '15:10',
    method: 'Face Recognition AI',
    status: 'Present On-Time'
  }
];

export const MOCK_CRM_MEMBERS: CRMMember[] = [
  {
    id: 'crm-01',
    patientName: 'Ir. H. Gunawan Wibisono',
    norm: 'RM-2026-008',
    tier: 'VIP Executive',
    loyaltyPoints: 12400,
    phoneWhatsApp: '0811-9988-7766',
    segment: 'MCU Regular',
    lastVisitDate: '2026-07-20',
    npsScore: 10
  }
];

export const MOCK_MARKETING_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'cmp-01',
    title: 'Reminder Program Skrining Diabetes & HbA1c Rutin Pasien Kronis',
    channel: 'WhatsApp',
    targetSegment: 'Chronic Diabetes',
    scheduledDate: '2026-08-05',
    sentCount: 1450,
    conversionRate: 22.4,
    aiTargetRecommendation: 'Kirim reminder WA interaktif dengan booking slot otomatis ke Poliklinik Endokrin.',
    status: 'Active'
  }
];

export const MOCK_EXECUTIVE_BI: ExecutiveBIReport = {
  monthlyRevenue: 42800000000, // Rp 42.8 Miliar
  monthlyExpense: 29400000000, // Rp 29.4 Miliar
  netProfit: 13400000000,      // Rp 13.4 Miliar
  cashFlowBalance: 18500000000,
  bedOccupancyRateBOR: 86.4,   // 86.4%
  lengthOfStayLOS: 3.6,        // 3.6 hari
  turnOverIntervalTOI: 1.1,    // 1.1 hari
  bedTurnOverBTO: 4.8,         // 4.8 kali
  bpjsUnclaimedAmount: 3200000000,
  activeInpatients: 342,
  aiRevenueLeakageRisk: 1.2    // 1.2% detected leakage
};

// ==========================================
// TAHAP 6: SMART AI HOSPITAL ECOSYSTEM MOCK DATA
// ==========================================

export const MOCK_IOT_DEVICES: IoTDeviceSensor[] = [
  {
    id: 'iot-01',
    deviceName: 'Smart Patient Monitor Mindray iMEC12',
    deviceType: 'Patient Monitor',
    location: 'Gedung Utama • Lantai 3 • Room ICU Bed 01',
    status: 'Online Normal',
    batteryLevel: 98,
    lastTelemetry: { heartRate: 84, spO2: 98, sysBP: 120, diaBP: 80, tempC: 36.8 },
    lastUpdate: 'Realtime (2 detik yang lalu)'
  },
  {
    id: 'iot-02',
    deviceName: 'Ventilator Hamilton-C6 High-End',
    deviceType: 'Ventilator',
    location: 'Gedung Utama • Lantai 3 • Room ICU Bed 02',
    status: 'Warning Alert',
    batteryLevel: 92,
    lastTelemetry: { heartRate: 110, spO2: 92, sysBP: 138, diaBP: 90, tempC: 38.2 },
    lastUpdate: 'Realtime (1 detik yang lalu)'
  },
  {
    id: 'iot-03',
    deviceName: 'Smart Bed Stryker InTouch Fall Detection',
    deviceType: 'Smart Bed',
    location: 'Gedung Teratai • Lantai 2 • VVIP 204',
    status: 'Online Normal',
    batteryLevel: 100,
    lastTelemetry: { bedOccupied: true, fallDetected: false },
    lastUpdate: 'Realtime (5 detik yang lalu)'
  },
  {
    id: 'iot-04',
    deviceName: 'Sensor Tekanan Gas Medis O2 Central',
    deviceType: 'Medical Gas Pressure',
    location: 'Gedung Central Gas Medis • Room Manifold O2',
    status: 'Online Normal',
    batteryLevel: 100,
    lastTelemetry: { gasPressurePsi: 55 },
    lastUpdate: 'Realtime (10 detik yang lalu)'
  }
];

export const MOCK_DIGITAL_TWIN_ROOMS: DigitalTwinRoom[] = [
  {
    id: 'dt-icu-01',
    building: 'Gedung Utama A',
    floor: 'Lantai 3',
    roomNumber: 'ICU Central 01-10',
    roomType: 'ICU',
    totalBeds: 10,
    occupiedBeds: 9,
    temperatureC: 21.5,
    humidityPct: 52,
    medicalGasO2Psi: 55,
    powerStatus: 'Grid Normal',
    activeAlerts: 1
  },
  {
    id: 'dt-ok-01',
    building: 'Gedung Bedah Sentral',
    floor: 'Lantai 2',
    roomNumber: 'OK 03 Hybrid Heart Suite',
    roomType: 'Kamar Operasi (OK)',
    totalBeds: 1,
    occupiedBeds: 1,
    temperatureC: 19.0,
    humidityPct: 48,
    medicalGasO2Psi: 58,
    powerStatus: 'Grid Normal',
    activeAlerts: 0
  },
  {
    id: 'dt-vvip-01',
    building: 'Gedung Teratai VVIP',
    floor: 'Lantai 4',
    roomNumber: 'Suite 401 President',
    roomType: 'Rawat Inap VVIP',
    totalBeds: 1,
    occupiedBeds: 1,
    temperatureC: 23.0,
    humidityPct: 55,
    medicalGasO2Psi: 54,
    powerStatus: 'Grid Normal',
    activeAlerts: 0
  }
];

export const MOCK_RPM_DEVICES: RPMDeviceData[] = [
  {
    id: 'rpm-01',
    patientName: 'Ir. H. Gunawan Wibisono',
    norm: 'RM-2026-008',
    deviceType: 'Smart Watch ECG',
    bpmRate: 72,
    spO2Pct: 98,
    sysBP: 125,
    diaBP: 82,
    aiAnomalyAlert: false,
    lastSyncTime: '5 menit yang lalu'
  },
  {
    id: 'rpm-02',
    patientName: 'Siti Aminah',
    norm: 'RM-2026-003',
    deviceType: 'Continuous Glucometer',
    bpmRate: 88,
    bloodSugarMgDl: 245,
    aiAnomalyAlert: true,
    aiAnomalyMessage: 'Peringatan Hiperglikemia (>240 mg/dL). Disarankan penyesuaian dosis insulin malam.',
    lastSyncTime: '1 menit yang lalu'
  }
];

export const MOCK_MULTI_HOSPITAL_TENANTS: MultiHospitalTenant[] = [
  {
    id: 'tenant-01',
    hospitalName: 'RSU Smart Medika Central Jakarta',
    hospitalType: 'Tipe A',
    tenantDomain: 'jakarta.smartmedika.id',
    licenseTier: 'Enterprise Multi-Hospital',
    activeBeds: 450,
    activeUsers: 1250,
    subscriptionExpiry: '2028-12-31',
    satuSehatBridgeStatus: 'Connected Sync 100%',
    customBranding: { primaryColor: '#0ea5e9' }
  },
  {
    id: 'tenant-02',
    hospitalName: 'RSIA Smart Medika Surabaya',
    hospitalType: 'Tipe B',
    tenantDomain: 'surabaya.smartmedika.id',
    licenseTier: 'White-Label Holding',
    activeBeds: 220,
    activeUsers: 620,
    subscriptionExpiry: '2028-12-31',
    satuSehatBridgeStatus: 'Connected Sync 100%',
    customBranding: { primaryColor: '#f43f5e' }
  },
  {
    id: 'tenant-03',
    hospitalName: 'RS Khusus Jantung Smart Heart Bandung',
    hospitalType: 'Tipe B',
    tenantDomain: 'bandung.smartmedika.id',
    licenseTier: 'SaaS Monthly Professional',
    activeBeds: 180,
    activeUsers: 410,
    subscriptionExpiry: '2027-06-30',
    satuSehatBridgeStatus: 'Connected Sync 100%',
    customBranding: { primaryColor: '#10b981' }
  }
];

export const MOCK_SATUSEHAT_FHIR_LOGS: SatuSehatFHIRGatewayLog[] = [
  {
    id: 'fhir-01',
    resourceType: 'Encounter',
    fhirId: 'enc-99213-satusehat-001',
    localNorm: 'RM-2026-001',
    syncTimestamp: '2026-08-02 23:30:15',
    httpStatus: 201,
    satusehatUuid: 'a8912c4b-9128-4e12-881a-001293819201',
    responsePayload: '{"resourceType":"Encounter","status":"in-progress","class":{"system":"http://terminology.hl7.org/CodeSystem/v3-ActCode","code":"AMB"}}'
  },
  {
    id: 'fhir-02',
    resourceType: 'Condition',
    fhirId: 'cond-icd10-e11-9',
    localNorm: 'RM-2026-003',
    syncTimestamp: '2026-08-02 23:28:10',
    httpStatus: 200,
    satusehatUuid: 'b7712390-1122-3344-5566-778899aabbcc',
    responsePayload: '{"resourceType":"Condition","clinicalStatus":{"coding":[{"system":"http://terminology.hl7.org/CodeSystem/condition-clinical","code":"active"}]}}'
  }
];

export const MOCK_SECURITY_DEVOPS: SecurityDevOpsCenter = {
  clusterStatus: 'Kubernetes Multi-Region HA Active',
  cpuUtilizationPct: 24.5,
  memoryUtilizationPct: 38.2,
  siemSecurityThreatsDetected: 0,
  zeroTrustMfaEnforced: true,
  openTelemetryActiveSpans: 1420,
  lastBackupTimestamp: '2026-08-02 23:00:00 (Encrypted AES-256)'
};

// ==========================================
// TAHAP 7: AGENTIC AI HOSPITAL ECOSYSTEM MOCK DATA
// ==========================================

export const MOCK_AI_AGENTS: AIAgentItem[] = [
  {
    id: 'agent-receptionist',
    name: 'AI Receptionist & Front Office',
    roleCategory: 'Front Office & Voice',
    description: 'Melayani pasien 24/7, booking jadwal dokter, MCU, vaksin, cek antrean & lokasi ruangan multibahasa.',
    avatarIcon: 'Bot',
    status: 'Active Autonomous',
    modelAssigned: 'Google Gemini 3.6 Flash',
    systemPrompt: 'Anda adalah AI Receptionist RS Smart Medika. Layani pasien dengan ramah, presisi, dan bantu booking jadwal.',
    toolsAllowed: ['booking_doctor_calendar', 'check_queue_status', 'check_room_location', 'get_service_cost'],
    tasksCompleted: 1420,
    humanApprovalsPending: 0,
    accuracyRatePct: 99.4,
    avgLatencyMs: 180
  },
  {
    id: 'agent-callcenter',
    name: 'AI Call Center & Voice Assistant',
    roleCategory: 'Front Office & Voice',
    description: 'Voice AI Speech-to-Text & Text-to-Speech 24 jam, analisis sentimen panggilan & auto-ticket follow up.',
    avatarIcon: 'PhoneCall',
    status: 'Active Autonomous',
    modelAssigned: 'Google Gemini 3.6 Flash (Audio Live)',
    systemPrompt: 'Anda adalah Voice AI Call Center. Tanggapi telepon pasien dengan intonasi hangat, catat ringkasan & buat tiket.',
    toolsAllowed: ['speech_to_text', 'text_to_speech', 'create_crm_ticket', 'route_panggilan_darurat'],
    tasksCompleted: 980,
    humanApprovalsPending: 0,
    accuracyRatePct: 98.7,
    avgLatencyMs: 240
  },
  {
    id: 'agent-triage',
    name: 'AI Triage & Emergency Prioritizer',
    roleCategory: 'Clinical & Triage',
    description: 'Menganalisis vital sign & keluhan awal pasien UGD untuk menentukan skala triase (Kritis / Emergency / Non-Urgent).',
    avatarIcon: 'AlertTriangle',
    status: 'Awaiting Human Approval',
    modelAssigned: 'Google Gemini 3.6 Flash + DeepSeek R1',
    systemPrompt: 'Menganalisis triase UGD berdasarkan Algoritma ESI (Emergency Severity Index). Wajib verifikasi dokter.',
    toolsAllowed: ['analyze_vital_signs', 'calculate_esi_score', 'trigger_red_zone_alarm'],
    tasksCompleted: 640,
    humanApprovalsPending: 2,
    accuracyRatePct: 99.8,
    avgLatencyMs: 140
  },
  {
    id: 'agent-scribe',
    name: 'AI Medical Scribe & EMR Auto-SOAP',
    roleCategory: 'Medical Scribe',
    description: 'Mendengarkan konsultasi dokter-pasien secara otomatis menyusun SOAP, ICD-10, ICD-9 CM & Resume Medis.',
    avatarIcon: 'FileText',
    status: 'Active Autonomous',
    modelAssigned: 'Google Gemini 3.6 Flash',
    systemPrompt: 'Konversi transkrip medis menjadi catatan SOAP terstruktur lengkap dengan usulan kode ICD-10 & ICD-9 CM.',
    toolsAllowed: ['generate_soap_note', 'suggest_icd10', 'suggest_icd9cm', 'generate_discharge_summary'],
    tasksCompleted: 3120,
    humanApprovalsPending: 5,
    accuracyRatePct: 99.2,
    avgLatencyMs: 310
  },
  {
    id: 'agent-pharmacy',
    name: 'AI Pharmacy & Drug Safety Agent',
    roleCategory: 'Pharmacy & Inventory',
    description: 'Memantau interaksi obat, alergi, tanggal kadaluarsa FEFO, Drug Recall & proyeksi stok otomatis.',
    avatarIcon: 'Pill',
    status: 'Awaiting Human Approval',
    modelAssigned: 'Google Gemini 3.6 Flash',
    systemPrompt: 'Deteksi kontraindikasi obat, interaksi antar resep, dan usulkan alternatif generik yang aman.',
    toolsAllowed: ['check_drug_interaction', 'check_fefo_expiry', 'forecast_medicine_demand', 'check_drug_recall'],
    tasksCompleted: 2450,
    humanApprovalsPending: 3,
    accuracyRatePct: 99.9,
    avgLatencyMs: 160
  },
  {
    id: 'agent-lab',
    name: 'AI Laboratory & Critical Delta Agent',
    roleCategory: 'Diagnostics & Labs',
    description: 'Menganalisis hasil lab, mendeteksi Critical Value secara instant, Delta Check & prediksi Turnaround Time.',
    avatarIcon: 'TestTube',
    status: 'Active Autonomous',
    modelAssigned: 'Google Gemini 3.6 Flash',
    systemPrompt: 'Analisis tren hasil lab spesimen, identifikasi nilai kritis (misal Hb < 7 g/dL) & beri peringatan otomatis.',
    toolsAllowed: ['detect_critical_lab_value', 'execute_delta_check', 'notify_pathologist'],
    tasksCompleted: 1890,
    humanApprovalsPending: 1,
    accuracyRatePct: 99.6,
    avgLatencyMs: 190
  },
  {
    id: 'agent-radiology',
    name: 'AI Radiology & Imaging Finding Assistant',
    roleCategory: 'Diagnostics & Labs',
    description: 'Asisten Radiolog untuk anotasi temuan X-Ray/CT-Scan/MRI, heatmap area lesi & komparasi radiologi terdahulu.',
    avatarIcon: 'Scan',
    status: 'Awaiting Human Approval',
    modelAssigned: 'Google Gemini 3.6 Flash (Vision RAG)',
    systemPrompt: 'Segmentasi area opasitas/fraktur pada citra DICOM. Wajib divalidasi oleh Dokter Spesialis Radiologi.',
    toolsAllowed: ['segment_dicom_image', 'generate_radiology_draft', 'compare_previous_scans'],
    tasksCompleted: 1120,
    humanApprovalsPending: 4,
    accuracyRatePct: 98.9,
    avgLatencyMs: 420
  },
  {
    id: 'agent-icu-nursing',
    name: 'AI ICU & Early Warning System (Sepsis Agent)',
    roleCategory: 'Nursing & ICU',
    description: 'Monitoring telemetri IoT 24 jam, prediksi Sepsis, Syok Kardiogenik, Cardiac Alert & risiko pasien jatuh.',
    avatarIcon: 'Activity',
    status: 'Active Autonomous',
    modelAssigned: 'Google Gemini 3.6 Flash + Realtime TimeSeries ML',
    systemPrompt: 'Pantau kurva NEWS2 (National Early Warning Score). Jika NEWS2 >= 7, segera picu alarm Code Blue / Emergency ICU.',
    toolsAllowed: ['calculate_news2_score', 'predict_sepsis_risk', 'trigger_nurse_station_alarm'],
    tasksCompleted: 5800,
    humanApprovalsPending: 0,
    accuracyRatePct: 99.7,
    avgLatencyMs: 95
  },
  {
    id: 'agent-or-bed',
    name: 'AI Operating Room & Smart Bed Manager',
    roleCategory: 'Operations & Bed',
    description: 'Optimasi jadwal kamar operasi (OK), checklist keselamatan WHO, prediksi jam discharge & alokasi tempat tidur.',
    avatarIcon: 'Bed',
    status: 'Active Autonomous',
    modelAssigned: 'Google Gemini 3.6 Flash',
    systemPrompt: 'Maksimalkan pemanfaatan Kamar Operasi dan tempat tidur rawat inap. Minimalkan waktu tunggu (Turnover Time).',
    toolsAllowed: ['schedule_or_suite', 'verify_who_surgical_checklist', 'predict_bed_turnover'],
    tasksCompleted: 1340,
    humanApprovalsPending: 1,
    accuracyRatePct: 99.1,
    avgLatencyMs: 210
  },
  {
    id: 'agent-finance-procurement',
    name: 'AI Finance & Fraud Billing Protection Agent',
    roleCategory: 'Finance & Procurement',
    description: 'Deteksi kecurangan klaim billing, analisis cash flow, optimasi pengadaan barang (RFQ) & audit revenue leakage.',
    avatarIcon: 'DollarSign',
    status: 'Awaiting Human Approval',
    modelAssigned: 'Google Gemini 3.6 Flash',
    systemPrompt: 'Audit berkas klaim BPJS & Asuransi Swasta terhadap unbundling/upcoding. Rekomendasikan vendor RFQ terbaik.',
    toolsAllowed: ['audit_billing_fraud', 'generate_procurement_rfq', 'forecast_cash_flow'],
    tasksCompleted: 1780,
    humanApprovalsPending: 3,
    accuracyRatePct: 99.5,
    avgLatencyMs: 280
  },
  {
    id: 'agent-executive-compliance',
    name: 'AI Executive Advisor & Compliance Audit Agent',
    roleCategory: 'Executive & Compliance',
    description: 'Menjawab pertanyaan direksi secara natural (NLQ), memantau kepatuhan akreditasi KARS/JCI & audit ISO 27001.',
    avatarIcon: 'ShieldCheck',
    status: 'Active Autonomous',
    modelAssigned: 'Google Gemini 3.6 Flash (RAG Policy)',
    systemPrompt: 'Jawab pertanyaan strategis direksi menggunakan data riil SIMRS & berikan rekomendasi efisiensi operasional.',
    toolsAllowed: ['query_executive_bi', 'audit_kars_compliance', 'generate_board_summary'],
    tasksCompleted: 920,
    humanApprovalsPending: 0,
    accuracyRatePct: 99.6,
    avgLatencyMs: 220
  }
];

export const MOCK_AI_WORKFLOW_STEPS: AIAgentWorkflowStep[] = [
  { stepNumber: 1, stepName: 'Registrasi & Booking AI', assignedAgent: 'AI Receptionist', actionRequired: 'Input data pasien & verifikasi jadwal', status: 'Completed', requiresHumanSignature: false },
  { stepNumber: 2, stepName: 'Triase Cerdas UGD', assignedAgent: 'AI Triage Agent', actionRequired: 'Kalkulasi ESI score & deteksi kegawatan', status: 'Completed', requiresHumanSignature: true },
  { stepNumber: 3, stepName: 'Antrian Cerdas Poli', assignedAgent: 'AI Receptionist', actionRequired: 'Pemanggilan pendaftaran & nomor urut', status: 'Completed', requiresHumanSignature: false },
  { stepNumber: 4, stepName: 'Konsultasi & Auto-SOAP', assignedAgent: 'AI Medical Scribe', actionRequired: 'Dikte suara -> Draft SOAP & ICD-10', status: 'Active', requiresHumanSignature: true },
  { stepNumber: 5, stepName: 'Order Lab & Radiologi', assignedAgent: 'AI Laboratory / Radiology', actionRequired: 'Interpretasi hasil & deteksi nilai kritis', status: 'Pending', requiresHumanSignature: true },
  { stepNumber: 6, stepName: 'Verifikasi Resep Obat', assignedAgent: 'AI Pharmacy Agent', actionRequired: 'Skrining kontraindikasi obat FEFO', status: 'Pending', requiresHumanSignature: true },
  { stepNumber: 7, stepName: 'Klaim & Billing Final', assignedAgent: 'AI Finance Agent', actionRequired: 'Audit e-Klaim BPJS & Billing RCM', status: 'Pending', requiresHumanSignature: true },
  { stepNumber: 8, stepName: 'Discharge & Home Care', assignedAgent: 'AI Bed Manager', actionRequired: 'Pelepasan bed & jadwal Telemedicine', status: 'Pending', requiresHumanSignature: false }
];

export const MOCK_HUMAN_APPROVALS: HumanApprovalItem[] = [
  {
    id: 'ha-001',
    ticketNumber: 'APPROVAL-SCR-2026-891',
    requesterAgent: 'AI Medical Scribe',
    category: 'Draft SOAP Scribe',
    patientNormOrSubject: 'RM-2026-001 (Ahmad Dahlan - Poli Jantung)',
    aiRecommendation: 'Draft SOAP: Ditemukan Murmur Sistolik Gr II/VI. ICD-10: I50.9 (Heart Failure) & Resep Furosemid 40mg 1x1.',
    clinicalOrFinancialRisk: 'Rendah',
    status: 'Pending Authorization',
    requestedAt: '10 menit yang lalu'
  },
  {
    id: 'ha-002',
    ticketNumber: 'APPROVAL-RAD-2026-412',
    requesterAgent: 'AI Radiology Agent',
    category: 'Tindakan Operasi',
    patientNormOrSubject: 'RM-2026-008 (Ir. H. Gunawan - Rawat Inap VVIP 204)',
    aiRecommendation: 'Deteksi Opasitas Infiltrat Paru Kanan 40% (Suspek Pneumonia Lobaris). Rekomendasi CT-Scan Thorax Kontras & Booking OK.',
    clinicalOrFinancialRisk: 'Tinggi (Kritis)',
    status: 'Pending Authorization',
    requestedAt: '25 menit yang lalu'
  },
  {
    id: 'ha-003',
    ticketNumber: 'APPROVAL-FAR-2026-118',
    requesterAgent: 'AI Pharmacy Agent',
    category: 'Resep & Farmasi',
    patientNormOrSubject: 'RM-2026-003 (Siti Aminah - ICU Bed 02)',
    aiRecommendation: 'Saran substitusi obat: Cefotaxime Diganti Ceftriaxone 1g IV dikarenakan stok Cefotaxime mendekati kadaluarsa FEFO (15 hari lagi).',
    clinicalOrFinancialRisk: 'Sedang',
    status: 'Pending Authorization',
    requestedAt: '1 jam yang lalu'
  },
  {
    id: 'ha-004',
    ticketNumber: 'APPROVAL-PROC-2026-045',
    requesterAgent: 'AI Procurement Agent',
    category: 'Pengadaan RFQ',
    patientNormOrSubject: 'Pengadaan Stok Reagen LIS Analyser Cobas e411 (50 Kit)',
    aiRecommendation: 'Saran Persetujuan PO senilai Rp 145.000.000 ke PT Roche Indonesia (Diskon 12% via e-Katalog Kemenkes).',
    clinicalOrFinancialRisk: 'Sedang',
    status: 'Pending Authorization',
    requestedAt: '2 jam yang lalu'
  }
];

export const MOCK_KNOWLEDGE_DOCUMENTS: KnowledgeBaseDocument[] = [
  {
    id: 'kb-01',
    title: 'Panduan Praktik Klinis (PPK) Tata Laksana Gagal Jantung PERKI 2023',
    category: 'Clinical Guideline',
    chunksCount: 142,
    vectorDbStatus: 'Indexed in Qdrant Vector',
    lastUpdated: '2026-01-15',
    summary: 'Protokol terapi medikamentosa CHF NYHA I-IV, dosis ACE-Inhibitor, ARNI, Spironolakton & indikasi rawat ICU.'
  },
  {
    id: 'kb-02',
    title: 'Pedoman Nasional Pelayanan Kedokteran (PNPK) Diabetes Melitus Tipe 2 Kemenkes RI',
    category: 'WHO / Kemenkes RI',
    chunksCount: 98,
    vectorDbStatus: 'Indexed in Qdrant Vector',
    lastUpdated: '2025-11-20',
    summary: 'Algoritma penggunaan Metformin, Insulin Basal, SGLT2-Inhibitor & pencegahan komplikasi ulkus diabetikum.'
  },
  {
    id: 'kb-03',
    title: 'SOP Kemenkes / WHO Safety Surgery Checklist (Kamar Operasi)',
    category: 'SOP Klinis',
    chunksCount: 35,
    vectorDbStatus: 'Indexed in Qdrant Vector',
    lastUpdated: '2026-03-10',
    summary: 'Checklist Sign In, Time Out, dan Sign Out untuk pencegahan kesalahan lokasi operasi & sterilisasi instrumen.'
  },
  {
    id: 'kb-04',
    title: 'Database Interaksi Obat & Formularium Nasional (FORNAS) 2026',
    category: 'Drug Database',
    chunksCount: 1250,
    vectorDbStatus: 'Indexed in Qdrant Vector',
    lastUpdated: '2026-07-01',
    summary: 'Matriks interaksi obat A-Z, kontraindikasi ginjal/hati, dosis maksimal anak & restriksi klaim BPJS Kesehatan.'
  }
];

export const MOCK_MODEL_ROUTERS: AIModelRouterItem[] = [
  {
    modelName: 'Google Gemini 3.6 Flash',
    provider: 'Google Gemini',
    latencyMs: 140,
    costPer1kTokensUsd: 0.00015,
    accuracyScore: 99.4,
    activeWorkloads: 'Scribe SOAP, Voice Live, AI Receptionist, Fast Triage, RAG Search',
    status: 'Primary Optimal'
  },
  {
    modelName: 'DeepSeek R1 Clinical Reasoning',
    provider: 'DeepSeek',
    latencyMs: 380,
    costPer1kTokensUsd: 0.00028,
    accuracyScore: 99.1,
    activeWorkloads: 'Complex Differential Diagnosis, Clinical Research, ICD-10 Audit',
    status: 'Primary Optimal'
  },
  {
    modelName: 'Anthropic Claude 3.5 Sonnet',
    provider: 'Anthropic Claude',
    latencyMs: 290,
    costPer1kTokensUsd: 0.0030,
    accuracyScore: 98.8,
    activeWorkloads: 'Executive NLQ Reports, Legal Compliance Drafts',
    status: 'Fallback Active'
  },
  {
    modelName: 'Meta Llama 3 70B On-Premise (Private Cloud)',
    provider: 'Local On-Premise',
    latencyMs: 180,
    costPer1kTokensUsd: 0.0000,
    accuracyScore: 97.5,
    activeWorkloads: 'Air-gapped Sensitive Patient Data Encryption Processing',
    status: 'Primary Optimal'
  }
];

export const MOCK_AI_OBSERVABILITY: AIObservabilityMetric = {
  totalTokensToday: 4820150,
  estCostTodayUsd: 4.82,
  avgResponseLatencyMs: 185,
  hallucinationRatePct: 0.02,
  auditTrailLogsCount: 12480,
  humanApprovalRatePct: 99.8
};

export const MOCK_AI_CHAT_MESSAGES: AIChatMessage[] = [
  {
    id: 'msg-01',
    sender: 'System Gateway',
    content: 'Selamat datang di Agentic AI Hospital Hub. Pilih AI Agent untuk berinteraksi, menjalankan tugas otomatis, atau mengunggah dokumen medis.',
    timestamp: '23:45'
  },
  {
    id: 'msg-02',
    sender: 'User',
    content: 'Tolong AI Medical Scribe: susun draft SOAP untuk pasien Ahmad Dahlan (RM-2026-001) dengan keluhan nyeri dada dan sesak napas saat berjalan.',
    timestamp: '23:46'
  },
  {
    id: 'msg-03',
    sender: 'AI Agent',
    agentId: 'agent-scribe',
    agentName: 'AI Medical Scribe',
    content: 'Tentu. Berikut draft SOAP hasil ekstraksi AI:\n\n**S (Subjective):** Pasien mengeluh sesak napas saat berjalan & nyeri dada substERNAL.\n**O (Objective):** TD 140/90 mmHg, Nadi 88x/m, SpO2 96%. Ronki basah halus di basal paru kanan.\n**A (Assessment):** Suspek CHF NYHA Class II-III / Ischemic Heart Disease. Suggest ICD-10: I50.9.\n**P (Plan):** Berikan Furosemid 40mg IV, Cek EKG 12 Lead & Troponin I. Rekomendasi konsultasi Spesialis Jantung.\n\n*Catatan: Tugas ini membutuhkan Persetujuan Dokter (Human-in-the-loop).*',
    timestamp: '23:47',
    requiresApproval: true,
    approvalStatus: 'Pending',
    modelUsed: 'Google Gemini 3.6 Flash'
  }
];

// ==========================================
// PROMPT 8: HEALTHCARE SUPER ECOSYSTEM MOCK DATA
// ==========================================

export const MOCK_NATIONAL_HEALTH_EXCHANGE: NationalHealthExchangeNode[] = [
  {
    id: 'nhe-01',
    systemName: 'SATUSEHAT Kemenkes RI',
    protocol: 'FHIR R4',
    status: 'Synced Live',
    recordsProcessedToday: 18450,
    lastSyncTimestamp: '2026-08-03 00:12:10',
    healthConsentVerified: true
  },
  {
    id: 'nhe-02',
    systemName: 'BPJS Kesehatan TrustMark v2',
    protocol: 'BPJS TrustMark',
    status: 'Synced Live',
    recordsProcessedToday: 12300,
    lastSyncTimestamp: '2026-08-03 00:14:00',
    healthConsentVerified: true
  },
  {
    id: 'nhe-03',
    systemName: 'National Lab Exchange (NLE)',
    protocol: 'HL7 v2.5',
    status: 'Synced Live',
    recordsProcessedToday: 4890,
    lastSyncTimestamp: '2026-08-03 00:08:45',
    healthConsentVerified: true
  },
  {
    id: 'nhe-04',
    systemName: 'e-Klaim INA-CBG Kemenkes',
    protocol: 'REST / JSON',
    status: 'Synced Live',
    recordsProcessedToday: 9540,
    lastSyncTimestamp: '2026-08-03 00:10:00',
    healthConsentVerified: true
  },
  {
    id: 'nhe-05',
    systemName: 'National Master Patient Index (MPI)',
    protocol: 'FHIR R4',
    status: 'Synced Live',
    recordsProcessedToday: 32100,
    lastSyncTimestamp: '2026-08-03 00:13:30',
    healthConsentVerified: true
  }
];

export const MOCK_PROVIDER_NETWORK: ProviderNetworkItem[] = [
  {
    id: 'prov-01',
    name: 'RSUPN Dr. Cipto Mangunkusumo (RSCM)',
    type: 'Rumah Sakit',
    region: 'DKI Jakarta - Pusat',
    interopStatus: 'Connected FHIR',
    activeReferralsCount: 42,
    rating: 4.9,
    contactNumber: '(021) 1500135'
  },
  {
    id: 'prov-02',
    name: 'Klinik Utama Medika BSD',
    type: 'Klinik Utama',
    region: 'Banten - Tangerang Selatan',
    interopStatus: 'Connected FHIR',
    activeReferralsCount: 18,
    rating: 4.8,
    contactNumber: '(021) 5381234'
  },
  {
    id: 'prov-03',
    name: 'Puskesmas Kebayoran Baru',
    type: 'Puskesmas',
    region: 'DKI Jakarta - Selatan',
    interopStatus: 'Connected FHIR',
    activeReferralsCount: 29,
    rating: 4.7,
    contactNumber: '(021) 7204561'
  },
  {
    id: 'prov-04',
    name: 'Laboratorium Klinik Prodita Utama',
    type: 'Laboratorium Eksternal',
    region: 'DKI Jakarta - Barat',
    interopStatus: 'Connected FHIR',
    activeReferralsCount: 65,
    rating: 4.9,
    contactNumber: '(021) 5698765'
  },
  {
    id: 'prov-05',
    name: 'Apotek K-24 Jaringan Nasional',
    type: 'Apotek Jaringan',
    region: 'Nasional - 1.200 Cabang',
    interopStatus: 'Connected FHIR',
    activeReferralsCount: 140,
    rating: 4.8,
    contactNumber: '1500024'
  },
  {
    id: 'prov-06',
    name: 'Ambulance Gawat Darurat (AGD) 112',
    type: 'Ambulance Unit',
    region: 'Jabodetabek Fleet',
    interopStatus: 'Connected FHIR',
    activeReferralsCount: 12,
    rating: 5.0,
    contactNumber: '112'
  }
];

export const MOCK_WEARABLES_TELEMETRY: WearableDeviceTelemetry[] = [
  {
    id: 'wear-01',
    deviceName: 'Apple Watch Series 9',
    platform: 'Apple Health',
    patientName: 'Ahmad Dahlan (Pasien CHF)',
    heartRateBpm: 104,
    bloodPressureSystolicDiastolic: '142/92',
    spO2Percent: 95,
    stepsToday: 4200,
    sleepHours: 6.2,
    aiEarlyWarningAlert: 'Mild Tachicardia',
    lastSyncedAt: '2 menit yang lalu'
  },
  {
    id: 'wear-02',
    deviceName: 'Garmin Fenix 7 Pro',
    platform: 'Garmin Connect',
    patientName: 'Dr. Budi Santoso (Dokter Jaga)',
    heartRateBpm: 72,
    bloodPressureSystolicDiastolic: '120/80',
    spO2Percent: 99,
    stepsToday: 9800,
    sleepHours: 7.5,
    aiEarlyWarningAlert: 'Normal',
    lastSyncedAt: '1 menit yang lalu'
  },
  {
    id: 'wear-03',
    deviceName: 'Fitbit Sense 2',
    platform: 'Fitbit',
    patientName: 'Siti Aminah (Pasien Diabetes)',
    heartRateBpm: 88,
    bloodPressureSystolicDiastolic: '135/85',
    spO2Percent: 97,
    stepsToday: 6100,
    sleepHours: 7.0,
    aiEarlyWarningAlert: 'Normal',
    lastSyncedAt: '5 menit yang lalu'
  },
  {
    id: 'wear-04',
    deviceName: 'Samsung Galaxy Watch 6',
    platform: 'Samsung Health',
    patientName: 'Bambang Soetjipto (Pasien COPD)',
    heartRateBpm: 96,
    bloodPressureSystolicDiastolic: '138/88',
    spO2Percent: 92,
    stepsToday: 2100,
    sleepHours: 5.4,
    aiEarlyWarningAlert: 'Hypoxia Warning',
    lastSyncedAt: 'Baru saja'
  }
];

export const MOCK_SMART_AMBULANCE_UNITS: SmartAmbulanceTelemetry[] = [
  {
    unitId: 'AMB-ALPHA-01',
    driverName: 'Pak Supriadi',
    paramedicName: 'Ners Rina, Amd.Kep',
    currentLocationGPS: 'Jl. Sudirman KM 12, Jakarta',
    destinationHospital: 'Smart Medika Hospital Center',
    patientCondition: 'Pasien STEMI Akut (Serangan Jantung)',
    etaMinutes: 8,
    vitals: { hr: 112, bp: '150/95', spo2: 94 },
    aiRouteOptimization: 'Lampu Merah Bypass - Jalur Tol Semanggi Bebas Hambatan',
    status: 'Transporting Patient'
  },
  {
    unitId: 'AMB-BRAVO-02',
    driverName: 'Pak Hendro',
    paramedicName: 'Ners Joko, S.Kep',
    currentLocationGPS: 'Jl. Gatot Subroto No. 45',
    destinationHospital: 'Smart Medika Hospital Center',
    patientCondition: 'Trauma Lakalantas Multiple Fracture',
    etaMinutes: 14,
    vitals: { hr: 98, bp: '110/70', spo2: 97 },
    aiRouteOptimization: 'Kuningan Underpass Direct Access',
    status: 'En Route to Scene'
  }
];

export const MOCK_CORPORATE_CLIENTS: CorporateMCUClient[] = [
  {
    id: 'corp-01',
    companyName: 'PT Telkom Indonesia Tbk',
    industry: 'Telekomunikasi & Teknologi',
    totalEmployees: 1250,
    mcuPackageName: 'Executive Executive Wellness 360°',
    completedMcuPct: 88,
    fitToWorkStatus: { fit: 1020, fitWithRestriction: 65, unfitTemporary: 15 },
    occupationalHealthAlert: 'Tingkat stres postural & mata tinggi (Screen fatigue)'
  },
  {
    id: 'corp-02',
    companyName: 'PT Pertamina Hulu Energi',
    industry: 'Minyak, Gas & Energi',
    totalEmployees: 850,
    mcuPackageName: 'Offshore & High-Risk Industrial MCU',
    completedMcuPct: 94,
    fitToWorkStatus: { fit: 780, fitWithRestriction: 15, unfitTemporary: 4 },
    occupationalHealthAlert: 'Paparan bising dalam batas aman (Audiometri Normal)'
  }
];

export const MOCK_POPULATION_PREDICTIONS: PopulationHealthPrediction[] = [
  {
    id: 'pop-01',
    diseaseName: 'DHF / Demam Berdarah Dengue',
    regionCode: 'DKI Jakarta - Jakarta Timur & Selatan',
    riskLevel: 'Kritis (Outbreak Alert)',
    predictedCasesNext30Days: 420,
    aiOutbreakProbabilityPct: 89.5,
    recommendedIntervention: 'Fogging fokus & pembagian abate massal di 12 Kelurahan.',
    vaccinationCoveragePct: 34.0
  },
  {
    id: 'pop-02',
    diseaseName: 'ISPA / Acute Respiratory Infection',
    regionCode: 'Jawa Barat - Kota Bekasi & Depok',
    riskLevel: 'Waspada Tinggi',
    predictedCasesNext30Days: 1280,
    aiOutbreakProbabilityPct: 76.2,
    recommendedIntervention: 'Edukasi masker & peningkatkan stok Nebulizer di Puskesmas.',
    vaccinationCoveragePct: 62.5
  },
  {
    id: 'pop-03',
    diseaseName: 'Tuberculosis (TB Paru RO)',
    regionCode: 'Jawa Timur - Surabaya & Sidoarjo',
    riskLevel: 'Sedang',
    predictedCasesNext30Days: 185,
    aiOutbreakProbabilityPct: 48.0,
    recommendedIntervention: 'Penjaringan kontak erat via AI Mobile Chest X-Ray.',
    vaccinationCoveragePct: 91.2
  }
];

export const MOCK_HEALTHCARE_MARKETPLACE: HealthcareMarketplaceItem[] = [
  {
    id: 'mkt-01',
    title: 'Smart Portable ECG 12-Lead Wireless AI Enabled',
    category: 'Alat Kesehatan',
    vendorName: 'MedTech Global Indonesia',
    priceIdr: 18500000,
    rating: 4.9,
    stockQty: 24,
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80',
    isBpomCertified: true
  },
  {
    id: 'mkt-02',
    title: 'Paket MCU Screening Jantung & Stroke Komprehensif',
    category: 'Paket Lab & MCU',
    vendorName: 'Smart Medika Hospital Center',
    priceIdr: 2750000,
    rating: 5.0,
    stockQty: 500,
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80',
    isBpomCertified: true
  },
  {
    id: 'mkt-03',
    title: 'Pulse Oximeter Bluetooth Patient Monitor Smart Connect',
    category: 'Alat Kesehatan',
    vendorName: 'Biosens Indonesia',
    priceIdr: 450000,
    rating: 4.8,
    stockQty: 180,
    imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80',
    isBpomCertified: true
  },
  {
    id: 'mkt-04',
    title: 'Layanan Home Visit Dokter & Perawat Medis 24 Jam',
    category: 'Layanan Home Care',
    vendorName: 'Smart Care Homecare Network',
    priceIdr: 350000,
    rating: 4.9,
    stockQty: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=300&q=80',
    isBpomCertified: true
  }
];

export const MOCK_DEVELOPER_KEYS: DeveloperPortalKey[] = [
  {
    id: 'dev-01',
    appName: 'Apotek Online Halodoc Interop',
    organizationName: 'PT Media Dokter Investama',
    apiKeyMasked: 'sk_live_9f8a...3e1b',
    environment: 'Production',
    rateLimitPerMin: 1000,
    webhookUrl: 'https://api.halodoc.com/webhooks/smartmedika',
    requestsCount24h: 48920,
    status: 'Active'
  },
  {
    id: 'dev-02',
    appName: 'Klinik Pintar EMR Adapter',
    organizationName: 'PT Digital Klinik Nusantara',
    apiKeyMasked: 'sk_live_7c2d...8f9a',
    environment: 'Production',
    rateLimitPerMin: 500,
    webhookUrl: 'https://partner.klinikpintar.id/v1/fhir',
    requestsCount24h: 12450,
    status: 'Active'
  },
  {
    id: 'dev-03',
    appName: 'Health AI Research Sandbox',
    organizationName: 'Fakultas Kedokteran Universitas Indonesia',
    apiKeyMasked: 'sk_sandbox_1a2b...3c4d',
    environment: 'Sandbox',
    rateLimitPerMin: 200,
    webhookUrl: 'https://fkui.ac.id/sandbox/webhook',
    requestsCount24h: 3100,
    status: 'Active'
  }
];

export const MOCK_STUDIO_WORKFLOWS: StudioWorkflowDefinition[] = [
  {
    id: 'wf-01',
    name: 'Alur Penerimaan & Triase Pasien Gawat Darurat',
    category: 'Patient Admission',
    status: 'Published',
    nodesCount: 6,
    triggerEvent: 'Event: IGD_PATIENT_CHECKIN',
    lastModifiedBy: 'Dr. Hendra (Chief Informatics)',
    version: 'v2.4',
    nodes: [
      { id: 'n1', type: 'Start', label: 'Pasien Tiba IGD', configSummary: 'Trigger NIK / QR Scanner', positionX: 50, positionY: 100 },
      { id: 'n2', type: 'AI_Agent', label: 'AI Triase Risk Scoring', configSummary: 'Model: Gemini 1.5 Flash (Triage Rule)', positionX: 250, positionY: 100 },
      { id: 'n3', type: 'Decision', label: 'Kategori ESI High Risk?', configSummary: 'IF ESI <= 2 THEN Red Flag', positionX: 450, positionY: 100 },
      { id: 'n4', type: 'Notification', label: 'Broadcast Tim Resusitasi', configSummary: 'WhatsApp & Smart Watch Alert', positionX: 650, positionY: 50 },
      { id: 'n5', type: 'Approval', label: 'Verifikasi Dokter DPJP', configSummary: 'Biometric Sign DPJP', positionX: 650, positionY: 150 },
      { id: 'n6', type: 'End', label: 'Bed Allocated & EMR Created', configSummary: 'Auto Assign Room ID', positionX: 850, positionY: 100 }
    ]
  },
  {
    id: 'wf-02',
    name: 'Auto-Routing Pemeriksaan Laboratorium & CITO Alert',
    category: 'Clinical Lab Routing',
    status: 'Published',
    nodesCount: 5,
    triggerEvent: 'Event: LAB_ORDER_CREATED',
    lastModifiedBy: 'Apt. Rina (Clinical Systems)',
    version: 'v1.8',
    nodes: [
      { id: 'n1', type: 'Start', label: 'Order Lab Dokter', configSummary: 'E-Order Form Validation', positionX: 50, positionY: 100 },
      { id: 'n2', type: 'Decision', label: 'Prioritas CITO / Critical?', configSummary: 'Flag = CITO or ICU Source', positionX: 250, positionY: 100 },
      { id: 'n3', type: 'API_Call', label: 'Kirim ke Analyzer LIS (HL7)', configSummary: 'HL7 MLLP Socket Direct', positionX: 450, positionY: 100 },
      { id: 'n4', type: 'AI_Agent', label: 'AI Critical Delta Check', configSummary: 'Compare vs 30-day historical lab', positionX: 650, positionY: 100 },
      { id: 'n5', type: 'End', label: 'E-Result Delivered to DPJP', configSummary: 'Push Notification & EMR', positionX: 850, positionY: 100 }
    ]
  }
];

export const MOCK_STUDIO_FORMS: StudioFormDefinition[] = [
  {
    id: 'form-01',
    title: 'Formulir Persetujuan Tindakan Medis (Informed Consent Digital)',
    category: 'Konsent Pasien',
    elementsCount: 7,
    status: 'Active',
    version: 'v3.1',
    elements: [
      { id: 'f1', type: 'Text', label: 'Nama Pasien Lengkap', placeholder: 'Sesuai KTP / SIM', required: true },
      { id: 'f2', type: 'Text', label: 'NIK / No. Pasien', placeholder: '16 digit NIK', required: true },
      { id: 'f3', type: 'Select', label: 'Jenis Tindakan Medis', required: true, options: ['Operasi Katarak', 'Appendektomi', 'Hemodialisa', 'Endoskopi GI'] },
      { id: 'f4', type: 'Checkbox', label: 'Pernyataan Bahwa Pasien Telah Memahami Risiko', required: true },
      { id: 'f5', type: 'Signature', label: 'Tanda Tangan Digital Pasien / Wali', required: true },
      { id: 'f6', type: 'Signature', label: 'Tanda Tangan Dokter DPJP', required: true },
      { id: 'f7', type: 'QR_Scanner', label: 'Verifikasi Biometrik e-KTP', required: false }
    ]
  },
  {
    id: 'form-02',
    title: 'Skrining Awal Risiko Diabetes & Komplikasi Vaskular',
    category: 'MCU Form',
    elementsCount: 5,
    status: 'Active',
    version: 'v1.5',
    elements: [
      { id: 'f1', type: 'Number' as any, label: 'Usia (Tahun)', required: true },
      { id: 'f2', type: 'Radio', label: 'Riwayat Diabetes Keluarga', required: true, options: ['Ada (Orang Tua / Saudara)', 'Tidak Ada', 'Ragu-Ragu'] },
      { id: 'f3', type: 'Select', label: 'Frekuensi Olahraga Mingguan', required: true, options: ['< 1 Kali', '1 - 3 Kali', '> 3 Kali (Rutin)'] },
      { id: 'f4', type: 'Upload', label: 'Unggah Hasil Hasil Lab Gula Darah (Jika Ada)', required: false },
      { id: 'f5', type: 'Checkbox', label: 'Bersedia Mengikuti Program Monitoring RPM', required: false }
    ]
  }
];

export const MOCK_STUDIO_PLUGINS: StudioPluginItem[] = [
  {
    id: 'plug-01',
    title: 'Midtrans & Xendit Healthcare Payment Gateway',
    category: 'Payment Gateway',
    developer: 'PT Midtrans Indonesia',
    downloadsCount: 1420,
    rating: 4.9,
    isInstalled: true,
    version: 'v2.1.0',
    priceModel: 'Per-Transaction',
    icon: 'CreditCard'
  },
  {
    id: 'plug-02',
    title: 'Wablas & Twilio WhatsApp Business API Gateway',
    category: 'WhatsApp / SMS',
    developer: 'Wablas Global',
    downloadsCount: 2890,
    rating: 4.8,
    isInstalled: true,
    version: 'v4.0.2',
    priceModel: 'Subscription',
    icon: 'MessageSquare'
  },
  {
    id: 'plug-03',
    title: 'BPJS V-Claim & E-Klaim INA-CBG Bridge Adapter',
    category: 'E-Klaim',
    developer: 'SmartMedika Engineering',
    downloadsCount: 3500,
    rating: 5.0,
    isInstalled: true,
    version: 'v5.3.1',
    priceModel: 'Free',
    icon: 'FileCheck'
  },
  {
    id: 'plug-04',
    title: 'Claude 3.5 & DeepSeek R1 Medical AI Provider',
    category: 'AI Model Provider',
    developer: 'Anthropic & DeepSeek Labs',
    downloadsCount: 940,
    rating: 4.7,
    isInstalled: false,
    version: 'v1.2.0',
    priceModel: 'Per-Transaction',
    icon: 'Brain'
  }
];

export const MOCK_STUDIO_ETL_JOBS: StudioEtlJob[] = [
  {
    id: 'etl-01',
    name: 'Puskesmas HL7 v2 to SATUSEHAT FHIR R4 Ingestion',
    sourceType: 'HL7 v2 Message',
    targetTable: 'fhir_patient_observation_store',
    transformationRules: 'HL7 ADT_A01 -> FHIR Patient & Enocunter Resource',
    frequency: 'Real-time Event',
    status: 'Running',
    lastRunTimestamp: '2026-08-03 00:48:12',
    recordsProcessedToday: 18450
  },
  {
    id: 'etl-02',
    name: 'PACS Metadata Sync to Cloud AI Analytics Storage',
    sourceType: 'DICOM PACS Meta',
    targetTable: 'radiology_ai_image_index',
    transformationRules: 'DICOM Tag 0010,0020 -> Anonymized Patient ID + Series UID',
    frequency: 'Hourly Cron',
    status: 'Idle',
    lastRunTimestamp: '2026-08-03 00:00:00',
    recordsProcessedToday: 3200
  }
];

export const MOCK_STUDIO_PROMPTS: StudioPromptDefinition[] = [
  {
    id: 'p-01',
    title: 'Prompt Triase IGD & Deteksi Sepsis Dini',
    category: 'Triage Assistance',
    version: 'v4.2',
    templateContent: 'Anda adalah Asisten AI Triase Medis Senior. Analisis tanda vital {{vitals}} dan keluhan utama {{symptoms}}. Hitung skor SOFA/qSOFA dan berikan rekomendasi kategori triase IGD.',
    targetModel: 'Gemini 1.5 Flash',
    avgLatencyMs: 240,
    accuracyScorePct: 98.4
  },
  {
    id: 'p-02',
    title: 'Prompt Auto-Summarizer Resume Medis Pasien Pulang',
    category: 'Medical Resume Summarizer',
    version: 'v2.1',
    templateContent: 'Ekstrak riwayat perawatan {{admission_notes}}, hasil lab {{lab_results}}, dan prosedur {{procedures}}. Susun resume medis ringkas sesuai standar ICD-10 dan INA-CBG.',
    targetModel: 'Gemini 1.5 Pro',
    avgLatencyMs: 680,
    accuracyScorePct: 99.1
  }
];

export const MOCK_STUDIO_AGENTS: StudioAgentDefinition[] = [
  {
    id: 'ag-01',
    name: 'Clinical Audit & Fraud Prevention Agent',
    role: 'Financial Audit Agent',
    toolsAttached: ['BPJS V-Claim Checker', 'ICD-10 Coding Validator', 'EMR Dosage Audit Tool'],
    memoryType: 'Hybrid Graph Memory',
    status: 'Active',
    executionCount24h: 1420
  },
  {
    id: 'ag-02',
    name: 'Smart Ambulance Emergency Route Optimizer Agent',
    role: 'Smart Ambulance Dispatcher',
    toolsAttached: ['Google Maps Route Matrix', 'Hospital Bed Availability API', 'Traffic Sensor Stream'],
    memoryType: 'Short-Term Ephemeral',
    status: 'Active',
    executionCount24h: 380
  }
];

export const MOCK_STUDIO_TENANT_CONFIG: StudioTenantConfig = {
  tenantId: 'tenant-rsud-jaksel-01',
  tenantName: 'RSUD Jakarta Selatan (Apotek & Trauma Center)',
  primaryColorHex: '#0f766e',
  accentColorHex: '#06b6d4',
  logoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=120&auto=format&fit=crop&q=80',
  customDomain: 'rsudjaksel.smartmedika.id',
  language: 'id',
  timezone: 'Asia/Jakarta',
  currency: 'IDR',
  activeModules: ['EMR', 'HIS', 'LIS', 'RIS', 'PACS', 'AI_Triage', 'NoCode_Studio', 'Healthcare_Exchange'],
  mfaEnforced: true
};

export const MOCK_PRODUCTION_CLUSTERS: ProductionClusterNode[] = [
  {
    id: 'k8s-01',
    clusterName: 'prod-cgk-primary-01',
    provider: 'GCP GKE',
    region: 'ap-southeast-1 (Jakarta)',
    role: 'Primary Active',
    status: 'Healthy',
    nodesCount: 16,
    cpuUsagePct: 42,
    memoryUsagePct: 58,
    activePods: 340,
    uptimePct: 99.99
  },
  {
    id: 'k8s-02',
    clusterName: 'dr-sin-secondary-02',
    provider: 'AWS EKS',
    region: 'ap-southeast-2 (Singapore)',
    role: 'Secondary Disaster Recovery',
    status: 'Failover Standby',
    nodesCount: 8,
    cpuUsagePct: 15,
    memoryUsagePct: 24,
    activePods: 120,
    uptimePct: 100.0
  },
  {
    id: 'k8s-03',
    clusterName: 'hybrid-onprem-hospital-mesh',
    provider: 'RedHat OpenShift',
    region: 'ap-southeast-1 (Jakarta)',
    role: 'Edge Gateway',
    status: 'Healthy',
    nodesCount: 6,
    cpuUsagePct: 38,
    memoryUsagePct: 45,
    activePods: 85,
    uptimePct: 99.95
  }
];

export const MOCK_SECURITY_THREATS: SecurityThreatIncident[] = [
  {
    id: 'sec-01',
    title: 'Anomali Botnet Traffic Rate Limiting pada Endpoint FHIR /Observation',
    severity: 'High',
    category: 'WAF DDoS Mitigation',
    targetComponent: 'API Gateway Ingress',
    status: 'Mitigated',
    timestamp: '2026-08-03 00:52:10',
    riskScore: 84,
    aiMitigationAction: 'Auto Cloudflare WAF Challenge Enforced & IP Subnet Blocked'
  },
  {
    id: 'sec-02',
    title: 'Percobaan Akses Tanpa Token M2M pada Microservice DICOM PACS',
    severity: 'Medium',
    category: 'Zero-Trust Identity',
    targetComponent: 'PACS Gateway Service',
    status: 'Resolved',
    timestamp: '2026-08-03 00:21:45',
    riskScore: 45,
    aiMitigationAction: 'Invalid Bearer Token Dropped & Audit Event Logged'
  },
  {
    id: 'sec-03',
    title: 'Rotasi Otomatis Enkripsi Database Firestore AES-256 Key',
    severity: 'Low',
    category: 'Database Encryption',
    targetComponent: 'KMS Key Vault',
    status: 'Resolved',
    timestamp: '2026-08-02 23:00:00',
    riskScore: 10,
    aiMitigationAction: 'Routine KMS Key Rotation Executed Successfully'
  }
];

export const MOCK_COMPLIANCE_FRAMEWORKS: ComplianceFrameworkItem[] = [
  {
    id: 'comp-01',
    frameworkCode: 'Permenkes SATUSEHAT',
    totalControlsCount: 42,
    passedControlsCount: 42,
    complianceScorePct: 100.0,
    lastAuditDate: '2026-07-28',
    status: 'Compliant',
    evidenceDocumentUrl: 'https://satusehat.kemkes.go.id/certification/cert-2026-8819'
  },
  {
    id: 'comp-02',
    frameworkCode: 'ISO 27001',
    totalControlsCount: 114,
    passedControlsCount: 112,
    complianceScorePct: 98.2,
    lastAuditDate: '2026-06-15',
    status: 'Compliant',
    evidenceDocumentUrl: 'https://smartmedika.id/compliance/iso27001-audit.pdf'
  },
  {
    id: 'comp-03',
    frameworkCode: 'SOC 2 Type II',
    totalControlsCount: 88,
    passedControlsCount: 88,
    complianceScorePct: 100.0,
    lastAuditDate: '2026-05-10',
    status: 'Compliant',
    evidenceDocumentUrl: 'https://smartmedika.id/compliance/soc2-type2.pdf'
  },
  {
    id: 'comp-04',
    frameworkCode: 'GDPR / PDPL Indonesia',
    totalControlsCount: 35,
    passedControlsCount: 34,
    complianceScorePct: 97.1,
    lastAuditDate: '2026-07-01',
    status: 'Audit Ready',
    evidenceDocumentUrl: 'https://smartmedika.id/compliance/pdpl-consent-matrix.pdf'
  }
];

export const MOCK_FINOPS_METRICS: FinOpsCostMetric[] = [
  {
    id: 'fin-01',
    tenantOrHospitalName: 'RSUD Jakarta Selatan (Primary Tenant)',
    monthlySpendUsd: 12450,
    budgetCapUsd: 15000,
    aiGpuUsagePct: 62,
    cloudStorageTb: 14.5,
    costEfficiencyScorePct: 92.4,
    optimizationRecommendation: 'Scale down 2 unused staging pods during off-peak hours (22:00 - 05:00).'
  },
  {
    id: 'fin-02',
    tenantOrHospitalName: 'Silom General Network (Branch Tenant)',
    monthlySpendUsd: 8200,
    budgetCapUsd: 10000,
    aiGpuUsagePct: 45,
    cloudStorageTb: 8.2,
    costEfficiencyScorePct: 95.1,
    optimizationRecommendation: 'Migrate cold DICOM imaging storage to GCP Nearline to save 30% storage costs.'
  }
];

export const MOCK_SERVICE_DESK_TICKETS: ServiceDeskTicket[] = [
  {
    id: 'ticket-01',
    ticketNumber: 'INC-2026-8812',
    hospitalClientName: 'RSUD Jakarta Selatan',
    summary: 'Koneksi HL7 v2 dari LIS Prodia Mengalami Latency di Atas 2 Detik',
    priority: 'P2 - Major',
    status: 'In Progress',
    slaMinutesRemaining: 45,
    assignedEngineer: 'Budi (DevOps Lead)',
    createdAt: '2026-08-03 00:15:00'
  },
  {
    id: 'ticket-02',
    ticketNumber: 'REQ-2026-9011',
    hospitalClientName: 'RS Kanker Dharmais Partner',
    summary: 'Permintaan Penambahan Quota API Key Sandbox untuk Integrasi AI Oncology',
    priority: 'P3 - Moderate',
    status: 'Open',
    slaMinutesRemaining: 180,
    assignedEngineer: 'Siti (Partner Success)',
    createdAt: '2026-08-03 00:30:00'
  }
];

export const MOCK_FEATURE_FLAGS: FeatureFlagItem[] = [
  {
    id: 'flag-01',
    flagKey: 'ENABLE_REALTIME_FHIR_STREAM',
    description: 'Mengaktifkan streaming WebSocket FHIR R4 real-time untuk monitor bed ICU.',
    enabledGlobal: true,
    targetTenants: ['all'],
    environment: 'Production',
    rolloutPct: 100
  },
  {
    id: 'flag-02',
    flagKey: 'ENABLE_AI_SEPSIS_CANARY',
    description: 'Pengujian awal model AI Sepsis Warning v3.2 pada unit IGD RSUD Jaksel.',
    enabledGlobal: false,
    targetTenants: ['tenant-rsud-jaksel-01'],
    environment: 'Canary',
    rolloutPct: 25
  }
];

export const MOCK_PRODUCTION_READINESS: ProductionReadinessItem[] = [
  {
    id: 'chk-01',
    category: 'Infrastructure & High Availability',
    checkItem: 'Multi-Region Failover Latency < 60s',
    status: 'PASSED',
    details: 'Teruji pada simulasi DR Drill 28 Juli 2026: Automatic RTO 24s, RPO 0s.'
  },
  {
    id: 'chk-02',
    category: 'Security Operations & SOC',
    checkItem: 'Zero-Trust Network Architecture & AES-256 Encryption at Rest',
    status: 'PASSED',
    details: 'Mtls antar microservices aktif 100% dengan HashiCorp Vault key rotation.'
  },
  {
    id: 'chk-03',
    category: 'Compliance & Audit',
    checkItem: 'Sertifikasi Kemenkes SATUSEHAT Interoperability Level 5',
    status: 'PASSED',
    details: 'Lolos pengujian audit teknis Kemenkes DTO & BSSN.'
  },
  {
    id: 'chk-04',
    category: 'Backup & Disaster Recovery',
    checkItem: 'Snapshot Multi-Region Cloud Storage Automated Every 1 Hour',
    status: 'PASSED',
    details: 'RPO database Firestore & PostgreSQL < 1 detik dengan WAL streaming.'
  },
  {
    id: 'chk-05',
    category: 'FinOps & Cost Governance',
    checkItem: 'Auto-Scaling Pods & Budget Cap Alerts per Tenant',
    status: 'PASSED',
    details: 'FinOps AI Agent otomatis merekomendasikan pencadangan GPU instance.'
  },
  {
    id: 'chk-06',
    category: 'Observability & SLA',
    checkItem: '99.99% Monthly Service Uptime SLA Metrics',
    status: 'PASSED',
    details: 'Prometheus & Grafana Alerting terhubung dengan PagerDuty & Slack Incident Channel.'
  }
];






