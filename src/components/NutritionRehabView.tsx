import React, { useState } from 'react';
import {
  Utensils,
  Activity,
  Apple,
  Sparkles,
  CheckCircle2,
  Clock,
  Dumbbell,
  AlertCircle,
  Brain,
  Search,
  User,
  Heart,
  Plus,
  Printer,
  QrCode,
  Filter,
  Flame,
  Scale,
  TrendingUp,
  X,
  RefreshCw,
  ChefHat,
  Send
} from 'lucide-react';
import { MOCK_DIET_ORDERS, MOCK_REHAB_SESSIONS, MOCK_PATIENTS } from '../data/mockData';
import { DietOrder, RehabSession } from '../types';

interface MSTResult {
  id: string;
  patientName: string;
  norm: string;
  wardBed: string;
  weightLossKg: number;
  appetiteDecreased: boolean;
  bmi: number;
  score: number; // 0-1 Low Risk, >=2 High Risk
  riskLevel: 'Rendah (Low Risk)' | 'Tinggi (High Risk - Intervensi Ahli Gizi)';
  date: string;
}

export const NutritionRehabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Nutrition' | 'KitchenLabel' | 'MST' | 'Rehab'>('Nutrition');
  const [dietOrders, setDietOrders] = useState<DietOrder[]>(MOCK_DIET_ORDERS);
  const [rehabSessions, setRehabSessions] = useState<RehabSession[]>(MOCK_REHAB_SESSIONS);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWard, setSelectedWard] = useState('All');

  // Modals state
  const [isDietModalOpen, setIsDietModalOpen] = useState(false);
  const [isRehabModalOpen, setIsRehabModalOpen] = useState(false);
  const [selectedMealLabel, setSelectedMealLabel] = useState<DietOrder | null>(null);

  // Form states for new Diet Order
  const [newDiet, setNewDiet] = useState({
    patientName: '',
    norm: '',
    wardBed: 'Mawar 101-A',
    dietType: 'Low Salt (RG)' as DietOrder['dietType'],
    caloriesKcal: 1800,
    foodAllergies: '',
    nutritionistName: 'Nutr. Ratna Sp.Gz',
  });

  // Form states for new Rehab Session
  const [newRehab, setNewRehab] = useState({
    patientName: '',
    norm: '',
    therapyType: 'Physiotherapy' as RehabSession['therapyType'],
    therapistName: 'Ftr. Rudi Pratama, S.Ft',
    exercisePlan: 'Latihan mobilitas pasif ROM & strengthening kuadrisep 3x15 repetisi',
    progressNotes: 'Fleksi lutut mencapai 90 derajat, nyeri berkurang (VAS 3/10)',
    outcomeScore: 75,
  });

  // MST Screener state
  const [mstForm, setMstForm] = useState({
    patientName: 'Siti Rahmawati',
    norm: 'RM-2026-00441',
    wardBed: 'Melati 204-B',
    weightLoss: 1, // 0: Tidak ada (0), 1: 1-5kg (1), 2: 6-10kg (2), 3: >10kg (3)
    eatingLess: true, // 1 point
    weightKg: 48,
    heightCm: 160,
  });

  const [mstHistory, setMstHistory] = useState<MSTResult[]>([
    {
      id: 'mst-1',
      patientName: 'Ahmad Dahlan',
      norm: 'RM-2026-00812',
      wardBed: 'Mawar 101-A',
      weightLossKg: 6,
      appetiteDecreased: true,
      bmi: 17.5,
      score: 3,
      riskLevel: 'Tinggi (High Risk - Intervensi Ahli Gizi)',
      date: '2026-08-03'
    },
    {
      id: 'mst-2',
      patientName: 'Budi Santoso',
      norm: 'RM-2026-00105',
      wardBed: 'Anggrek 302-C',
      weightLossKg: 0,
      appetiteDecreased: false,
      bmi: 24.2,
      score: 0,
      riskLevel: 'Rendah (Low Risk)',
      date: '2026-08-02'
    }
  ]);

  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  // Handlers
  const handleAddDietOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiet.patientName) return;

    const allergiesArr = newDiet.foodAllergies
      ? newDiet.foodAllergies.split(',').map((s) => s.trim())
      : [];

    const item: DietOrder = {
      id: `dt-${Date.now()}`,
      patientName: newDiet.patientName,
      norm: newDiet.norm || `RM-2026-${Math.floor(100 + Math.random() * 900)}`,
      wardBed: newDiet.wardBed,
      dietType: newDiet.dietType,
      caloriesKcal: Number(newDiet.caloriesKcal),
      foodAllergies: allergiesArr,
      nutritionistName: newDiet.nutritionistName,
      mealDeliveryStatus: 'Meal Prepared',
      aiDietRecommendation: `Diet ${newDiet.dietType} ${newDiet.caloriesKcal} kkal disesuaikan dengan kondisi metabolik. Evaluasi asupan protein & cairan harian.`
    };

    setDietOrders([item, ...dietOrders]);
    setIsDietModalOpen(false);
    setNewDiet({
      patientName: '',
      norm: '',
      wardBed: 'Mawar 101-A',
      dietType: 'Low Salt (RG)',
      caloriesKcal: 1800,
      foodAllergies: '',
      nutritionistName: 'Nutr. Ratna Sp.Gz',
    });
  };

  const handleAddRehabSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRehab.patientName) return;

    const item: RehabSession = {
      id: `rh-${Date.now()}`,
      patientName: newRehab.patientName,
      norm: newRehab.norm || `RM-2026-${Math.floor(100 + Math.random() * 900)}`,
      therapyType: newRehab.therapyType,
      therapistName: newRehab.therapistName,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exercisePlan: newRehab.exercisePlan,
      progressNotes: newRehab.progressNotes,
      outcomeScore: Number(newRehab.outcomeScore),
      aiExerciseRecommendation: 'Disarankan program pemulihan 3x seminggu. Fokus pada stabilitas core dan gait training.'
    };

    setRehabSessions([item, ...rehabSessions]);
    setIsRehabModalOpen(false);
    setNewRehab({
      patientName: '',
      norm: '',
      therapyType: 'Physiotherapy',
      therapistName: 'Ftr. Rudi Pratama, S.Ft',
      exercisePlan: 'Latihan mobilitas pasif ROM & strengthening kuadrisep 3x15 repetisi',
      progressNotes: 'Fleksi lutut mencapai 90 derajat, nyeri berkurang (VAS 3/10)',
      outcomeScore: 75,
    });
  };

  const handleUpdateMealStatus = (id: string, nextStatus: DietOrder['mealDeliveryStatus']) => {
    setDietOrders((prev) =>
      prev.map((d) => (d.id === id ? { ...d, mealDeliveryStatus: nextStatus } : d))
    );
  };

  const handleGenerateAIDietPlan = (id: string) => {
    setAiGeneratingId(id);
    setTimeout(() => {
      setDietOrders((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            return {
              ...d,
              aiDietRecommendation: `[AI Dietitian Verified]: Tipe Diet ${d.dietType} (${d.caloriesKcal} kkal). Pembagian porsi: Karbohidrat 55%, Protein 20% (rendah purin/natrium), Lemak 25%. Hindari allergen: ${d.foodAllergies.join(', ') || 'Nihil'}. Suplementasi Zinc & Vitamin D3 disarankan.`
            };
          }
          return d;
        })
      );
      setAiGeneratingId(null);
    }, 1000);
  };

  const calculateMSTScore = () => {
    let score = 0;
    // weightLoss score: 0 (0kg), 1 (1-5kg), 2 (6-10kg), 3 (>10kg)
    score += mstForm.weightLoss;
    if (mstForm.eatingLess) score += 1;

    const heightM = mstForm.heightCm / 100;
    const bmi = Number((mstForm.weightKg / (heightM * heightM)).toFixed(1));

    return { score, bmi };
  };

  const handleSaveMST = (e: React.FormEvent) => {
    e.preventDefault();
    const { score, bmi } = calculateMSTScore();
    const isHighRisk = score >= 2;

    const newMst: MSTResult = {
      id: `mst-${Date.now()}`,
      patientName: mstForm.patientName,
      norm: mstForm.norm,
      wardBed: mstForm.wardBed,
      weightLossKg: mstForm.weightLoss === 1 ? 3 : mstForm.weightLoss === 2 ? 8 : mstForm.weightLoss === 3 ? 12 : 0,
      appetiteDecreased: mstForm.eatingLess,
      bmi,
      score,
      riskLevel: isHighRisk ? 'Tinggi (High Risk - Intervensi Ahli Gizi)' : 'Rendah (Low Risk)',
      date: new Date().toISOString().split('T')[0]
    };

    setMstHistory([newMst, ...mstHistory]);
    alert(`Skrining MST Berhasil Disimpan!\nSkor MST: ${score}\nKategori: ${newMst.riskLevel}`);
  };

  const filteredDietOrders = dietOrders.filter((dt) => {
    const matchSearch =
      dt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dt.norm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dt.wardBed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchWard = selectedWard === 'All' || dt.wardBed.toLowerCase().includes(selectedWard.toLowerCase());
    return matchSearch && matchWard;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Utensils className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Gizi Klinis, Dapur Diet & Rehabilitasi Medik
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-xs sm:text-sm">
                Manajemen asuhan gizi terintegrasi EMR, preskripsi diet, distribusi porsi dapur, skrining MST & fisioterapi pasien.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="flex flex-wrap items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('Nutrition')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'Nutrition'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Apple className="w-4 h-4" />
            Order Diet & Gizi
          </button>
          <button
            onClick={() => setActiveTab('KitchenLabel')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'KitchenLabel'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            Dapur & Barcode Makanan
          </button>
          <button
            onClick={() => setActiveTab('MST')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'MST'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Scale className="w-4 h-4" />
            Skrining MST Malnutrisi
          </button>
          <button
            onClick={() => setActiveTab('Rehab')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition ${
              activeTab === 'Rehab'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            Fisioterapi & Rehab
          </button>
        </div>
      </div>

      {/* Top KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Order Diet Aktif Rawat Inap</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{dietOrders.length} Pasien</p>
            <span className="text-[11px] text-emerald-600 font-medium">Terverifikasi Sp.Gz</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-2xl">
            <Apple className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Distribusi Makanan Siang</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {Math.round(
                (dietOrders.filter((d) => d.mealDeliveryStatus === 'Delivered' || d.mealDeliveryStatus === 'Consumed').length /
                  (dietOrders.length || 1)) *
                  100
              )}% Terdistribusi
            </p>
            <span className="text-[11px] text-slate-400">Jadwal Makan Siang: 12:00 WIB</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-2xl">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">MST High Risk Malnutrisi</p>
            <p className="text-2xl font-black text-amber-600 mt-1">
              {mstHistory.filter((m) => m.score >= 2).length} Pasien
            </p>
            <span className="text-[11px] text-amber-600 font-bold">Butuh Asuhan Gizi Lanjutan</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Sesi Fisioterapi Hari Ini</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{rehabSessions.length} Sesi Terapi</p>
            <span className="text-[11px] text-indigo-600 font-medium">Progres Rata-rata 82/100</span>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-600 rounded-2xl">
            <Dumbbell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB 1: NUTRITION DIET ORDERS */}
      {activeTab === 'Nutrition' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Apple className="w-5 h-5 text-emerald-600" />
                Preskripsi Diet Pasien & Rekomendasi AI Gizi Klinis
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daftar instruksi makanan khusus rawat inap, restriksi garam, kalori, alergi, dan status antar kurir dapur.
              </p>
            </div>

            <button
              onClick={() => setIsDietModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Buat Order Diet Baru
            </button>
          </div>

          {/* Search & Filter bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari pasien, No RM, atau Ruangan (contoh: Mawar 101)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
            >
              <option value="All">Semua Ruang Inap</option>
              <option value="Mawar">Ruang Mawar</option>
              <option value="Anggrek">Ruang Anggrek</option>
              <option value="Melati">Ruang Melati</option>
              <option value="ICU">ICU / ICCU</option>
            </select>
          </div>

          {/* Diet Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDietOrders.map((dt) => (
              <div
                key={dt.id}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5 hover:border-emerald-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md">
                      {dt.wardBed}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">{dt.patientName}</h4>
                    <p className="text-xs text-slate-500 font-mono">{dt.norm} • Nutr: {dt.nutritionistName}</p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 text-xs font-extrabold rounded-lg border ${
                        dt.mealDeliveryStatus === 'Delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : dt.mealDeliveryStatus === 'In Transit'
                          ? 'bg-blue-500/10 text-blue-600 border-blue-500/20'
                          : dt.mealDeliveryStatus === 'Consumed'
                          ? 'bg-purple-500/10 text-purple-600 border-purple-500/20'
                          : 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      }`}
                    >
                      {dt.mealDeliveryStatus === 'Meal Prepared'
                        ? 'Dapur Siap'
                        : dt.mealDeliveryStatus === 'In Transit'
                        ? 'Pengantaran'
                        : dt.mealDeliveryStatus === 'Delivered'
                        ? 'Sampai Ruangan'
                        : 'Sudah Dimakan'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block font-semibold text-[11px]">Preskripsi Diet:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      {dt.dietType} ({dt.caloriesKcal} kkal)
                    </span>
                  </div>
                  <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400 block font-semibold text-[11px]">Alergi Makanan:</span>
                    <span className="font-bold text-rose-600 text-xs">
                      {dt.foodAllergies.length > 0 ? dt.foodAllergies.join(', ') : 'Tidak Ada'}
                    </span>
                  </div>
                </div>

                {/* AI Recommendation Box */}
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5">
                  <Brain className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <strong className="font-bold">AI Clinical Dietitian Recommendation:</strong>
                      <button
                        onClick={() => handleGenerateAIDietPlan(dt.id)}
                        disabled={aiGeneratingId === dt.id}
                        className="text-[10px] text-emerald-700 dark:text-emerald-300 underline font-bold hover:text-emerald-800"
                      >
                        {aiGeneratingId === dt.id ? 'Memproses...' : 'Perbarui AI'}
                      </button>
                    </div>
                    <p className="text-xs leading-relaxed">{dt.aiDietRecommendation}</p>
                  </div>
                </div>

                {/* Controls & Label Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400 text-[11px] font-medium mr-1">Ubah Status:</span>
                    <button
                      onClick={() => handleUpdateMealStatus(dt.id, 'In Transit')}
                      className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-900/30 rounded text-[11px] font-bold hover:bg-blue-100"
                    >
                      Kirim Kurir
                    </button>
                    <button
                      onClick={() => handleUpdateMealStatus(dt.id, 'Delivered')}
                      className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 rounded text-[11px] font-bold hover:bg-emerald-100"
                    >
                      Diterima Bed
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedMealLabel(dt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Cetak Label Dapur
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KITCHEN BARCODE LABELING & MEAL DISTRIBUTION */}
      {activeTab === 'KitchenLabel' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-amber-500" />
                Dapur Produksi & Labeling Barcode Makanan Pasien
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pencetakan label stiker baki makanan pasien dengan instruksi diet higienis & barcode scan pengantaran.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dietOrders.map((dt) => (
              <div
                key={dt.id}
                className="p-4 bg-amber-500/5 dark:bg-slate-800/80 rounded-2xl border-2 border-dashed border-amber-300 dark:border-amber-500/30 space-y-3 relative overflow-hidden"
              >
                <div className="bg-amber-500 text-slate-950 px-3 py-1 text-[11px] font-black tracking-wider uppercase rounded-b-lg absolute top-0 left-4 shadow-sm">
                  STIKER BAKI DAPUR RSUD
                </div>

                <div className="pt-6 flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base">{dt.patientName}</h4>
                    <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-400">{dt.norm}</span>
                  </div>
                  <span className="px-2.5 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-extrabold text-xs rounded-lg">
                    {dt.wardBed}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-700 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-700 dark:text-slate-200 font-bold">
                    <span>Jenis Diet:</span>
                    <span className="text-amber-700 dark:text-amber-400">{dt.dietType}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 dark:text-slate-300">
                    <span>Kalori Target:</span>
                    <span className="font-mono font-bold">{dt.caloriesKcal} kkal</span>
                  </div>
                  {dt.foodAllergies.length > 0 && (
                    <div className="p-1.5 bg-rose-500/10 border border-rose-500/20 rounded text-rose-600 font-bold text-[11px]">
                      ⚠️ PERINGATAN ALERGI: {dt.foodAllergies.join(', ')}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
                    <QrCode className="w-4 h-4 text-amber-600" />
                    <span>BC-{dt.norm.replace('RM-', '')}</span>
                  </div>
                  <button
                    onClick={() => setSelectedMealLabel(dt)}
                    className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Stiker
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MST MALNUTRITION SCREENING TOOL */}
      {activeTab === 'MST' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Screener */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-500" />
              Kalkulator Skrining MST Malnutrisi
            </h3>
            <p className="text-xs text-slate-500">
              Form standar Malnutrition Screening Tool (MST) untuk deteksi awal risiko kurang gizi pasien rawat inap.
            </p>

            <form onSubmit={handleSaveMST} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  value={mstForm.patientName}
                  onChange={(e) => setMstForm({ ...mstForm, patientName: e.target.value })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">No RM</label>
                  <input
                    type="text"
                    required
                    value={mstForm.norm}
                    onChange={(e) => setMstForm({ ...mstForm, norm: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Ruang / Bed</label>
                  <input
                    type="text"
                    required
                    value={mstForm.wardBed}
                    onChange={(e) => setMstForm({ ...mstForm, wardBed: e.target.value })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    value={mstForm.weightKg}
                    onChange={(e) => setMstForm({ ...mstForm, weightKg: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={mstForm.heightCm}
                    onChange={(e) => setMstForm({ ...mstForm, heightCm: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  1. Apakah ada penurunan berat badan yang tidak diinginkan dalam 6 bulan terakhir?
                </label>
                <select
                  value={mstForm.weightLoss}
                  onChange={(e) => setMstForm({ ...mstForm, weightLoss: Number(e.target.value) })}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-slate-900 dark:text-white font-medium"
                >
                  <option value={0}>Tidak ada (Skor 0)</option>
                  <option value={1}>Ya, turun 1 - 5 kg (Skor 1)</option>
                  <option value={2}>Ya, turun 6 - 10 kg (Skor 2)</option>
                  <option value={3}>Ya, turun &gt; 10 kg (Skor 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  2. Apakah asupan makan berkurang karena penurunan nafsu makan / kesulitan mengunyah/menelan?
                </label>
                <div className="flex gap-4 items-center pt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="eatingLess"
                      checked={mstForm.eatingLess}
                      onChange={() => setMstForm({ ...mstForm, eatingLess: true })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    Ya (Skor +1)
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold">
                    <input
                      type="radio"
                      name="eatingLess"
                      checked={!mstForm.eatingLess}
                      onChange={() => setMstForm({ ...mstForm, eatingLess: false })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    Tidak (Skor +0)
                  </label>
                </div>
              </div>

              {/* Score Calculation Preview */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Total Skor MST:</span>
                  <span className="text-xl font-black">{calculateMSTScore().score} / 4</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300 text-[11px]">
                  <span>IMT Pasien:</span>
                  <span className="font-bold">{calculateMSTScore().bmi} kg/m²</span>
                </div>
                <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1">
                  {calculateMSTScore().score >= 2
                    ? '⚠️ RISIKO TINGGI: Memerlukan konsultasi & intervensi asuhan gizi Sp.Gz dalam 24 jam.'
                    : '✅ RISIKO RENDAH: Reskrining rutin dalam 7 hari.'}
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition shadow-sm"
              >
                Simpan Hasil Skrining MST
              </button>
            </form>
          </div>

          {/* History List */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Riwayat Skrining Gizi Pasien Rawat Inap
            </h3>

            <div className="space-y-3">
              {mstHistory.map((m) => (
                <div
                  key={m.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{m.patientName}</span>
                      <span className="text-xs text-slate-500 font-mono">({m.norm})</span>
                      <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded">
                        {m.wardBed}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      IMT: <strong>{m.bmi} kg/m²</strong> • Asupan Makan: {m.appetiteDecreased ? 'Berkurang' : 'Normal'} • Tgl Skrining: {m.date}
                    </p>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-black inline-block ${
                        m.score >= 2
                          ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      }`}
                    >
                      Skor MST: {m.score} ({m.score >= 2 ? 'High Risk' : 'Low Risk'})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REHABILITATION & PHYSIOTHERAPY */}
      {activeTab === 'Rehab' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-500" />
                Sesi Terapi & Evaluasi Progres Rehabilitasi Medik
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pemantauan modalitas fisioterapi, okupasi terapi, terapi wicara, skor Range of Motion (ROM), & evaluasi AI.
              </p>
            </div>

            <button
              onClick={() => setIsRehabModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              + Tambah Sesi Fisioterapi
            </button>
          </div>

          <div className="space-y-4">
            {rehabSessions.map((sess) => (
              <div
                key={sess.id}
                className="p-5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3.5 hover:border-indigo-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-md">
                      {sess.therapyType}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base mt-1">{sess.patientName}</h4>
                    <p className="text-xs text-slate-500">
                      {sess.norm} • Fisioterapis DPJP: <strong className="text-slate-700 dark:text-slate-300">{sess.therapistName}</strong>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-semibold">Skor Evaluasi Progres</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{sess.outcomeScore} / 100</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Rencana Latihan:</strong> {sess.exercisePlan}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-white">Catatan Progres:</strong> {sess.progressNotes}
                  </p>
                </div>

                {/* AI Exercise Recommendation */}
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                  <Brain className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <strong className="block font-bold">Rekomendasi Latihan Lanjutan AI (Physio-AI):</strong>
                    {sess.aiExerciseRecommendation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE DIET ORDER */}
      {isDietModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Apple className="w-5 h-5 text-emerald-600" />
                Preskripsi Order Diet Pasien Baru
              </h3>
              <button
                onClick={() => setIsDietModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDietOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ny. Maryam"
                  value={newDiet.patientName}
                  onChange={(e) => setNewDiet({ ...newDiet, patientName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">No Rekam Medis</label>
                  <input
                    type="text"
                    placeholder="RM-2026-00xxx"
                    value={newDiet.norm}
                    onChange={(e) => setNewDiet({ ...newDiet, norm: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Ruang / Bed Inap</label>
                  <input
                    type="text"
                    required
                    value={newDiet.wardBed}
                    onChange={(e) => setNewDiet({ ...newDiet, wardBed: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Jenis Diet Preskripsi</label>
                  <select
                    value={newDiet.dietType}
                    onChange={(e) => setNewDiet({ ...newDiet, dietType: e.target.value as DietOrder['dietType'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Low Salt (RG)">Low Salt (Rendah Garam RG-1/RG-2)</option>
                    <option value="Diabetes Mellitus (DM)">Diabetes Mellitus (DM 1700-1900 kkal)</option>
                    <option value="High Protein">High Protein / Tinggi Kalori (TPTK)</option>
                    <option value="Renal / Gagal Ginjal">Renal / Restriksi Protein (RP)</option>
                    <option value="Soft Food">Makanan Lunak / Tim</option>
                    <option value="Liquid Diet">Makanan Cair / Blenderized Sonde</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Target Kalori (kkal)</label>
                  <input
                    type="number"
                    required
                    value={newDiet.caloriesKcal}
                    onChange={(e) => setNewDiet({ ...newDiet, caloriesKcal: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Alergi Makanan (pisahkan koma)</label>
                <input
                  type="text"
                  placeholder="Contoh: Udang, Seafood, Kacang Tanah"
                  value={newDiet.foodAllergies}
                  onChange={(e) => setNewDiet({ ...newDiet, foodAllergies: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-rose-600 font-semibold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDietModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Simpan Preskripsi Diet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE REHAB SESSION */}
      {isRehabModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-500" />
                Tambah Sesi Fisioterapi / Rehab Medik
              </h3>
              <button
                onClick={() => setIsRehabModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRehabSession} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Nama Pasien</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Tn. Bambang Subagyo"
                  value={newRehab.patientName}
                  onChange={(e) => setNewRehab({ ...newRehab, patientName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">No Rekam Medis</label>
                  <input
                    type="text"
                    placeholder="RM-2026-xxxx"
                    value={newRehab.norm}
                    onChange={(e) => setNewRehab({ ...newRehab, norm: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Jenis Terapi</label>
                  <select
                    value={newRehab.therapyType}
                    onChange={(e) => setNewRehab({ ...newRehab, therapyType: e.target.value as RehabSession['therapyType'] })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-bold text-slate-900 dark:text-white"
                  >
                    <option value="Physiotherapy">Fisioterapi Motorik</option>
                    <option value="Occupational Therapy">Okupasi Terapi</option>
                    <option value="Speech Therapy">Terapi Wicara</option>
                    <option value="Neurology Rehab">Rehabilitasi Neurologi (Stroke)</option>
                    <option value="Cardiac Rehab">Rehabilitasi Jantung</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Rencana Latihan / Modalitas</label>
                <textarea
                  rows={2}
                  value={newRehab.exercisePlan}
                  onChange={(e) => setNewRehab({ ...newRehab, exercisePlan: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">Catatan Progres Klinis</label>
                <textarea
                  rows={2}
                  value={newRehab.progressNotes}
                  onChange={(e) => setNewRehab({ ...newRehab, progressNotes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-bold mb-1">
                  Skor Evaluasi Outcome (0 - 100): {newRehab.outcomeScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newRehab.outcomeScore}
                  onChange={(e) => setNewRehab({ ...newRehab, outcomeScore: Number(e.target.value) })}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRehabModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Simpan Sesi Rehab
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PRINT MEAL LABEL PREVIEW */}
      {selectedMealLabel && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedMealLabel(null)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1 border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">PREVIEW STIKER DAPUR GIZI RS</h3>
              <p className="text-[11px] text-slate-500 font-mono">STANDAR MUTU HIGIENE AKREDITASI STARKES</p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-slate-800 border-2 border-dashed border-amber-400 dark:border-amber-500/40 rounded-xl space-y-3 font-mono text-xs text-slate-900 dark:text-white">
              <div className="flex justify-between items-center border-b border-amber-200 dark:border-slate-700 pb-2">
                <span className="font-black text-amber-800 dark:text-amber-400">RSUD SMART MEDIKA</span>
                <span className="text-[10px] bg-amber-200 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-bold">
                  BAKI {selectedMealLabel.wardBed}
                </span>
              </div>

              <div>
                <span className="text-slate-500 text-[10px] block">PASIEN:</span>
                <strong className="text-sm font-black">{selectedMealLabel.patientName}</strong>
                <span className="block text-[11px] text-slate-600 dark:text-slate-400">NO RM: {selectedMealLabel.norm}</span>
              </div>

              <div className="p-2 bg-white dark:bg-slate-900 rounded border border-amber-200 dark:border-slate-700">
                <span className="text-slate-500 text-[10px] block">PRESKRPSI DIET:</span>
                <strong className="text-amber-700 dark:text-amber-300 text-xs">
                  {selectedMealLabel.dietType} ({selectedMealLabel.caloriesKcal} Kkal)
                </strong>
              </div>

              {selectedMealLabel.foodAllergies.length > 0 && (
                <div className="p-2 bg-rose-500/10 text-rose-600 border border-rose-500/30 rounded font-bold text-[11px]">
                  ⚠️ CATATAN ALERGI: {selectedMealLabel.foodAllergies.join(', ')}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <div className="text-[10px] text-slate-400">
                  <span>TGL: {new Date().toLocaleDateString('id-ID')}</span>
                  <span className="block">AHLE GIZI: {selectedMealLabel.nutritionistName}</span>
                </div>
                <div className="p-1 bg-white rounded border border-slate-300">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedMealLabel(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  alert(`Mencetak label baki dapur makanan untuk ${selectedMealLabel.patientName}...`);
                  setSelectedMealLabel(null);
                }}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                Cetak Stiker Barcode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
