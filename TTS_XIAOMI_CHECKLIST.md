# ✅ TTS Xiaomi Quick Fix Checklist

## Untuk User Xiaomi yang TTS Tidak Berfungsi

### 🚨 **LANGKAH WAJIB (HARUS DILAKUKAN!):**

#### ☑️ Step 1: Klik Tombol "Activate Voice"
- [ ] Buka app di HP Xiaomi
- [ ] Tunggu muncul **tombol ungu "Activate Voice"** di pojok kanan bawah
- [ ] **KLIK tombol tersebut** (jangan skip!)
- [ ] Tunggu sampai tombol hilang (artinya sudah aktif)

#### ☑️ Step 2: Install Google Text-to-Speech
- [ ] Buka **Play Store**
- [ ] Cari **"Google Text-to-Speech"**
- [ ] Install / Update ke versi terbaru
- [ ] Buka Settings → Additional Settings → Accessibility → Text-to-Speech
- [ ] Pastikan **"Google Text-to-Speech Engine"** adalah default

#### ☑️ Step 3: Check Volume
- [ ] Pastikan HP **TIDAK** dalam mode silent/vibrate
- [ ] Volume **Media** (bukan ringtone!) harus nyala
- [ ] Test speaker dengan YouTube/music dulu

---

### 🔧 **JIKA MASIH BELUM BERFUNGSI:**

#### Option A: Update Browser
- [ ] Buka Play Store
- [ ] Update **Chrome** atau **Mi Browser** ke versi terbaru
- [ ] Restart browser setelah update
- [ ] Coba lagi

#### Option B: Clear Cache
- [ ] Settings → Apps → [Browser Anda]
- [ ] Storage → **Clear Cache** (jangan "Clear Data"!)
- [ ] Restart browser
- [ ] Login kembali ke app

#### Option C: Ganti Browser
- [ ] Install **Firefox** atau **Edge** dari Play Store
- [ ] Buka app dengan browser baru
- [ ] Klik "Activate Voice" lagi

#### Option D: Restart Device
- [ ] **Restart HP** (turn off → turn on)
- [ ] Buka app lagi
- [ ] Klik "Activate Voice" lagi

---

### 🧪 **TEST DI DEBUG PAGE:**

1. Buka: **`/debug-tts`** di browser
2. Check info:
   - ✅ **"Is Xiaomi"** = Yes
   - ✅ **"Voices Available"** = lebih dari 0 (bukan 0!)
   - ✅ **"TTS Initialized"** = Yes
3. Klik **"Initialize TTS Now"** (tombol biru)
4. Ketik text → Klik **"▶️ Speak"**
5. **Harus ada suara!**

---

### ❌ **MASALAH UMUM & SOLUSI:**

| Masalah | Penyebab | Solusi |
|---------|----------|--------|
| **Voices = 0** | Google TTS tidak terinstall | Install "Google Text-to-Speech" dari Play Store |
| **No Sound** | Volume media muted | Check volume Media (bukan ringtone) |
| **Not Allowed Error** | Browser permission denied | Settings → Apps → Browser → Permissions → Enable Microphone |
| **Initialization Failed** | Browser cache corrupt | Clear cache atau ganti browser |
| **Tombol Activate tidak muncul** | Bukan device Xiaomi/Redmi/Poco | Manual init di `/debug-tts` |

---

### 📱 **COMPATIBLE DEVICES:**

✅ **Tested & Working:**
- Xiaomi (Mi series)
- Redmi (Note, K, dll)
- Poco (F series, X series)
- MIUI 12, 13, 14, HyperOS

⚠️ **May Need Extra Steps:**
- MIUI versi lama (<12)
- Custom ROM (non-official MIUI)

---

### 🆘 **STILL NOT WORKING?**

Jika sudah coba semua langkah di atas dan masih tidak berfungsi:

1. **Screenshot hasil dari `/debug-tts`** (semua section)
2. **Buka browser console** (3 titik → More Tools → Developer Tools → Console)
3. **Screenshot console logs** setelah klik "Speak"
4. **Kirim info:**
   - Model HP: ____________
   - MIUI version: ____________
   - Browser & version: ____________
   - Screenshot debug page
   - Screenshot console logs

---

## 💡 **WHY THIS HAPPENS?**

MIUI browser memiliki implementasi Web Speech API yang berbeda:
- Voice loading lebih lambat
- Butuh user interaction (klik) untuk activate
- Cancel/resume behavior berbeda dari browser lain
- Kadang perlu "dummy" utterance untuk "wake up" engine

Fix yang sudah diterapkan:
- ✅ Auto-detect Xiaomi devices
- ✅ Longer timeout (5s untuk voices, 20s untuk speech)
- ✅ Faster polling (150ms)
- ✅ Auto-retry mechanism
- ✅ Force resume paused speech
- ✅ Initialization button yang muncul otomatis
- ✅ Debug page untuk diagnostics

---

**Last Updated:** 2026-06-06
