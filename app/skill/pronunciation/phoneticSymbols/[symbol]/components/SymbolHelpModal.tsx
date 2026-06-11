import React from 'react';
import { HelpCircle } from 'lucide-react';

interface SymbolHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SymbolHelpModal: React.FC<SymbolHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-[#0a0f1c] border border-cyber-cyan/40 rounded-2xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto w-full shadow-[0_0_50px_rgba(190,41,236,0.3)] mx-4 sm:mx-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200"
          title="Tutup popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center mb-4">
          <HelpCircle className="text-cyber-pink mr-3" size={24} />
          <h3 className="text-xl font-bold text-white">Instruksi Perekaman</h3>
        </div>

        <div className="space-y-3 text-gray-300">
          <div className="flex items-start">
            <span className="text-cyber-cyan font-bold mr-3">1.</span>
            <p>Klik tombol <span className="text-cyber-pink font-semibold">REC_ON</span> untuk memulai perekaman</p>
          </div>
          <div className="flex items-start">
            <span className="text-cyber-cyan font-bold mr-3">2.</span>
            <p>Bicara dengan jelas ke mikrofon dari Mission yang ada di Practice Section di halaman.</p>
          </div>
          <div className="flex items-start">
            <span className="text-cyber-cyan font-bold mr-3">3.</span>
            <p>Klik tombol <span className="text-red-400 font-semibold">STOP</span> saat selesai</p>
          </div>
          <div className="flex items-start">
            <span className="text-cyber-cyan font-bold mr-3">4.</span>
            <p>Klik tombol <span className="text-cyber-cyan font-semibold">PLAY</span> untuk mendengarkan rekaman</p>
          </div>
          <div className="flex items-start">
            <span className="text-cyber-cyan font-bold mr-3">5.</span>
            <p>Klik tombol <span className="text-cyber-pink font-semibold">DOWNLOAD</span> untuk menyimpan audio</p>
          </div>
          <div className="flex items-start">
            <span className="text-cyber-cyan font-bold mr-3">6.</span>
            <p>Setelah selesai, unduh file audio dan simpan di pc/android Anda.</p>
          </div>
          <div className="flex items-start">
            <span className="text-cyber-cyan font-bold mr-3">7.</span>
            <p>Isi <span className="text-cyber-pink font-semibold">saved progress</span> berdasarkan hasil penilaian dari AI assistant</p>
          </div>
          <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
            <p className="text-sm text-cyber-cyan mb-2">
              <strong>Langkah Selanjutnya:</strong> Buka halaman <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-cyber-pink hover:text-cyber-pink/80 underline transition-colors">Gemini</a> atau AI assistant lainnya
            </p>
            <p className="text-sm text-cyber-cyan mb-2">
              Upload rekaman audio Anda
            </p>
            <p className="text-sm text-cyber-cyan">
              <strong>Gunakan prompt berikut:</strong>
            </p>
            <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-300 font-mono max-h-32 overflow-y-auto relative">
              &quot;Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional.
              1. Transkripsikan semua kata yang saya ucapkan dalam rekaman ini.
              2. Analisis setiap kata tersebut dengan fokus pada American Accent (General American). Nilai dan beri umpan balik pada pengucapan vokal dan konsonan.
              3. Format Output: Sajikan hasil analisis dalam bentuk tabel dengan tiga kolom:
                 - Kolom 1: Kata yang diucapkan.
                 - Kolom 2: Status Kualitatif ('🟢 Sangat bagus 🔵Bagus', '🟠 Perlu Sedikit Perbaikan', atau '🔴 Perlu Perbaikan').
                 - Kolom 3: Umpan Balik spesifik yang menjelaskan secara singkat apa yang perlu diperbaiki.&quot;
            </div>
          </div>

          <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
            <p className="text-sm text-cyber-cyan">
              <strong>Tip:</strong> Pastikan mikrofon Anda bekerja dengan baik dan berbicara dengan volume yang cukup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
