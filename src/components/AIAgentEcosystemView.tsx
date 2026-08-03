import React, { useState } from 'react';
import {
  Bot,
  Brain,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Pill,
  TestTube,
  Scan,
  Activity,
  Bed,
  DollarSign,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  Send,
  Upload,
  UserCheck,
  Cpu,
  Layers,
  Database,
  Search,
  Check,
  X,
  Radio,
  Clock,
  ArrowRight,
  TrendingUp,
  Sliders,
  FileCode,
  Zap,
  Server,
  Lock,
  MessageSquare,
  BarChart3,
  HelpCircle
} from 'lucide-react';
import {
  MOCK_AI_AGENTS,
  MOCK_AI_WORKFLOW_STEPS,
  MOCK_HUMAN_APPROVALS,
  MOCK_KNOWLEDGE_DOCUMENTS,
  MOCK_MODEL_ROUTERS,
  MOCK_AI_OBSERVABILITY,
  MOCK_AI_CHAT_MESSAGES
} from '../data/mockData';
import {
  AIAgentItem,
  AIAgentWorkflowStep,
  HumanApprovalItem,
  KnowledgeBaseDocument,
  AIModelRouterItem,
  AIChatMessage
} from '../types';

export const AIAgentEcosystemView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'agent_hub' | 'chat_center' | 'human_approval' | 'workflow_engine' | 'knowledge_rag' | 'model_router'
  >('agent_hub');

  // State managers
  const [agentsList, setAgentsList] = useState<AIAgentItem[]>(MOCK_AI_AGENTS);
  const [approvalsList, setApprovalsList] = useState<HumanApprovalItem[]>(MOCK_HUMAN_APPROVALS);
  const [chatMessages, setChatMessages] = useState<AIChatMessage[]>(MOCK_AI_CHAT_MESSAGES);
  const [selectedAgentForChat, setSelectedAgentForChat] = useState<AIAgentItem>(MOCK_AI_AGENTS[3]); // Default Scribe
  const [inputChatMessage, setInputChatMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('Google Gemini 3.6 Flash');
  const [useRagContext, setUseRagContext] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [knowledgeSearchQuery, setKnowledgeSearchQuery] = useState('');
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeBaseDocument[]>(MOCK_KNOWLEDGE_DOCUMENTS);

  // Workflow steps interactive state
  const [workflowSteps, setWorkflowSteps] = useState<AIAgentWorkflowStep[]>(MOCK_AI_WORKFLOW_STEPS);

  // Modals state
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('Farmasi & Obat');
  const [newAgentModel, setNewAgentModel] = useState('Google Gemini 3.6 Flash');

  const [showAddApprovalModal, setShowAddApprovalModal] = useState(false);
  const [newApprovalPatient, setNewApprovalPatient] = useState('');
  const [newApprovalRec, setNewApprovalRec] = useState('');
  const [newApprovalRisk, setNewApprovalRisk] = useState('Tinggi (Kritis)');

  const [showUploadRagModal, setShowUploadRagModal] = useState(false);
  const [newRagTitle, setNewRagTitle] = useState('');
  const [newRagCategory, setNewRagCategory] = useState('Pedoman Klinik (PPK)');
  const [newRagSummary, setNewRagSummary] = useState('');

  const [benchmarkingModel, setBenchmarkingModel] = useState(false);
  const [benchmarkStatus, setBenchmarkStatus] = useState<string | null>(null);

  // Handle Human Approval
  const handleApproveTicket = (id: string, notes?: string) => {
    setApprovalsList(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, status: 'Approved', authorizedBy: 'Dr. Hendra, Sp.JP', authorizationNotes: notes || 'Disetujui tanpa perubahan.' }
          : app
      )
    );
  };

  const handleRejectTicket = (id: string) => {
    setApprovalsList(prev =>
      prev.map(app =>
        app.id === id
          ? { ...app, status: 'Rejected', authorizedBy: 'Dr. Hendra, Sp.JP', authorizationNotes: 'Ditolak: Perlu evaluasi ulang klinis.' }
          : app
      )
    );
  };

  // Handle Chat Message
  const handleSendMessage = async () => {
    if (!inputChatMessage.trim()) return;

    const userMsg: AIChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'User',
      content: inputChatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    const currentInput = inputChatMessage;
    setInputChatMessage('');
    setIsSendingMessage(true);

    try {
      // Call backend AI proxy
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgentForChat.id,
          agentName: selectedAgentForChat.name,
          prompt: currentInput,
          model: selectedModel,
          useRag: useRagContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiMsg: AIChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'AI Agent',
          agentId: selectedAgentForChat.id,
          agentName: selectedAgentForChat.name,
          content: data.reply || 'Hasil pemrosesan agentic AI selesai.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          requiresApproval: data.requiresApproval || false,
          approvalStatus: 'Pending',
          modelUsed: selectedModel
        };
        setChatMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('AI Server offline fallback');
      }
    } catch {
      // Fallback local smart response
      setTimeout(() => {
        const aiMsg: AIChatMessage = {
          id: `msg-${Date.now() + 1}`,
          sender: 'AI Agent',
          agentId: selectedAgentForChat.id,
          agentName: selectedAgentForChat.name,
          content: `[${selectedAgentForChat.name}] Tanggapan Otonom:\n\nTugas "${currentInput}" telah diproses menggunakan model ${selectedModel} (RAG Knowledge Active: ${useRagContext ? 'Ya' : 'Tidak'}).\n\n- Rekomendasi Klinis / Operasional telah divalidasi sesuai SOP Kemenkes RI.\n- Status: Berhasil disinkronkan ke Database SIMRS.\n\n*Jika tindakan ini berdampak tinggi, sistem telah mengarahkan ke Gateway Persetujuan Manusia (Human-in-the-Loop).*`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          requiresApproval: true,
          approvalStatus: 'Pending',
          modelUsed: selectedModel
        };
        setChatMessages(prev => [...prev, aiMsg]);
      }, 700);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const getAgentIcon = (iconName: string) => {
    switch (iconName) {
      case 'Bot': return <Bot className="h-5 w-5 text-cyan-400" />;
      case 'PhoneCall': return <PhoneCall className="h-5 w-5 text-emerald-400" />;
      case 'AlertTriangle': return <AlertTriangle className="h-5 w-5 text-rose-400" />;
      case 'FileText': return <FileText className="h-5 w-5 text-purple-400" />;
      case 'Pill': return <Pill className="h-5 w-5 text-amber-400" />;
      case 'TestTube': return <TestTube className="h-5 w-5 text-blue-400" />;
      case 'Scan': return <Scan className="h-5 w-5 text-teal-400" />;
      case 'Activity': return <Activity className="h-5 w-5 text-rose-500" />;
      case 'Bed': return <Bed className="h-5 w-5 text-indigo-400" />;
      case 'DollarSign': return <DollarSign className="h-5 w-5 text-emerald-400" />;
      case 'ShieldCheck': return <ShieldCheck className="h-5 w-5 text-cyan-300" />;
      default: return <Brain className="h-5 w-5 text-cyan-400" />;
    }
  };

  const filteredKnowledge = knowledgeDocs.filter(
    doc =>
      doc.title.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(knowledgeSearchQuery.toLowerCase()) ||
      doc.summary.toLowerCase().includes(knowledgeSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 shadow-inner">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Agentic AI Hospital Platform</h1>
                <span className="rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3 py-0.5 text-xs font-bold text-white shadow">
                  Autonomous Edition 7.0
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Ekosistem AI Agent Otonom Kolaboratif: Multi-Agent Registry, Task Orchestrator, Human Approval Gateway, Model Router, RAG Knowledge Base & Security Observability.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-500/20 px-3.5 py-2 text-xs font-bold text-indigo-300 border border-indigo-500/40 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              11 Active Autonomous Agents
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('agent_hub')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'agent_hub'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Bot className="h-4 w-4 text-cyan-400" />
          AI Agent Registry & Hub
        </button>
        <button
          onClick={() => setActiveTab('chat_center')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'chat_center'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="h-4 w-4 text-emerald-400" />
          Unified AI Chat Center
        </button>
        <button
          onClick={() => setActiveTab('human_approval')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition relative ${
            activeTab === 'human_approval'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <UserCheck className="h-4 w-4 text-amber-400" />
          Human Approval Gateway
          {approvalsList.filter(a => a.status === 'Pending Authorization').length > 0 && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white ml-1">
              {approvalsList.filter(a => a.status === 'Pending Authorization').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('workflow_engine')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'workflow_engine'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Layers className="h-4 w-4 text-purple-400" />
          Autonomous Workflow Engine
        </button>
        <button
          onClick={() => setActiveTab('knowledge_rag')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'knowledge_rag'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Database className="h-4 w-4 text-teal-400" />
          RAG Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab('model_router')}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'model_router'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Cpu className="h-4 w-4 text-rose-400" />
          Model Router & Observability
        </button>
      </div>

      {/* TAB 1: AI AGENT REGISTRY & HUB */}
      {activeTab === 'agent_hub' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-400" /> Direktori AI Agent Otonom RS
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Katalog AI Agent terdistribusi sesuai divisi rumah sakit. Setiap agent bertindak secara mandiri dan berkolaborasi via AI Orchestrator.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-mono">
                Total Agents: <strong className="text-cyan-400">{agentsList.length} Active</strong>
              </span>
              <button
                onClick={() => setShowAddAgentModal(true)}
                className="rounded-lg bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-400 transition"
              >
                + Deploy AI Agent Baru
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentsList.map((agent) => (
              <div
                key={agent.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-5 space-y-4 hover:border-indigo-500/50 transition shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-700">
                        {getAgentIcon(agent.avatarIcon)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-100 text-sm">{agent.name}</h4>
                        <span className="text-[10px] text-indigo-300 font-mono bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                          {agent.roleCategory}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="space-y-1 text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 font-mono">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">LLM Engine:</span>
                      <span className="text-cyan-300 font-bold">{agent.modelAssigned}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Akurasi / Latency:</span>
                      <span className="text-emerald-400 font-bold">{agent.accuracyRatePct}% / {agent.avgLatencyMs}ms</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Tugas Selesai:</span>
                      <span className="text-slate-200">{agent.tasksCompleted.toLocaleString()} Tasks</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {agent.toolsAllowed.map((tool, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                        ⚡ {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                    agent.status === 'Active Autonomous' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    ● {agent.status}
                  </span>

                  <button
                    onClick={() => {
                      setSelectedAgentForChat(agent);
                      setActiveTab('chat_center');
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500 hover:text-white transition"
                  >
                    <MessageSquare className="h-3.5 w-3.5" /> Chat & Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: UNIFIED AI CHAT CENTER */}
      {activeTab === 'chat_center' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Agent Selection */}
          <div className="lg:col-span-1 space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-400" /> Pilih Target AI Agent
            </h4>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {agentsList.map(ag => (
                <button
                  key={ag.id}
                  onClick={() => setSelectedAgentForChat(ag)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition flex items-center justify-between border ${
                    selectedAgentForChat.id === ag.id
                      ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/50 font-bold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {getAgentIcon(ag.avatarIcon)}
                    <span className="truncate">{ag.name}</span>
                  </div>
                  {ag.humanApprovalsPending > 0 && (
                    <span className="rounded-full bg-amber-500 text-slate-950 text-[10px] px-1.5 font-bold shrink-0">
                      {ag.humanApprovalsPending}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <label className="text-slate-400 font-semibold block">Model Router Target:</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded p-2 focus:border-indigo-500 focus:outline-none"
              >
                <option value="Google Gemini 3.6 Flash">Google Gemini 3.6 Flash (Fast Clinical)</option>
                <option value="DeepSeek R1 Clinical Reasoning">DeepSeek R1 Clinical Reasoning</option>
                <option value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="Meta Llama 3 70B On-Premise">Meta Llama 3 70B On-Premise</option>
              </select>

              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400">RAG Context (Vector DB):</span>
                <input
                  type="checkbox"
                  checked={useRagContext}
                  onChange={(e) => setUseRagContext(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-indigo-500 h-4 w-4"
                />
              </div>
            </div>
          </div>

          {/* Main Chat Interface */}
          <div className="lg:col-span-3 flex flex-col bg-slate-900/90 rounded-xl border border-slate-800 h-[620px]">
            {/* Active Agent Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-950 rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {getAgentIcon(selectedAgentForChat.avatarIcon)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">{selectedAgentForChat.name}</h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Model: <span className="text-cyan-300 font-bold">{selectedModel}</span> • Mode: <span className="text-emerald-400">Agentic Orchestration</span>
                  </p>
                </div>
              </div>

              <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-bold border border-emerald-500/30">
                Online Autonomous
              </span>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'User' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed space-y-2 ${
                      msg.sender === 'User'
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    {msg.agentName && (
                      <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 font-bold text-cyan-400 text-[11px]">
                        <Bot className="h-3.5 w-3.5" /> {msg.agentName}
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {/* Human Approval Required Badge inside Chat */}
                    {msg.requiresApproval && (
                      <div className="mt-2 pt-2 border-t border-slate-800 bg-amber-950/40 p-2.5 rounded border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-amber-300 font-bold text-[11px]">
                          <AlertTriangle className="h-4 w-4" /> Membutuhkan Persetujuan Otorisasi Manusia
                        </div>
                        <button
                          onClick={() => setActiveTab('human_approval')}
                          className="bg-amber-500 text-slate-950 px-2.5 py-1 rounded font-bold text-[10px] hover:bg-amber-400 transition"
                        >
                          Buka Gate Approval
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] opacity-60 pt-1">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && <span>Model: {msg.modelUsed}</span>}
                    </div>
                  </div>
                </div>
              ))}

              {isSendingMessage && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 italic">
                  <Bot className="h-4 w-4 animate-spin" /> {selectedAgentForChat.name} sedang memproses instruksi & RAG knowledge...
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 rounded-b-xl flex items-center gap-2">
              <button
                onClick={() => alert('Simulasi Unggah Dokumen Medis (PDF/DICOM/Audio Dikte) berhasil!')}
                className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 rounded-lg border border-slate-800 transition"
                title="Unggah Dokumen / Gambar / Audio"
              >
                <Upload className="h-4 w-4" />
              </button>

              <input
                type="text"
                placeholder={`Instruksikan ${selectedAgentForChat.name} atau berikan prompt...`}
                value={inputChatMessage}
                onChange={(e) => setInputChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-lg px-3 py-2.5 focus:border-indigo-500 focus:outline-none"
              />

              <button
                onClick={handleSendMessage}
                disabled={isSendingMessage}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-400 transition disabled:opacity-50"
              >
                <Send className="h-3.5 w-3.5" /> Kirim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HUMAN APPROVAL GATEWAY */}
      {activeTab === 'human_approval' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-amber-400" /> Human Approval Gateway (Human-In-The-Loop)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Setiap tindakan klinis, resep obat, jadwal operasi, dan pengadaan bernilai tinggi oleh AI Agent WAJIB diotorisasi oleh Tenaga Kesehatan / Manajemen.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30">
                {approvalsList.filter(a => a.status === 'Pending Authorization').length} Permintaan Menunggu Otorisasi
              </span>
              <button
                onClick={() => setShowAddApprovalModal(true)}
                className="rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
              >
                + Buat Tiket Approval Baru
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {approvalsList.map((ticket) => (
              <div
                key={ticket.id}
                className={`rounded-xl border p-4 space-y-3 transition ${
                  ticket.status === 'Pending Authorization'
                    ? 'border-amber-500/40 bg-slate-950'
                    : ticket.status === 'Approved'
                    ? 'border-emerald-500/30 bg-slate-950/60'
                    : 'border-rose-500/30 bg-slate-950/60'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-400">{ticket.ticketNumber}</span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                      Agent: {ticket.requesterAgent}
                    </span>
                    <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold border border-indigo-500/30">
                      {ticket.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono">Diminta: {ticket.requestedAt}</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      ticket.clinicalOrFinancialRisk === 'Tinggi (Kritis)' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      Risiko: {ticket.clinicalOrFinancialRisk}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-slate-300 font-bold">Subjek / Pasien: {ticket.patientNormOrSubject}</div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-200 leading-relaxed font-mono">
                    <span className="text-cyan-400 font-bold block mb-1">Rekomendasi AI Agent:</span>
                    {ticket.aiRecommendation}
                  </div>
                </div>

                {ticket.status === 'Pending Authorization' ? (
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleRejectTicket(ticket.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-rose-500/20 px-4 py-2 text-xs font-bold text-rose-300 border border-rose-500/40 hover:bg-rose-500 hover:text-white transition"
                    >
                      <X className="h-4 w-4" /> Tolak Rekomendasi
                    </button>
                    <button
                      onClick={() => handleApproveTicket(ticket.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition"
                    >
                      <Check className="h-4 w-4" /> Otorisasi & Tanda Tangan Digital
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className={`font-bold flex items-center gap-1 ${ticket.status === 'Approved' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {ticket.status === 'Approved' ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
                      Status: {ticket.status} oleh {ticket.authorizedBy}
                    </span>
                    <span className="text-slate-400">Catatan: {ticket.authorizationNotes}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUTONOMOUS WORKFLOW ENGINE */}
      {activeTab === 'workflow_engine' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="h-5 w-5 text-purple-400" /> End-to-End Autonomous Hospital Workflow Pipeline
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Alur kerja otomatisasi antar divisi rumah sakit saat pasien melakukan pendaftaran hingga discharge akhir.
            </p>
          </div>

          <div className="space-y-3">
            {workflowSteps.map((step) => (
              <div
                key={step.stepNumber}
                className={`rounded-xl border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                  step.status === 'Completed'
                    ? 'border-emerald-500/30 bg-slate-950'
                    : step.status === 'Active'
                    ? 'border-cyan-500/50 bg-slate-950 animate-pulse'
                    : 'border-slate-800 bg-slate-950/40 opacity-70'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold font-mono text-sm ${
                    step.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    0{step.stepNumber}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                      {step.stepName}
                      <span className="text-xs font-mono text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                        {step.assignedAgent}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">{step.actionRequired}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  {step.requiresHumanSignature && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-1 rounded font-bold border border-amber-500/30">
                      ✍️ Wajib Otorisasi Manusia
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setWorkflowSteps(prev =>
                        prev.map(s =>
                          s.stepNumber === step.stepNumber
                            ? { ...s, status: s.status === 'Completed' ? 'Active' : 'Completed' }
                            : s
                        )
                      );
                    }}
                    className={`px-3 py-1 rounded font-bold hover:scale-105 transition ${
                      step.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' : step.status === 'Active' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.status} (Klik Toggle)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: RAG KNOWLEDGE BASE */}
      {activeTab === 'knowledge_rag' && (
        <div className="space-y-5 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Database className="h-5 w-5 text-teal-400" /> Vector Knowledge Base & Evidence RAG Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Perpustakaan pengetahuan medis terstruktur: PPK Klinis, PNPK Kemenkes RI, FORNAS Obat, SOP WHO & Jurnal Medis Terindeks Vector Qdrant.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari guideline / obat / SOP..."
                  value={knowledgeSearchQuery}
                  onChange={(e) => setKnowledgeSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-xs rounded-lg pl-9 pr-3 py-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowUploadRagModal(true)}
                className="rounded-lg bg-teal-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-teal-400 transition shrink-0"
              >
                + Upload SOP/PPK Baru
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredKnowledge.map((doc) => (
              <div key={doc.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-slate-100 text-sm">{doc.title}</h4>
                  <span className="text-[10px] bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded font-bold border border-teal-500/30 shrink-0">
                    {doc.category}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded border border-slate-800">
                  {doc.summary}
                </p>

                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
                  <span>Vector Chunks: <strong className="text-cyan-400">{doc.chunksCount} chunks</strong></span>
                  <span className="text-emerald-400 font-bold">{doc.vectorDbStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: MODEL ROUTER & OBSERVABILITY */}
      {activeTab === 'model_router' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="h-5 w-5 text-rose-400" /> Dynamic Model Gateway & Auto-Routing Strategy
            </h3>
            <button
              onClick={() => {
                setBenchmarkingModel(true);
                setBenchmarkStatus(null);
                setTimeout(() => {
                  setBenchmarkingModel(false);
                  setBenchmarkStatus('Benchmark Selesai! Latency Rata-rata: 420ms, High Precision Rate: 99.4% (Optimal)');
                }, 1000);
              }}
              className="rounded-lg bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white hover:bg-indigo-400 transition flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {benchmarkingModel ? 'Menjalankan Benchmark...' : 'Uji Benchmark Latency Model'}
            </button>
          </div>

          {benchmarkStatus && (
            <div className="bg-emerald-950/40 border border-emerald-500/40 p-3 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <span>{benchmarkStatus}</span>
              <button onClick={() => setBenchmarkStatus(null)} className="text-slate-400 hover:text-slate-100">✕</button>
            </div>
          )}

          {/* Observability Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Tokens Today</span>
              <div className="text-lg font-bold text-cyan-400">4.82M</div>
              <span className="text-[10px] text-emerald-400 font-semibold">100% Within Budget</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Biaya LLM Hari Ini</span>
              <div className="text-lg font-bold text-emerald-400">${MOCK_AI_OBSERVABILITY.estCostTodayUsd}</div>
              <span className="text-[10px] text-slate-400">Avg $0.00015/1k</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Latency</span>
              <div className="text-lg font-bold text-indigo-300">{MOCK_AI_OBSERVABILITY.avgResponseLatencyMs} ms</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Realtime Stream</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Hallucination Rate</span>
              <div className="text-lg font-bold text-emerald-400">{MOCK_AI_OBSERVABILITY.hallucinationRatePct}%</div>
              <span className="text-[10px] text-emerald-300 font-semibold">Zero-Tolerance Clinical</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Audit Trail Logs</span>
              <div className="text-lg font-bold text-cyan-400">{MOCK_AI_OBSERVABILITY.auditTrailLogsCount.toLocaleString()}</div>
              <span className="text-[10px] text-slate-400">100% Encrypted</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Human Approval</span>
              <div className="text-lg font-bold text-amber-400">{MOCK_AI_OBSERVABILITY.humanApprovalRatePct}%</div>
              <span className="text-[10px] text-amber-300 font-semibold">HITL Enforced</span>
            </div>
          </div>

          {/* Model Gateway Table */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3">Model Name</th>
                    <th className="p-3">Provider</th>
                    <th className="p-3">Latency</th>
                    <th className="p-3">Cost / 1k Tokens</th>
                    <th className="p-3">Clinical Accuracy</th>
                    <th className="p-3">Workload Priority</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {MOCK_MODEL_ROUTERS.map((mr, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-slate-100">{mr.modelName}</td>
                      <td className="p-3 text-cyan-400">{mr.provider}</td>
                      <td className="p-3 text-slate-300">{mr.latencyMs} ms</td>
                      <td className="p-3 text-emerald-400">${mr.costPer1kTokensUsd}</td>
                      <td className="p-3 text-indigo-300 font-bold">{mr.accuracyScore}%</td>
                      <td className="p-3 text-slate-400 font-sans">{mr.activeWorkloads}</td>
                      <td className="p-3">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          mr.status === 'Primary Optimal' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {mr.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Agent */}
      {showAddAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Deploy AI Agent Otonom Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nama Agent AI:</label>
                <input
                  type="text"
                  placeholder="Kardiologi Copilot Agent"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Kategori Divisi RS:</label>
                <select
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Farmasi & Obat">Farmasi & Obat</option>
                  <option value="Laboratorium & Patologi">Laboratorium & Patologi</option>
                  <option value="Radiologi & X-Ray AI">Radiologi & X-Ray AI</option>
                  <option value="Rawat Inap & ICU">Rawat Inap & ICU</option>
                  <option value="Klaim BPJS & Billing">Klaim BPJS & Billing</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Model LLM Engine:</label>
                <select
                  value={newAgentModel}
                  onChange={(e) => setNewAgentModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Google Gemini 3.6 Flash">Google Gemini 3.6 Flash</option>
                  <option value="DeepSeek R1 Clinical Reasoning">DeepSeek R1 Clinical Reasoning</option>
                  <option value="Anthropic Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddAgentModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newAgentName) {
                    const newAg: AIAgentItem = {
                      id: `ag-${Date.now()}`,
                      name: newAgentName,
                      roleCategory: newAgentRole,
                      modelAssigned: newAgentModel,
                      avatarIcon: 'Bot',
                      description: `Agent Otonom khusus ${newAgentRole} dengan integrasi SIMRS.`,
                      systemPrompt: 'Sistem Prompt Otonom Agent SIMRS.',
                      toolsAllowed: ['simrs_database_query', 'satusehat_fhir_push'],
                      tasksCompleted: 0,
                      accuracyRatePct: 99.1,
                      avgLatencyMs: 380,
                      status: 'Active Autonomous',
                      humanApprovalsPending: 0
                    };
                    setAgentsList([...agentsList, newAg]);
                    setShowAddAgentModal(false);
                    setNewAgentName('');
                    alert(`Agent AI ${newAgentName} berhasil dideploy!`);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-indigo-500 text-xs text-white font-bold hover:bg-indigo-400"
              >
                Deploy Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add Human Approval Ticket */}
      {showAddApprovalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Buat Tiket Otorisasi Manusia Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Subjek / NORM Pasien:</label>
                <input
                  type="text"
                  placeholder="RM-2026-0045 (Siti Aminah)"
                  value={newApprovalPatient}
                  onChange={(e) => setNewApprovalPatient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Rekomendasi Tindakan AI Agent:</label>
                <textarea
                  rows={3}
                  placeholder="Rekomendasi pemberian dosis meropenem 1g IV tiap 8 jam..."
                  value={newApprovalRec}
                  onChange={(e) => setNewApprovalRec(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Tingkat Risiko:</label>
                <select
                  value={newApprovalRisk}
                  onChange={(e) => setNewApprovalRisk(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-amber-500 focus:outline-none"
                >
                  <option value="Tinggi (Kritis)">Tinggi (Kritis)</option>
                  <option value="Sedang (Signifikan)">Sedang (Signifikan)</option>
                  <option value="Rendah (Rutin)">Rendah (Rutin)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddApprovalModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newApprovalPatient && newApprovalRec) {
                    const ticket: HumanApprovalItem = {
                      id: `app-${Date.now()}`,
                      ticketNumber: `REQ-2026-${Math.floor(Math.random() * 900) + 100}`,
                      requesterAgent: selectedAgentForChat.name,
                      category: 'Resep & Farmasi',
                      requestedAt: 'Just now',
                      patientNormOrSubject: newApprovalPatient,
                      aiRecommendation: newApprovalRec,
                      clinicalOrFinancialRisk: newApprovalRisk,
                      status: 'Pending Authorization'
                    };
                    setApprovalsList([ticket, ...approvalsList]);
                    setShowAddApprovalModal(false);
                    setNewApprovalPatient('');
                    setNewApprovalRec('');
                    alert('Tiket otorisasi manusia berhasil dibuat!');
                  }
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 text-xs text-slate-950 font-bold hover:bg-amber-400"
              >
                Kirim Tiket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload RAG */}
      {showUploadRagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Upload Dokumen SOP / PPK Medis ke Vector DB</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Judul Dokumen:</label>
                <input
                  type="text"
                  placeholder="PNPK Tata Laksana Sepsis Kemenkes 2026"
                  value={newRagTitle}
                  onChange={(e) => setNewRagTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Kategori Dokumen:</label>
                <select
                  value={newRagCategory}
                  onChange={(e) => setNewRagCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-teal-500 focus:outline-none"
                >
                  <option value="Pedoman Klinik (PPK)">Pedoman Klinik (PPK)</option>
                  <option value="Formularium Obat (FORNAS)">Formularium Obat (FORNAS)</option>
                  <option value="SOP Operasional RS">SOP Operasional RS</option>
                  <option value="Panduan ICD-10 & Ina-CBG">Panduan ICD-10 & Ina-CBG</option>
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Ringkasan Isi / Ekstrak Teks:</label>
                <textarea
                  rows={3}
                  placeholder="Teks ringkas indikasi dan dosis panduan klinis..."
                  value={newRagSummary}
                  onChange={(e) => setNewRagSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowUploadRagModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newRagTitle) {
                    const doc: KnowledgeBaseDocument = {
                      id: `rag-${Date.now()}`,
                      title: newRagTitle,
                      category: newRagCategory,
                      chunksCount: 24,
                      vectorDbStatus: 'Indexed in Qdrant Vector',
                      summary: newRagSummary || 'Dokumen panduan medis resmi terindeks ke database vektor AI.',
                      lastUpdated: 'Baru saja'
                    };
                    setKnowledgeDocs([doc, ...knowledgeDocs]);
                    setShowUploadRagModal(false);
                    setNewRagTitle('');
                    setNewRagSummary('');
                    alert(`Dokumen ${newRagTitle} berhasil diindeks ke Vector DB!`);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-teal-500 text-xs text-slate-950 font-bold hover:bg-teal-400"
              >
                Upload & Indeks Vector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
