import React from 'react';
import { Info } from 'lucide-react';

type MediaPipeGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  previewCamera: boolean;
  enabled: boolean;
};

export default function MediaPipeGuideModal({
  isOpen,
  onClose,
  previewCamera,
  enabled,
}: MediaPipeGuideModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md rounded-2xl border border-cyan-400/50 p-6 text-slate-200 shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-md transition-colors duration-300 ${
          previewCamera && enabled ? 'bg-[#070b19]/40' : 'bg-[#070b19]/90'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-cyan-300">
          <Info className="h-6 w-6 text-fuchsia-400" />
          Panduan Hand Tracking
        </h2>

        <div className="custom-scrollbar max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          <p className="text-sm leading-relaxed text-slate-300">
            Halo Pembelajar! Fitur <strong>Hand Tracking</strong> memungkinkan Anda mengontrol aplikasi ini sepenuhnya menggunakan gestur tangan. Berikut adalah panduan <em>coaching</em> untuk menguasainya:
          </p>

          <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
              <span className="text-lg">👆</span> Kursor (Mengarahkan Layar)
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Arahkan <strong>telapak tangan Anda</strong> dengan santai menghadap kamera. Kursor di layar akan secara otomatis mengikuti arah pergerakan tangan Anda untuk bernavigasi.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
              <span className="text-lg">🤏</span> Pinch (Mencubit) untuk Klik
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Arahkan kursor ke tombol target, lalu <strong>katupkan ujung jempol dan telunjuk</strong> secara bersamaan. Gestur ini memicu aksi <em>Click</em> pada tombol yang disorot.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
              <span className="text-lg">✌️</span> Peace Sign (Dua Jari) untuk Play All
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Acungkan pose <strong>Peace (jari telunjuk dan tengah)</strong>. Gestur ini berguna untuk memicu tombol <em>Play All</em> agar aplikasi membacakan semua materi sekaligus secara otomatis.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
              <span className="text-lg">🤙</span> Pinky Point (Kelingking) untuk Show IPA
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Angkat hanya <strong>jari kelingking Anda</strong> ke arah kamera. Gestur ini berfungsi sebagai sakelar (<em>toggle</em>) untuk memunculkan atau menyembunyikan simbol fonetik IPA.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
              <span className="text-lg">💨</span> Swipe (Geser Cepat) untuk Navigasi
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Gerakkan telapak tangan Anda <strong>dengan cepat ke kiri atau kanan</strong> layaknya sedang menepis. Gestur ini memicu aksi pindah halaman <em>Next</em> atau <em>Previous</em>.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
              <span className="text-lg">✋</span> Palm Scroll (Menggulir)
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Tunjukkan <strong>telapak tangan terbuka</strong> ke kamera. Gerakkan perlahan ke batas atas layar untuk <em>Scroll Up</em> atau ke bawah untuk <em>Scroll Down</em>.
            </p>
          </div>

          <div className="rounded-lg border border-slate-700/50 bg-black/40 p-3">
            <h3 className="mb-1 flex items-center gap-1.5 font-semibold text-fuchsia-300">
              <span className="text-lg">✊</span> Fist Zoom (Perbesar)
            </h3>
            <p className="text-xs leading-relaxed text-slate-400">
              <strong>Kepalkan tangan</strong>, lalu gerakkan sedikit ke atas atau bawah. Gunakan gestur ini untuk <em>Zoom In</em> dan <em>Zoom Out</em> halaman.
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <button
            onClick={onClose}
            className="rounded-full border border-cyan-400/50 bg-cyan-600/20 px-6 py-2 text-sm font-semibold text-cyan-100 transition-all hover:scale-105 hover:bg-cyan-500/30"
          >
            Saya Mengerti
          </button>
        </div>
      </div>
    </div>
  );
}
