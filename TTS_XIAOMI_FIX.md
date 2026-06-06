# Perbaikan TTS untuk Perangkat Xiaomi

## Masalah
TTS (Text-to-Speech) berfungsi dengan baik di HP Oppo tetapi tidak berfungsi di HP Xiaomi.

## Penyebab Utama

### 1. **Voice Loading Delay di MIUI Browser**
- Perangkat Xiaomi dengan MIUI memiliki mekanisme lazy loading untuk voices
- Event `voiceschanged` sering terlambat atau tidak fire sama sekali
- Timeout 3 detik tidak cukup untuk perangkat Xiaomi yang lambat

### 2. **Async Cancel Behavior**
- MIUI browser memiliki implementasi `speechSynthesis.cancel()` yang asynchronous
- Delay 120ms tidak cukup, menyebabkan utterance baru langsung di-drop
- Mirip dengan Safari/iOS tetapi butuh delay lebih lama

### 3. **Utterance Timeout Pendek**
- Xiaomi dengan hardware lebih rendah membutuhkan waktu lebih lama untuk inisialisasi TTS engine
- Timeout 15 detik terlalu pendek untuk perangkat yang lambat

### 4. **Voice Names Berbeda**
- Android devices (termasuk Xiaomi) memiliki nama voice berbeda dari Windows/iOS
- Voice names seperti `en-us-x-iob-network`, `en-us-x-iol-local` tidak ada di daftar fallback

## Solusi yang Diterapkan

### 1. **Peningkatan Voice Loading (`waitForVoices`)**
```typescript
// Sebelum: timeout 3000ms, polling 300ms
export function waitForVoices(timeoutMs = 3000): Promise<void>

// Sesudah: timeout 5000ms, polling 150ms (lebih agresif)
export function waitForVoices(timeoutMs = 5000): Promise<void>
```

**Manfaat:**
- Polling 150ms (2x lebih cepat) mendeteksi voices lebih cepat
- Timeout 5 detik memberi waktu cukup untuk perangkat lambat
- Mengurangi kemungkinan TTS dipanggil sebelum voices ready

### 2. **Deteksi Xiaomi Device**
```typescript
function isXiaomi(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /xiaomi|mi\s|redmi|poco/i.test(navigator.userAgent);
}
```

**Mendeteksi:**
- Xiaomi
- Mi (Mi 11, Mi 10, dll)
- Redmi (Redmi Note, Redmi K, dll)
- Poco (sub-brand Xiaomi)

### 3. **Safe Cancel Delay untuk Xiaomi**
```typescript
// Sebelum: 120ms untuk iOS/Safari
const delayMs = isIOS() || isSafari() ? 120 : 20;

// Sesudah: 150ms untuk iOS/Safari/Xiaomi
const delayMs = isIOS() || isSafari() || isXiaomi() ? 150 : 20;
```

**Manfaat:**
- Delay 150ms memberi waktu cukup untuk MIUI browser menyelesaikan cancel
- Mencegah utterance baru langsung di-drop

### 4. **Utterance Timeout Diperpanjang**
```typescript
// Sebelum: 15 detik
const MAX_UTTERANCE_MS = 15_000;

// Sesudah: 20 detik
const MAX_UTTERANCE_MS = 20_000;
```

**Manfaat:**
- Memberi waktu lebih untuk perangkat Xiaomi yang lambat
- Mengurangi kemungkinan timeout prematur

### 5. **Retry Mechanism untuk Xiaomi**
```typescript
// Jika speech tidak start di Xiaomi, retry sekali dengan delay 300ms
if (!didSpeak && isXiaomi()) {
  console.log('[TTS] Speech did not start on Xiaomi, retrying after delay...');
  await new Promise(resolve => setTimeout(resolve, 300));
  // ... retry logic
}
```

**Manfaat:**
- Mengatasi kasus di mana utterance pertama gagal tanpa error
- Automatic recovery tanpa perlu user klik ulang
- Log di console untuk debugging

### 6. **Expanded Voice Fallback List**
Menambahkan Android/Xiaomi-specific voices:
```typescript
// Tambahan voices untuk Android/Xiaomi
'Google US English Female',
'en-US-language',
'en-us-x-iob-network',
'en-us-x-iob-local',
'en-us-x-iom-network',
'en-us-x-iom-local',
'en-us-x-iol-network',
'en-us-x-iol-local',
```

### 7. **Debug Function**
```typescript
export async function getDebugInfo()
```

Menyediakan informasi lengkap untuk troubleshooting:
- Device detection (Xiaomi/iOS/Safari)
- User agent
- Available voices count & list
- TTS support status

## Cara Testing

### **PENTING: Langkah-langkah untuk Xiaomi**

#### **Metode 1: Automatic (Recommended)**
1. Buka aplikasi di HP Xiaomi
2. **Tunggu muncul tombol "Activate Voice"** di pojok kanan bawah (floating button ungu)
3. **Klik tombol "Activate"** - ini wajib!
4. Setelah activation berhasil, tombol akan hilang otomatis
5. Coba fitur TTS (pronunciation, speaking, dll)

#### **Metode 2: Manual via Debug Page**
1. **Buka:** `http://your-app.com/debug-tts`
2. **Periksa info:**
   - "Is Xiaomi" harus ✅ Yes
   - "Voices Available" harus > 0 (bukan 0)
3. **Klik "Initialize TTS Now"** (tombol biru besar)
4. Tunggu sampai jadi ✅ "Already Initialized"
5. **Test Speech:** Ketik text → klik "▶️ Speak"
6. **Cek logs** di bagian "Console Logs"

### **Troubleshooting jika masih tidak ada suara:**
### **Troubleshooting jika masih tidak ada suara:**

#### 1. **Voices Count = 0**
Ini masalah serius! Solusi:
- **Update browser** (Chrome/Mi Browser ke versi terbaru)
- **Coba browser lain:** Install Firefox atau Edge
- **Check system TTS:** Settings → Additional Settings → Accessibility → Text-to-Speech
- **Enable Google TTS:** Download "Google Text-to-Speech" dari Play Store
- **Restart device** setelah install/update

#### 2. **Voices ada, tapi tidak ada suara**
- **Volume check:**
  - Volume device tidak silent/vibrate
  - Media volume (bukan ringtone) harus nyala
  - Test dengan YouTube dulu, pastikan speaker berfungsi
  
- **Permissions:**
  - Settings → Apps → [Your Browser] → Permissions
  - Enable: Microphone (kadang diperlukan untuk TTS)
  
- **Clear browser data:**
  - Settings → Apps → [Your Browser] → Storage → Clear Cache
  - JANGAN clear data (akan logout dari semua situs)

#### 3. **Initialization gagal**
- **Klik Initialize 2-3 kali** (dengan jeda 2 detik)
- **Refresh page** dan coba lagi
- **Test di browser console:**
  ```javascript
  // Buka DevTools (F12), paste di console:
  const u = new SpeechSynthesisUtterance('test');
  speechSynthesis.speak(u);
  ```
  - Jika ini berfungsi → masalah di kode kita
  - Jika tidak berfungsi → masalah di browser/system

#### 4. **Log Console Messages**

**Log NORMAL (TTS berfungsi):**
```
[TTS Init] Voices available: 5
[TTS Init] Success
[TTS] Auto-initializing for Xiaomi device...
[TTS] Speech started: Hello world
```

**Log BERMASALAH:**
```
[TTS Init] No voices available after waiting
❌ Voices count = 0 → Install Google TTS dari Play Store

[TTS] SpeechSynthesisErrorEvent: not-allowed
❌ Permission denied → Check browser permissions

[TTS] Speech did not start on Xiaomi, retrying...
⚠️ Engine lambat → Normal, akan auto-retry
```

---```
[TTS] Speech started: Hello world
```

Log jika retry:
```
[TTS] Speech did not start on Xiaomi, retrying after delay...
[TTS] Retry speech started successfully
```

## Perangkat yang Ditest

### ✅ **Seharusnya Berfungsi:**
- HP Oppo (confirmed working)
- HP Xiaomi/Redmi/Poco dengan MIUI (target fix)
- iPhone/iPad dengan Safari
- Android devices lain (Samsung, Vivo, dll)
- Desktop Chrome/Edge/Firefox

### ⚠️ **Perlu Dicoba:**
- Xiaomi dengan MIUI versi lama (<12)
- Poco F-series dengan custom ROM
- Redmi Note series

## Debugging Tips

Jika TTS masih tidak berfungsi di Xiaomi:

1. **Cek Browser Console**
   ```javascript
   // Di browser console Xiaomi:
   window.speechSynthesis.getVoices()
   ```
   - Jika return array kosong → voices tidak di-load
   - Jika ada voices → masalah di tempat lain

2. **Test Manual**
   ```javascript
   // Di browser console:
   const u = new SpeechSynthesisUtterance('hello');
   speechSynthesis.speak(u);
   ```
   - Jika ini tidak berfungsi → masalah di browser/OS level
   - Jika berfungsi → masalah di kode kita

3. **Cek Permissions**
   - Beberapa Xiaomi butuh permission microphone untuk TTS
   - Settings → Apps → Your App → Permissions → Microphone

4. **Cek Browser Version**
   - Update ke Chrome/Mi Browser versi terbaru
   - Coba browser lain (Firefox, Edge) sebagai comparison

## Next Steps (Jika Masih Bermasalah)

### Option A: Add User Interaction Trigger
Beberapa browser Android butuh user interaction sebelum TTS berfungsi:
```typescript
// Tambahkan button "Enable TTS" yang harus diklik user pertama kali
async function initializeTTS() {
  const u = new SpeechSynthesisUtterance('');
  speechSynthesis.speak(u);
  speechSynthesis.cancel();
}
```

### Option B: Use Alternative TTS API
Jika Web Speech API tidak reliable di Xiaomi:
- Google Cloud Text-to-Speech API (berbayar)
- Amazon Polly (berbayar)
- Responsive Voice JS (freemium)

### Option C: Audio Pregeneration
Generate audio files untuk kata-kata umum:
- Pre-record dengan TTS service
- Host as static MP3 files
- Fallback ke audio files jika Web Speech API fail

## Summary

**Perubahan utama:**
1. ✅ Timeout voice loading: 3s → 5s
2. ✅ Polling interval: 300ms → 150ms
3. ✅ Cancel delay untuk Xiaomi: +150ms
4. ✅ Utterance timeout: 15s → 20s
5. ✅ Retry mechanism untuk Xiaomi
6. ✅ Expanded Android voice names
7. ✅ Debug function & page

**Testing:**
- Akses `/debug-tts` untuk diagnostics
- Check console logs untuk troubleshooting
- Share debug info jika masih ada masalah

**Expected Result:**
TTS sekarang seharusnya berfungsi di Xiaomi dengan sama baiknya seperti di Oppo.
