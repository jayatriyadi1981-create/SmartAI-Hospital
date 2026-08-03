/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  MapPin,
  Plus,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Scissors,
  Stethoscope,
  Building2,
  AlertCircle,
  ShieldCheck,
  Search,
  CheckSquare
} from 'lucide-react';
import { CALENDAR_EVENTS } from '../data/mockData';

interface OperationScheduleItem {
  id: string;
  roomName: string;
  patientName: string;
  norm: string;
  procedureName: string;
  leadSurgeon: string;
  anesthesiologist: string;
  scheduledTime: string;
  estimatedDuration: string;
  status: 'Scheduled' | 'Pre-Op' | 'In Progress' | 'Post-Op (PACU)' | 'Completed' | 'Cancelled';
  whoChecklistDone: boolean;
  type: 'Emergency' | 'Elective';
}

export const CalendarView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'surgery' | 'doctors' | 'events'>('surgery');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [eventsList, setEventsList] = useState(CALENDAR_EVENTS);

  // Operation Room Schedules State
  const [operationSchedules, setOperationSchedules] = useState<OperationScheduleItem[]>([
    {
      id: 'op-101',
      roomName: 'Kamar Operasi 01 (Major Surgery)',
      patientName: 'Ny. Halimah Binti Ahmad',
      norm: 'RM-2026-0891',
      procedureName: 'Laparoscopic Cholecystectomy',
      leadSurgeon: 'dr. Hendra Wijaya, Sp.B-KBD',
      anesthesiologist: 'dr. Ratna Juwita, Sp.An',
      scheduledTime: '08:00 - 10:30 WIB',
      estimatedDuration: '150 Menit',
      status: 'In Progress',
      whoChecklistDone: true,
      type: 'Elective'
    },
    {
      id: 'op-102',
      roomName: 'Kamar Operasi 02 (Cardiovascular & Cathlab)',
      patientName: 'En. Bambang Subagyo',
      norm: 'RM-2026-0744',
      procedureName: 'Percutaneous Coronary Intervention (PCI)',
      leadSurgeon: 'dr. Farhan Malik, Sp.JP (K)',
      anesthesiologist: 'dr. Ratna Juwita, Sp.An',
      scheduledTime: '10:45 - 12:45 WIB',
      estimatedDuration: '120 Menit',
      status: 'Pre-Op',
      whoChecklistDone: true,
      type: 'Emergency'
    },
    {
      id: 'op-103',
      roomName: 'Kamar Operasi 03 (Kebidanan & Obsgyn)',
      patientName: 'Ny. Maya Rosdiana',
      norm: 'RM-2026-0902',
      procedureName: 'Seksio Sesarea (C-Section)',
      leadSurgeon: 'dr. Maya Arisandi, Sp.OG',
      anesthesiologist: 'dr. Suryo Wibowo, Sp.An',
      scheduledTime: '13:00 - 14:30 WIB',
      estimatedDuration: '90 Menit',
      status: 'Scheduled',
      whoChecklistDone: false,
      type: 'Elective'
    },
    {
      id: 'op-104',
      roomName: 'Kamar Operasi 04 (Orthopedi & Trauma)',
      patientName: 'An. Kevin Pratama',
      norm: 'RM-2026-0612',
      procedureName: 'ORIF Fractur Femur Dextra',
      leadSurgeon: 'dr. Donny Prasetyo, Sp.OT',
      anesthesiologist: 'dr. Suryo Wibowo, Sp.An',
      scheduledTime: '15:00 - 17:30 WIB',
      estimatedDuration: '150 Menit',
      status: 'Scheduled',
      whoChecklistDone: true,
      type: 'Emergency'
    }
  ]);

  // Modal State for Adding Surgery / Event
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Surgery');
  const [newDoctor, setNewDoctor] = useState('');
  const [newRoom, setNewRoom] = useState('Kamar Operasi 01');
  const [newTime, setNewTime] = useState('09:00 - 11:00');
  const [newPatient, setNewPatient] = useState('');

  const handleToggleOpStatus = (id: string) => {
    const statusCycle: OperationScheduleItem['status'][] = ['Scheduled', 'Pre-Op', 'In Progress', 'Post-Op (PACU)', 'Completed'];
    setOperationSchedules(prev =>
      prev.map(item => {
        if (item.id === id) {
          const currentIndex = statusCycle.indexOf(item.status);
          const nextIndex = (currentIndex + 1) % statusCycle.length;
          return { ...item, status: statusCycle[nextIndex] };
        }
        return item;
      })
    );
  };

  const handleAddSchedule = () => {
    if (!newTitle) return;
    if (newCategory === 'Surgery') {
      const newOp: OperationScheduleItem = {
        id: `op-${Date.now()}`,
        roomName: newRoom,
        patientName: newPatient || 'Pasien Baru',
        norm: `RM-2026-${Math.floor(Math.random() * 900) + 100}`,
        procedureName: newTitle,
        leadSurgeon: newDoctor || 'dr. Bedah Utama, Sp.B',
        anesthesiologist: 'dr. Anestesi, Sp.An',
        scheduledTime: newTime,
        estimatedDuration: '120 Menit',
        status: 'Scheduled',
        whoChecklistDone: true,
        type: 'Elective'
      };
      setOperationSchedules([...operationSchedules, newOp]);
    }

    const newEvt = {
      id: `evt-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: 'Hari Ini (3 Ags 2026)',
      time: newTime,
      doctorOrHost: newDoctor || 'Tim Medis RS',
      location: newRoom,
      status: 'Scheduled'
    };
    setEventsList([newEvt, ...eventsList]);

    setShowAddModal(false);
    setNewTitle('');
    setNewPatient('');
    alert(`Jadwal "${newTitle}" berhasil ditambahkan ke Kalender & OK Master Schedule!`);
  };

  const filteredEvents = eventsList.filter(
    (e) => selectedCategory === 'All' || e.category === selectedCategory
  );

  return (
    <div className="space-y-6 pb-12 text-slate-100 p-4 lg:p-6">
      {/* Top Banner Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <CalendarIcon className="w-4 h-4 text-cyan-400" /> Operational Master Scheduling & OK Center
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Kalender & Jadwal Kamar Operasi (OK)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Penjadwalan Operasi Elektif/Emergensi, WHO Safety Checklist, Roster Dokter Spesialis, & Agenda RS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition"
          >
            <Plus className="h-4 w-4" />
            + Schedule Operasi / Agenda Baru
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('surgery')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'surgery'
              ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Scissors className="h-4 w-4 text-slate-950" />
          Jadwal Operasi & Kamar Bedah (OK)
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'doctors'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <Stethoscope className="h-4 w-4 text-cyan-400" />
          Jadwal Praktek Dokter Spesialis
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
            activeTab === 'events'
              ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
          }`}
        >
          <CalendarIcon className="h-4 w-4 text-indigo-400" />
          Agenda & Event Operasional RS
        </button>
      </div>

      {/* TAB 1: JADWAL OPERASI (OK) */}
      {activeTab === 'surgery' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-bold">Status Ruang OK:</span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                4 Kamar Operasi Ready & Sterilized
              </span>
            </div>
            <div className="text-xs text-amber-300 font-mono">
              WHO Surgical Safety Checklist: 100% Verified
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {operationSchedules.map((op) => (
              <div
                key={op.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl space-y-4 hover:border-amber-500/40 transition"
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] font-mono text-cyan-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                      {op.roomName}
                    </span>
                    <h3 className="font-bold text-white text-base mt-2">{op.procedureName}</h3>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      op.type === 'Emergency' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    }`}>
                      {op.type}
                    </span>
                    <button
                      onClick={() => handleToggleOpStatus(op.id)}
                      className={`px-3 py-1 rounded text-xs font-bold transition hover:scale-105 ${
                        op.status === 'In Progress' ? 'bg-amber-500 text-slate-950 animate-pulse' :
                        op.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {op.status} (Klik Ubah)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">PASIEN & NORM:</span>
                    <span className="font-semibold text-white block">{op.patientName}</span>
                    <span className="font-mono text-cyan-400 text-[11px]">{op.norm}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">WAKTU & DURASI:</span>
                    <span className="font-mono text-amber-300 block">{op.scheduledTime}</span>
                    <span className="text-slate-400 text-[11px]">Est: {op.estimatedDuration}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">OPERATOR UTAMA:</span>
                    <span className="font-semibold text-slate-200">{op.leadSurgeon}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 block text-[10px]">DOKTER ANESTESI:</span>
                    <span className="font-semibold text-slate-200">{op.anesthesiologist}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span className="text-[11px]">WHO Safety Checklist Verified</span>
                  </div>
                  <button
                    onClick={() => alert(`Sign-in / Time-out / Sign-out Checklist untuk ${op.patientName} telah terverifikasi.`)}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Lihat Sign-Out Form →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: JADWAL PRAKTEK DOKTER */}
      {activeTab === 'doctors' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-cyan-400" /> Jadwal Praktek Dokter Spesialis Hari Ini
            </h3>
            <span className="text-xs text-slate-400 font-mono">Shift Pagi & Sore</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-cyan-300 text-sm">Poli Penyakit Dalam</div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-semibold text-white">dr. Bambang Sutrisno, Sp.PD</div>
                    <div className="text-slate-400 text-[11px]">08:00 - 13:00 WIB (Ruang 102)</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded self-start">Active</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-semibold text-white">dr. Maria Ulfa, Sp.PD-KGEH</div>
                    <div className="text-slate-400 text-[11px]">14:00 - 18:00 WIB (Ruang 102)</div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold bg-slate-800 px-2 py-0.5 rounded self-start">Shift Sore</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-rose-300 text-sm">Poli Jantung & Pembuluh Darah</div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-semibold text-white">dr. Farhan Malik, Sp.JP (K)</div>
                    <div className="text-slate-400 text-[11px]">09:00 - 14:00 WIB (Ruang 205)</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded self-start">Active</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="font-bold text-amber-300 text-sm">Poli Anak (Pediatri)</div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex justify-between">
                  <div>
                    <div className="font-semibold text-white">dr. Anita Rahayu, Sp.A</div>
                    <div className="text-slate-400 text-[11px]">08:30 - 12:30 WIB (Ruang 108)</div>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded self-start">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AGENDA & EVENT OPERASIONAL RS */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900/90 p-4 rounded-xl border border-slate-800">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="All">Semua Kategori Event</option>
              <option value="Surgery">Operasi & Bedah (OK)</option>
              <option value="Doctor Schedule">Jadwal Praktek Dokter</option>
              <option value="Meeting">Meeting Direksi</option>
              <option value="Maintenance">Maintenance Alat Medis</option>
              <option value="Training">Training Staff & Kode Etik</option>
            </select>

            <span className="text-xs text-slate-400 font-mono">
              Total Events: {filteredEvents.length} Items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg space-y-3 hover:border-cyan-500/40 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                    {evt.category}
                  </span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    {evt.status}
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm leading-snug">{evt.title}</h3>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{evt.date} | {evt.time}</span>
                  </div>
                  {evt.doctorOrHost && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{evt.doctorOrHost}</span>
                    </div>
                  )}
                  {evt.location && (
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Add Surgery / Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-100">Tambah Jadwal Operasi / Event Baru</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Judul Operasi / Agenda:</label>
                <input
                  type="text"
                  placeholder="Appendectomy Emergency / Meeting Komite Medis"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Nama Pasien / Subjek (Jika Operasi):</label>
                <input
                  type="text"
                  placeholder="Tn. Ahmad Dahlan"
                  value={newPatient}
                  onChange={(e) => setNewPatient(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Kategori:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Surgery">Operasi & Bedah (OK)</option>
                  <option value="Doctor Schedule">Jadwal Praktek Dokter</option>
                  <option value="Meeting">Meeting Direksi</option>
                  <option value="Maintenance">Maintenance Alat</option>
                  <option value="Training">Training Staff</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Dokter / Penanggung Jawab:</label>
                <input
                  type="text"
                  placeholder="dr. Hendra Wijaya, Sp.B"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Lokasi Ruangan:</label>
                  <input
                    type="text"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Waktu:</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded p-2 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700 font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleAddSchedule}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-xs text-slate-950 font-bold hover:bg-cyan-400"
              >
                Simpan Jadwal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
