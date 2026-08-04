/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Patient,
  NotificationItem,
  AuditLogEntry,
  PrescriptionOrder,
  LabOrder,
  RadiologyOrder,
  BillingInvoice,
  BPJSSEPClaim,
  EmergencyVisit,
  BedItem,
  ICUMonitorItem
} from '../types';
import {
  MOCK_PATIENTS,
  NOTIFICATIONS,
  AUDIT_LOGS,
  MOCK_PRESCRIPTION_ORDERS,
  MOCK_LAB_ORDERS,
  MOCK_RADIOLOGY_ORDERS,
  MOCK_BILLING_INVOICES,
  MOCK_BPJS_CLAIMS,
  MOCK_EMERGENCY_VISITS,
  MOCK_BEDS,
  MOCK_ICU_MONITORS
} from '../data/mockData';

export interface LiveMetrics {
  totalPatientsToday: number;
  activeIGD: number;
  borPct: number;
  activeICU: number;
  pendingPharmacy: number;
  pendingBPJSClaims: number;
  satuSehatSyncedCount: number;
  todayRevenueIdr: number;
}

interface HospitalDataContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedPatient: Patient;
  setSelectedPatient: (patient: Patient) => void;
  navigateToPatientModule: (patient: Patient, targetView: string) => void;
  
  // Collections
  patients: Patient[];
  addPatient: (patientData: Partial<Patient>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  
  notifications: NotificationItem[];
  addNotification: (item: { title: string; message: string; category?: NotificationItem['category']; type?: 'urgent' | 'high' | 'normal' }) => void;
  markAllNotificationsRead: () => void;
  
  activityLogs: AuditLogEntry[];
  addActivityLog: (actionName: string, moduleName: string, userName?: string) => void;
  
  prescriptions: PrescriptionOrder[];
  addPrescription: (order: Partial<PrescriptionOrder>) => void;
  updatePrescriptionStatus: (id: string, status: PrescriptionOrder['status']) => void;
  
  labOrders: LabOrder[];
  addLabOrder: (order: Partial<LabOrder>) => void;
  
  radiologyOrders: RadiologyOrder[];
  addRadiologyOrder: (order: Partial<RadiologyOrder>) => void;
  
  billingInvoices: BillingInvoice[];
  addBillingInvoice: (invoice: Partial<BillingInvoice>) => void;
  
  bpjsClaims: BPJSSEPClaim[];
  addBPJSClaim: (claim: Partial<BPJSSEPClaim>) => void;
  
  emergencyVisits: EmergencyVisit[];
  addEmergencyVisit: (visit: Partial<EmergencyVisit>) => void;
  
  beds: BedItem[];
  updateBedStatus: (bedId: string, status: BedItem['status'], patientName?: string) => void;
  
  icuMonitors: ICUMonitorItem[];
  
  // Real-time synchronization state
  isRealtimeActive: boolean;
  setIsRealtimeActive: (active: boolean) => void;
  lastSyncedTime: string;
  triggerSimulatedLiveUpdate: () => void;
  liveMetrics: LiveMetrics;
}

const HospitalDataContext = createContext<HospitalDataContextType | undefined>(undefined);

export const HospitalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<string>('Dashboard');
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<Patient>(MOCK_PATIENTS[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const [activityLogs, setActivityLogs] = useState<AuditLogEntry[]>(AUDIT_LOGS);
  const [prescriptions, setPrescriptions] = useState<PrescriptionOrder[]>(MOCK_PRESCRIPTION_ORDERS);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
  const [radiologyOrders, setRadiologyOrders] = useState<RadiologyOrder[]>(MOCK_RADIOLOGY_ORDERS);
  const [billingInvoices, setBillingInvoices] = useState<BillingInvoice[]>(MOCK_BILLING_INVOICES);
  const [bpjsClaims, setBpjsClaims] = useState<BPJSSEPClaim[]>(MOCK_BPJS_CLAIMS);
  const [emergencyVisits, setEmergencyVisits] = useState<EmergencyVisit[]>(MOCK_EMERGENCY_VISITS);
  const [beds, setBeds] = useState<BedItem[]>(MOCK_BEDS);
  const [icuMonitors, setIcuMonitors] = useState<ICUMonitorItem[]>(MOCK_ICU_MONITORS);
  
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(new Date().toLocaleTimeString('id-ID'));

  // Live calculated metrics across all modules
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalPatientsToday: 1248,
    activeIGD: 24,
    borPct: 78.4,
    activeICU: 18,
    pendingPharmacy: 14,
    pendingBPJSClaims: 6,
    satuSehatSyncedCount: 4120,
    todayRevenueIdr: 485000000
  });

  const navigateToPatientModule = (patient: Patient, targetView: string) => {
    setSelectedPatient(patient);
    setCurrentView(targetView);
    addActivityLog(`Akses Modul [${targetView}] untuk pasien ${patient.fullName} (${patient.norm})`, targetView);
  };

  const addPatient = (patientData: Partial<Patient>): Patient => {
    const newNorm = `RM-2026-${Math.floor(Math.random() * 9000) + 1000}`;
    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      norm: newNorm,
      nik: patientData.nik || '3171012026990001',
      bpjsCardNo: patientData.bpjsCardNo || '000123456789',
      fullName: patientData.fullName || 'Pasien Baru',
      birthPlace: patientData.birthPlace || 'Jakarta',
      birthDate: patientData.birthDate || '1990-01-01',
      gender: patientData.gender || 'Laki-laki',
      bloodType: patientData.bloodType || 'O+',
      religion: 'Islam',
      maritalStatus: 'Menikah',
      occupation: 'Swasta',
      education: 'S1',
      address: patientData.address || 'Jakarta',
      province: 'DKI Jakarta',
      city: 'Jakarta Pusat',
      district: 'Gambir',
      subdistrict: 'Petojo',
      postalCode: '10110',
      phone: patientData.phone || '081234567890',
      email: 'pasien@medika.id',
      emergencyContact: {
        name: 'Keluarga Pasien',
        relationship: 'Orang Tua',
        phone: '081299998888'
      },
      language: 'Indonesia',
      nationality: 'WNI',
      status: 'Aktif',
      registeredAt: new Date().toISOString(),
      category: 'Pasien BPJS',
      allergies: patientData.allergies || ['Tidak ada']
    };

    setPatients((prev) => [newPatient, ...prev]);
    setSelectedPatient(newPatient);

    // Synchronize into metrics and notifications
    addNotification({
      title: 'Pasien Baru Terdaftar',
      message: `${newPatient.fullName} (${newPatient.norm}) berhasil didaftarkan. Auto-sync SATUSEHAT active.`,
      category: 'Pasien',
      type: 'normal'
    });

    addActivityLog(`Pendaftaran Pasien Baru ${newPatient.fullName} [${newPatient.norm}]`, 'Pendaftaran & Admisi');

    setLiveMetrics((prev) => ({
      ...prev,
      totalPatientsToday: prev.totalPatientsToday + 1,
      satuSehatSyncedCount: prev.satuSehatSyncedCount + 1
    }));

    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    if (selectedPatient.id === id) {
      setSelectedPatient((prev) => ({ ...prev, ...updates }));
    }
  };

  const addNotification = (item: { title: string; message: string; category?: NotificationItem['category']; type?: 'urgent' | 'high' | 'normal' }) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: item.title,
      message: item.message,
      timestamp: 'Baru saja',
      category: item.category || 'Pasien',
      read: false,
      priority: item.type || 'normal'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addActivityLog = (actionName: string, moduleName: string, userName = 'dr. Hendra, Sp.PD') => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID'),
      userName: userName,
      role: 'Dokter Spesialis',
      action: actionName,
      module: moduleName,
      ipAddress: '192.168.1.102',
      device: 'Chrome Windows / SIMRS Web',
      severity: 'Info'
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  const addPrescription = (order: Partial<PrescriptionOrder>) => {
    const newOrder: PrescriptionOrder = {
      id: `rx-${Date.now()}`,
      patientId: order.patientId || selectedPatient.id,
      patientName: order.patientName || selectedPatient.fullName,
      doctorId: 'd-101',
      doctorName: order.doctorName || 'dr. Hendra, Sp.PD',
      orderDate: new Date().toLocaleTimeString('id-ID'),
      status: 'Pending',
      items: order.items || [
        { drugName: 'Amoxicillin 500mg', dosage: '500mg', frequency: '3x1', durationDays: 5, route: 'Oral', instructions: 'Sesudah makan' }
      ],
      aiCheckWarning: 'Aman (Lolos Cek Interaksi AI)'
    };
    setPrescriptions((prev) => [newOrder, ...prev]);
    addNotification({
      title: 'Resep Elektronik Dikirim ke Farmasi',
      message: `Resep untuk ${newOrder.patientName} berhasil diteruskan ke Depo Farmasi.`,
      category: 'Farmasi',
      type: 'normal'
    });
    addActivityLog(`Order Resep E-Prescription untuk ${newOrder.patientName}`, 'e-Prescription & Orders');
    setLiveMetrics((prev) => ({ ...prev, pendingPharmacy: prev.pendingPharmacy + 1 }));
  };

  const updatePrescriptionStatus = (id: string, status: PrescriptionOrder['status']) => {
    setPrescriptions((prev) =>
      prev.map((rx) => (rx.id === id ? { ...rx, status } : rx))
    );
    if (status === 'Dispensed') {
      setLiveMetrics((prev) => ({ ...prev, pendingPharmacy: Math.max(0, prev.pendingPharmacy - 1) }));
    }
  };

  const addLabOrder = (order: Partial<LabOrder>) => {
    const newLab: LabOrder = {
      id: `lab-${Date.now()}`,
      patientId: order.patientId || selectedPatient.id,
      patientName: order.patientName || selectedPatient.fullName,
      norm: selectedPatient.norm,
      orderDoctor: order.orderDoctor || 'dr. Hendra, Sp.PD',
      category: order.category || 'Clinical Chemistry',
      specimenBarcode: `BAR-${Math.floor(Math.random() * 90000) + 10000}`,
      orderDate: new Date().toLocaleTimeString('id-ID'),
      status: 'Order',
      criticalAlert: false,
      analyzerMachine: 'Cobas c501 LIS Analyzer',
      results: [
        { testCode: 'GLU', testName: 'Glukosa Darah Puasa', resultValue: '110', unit: 'mg/dL', referenceRange: '70 - 100', flag: 'High' }
      ]
    };
    setLabOrders((prev) => [newLab, ...prev]);
    addNotification({
      title: 'Order Lab LIS Dikirim',
      message: `Pemeriksaan Lab untuk ${newLab.patientName} sedang dianalisis instrumen LIS.`,
      category: 'Laboratorium',
      type: 'normal'
    });
    addActivityLog(`Order LIS Laboratorium untuk ${newLab.patientName}`, 'Laboratorium Sentral');
  };

  const addRadiologyOrder = (order: Partial<RadiologyOrder>) => {
    const newRad: RadiologyOrder = {
      id: `rad-${Date.now()}`,
      patientId: order.patientId || selectedPatient.id,
      patientName: order.patientName || selectedPatient.fullName,
      norm: selectedPatient.norm,
      modality: order.modality || 'CT Scan',
      examinationName: order.examinationName || 'CT Scan Thorax Non-Kontras',
      orderDoctor: order.orderDoctor || 'dr. Hendra, Sp.PD',
      radiologistName: 'dr. Ratna, Sp.Rad',
      technicianName: 'Budi, A.Md.Rad',
      orderDate: new Date().toLocaleTimeString('id-ID'),
      status: 'Order',
      dicomStudyId: `dicom-${Date.now()}`,
      radiologyReport: 'Hasil pindaian awal normal, tidak tampak infiltrat pulmo.'
    };
    setRadiologyOrders((prev) => [newRad, ...prev]);
    addNotification({
      title: 'Order Radiologi PACS Terkirim',
      message: `Pemeriksaan ${newRad.modality} (${newRad.examinationName}) dijadwalkan di Radiologi.`,
      category: 'Laboratorium',
      type: 'normal'
    });
    addActivityLog(`Order PACS Radiologi untuk ${newRad.patientName}`, 'Radiologi & PACS');
  };

  const addBillingInvoice = (invoice: Partial<BillingInvoice>) => {
    const newInv: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(Math.random() * 9000) + 1000}`,
      patientName: invoice.patientName || selectedPatient.fullName,
      norm: selectedPatient.norm,
      visitType: invoice.visitType || 'Rawat Jalan',
      registrationFee: 50000,
      consultationFee: 250000,
      labFee: 450000,
      radiologyFee: 800000,
      pharmacyFee: 650000,
      roomFee: 0,
      procedureFee: 250000,
      totalAmount: invoice.totalAmount || 2450000,
      depositPaid: 0,
      remainingBalance: invoice.totalAmount || 2450000,
      paymentMethod: invoice.paymentMethod || 'QRIS',
      paymentStatus: 'Unpaid',
      createdDate: new Date().toLocaleDateString('id-ID')
    };
    setBillingInvoices((prev) => [newInv, ...prev]);
    addActivityLog(`Pembuatan Tagihan Billing ${newInv.invoiceNumber}`, 'Keuangan & Billing');
  };

  const addBPJSClaim = (claim: Partial<BPJSSEPClaim>) => {
    const newClaim: BPJSSEPClaim = {
      id: `sep-${Date.now()}`,
      sepNumber: `SEP-1301R0012026P${Math.floor(Math.random() * 9000) + 1000}`,
      patientName: claim.patientName || selectedPatient.fullName,
      bpjsCardNumber: selectedPatient.bpjsCardNo || '000123456789',
      norm: selectedPatient.norm,
      serviceType: claim.serviceType || 'Rawat Jalan (RJTP)',
      inacbgCode: 'E-4-10-I',
      inacbgDescription: 'Penyakit Endokrin & Metabolik Ringan',
      estimatedClaimAmount: claim.estimatedClaimAmount || 4800000,
      approvedClaimAmount: claim.approvedClaimAmount || 4800000,
      claimStatus: 'Verification Pending',
      aiRejectionRisk: 'Low',
      aiRiskNotes: 'Sesuai indikasi medis & coding ICD-10.'
    };
    setBpjsClaims((prev) => [newClaim, ...prev]);
    addNotification({
      title: 'Klaim BPJS V-Claim Terdaftar',
      message: `SEP ${newClaim.sepNumber} untuk ${newClaim.patientName} berhasil terdaftar V-Claim.`,
      category: 'BPJS',
      type: 'normal'
    });
    addActivityLog(`Verifikasi SEP BPJS ${newClaim.sepNumber}`, 'BPJS V-Claim');
  };

  const addEmergencyVisit = (visit: Partial<EmergencyVisit>) => {
    const newVisit: EmergencyVisit = {
      id: `ev-${Date.now()}`,
      patientId: selectedPatient.id,
      patientName: visit.patientName || 'Pasien Darurat',
      norm: selectedPatient.norm,
      arrivalMethod: 'Ambulans',
      arrivalTime: new Date().toLocaleTimeString('id-ID'),
      triageCategory: 'Kuning',
      triageNurse: 'Suster Ani, S.Kep',
      chiefComplaint: visit.chiefComplaint || 'Nyeri dada akut & sesak napas',
      gcsScore: 15,
      ewsScore: 4,
      vitalSigns: {
        id: `vs-${Date.now()}`,
        patientId: selectedPatient.id,
        timestamp: new Date().toISOString(),
        systolic: 140,
        diastolic: 90,
        heartRate: 98,
        respiratoryRate: 22,
        temperature: 37.2,
        spO2: 96,
        weightKg: 65,
        heightCm: 168,
        bmi: 23,
        painScore: 5,
        gcsScore: 15
      },
      assignedDoctor: visit.assignedDoctor || 'dr. Maya, Sp.JP',
      status: 'Triage',
      aiPriorityReason: 'Potensi NACS / Sindrom Koroner Akut'
    };
    setEmergencyVisits((prev) => [newVisit, ...prev]);
    addNotification({
      title: 'Pasien Masuk Triage IGD',
      message: `${newVisit.patientName} telah terdaftar di IGD.`,
      category: 'Emergency',
      type: 'urgent'
    });
    addActivityLog(`Kedatangan Pasien IGD ${newVisit.patientName}`, 'IGD & Triage AI');
    setLiveMetrics((prev) => ({ ...prev, activeIGD: prev.activeIGD + 1 }));
  };

  const updateBedStatus = (bedId: string, status: BedItem['status'], patientName?: string) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status, currentPatientName: patientName || b.currentPatientName } : b))
    );
    addActivityLog(`Update Bed Management ID ${bedId} -> Status: ${status}`, 'Rawat Inap & Bed');
  };

  // Real-Time Simulator Loop (Ticking every 5 seconds when active)
  useEffect(() => {
    if (!isRealtimeActive) return;

    const interval = setInterval(() => {
      triggerSimulatedLiveUpdate();
    }, 5000);

    return () => clearInterval(interval);
  }, [isRealtimeActive]);

  const triggerSimulatedLiveUpdate = () => {
    setLastSyncedTime(new Date().toLocaleTimeString('id-ID'));

    // Randomize telemetry fluctuations
    setIcuMonitors((prev) =>
      prev.map((icu) => {
        const hrDelta = Math.floor(Math.random() * 5) - 2;
        const newHR = Math.min(140, Math.max(50, icu.heartRate + hrDelta));
        const spo2Delta = Math.floor(Math.random() * 3) - 1;
        const newSpO2 = Math.min(100, Math.max(88, icu.spO2 + spo2Delta));
        return {
          ...icu,
          heartRate: newHR,
          spO2: newSpO2
        };
      })
    );

    // Increment SATUSEHAT synced count occasionally
    setLiveMetrics((prev) => ({
      ...prev,
      satuSehatSyncedCount: prev.satuSehatSyncedCount + Math.floor(Math.random() * 2) + 1
    }));
  };

  return (
    <HospitalDataContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedPatient,
        setSelectedPatient,
        navigateToPatientModule,
        patients,
        addPatient,
        updatePatient,
        notifications,
        addNotification,
        markAllNotificationsRead,
        activityLogs,
        addActivityLog,
        prescriptions,
        addPrescription,
        updatePrescriptionStatus,
        labOrders,
        addLabOrder,
        radiologyOrders,
        addRadiologyOrder,
        billingInvoices,
        addBillingInvoice,
        bpjsClaims,
        addBPJSClaim,
        emergencyVisits,
        addEmergencyVisit,
        beds,
        updateBedStatus,
        icuMonitors,
        isRealtimeActive,
        setIsRealtimeActive,
        lastSyncedTime,
        triggerSimulatedLiveUpdate,
        liveMetrics
      }}
    >
      {children}
    </HospitalDataContext.Provider>
  );
};

export const useHospitalData = () => {
  const context = useContext(HospitalDataContext);
  if (!context) {
    throw new Error('useHospitalData must be used within a HospitalDataProvider');
  }
  return context;
};
