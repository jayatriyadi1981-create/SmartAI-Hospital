/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HospitalDataProvider, useHospitalData } from './context/HospitalDataContext';
import { RealtimeIntegrationBar } from './components/RealtimeIntegrationBar';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { CommandCenter } from './components/CommandCenter';
import { AICenter } from './components/AICenter';
import { CalendarView } from './components/CalendarView';
import { SettingsMasterData } from './components/SettingsMasterData';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { PatientRegistration } from './components/PatientRegistration';
import { PatientManagement } from './components/PatientManagement';
import { EMRView } from './components/EMRView';
import { SmartQueueView } from './components/SmartQueueView';
import { AIPatientAssistantModal } from './components/AIPatientAssistantModal';
import { PlaceholderModuleView } from './components/PlaceholderModuleView';
import { LoginModal } from './components/LoginModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NOTIFICATIONS, MOCK_PATIENTS } from './data/mockData';
import { EmergencyDepartment } from './components/EmergencyDepartment';
import { InpatientBedManagement } from './components/InpatientBedManagement';
import { PolyclinicOutpatientView } from './components/PolyclinicOutpatientView';
import { ICUMonitoring } from './components/ICUMonitoring';
import { OperatingRoom } from './components/OperatingRoom';
import { NurseStation } from './components/NurseStation';
import { AICDSSView } from './components/AICDSSView';
import { ClinicalDashboard } from './components/ClinicalDashboard';
import { ClinicalOrdersView } from './components/ClinicalOrdersView';
import { LISView } from './components/LISView';
import { RISPACSView } from './components/RISPACSView';
import { BloodBankView } from './components/BloodBankView';
import { NutritionRehabView } from './components/NutritionRehabView';
import { CSSDAmbulanceView } from './components/CSSDAmbulanceView';
import { MedicalSupportDashboard } from './components/MedicalSupportDashboard';
import { PharmacyView } from './components/PharmacyView';
import { TelemedicineView } from './components/TelemedicineView';
import { InventoryProcurementView } from './components/InventoryProcurementView';
import { FinanceRCMView } from './components/FinanceRCMView';
import { BPJSInsuranceView } from './components/BPJSInsuranceView';
import { HRDPayrollView } from './components/HRDPayrollView';
import { CRMMarketingView } from './components/CRMMarketingView';
import { ExecutiveBIView } from './components/ExecutiveBIView';
import { SmartEcosystemView } from './components/SmartEcosystemView';
import { AIAgentEcosystemView } from './components/AIAgentEcosystemView';
import { HealthcareEcosystemView } from './components/HealthcareEcosystemView';
import { DeveloperPlatformStudioView } from './components/DeveloperPlatformStudioView';
import { ProductionOperationsView } from './components/ProductionOperationsView';
import { LandingPage } from './components/LandingPage';
import { NotificationItem, Patient } from './types';
import { Bot, Sparkles } from 'lucide-react';

function AppContent() {
  const { showLoginModal, setShowLoginModal } = useAuth();
  const {
    currentView,
    setCurrentView,
    selectedPatient,
    setSelectedPatient,
    notifications,
    markAllNotificationsRead
  } = useHospitalData();

  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isAIPatientAssistantOpen, setIsAIPatientAssistantOpen] = useState<boolean>(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLandingPage) {
    return (
      <>
        <LandingPage
          onEnterApp={() => setIsLandingPage(false)}
          onOpenLogin={() => setShowLoginModal(true)}
        />
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      </>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'Dashboard':
        return <ExecutiveDashboard onNavigate={setCurrentView} />;
      case 'Command Center':
        return <CommandCenter />;
      case 'AI Center':
        return <AICenter />;
      case 'Pendaftaran':
      case 'Pendaftaran & Admisi':
        return (
          <PatientRegistration
            onPatientRegistered={(p) => {
              setSelectedPatient(p);
            }}
            onNavigateToQueue={() => setCurrentView('Antrian')}
          />
        );
      case 'Pasien':
      case 'Master Data Pasien':
        return (
          <PatientManagement
            onSelectPatientForEMR={(p) => {
              setSelectedPatient(p);
              setCurrentView('Medical Record');
            }}
            onAddNewPatient={() => setCurrentView('Pendaftaran')}
            onNavigateToPolyclinic={(p) => {
              setSelectedPatient(p);
              setCurrentView('Rawat Jalan');
            }}
            onNavigateToInpatient={(p) => {
              setSelectedPatient(p);
              setCurrentView('Rawat Inap');
            }}
          />
        );
      case 'Medical Record':
      case 'Rekam Medis (EMR)':
        return <EMRView patient={selectedPatient} />;
      case 'Rawat Jalan':
      case 'Rawat Jalan (Poliklinik)':
        return (
          <PolyclinicOutpatientView
            onOpenEMR={(p) => {
              setSelectedPatient(p);
              setCurrentView('Medical Record');
            }}
          />
        );
      case 'IGD':
      case 'IGD & Triage AI':
      case 'IGD & Trauma Center':
        return <EmergencyDepartment />;
      case 'Rawat Inap':
      case 'Rawat Inap & Bed':
      case 'Rawat Inap (Ward)':
        return (
          <InpatientBedManagement
            onOpenEMRForPatient={(p) => {
              setSelectedPatient(p);
              setCurrentView('Medical Record');
            }}
          />
        );
      case 'ICU':
      case 'ICU / ICCU':
      case 'ICU / HCU Monitor':
      case 'NICU':
      case 'PICU':
        return <ICUMonitoring />;
      case 'Kamar Operasi':
      case 'Kamar Operasi (OK)':
        return <OperatingRoom />;
      case 'Nurse Station':
        return <NurseStation />;
      case 'CDSS AI':
      case 'CDSS & Voice AI':
        return <AICDSSView />;
      case 'Clinical Orders':
      case 'e-Prescription & Orders':
        return <ClinicalOrdersView />;
      case 'Laboratorium':
      case 'Laboratorium Sentral':
      case 'Laboratorium Sentral (LIS)':
        return <LISView />;
      case 'Radiologi':
      case 'Radiologi & Imaging':
      case 'Radiologi & PACS DICOM':
        return <RISPACSView />;
      case 'Bank Darah':
      case 'Bank Darah & Transfusi':
        return <BloodBankView />;
      case 'Gizi & Rehab':
      case 'Gizi, Diet & Fisioterapi':
        return <NutritionRehabView />;
      case 'CSSD & Services':
      case 'CSSD, Ambulans & Surat':
        return <CSSDAmbulanceView />;
      case 'Medical Support AI':
      case 'AI Support Dashboard':
        return <MedicalSupportDashboard />;
      case 'Farmasi':
      case 'Farmasi & Depo Obat':
      case 'Smart Pharmacy & FEFO':
        return <PharmacyView />;
      case 'Inventory':
      case 'Inventory & Logistik':
      case 'Inventory & Procurement':
      case 'Gudang':
      case 'Gudang Farmasi & Alkes':
      case 'Multi-Gudang & Assets':
        return <InventoryProcurementView />;
      case 'Keuangan':
      case 'Keuangan & Billing':
      case 'Keuangan & Billing RCM':
        return <FinanceRCMView />;
      case 'BPJS':
      case 'BPJS V-Claim & Bridging':
        return <BPJSInsuranceView />;
      case 'Telemedicine':
      case 'Telemedicine & AI':
        return <TelemedicineView />;
      case 'HRD':
      case 'HRD & Jadwal Dokter':
      case 'HRD, Payroll & Credential':
        return <HRDPayrollView />;
      case 'Marketing':
      case 'Marketing & CRM Pasien':
      case 'CRM & Marketing Automation':
        return <CRMMarketingView />;
      case 'Executive BI':
      case 'Executive BI & AI NLQ':
        return <ExecutiveBIView />;
      case 'Smart Ecosystem':
      case 'Smart AI Hospital Ecosystem':
        return <SmartEcosystemView />;
      case 'AI Agent Ecosystem':
      case 'Agentic AI Ecosystem':
        return <AIAgentEcosystemView />;
      case 'Healthcare Ecosystem':
      case 'Healthcare Super Ecosystem':
        return <HealthcareEcosystemView />;
      case 'Developer Platform':
      case 'Developer & Studio PaaS':
        return <DeveloperPlatformStudioView />;
      case 'Production Operations':
      case 'Production Ops & Enterprise':
        return <ProductionOperationsView />;
      case 'Laporan':
      case 'Laporan & Analytics':
        return <ClinicalDashboard />;
      case 'Antrian':
      case 'Smart Queue AI':
        return <SmartQueueView />;
      case 'Calendar':
        return <CalendarView />;
      case 'Settings':
        return <SettingsMasterData />;
      case 'Architecture Docs':
        return <ArchitectureDocs />;
      default:
        return (
          <PlaceholderModuleView
            moduleTitle={currentView}
            onNavigate={setCurrentView}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col relative">
      {/* Top Header Bar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
        onNavigate={setCurrentView}
        onOpenLandingPage={() => setIsLandingPage(true)}
      />

      {/* Real-Time Integration & Cross-Link Bar */}
      <RealtimeIntegrationBar />

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar currentView={currentView} onSelectView={setCurrentView} />

        {/* Main Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950 custom-scrollbar">
          <div className="max-w-7xl mx-auto">{renderCurrentView()}</div>
        </main>
      </div>

      {/* Floating AI Patient Assistant Trigger */}
      <button
        onClick={() => setIsAIPatientAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold p-3.5 rounded-full shadow-2xl border border-cyan-400/40 flex items-center gap-2 group transition-all hover:scale-105"
        title="Tanya AI Assistant Pasien"
      >
        <Sparkles className="w-5 h-5 text-cyan-200 group-hover:rotate-12 transition-transform" />
        <span className="text-xs pr-1 hidden sm:inline">AI Patient Assistant</span>
      </button>

      {/* Overlays & Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={setCurrentView}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={markAllNotificationsRead}
      />

      <AIPatientAssistantModal
        isOpen={isAIPatientAssistantOpen}
        onClose={() => setIsAIPatientAssistantOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HospitalDataProvider>
          <AppContent />
        </HospitalDataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
