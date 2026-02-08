'use client'

import React, { useEffect, useRef, useState } from 'react';
import { Circle, Mic, MicOff, Play, HelpCircle, Download, ChevronUp } from 'lucide-react';

interface RecordingControlsButtonProps {
  downloadFileName?: string;
  className?: string;
  showHelp?: boolean;
}

const RecordingControlsButton: React.FC<RecordingControlsButtonProps> = ({
  downloadFileName = 'GEUWAT-recording.wav',
  className = '',
  showHelp = true
}) => {
  const [showControlDeck, setShowControlDeck] = useState(false);
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      setErrorMessage(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setErrorMessage('Microphone not supported on this device/browser.');
        return;
      }
      if (typeof window !== 'undefined' && !window.isSecureContext) {
        setErrorMessage('Mic permission requires HTTPS or localhost.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudio(audioUrl);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setErrorMessage('Microphone permission denied or unavailable.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handlePlayRecording = () => {
    if (recordedAudio) {
      const audio = new Audio(recordedAudio);
      audio.play();
    }
  };

  const handleDownload = () => {
    if (recordedAudio) {
      const a = document.createElement('a');
      a.href = recordedAudio;
      a.download = downloadFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <>
      {!showControlDeck && (
        <button
          onClick={() => setShowControlDeck(true)}
          className={`fixed bottom-6 right-6 z-40 w-14 h-14 md:w-16 md:h-16 bg-cyber-cyan/90 backdrop-blur-sm border-2 border-cyber-cyan rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(190,41,236,0.4)] hover:bg-cyber-cyan hover:shadow-[0_0_40px_rgba(190,41,236,0.6)] transition-all duration-300 group ${className}`}
          title="Open Recording Controls"
        >
          <Circle className="text-white group-hover:scale-110 transition-transform" size={24} />
        </button>
      )}

      {showControlDeck && (
        <div className="fixed bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
          <div className="relative bg-[#050a10]/95 backdrop-blur-xl border border-cyber-cyan/40 rounded-3xl p-4 md:p-6 shadow-[0_0_50px_rgba(190,41,236,0.2)] overflow-hidden">
            <button
              onClick={() => setShowControlDeck(false)}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-cyber-pink/20 border border-cyber-pink/50 rounded-full flex items-center justify-center hover:bg-cyber-pink/30 transition-colors"
              title="Close Control Panel"
            >
              <ChevronUp className="text-cyber-pink rotate-180" size={16} />
            </button>

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-32 h-1 bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent"></div>

            <div className="flex items-center justify-between gap-3 md:gap-6 overflow-x-auto scrollbar-hide">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  className={`relative w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full border-2 transition-all duration-300 group ${
                    isRecording 
                      ? 'border-red-500 bg-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.6)] animate-pulse' 
                      : 'border-cyber-cyan bg-cyber-cyan/5 hover:bg-cyber-cyan/10 hover:shadow-[0_0_20px_rgba(190,41,236,0.3)]'
                  }`}
                >
                  {isRecording ? (
                    <MicOff size={20} className="text-red-500 fill-current md:w-6 md:h-6" />
                  ) : (
                    <Mic size={24} className="text-cyber-cyan group-hover:scale-110 transition-transform md:w-7 md:h-7" />
                  )}

                  {isRecording && (
                    <div className="absolute inset-[-4px] border border-red-500/30 rounded-full border-t-red-500 animate-spin"></div>
                  )}
                </button>
                <span className={`text-[8px] md:text-[10px] font-mono font-bold tracking-widest ${isRecording ? 'text-red-500' : 'text-cyber-cyan/70'}`}>
                  {isRecording ? 'REC_ON' : 'INIT_REC'}
                </span>
              </div>

              <div className="w-px h-10 md:h-12 bg-white/10 flex-shrink-0"></div>

              <div className="flex items-center gap-2 md:gap-3 flex-1 justify-center">
                <button 
                  onClick={handlePlayRecording}
                  disabled={!recordedAudio}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl border bg-cyber-slate/50 backdrop-blur-sm transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-600 disabled:shadow-none disabled:bg-transparent border-cyber-cyan/30 text-cyber-cyan hover:bg-cyber-cyan/10 hover:border-cyber-cyan hover:shadow-[0_0_15px_rgba(190,41,236,0.2)]"
                >
                  <Play size={18} className="ml-0.5 md:w-5 md:h-5" />
                </button>

                {showHelp && (
                  <button 
                    onClick={() => setShowHelpPopup(true)}
                    className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl border bg-cyber-slate/50 backdrop-blur-sm transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-600 disabled:shadow-none disabled:bg-transparent border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/10 hover:border-cyber-pink hover:shadow-[0_0_15px_rgba(255,0,255,0.2)]"
                  >
                    <HelpCircle size={18} className="md:w-5 md:h-5" />
                  </button>
                )}

                <button 
                  onClick={handleDownload}
                  disabled={!recordedAudio}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl border bg-cyber-slate/50 backdrop-blur-sm transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-600 disabled:shadow-none disabled:bg-transparent border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/10 hover:border-cyber-pink hover:shadow-[0_0_15px_rgba(255,0,255,0.2)]"
                >
                  <Download size={16} className="md:w-5 md:h-5" />
                </button>

                <button 
                  onClick={() => setRecordedAudio(null)}
                  disabled={!recordedAudio}
                  className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl border bg-cyber-slate/50 backdrop-blur-sm transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:border-gray-800 disabled:text-gray-600 disabled:shadow-none disabled:bg-transparent border-cyber-pink/30 text-cyber-pink hover:bg-cyber-pink/10 hover:border-cyber-pink hover:shadow-[0_0_15px_rgba(255,0,255,0.2)]"
                >
                  <span className="text-[8px] md:text-[9px] font-mono font-bold tracking-wider opacity-70 disabled:text-gray-600">RESET</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-3 text-center text-[10px] md:text-xs text-red-400">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      )}

      {showHelp && showHelpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHelpPopup(false)}
          />
          
          <div className="relative bg-[#0a0f1c] border border-cyber-cyan/40 rounded-2xl p-4 sm:p-6 max-w-[90vw] sm:max-w-md max-h-[80vh] overflow-y-auto w-full shadow-[0_0_50px_rgba(190,41,236,0.3)] mx-4 sm:mx-auto text-sm sm:text-[15px] leading-6 sm:leading-7">
            <button
              onClick={() => setShowHelpPopup(false)}
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
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-bold w-5 text-right">1.</span>
                <p className="flex-1">Klik tombol <span className="text-cyber-pink font-semibold">REC_ON</span> untuk memulai perekaman</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-bold w-5 text-right">2.</span>
                <p className="flex-1">Bicara dengan jelas ke mikrofon</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-bold w-5 text-right">3.</span>
                <p className="flex-1">Klik tombol <span className="text-red-400 font-semibold">STOP</span> saat selesai</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-bold w-5 text-right">4.</span>
                <p className="flex-1">Klik tombol <span className="text-cyber-cyan font-semibold">PLAY</span> untuk mendengarkan rekaman</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-bold w-5 text-right">5.</span>
                <p className="flex-1">Klik tombol <span className="text-cyber-pink font-semibold">DOWNLOAD</span> untuk menyimpan audio</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-bold w-5 text-right">6.</span>
                <p className="flex-1">Setelah selesai, unduh file audio dan simpan di pc/android Anda.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-cyber-cyan font-bold w-5 text-right">7.</span>
                <p className="flex-1">Isi <span className="text-cyber-pink font-semibold">saved progress</span> berdasarkan hasil penilaian dari AI assistant</p>
              </div>
              <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
                <p className="text-sm text-cyber-cyan mb-2">
                  <strong>Langkah Selanjutnya:</strong> Buka halaman <a href="https://gemini.google.com/app" target="_blank" rel="noopener noreferrer" className="text-cyber-pink hover:text-cyber-pink/80 underline transition-colors">https://gemini.google.com/app</a> atau AI assistant lainnya
                </p>
                <p className="text-sm text-cyber-cyan mb-2">
                  Upload rekaman audio Anda
                </p>
                <div className="text-sm text-cyber-cyan flex items-center gap-2">
                  <strong className="flex-1">Gunakan prompt berikut:</strong>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('"Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 1. Transkripsikan semua kata yang saya ucapkan dalam rekaman ini. 2. Analisis setiap kata tersebut dengan fokus pada American Accent (General American). Nilai dan beri umpan balik pada pengucapan vokal dan konsonan. 3. Format Output: Sajikan hasil analisis dalam bentuk tabel dengan tiga kolom: - Kolom 1: Kata yang diucapkan. - Kolom 2: Status Kualitatif (\'🟢 Sangat bagus 🔵Bagus\', \'🟡 Perlu Sedikit Perbaikan\', atau \'🔴 Perlu Perbaikan\'). - Kolom 3: Umpan Balik spesifik yang menjelaskan secara singkat apa yang perlu diperbaiki."');
                      if (typeof window !== 'undefined') {
                        const toast = document.createElement('div');
                        toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-gray-900 to-black border border-cyan-400/30 text-cyan-300 px-4 py-2 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.8),0_0_50px_rgba(190,41,236,0.4)] z-[60] transition-all duration-300 transform translate-x-full backdrop-blur-sm';
                        toast.innerHTML = '<span class="flex items-center"><span class="mr-2 text-cyan-400">📋</span> Prompt berhasil disalin!</span>';
                        document.body.appendChild(toast);
                        
                        setTimeout(() => {
                          toast.classList.remove('translate-x-full');
                        }, 100);
                        
                        setTimeout(() => {
                          toast.classList.add('translate-x-full');
                          setTimeout(() => {
                            if (document.body.contains(toast)) {
                              document.body.removeChild(toast);
                            }
                          }, 300);
                        }, 3000);
                      }
                    }}
                    className="p-1 bg-cyber-pink/20 hover:bg-cyber-pink/30 rounded transition-colors group ml-auto"
                    title="Salin prompt"
                  >
                    <svg className="w-4 h-4 text-cyber-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2zm-2-6h12v8H6V6z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 3H9v6h6V3z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-2 p-2 bg-black/30 rounded text-xs text-gray-300 font-mono max-h-32 overflow-y-auto relative">
                  &quot;Saya telah mengunggah rekaman audio. Saya ingin Anda bertindak sebagai penilai aksen bahasa Inggris profesional. 
                  1. Transkripsikan semua kata yang saya ucapkan dalam rekaman ini.
                  2. Analisis setiap kata tersebut dengan fokus pada American Accent (General American). Nilai dan beri umpan balik pada pengucapan vokal dan konsonan.
                  3. Format Output: Sajikan hasil analisis dalam bentuk tabel dengan tiga kolom:
                     - Kolom 1: Kata yang diucapkan.
                     - Kolom 2: Status Kualitatif (&apos;🟢 Sangat bagus 🔵Bagus&apos;, &apos;🟡 Perlu Sedikit Perbaikan&apos;, atau &apos;🔴 Perlu Perbaikan&apos;).
                     - Kolom 3: Umpan Balik spesifik yang menjelaskan secara singkat apa yang perlu diperbaiki.&quot;
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
              <p className="text-sm text-cyber-cyan">
                <strong>Tip:</strong> Pastikan mikrofon Anda bekerja dengan baik dan berbicara dengan volume yang cukup.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RecordingControlsButton;
