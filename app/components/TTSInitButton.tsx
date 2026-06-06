'use client';

import { useState, useEffect } from 'react';
import { initializeTTS, isTTSInitialized as checkTTSInit } from '@/lib/tts/speech';

/**
 * TTS Initialization Button
 * Shows only on Xiaomi devices that haven't initialized TTS yet.
 * Auto-hides after successful initialization.
 */
export default function TTSInitButton() {
  const [show, setShow] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    // Check if we need to show the button
    const isXiaomi = typeof navigator !== 'undefined' && 
                     /xiaomi|mi\s|redmi|poco/i.test(navigator.userAgent);
    const needsInit = !checkTTSInit();
    
    setShow(isXiaomi && needsInit);
  }, []);

  const handleInit = async () => {
    setInitializing(true);
    try {
      const success = await initializeTTS();
      if (success) {
        console.log('[TTS Init Button] Initialization successful');
        // Hide button after 2 seconds
        setTimeout(() => setShow(false), 2000);
      } else {
        console.warn('[TTS Init Button] Initialization failed');
        setInitializing(false);
      }
    } catch (error) {
      console.error('[TTS Init Button] Error:', error);
      setInitializing(false);
    }
  };

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 9999,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '12px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>
      
      <span style={{ fontSize: '24px' }}>🔊</span>
      <div style={{ color: 'white' }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
          {initializing ? 'Activating TTS...' : 'Activate Voice'}
        </div>
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          Tap to enable text-to-speech
        </div>
      </div>
      <button
        onClick={handleInit}
        disabled={initializing}
        style={{
          background: 'white',
          color: '#667eea',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: initializing ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          opacity: initializing ? 0.7 : 1,
          animation: initializing ? 'pulse 1.5s infinite' : 'none',
        }}
      >
        {initializing ? '⏳' : 'Activate'}
      </button>
    </div>
  );
}
