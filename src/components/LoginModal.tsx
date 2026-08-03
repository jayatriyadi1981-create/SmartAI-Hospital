/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Building2,
  Shield,
  KeyRound,
  Mail,
  Lock,
  Fingerprint,
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMethod = 'password' | 'google' | 'microsoft' | 'sso' | 'fingerprint' | 'face';

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const [method, setMethod] = useState<AuthMethod>('password');
  const [email, setEmail] = useState('direktur.hendra@smartmedika.go.id');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('Direktur');
  const [rememberMe, setRememberMe] = useState(true);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [otpCode, setOtpCode] = useState('');
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceSuccess, setFaceSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaPassed && method === 'password') {
      setErrorMsg('Silakan verifikasi Captcha terlebih dahulu');
      return;
    }
    setErrorMsg('');
    // Move to MFA step
    setStep('mfa');
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    onClose();
  };

  const startFaceScan = () => {
    setFaceScanning(true);
    setFaceSuccess(false);
    setTimeout(() => {
      setFaceScanning(false);
      setFaceSuccess(true);
      setTimeout(() => {
        login(email, selectedRole);
        onClose();
      }, 1200);
    }, 2500);
  };

  const handleSocialLogin = (providerName: string) => {
    login(`user.${providerName.toLowerCase()}@smartmedika.go.id`, selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 p-6 sm:p-8 shadow-2xl text-slate-100 dark:border-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-3 shadow-xl shadow-cyan-500/20 mb-3">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            SMART AI HOSPITAL PLATFORM
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Sistem Informasi Manajemen Rumah Sakit Enterprise Berbasis AI
          </p>
        </div>

        {/* Method Selector Tabs */}
        <div className="mt-6 flex border-b border-slate-800 overflow-x-auto pb-2 gap-1 custom-scrollbar">
          <button
            onClick={() => { setMethod('password'); setStep('credentials'); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              method === 'password'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            Password
          </button>
          <button
            onClick={() => handleSocialLogin('Google')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              method === 'google'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => handleSocialLogin('Microsoft')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              method === 'microsoft'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Microsoft SSO
          </button>
          <button
            onClick={() => { setMethod('fingerprint'); setStep('credentials'); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              method === 'fingerprint'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5" />
            Fingerprint
          </button>
          <button
            onClick={() => { setMethod('face'); setStep('credentials'); }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
              method === 'face'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            Face ID
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 border border-rose-500/30 p-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        {step === 'credentials' && method === 'password' && (
          <form onSubmit={handleInitialSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Role Akses Pengguna
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="Direktur">Direktur Utama / Direksi</option>
                <option value="Dokter Spesialis">Dokter Spesialis</option>
                <option value="Dokter">Dokter Umum / IGD</option>
                <option value="Perawat">Perawat / Nurse Station</option>
                <option value="Farmasi">Apoteker / Farmasi</option>
                <option value="Keuangan">Manajer Keuangan & Billing</option>
                <option value="Super Admin">Super Admin IT</option>
                <option value="Pasien">Pasien / Telemedicine Portal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email / NIP / Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-10 pr-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Captcha Verification Widget */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-300">
                  Verifikasi Keamanan (Security Captcha)
                </span>
                <button
                  type="button"
                  onClick={() => setCaptchaPassed(!captchaPassed)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                    captchaPassed
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {captchaPassed ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      Terverifikasi
                    </>
                  ) : (
                    'Klik Verifikasi'
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                />
                Ingat Saya
              </label>
              <a href="#" className="text-cyan-400 hover:underline">
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-500 transition"
            >
              Lanjutkan ke Verifikasi MFA →
            </button>
          </form>
        )}

        {/* Step: MFA Verification */}
        {step === 'mfa' && (
          <form onSubmit={handleMfaSubmit} className="mt-5 space-y-4 text-center">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Multi-Factor Authentication (MFA)</h3>
              <p className="text-xs text-slate-400 mt-1">
                Masukkan 6-digit kode verifikasi OTP yang dikirimkan ke aplikasi Authenticator atau HP Anda.
              </p>
            </div>

            <div className="py-2">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="1 2 3 4 5 6"
                className="w-48 mx-auto text-center font-mono text-lg tracking-widest rounded-xl border border-slate-700 bg-slate-800 py-2 text-cyan-300 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="w-1/2 rounded-xl border border-slate-700 bg-slate-800 py-2.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="w-1/2 rounded-xl bg-cyan-600 py-2.5 text-xs font-bold text-white hover:bg-cyan-500"
              >
                Masuk Dashboard
              </button>
            </div>
          </form>
        )}

        {/* Biometric: Fingerprint */}
        {method === 'fingerprint' && (
          <div className="mt-6 text-center space-y-4 py-4">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 text-cyan-400 animate-pulse">
              <Fingerprint className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Otentikasi Biometrik Fingerprint</h3>
              <p className="text-xs text-slate-400 mt-1">
                Tempelkan sidik jari Anda pada pemindai biometrik perangkat.
              </p>
            </div>
            <button
              onClick={() => {
                login(email, selectedRole);
                onClose();
              }}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg hover:from-blue-500 hover:to-cyan-500"
            >
              Simulasi Sidik Jari Berhasil →
            </button>
          </div>
        )}

        {/* Biometric: Face Recognition */}
        {method === 'face' && (
          <div className="mt-6 text-center space-y-4 py-2">
            <div className="relative w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-cyan-500/50 bg-slate-950 flex flex-col items-center justify-center">
              {faceScanning ? (
                <div className="flex flex-col items-center gap-2">
                  <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin" />
                  <span className="text-[11px] text-cyan-300 font-semibold">Memindai Wajah...</span>
                </div>
              ) : faceSuccess ? (
                <div className="flex flex-col items-center gap-2 text-emerald-400">
                  <UserCheck className="h-12 w-12" />
                  <span className="text-xs font-bold">Wajah Terverifikasi!</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <Camera className="h-10 w-10 text-slate-500" />
                  <span className="text-[11px]">Posisikan Wajah di Depan Kamera</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={startFaceScan}
              disabled={faceScanning}
              className="rounded-xl bg-cyan-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-cyan-500 disabled:opacity-50"
            >
              {faceScanning ? 'Memproses...' : 'Mulai Pemindaian Wajah (Face Recognition)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
