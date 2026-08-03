import React, { useState } from 'react';
import {
  Code2,
  Workflow,
  FileCode,
  Layout,
  Boxes,
  Database,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Play,
  Plus,
  Save,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Sliders,
  Settings,
  Globe,
  Share2,
  Building,
  Zap,
  Lock,
  Search,
  Eye,
  Trash2,
  Edit3,
  Bot,
  Brain,
  Palette,
  Server,
  FileCheck,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import {
  MOCK_STUDIO_WORKFLOWS,
  MOCK_STUDIO_FORMS,
  MOCK_STUDIO_PLUGINS,
  MOCK_STUDIO_ETL_JOBS,
  MOCK_STUDIO_PROMPTS,
  MOCK_STUDIO_AGENTS,
  MOCK_STUDIO_TENANT_CONFIG
} from '../data/mockData';
import {
  StudioWorkflowDefinition,
  StudioFormDefinition,
  StudioPluginItem,
  StudioEtlJob,
  StudioPromptDefinition,
  StudioAgentDefinition,
  StudioTenantConfig
} from '../types';

export const DeveloperPlatformStudioView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    | 'workflows'
    | 'form_builder'
    | 'ai_prompt_agent'
    | 'integration_etl'
    | 'plugins_marketplace'
    | 'tenant_config'
  >('workflows');

  // State Management for Interactive Studio
  const [workflows, setWorkflows] = useState<StudioWorkflowDefinition[]>(MOCK_STUDIO_WORKFLOWS);
  const [selectedWorkflow, setSelectedWorkflow] = useState<StudioWorkflowDefinition>(MOCK_STUDIO_WORKFLOWS[0]);
  
  const [forms, setForms] = useState<StudioFormDefinition[]>(MOCK_STUDIO_FORMS);
  const [selectedForm, setSelectedForm] = useState<StudioFormDefinition>(MOCK_STUDIO_FORMS[0]);
  const [newFormLabel, setNewFormLabel] = useState('');
  const [newFormType, setNewFormType] = useState<'Text' | 'Select' | 'Date' | 'Signature' | 'Upload'>('Text');

  const [plugins, setPlugins] = useState<StudioPluginItem[]>(MOCK_STUDIO_PLUGINS);
  const [etlJobs, setEtlJobs] = useState<StudioEtlJob[]>(MOCK_STUDIO_ETL_JOBS);
  const [prompts, setPrompts] = useState<StudioPromptDefinition[]>(MOCK_STUDIO_PROMPTS);
  const [selectedPrompt, setSelectedPrompt] = useState<StudioPromptDefinition>(MOCK_STUDIO_PROMPTS[0]);

  const [tenantConfig, setTenantConfig] = useState<StudioTenantConfig>(MOCK_STUDIO_TENANT_CONFIG);

  // Simulation Feedback States
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const handleRunWorkflowSimulation = (wfName: string) => {
    setSimulationLog(`[SIMULATOR] Memulai eksekusi alur '${wfName}'...\n` +
      `[NODE 1: START] Trigger Event diterima.\n` +
      `[NODE 2: AI AGENT] Memproses data dengan Gemini 1.5 Flash... High Risk score detected.\n` +
      `[NODE 3: DECISION] Branch Red Flag tereksekusi.\n` +
      `[NODE 4: NOTIFICATION] Broadcast alert via WhatsApp & Smart Watch terkirim (240ms).\n` +
      `[SUCCESS] Workflow berhasil disimulasikan tanpa error!`
    );
  };

  const handleAddFormElement = () => {
    if (!newFormLabel) {
      alert('Mohon isi label elemen form baru.');
      return;
    }

    const updatedElements = [
      ...selectedForm.elements,
      {
        id: `f-${Date.now()}`,
        type: newFormType as any,
        label: newFormLabel,
        required: true,
        placeholder: `Masukkan ${newFormLabel}`
      }
    ];

    const updatedForm = {
      ...selectedForm,
      elementsCount: updatedElements.length,
      elements: updatedElements
    };

    setSelectedForm(updatedForm);
    setForms(prev => prev.map(f => f.id === selectedForm.id ? updatedForm : f));
    setNewFormLabel('');
    alert('Elemen form berhasil ditambahkan ke kanvas No-Code!');
  };

  const handleTogglePluginInstall = (id: string) => {
    setPlugins(prev =>
      prev.map(p => (p.id === id ? { ...p, isInstalled: !p.isInstalled } : p))
    );
  };

  const handleTriggerEtlJob = (id: string) => {
    setEtlJobs(prev =>
      prev.map(job =>
        job.id === id
          ? {
              ...job,
              status: 'Running',
              recordsProcessedToday: job.recordsProcessedToday + Math.floor(Math.random() * 100) + 25,
              lastRunTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
            }
          : job
      )
    );
    alert('Job ETL Data Pipeline berhasil ditrigger secara manual!');
  };

  const handleExportSolutionPackage = () => {
    const solutionPackage = {
      manifestVersion: '9.0.1',
      tenantId: tenantConfig.tenantId,
      exportedAt: new Date().toISOString(),
      workflows,
      forms,
      prompts,
      etlJobs
    };

    const blob = new Blob([JSON.stringify(solutionPackage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solution-package-${tenantConfig.tenantId}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-inner">
              <Code2 className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Enterprise Developer Platform & Low-Code Studio</h1>
                <span className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 px-3 py-0.5 text-xs font-bold text-slate-950 shadow">
                  Studio 9.0
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                PaaS Extensible Studio: Modifikasi Workflow BPMN, Form Builder, Visual AI Prompt & Agent Designer, Integration Hub, ETL Studio, Plugin Marketplace & Multi-Tenant Package Export.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSolutionPackage}
              className="flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-indigo-400 transition"
            >
              <Download className="h-4 w-4" /> Ekspor Solution Package (.json)
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('workflows')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'workflows'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Workflow className="h-4 w-4 text-indigo-400" />
          Workflow & BPMN Designer
        </button>

        <button
          onClick={() => setActiveTab('form_builder')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'form_builder'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Layout className="h-4 w-4 text-cyan-400" />
          Form & Page Builder
        </button>

        <button
          onClick={() => setActiveTab('ai_prompt_agent')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'ai_prompt_agent'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Brain className="h-4 w-4 text-purple-400" />
          AI Prompt & Agent Builder
        </button>

        <button
          onClick={() => setActiveTab('integration_etl')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'integration_etl'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Database className="h-4 w-4 text-emerald-400" />
          Integration Hub & ETL Studio
        </button>

        <button
          onClick={() => setActiveTab('plugins_marketplace')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'plugins_marketplace'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Boxes className="h-4 w-4 text-amber-400" />
          Plugin & API Marketplace
        </button>

        <button
          onClick={() => setActiveTab('tenant_config')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
            activeTab === 'tenant_config'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Settings className="h-4 w-4 text-rose-400" />
          Tenant & Theme Studio
        </button>
      </div>

      {/* TAB 1: WORKFLOW & BPMN DESIGNER */}
      {activeTab === 'workflows' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List Sidebar */}
          <div className="lg:col-span-1 space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Workflow className="h-4 w-4 text-indigo-400" /> Daftar Alur Kerja BPMN
              </h3>
              <button
                onClick={() => {
                  const name = prompt('Masukkan Nama Workflow Baru:');
                  if (name) {
                    const newWf: StudioWorkflowDefinition = {
                      id: `wf-${Date.now()}`,
                      name,
                      category: 'Patient Admission',
                      status: 'Draft',
                      nodesCount: 3,
                      triggerEvent: 'Event: MANUAL_TRIGGER',
                      lastModifiedBy: 'System Admin',
                      version: 'v1.0',
                      nodes: [
                        { id: 'n1', type: 'Start', label: 'Start Trigger', configSummary: 'Manual Input', positionX: 50, positionY: 100 },
                        { id: 'n2', type: 'AI_Agent', label: 'AI Processing', configSummary: 'Gemini 1.5 Flash', positionX: 250, positionY: 100 },
                        { id: 'n3', type: 'End', label: 'Complete Task', configSummary: 'Save Result', positionX: 450, positionY: 100 }
                      ]
                    };
                    setWorkflows(prev => [newWf, ...prev]);
                    setSelectedWorkflow(newWf);
                  }
                }}
                className="flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded text-xs font-bold border border-indigo-500/30"
              >
                <Plus className="h-3.5 w-3.5" /> Baru
              </button>
            </div>

            <div className="space-y-3">
              {workflows.map((wf) => (
                <div
                  key={wf.id}
                  onClick={() => setSelectedWorkflow(wf)}
                  className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                    selectedWorkflow.id === wf.id
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-xs line-clamp-1">{wf.name}</h4>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                      {wf.version}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Trigger: {wf.triggerEvent}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 font-mono">
                    <span>{wf.nodesCount} Visual Nodes</span>
                    <span className="text-emerald-400 font-bold">{wf.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Canvas Designer */}
          <div className="lg:col-span-2 space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-base">{selectedWorkflow.name}</h3>
                <span className="text-xs text-indigo-300 font-mono">Diperbarui oleh: {selectedWorkflow.lastModifiedBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRunWorkflowSimulation(selectedWorkflow.name)}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition"
                >
                  <Play className="h-3.5 w-3.5" /> Uji Simulation Engine
                </button>
              </div>
            </div>

            {/* Visual Node Drag Canvas Area */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 min-h-[320px] relative overflow-x-auto">
              <div className="text-[10px] text-slate-500 font-mono mb-4 flex items-center justify-between">
                <span>[BPMN 2.0 VISUAL DESIGNER CANVAS - DRAG & CONNECT]</span>
                <span>Trigger Event: {selectedWorkflow.triggerEvent}</span>
              </div>

              <div className="flex items-center gap-4 min-w-[700px] py-6">
                {selectedWorkflow.nodes.map((node, index) => (
                  <React.Fragment key={node.id}>
                    <div className="bg-slate-900 p-4 rounded-xl border border-indigo-500/40 w-48 shadow-lg space-y-2 relative group hover:border-indigo-400">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                          {node.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">#0{index + 1}</span>
                      </div>
                      <h5 className="font-bold text-slate-100 text-xs">{node.label}</h5>
                      <p className="text-[10px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
                        {node.configSummary}
                      </p>
                    </div>

                    {index < selectedWorkflow.nodes.length - 1 && (
                      <div className="flex items-center text-indigo-400">
                        <div className="h-0.5 w-8 bg-indigo-500/50"></div>
                        <Zap className="h-4 w-4 -ml-1 text-cyan-400 animate-pulse" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Simulation Log Result Box */}
            {simulationLog && (
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-xs font-mono text-emerald-300 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <Terminal className="h-4 w-4 text-emerald-400" /> Output Simulasi Workflow Engine:
                  </span>
                  <button onClick={() => setSimulationLog(null)} className="text-slate-500 hover:text-slate-300">Tutup</button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-slate-200">{simulationLog}</pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FORM & PAGE BUILDER */}
      {activeTab === 'form_builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Form List & Builder Controls */}
          <div className="lg:col-span-1 space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2 border-b border-slate-800 pb-3">
              <Layout className="h-4 w-4 text-cyan-400" /> Form Builder No-Code
            </h3>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-300 block">Pilih Template Formulir:</label>
              <select
                value={selectedForm.id}
                onChange={(e) => {
                  const f = forms.find(item => item.id === e.target.value);
                  if (f) setSelectedForm(f);
                }}
                className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg p-2.5 focus:border-indigo-500 focus:outline-none"
              >
                {forms.map(f => (
                  <option key={f.id} value={f.id}>{f.title} ({f.version})</option>
                ))}
              </select>
            </div>

            {/* Add New Element Tool */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <h4 className="font-bold text-slate-100 text-xs">Tambah Komponen Input Baru:</h4>
              <input
                type="text"
                placeholder="Label Komponen (e.g. Catatan Alergi)"
                value={newFormLabel}
                onChange={(e) => setNewFormLabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg p-2 focus:border-cyan-500 focus:outline-none"
              />
              <select
                value={newFormType}
                onChange={(e) => setNewFormType(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg p-2 focus:border-cyan-500 focus:outline-none"
              >
                <option value="Text">Teks Singkat</option>
                <option value="Select">Dropdown Pilihan</option>
                <option value="Date">Tanggal / Jam</option>
                <option value="Signature">Tanda Tangan Digital</option>
                <option value="Upload">Unggah Dokumen</option>
              </select>
              <button
                onClick={handleAddFormElement}
                className="w-full bg-cyan-500 text-slate-950 font-bold py-2 rounded-lg text-xs hover:bg-cyan-400 transition"
              >
                + Sisipkan ke Kanvas Form
              </button>
            </div>
          </div>

          {/* Right Live Preview Canvas */}
          <div className="lg:col-span-2 space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-100 text-base">{selectedForm.title}</h3>
                <span className="text-xs text-cyan-300 font-mono">Kategori: {selectedForm.category} • Versi {selectedForm.version}</span>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded font-bold border border-emerald-500/30">
                Live Preview
              </span>
            </div>

            {/* Dynamic Form Render */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              {selectedForm.elements.map((elem) => (
                <div key={elem.id} className="space-y-1.5 border-b border-slate-900 pb-3">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>{elem.label} {elem.required && <span className="text-rose-400">*</span>}</span>
                    <span className="text-[10px] text-slate-500 font-mono">[{elem.type}]</span>
                  </label>

                  {elem.type === 'Text' && (
                    <input type="text" placeholder={elem.placeholder} disabled className="w-full bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded-lg p-2.5" />
                  )}

                  {elem.type === 'Select' && (
                    <select disabled className="w-full bg-slate-900 border border-slate-800 text-slate-400 text-xs rounded-lg p-2.5">
                      {elem.options?.map((opt, i) => <option key={i}>{opt}</option>)}
                    </select>
                  )}

                  {elem.type === 'Signature' && (
                    <div className="h-20 bg-slate-900 border border-dashed border-slate-700 rounded-lg flex items-center justify-center text-slate-500 text-xs font-mono">
                      [Area Tanda Tangan Digital Biometrik]
                    </div>
                  )}

                  {elem.type === 'Upload' && (
                    <div className="p-3 bg-slate-900 border border-dashed border-slate-700 rounded-lg text-center text-slate-400 text-xs">
                      Klik atau Drag & Drop Berkas / Lampiran Medis
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI PROMPT & AGENT BUILDER */}
      {activeTab === 'ai_prompt_agent' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" /> Visual AI Prompt & Agent Designer Studio
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Prompt Editor Box */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-100 text-xs">{selectedPrompt.title}</span>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                    Model Target: {selectedPrompt.targetModel}
                  </span>
                </div>

                <textarea
                  rows={4}
                  value={selectedPrompt.templateContent}
                  onChange={(e) => setSelectedPrompt({ ...selectedPrompt, templateContent: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-purple-200 text-xs font-mono rounded-lg p-3 focus:border-purple-500 focus:outline-none"
                />

                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Latency Rata-Rata: <strong className="text-cyan-300">{selectedPrompt.avgLatencyMs} ms</strong></span>
                  <span className="text-slate-400">Akurasi Medis Evaluasi: <strong className="text-emerald-400">{selectedPrompt.accuracyScorePct}%</strong></span>
                </div>
              </div>

              {/* Agent Registry & Tools Attached */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-slate-100 text-xs">Otonom AI Agent Terdaftar di Platform:</h4>
                <div className="space-y-3">
                  {MOCK_STUDIO_AGENTS.map((ag) => (
                    <div key={ag.id} className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-slate-100">{ag.name}</strong>
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">{ag.status}</span>
                      </div>
                      <p className="text-slate-400">Role: {ag.role} • Memory: {ag.memoryType}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {ag.toolsAttached.map((tool, i) => (
                          <span key={i} className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-mono">
                            🛠️ {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATION HUB & ETL STUDIO */}
      {activeTab === 'integration_etl' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-400" /> Integration Hub & Data Pipeline ETL Studio
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Transformasi data langsung dari pesan HL7 v2, DICOM PACS, dan REST API ke format SATUSEHAT FHIR Store.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {etlJobs.map((job) => (
              <div key={job.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm">{job.name}</h4>
                    <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                      Source: {job.sourceType}
                    </span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold">
                    {job.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target FHIR Store:</span>
                    <span className="text-teal-300">{job.targetTable}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Aturan Transformasi:</span>
                    <span className="text-slate-200">{job.transformationRules}</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-slate-400">Rekor Terproses Hari Ini:</span>
                    <strong className="text-emerald-400">{job.recordsProcessedToday.toLocaleString()} recs</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Frekuensi: {job.frequency}</span>
                  <button
                    onClick={() => handleTriggerEtlJob(job.id)}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-slate-950 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Trigger Manual
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PLUGINS & API MARKETPLACE */}
      {activeTab === 'plugins_marketplace' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-amber-400" /> Enterprise Plugin & Connector Marketplace
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {plugins.map((plug) => (
              <div key={plug.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold border border-amber-500/30">
                    {plug.category}
                  </span>
                  <h4 className="font-bold text-slate-100 text-xs line-clamp-2">{plug.title}</h4>
                  <p className="text-[11px] text-slate-400">Pengembang: {plug.developer}</p>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Rating: ★ {plug.rating}</span>
                    <span className="text-teal-300">{plug.downloadsCount} terpasang</span>
                  </div>

                  <button
                    onClick={() => handleTogglePluginInstall(plug.id)}
                    className={`w-full py-1.5 rounded-lg text-xs font-bold transition ${
                      plug.isInstalled
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500 hover:text-white'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    }`}
                  >
                    {plug.isInstalled ? 'Copot Plugin (Uninstall)' : 'Pasang Plugin Sekarang'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TENANT CONFIG & THEME STUDIO */}
      {activeTab === 'tenant_config' && (
        <div className="space-y-6 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Settings className="h-5 w-5 text-rose-400" /> Multi-Tenant Configuration & Theme Builder
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tenant General Profile */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">Profil Rumah Sakit Tenant</h4>
              
              <div className="space-y-2">
                <label className="text-slate-400 block">Nama Tenant / Faskes:</label>
                <input
                  type="text"
                  value={tenantConfig.tenantName}
                  onChange={(e) => setTenantConfig({ ...tenantConfig, tenantName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 block">Custom Domain PaaS:</label>
                <input
                  type="text"
                  value={tenantConfig.customDomain}
                  onChange={(e) => setTenantConfig({ ...tenantConfig, customDomain: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono rounded-lg p-2 focus:outline-none"
                />
              </div>
            </div>

            {/* Theme Builder */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2 flex items-center gap-2">
                <Palette className="h-4 w-4 text-purple-400" /> Theme Branding Studio
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 block">Warna Utama (Primary):</label>
                  <input
                    type="color"
                    value={tenantConfig.primaryColorHex}
                    onChange={(e) => setTenantConfig({ ...tenantConfig, primaryColorHex: e.target.value })}
                    className="w-full h-9 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 block">Warna Aksen (Accent):</label>
                  <input
                    type="color"
                    value={tenantConfig.accentColorHex}
                    onChange={(e) => setTenantConfig({ ...tenantConfig, accentColorHex: e.target.value })}
                    className="w-full h-9 rounded bg-slate-900 border border-slate-700 cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={() => alert('Konfigurasi Tenant & Tema Branding berhasil disimpan!')}
                className="w-full bg-indigo-500 text-white font-bold py-2 rounded-lg hover:bg-indigo-400 transition mt-2"
              >
                Simpan Perubahan Tenant & Branding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
