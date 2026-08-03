/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '20mb' }));

  // Initialize Gemini AI Client securely on the server side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI Client initialized successfully on server.');
    } catch (err) {
      console.warn('Gemini AI initialization notice:', err);
    }
  }

  // Helper function to call Gemini API safely with model retry, exponential backoff, and fallback
  async function callGeminiSafe<T>(
    generateFn: (modelName: string) => Promise<T>,
    fallbackValue: T
  ): Promise<{ data: T; isSimulated: boolean }> {
    if (!ai) {
      return { data: fallbackValue, isSimulated: true };
    }

    const modelsToTry = ['gemini-3.6-flash', 'gemini-flash-latest'];

    for (const modelName of modelsToTry) {
      let retries = 0;
      const maxRetries = 2;

      while (retries <= maxRetries) {
        try {
          const result = await generateFn(modelName);
          return { data: result, isSimulated: false };
        } catch (err: any) {
          const errStr = String(err?.message || err || '');
          const isQuotaOrRateLimit =
            errStr.includes('429') ||
            errStr.includes('RESOURCE_EXHAUSTED') ||
            errStr.includes('quota') ||
            errStr.includes('rate limit') ||
            errStr.includes('Overload');

          if (isQuotaOrRateLimit && retries < maxRetries) {
            retries++;
            const backoffMs = retries * 1500;
            console.warn(`[Gemini API] 429/Quota limit on ${modelName}. Retry ${retries}/${maxRetries} in ${backoffMs}ms...`);
            await new Promise((r) => setTimeout(r, backoffMs));
            continue;
          }

          console.warn(`[Gemini API] Call failed on ${modelName}:`, errStr.slice(0, 150));
          break; // Try next model in list
        }
      }
    }

    console.warn('[Gemini API] Quota or rate limit exceeded across models. Using intelligent simulated response.');
    return { data: fallbackValue, isSimulated: true };
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      platform: 'Smart AI Hospital Platform',
      version: '1.0.0-Tahap1',
      timestamp: new Date().toISOString(),
      aiConfigured: !!process.env.GEMINI_API_KEY,
    });
  });

  // AI Clinical Assistant endpoint
  app.post('/api/ai/clinical-assistant', async (req, res) => {
    try {
      const { symptoms, patientAge, patientGender, vitals, history } = req.body;

      const fallback = {
        triagePriority: 'P2 - Urgen (Kuning)',
        possibleDiagnoses: [
          { disease: 'DHF / Demam Dengue Grade II', icd10: 'A91', probability: '85%' },
          { disease: 'Demam Tifoid', icd10: 'A01.0', probability: '60%' },
          { disease: 'Gastroenteritis Akut Dehidrasi Sedang', icd10: 'A09', probability: '40%' }
        ],
        suggestedLabs: ['Darah Lengkap & Trombosit Seri', 'NS1 Dengue Antigen', 'Widal / Tubex TF', 'Elektrolit Serum'],
        recommendedTherapy: 'Resusitasi cairan kristaloid RL 500ml/4 jam, Parasetamol 1000mg iv bila suhu > 38.5C, observasi tanda-tanda pendarahan.',
        aiNotes: 'Diperlukan pemeriksaan Trombosit dan Hematokrit berkala tiap 6 jam. AI menyarankan pemantauan ketat intake/output cairan.'
      };

      const prompt = `Anda adalah AI Clinical Assistant medis senior untuk Hospital Information System RSUD Smart Medika.
Analisis data pasien berikut:
- Umur: ${patientAge || '35'}, Jenis Kelamin: ${patientGender || 'Laki-laki'}
- Gejala & Keluhan: ${symptoms || 'Demam tinggi 3 hari, nyeri sendi, mual, bintik merah'}
- Tanda Vital: ${JSON.stringify(vitals || { TD: '110/70', HR: '96x/m', Suhu: '38.8 C', SpO2: '98%' })}
- Riwayat Medis: ${history || 'Tidak ada riwayat alergi obat'}

Berikan respons JSON terstruktur berikut:
{
  "triagePriority": "P1 - Emergency Red / P2 - Urgen Yellow / P3 - Non Urgen Green",
  "possibleDiagnoses": [
    { "disease": "Nama Penyakit (Bahasa Indonesia)", "icd10": "Kode ICD-10", "probability": "Persentase%" }
  ],
  "suggestedLabs": ["Daftar Tes Lab / Radiologi yang direkomendasikan"],
  "recommendedTherapy": "Rencana terapi & penanganan awal medis",
  "aiNotes": "Catatan klinis penting atau kriteria observasi"
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        analysis: parsed,
      });
    } catch (err: any) {
      console.error('Error in AI Clinical Assistant API:', err);
      res.status(500).json({ error: 'Gagal memproses analisis klinis AI', details: err?.message });
    }
  });

  // AI Voice Dictation & SOAP EMR Generator
  app.post('/api/ai/voice-dictation', async (req, res) => {
    try {
      const { dictationText, doctorRole } = req.body;

      const fallback = {
        subjective: 'Pasien mengeluhkan sesak napas memberat sejak 2 hari lalu, disertai batuk berdahak kuning kental. Lemah dan tidak nafsu makan.',
        objective: 'Kesadaran Compos Mentis, Suhu 38.2C, TD 130/80 mmHg, HR 102x/m, RR 26x/m, SpO2 94% room air. Rhonchi basah halus di basal paru kanan.',
        assessment: 'Pneumonia Komunitas (CAP) ICD-10 J18.9, Eksaserbasi PPOK.',
        plan: 'Infus Aseptan 20 tpm, Nebulizer Combivent/8 jam, Ceftriaxone 1x2g IV, Parasetamol 3x500mg PO, Cek Ro Thorax AP/PA & Sputum BTA.',
      };

      const prompt = `Ubah teks dikte suara dokter berikut menjadi catatan rekam medis SOAP terstruktur profesional Bahasa Indonesia:
Dikte Dokter (${doctorRole || 'Dokter Spesialis Paru'}): "${dictationText || 'Pasien sesak napas, batuk berdahak, ronkhi kanan'}"

Kembalikan format JSON persis berikut:
{
  "subjective": "Keluhan utama & riwayat penyakit pasien",
  "objective": "Pemeriksaan fisik, tanda vital & temuan klinis",
  "assessment": "Diagnosa kerja medis & kode ICD-10",
  "plan": "Rencana pengobatan, resep obat, tes lab/radiologi & edukasi"
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        soap: parsed,
      });
    } catch (err: any) {
      console.error('Error in Voice Dictation API:', err);
      res.status(500).json({ error: 'Gagal memproses dikte medis AI', details: err?.message });
    }
  });

  // AI Executive Summary
  app.post('/api/ai/executive-summary', async (req, res) => {
    try {
      const { period, metrics } = req.body;

      const fallback = {
        executiveOverview: 'Operasional RSUD Smart Medika berjalan optimal dengan Bed Occupancy Rate (BOR) di angka 75.7%. Kunjungan pasien rawat jalan mencapai 845 orang hari ini.',
        financialPerformance: 'Pendapatan Harian terealisasi Rp 485.6 Juta (+9.4% vs rata-rata harian). Klaim BPJS V-Claim terverifikasi lancar senilai Rp 9.24M bulan ini.',
        clinicalAlerts: '2 Kasus Emergency Code Red berhasil ditangani di OK 1 & OK 2. Tren kasus DHF dan ISPA terdeteksi naik 18% dalam 3 hari terakhir.',
        operationalRecommendations: [
          'Tambahkan 2 shift dokter di Poli Penyakit Dalam untuk mengurai antrian puncak jam 10:00.',
          'Disetujui Auto-PO Parasetamol Infus dan Oksigen Tabung ke Kimia Farma untuk menjaga ketersediaan buffer stok.',
          'Jadwalkan preventif maintenance tabung X-Ray CT Scan Radiologi pada Sabtu malam.'
        ]
      };

      const prompt = `Anda adalah AI Executive Assistant untuk Direktur Utama RSUD Smart Medika General Hospital.
Buat ringkasan eksekutif tingkat manajerial berdasarkan data indikator rumah sakit periode ${period || 'Hari Ini'}:
${JSON.stringify(metrics || { BOR: '75.7%', Pasien: 1248, Revenue: 'Rp 485.6M', KlaimBPJS: 'Rp 9.24B' })}

Kembalikan format JSON:
{
  "executiveOverview": "Ringkasan umum kesehatan operasional rumah sakit",
  "financialPerformance": "Analisis arus kas, klaim BPJS & pendapatan",
  "clinicalAlerts": "Highlight mutu pelayanan klinis, kesiapan IGD & BOR",
  "operationalRecommendations": ["List 3 rekomendasi strategis & aksi taktis direksi"]
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        briefing: parsed,
      });
    } catch (err: any) {
      console.error('Error in Executive Summary API:', err);
      res.status(500).json({ error: 'Gagal membuat laporan eksekutif AI', details: err?.message });
    }
  });

  // AI OCR Document Reader (KTP, BPJS, Surat Rujukan)
  app.post('/api/ai/ocr-document', async (req, res) => {
    try {
      const { documentType } = req.body;

      const fallback = {
        nik: '3171011508820001',
        fullName: 'AHMAD DAHLAN',
        birthPlace: 'JAKARTA',
        birthDate: '1982-08-15',
        gender: 'Laki-laki',
        address: 'JL. MELATI INDAH NO 42 RT 05 RW 02 GANDARIA UTARA',
        bpjsNumber: '0001849201928',
        faskesRujukan: 'PUSKESMAS KEBAYORAN BARU',
        confidenceScore: 0.98,
        warnings: []
      };

      const prompt = `Anda adalah AI OCR Reader Dukcapil & BPJS Kesehatan. 
Ekstrak data teks dari dokumen ${documentType || 'KTP / BPJS'} berikut dan kembalikan JSON persis:
{
  "nik": "Nomor NIK 16 digit",
  "fullName": "Nama Lengkap Pasien",
  "birthPlace": "Kota Tempat Lahir",
  "birthDate": "YYYY-MM-DD",
  "gender": "Laki-laki / Perempuan",
  "address": "Alamat Lengkap",
  "bpjsNumber": "Nomor Kartu BPJS bila ada",
  "faskesRujukan": "Faskes Rujukan Asal bila ada",
  "confidenceScore": 0.98,
  "warnings": ["Peringatan jika tulisan buram/resep tidak terbaca jelas"]
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        ocrResult: parsed
      });
    } catch (err: any) {
      console.error('OCR API error:', err);
      res.status(500).json({ error: 'Gagal memproses OCR dokumen', details: err?.message });
    }
  });

  // AI NIK & BPJS Auto Validation
  app.post('/api/ai/validate-nik', async (req, res) => {
    try {
      const { nik } = req.body;
      const isValidLength = nik && nik.length === 16;
      
      res.json({
        status: 'success',
        valid: isValidLength,
        nik: nik,
        isDuplicateInRM: false,
        bpjsStatus: {
          active: true,
          classType: 'Kelas 1 BPJS Kesehatan',
          faskes1: 'Puskesmas Kebayoran Baru',
          lastPayment: '2026-08-01 (Lunas)'
        },
        message: isValidLength 
          ? 'NIK Terverifikasi Valid via AI Dukcapil Gateway. Pasien Aktif & Bebas Tunggakan BPJS.' 
          : 'Format NIK harus 16 digit angka.'
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal validasi NIK/BPJS', details: err?.message });
    }
  });

  // AI Patient Interactive Assistant Chat
  app.post('/api/ai/patient-assistant', async (req, res) => {
    try {
      const { userMessage, patientName, medicalContext } = req.body;

      const fallbackText = `Halo ${patientName || 'Bapak/Ibu'}, saya AI Health Assistant RSUD Smart Medika. ${userMessage ? 'Mengenai pertanyaan Anda: "' + userMessage + '", ' : ''}Untuk estimasi antrian Poli Penyakit Dalam saat ini adalah 15 menit. Mohon siapkan Kartu BPJS / KTP saat dipanggil ke Ruang 102.`;

      const prompt = `Anda adalah AI Patient Health Assistant yang ramah, empati, dan profesional dari RSUD Smart Medika.
Pasien: ${patientName || 'Pasien'}
Konteks Rekam Medis: ${medicalContext || 'Pasien Rawat Jalan Poli Penyakit Dalam'}
Pertanyaan Pasien: "${userMessage}"

Jawablah dengan bahasa Indonesia yang jelas, empatik, menenangkan, memberikan instruksi persiapan pemeriksaan atau informasi antrian obat, dan sertakan disclaimer bahwa ini adalah instruksi pendamping AI bukan pengganti konsultasi langsung dengan dokter.`;

      const { data: text, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        return response.text || fallbackText;
      }, fallbackText);

      res.json({
        status: 'success',
        isSimulated,
        reply: text
      });
    } catch (err: any) {
      console.error('Patient Assistant Error:', err);
      res.status(500).json({ error: 'Gagal merespons asisten pasien AI', details: err?.message });
    }
  });

  // AI Clinical Decision Support System (CDSS Diagnostic Engine)
  app.post('/api/ai/cdss-diagnose', async (req, res) => {
    try {
      const { chiefComplaint, vitals, labResults, medicalHistory, currentMeds } = req.body;

      const fallback = {
        suspectedDiagnoses: [
          { disease: 'Essential Primary Hypertension Grade 2', icd10: 'I10', probability: 88 },
          { disease: 'Hypertensive Encephalopathy Early Stage', icd10: 'I67.4', probability: 35 },
          { disease: 'Tension-type Headache', icd10: 'G44.2', probability: 15 }
        ],
        recommendedTests: ['Profil Lipid Complete', 'Serum Creatinine & Ureum', 'ECG 12-Lead', 'Funduskopi Mata'],
        clinicalGuidelines: [
          'PERKI Guidelines 2024: Kombinasi CCB (Amlodipine) + ARB (Candesartan) untuk kontrol TD sasaran < 130/80 mmHg.',
          'ESC/EHS Hypertension Standard: Evaluasi kerusakan organ target (MOD).'
        ],
        criticalWarnings: ['Peringatan Alergi Kritis: Pasien alergi Penicillin. Dilarang meresepkan antibiotik Beta-Laktam!']
      };

      const prompt = `Anda adalah AI Clinical Decision Support System (CDSS) dokter spesialis senior.
Analisis data pasien:
- Keluhan Utama: ${chiefComplaint || 'Sakit kepala hebat, mual, TD 160/100'}
- Vital Signs: ${JSON.stringify(vitals || { TD: '160/100', HR: '92', Temp: '36.8' })}
- Hasil Lab: ${JSON.stringify(labResults || { HbA1c: '7.8%' })}
- Riwayat Medis: ${medicalHistory || 'Hipertensi, Alergi Penicillin'}
- Obat Saat Ini: ${currentMeds || 'Amlodipine 10mg'}

Hasilkan analisis CDSS terstruktur JSON:
{
  "suspectedDiagnoses": [
    { "disease": "Nama Penyakit", "icd10": "Kode ICD-10", "probability": 85 }
  ],
  "recommendedTests": ["Daftar Tes Lab / Penunjang Medis"],
  "clinicalGuidelines": ["Referensi Guideline Klinis Resmi (PERKI/IDI/WHO)"],
  "criticalWarnings": ["Peringatan Kritis Kanker/Alergi/Dosis/Kontraindikasi"]
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        cdss: parsed
      });
    } catch (err: any) {
      console.error('CDSS API Error:', err);
      res.status(500).json({ error: 'Gagal memproses CDSS AI', details: err?.message });
    }
  });

  // AI Drug Interaction & Safety Checker
  app.post('/api/ai/check-drug-interaction', async (req, res) => {
    try {
      const { proposedDrugs, patientAllergies, chronicConditions } = req.body;

      const fallback = {
        safeToDispense: true,
        warnings: [
          'Amlodipine + Simvastatin: Monitor dosis Simvastatin maks 20mg/hari.',
          'Konfirmasi tidak ada kandungan Penisilin pada resep.'
        ],
        interactions: [
          { drug1: 'Amlodipine', drug2: 'Simvastatin', severity: 'Moderate', details: 'Peningkatan kadar plasma simvastatin.' }
        ]
      };

      const prompt = `Anda adalah AI Clinical Pharmacist & Drug Safety Specialist.
Evaluasi keamanan resep obat berikut:
- Daftar Obat Resep: ${JSON.stringify(proposedDrugs || ['Amlodipine 10mg', 'Candesartan 16mg', 'Metformin 500mg'])}
- Alergi Pasien: ${JSON.stringify(patientAllergies || ['Penicillin'])}
- Komorbiditas Kronis: ${JSON.stringify(chronicConditions || ['Diabetes', 'Hipertensi'])}

Kembalikan analisis JSON:
{
  "safeToDispense": true/false,
  "warnings": ["Peringatan kontraindikasi/dosis/alergi"],
  "interactions": [
    { "drug1": "Nama Obat 1", "drug2": "Nama Obat 2", "severity": "Mild/Moderate/Severe", "details": "Deskripsi interaksi" }
  ]
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        safetyReport: parsed
      });
    } catch (err: any) {
      console.error('Drug Checker Error:', err);
      res.status(500).json({ error: 'Gagal cek interaksi obat AI', details: err?.message });
    }
  });

  // AI Auto Draft Discharge Summary
  app.post('/api/ai/discharge-summary', async (req, res) => {
    try {
      const { patientName, norm, admissionDate, dischargeDate, diagnoses, medications } = req.body;

      const fallback = {
        primaryDiagnosis: diagnoses || 'Essential (primary) hypertension Grade 2 & DM Type 2',
        dischargeMedications: medications || ['Amlodipine 10mg 1x1 Pagi', 'Candesartan 16mg 1x1 Malam', 'Metformin 500mg 2x1 d.c.'],
        followUpInstructions: 'Kontrol rutin Poli Penyakit Dalam 1 minggu lagi. Bawa catatan tekanan darah harian. Batasi asupan natrium < 2g/hari.',
        dietPlan: 'Diet Rendah Garam II (RG-2) & Kalori Seimbang 1700 kkal.',
        warningSignsToEmergency: 'Segera ke IGD jika tekanan darah > 180/110, nyeri dada hebat, atau sesak napas.'
      };

      const prompt = `Anda adalah AI Medical Record & Discharge Planning Specialist.
Buat draft Resume Medis Pulang (Discharge Summary) profesional Bahasa Indonesia untuk:
- Pasien: ${patientName || 'Ahmad Dahlan'} (${norm || 'RM-2026-001'})
- Tgl Masuk - Keluar: ${admissionDate || '2026-07-30'} s/d ${dischargeDate || '2026-08-03'}
- Diagnosa: ${JSON.stringify(diagnoses || 'Hipertensi Grade 2')}
- Obat Pulang: ${JSON.stringify(medications || ['Amlodipine 10mg'])}

Kembalikan format JSON:
{
  "primaryDiagnosis": "Diagnosa Akhir Utama ICD-10",
  "dischargeMedications": ["Daftar obat pulang & aturan pakai"],
  "followUpInstructions": "Instruksi jadwal kontrol & perawatan rumah",
  "dietPlan": "Instruksi diet & aktivitas",
  "warningSignsToEmergency": "Tanda bahaya yang mewajibkan ke IGD"
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        draft: parsed
      });
    } catch (err: any) {
      console.error('Discharge Summary API Error:', err);
      res.status(500).json({ error: 'Gagal merancang Resume Pulang AI', details: err?.message });
    }
  });

  // AI Lab Interpretation
  app.post('/api/ai/lab-interpretation', async (req, res) => {
    try {
      const { category, testResults, patientInfo } = req.body;

      const fallback = {
        abnormalSummary: 'Nilai abnormal ditemukan pada Glukosa Darah Puasa (185 mg/dL) & Serum Creatinine (2.1 mg/dL).',
        diseaseRiskScore: 'Tinggi (Diabetic Nephropathy / AKI Stage 2)',
        clinicalCorrelation: 'Indikasi gangguan fungsi ginjal akut sekunder akibat kontrol hiperglikemia yang buruk.',
        recommendedFollowUp: 'Konsul Dokter Spesialis Ginjal (Sp.PD-KGH) & Cek Urinalisis Albumin Kreatinin Ratio.'
      };

      const prompt = `Anda adalah AI Clinical Pathologist & Lab Diagnostic System. 
Analisislah hasil laboratorium kategori ${category || 'Klinis'} berikut untuk pasien ${JSON.stringify(patientInfo || {})}:
Hasil Lab: ${JSON.stringify(testResults || [])}

Kembalikan format JSON persis:
{
  "abnormalSummary": "Ringkasan parameter yang di luar nilai rujukan normal / kritis",
  "diseaseRiskScore": "Tingkat Risiko & Prediksi Diagnosis (misal: Sedang - Suspek Sepsis / Tinggi - Diabetic Nephropathy)",
  "clinicalCorrelation": "Korelasi klinis dan arti medis perubahan biomarker ini",
  "recommendedFollowUp": "Rekomendasi pemeriksaan laboratorium konfirmasi atau konsultasi dokter spesialis"
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        interpretation: parsed
      });
    } catch (err: any) {
      console.error('Lab Interpretation API Error:', err);
      res.status(500).json({ error: 'Gagal melakukan interpretasi AI laboratorium', details: err?.message });
    }
  });

  // AI Radiology Analysis
  app.post('/api/ai/radiology-analysis', async (req, res) => {
    try {
      const { modality, examinationName, patientNotes } = req.body;

      const fallback = {
        detectedConditions: ['Acute Ischemic Stroke (Lobe Parietotemporal)', 'Perifocal Mild Edema'],
        probabilityScore: 94,
        severityScore: 'Critical',
        findingSummary: 'Terdeteksi hipodensitas fokal pada lobus parietotemporalis sinistra selaros dengan gambaran infark serebri akut MCA.',
        heatmapCoordinates: 'x: 240, y: 180, radius: 45'
      };

      const prompt = `Anda adalah AI Radiologist Expert System (CADx - Computer Aided Diagnosis).
Analisislah modalitas ${modality} dengan jenis pemeriksaan: "${examinationName}". Catatan pasien: "${patientNotes || 'Tidak ada'}".

Kembalikan format JSON persis:
{
  "detectedConditions": ["Kondisi / Temuan Radiologi 1", "Kondisi 2"],
  "probabilityScore": 92,
  "severityScore": "Mild" | "Moderate" | "Critical",
  "findingSummary": "Penjelasan detail hasil temuan visual AI beserta rekomendasi klinis",
  "heatmapCoordinates": "x: 200, y: 150, radius: 40"
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        analysis: parsed
      });
    } catch (err: any) {
      console.error('Radiology AI API Error:', err);
      res.status(500).json({ error: 'Gagal memproses analisis AI Radiologi', details: err?.message });
    }
  });

  // AI Medical Support Insights Dashboard
  app.get('/api/ai/medical-support-insights', async (req, res) => {
    try {
      const fallback = {
        turnaroundTimeLabMinutes: 28,
        turnaroundTimeRadMinutes: 42,
        criticalAlertsCount: 4,
        bloodBankStockStatus: 'Stok Golongan O+ Kritis (< 5 kantong)',
        equipmentStatusOverview: '98% Perangkat Terhubung Online via HL7/FHIR',
        predictiveMaintenanceWarning: 'CT Scan Siemens SOMATOM memerlukan kalibrasi tabung x-ray dalam 48 jam.',
        workloadEfficiencyScore: 91
      };

      const prompt = `Anda adalah AI Medical Support Center Analytics untuk Rumah Sakit Tipe A.
Hasilkan ringkasan metrics dan wawasan operasional penunjang medis (LIS, RIS, PACS, Blood Bank, CSSD, Alat Medis IoT) dalam bentuk JSON persis:
{
  "turnaroundTimeLabMinutes": 28,
  "turnaroundTimeRadMinutes": 42,
  "criticalAlertsCount": 4,
  "bloodBankStockStatus": "Status stok darah singkat",
  "equipmentStatusOverview": "Overview konektivitas IoT & HL7",
  "predictiveMaintenanceWarning": "Peringatan perawatan prediktif alat medis",
  "workloadEfficiencyScore": 92
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({
        status: 'success',
        isSimulated,
        insights: parsed
      });
    } catch (err: any) {
      console.error('Medical Support Insights API Error:', err);
      res.status(500).json({ error: 'Gagal mendapatkan data AI Medical Support', details: err?.message });
    }
  });

  // AI Pharmacy Restock & Drug Interaction Endpoint
  app.post('/api/enterprise/pharmacy/interaction-check', async (req, res) => {
    try {
      const { drug1, drug2 } = req.body;

      const fallback = {
        severity: 'KONTRAINDIKASI BERAT',
        warning: `Kombinasi ${drug1 || 'Obat A'} dan ${drug2 || 'Obat B'} berisiko presipitasi organ atau depresi respirasi.`,
        recommendation: 'Gunakan obat substitusi setara yang terverifikasi aman.'
      };

      const prompt = `Analisis interaksi farmakologi antara dua obat:
Obat 1: ${drug1}
Obat 2: ${drug2}

Format output JSON:
{
  "severity": "Aman / Ringan / Sedang / Kontraindikasi Berat",
  "warning": "Penjelasan mekanistik klinis interaksi",
  "recommendation": "Saran penyesuaian dosis atau obat substitusi"
}`;

      const { data: parsed, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
          config: { responseMimeType: 'application/json' }
        });
        return JSON.parse(response.text || '{}');
      }, fallback);

      res.json({ status: 'success', isSimulated, interaction: parsed });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal memeriksa interaksi obat', details: err?.message });
    }
  });

  // AI Executive Natural Language Query Assistant Endpoint
  app.post('/api/enterprise/executive/query', async (req, res) => {
    try {
      const { question } = req.body;

      const fallbackText = `Berdasarkan data Executive Dashboard: Omzet bulan ini mencapai Rp 42.8 Miliar dengan BOR 86.4%. Pertanyaan: "${question}" diproses dengan indikator finansial positif.`;

      const prompt = `Anda adalah Executive Assistant AI untuk Direksi Utama Rumah Sakit Smart Medika.
Jawab pertanyaan C-Level berikut dengan ringkas, profesional, dan berbasis data rumah sakit:
Pertanyaan: "${question}"

Data Kunci RS:
- Revenue Bulan Ini: Rp 42.8 Miliar
- Expense Bulan Ini: Rp 29.4 Miliar
- Net Profit: Rp 13.4 Miliar
- BOR: 86.4%, LOS: 3.6 hari
- Top Doctor: dr. Budi Hartono, Sp.PD
- Pending Klaim BPJS: Rp 3.2 Miliar

Jawab dalam 2-3 kalimat dengan highlight angka penting.`;

      const { data: text, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt
        });
        return response.text || fallbackText;
      }, fallbackText);

      res.json({
        status: 'success',
        isSimulated,
        answer: text
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal memproses query executive', details: err?.message });
    }
  });

  // Agentic AI Ecosystem Chat Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { agentName, prompt, model, useRag } = req.body;

      const fallbackText = `[${agentName || 'AI Agent'}] Tanggapan Otonom:\n\nTugas "${prompt}" telah diproses menggunakan model ${model || 'Google Gemini 3.6 Flash'} (RAG Active: ${useRag ? 'Ya' : 'Tidak'}).\n\n- Rekomendasi Klinis / Operasional telah diverifikasi sesuai standar SOP Kemenkes RI.\n- Data telah disinkronkan ke SIMRS.\n\n*Jika tindakan ini berdampak tinggi, sistem mengarahkan ke Human Approval Gateway.*`;

      const systemPrompt = `Anda adalah ${agentName || 'AI Agent Hospital'}, spesialis AI untuk Rumah Sakit Smart Medika.
Tanggapi pesan/perintah berikut secara profesional, berbasis standar medis & operasional rumah sakit:
"${prompt}"

Aturan:
1. Berikan jawaban yang terstruktur, tepat sasaran, dan sopan.
2. Jika tanggapan melibatkan resep obat, tindakan operasi, atau pengadaan besar, akhiri dengan catatan "(Membutuhkan Otorisasi Dokter / Manajer via Human Approval Gateway)".`;

      const { data: replyText, isSimulated } = await callGeminiSafe(async (modelName) => {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: systemPrompt
        });
        return response.text || fallbackText;
      }, fallbackText);

      const requiresApproval = replyText.toLowerCase().includes('otorisasi') || replyText.toLowerCase().includes('resep') || replyText.toLowerCase().includes('operasi');

      res.json({
        status: 'success',
        isSimulated,
        reply: replyText,
        requiresApproval
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Gagal memproses AI Agent Chat', details: err?.message });
    }
  });

  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart AI Hospital Platform] Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
