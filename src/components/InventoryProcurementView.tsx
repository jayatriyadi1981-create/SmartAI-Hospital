/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Warehouse,
  Boxes,
  Truck,
  ShoppingCart,
  Users,
  Wrench,
  Search,
  Plus,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  BarChart2,
  ShieldCheck,
  Sparkles,
  Clock,
  Zap,
  Building,
  Activity,
  ArrowRightLeft,
  X,
  FileText,
  Calendar,
  AlertCircle,
  Filter,
  DollarSign,
  PackageCheck,
  Eye,
  RefreshCw
} from 'lucide-react';
import {
  MOCK_INVENTORY_ITEMS,
  MOCK_PURCHASE_REQUESTS,
  MOCK_PURCHASE_ORDERS,
  MOCK_SUPPLIERS,
  MOCK_ASSET_MASTERS,
  MOCK_BIOMEDICAL_WORK_ORDERS
} from '../data/mockData';
import {
  InventoryItem,
  PurchaseRequest,
  PurchaseOrder,
  SupplierVendor,
  AssetMaster,
  BiomedicalWorkOrder
} from '../types';

interface WarehouseLocation {
  id: string;
  name: string;
  code: string;
  type: 'Central Warehouse' | 'Depo Farmasi' | 'Depo OK / Bedah' | 'Depo IGD' | 'Depo Lab';
  headOfficer: string;
  totalCapacityItem: number;
  occupancyPercent: number;
}

interface StockTransferRequest {
  id: string;
  transferNo: string;
  sourceWarehouse: string;
  destinationWarehouse: string;
  itemName: string;
  quantity: number;
  unit: string;
  requestedBy: string;
  requestDate: string;
  status: 'Pending Verification' | 'In Transit' | 'Completed & Stock Received' | 'Rejected';
}

export const InventoryProcurementView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'inventory' | 'warehouse' | 'procurement' | 'vendors' | 'assets' | 'biomedical'
  >('inventory');

  // Master Data State
  const [inventoryList, setInventoryList] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(MOCK_PURCHASE_REQUESTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [suppliers, setSuppliers] = useState<SupplierVendor[]>(MOCK_SUPPLIERS);
  const [assets, setAssets] = useState<AssetMaster[]>(MOCK_ASSET_MASTERS);
  const [workOrders, setWorkOrders] = useState<BiomedicalWorkOrder[]>(MOCK_BIOMEDICAL_WORK_ORDERS);

  // Warehouses & Stock Transfer State
  const [warehouses] = useState<WarehouseLocation[]>([
    { id: 'wh-1', name: 'Gudang Utama Logistik & BHP Central', code: 'WH-CENTRAL', type: 'Central Warehouse', headOfficer: 'Supriadi, A.Md.Log', totalCapacityItem: 1200, occupancyPercent: 78 },
    { id: 'wh-2', name: 'Depo Farmasi Rawat Jalan', code: 'DEPO-FAR-RJ', type: 'Depo Farmasi', headOfficer: 'Apt. Rina Lestari, S.Farm', totalCapacityItem: 450, occupancyPercent: 62 },
    { id: 'wh-3', name: 'Depo Farmasi Rawat Inap & ICU', code: 'DEPO-FAR-RI', type: 'Depo Farmasi', headOfficer: 'Apt. Dewi Sartika, S.Farm', totalCapacityItem: 500, occupancyPercent: 84 },
    { id: 'wh-4', name: 'Depo Kamar Operasi (OK Central)', code: 'DEPO-OK', type: 'Depo OK / Bedah', headOfficer: 'Nrs. Tri Wahyuni, S.Kep', totalCapacityItem: 300, occupancyPercent: 91 },
    { id: 'wh-5', name: 'Depo Instalasi Gawat Darurat (IGD)', code: 'DEPO-IGD', type: 'Depo IGD', headOfficer: 'Nrs. Bambang, S.Kep', totalCapacityItem: 250, occupancyPercent: 55 }
  ]);

  const [transferRequests, setTransferRequests] = useState<StockTransferRequest[]>([
    {
      id: 'trf-001',
      transferNo: 'MUT/LOG/2026/08/001',
      sourceWarehouse: 'Gudang Utama Logistik & BHP Central',
      destinationWarehouse: 'Depo Kamar Operasi (OK Central)',
      itemName: 'Kassa Steril 10x10cm (Box 100 Pcs)',
      quantity: 20,
      unit: 'Box',
      requestedBy: 'Nrs. Tri Wahyuni, S.Kep',
      requestDate: '2026-08-02 14:20',
      status: 'Pending Verification'
    },
    {
      id: 'trf-002',
      transferNo: 'MUT/LOG/2026/08/002',
      sourceWarehouse: 'Gudang Utama Logistik & BHP Central',
      destinationWarehouse: 'Depo Instalasi Gawat Darurat (IGD)',
      itemName: 'Abocath / IV Cannula 20G',
      quantity: 50,
      unit: 'Pcs',
      requestedBy: 'Nrs. Bambang, S.Kep',
      requestDate: '2026-08-03 09:10',
      status: 'Completed & Stock Received'
    }
  ]);

  // Filters & Controls
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals State
  const [showNewInventoryModal, setShowNewInventoryModal] = useState(false);
  const [showStockAdjustmentModal, setShowStockAdjustmentModal] = useState<InventoryItem | null>(null);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [showNewPRModal, setShowNewPRModal] = useState(false);
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [showNewWOModal, setShowNewWOModal] = useState(false);
  const [qrModalAsset, setQrModalAsset] = useState<AssetMaster | null>(null);

  // New Inventory Form State
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('BHP');
  const [newItemWarehouse, setNewItemWarehouse] = useState('Gudang Utama Logistik & BHP Central');
  const [newItemMinStock, setNewItemMinStock] = useState(100);
  const [newItemInitialStock, setNewItemInitialStock] = useState(500);
  const [newItemUnit, setNewItemUnit] = useState('Pcs');
  const [newItemValuation, setNewItemValuation] = useState(5000000);

  // New PR Form State
  const [newPrDept, setNewPrDept] = useState('Poliklinik Rawat Jalan');
  const [newPrRequester, setNewPrRequester] = useState('dr. Budi Hartono, Sp.PD');
  const [newPrItemName, setNewPrItemName] = useState('Aspirat Suction Tube Steril');
  const [newPrQty, setNewPrQty] = useState(50);
  const [newPrPrice, setNewPrPrice] = useState(45000);

  // New Transfer Form State
  const [trfSource, setTrfSource] = useState('Gudang Utama Logistik & BHP Central');
  const [trfDest, setTrfDest] = useState('Depo Farmasi Rawat Jalan');
  const [trfItem, setTrfItem] = useState('Infus Sodium Chloride 0.9% 500ml');
  const [trfQty, setTrfQty] = useState(30);

  // New Vendor Form State
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorNpwp, setNewVendorNpwp] = useState('');
  const [newVendorCategory, setNewVendorCategory] = useState<SupplierVendor['category']>('Alat Kesehatan');
  const [newVendorContact, setNewVendorContact] = useState('');

  // New Asset Form State
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCategory, setNewAssetCategory] = useState<AssetMaster['category']>('Patient Monitor');
  const [newAssetDept, setNewAssetDept] = useState('ICU / HCU');
  const [newAssetCost, setNewAssetCost] = useState(150000000);

  // New WO Form State
  const [newWoAssetName, setNewWoAssetName] = useState('Anesthesia Machine Draeger Primus');
  const [newWoAssetCode, setNewWoAssetCode] = useState('AST-OK-002');
  const [newWoType, setNewWoType] = useState<BiomedicalWorkOrder['maintenanceType']>('Preventive Maintenance');
  const [newWoTech, setNewWoTech] = useState('Budi Prasetyo, ST (Biomedical)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Add Inventory Item
  const handleAddInventoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const item: InventoryItem = {
      id: `inv-${Date.now()}`,
      itemCode: `LOG-ITEM-${Math.floor(100 + Math.random() * 900)}`,
      itemName: newItemName,
      category: newItemCategory,
      currentStock: newItemInitialStock,
      minStock: newItemMinStock,
      maxStock: newItemInitialStock * 3,
      unit: newItemUnit,
      warehouseName: newItemWarehouse,
      valuationTotal: newItemValuation,
      valuationMethod: 'FIFO',
      aiConsumptionTrend: 'Normal Usage Rate'
    };

    setInventoryList([item, ...inventoryList]);
    setShowNewInventoryModal(false);
    setNewItemName('');
    showToast(`Barang inventory ${item.itemName} berhasil ditambahkan!`);
  };

  // Stock Adjustment
  const handleApplyStockAdjustment = (adjustQty: number) => {
    if (!showStockAdjustmentModal) return;

    setInventoryList(
      inventoryList.map((i) =>
        i.id === showStockAdjustmentModal.id
          ? {
              ...i,
              currentStock: Math.max(0, i.currentStock + adjustQty),
              valuationTotal: Math.max(0, (i.currentStock + adjustQty) * 10000)
            }
          : i
      )
    );

    showToast(`Stok ${showStockAdjustmentModal.itemName} disesuaikan (${adjustQty > 0 ? '+' : ''}${adjustQty}).`);
    setShowStockAdjustmentModal(null);
  };

  // Create Stock Transfer
  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const req: StockTransferRequest = {
      id: `trf-${Date.now()}`,
      transferNo: `MUT/LOG/2026/08/${Math.floor(100 + Math.random() * 900)}`,
      sourceWarehouse: trfSource,
      destinationWarehouse: trfDest,
      itemName: trfItem,
      quantity: trfQty,
      unit: 'Pcs',
      requestedBy: 'Petugas Gudang',
      requestDate: new Date().toLocaleString('id-ID'),
      status: 'Pending Verification'
    };

    setTransferRequests([req, ...transferRequests]);
    setShowNewTransferModal(false);
    showToast(`Permintaan mutasi stok ${req.transferNo} berhasil dibuat.`);
  };

  // Confirm Transfer Receipt
  const handleConfirmTransfer = (trfId: string) => {
    setTransferRequests(
      transferRequests.map((t) => (t.id === trfId ? { ...t, status: 'Completed & Stock Received' } : t))
    );
    showToast('Penerimaan mutasi stok berhasil dikonfirmasi & disesuaikan di gudang tujuan.');
  };

  // Add Purchase Request (PR)
  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    const pr: PurchaseRequest = {
      id: `pr-${Date.now()}`,
      prNumber: `PR/LOG/2026/08/${Math.floor(100 + Math.random() * 900)}`,
      department: newPrDept,
      requestedBy: newPrRequester,
      requestDate: new Date().toISOString().split('T')[0],
      items: [{ itemName: newPrItemName, quantity: newPrQty, estimatedPrice: newPrPrice }],
      totalEstimatedAmount: newPrQty * newPrPrice,
      status: 'Pending Approval',
      approvalLevelRequired: 'Level 1 Manager'
    };

    setPurchaseRequests([pr, ...purchaseRequests]);
    setShowNewPRModal(false);
    showToast(`PR Baru ${pr.prNumber} berhasil diajukan.`);
  };

  // Approve PR & Convert to PO
  const handleApprovePR = (pr: PurchaseRequest) => {
    setPurchaseRequests(
      purchaseRequests.map((p) => (p.id === pr.id ? { ...p, status: 'PO Issued' } : p))
    );

    const po: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber: `PO/LOG/2026/08/${Math.floor(100 + Math.random() * 900)}`,
      prNumber: pr.prNumber,
      vendorName: 'PT Kimia Farma Trading & Distribution',
      poDate: new Date().toISOString().split('T')[0],
      deliveryDueDate: '2026-08-10',
      totalAmount: pr.totalEstimatedAmount,
      status: 'Issued to Vendor',
      paymentTerms: 'NET 30 Hari'
    };

    setPurchaseOrders([po, ...purchaseOrders]);
    showToast(`PR ${pr.prNumber} disetujui! PO ${po.poNumber} otomatis diterbitkan ke Vendor.`);
  };

  // Receive Goods (GRN) from PO
  const handleReceiveGoodsPO = (poId: string) => {
    setPurchaseOrders(
      purchaseOrders.map((po) => (po.id === poId ? { ...po, status: 'Completed' } : po))
    );
    showToast('Penerimaan fisik barang (GRN) dikonfirmasi. Stok gudang otomatis bertambah.');
  };

  // Create Vendor
  const handleCreateVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;

    const vendor: SupplierVendor = {
      id: `v-${Date.now()}`,
      vendorName: newVendorName,
      code: `VND-${Math.floor(100 + Math.random() * 900)}`,
      npwp: newVendorNpwp || '01.234.567.8-012.000',
      category: newVendorCategory,
      contractStatus: 'Active Contract',
      performanceScore: 92,
      slaRating: '98.0%',
      aiVendorRating: 'Preferred Tier 1',
      contactPhone: newVendorContact || '021-5551234'
    };

    setSuppliers([...suppliers, vendor]);
    setShowNewVendorModal(false);
    setNewVendorName('');
    showToast(`Vendor ${vendor.vendorName} berhasil diregistrasi.`);
  };

  // Create Asset
  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetName.trim()) return;

    const asset: AssetMaster = {
      id: `ast-${Date.now()}`,
      assetCode: `AST-${newAssetDept.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: newAssetName,
      category: newAssetCategory,
      department: newAssetDept,
      purchaseDate: new Date().toISOString().split('T')[0],
      acquisitionCost: newAssetCost,
      currentValue: newAssetCost * 0.85,
      qrCodeTag: `QR-AST-${Math.floor(10000 + Math.random() * 90000)}`,
      calibrationDueDate: '2027-08-01',
      status: 'Operational'
    };

    setAssets([asset, ...assets]);
    setShowNewAssetModal(false);
    setNewAssetName('');
    showToast(`Aset baru ${asset.name} (${asset.assetCode}) berhasil didaftarkan.`);
  };

  // Create Biomedical Work Order
  const handleCreateWO = (e: React.FormEvent) => {
    e.preventDefault();
    const wo: BiomedicalWorkOrder = {
      id: `wo-${Date.now()}`,
      woNumber: `WO/BIO/2026/08/${Math.floor(100 + Math.random() * 900)}`,
      assetName: newWoAssetName,
      assetCode: newWoAssetCode,
      maintenanceType: newWoType,
      technicianName: newWoTech,
      createdDate: new Date().toISOString().split('T')[0],
      downtimeHours: 0,
      mtbfHours: 720,
      mttrHours: 2,
      status: 'In Progress',
      aiFailureRiskScore: 15
    };

    setWorkOrders([wo, ...workOrders]);
    setShowNewWOModal(false);
    showToast(`Work order biomedical ${wo.woNumber} berhasil dibuat.`);
  };

  // Filter Inventory Items
  const filteredInventory = inventoryList.filter((item) => {
    const matchesSearch =
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    const matchesLowStock = !lowStockOnly || item.currentStock <= item.minStock;
    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const totalValuation = inventoryList.reduce((acc, curr) => acc + curr.valuationTotal, 0);

  return (
    <div className="space-y-6 text-slate-100 p-4 lg:p-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl border border-amber-300 animate-bounce flex items-center gap-2 text-xs">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Banner Header */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 p-6 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <Warehouse className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Enterprise Inventory, Multi-Warehouse & Assets</h1>
                <span className="rounded-full bg-amber-500/20 px-3 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                  Supply Chain 4.0
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-300">
                Pengelolaan Rantai Pasok Logistik BHP, Multi-Gudang Depo, Workflow Procurement (PR/PO), Vendor Scoring, dan Pemeliharaan Aset Medis (Biomedical).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowNewInventoryModal(true)}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-lg transition"
            >
              <Plus className="h-4 w-4" />
              Tambah Barang Logistik
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'inventory' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Boxes className="h-4 w-4" />
          Master Inventory & BHP ({inventoryList.length})
        </button>
        <button
          onClick={() => setActiveSubTab('warehouse')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'warehouse' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Warehouse className="h-4 w-4" />
          Multi-Gudang & Mutasi Stock ({warehouses.length})
        </button>
        <button
          onClick={() => setActiveSubTab('procurement')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'procurement' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Procurement (PR & PO) ({purchaseRequests.length})
        </button>
        <button
          onClick={() => setActiveSubTab('vendors')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'vendors' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Users className="h-4 w-4" />
          Vendor & Supplier Scoring ({suppliers.length})
        </button>
        <button
          onClick={() => setActiveSubTab('assets')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'assets' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Building className="h-4 w-4" />
          Asset Management ({assets.length})
        </button>
        <button
          onClick={() => setActiveSubTab('biomedical')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition ${
            activeSubTab === 'biomedical' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Wrench className="h-4 w-4" />
          Biomedical Engineering ({workOrders.length})
        </button>
      </div>

      {/* SUB-TAB 1: INVENTORY & BHP */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-lg">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Cari nama barang, kode logistik, atau BHP..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-4 text-xs text-slate-100 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setLowStockOnly(!lowStockOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  lowStockOnly
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                ⚠️ Hanya Stok Minimal ({inventoryList.filter((i) => i.currentStock <= i.minStock).length})
              </button>

              <div className="text-xs text-slate-400 font-mono">
                Total Valuasi: <span className="text-amber-400 font-bold">Rp {totalValuation.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 font-mono">
                  <tr>
                    <th className="px-4 py-3">Kode & Nama Barang</th>
                    <th className="px-4 py-3">Kategori & Gudang</th>
                    <th className="px-4 py-3">Stok Saat Ini</th>
                    <th className="px-4 py-3">Metode Valuasi</th>
                    <th className="px-4 py-3">Analisis Trend AI</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInventory.map((item) => {
                    const isLow = item.currentStock <= item.minStock;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-4 py-3.5">
                          <div className="font-bold text-white text-sm">{item.itemName}</div>
                          <div className="text-xs text-slate-400 font-mono">{item.itemCode}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="inline-block rounded-lg bg-slate-800 px-2.5 py-0.5 text-xs text-amber-300 font-semibold">
                            {item.category}
                          </span>
                          <div className="text-xs text-slate-400 mt-1">{item.warehouseName}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold text-base font-mono ${isLow ? 'text-rose-400' : 'text-amber-400'}`}>
                              {item.currentStock} {item.unit}
                            </span>
                            {isLow && (
                              <span className="flex items-center gap-1 rounded-lg bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                                <AlertTriangle className="h-3 w-3" /> STOK KRITIS
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">Min: {item.minStock} • Max: {item.maxStock}</div>
                        </td>
                        <td className="px-4 py-3.5 font-mono">
                          <div className="font-bold text-slate-200">Rp {item.valuationTotal.toLocaleString('id-ID')}</div>
                          <div className="text-[10px] text-slate-500">Metode: {item.valuationMethod}</div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
                            <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> {item.aiConsumptionTrend}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setShowStockAdjustmentModal(item)}
                            className="rounded-xl bg-slate-800 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500 hover:text-slate-950 transition font-bold"
                          >
                            Adjust Stok
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MULTI-GUDANG & MUTASI STOCK */}
      {activeSubTab === 'warehouse' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Warehouse className="h-5 w-5 text-amber-400" /> Daftar Gudang Sentral & Depo Satelit
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pemantauan stok per unit depo, penanggung jawab depo, dan kapasitas penyimpanan.
                </p>
              </div>

              <button
                onClick={() => setShowNewTransferModal(true)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" /> Buat Permintaan Mutasi Stok
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {warehouses.map((wh) => (
                <div key={wh.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{wh.name}</h4>
                      <p className="text-xs text-amber-400 font-mono">{wh.code}</p>
                    </div>
                    <span className="rounded-lg bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {wh.type}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kepala Depo/Gudang:</span>
                      <span className="font-semibold text-slate-200">{wh.headOfficer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kapasitas Maksimal:</span>
                      <span className="font-mono text-slate-200">{wh.totalCapacityItem} Item SKUs</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Okupansi Kapasitas:</span>
                        <span className="font-bold text-amber-400 font-mono">{wh.occupancyPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full"
                          style={{ width: `${wh.occupancyPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transfer Requests Table */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <ArrowRightLeft className="h-4 w-4 text-amber-400" /> Log Mutasi Stok Antar Gudang (Inter-Warehouse Transfers)
            </h3>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-3">No. Mutasi & Waktu</th>
                    <th className="p-3">Gudang Asal ➔ Gudang Tujuan</th>
                    <th className="p-3">Barang & Jumlah</th>
                    <th className="p-3">Pemohon</th>
                    <th className="p-3">Status Mutasi</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {transferRequests.map((trf) => (
                    <tr key={trf.id} className="hover:bg-slate-800/40">
                      <td className="p-3">
                        <div className="text-amber-400 font-bold">{trf.transferNo}</div>
                        <div className="text-[10px] text-slate-500">{trf.requestDate}</div>
                      </td>
                      <td className="p-3 font-sans">
                        <div className="text-slate-200 font-semibold">{trf.sourceWarehouse}</div>
                        <div className="text-cyan-400 text-[11px]">➔ {trf.destinationWarehouse}</div>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="text-white font-bold">{trf.itemName}</span>
                        <div className="text-amber-300 font-mono font-bold text-xs">{trf.quantity} {trf.unit}</div>
                      </td>
                      <td className="p-3 font-sans text-slate-400">{trf.requestedBy}</td>
                      <td className="p-3 font-sans">
                        <span
                          className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                            trf.status === 'Completed & Stock Received'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                          }`}
                        >
                          {trf.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-sans">
                        {trf.status === 'Pending Verification' && (
                          <button
                            onClick={() => handleConfirmTransfer(trf.id)}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs"
                          >
                            Verifikasi & Terima Stok
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PROCUREMENT (PR & PO) */}
      {activeSubTab === 'procurement' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-amber-400" /> Procurement Workflows (PR & PO Management)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pengajuan Permintaan Unit (PR), Verifikasi Otorisasi Direksi, Penerbitan PO ke Vendor, dan Penerimaan Barang (GRN).
                </p>
              </div>

              <button
                onClick={() => setShowNewPRModal(true)}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow"
              >
                <Plus className="w-4 h-4" /> Buat PR Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column: Purchase Requests */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
                  <FileCheck className="h-4 w-4 text-amber-400" /> Permintaan Unit Masuk (Purchase Requests - PR)
                </h4>

                {purchaseRequests.map((pr) => (
                  <div key={pr.id} className="rounded-xl bg-slate-900 p-3.5 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-white text-sm font-mono">{pr.prNumber}</span>
                        <div className="text-slate-400 text-[11px]">{pr.department} • {pr.requestedBy}</div>
                      </div>
                      <span className="rounded-lg bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        {pr.status}
                      </span>
                    </div>

                    <div className="text-slate-300 font-mono text-xs font-bold bg-slate-950 p-2 rounded-lg border border-slate-800">
                      Estimasi Total PR: Rp {pr.totalEstimatedAmount.toLocaleString('id-ID')}
                    </div>

                    {pr.status === 'Pending Approval' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleApprovePR(pr)}
                          className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-1.5 text-xs font-bold text-white transition text-center shadow"
                        >
                          Setujui PR & Terbitkan PO Otomatis
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column: Purchase Orders */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Truck className="h-4 w-4 text-teal-400" /> Purchase Orders (PO ke Supplier Vendor)
                </h4>

                {purchaseOrders.map((po) => (
                  <div key={po.id} className="rounded-xl bg-slate-900 p-3.5 border border-slate-800 text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-teal-300 text-sm font-mono">{po.poNumber}</span>
                        <div className="text-slate-400 text-[11px]">Vendor: <span className="text-white font-semibold">{po.vendorName}</span></div>
                      </div>
                      <span
                        className={`rounded-lg px-2.5 py-0.5 text-[10px] font-bold border ${
                          po.status === 'Completed'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        }`}
                      >
                        {po.status}
                      </span>
                    </div>

                    <div className="text-slate-300 font-mono text-xs font-bold bg-slate-950 p-2 rounded-lg border border-slate-800">
                      Nilai Kontrak PO: Rp {po.totalAmount.toLocaleString('id-ID')}
                    </div>

                    {po.status === 'Issued to Vendor' && (
                      <button
                        onClick={() => handleReceiveGoodsPO(po.id)}
                        className="w-full mt-1 py-1.5 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs shadow"
                      >
                        Konfirmasi Terima Barang Fisik (GRN)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VENDORS */}
      {activeSubTab === 'vendors' && (
        <div className="space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-amber-400" /> Master Vendor Supplier & Scorecard Kinerja
            </h3>
            <button
              onClick={() => setShowNewVendorModal(true)}
              className="rounded-xl bg-amber-500 px-3.5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition shadow"
            >
              + Registrasi Vendor Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suppliers.map((v) => (
              <div key={v.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-white text-sm">{v.vendorName}</h4>
                    <p className="text-xs text-amber-400 font-mono">{v.code}</p>
                  </div>
                  <span className="rounded-lg bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                    {v.aiVendorRating}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 border-t border-slate-800/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">NPWP Resmi:</span>
                    <span className="font-mono text-slate-200">{v.npwp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kategori Utama:</span>
                    <span className="text-amber-300 font-semibold">{v.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Skor Kinerja:</span>
                    <span className="font-bold text-emerald-400 font-mono">{v.performanceScore} / 100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Ketaatan SLA Pengiriman:</span>
                    <span className="font-bold text-cyan-400 font-mono">{v.slaRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: ASSETS MANAGEMENT */}
      {activeSubTab === 'assets' && (
        <div className="space-y-6">
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building className="h-5 w-5 text-amber-400" /> Master Asset Register & Kalkulator Penyusutan Nilai
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pencatatan aset gedung, alat kesehatan utama (MRI, CT-Scan), ambulans, dan perhitungan depresiasi nilai aset.
                </p>
              </div>

              <button
                onClick={() => setShowNewAssetModal(true)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow"
              >
                <Plus className="w-4 h-4" /> Registrasi Aset Baru
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-3">Kode & Nama Aset</th>
                    <th className="p-3">Kategori & Unit</th>
                    <th className="p-3">Harga Perolehan</th>
                    <th className="p-3">Nilai Buku Saat Ini</th>
                    <th className="p-3">Jatuh Tempo Kalibrasi</th>
                    <th className="p-3">Status Operasional</th>
                    <th className="p-3 text-right">Aksi Tag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {assets.map((ast) => (
                    <tr key={ast.id} className="hover:bg-slate-800/40 font-sans">
                      <td className="p-3">
                        <div className="text-white font-bold">{ast.name}</div>
                        <div className="text-amber-400 text-[11px] font-mono">{ast.assetCode}</div>
                      </td>
                      <td className="p-3 font-sans">
                        <span className="rounded-lg bg-slate-800 px-2.5 py-0.5 text-[11px] text-amber-300 font-semibold">
                          {ast.category}
                        </span>
                        <div className="text-slate-400 text-[10px] mt-0.5">{ast.department}</div>
                      </td>
                      <td className="p-3 font-mono text-slate-200">
                        Rp {ast.acquisitionCost.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 font-mono font-bold text-emerald-400">
                        Rp {ast.currentValue.toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 font-mono text-cyan-300">
                        {ast.calibrationDueDate}
                      </td>
                      <td className="p-3 font-sans">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {ast.status}
                        </span>
                      </td>
                      <td className="p-3 text-right font-sans">
                        <button
                          onClick={() => setQrModalAsset(ast)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold rounded-lg text-xs flex items-center gap-1 ml-auto"
                        >
                          <QrCode className="w-3.5 h-3.5" /> Scan Tag QR
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: BIOMEDICAL ENGINEERING */}
      {activeSubTab === 'biomedical' && (
        <div className="space-y-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wrench className="h-5 w-5 text-amber-400" /> Biomedical Engineering & Kalibrasi Alat Medis (BPFK)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Work Orders Pemeliharaan Preventif, Uji Sertifikasi BPFK, dan Pemantauan AI Failure Risk Score.
              </p>
            </div>

            <button
              onClick={() => setShowNewWOModal(true)}
              className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 shadow"
            >
              <Plus className="w-4 h-4" /> Buat Work Order (WO)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workOrders.map((wo) => (
              <div key={wo.id} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-3 shadow-lg">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <div>
                    <span className="font-bold text-white text-sm">{wo.assetName}</span>
                    <div className="text-xs font-mono text-amber-400">{wo.assetCode} • No. WO: {wo.woNumber}</div>
                  </div>
                  <span className="rounded-lg bg-cyan-500/20 px-2.5 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-500/30">
                    {wo.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Tipe Maintenance:</span>
                    <span className="font-semibold text-slate-100">{wo.maintenanceType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Teknisi Penanggung Jawab:</span>
                    <span className="font-semibold text-slate-100">{wo.technicianName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Downtime Alat:</span>
                    <span className="font-bold text-rose-400 font-mono">{wo.downtimeHours} Jam</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">AI Failure Risk Score:</span>
                    <span className="font-bold text-emerald-400 font-mono">{wo.aiFailureRiskScore}% (Rendah)</span>
                  </div>
                </div>

                {wo.status !== 'Completed Passed Calibration' && (
                  <button
                    onClick={() => {
                      setWorkOrders(
                        workOrders.map((w) =>
                          w.id === wo.id ? { ...w, status: 'Completed Passed Calibration' } : w
                        )
                      );
                      showToast('Work order selesai! Sertifikasi Kalibrasi BPFK diperbarui.');
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow"
                  >
                    Selesaikan Maintenance & Terbitkan Sertifikat Kalibrasi
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD INVENTORY ITEM */}
      {showNewInventoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Tambah Barang Logistik & BHP Baru</h3>
              <button onClick={() => setShowNewInventoryModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddInventoryItem} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nama Barang / Logistik</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Masker N95 Medical Grade"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kategori Barang</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="BHP">BHP (Bahan Habis Pakai)</option>
                    <option value="Gas Medis">Gas Medis</option>
                    <option value="Medical Supply">Medical Supply</option>
                    <option value="ATK">ATK & Kantor</option>
                    <option value="Cleaning">Cleaning & Hygiene</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Satuan Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Gudang Penyimpanan</label>
                <select
                  value={newItemWarehouse}
                  onChange={(e) => setNewItemWarehouse(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Gudang Utama Logistik & BHP Central">Gudang Utama Logistik & BHP Central</option>
                  <option value="Depo Farmasi Rawat Jalan">Depo Farmasi Rawat Jalan</option>
                  <option value="Depo Kamar Operasi (OK Central)">Depo Kamar Operasi (OK Central)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Stok Awal</label>
                  <input
                    type="number"
                    value={newItemInitialStock}
                    onChange={(e) => setNewItemInitialStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Batas Minimal Stok</label>
                  <input
                    type="number"
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewInventoryModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: STOCK ADJUSTMENT */}
      {showStockAdjustmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Penyesuaian Stok (Stock Adjustment)</h3>
              <button onClick={() => setShowStockAdjustmentModal(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="font-bold text-white text-sm">{showStockAdjustmentModal.itemName}</div>
              <div className="text-xs text-amber-400 font-mono">Stok Saat Ini: {showStockAdjustmentModal.currentStock} {showStockAdjustmentModal.unit}</div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 font-bold">Pilih Aksi Adjust:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleApplyStockAdjustment(50)}
                  className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  + Tambah 50 Pcs
                </button>
                <button
                  onClick={() => handleApplyStockAdjustment(-20)}
                  className="py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow"
                >
                  - Kurang 20 Pcs
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE STOCK TRANSFER */}
      {showNewTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Permintaan Mutasi Stok Antar Gudang</h3>
              <button onClick={() => setShowNewTransferModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Gudang Asal (Sumber)</label>
                <select
                  value={trfSource}
                  onChange={(e) => setTrfSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Gudang Tujuan (Penerima)</label>
                <select
                  value={trfDest}
                  onChange={(e) => setTrfDest(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1">Pilih Barang</label>
                  <input
                    type="text"
                    required
                    value={trfItem}
                    onChange={(e) => setTrfItem(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Jumlah</label>
                  <input
                    type="number"
                    value={trfQty}
                    onChange={(e) => setTrfQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTransferModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                >
                  Kirim Permintaan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE PR */}
      {showNewPRModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Buat Purchase Request (PR) Unit Baru</h3>
              <button onClick={() => setShowNewPRModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePR} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Unit / Departemen Pemohon</label>
                <input
                  type="text"
                  required
                  value={newPrDept}
                  onChange={(e) => setNewPrDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Nama Barang Permintaan</label>
                <input
                  type="text"
                  required
                  value={newPrItemName}
                  onChange={(e) => setNewPrItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Jumlah (Quantity)</label>
                  <input
                    type="number"
                    value={newPrQty}
                    onChange={(e) => setNewPrQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Estimasi Harga Satuan (Rp)</label>
                  <input
                    type="number"
                    value={newPrPrice}
                    onChange={(e) => setNewPrPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPRModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                >
                  Submit PR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE VENDOR */}
      {showNewVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Registrasi Vendor Supplier Baru</h3>
              <button onClick={() => setShowNewVendorModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nama Perusahaan Vendor</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Medika Jaya Utama"
                  value={newVendorName}
                  onChange={(e) => setNewVendorName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">NPWP Resmi</label>
                <input
                  type="text"
                  placeholder="01.234.567.8-012.000"
                  value={newVendorNpwp}
                  onChange={(e) => setNewVendorNpwp(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Kategori Utama</label>
                <select
                  value={newVendorCategory}
                  onChange={(e) => setNewVendorCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Alat Kesehatan">Alat Kesehatan & Alkes</option>
                  <option value="Farmasi & Obat">Farmasi & Obat</option>
                  <option value="IT & Hardware">IT & Hardware</option>
                  <option value="Linen & Laundry">Linen & Laundry</option>
                  <option value="Gas Medis">Gas Medis</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewVendorModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                >
                  Registrasi Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE ASSET */}
      {showNewAssetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Registrasi Aset Rumah Sakit Baru</h3>
              <button onClick={() => setShowNewAssetModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nama Aset / Alat</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ventilator High-End Dräger Savina"
                  value={newAssetName}
                  onChange={(e) => setNewAssetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Kategori Aset</label>
                  <select
                    value={newAssetCategory}
                    onChange={(e) => setNewAssetCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Ventilator">Ventilator</option>
                    <option value="Patient Monitor">Patient Monitor</option>
                    <option value="MRI">MRI Machine</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="USG">USG 4D</option>
                    <option value="Ambulans">Ambulans</option>
                    <option value="IT Equipment">IT Equipment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit / Lokasi</label>
                  <input
                    type="text"
                    value={newAssetDept}
                    onChange={(e) => setNewAssetDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Harga Perolehan Awal (Rp)</label>
                <input
                  type="number"
                  value={newAssetCost}
                  onChange={(e) => setNewAssetCost(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewAssetModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                >
                  Simpan Aset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE WORK ORDER */}
      {showNewWOModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">Buat Work Order Maintenance Biomedical</h3>
              <button onClick={() => setShowNewWOModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateWO} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Nama Alat Medis</label>
                <input
                  type="text"
                  required
                  value={newWoAssetName}
                  onChange={(e) => setNewWoAssetName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Jenis Maintenance</label>
                <select
                  value={newWoType}
                  onChange={(e) => setNewWoType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Preventive Maintenance">Preventive Maintenance (Rutin)</option>
                  <option value="Corrective Repair">Corrective Repair (Perbaikan Kerusakan)</option>
                  <option value="Calibration Testing">Calibration Testing (Kalibrasi BPFK)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Teknisi Biomedical</label>
                <input
                  type="text"
                  value={newWoTech}
                  onChange={(e) => setNewWoTech(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewWOModal(false)}
                  className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow"
                >
                  Terbitkan Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: QR ASSET PREVIEW */}
      {qrModalAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-amber-500/40 bg-slate-900 p-6 space-y-4 shadow-2xl text-xs text-center">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">QR Code Tag Audit Aset</h3>
              <button onClick={() => setQrModalAsset(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-xl inline-block shadow-inner mx-auto">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>

            <div className="text-slate-300 font-mono space-y-1">
              <div className="font-bold text-amber-400 text-sm">{qrModalAsset.name}</div>
              <div className="text-xs text-slate-400">{qrModalAsset.assetCode}</div>
              <div className="text-[10px] text-cyan-300">TAG ID: {qrModalAsset.qrCodeTag}</div>
            </div>

            <button
              onClick={() => {
                showToast(`Tag QR Aset ${qrModalAsset.assetCode} disalin & siap dicetak.`);
                setQrModalAsset(null);
              }}
              className="w-full py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow"
            >
              Cetak Sticker Tag QR Aset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
