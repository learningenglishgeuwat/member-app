'use client'

import dynamic from 'next/dynamic';

const RecordingControlsButtonMP3 = dynamic(
  () => import('../skill/components/RecordingControlsButtonMP3'),
  {
    ssr: false,
  }
);

export default function TestMP3RecordingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050a10] via-[#0a0f1c] to-[#050a10] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-cyber-cyan to-cyber-pink bg-clip-text text-transparent">
          Test MP3 Recording Panel
        </h1>
        
        <div className="bg-[#0a0f1c]/50 border border-cyber-cyan/30 rounded-2xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">Cara Kerja MP3 Recording</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="p-4 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
              <h3 className="text-lg font-semibold text-cyber-cyan mb-2">Alur Proses:</h3>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li><strong>Suara Kamu</strong> → Masuk melalui mikrofon</li>
                <li><strong>[Mic]</strong> → MediaRecorder API menangkap audio</li>
                <li><strong>Raw PCM (Data Mentah)</strong> → Audio dalam format WAV/WebM</li>
                <li><strong>[Library Encoder - lamejs]</strong> → Konversi ke format MP3</li>
                <li><strong>File MP3</strong> → Siap didownload (128 kbps, mono)</li>
              </ol>
            </div>

            <div className="p-4 bg-cyber-pink/10 border border-cyber-pink/30 rounded-lg">
              <h3 className="text-lg font-semibold text-cyber-pink mb-2">Keunggulan Format MP3:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Ukuran file lebih kecil (kompresi efisien)</li>
                <li>Kompatibel dengan semua platform dan perangkat</li>
                <li>Cocok untuk upload ke AI assistant (Gemini, ChatGPT, dll)</li>
                <li>Kualitas audio tetap bagus dengan bitrate 128 kbps</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-400 mb-2">Teknologi yang Digunakan:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>MediaRecorder API</strong> - Recording audio dari mikrofon</li>
                <li><strong>AudioContext API</strong> - Decode dan process audio data</li>
                <li><strong>lamejs Library</strong> - MP3 encoder untuk browser</li>
                <li><strong>Web Audio API</strong> - Manipulasi audio buffer</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-[#0a0f1c]/50 border border-cyber-cyan/30 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-cyber-cyan mb-4">Instruksi Penggunaan</h2>
          
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start gap-3">
              <span className="text-cyber-cyan font-bold">1.</span>
              <span>Klik tombol <strong className="text-cyber-pink">floating circle</strong> di kanan bawah untuk membuka panel recording</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyber-cyan font-bold">2.</span>
              <span>Klik <strong className="text-cyber-pink">REC_ON</strong> untuk mulai merekam</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyber-cyan font-bold">3.</span>
              <span>Bicara ke mikrofon (coba ucapkan sesuatu)</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyber-cyan font-bold">4.</span>
              <span>Klik <strong className="text-red-400">STOP</strong> saat selesai</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyber-cyan font-bold">5.</span>
              <span>Tunggu proses <strong className="text-yellow-400">encoding ke MP3</strong> (beberapa detik)</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyber-cyan font-bold">6.</span>
              <span>Klik <strong className="text-cyber-cyan">PLAY</strong> untuk mendengarkan hasil</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-cyber-cyan font-bold">7.</span>
              <span>Klik <strong className="text-cyber-pink">DOWNLOAD</strong> untuk save file MP3</span>
            </p>
          </div>

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="text-sm text-green-400">
              ✓ <strong>Chrome Support:</strong> Component ini dioptimalkan untuk Google Chrome dan browser modern lainnya
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Scroll ke bawah dan lihat tombol floating di kanan bawah 👇</p>
        </div>
      </div>

      {/* Komponen Recording MP3 */}
      <RecordingControlsButtonMP3 
        downloadFileName="test-recording.mp3"
        showHelp={true}
      />
    </div>
  );
}
