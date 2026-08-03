/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Server,
  Layers,
  Shield,
  Code2,
  FileCode,
  CheckCircle2,
  Terminal,
  Cpu,
  Boxes
} from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'db' | 'api' | 'roadmap'>('db');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-indigo-500/30 bg-slate-900/90 p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/40">
            <Database className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              ARSITEKTUR SYSTEM & DATABASE SCHEMAS
            </h1>
            <p className="text-xs text-slate-400">
              Dokumentasi Arsitektur Enterprise Class: PostgreSQL Scalable Database, Microservices REST API, dan RBAC Security Model.
            </p>
          </div>
        </div>

        <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700">
          <button
            onClick={() => setActiveTab('db')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'db' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            PostgreSQL Schema
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'api' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Microservices & API
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'roadmap' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tahap 1 & Roadmap Tahap 2
          </button>
        </div>
      </div>

      {activeTab === 'db' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Database className="h-4 w-4" />
                1. Database Master (db_master)
              </div>
              <p className="text-xs text-slate-400">Menyimpan data acuan organisasi, gedung, tarif, ICD, dan staf.</p>
              <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-300 space-y-1">
                <div>• master_hospitals (id, name, class)</div>
                <div>• master_departments (id, name, poly_code)</div>
                <div>• master_rooms (id, room_no, bed_count)</div>
                <div>• master_doctors (id, sip, name, spec)</div>
                <div>• master_icd10 (code, name, category)</div>
                <div>• master_drugs (id, code, name, stock)</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Layers className="h-4 w-4" />
                2. Database Transaksi (db_transaction)
              </div>
              <p className="text-xs text-slate-400">Menyimpan rekam medis EMR, pendaftaran, resep, dan billing.</p>
              <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-300 space-y-1">
                <div>• tx_registrations (id, norm, status)</div>
                <div>• tx_emr_notes (id, norm, soap_json)</div>
                <div>• tx_prescriptions (id, norm, items)</div>
                <div>• tx_lab_orders (id, norm, tests)</div>
                <div>• tx_radiology_orders (id, norm, scan)</div>
                <div>• tx_invoices (id, norm, total, bpjs)</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Cpu className="h-4 w-4" />
                3. Database AI & Audit (db_ai_audit)
              </div>
              <p className="text-xs text-slate-400">Menyimpan hasil prediksi AI, model logs, dan audit trail.</p>
              <div className="rounded-xl bg-slate-950 p-3 font-mono text-[11px] text-slate-300 space-y-1">
                <div>• ai_predictions (id, category, score)</div>
                <div>• ai_clinical_logs (id, prompt, res)</div>
                <div>• audit_activity_logs (id, user, ip)</div>
                <div>• sys_notifications (id, cat, read)</div>
                <div>• sys_sessions (id, token, expire)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Server className="h-4 w-4 text-cyan-400" />
            Express Server REST API Endpoints (Current Active)
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
              <span className="text-emerald-400 font-bold">GET /api/health</span>
              <span className="text-slate-400">Cek status server & konfigurasi Gemini API</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
              <span className="text-blue-400 font-bold">POST /api/ai/clinical-assistant</span>
              <span className="text-slate-400">Analisis CDSS Klinis & Triase berdasar gejala pasien</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
              <span className="text-blue-400 font-bold">POST /api/ai/voice-dictation</span>
              <span className="text-slate-400">Konversi dikte suara dokter menjadi rekam medis SOAP</span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 flex items-center justify-between">
              <span className="text-blue-400 font-bold">POST /api/ai/executive-summary</span>
              <span className="text-slate-400">Sintesis laporan eksekutif direksi otomatis</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Boxes className="h-4 w-4 text-cyan-400" />
            Status Pengembangan Smart AI Hospital Ecosystem (Prompt 1 - 6)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/40 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                TAHAP 1 & 2 (SELESAI 100%)
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Fondasi UI/UX Modern Luxury & Responsive</li>
                <li>Autentikasi Biometrik, Face ID, SSO, RBAC</li>
                <li>Pendaftaran, Smart Queue AI, EMR Dokter & BPJS V-Claim</li>
                <li>SIMRS & EMR Rawat Jalan / Inap / UGD / ICU / VK / OK</li>
              </ul>
            </div>

            <div className="rounded-xl bg-cyan-950/20 border border-cyan-500/40 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-cyan-400">
                <CheckCircle2 className="h-4 w-4" />
                TAHAP 3, 4 & 5 (SELESAI 100%)
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Penunjang Medis: LIS, RIS PACS, Darah, Gizi, Ambulans</li>
                <li>Farmasi Smart Depo, Resep FEFO, Logistik Procurement</li>
                <li>Billing RCM, COA Buku Besar, BPJS e-Klaim & HRD Payroll</li>
                <li>Marketing CRM WhatsApp & Executive Business Intelligence</li>
              </ul>
            </div>

            <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/40 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <CheckCircle2 className="h-4 w-4" />
                TAHAP 7 AGENTIC AI (SELESAI 100%)
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>11 Specialized AI Agents (Receptionist, Triage, Scribe, Sepsis, etc)</li>
                <li>Task Planner & End-to-End Workflow Engine</li>
                <li>Human Approval Gateway (HITL Clinical Safeguard)</li>
                <li>Vector Knowledge Base & Qdrant RAG Library</li>
                <li>Model Gateway Router & Token Cost Observability</li>
              </ul>
            </div>

            <div className="rounded-xl bg-teal-950/20 border border-teal-500/40 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-teal-300">
                <CheckCircle2 className="h-4 w-4" />
                TAHAP 8 HEALTHCARE SUPER ECOSYSTEM (SELESAI 100%)
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>National Health Exchange (SATUSEHAT FHIR R4, BPJS, INA-CBG)</li>
                <li>Faskes Provider Network (RS, Klinik, Puskesmas, Apotek, Lab, AGD)</li>
                <li>Patient Super App & Digital Health Wallet & Family Health</li>
                <li>Wearable Telemetry (Apple, Garmin, Fitbit) & Smart Ambulance GPS</li>
                <li>Corporate MCU, Population Health AI & Developer Open API Portal</li>
              </ul>
            </div>

            <div className="rounded-xl bg-indigo-950/20 border border-indigo-500/40 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-indigo-300">
                <CheckCircle2 className="h-4 w-4" />
                TAHAP 9 ENTERPRISE DEVELOPER PLATFORM & STUDIO (SELESAI 100%)
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Visual Workflow & BPMN 2.0 Designer (Simulation Engine)</li>
                <li>Drag & Drop Form Builder No-Code (Digital Informed Consent)</li>
                <li>Visual AI Prompt Builder & Otonom AI Agent Designer</li>
                <li>Integration Hub & Data Pipeline ETL Studio (HL7 / FHIR / PACS)</li>
                <li>Enterprise Plugin & API Marketplace (Payment, WhatsApp, E-Klaim)</li>
                <li>Multi-Tenant Configuration Studio & Solution Package (.json Export)</li>
              </ul>
            </div>

            <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/40 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                TAHAP 10 PRODUCTION READY & GLOBAL ENTERPRISE PLATFORM (SELESAI 100%)
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>Cloud-Native Multi-Region Kubernetes Operations (GKE, EKS, AKS, OpenShift)</li>
                <li>Security Operations Center (SOC 24/7, WAF DDoS Shield, Zero-Trust, KMS Encryption)</li>
                <li>Compliance & Audit Checklist (Permenkes SATUSEHAT, ISO 27001, SOC 2, PDPL)</li>
                <li>Disaster Recovery Center (DRC Active-Active, RTO &lt; 30s, RPO = 0s)</li>
                <li>FinOps Cost Governance & Multi-Tenant Commercial SaaS Subscription</li>
                <li>Service Desk Incident SLA Management & Feature Flag Canary Rollout</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
