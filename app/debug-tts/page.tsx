'use client';

import { useState, useEffect } from 'react';
import { getDebugInfo, speakText, stopSpeech, initializeTTS, isTTSInitialized } from '@/lib/tts/speech';

export default function DebugTTSPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [testText, setTestText] = useState('Hello world');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    async function loadDebugInfo() {
      try {
        addLog('Loading TTS debug info...');
        const info = await getDebugInfo();
        setDebugInfo(info);
        setIsInitialized(isTTSInitialized());
        addLog(`Debug info loaded. Voices: ${info.voicesCount}, Xiaomi: ${info.isXiaomi}`);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errMsg);
        addLog(`ERROR loading debug info: ${errMsg}`);
      }
    }
    loadDebugInfo();
  }, []);

  const handleInitialize = async () => {
    try {
      addLog('Initializing TTS...');
      const success = await initializeTTS();
      setIsInitialized(success);
      if (success) {
        addLog('✅ TTS initialized successfully');
        setError(null);
      } else {
        addLog('❌ TTS initialization failed');
        setError('Initialization failed - check console');
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
      addLog(`ERROR during init: ${errMsg}`);
    }
  };

  const handleSpeak = async () => {
    try {
      setIsSpeaking(true);
      setError(null);
      addLog(`Speaking: "${testText}"`);
      
      await speakText(testText, {
        contentType: 'sentence',
        preferredEnglish: 'en-US',
      });
      
      addLog('✅ Speech completed');
      setIsSpeaking(false);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
      addLog(`ERROR during speak: ${errMsg}`);
      setIsSpeaking(false);
    }
  };

  const handleStop = () => {
    stopSpeech();
    setIsSpeaking(false);
    addLog('Speech stopped by user');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🔊 TTS Debug & Diagnostics</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h2>📱 Device Information</h2>
        {debugInfo ? (
          <div>
            <p><strong>TTS Supported:</strong> {debugInfo.isSupported ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Is Xiaomi:</strong> {debugInfo.isXiaomi ? '✅ Yes (fixes applied)' : '❌ No'}</p>
            <p><strong>Is iOS:</strong> {debugInfo.isIOS ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Is Safari:</strong> {debugInfo.isSafari ? '✅ Yes' : '❌ No'}</p>
            <p><strong>TTS Initialized:</strong> {isInitialized ? '✅ Yes' : '⚠️ Not yet'}</p>
            <p><strong>Voices Available:</strong> {debugInfo.voicesCount > 0 ? `✅ ${debugInfo.voicesCount}` : '❌ 0 (PROBLEM!)'}</p>
            <details style={{ marginTop: '10px' }}>
              <summary style={{ cursor: 'pointer', color: '#007bff' }}>📱 User Agent</summary>
              <pre style={{ fontSize: '10px', overflow: 'auto', marginTop: '5px', padding: '10px', background: 'white' }}>
                {debugInfo.userAgent}
              </pre>
            </details>
          </div>
        ) : (
          <p>⏳ Loading debug info...</p>
        )}
      </div>

      {debugInfo && debugInfo.voicesCount === 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3cd', border: '2px solid #ffc107', borderRadius: '8px' }}>
          <h3>⚠️ NO VOICES DETECTED</h3>
          <p>Ini masalah serius. Kemungkinan penyebab:</p>
          <ul>
            <li>Browser tidak support TTS (coba Chrome/Firefox)</li>
            <li>MIUI browser versi lama (update browser)</li>
            <li>Permission denied (cek Settings → Apps → Permissions)</li>
            <li>System TTS engine rusak/disabled</li>
          </ul>
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h2>🎯 Initialize TTS</h2>
        <p>Beberapa Android devices butuh initialization manual. Klik tombol ini dulu sebelum test speech:</p>
        <button
          onClick={handleInitialize}
          disabled={isInitialized}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: isInitialized ? '#28a745' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isInitialized ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
          }}
        >
          {isInitialized ? '✅ Already Initialized' : '🚀 Initialize TTS Now'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f0f8ff', borderRadius: '8px' }}>
        <h2>🗣️ Test Speech</h2>
        <input
          type="text"
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="Type text to speak..."
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '10px',
            fontSize: '16px',
            border: '2px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <div>
          <button
            onClick={handleSpeak}
            disabled={isSpeaking || !testText.trim()}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              marginRight: '10px',
              background: isSpeaking ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isSpeaking || !testText.trim() ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isSpeaking ? '🔊 Speaking...' : '▶️ Speak'}
          </button>
          <button
            onClick={handleStop}
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ⏹️ Stop
          </button>
        </div>
        {error && (
          <div style={{ marginTop: '10px', padding: '12px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', border: '1px solid #f5c6cb' }}>
            <strong>❌ Error:</strong> {error}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2>📋 Console Logs</h2>
          <button
            onClick={clearLogs}
            style={{
              padding: '6px 12px',
              fontSize: '14px',
              background: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Clear Logs
          </button>
        </div>
        <div style={{
          maxHeight: '200px',
          overflow: 'auto',
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}>
          {logs.length > 0 ? (
            logs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '4px' }}>{log}</div>
            ))
          ) : (
            <div style={{ color: '#888' }}>No logs yet...</div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#fff3e0', borderRadius: '8px' }}>
        <h2>🎤 Available Voices ({debugInfo?.voicesCount || 0})</h2>
        {debugInfo && debugInfo.voices.length > 0 ? (
          <div style={{ maxHeight: '250px', overflow: 'auto', background: 'white', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}>
            {debugInfo.voices.map((voice: any, idx: number) => (
              <div key={idx} style={{ padding: '8px', borderBottom: '1px solid #eee', fontSize: '13px' }}>
                <strong style={{ color: '#007bff' }}>{voice.name}</strong>
                <span style={{ color: '#666', marginLeft: '10px' }}>({voice.lang})</span>
                {voice.default && <span style={{ color: '#28a745', marginLeft: '10px', fontWeight: 'bold' }}>⭐ DEFAULT</span>}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#dc3545', fontWeight: 'bold' }}>❌ No voices available - TTS won't work!</p>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px', border: '1px solid #b3d9ff' }}>
        <h2>📖 Troubleshooting Steps</h2>
        <ol style={{ lineHeight: '1.8' }}>
          <li><strong>Klik "Initialize TTS Now"</strong> - Wajib untuk Xiaomi!</li>
          <li><strong>Check voices count</strong> - Harus lebih dari 0</li>
          <li><strong>Ketik text dan klik "Speak"</strong></li>
          <li><strong>Lihat Console Logs</strong> di atas untuk detail</li>
          <li><strong>Jika masih tidak ada suara:</strong>
            <ul>
              <li>Cek volume device (bukan silent mode)</li>
              <li>Coba browser lain (Chrome/Firefox)</li>
              <li>Update MIUI/browser ke versi terbaru</li>
              <li>Restart device</li>
              <li>Check Settings → Apps → Browser → Permissions</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  );
}
