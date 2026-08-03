import React, { useState } from 'react';
import {
  ShieldCheck,
  Server,
  Cpu,
  Globe,
  Database,
  Lock,
  FileCheck,
  DollarSign,
  Headphones,
  ToggleLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Activity,
  Key,
  Layers,
  BarChart3,
  Terminal,
  Download,
  Users,
  Building,
  TrendingUp,
  Clock,
  Play,
  Check,
  Flame,
  FileText
} from 'lucide-react';
import {
  MOCK_PRODUCTION_CLUSTERS,
  MOCK_SECURITY_THREATS,
  MOCK_COMPLIANCE_FRAMEWORKS,
  MOCK_FINOPS_METRICS,
  MOCK_SERVICE_DESK_TICKETS,
  MOCK_FEATURE_FLAGS,
  MOCK_PRODUCTION_READINESS
} from '../data/mockData';
import {
  ProductionClusterNode,
  SecurityThreatIncident,
  ComplianceFrameworkItem,
  FinOpsCostMetric,
  ServiceDeskTicket,
  FeatureFlagItem,
  ProductionReadinessItem
} from '../types';

export const ProductionOperationsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'cloud_k8s'
    | 'soc_security'
    | 'compliance_audit'
    | 'dr_backup'
    | 'finops_commercial'
    | 'servicedesk_readiness'
  >('cloud_k8s');

  // Interactive States
  const [clusters, setClusters] = useState<ProductionClusterNode[]>(MOCK_PRODUCTION_CLUSTERS);
  const [threats, setThreats] = useState<SecurityThreatIncident[]>(MOCK_SECURITY_THREATS);
  const [complianceList] = useState<ComplianceFrameworkItem[]>(MOCK_COMPLIANCE_FRAMEWORKS);
  const [finopsList] = useState<FinOpsCostMetric[]>(MOCK_FINOPS_METRICS);
  const [tickets, setTickets] = useState<ServiceDeskTicket[]>(MOCK_SERVICE_DESK_TICKETS);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlagItem[]>(MOCK_FEATURE_FLAGS);
  const [readinessChecklist] = useState<ProductionReadinessItem[]>(MOCK_PRODUCTION_READINESS);

  // Operational Action Logs
  const [operationLog, setOperationLog] = useState<string | null>(null);

  const handleSimulateFailover = (clusterName: string) => {
    setOperationLog(
      `[FAILOVER DRILL] Memulai prosedur Disaster Recovery failover dari cluster primary ke standby...\n` +
      `[STEP 1] DNS Routing Health Check initiated (Cloudflare GSLB).\n` +
      `[STEP 2] Multi-Region Firestore & PostgreSQL Read Replica promoted to Primary in 1.2s.\n` +
      `[STEP 3] Traffic rerouted to '${clusterName}' (Secondary DR Region Singapore).\n` +
      `[RESULT] Failover berhasil tuntas dalam 18.4 detik! Zero Data Loss (RPO = 0s).`
    );

    setClusters(prev =>
      prev.map(c =>
        c.clusterName === clusterName
          ? { ...c, status: 'Healthy', role: 'Primary Active', cpuUsagePct: 68 }
          : { ...c, role: 'Secondary Disaster Recovery', status: 'Failover Standby' }
      )
    );
  };

  const handleMitigateThreat = (id: string) => {
    setThreats(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: 'Mitigated', aiMitigationAction: 'Anomali diblokir oleh AI Threat Engine v10.0' }
          : t
      )
    );
    alert('Tindakan mitigasi AI Security Operations Center berhasil dieksekusi!');
  };

  const handleToggleFeatureFlag = (id: string) => {
    setFeatureFlags(prev =>
      prev.map(f =>
        f.id === id ? { ...f, enabledGlobal: !f.enabledGlobal } : f
      )
    );
  };

  const handleResolveTicket = (id: string) => {
    setTickets(prev =>
      prev.map(t =>
        t.id === id ? { ...t, status: 'Resolved', slaMinutesRemaining: 0 } : t
      )
    );
    alert('Tiket Service Desk telah berhasil ditandai selesai (Resolved)!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-teal-950/60 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-inner">
              <ShieldCheck className="h-7 w-7 animate-pulse text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Production Operations & Global Enterprise Portal</h1>
                <span className="rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 px-3 py-0.5 text-xs font-bold text-slate-950 shadow">
                  Enterprise 10.0
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Cloud-Native Operations: Multi-Region Kubernetes, SOC Security, Compliance (ISO/SATUSEHAT/SOC2), Disaster Recovery, FinOps, Service Desk & Production Readiness.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="h-4 w-4" /> 100% Production Ready
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('cloud_k8s')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'cloud_k8s'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Server className="h-4 w-4 text-emerald-400" />
          Cloud & Kubernetes Ops
        </button>

        <button
          onClick={() => setActiveTab('soc_security')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'soc_security'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Lock className="h-4 w-4 text-rose-400" />
          SOC & Zero-Trust Security
        </button>

        <button
          onClick={() => setActiveTab('compliance_audit')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'compliance_audit'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <FileCheck className="h-4 w-4 text-cyan-400" />
          Compliance & Audit Checklist
        </button>

        <button
          onClick={() => setActiveTab('dr_backup')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'dr_backup'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <RefreshCw className="h-4 w-4 text-amber-400" />
          Disaster Recovery & Backup
        </button>

        <button
          onClick={() => setActiveTab('finops_commercial')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'finops_commercial'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <DollarSign className="h-4 w-4 text-teal-400" />
          FinOps & License SaaS
        </button>

        <button
          onClick={() => setActiveTab('servicedesk_readiness')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'servicedesk_readiness'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Headphones className="h-4 w-4 text-purple-400" />
          Service Desk & Feature Flags
        </button>
      </div>

      {/* TAB 1: CLOUD & KUBERNETES OPERATIONS */}
      {activeTab === 'cloud_k8s' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Total Pods Beroperasi</span>
                <p className="text-2xl font-bold text-slate-100 font-mono mt-1">545 Pods</p>
                <span className="text-[10px] text-emerald-400">Multi-Cloud HPA Active</span>
              </div>
              <Server className="h-8 w-8 text-emerald-400" />
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Rata-Rata Cluster CPU</span>
                <p className="text-2xl font-bold text-cyan-300 font-mono mt-1">38.3%</p>
                <span className="text-[10px] text-cyan-400">Autoscaling Reserve Ready</span>
              </div>
              <Cpu className="h-8 w-8 text-cyan-400" />
            </div>

            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400">Global Service Uptime</span>
                <p className="text-2xl font-bold text-teal-300 font-mono mt-1">99.99%</p>
                <span className="text-[10px] text-teal-400">SLA Guaranty Met</span>
              </div>
              <Globe className="h-8 w-8 text-teal-400" />
            </div>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Server className="h-4 w-4 text-emerald-400" /> Multi-Region Kubernetes Enterprise Clusters
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {clusters.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{c.clusterName}</h4>
                      <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {c.provider} • {c.region}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                      c.status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Peran Node:</span>
                      <strong className="text-teal-300">{c.role}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Node Count / Active Pods:</span>
                      <span className="text-slate-200">{c.nodesCount} Nodes / {c.activePods} Pods</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Penggunaan CPU / RAM:</span>
                      <span className="text-amber-300">{c.cpuUsagePct}% CPU / {c.memoryUsagePct}% RAM</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800">
                      <span className="text-slate-400">Uptime Metric:</span>
                      <strong className="text-emerald-400">{c.uptimePct}%</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => handleSimulateFailover(c.clusterName)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500/20 py-2 text-xs font-bold text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 transition"
                    >
                      <Zap className="h-3.5 w-3.5" /> Uji Failover ke Region Ini
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Operational Output Box */}
            {operationLog && (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-xs font-mono text-emerald-300 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-emerald-400" /> Log Eksekusi Failover & Infrastructure Drill:
                  </span>
                  <button onClick={() => setOperationLog(null)} className="text-slate-500 hover:text-slate-300">Tutup Log</button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-slate-200">{operationLog}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SECURITY OPERATIONS CENTER (SOC) */}
      {activeTab === 'soc_security' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-rose-400" /> Security Operations Center (SOC 24/7) & Zero-Trust Shield
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Penyaringan ancaman siber otomatis, enkripsi AES-256 at rest & in transit, rotasi kunci KMS, serta perlindungan DDoS WAF.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {threats.map((t) => (
                <div key={t.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        t.severity === 'Critical' || t.severity === 'High' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {t.severity} Severity
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{t.category}</span>
                      <span className="text-[10px] text-slate-500 font-mono">[{t.timestamp}]</span>
                    </div>
                    <h4 className="font-bold text-slate-100 text-xs">{t.title}</h4>
                    <p className="text-[11px] text-emerald-400 font-mono">Aksi AI: {t.aiMitigationAction}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">Risk Score: <strong className="text-rose-400">{t.riskScore}/100</strong></span>
                    {t.status !== 'Mitigated' && (
                      <button
                        onClick={() => handleMitigateThreat(t.id)}
                        className="bg-rose-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-rose-400 transition"
                      >
                        Mitigasi Sekarang
                      </button>
                    )}
                    {t.status === 'Mitigated' && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded font-bold border border-emerald-500/30">
                        ✓ Ter-Mitigasi
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPLIANCE & AUDIT CHECKLIST */}
      {activeTab === 'compliance_audit' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-cyan-400" /> Regulatory Compliance Frameworks & Evidence Registry
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Sertifikasi resmi Kemenkes SATUSEHAT Interoperability, ISO 27001, SOC 2 Type II, dan Regulasi Perlindungan Data Pribadi (PDPL).
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complianceList.map((comp) => (
                <div key={comp.id} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{comp.frameworkCode}</h4>
                      <span className="text-[10px] text-slate-400">Audit Terakhir: {comp.lastAuditDate}</span>
                    </div>
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                      {comp.status}
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kepatuhan Kontrol:</span>
                      <strong className="text-teal-300">{comp.passedControlsCount} / {comp.totalControlsCount} Controls</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Skor Compliance:</span>
                      <strong className="text-emerald-400">{comp.complianceScorePct}%</strong>
                    </div>
                  </div>

                  <a
                    href={comp.evidenceDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:underline pt-1"
                  >
                    <Download className="h-3.5 w-3.5" /> Unduh Laporan Bukti Audit (.pdf)
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DISASTER RECOVERY & BACKUP */}
      {activeTab === 'dr_backup' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <RefreshCw className="h-4 w-4 text-amber-400" /> Disaster Recovery Center (DRC) & Automated Backup Wizard
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Status Replikasi Data Realtime</h4>
                <div className="space-y-2 font-mono">
                  <div className="flex justify-between bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">RTO Target (Recovery Time):</span>
                    <strong className="text-emerald-400">&lt; 30 Detik</strong>
                  </div>
                  <div className="flex justify-between bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">RPO Target (Recovery Point):</span>
                    <strong className="text-emerald-400">0 Detik (Zero Data Loss)</strong>
                  </div>
                  <div className="flex justify-between bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400">Firestore WAL Replication:</span>
                    <span className="text-cyan-300">Synchronous Active-Active</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
                <h4 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Wizard Restore Poin Snapshot</h4>
                <p className="text-slate-400">Pilih titik snapshot backup otomatis untuk dipulihkan ke lingkungan Sandbox / Standby:</p>
                <select className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2.5 focus:outline-none">
                  <option>Snapshot Auto-Backup 03 Aug 2026 01:00 (Full Database + DICOM)</option>
                  <option>Snapshot Auto-Backup 02 Aug 2026 12:00 (Full Database)</option>
                </select>
                <button
                  onClick={() => alert('Simulasi Restore Snapshot berhasil diproses ke lingkungan Standby DR!')}
                  className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded-lg hover:bg-amber-400 transition"
                >
                  Jalankan Wizard Restore Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINOPS & LICENSE SAAS */}
      {activeTab === 'finops_commercial' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <DollarSign className="h-4 w-4 text-teal-400" /> FinOps Cost Governance & Commercial SaaS Billing
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {finopsList.map((fin) => (
                <div key={fin.id} className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm">{fin.tenantOrHospitalName}</h4>
                      <span className="text-[10px] text-teal-300 font-mono">Efisiensi Biaya: {fin.costEfficiencyScorePct}%</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 font-mono">
                      ${fin.monthlySpendUsd.toLocaleString()} / mo
                    </span>
                  </div>

                  <div className="space-y-1 font-mono text-xs bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Budget Cap Maksimal:</span>
                      <span className="text-slate-200">${fin.budgetCapUsd.toLocaleString()} USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">AI GPU Resource Usage:</span>
                      <span className="text-amber-300">{fin.aiGpuUsagePct}% Usage</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Penyimpanan Cold Storage:</span>
                      <span className="text-cyan-300">{fin.cloudStorageTb} TB</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 bg-teal-950/40 p-2.5 rounded border border-teal-500/30">
                    💡 <strong>AI FinOps Recommendation:</strong> {fin.optimizationRecommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SERVICE DESK & FEATURE FLAGS */}
      {activeTab === 'servicedesk_readiness' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Desk Section */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Headphones className="h-4 w-4 text-purple-400" /> Service Desk & Incident Management SLA
            </h3>

            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold font-mono text-purple-300">{ticket.ticketNumber} • {ticket.priority}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      ticket.status === 'Resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-xs">{ticket.summary}</h4>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                    <span>Engineer: {ticket.assignedEngineer}</span>
                    {ticket.status !== 'Resolved' && (
                      <button
                        onClick={() => handleResolveTicket(ticket.id)}
                        className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded border border-emerald-500/30 font-bold"
                      >
                        Selesaikan Tiket
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Flags & Production Readiness */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <ToggleLeft className="h-4 w-4 text-cyan-400" /> Feature Flag Rollout & Readiness Checklist
            </h3>

            <div className="space-y-3">
              {featureFlags.map((flag) => (
                <div key={flag.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-mono text-xs font-bold text-cyan-300">{flag.flagKey}</h4>
                    <p className="text-[11px] text-slate-400">{flag.description}</p>
                  </div>
                  <button
                    onClick={() => handleToggleFeatureFlag(flag.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      flag.enabledGlobal
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {flag.enabledGlobal ? 'AKTIF' : 'NONAKTIF'}
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <h4 className="font-bold text-slate-100 text-xs mb-2">Production Readiness Final Checks:</h4>
              <div className="space-y-1.5 text-xs font-mono">
                {readinessChecklist.map((item) => (
                  <div key={item.id} className="flex justify-between bg-slate-950 p-2 rounded border border-slate-800">
                    <span className="text-slate-300">{item.checkItem}</span>
                    <span className="text-emerald-400 font-bold">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
