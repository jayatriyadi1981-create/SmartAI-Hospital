/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'Super Admin'
  | 'Hospital Owner'
  | 'Direktur'
  | 'Wakil Direktur'
  | 'Manajemen'
  | 'Dokter'
  | 'Dokter Spesialis'
  | 'Perawat'
  | 'Bidan'
  | 'Farmasi'
  | 'Laboratorium'
  | 'Radiologi'
  | 'Kasir'
  | 'Pendaftaran'
  | 'Keuangan'
  | 'HRD'
  | 'Gudang'
  | 'Teknisi'
  | 'Marketing'
  | 'Customer Service'
  | 'IT Support'
  | 'Pasien';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department?: string;
  hospitalId: string;
  hospitalName: string;
  mfaEnabled: boolean;
}

export interface HospitalInfo {
  id: string;
  name: string;
  code: string;
  classType: 'A' | 'B' | 'C' | 'D';
  address: string;
  phone: string;
  emergencyHotline: string;
  logo: string;
  totalBeds: number;
}

export interface StatCard {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
  timeframe: string;
  category: 'clinical' | 'financial' | 'operational' | 'occupancy';
  iconName: string;
}

export interface PatientVisitData {
  time: string;
  rawatJalan: number;
  rawatInap: number;
  igd: number;
  total: number;
}

export interface RevenueData {
  month: string;
  pendapatanUmum: number;
  klaimBPJS: number;
  asuransiSwasta: number;
  total: number;
}

export interface BedOccupancyData {
  category: string;
  total: number;
  occupied: number;
  available: number;
  percentage: number;
}

export interface TopPenyakitData {
  code: string;
  name: string;
  cases: number;
  category: string;
}

export interface TopPoliData {
  name: string;
  visits: number;
  doctors: number;
}

export interface AIModule {
  id: string;
  title: string;
  description: string;
  status: 'Ready' | 'Running' | 'Coming Soon';
  category: 'Clinical' | 'Operations' | 'Diagnostics' | 'Executive' | 'Automation';
  icon: string;
  badgeColor: string;
}

export interface AIPrediction {
  id: string;
  title: string;
  category: 'Patient Surge' | 'BOR Forecast' | 'Revenue' | 'Inventory' | 'Asset Maintenance' | 'IGD Overload' | 'Alert Pasien';
  confidenceScore: number; // 0 - 100
  summary: string;
  recommendation: string;
  severity: 'high' | 'medium' | 'low';
  timeframe: string;
}

export interface BuildingStatus {
  id: string;
  name: string;
  code: string;
  floors: number;
  totalBeds: number;
  occupiedBeds: number;
  activeSurgeries: number;
  status: 'Normal' | 'High Occupancy' | 'Emergency Alert';
}

export interface OperatingRoomStatus {
  id: string;
  name: string;
  procedure: string;
  doctor: string;
  patientRM: string;
  status: 'In Progress' | 'Preparing' | 'Sterilizing' | 'Available';
  startTime?: string;
  estimatedEndTime?: string;
}

export interface AmbulanceStatus {
  id: string;
  code: string;
  driver: string;
  paramedic: string;
  location: string;
  destination: string;
  status: 'Available' | 'Dispatched' | 'On Scene' | 'Returning' | 'Maintenance';
  etaMinutes?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'Emergency' | 'Pasien' | 'Farmasi' | 'Laboratorium' | 'Keuangan' | 'Asset' | 'AI Alert' | 'BPJS';
  read: boolean;
  actionUrl?: string;
  priority: 'urgent' | 'high' | 'normal';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: 'Doctor Schedule' | 'Surgery' | 'Meeting' | 'Maintenance' | 'Training' | 'Holiday';
  doctorOrHost?: string;
  location?: string;
  status: 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface MasterDataItem {
  id: string;
  code: string;
  name: string;
  category: string;
  status: 'Active' | 'Inactive';
  details?: Record<string, any>;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userName: string;
  role: UserRole;
  action: string;
  module: string;
  ipAddress: string;
  device: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

// ==========================================
// TAHAP 2: PROMPT 2 DATA TYPES
// ==========================================

export type PatientCategory =
  | 'Pasien Baru'
  | 'Pasien Lama'
  | 'Pasien BPJS'
  | 'Pasien Asuransi'
  | 'Pasien Umum'
  | 'Emergency'
  | 'MCU'
  | 'Telemedicine'
  | 'Home Care';

export interface Patient {
  id: string;
  norm: string; // RM Number e.g. RM-2026-00812
  nik: string;
  bpjsCardNo?: string;
  insuranceNo?: string;
  insuranceProvider?: string;
  fullName: string;
  nickname?: string;
  birthPlace: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Laki-laki' | 'Perempuan';
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  religion: string;
  maritalStatus: 'Belum Menikah' | 'Menikah' | 'Janda/Duda';
  occupation: string;
  education: string;
  address: string;
  province: string;
  city: string;
  district: string;
  subdistrict: string;
  postalCode: string;
  phone: string;
  email: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  language: string;
  nationality: string;
  photoUrl?: string;
  ktpScanUrl?: string;
  bpjsScanUrl?: string;
  referralLetterUrl?: string;
  status: 'Aktif' | 'Rawat Inap' | 'Rawat Jalan' | 'Selesai' | 'Meninggal';
  registeredAt: string;
  category: PatientCategory;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface PatientTimelineEvent {
  id: string;
  patientId: string;
  timestamp: string;
  category: 'Registrasi' | 'Poli' | 'IGD' | 'Rawat Inap' | 'Operasi' | 'Lab' | 'Radiologi' | 'Farmasi' | 'Pembayaran' | 'Telemedicine';
  title: string;
  description: string;
  doctorOrOfficer?: string;
  location?: string;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Pending';
  documents?: string[];
}

export interface Appointment {
  id: string;
  appointmentCode: string;
  patientId: string;
  patientName: string;
  norm: string;
  nik: string;
  phone: string;
  polyName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  serviceType: 'BPJS' | 'Asuransi' | 'Umum' | 'MCU' | 'Vaksin' | 'Telemedicine' | 'Home Care';
  status: 'Confirmed' | 'Checked-In' | 'Completed' | 'Cancelled';
  queueNumber?: string;
  estimatedWaitMinutes?: number;
  aiRecommendationReason?: string;
  notes?: string;
}

export interface QueueItem {
  id: string;
  queueNumber: string; // e.g. A-012, B-005, IGD-003
  patientId: string;
  patientName: string;
  norm: string;
  polyName: string; // or Department (e.g. Poli Paru, IGD, Lab, Kasir, Farmasi)
  doctorName: string;
  category: 'Rawat Jalan' | 'Rawat Inap' | 'IGD' | 'Laboratorium' | 'Radiologi' | 'Farmasi' | 'Kasir';
  serviceType: 'BPJS' | 'Umum' | 'Asuransi' | 'Emergency Priority';
  status: 'Waiting' | 'Calling' | 'In Service' | 'Completed' | 'Skipped';
  calledAt?: string;
  estimatedWaitMinutes: number;
  priorityScore: number; // 1 (normal) to 10 (emergency triage)
  aiDelayAlert?: boolean;
  aiDelayReason?: string;
}

export interface VitalSign {
  id: string;
  patientId: string;
  timestamp: string;
  systolic: number; // mmHg
  diastolic: number; // mmHg
  heartRate: number; // bpm
  respiratoryRate: number; // bpm
  temperature: number; // C
  spO2: number; // %
  weightKg: number;
  heightCm: number;
  bmi: number;
  painScore: number; // 0-10
  gcsScore: number; // 3-15
}

export interface SOAPNote {
  id: string;
  medicalRecordId: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  timestamp: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  version: number;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  visitDate: string;
  polyName: string;
  doctorName: string;
  visitType: 'Rawat Jalan' | 'Rawat Inap' | 'IGD' | 'Telemedicine';
  soap?: SOAPNote;
  primaryICD10: { code: string; name: string };
  secondaryICD10?: { code: string; name: string }[];
  procedureICD9CM?: { code: string; name: string }[];
  vitalSigns?: VitalSign;
  prescriptions?: { drugName: string; dosage: string; frequency: string; duration: string }[];
  labOrders?: { testName: string; result?: string; status: 'Ordered' | 'Done' }[];
  radiologyOrders?: { scanType: string; result?: string; status: 'Ordered' | 'Done' }[];
  nursingNotes?: string;
  nutritionNotes?: string;
  consentSigned?: boolean;
  referralLetter?: string;
  attachments?: string[];
  status: 'Open' | 'Closed' | 'Verified';
}

export interface ClinicalAlert {
  id: string;
  patientId: string;
  alertType: 'Alergi' | 'Diabetes' | 'Hipertensi' | 'Stroke' | 'Jantung' | 'Kehamilan' | 'Risiko Jatuh' | 'Infeksi' | 'MRSA' | 'COVID';
  severity: 'Critical' | 'High' | 'Moderate';
  description: string;
  detectedAt: string;
}

export interface PatientAISummary {
  patientId: string;
  summaryText: string;
  chronicDiseaseHistory: string[];
  drugAllergies: string[];
  surgicalHistory: string[];
  currentHealthStatus: string;
  highRiskFactors: string[];
  aiGeneratedAt: string;
}

// ==========================================
// TAHAP 3: CLINICAL CARE SYSTEM DATA TYPES
// ==========================================

export type TriageCategory = 'Merah' | 'Kuning' | 'Hijau' | 'Hitam';
export type EmergencyStatus = 'Arrival' | 'Registration' | 'Triage' | 'Treatment' | 'Observation' | 'Admission' | 'Referral' | 'Discharge' | 'Death';

export interface EmergencyVisit {
  id: string;
  patientId: string;
  patientName: string;
  norm: string;
  arrivalMethod: 'Ambulans' | 'Datang Sendiri' | 'Rujukan' | 'Polisi / Pengantar';
  arrivalTime: string;
  triageCategory: TriageCategory;
  triageNurse: string;
  chiefComplaint: string;
  gcsScore: number;
  ewsScore: number;
  vitalSigns: VitalSign;
  assignedDoctor: string;
  status: EmergencyStatus;
  bedNumber?: string;
  aiPriorityReason: string;
}

export type BedStatus = 'Kosong' | 'Terisi' | 'Cleaning' | 'Maintenance' | 'Reserved' | 'Transfer';
export type WardClass = 'VVIP' | 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'Isolasi' | 'ICU' | 'HCU' | 'NICU' | 'PICU';

export interface BedItem {
  id: string;
  wardName: string; // e.g. Mawar 101-A
  wardClass: WardClass;
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  norm?: string;
  doctorInCharge?: string;
  nurseInCharge?: string;
  admissionDate?: string;
  estimatedDischargeDate?: string;
  dailyRate: number;
}

export interface WardMetrics {
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;
  borPercent: number; // Bed Occupancy Rate
  losDays: number; // Length of Stay
  toiDays: number; // Turn Over Interval
  btoTimes: number; // Bed Turn Over
  aiPrediction: string;
}

export interface ICUMonitorItem {
  id: string;
  bedName: string; // ICU-01, HCU-02, NICU-03
  patientName: string;
  norm: string;
  age: number;
  diagnosis: string;
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  respiratoryRate: number;
  temperature: number;
  spO2: number;
  ventilatorMode: string; // e.g. SIMV, CPAP, Off
  infusionRateMlHr: number;
  urineOutputMlHr: number;
  gcsScore: number;
  ewsScore: number;
  aiAlerts: {
    sepsisRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
    shockRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
    respiratoryFailureRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
    cardiacArrestRisk: 'Low' | 'Moderate' | 'High' | 'Critical';
  };
}

export type OperationType = 'Elective' | 'Emergency' | 'Day Surgery';
export type OperationStage = 'Pre-op' | 'Time Out' | 'Operasi' | 'Recovery' | 'Post-op';

export interface OperationSchedule {
  id: string;
  operatingRoomName: string; // OK 1, OK 2
  patientId: string;
  patientName: string;
  norm: string;
  procedureName: string;
  type: OperationType;
  surgeonName: string;
  anesthesiologistName: string;
  scrubNurseName: string;
  scheduledTime: string;
  estimatedDurationMins: number;
  actualStage: OperationStage;
  whoChecklist: {
    signInDone: boolean;
    timeOutDone: boolean;
    signOutDone: boolean;
  };
  aiDelayPredictionMins: number;
}

export interface NurseTask {
  id: string;
  patientId: string;
  patientName: string;
  bedName: string;
  taskType: 'Pemberian Obat' | 'Vital Sign' | 'Infus' | 'Kateter' | 'Perawatan Luka' | 'Mobilisasi' | 'Edukasi';
  description: string;
  scheduledTime: string;
  status: 'Pending' | 'Completed' | 'Delayed';
  nurseName?: string;
}

export interface CDSSRecommendation {
  id: string;
  patientId: string;
  chiefComplaint: string;
  suspectedDiagnoses: {
    disease: string;
    probability: number; // %
    icd10: string;
  }[];
  recommendedTests: string[];
  clinicalGuidelines: string[];
  drugInteractions: {
    drug1: string;
    drug2: string;
    severity: 'Mild' | 'Moderate' | 'Severe';
    warning: string;
  }[];
  criticalWarnings: string[];
}

export interface PrescriptionOrder {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  orderDate: string;
  items: {
    drugName: string;
    dosage: string;
    frequency: string;
    durationDays: number;
    route: string;
    instructions: string;
  }[];
  status: 'Pending' | 'Dispensed' | 'Completed';
  aiCheckWarning?: string;
}

export interface DigitalConsent {
  id: string;
  patientId: string;
  patientName: string;
  consentType: 'Operasi / Tindakan' | 'Anestesi' | 'Rawat Inap' | 'Transfusi Darah' | 'Pelepasan Informasi';
  doctorName: string;
  dateSigned: string;
  signatureUrl?: string;
  qrVerified: boolean;
  status: 'Disetujui' | 'Ditolak' | 'Draft';
}

export interface DischargeSummaryRecord {
  id: string;
  patientId: string;
  patientName: string;
  norm: string;
  admissionDate: string;
  dischargeDate: string;
  primaryDiagnosis: string;
  icd10Code: string;
  surgicalProcedures?: string;
  dischargeMedications: string[];
  followUpInstructions: string;
  controlDate: string;
  doctorSignature: string;
  aiDraftGenerated: boolean;
}

export interface CareTeamMember {
  id: string;
  role: 'Dokter DPJP' | 'Dokter Konsul' | 'Perawat Primar' | 'Apoteker Klinis' | 'Ahli Gizi' | 'Fisioterapis' | 'Case Manager';
  name: string;
  phone: string;
  notes: string;
  lastUpdated: string;
}

// ==========================================
// TAHAP 4: MEDICAL SUPPORT SYSTEM DATA TYPES
// ==========================================

export type LabCategory =
  | 'Hematology'
  | 'Clinical Chemistry'
  | 'Immunology'
  | 'Serology'
  | 'Microbiology'
  | 'Parasitology'
  | 'Urinalysis'
  | 'Blood Gas'
  | 'PCR / Molecular'
  | 'Hormone'
  | 'Tumor Marker'
  | 'Culture & Sensitivity';

export type LabStatus = 'Order' | 'Sample Collected' | 'In Laboratory' | 'Analyzer Testing' | 'Validated' | 'Result Verified';

export interface LabTestResultItem {
  testCode: string;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  flag: 'Normal' | 'High' | 'Low' | 'Critical';
}

export interface LabOrder {
  id: string;
  patientId: string;
  patientName: string;
  norm: string;
  orderDoctor: string;
  category: LabCategory;
  specimenBarcode: string;
  orderDate: string;
  status: LabStatus;
  criticalAlert: boolean;
  analyzerMachine: string;
  results: LabTestResultItem[];
  aiInterpretation?: {
    abnormalSummary: string;
    diseaseRiskScore: string;
    clinicalCorrelation: string;
    recommendedFollowUp: string;
  };
}

export type RadiologyModality = 'X-Ray' | 'CT Scan' | 'MRI' | 'USG' | 'Mammography' | 'DEXA' | 'Fluoroscopy' | 'Cath Lab';

export interface RadiologyOrder {
  id: string;
  patientId: string;
  patientName: string;
  norm: string;
  modality: RadiologyModality;
  examinationName: string;
  orderDoctor: string;
  radiologistName: string;
  technicianName: string;
  orderDate: string;
  status: 'Order' | 'Scheduled' | 'Imaging Done' | 'Reading' | 'Verified';
  dicomStudyId: string;
  radiologyReport: string;
  aiAnalysis?: {
    detectedConditions: string[];
    probabilityScore: number; // %
    severityScore: 'Mild' | 'Moderate' | 'Critical';
    findingSummary: string;
    heatmapCoordinates?: string;
  };
}

export interface DICOMStudy {
  studyInstanceUid: string;
  patientName: string;
  norm: string;
  modality: RadiologyModality;
  studyDate: string;
  studyDescription: string;
  seriesCount: number;
  imageCount: number;
  sampleImageUrl: string;
  aiOverlayAvailable: boolean;
}

export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type BloodComponent = 'WB (Whole Blood)' | 'PRC (Packed Red Cells)' | 'TC (Thrombocyte Concentrate)' | 'FFP (Fresh Frozen Plasma)' | 'Cryoprecipitate';

export interface BloodInventoryItem {
  id: string;
  bloodType: BloodType;
  component: BloodComponent;
  bagNumber: string;
  donorName: string;
  collectionDate: string;
  expiryDate: string;
  storageTempCelsius: number;
  status: 'Available' | 'Crossmatched' | 'Transfused' | 'Expired';
}

export interface BloodCrossmatch {
  id: string;
  patientName: string;
  norm: string;
  bloodType: BloodType;
  requiredComponent: BloodComponent;
  bagNumberAssigned: string;
  compatibilityResult: 'Compatible (Match)' | 'Incompatible' | 'Pending';
  technicianName: string;
  requestTime: string;
}

export interface DietOrder {
  id: string;
  patientName: string;
  norm: string;
  wardBed: string;
  dietType: 'Low Salt (RG)' | 'Diabetes Mellitus (DM)' | 'High Protein' | 'Renal / Gagal Ginjal' | 'Soft Food' | 'Liquid Diet';
  caloriesKcal: number;
  foodAllergies: string[];
  nutritionistName: string;
  mealDeliveryStatus: 'Meal Prepared' | 'In Transit' | 'Delivered' | 'Consumed';
  aiDietRecommendation: string;
}

export interface RehabSession {
  id: string;
  patientName: string;
  norm: string;
  therapyType: 'Physiotherapy' | 'Occupational Therapy' | 'Speech Therapy' | 'Cardiac Rehab' | 'Neurology Rehab';
  therapistName: string;
  scheduledTime: string;
  exercisePlan: string;
  progressNotes: string;
  outcomeScore: number; // 0 - 100
  aiExerciseRecommendation: string;
}

export interface CSSDBatch {
  id: string;
  batchNumber: string;
  autoclaveMachineId: string;
  sterilizationType: 'Steam Autoclave 134C' | 'Plasma Sterilization' | 'ETO Gas';
  instrumentSetName: string;
  itemsCount: number;
  startTime: string;
  expiryDate: string;
  status: 'Washing' | 'Packing' | 'Sterilizing' | 'Sterile Ready' | 'Distributed';
  biologicalIndicator: 'PASSED (Negative)' | 'FAILED' | 'Testing';
}

export interface MedicalDeviceIoT {
  id: string;
  deviceName: string;
  location: string; // e.g. ICU Bed 1
  protocol: 'HL7 v2.5' | 'FHIR R4' | 'DICOM Service' | 'IoT Gateway Direct';
  ipAddress: string;
  status: 'Online Active' | 'Transmitting Data' | 'Warning' | 'Offline';
  lastPing: string;
  telemetryData: {
    metricName: string;
    value: string;
  }[];
}

export interface AmbulanceDispatch {
  id: string;
  callSign: string;
  ambulanceType: 'Advance Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Transport Emergency';
  driverName: string;
  paramedicName: string;
  destinationLocation: string;
  status: 'Standby' | 'En Route to Location' | 'On Scene' | 'Transporting to ER' | 'Completed';
  gpsCoordinates: string;
  etaMinutes: number;
  aiFastestRoute: string;
}

export interface MortuaryRecord {
  id: string;
  deceasedName: string;
  norm: string;
  dateOfDeath: string;
  timeOfDeath: string;
  causeOfDeath: string;
  freezerBoxNumber: string;
  releasingFamilyName: string;
  releaseStatus: 'In Storage' | 'Autopsy' | 'Released to Family';
  deathCertificateGenerated: boolean;
}

export interface MedicalCertificate {
  id: string;
  certificateType: 'Surat Keterangan Sakit' | 'Surat Keterangan Sehat' | 'Medical Check Up (MCU)' | 'Surat Kematian' | 'Surat Kelahiran' | 'Surat Vaksinasi';
  patientName: string;
  norm: string;
  issuedDoctor: string;
  issueDate: string;
  validDays?: number;
  summaryNote: string;
  digitalSignatureQr: string;
  verifiedStatus: 'Verified Official' | 'Draft';
}

// ==========================================
// TAHAP 5: ENTERPRISE BUSINESS & OPERATIONS TYPES
// ==========================================

export interface DrugMaster {
  id: string;
  code: string;
  name: string;
  category: 'Antibiotik' | 'Analgetik' | 'Kardiologi' | 'Antidiabetes' | 'Anestesi' | 'Narkotika' | 'Psikotropika' | 'BHP / Alkes';
  formula: string;
  unit: string;
  minStock: number;
  currentStock: number;
  unitPrice: number;
  sellingPrice: number;
  fastMovingStatus: 'Fast Moving' | 'Slow Moving' | 'Dead Stock';
  supplierName: string;
  barcode: string;
  aiRestockForecastDays: number;
  drugInteractions: string[];
}

export interface DrugBatch {
  id: string;
  drugId: string;
  drugName: string;
  batchNumber: string;
  expiredDate: string; // YYYY-MM-DD
  quantity: number;
  warehouseLocation: string; // e.g. Depo Farmasi Rawat Inap Rak A-2
  fefoPriority: number; // 1 = Highest FEFO Priority
}

export interface DrugDispense {
  id: string;
  prescriptionId: string;
  patientName: string;
  norm: string;
  unitType: 'Inpatient' | 'Outpatient' | 'Emergency';
  dispensedItems: {
    drugName: string;
    dosage: string;
    quantity: number;
    batchNumber: string;
  }[];
  dispensedBy: string;
  dispenseTime: string;
  status: 'Draft' | 'Compounding' | 'Ready for Patient' | 'Dispensed';
  narcoticLedgerChecked: boolean;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: 'Medical Supply' | 'Non Medical' | 'ATK' | 'BHP' | 'Linen' | 'Kitchen' | 'Cleaning' | 'Gas Medis';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  warehouseName: string;
  valuationTotal: number;
  valuationMethod: 'FIFO' | 'FEFO' | 'Average';
  aiConsumptionTrend: string;
}

export interface PurchaseRequest {
  id: string;
  prNumber: string;
  department: string;
  requestedBy: string;
  requestDate: string;
  items: {
    itemName: string;
    quantity: number;
    estimatedPrice: number;
  }[];
  totalEstimatedAmount: number;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'PO Issued' | 'Rejected';
  approvalLevelRequired: 'Level 1 Manager' | 'Level 2 Director';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  prNumber: string;
  vendorName: string;
  poDate: string;
  deliveryDueDate: string;
  totalAmount: number;
  status: 'Issued to Vendor' | 'Partially Received' | 'Completed' | 'Cancelled';
  paymentTerms: string;
}

export interface SupplierVendor {
  id: string;
  vendorName: string;
  code: string;
  npwp: string;
  category: 'Farmasi & Obat' | 'Alat Kesehatan' | 'IT & Hardware' | 'Linen & Laundry' | 'Gas Medis';
  contractStatus: 'Active Contract' | 'Under Renewal' | 'Blacklisted';
  performanceScore: number; // 0 - 100
  slaRating: string; // e.g. 98.5%
  aiVendorRating: 'Preferred Tier 1' | 'Standard Tier 2' | 'High Risk';
  contactPhone: string;
}

export interface AssetMaster {
  id: string;
  assetCode: string;
  name: string;
  category: 'Gedung' | 'Ambulans' | 'MRI' | 'CT Scan' | 'USG' | 'Ventilator' | 'Patient Monitor' | 'IT Equipment';
  department: string;
  purchaseDate: string;
  acquisitionCost: number;
  currentValue: number;
  qrCodeTag: string;
  gpsTrackingId?: string;
  calibrationDueDate: string;
  status: 'Operational' | 'In Repair' | 'Under Maintenance' | 'Retired';
}

export interface BiomedicalWorkOrder {
  id: string;
  woNumber: string;
  assetName: string;
  assetCode: string;
  maintenanceType: 'Preventive Maintenance' | 'Corrective Repair' | 'Calibration Testing';
  technicianName: string;
  createdDate: string;
  completedDate?: string;
  downtimeHours: number;
  mtbfHours: number;
  mttrHours: number;
  status: 'Scheduled' | 'In Progress' | 'Completed Passed Calibration';
  aiFailureRiskScore: number; // 0 - 100
}

export interface GeneralLedgerAccount {
  accountCode: string;
  accountName: string;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number;
  costCenter: string;
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  patientName: string;
  norm: string;
  visitType: 'Rawat Jalan' | 'Rawat Inap' | 'IGD' | 'MCU';
  registrationFee: number;
  consultationFee: number;
  labFee: number;
  radiologyFee: number;
  pharmacyFee: number;
  roomFee: number;
  procedureFee: number;
  totalAmount: number;
  depositPaid: number;
  remainingBalance: number;
  paymentMethod?: 'QRIS' | 'Virtual Account' | 'Credit Card' | 'BPJS Direct' | 'Cash';
  paymentStatus: 'Unpaid' | 'Partial' | 'Paid Full' | 'Insurance Claimed';
  createdDate: string;
}

export interface BPJSSEPClaim {
  id: string;
  sepNumber: string;
  patientName: string;
  bpjsCardNumber: string;
  norm: string;
  serviceType: 'Rawat Jalan (RJTP)' | 'Rawat Inap (RITP)' | 'Emergency';
  inacbgCode: string;
  inacbgDescription: string;
  estimatedClaimAmount: number;
  approvedClaimAmount: number;
  claimStatus: 'SEP Issued' | 'Verification Pending' | 'Approved' | 'Disputed / Pending' | 'Rejected' | 'Paid BPJS';
  aiRejectionRisk: 'Low' | 'Medium' | 'High Risk (Coding Error)';
  aiRiskNotes: string;
}

export interface EmployeeRecord {
  id: string;
  employeeNip: string;
  name: string;
  role: 'Dokter Spesialis' | 'Dokter Umum' | 'Perawat' | 'Bidan' | 'Apoteker' | 'Laboran' | 'Radiografer' | 'Kasir' | 'HR & Admin' | 'IT';
  department: string;
  strNumber?: string;
  strExpiryDate?: string;
  sipNumber?: string;
  sipExpiryDate?: string;
  employmentStatus: 'Tetap' | 'Kontrak' | 'Mitra Dokter';
  basicSalary: number;
  medicalFeeShare: number;
  kpiScore: number; // 0 - 100
  credentialStatus: 'Valid' | 'Needs Re-credentialing' | 'Expiring Soon';
}

export interface ShiftAttendanceRecord {
  id: string;
  employeeName: string;
  nip: string;
  date: string;
  shiftType: 'Morning (07:00-15:00)' | 'Evening (15:00-23:00)' | 'Night (23:00-07:00)' | 'On Call Emergency';
  checkInTime: string;
  checkOutTime: string;
  method: 'Face Recognition AI' | 'Fingerprint' | 'GPS Mobile' | 'QR Code';
  status: 'Present On-Time' | 'Late' | 'Overtime' | 'On Leave';
}

export interface CRMMember {
  id: string;
  patientName: string;
  norm: string;
  tier: 'Silver' | 'Gold' | 'Platinum' | 'VIP Executive';
  loyaltyPoints: number;
  phoneWhatsApp: string;
  segment: 'MCU Regular' | 'Chronic Diabetes' | 'Hypertension' | 'Maternal Care' | 'Pediatric Care';
  lastVisitDate: string;
  npsScore: number;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  channel: 'WhatsApp' | 'SMS' | 'Email' | 'Push App';
  targetSegment: string;
  scheduledDate: string;
  sentCount: number;
  conversionRate: number; // e.g. 18.5%
  aiTargetRecommendation: string;
  status: 'Draft' | 'Scheduled' | 'Active' | 'Completed';
}

export interface ExecutiveBIReport {
  monthlyRevenue: number;
  monthlyExpense: number;
  netProfit: number;
  cashFlowBalance: number;
  bedOccupancyRateBOR: number; // e.g. 84.5%
  lengthOfStayLOS: number; // e.g. 3.8 days
  turnOverIntervalTOI: number; // e.g. 1.2 days
  bedTurnOverBTO: number; // e.g. 4.2 times
  bpjsUnclaimedAmount: number;
  activeInpatients: number;
  aiRevenueLeakageRisk: number;
}

// ==========================================
// TAHAP 6: SMART AI HOSPITAL ECOSYSTEM TYPES
// ==========================================

export interface IoTDeviceSensor {
  id: string;
  deviceName: string;
  deviceType: 'Patient Monitor' | 'Ventilator' | 'Infusion Pump' | 'Smart Bed' | 'RFID Location' | 'Medical Gas Pressure' | 'Ambient Temp/Humidity' | 'CCTV Analytics';
  location: string; // Building / Floor / Room / Bed
  status: 'Online Normal' | 'Warning Alert' | 'Critical Alarm' | 'Offline Maintenance';
  batteryLevel?: number;
  lastTelemetry: {
    heartRate?: number;
    spO2?: number;
    sysBP?: number;
    diaBP?: number;
    tempC?: number;
    humidityPct?: number;
    gasPressurePsi?: number;
    infusionRateMlHr?: number;
    bedOccupied?: boolean;
    fallDetected?: boolean;
  };
  lastUpdate: string;
}

export interface DigitalTwinRoom {
  id: string;
  building: string;
  floor: string;
  roomNumber: string;
  roomType: 'ICU' | 'Rawat Inap VVIP' | 'Kamar Operasi (OK)' | 'UGD Red Zone' | 'Isolasi Negatif' | 'Poliklinik';
  totalBeds: number;
  occupiedBeds: number;
  temperatureC: number;
  humidityPct: number;
  medicalGasO2Psi: number;
  powerStatus: 'Grid Normal' | 'Genset Backup Active';
  activeAlerts: number;
}

export interface RPMDeviceData {
  id: string;
  patientName: string;
  norm: string;
  deviceType: 'Smart Watch ECG' | 'Continuous Glucometer' | 'Bluetooth BP Monitor' | 'SpO2 Oximeter';
  bpmRate: number;
  bloodSugarMgDl?: number;
  sysBP?: number;
  diaBP?: number;
  spO2Pct?: number;
  aiAnomalyAlert: boolean;
  aiAnomalyMessage?: string;
  lastSyncTime: string;
}

export interface MultiHospitalTenant {
  id: string;
  hospitalName: string;
  hospitalType: 'Tipe A' | 'Tipe B' | 'Tipe C' | 'Tipe D' | 'Jaringan / Group';
  tenantDomain: string;
  licenseTier: 'Enterprise Multi-Hospital' | 'Per Bed License' | 'SaaS Monthly Professional' | 'White-Label Holding';
  activeBeds: number;
  activeUsers: number;
  subscriptionExpiry: string;
  satuSehatBridgeStatus: 'Connected Sync 100%' | 'Pending Auth' | 'Offline';
  customBranding: {
    primaryColor: string;
    logoUrl?: string;
  };
}

export interface SatuSehatFHIRGatewayLog {
  id: string;
  resourceType: 'Patient' | 'Encounter' | 'Condition' | 'Observation' | 'MedicationRequest' | 'DiagnosticReport';
  fhirId: string;
  localNorm: string;
  syncTimestamp: string;
  httpStatus: 200 | 201 | 400 | 500;
  satusehatUuid: string;
  responsePayload: string;
}

export interface SecurityDevOpsCenter {
  clusterStatus: 'Kubernetes Multi-Region HA Active' | 'Failover Secondary Online';
  cpuUtilizationPct: number;
  memoryUtilizationPct: number;
  siemSecurityThreatsDetected: number;
  zeroTrustMfaEnforced: boolean;
  openTelemetryActiveSpans: number;
  lastBackupTimestamp: string;
}

// ==========================================
// TAHAP 7: AGENTIC AI HOSPITAL ECOSYSTEM TYPES
// ==========================================

export interface AIAgentItem {
  id: string;
  name: string;
  roleCategory: 'Clinical & Triage' | 'Medical Scribe' | 'Diagnostics & Labs' | 'Pharmacy & Inventory' | 'Nursing & ICU' | 'Operations & Bed' | 'Finance & Procurement' | 'HR & Marketing' | 'Executive & Compliance' | 'Cyber Security' | 'Front Office & Voice';
  description: string;
  avatarIcon: string; // Icon identifier
  status: 'Active Autonomous' | 'Awaiting Human Approval' | 'Standby' | 'Training / fine-tuning';
  modelAssigned: string; // e.g. Gemini 3.6 Flash / DeepSeek R1 / Claude 3.5 Sonnet
  systemPrompt: string;
  toolsAllowed: string[];
  tasksCompleted: number;
  humanApprovalsPending: number;
  accuracyRatePct: number;
  avgLatencyMs: number;
}

export interface AIAgentTask {
  id: string;
  taskName: string;
  assignedAgentId: string;
  assignedAgentName: string;
  status: 'Completed' | 'In Progress' | 'Requires Human Approval' | 'Queued' | 'Failed';
  inputSummary: string;
  outputResult?: string;
  humanAuthorizedBy?: string;
  timestamp: string;
}

export interface AIAgentWorkflowStep {
  stepNumber: number;
  stepName: string;
  assignedAgent: string;
  actionRequired: string;
  status: 'Completed' | 'Active' | 'Pending';
  requiresHumanSignature: boolean;
}

export interface HumanApprovalItem {
  id: string;
  ticketNumber: string;
  requesterAgent: string;
  category: 'Resep & Farmasi' | 'Tindakan Operasi' | 'Draft SOAP Scribe' | 'Pengadaan RFQ' | 'Discharge Pasien' | 'Fraud Audit Billing';
  patientNormOrSubject: string;
  aiRecommendation: string;
  clinicalOrFinancialRisk: 'Rendah' | 'Sedang' | 'Tinggi (Kritis)';
  status: 'Pending Authorization' | 'Approved' | 'Rejected' | 'Modified & Approved';
  requestedAt: string;
  authorizedBy?: string;
  authorizationNotes?: string;
}

export interface KnowledgeBaseDocument {
  id: string;
  title: string;
  category: 'SOP Klinis' | 'Clinical Guideline' | 'Drug Database' | 'Hospital Policy' | 'WHO / Kemenkes RI' | 'Medical Journal';
  chunksCount: number;
  vectorDbStatus: 'Indexed in Qdrant Vector' | 'Indexing...';
  lastUpdated: string;
  summary: string;
}

export interface AIModelRouterItem {
  modelName: string;
  provider: 'Google Gemini' | 'OpenAI' | 'Anthropic Claude' | 'DeepSeek' | 'Meta Llama' | 'Qwen' | 'Local On-Premise';
  latencyMs: number;
  costPer1kTokensUsd: number;
  accuracyScore: number;
  activeWorkloads: string;
  status: 'Primary Optimal' | 'Fallback Active' | 'Standby';
}

export interface AIObservabilityMetric {
  totalTokensToday: number;
  estCostTodayUsd: number;
  avgResponseLatencyMs: number;
  hallucinationRatePct: number;
  auditTrailLogsCount: number;
  humanApprovalRatePct: number;
}

export interface AIChatMessage {
  id: string;
  sender: 'User' | 'AI Agent' | 'System Gateway';
  agentId?: string;
  agentName?: string;
  content: string;
  timestamp: string;
  requiresApproval?: boolean;
  approvalStatus?: 'Pending' | 'Approved' | 'Rejected';
  modelUsed?: string;
  attachedFile?: string;
}

// ==========================================
// PROMPT 8: HEALTHCARE SUPER ECOSYSTEM TYPES
// ==========================================

export interface NationalHealthExchangeNode {
  id: string;
  systemName: string; // 'SATUSEHAT Kemenkes', 'BPJS Health v2', 'National Lab Exchange', 'e-Klaim INA-CBG', 'Master Patient Index (MPI)'
  protocol: 'FHIR R4' | 'HL7 v2.5' | 'DICOM Web' | 'REST / JSON' | 'BPJS TrustMark';
  status: 'Synced Live' | 'Syncing' | 'Standby / Fallback';
  recordsProcessedToday: number;
  lastSyncTimestamp: string;
  healthConsentVerified: boolean;
}

export interface ProviderNetworkItem {
  id: string;
  name: string;
  type: 'Rumah Sakit' | 'Klinik Utama' | 'Puskesmas' | 'Laboratorium Eksternal' | 'Apotek Jaringan' | 'Ambulance Unit' | 'Home Care Provider';
  region: string;
  interopStatus: 'Connected FHIR' | 'Syncing' | 'Offline';
  activeReferralsCount: number;
  rating: number;
  contactNumber: string;
}

export interface WearableDeviceTelemetry {
  id: string;
  deviceName: string; // 'Apple Watch Series 9', 'Garmin Fenix 7', 'Fitbit Sense 2', 'Samsung Galaxy Watch 6'
  platform: 'Apple Health' | 'Google Health Connect' | 'Garmin Connect' | 'Fitbit' | 'Samsung Health';
  patientName: string;
  heartRateBpm: number;
  bloodPressureSystolicDiastolic: string;
  spO2Percent: number;
  stepsToday: number;
  sleepHours: number;
  aiEarlyWarningAlert: 'Normal' | 'Mild Tachicardia' | 'Hypoxia Warning' | 'Arrhythmia Detected';
  lastSyncedAt: string;
}

export interface SmartAmbulanceTelemetry {
  unitId: string;
  driverName: string;
  paramedicName: string;
  currentLocationGPS: string;
  destinationHospital: string;
  patientCondition: string;
  etaMinutes: number;
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
  };
  aiRouteOptimization: string;
  status: 'En Route to Scene' | 'Transporting Patient' | 'Available' | 'Maintenance';
}

export interface CorporateMCUClient {
  id: string;
  companyName: string;
  industry: string;
  totalEmployees: number;
  mcuPackageName: string;
  completedMcuPct: number;
  fitToWorkStatus: {
    fit: number;
    fitWithRestriction: number;
    unfitTemporary: number;
  };
  occupationalHealthAlert: string;
}

export interface PopulationHealthPrediction {
  id: string;
  diseaseName: string; // 'DHF / Demam Berdarah', 'ISPA / Acute Respiratory', 'Tuberculosis', 'Diabetes Mellitus Type 2'
  regionCode: string; // 'DKI Jakarta - Jaktim', 'Jawa Barat - Bandung', 'Jawa Timur - Surabaya'
  riskLevel: 'Kritis (Outbreak Alert)' | 'Waspada Tinggi' | 'Sedang' | 'Rendah';
  predictedCasesNext30Days: number;
  aiOutbreakProbabilityPct: number;
  recommendedIntervention: string;
  vaccinationCoveragePct: number;
}

export interface HealthcareMarketplaceItem {
  id: string;
  title: string;
  category: 'Alat Kesehatan' | 'Obat & Farmasi' | 'Paket Lab & MCU' | 'Layanan Home Care' | 'Rental Alkes' | 'Asuransi Kesehatan';
  vendorName: string;
  priceIdr: number;
  rating: number;
  stockQty: number;
  imageUrl: string;
  isBpomCertified: boolean;
}

export interface DeveloperPortalKey {
  id: string;
  appName: string;
  organizationName: string;
  apiKeyMasked: string;
  environment: 'Production' | 'Sandbox';
  rateLimitPerMin: number;
  webhookUrl: string;
  requestsCount24h: number;
  status: 'Active' | 'Rate Limited' | 'Revoked';
}

// Tahap 9 - Developer Platform & No-Code/Low-Code Studio Interfaces
export interface StudioWorkflowNode {
  id: string;
  type: 'Start' | 'Approval' | 'Decision' | 'AI_Agent' | 'Notification' | 'API_Call' | 'Database' | 'End';
  label: string;
  configSummary: string;
  positionX: number;
  positionY: number;
}

export interface StudioWorkflowDefinition {
  id: string;
  name: string;
  category: 'Patient Admission' | 'Clinical Lab Routing' | 'Pharmacy Dispensing' | 'Procurement Approval' | 'Insurance Claims';
  status: 'Published' | 'Draft' | 'Archived';
  nodesCount: number;
  triggerEvent: string;
  lastModifiedBy: string;
  version: string;
  nodes: StudioWorkflowNode[];
}

export interface StudioFormElement {
  id: string;
  type: 'Text' | 'Select' | 'Date' | 'Radio' | 'Checkbox' | 'Upload' | 'Signature' | 'QR_Scanner';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface StudioFormDefinition {
  id: string;
  title: string;
  category: 'Rekam Medis' | 'Surat Izin' | 'Konsent Pasien' | 'Survey Kepuasan' | 'MCU Form';
  elementsCount: number;
  status: 'Active' | 'Draft';
  version: string;
  elements: StudioFormElement[];
}

export interface StudioDashboardWidget {
  id: string;
  title: string;
  type: 'KPI_Card' | 'Bar_Chart' | 'Line_Chart' | 'Pie_Chart' | 'Heatmap' | 'AI_Insight';
  dataBinding: string;
  refreshRateSeconds: number;
}

export interface StudioPluginItem {
  id: string;
  title: string;
  category: 'Payment Gateway' | 'WhatsApp / SMS' | 'Insurance Connector' | 'IoT Device' | 'AI Model Provider' | 'E-Klaim';
  developer: string;
  downloadsCount: number;
  rating: number;
  isInstalled: boolean;
  version: string;
  priceModel: 'Free' | 'Subscription' | 'Per-Transaction';
  icon: string;
}

export interface StudioEtlJob {
  id: string;
  name: string;
  sourceType: 'HL7 v2 Message' | 'FHIR JSON Bundle' | 'DICOM PACS Meta' | 'Excel / CSV' | 'REST Webhook';
  targetTable: string;
  transformationRules: string;
  frequency: 'Real-time Event' | 'Hourly Cron' | 'Daily Batch';
  status: 'Running' | 'Idle' | 'Failed';
  lastRunTimestamp: string;
  recordsProcessedToday: number;
}

export interface StudioPromptDefinition {
  id: string;
  title: string;
  category: 'Triage Assistance' | 'Medical Resume Summarizer' | 'ICD-10 Auto Coding' | 'Drug Interaction Checker';
  version: string;
  templateContent: string;
  targetModel: 'Gemini 1.5 Pro' | 'Gemini 1.5 Flash' | 'Claude 3.5 Sonnet' | 'DeepSeek R1';
  avgLatencyMs: number;
  accuracyScorePct: number;
}

export interface StudioAgentDefinition {
  id: string;
  name: string;
  role: 'Clinical Decision Agent' | 'Financial Audit Agent' | 'Smart Ambulance Dispatcher' | 'Patient Concierge';
  toolsAttached: string[];
  memoryType: 'Short-Term Ephemeral' | 'Long-Term Vector RAG' | 'Hybrid Graph Memory';
  status: 'Active' | 'Testing' | 'Disabled';
  executionCount24h: number;
}

export interface StudioTenantConfig {
  tenantId: string;
  tenantName: string;
  primaryColorHex: string;
  accentColorHex: string;
  logoUrl: string;
  customDomain: string;
  language: 'id' | 'en';
  timezone: 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura';
  currency: 'IDR' | 'USD';
  activeModules: string[];
  mfaEnforced: boolean;
}

// Tahap 10 - Production Ready & Global Enterprise Interfaces
export interface ProductionClusterNode {
  id: string;
  clusterName: string;
  provider: 'AWS EKS' | 'GCP GKE' | 'Azure AKS' | 'RedHat OpenShift' | 'On-Premise Hybrid';
  region: 'ap-southeast-1 (Jakarta)' | 'ap-southeast-2 (Singapore)' | 'us-east-1 (N. Virginia)' | 'eu-central-1 (Frankfurt)';
  role: 'Primary Active' | 'Secondary Disaster Recovery' | 'Edge Gateway';
  status: 'Healthy' | 'Degraded' | 'Syncing' | 'Failover Standby';
  nodesCount: number;
  cpuUsagePct: number;
  memoryUsagePct: number;
  activePods: number;
  uptimePct: number;
}

export interface SecurityThreatIncident {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: 'WAF DDoS Mitigation' | 'Zero-Trust Identity' | 'API Anomaly' | 'Database Encryption' | 'Ransomware Shield';
  targetComponent: string;
  status: 'Mitigated' | 'Investigating' | 'Resolved';
  timestamp: string;
  riskScore: number;
  aiMitigationAction: string;
}

export interface ComplianceFrameworkItem {
  id: string;
  frameworkCode: 'ISO 27001' | 'SOC 2 Type II' | 'HIPAA Compliance' | 'GDPR / PDPL Indonesia' | 'Permenkes SATUSEHAT';
  totalControlsCount: number;
  passedControlsCount: number;
  complianceScorePct: number;
  lastAuditDate: string;
  status: 'Compliant' | 'Audit Ready' | 'Review Required';
  evidenceDocumentUrl: string;
}

export interface FinOpsCostMetric {
  id: string;
  tenantOrHospitalName: string;
  monthlySpendUsd: number;
  budgetCapUsd: number;
  aiGpuUsagePct: number;
  cloudStorageTb: number;
  costEfficiencyScorePct: number;
  optimizationRecommendation: string;
}

export interface ServiceDeskTicket {
  id: string;
  ticketNumber: string;
  hospitalClientName: string;
  summary: string;
  priority: 'P1 - Critical S1' | 'P2 - Major' | 'P3 - Moderate' | 'P4 - Minor';
  status: 'Open' | 'In Progress' | 'Resolved' | 'SLA Breached';
  slaMinutesRemaining: number;
  assignedEngineer: string;
  createdAt: string;
}

export interface FeatureFlagItem {
  id: string;
  flagKey: string;
  description: string;
  enabledGlobal: boolean;
  targetTenants: string[];
  environment: 'Production' | 'Staging' | 'Canary';
  rolloutPct: number;
}

export interface ProductionReadinessItem {
  id: string;
  category: 'Infrastructure & High Availability' | 'Security Operations & SOC' | 'Compliance & Audit' | 'Backup & Disaster Recovery' | 'FinOps & Cost Governance' | 'Observability & SLA';
  checkItem: string;
  status: 'PASSED' | 'WARNING' | 'PENDING';
  details: string;
}






