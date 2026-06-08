# RecordingControlsButtonMP3

Panel recording yang menghasilkan file audio dalam format **MP3** (bukan WAV).

## 🎯 Alur Proses

```
Suara Kamu → [Mic] → Raw PCM → [lamejs Encoder] → MP3 File
```

## 🚀 Quick Start

### Installation
```bash
npm install @breezystack/lamejs
```

### Usage
```typescript
import dynamic from 'next/dynamic';

const RecordingControlsButtonMP3 = dynamic(
  () => import('../skill/components/RecordingControlsButtonMP3'),
  { ssr: false }
);

export default function MyPage() {
  return (
    <div>
      <RecordingControlsButtonMP3 
        downloadFileName="my-recording.mp3"
        showHelp={true}
      />
    </div>
  );
}
```

## 📊 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `downloadFileName` | `string` | `'GEUWAT-recording.mp3'` | Nama file untuk download |
| `className` | `string` | `''` | Additional CSS classes |
| `showHelp` | `boolean` | `true` | Tampilkan tombol help |

## 🎵 MP3 Output Specs

- **Format:** MP3 (MPEG-1 Audio Layer 3)
- **Channels:** Mono (1 channel)
- **Bitrate:** 128 kbps
- **Sample Rate:** Auto (dari source)
- **File Size:** ~960 KB per menit

## ✨ Features

- ✅ Recording audio dari microphone
- ✅ Automatic MP3 encoding di browser
- ✅ Playback preview before download
- ✅ Smaller file size vs WAV (~10x smaller)
- ✅ Compatible dengan semua AI assistants
- ✅ Professional cyberpunk UI design
- ✅ Mobile responsive

## 🌐 Browser Support

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari (latest)

Requires: HTTPS atau localhost

## 🧪 Testing

Test page: `http://localhost:3001/test-mp3-recording`

## 📚 Documentation

Full documentation: `/documentation/MP3_RECORDING_IMPLEMENTATION.md`

## 🔄 Comparison vs WAV

| Feature | WAV | MP3 |
|---------|-----|-----|
| Size (1 min) | ~10 MB | ~1 MB |
| Quality | Lossless | Lossy (128 kbps) |
| Upload Speed | Slow | Fast |
| Processing | None | Encoding |

## 💡 Usage Tips

1. Pastikan menggunakan HTTPS atau localhost
2. Allow microphone permission
3. Bicara dengan jelas ke mikrofon
4. Tunggu proses encoding selesai (1-3 detik)
5. Test playback sebelum download

## 🛠️ Technologies

- **MediaRecorder API** - Capture audio
- **AudioContext API** - Decode audio
- **lamejs** - MP3 encoder
- **Web Audio API** - Process PCM data

## 📦 Dependencies

```json
{
  "@breezystack/lamejs": "^1.2.8"
}
```

## 🎨 UI States

- **INIT_REC** - Ready to record (cyan)
- **REC_ON** - Recording active (red, pulsing)
- **ENCODING** - Converting to MP3 (yellow)
- **Ready** - MP3 ready for playback/download

## 🐛 Troubleshooting

### No mic permission
→ Check browser settings, ensure HTTPS

### Encoding slow
→ Reduce recording length, close other tabs

### Poor quality
→ Check mic input level, reduce noise

### Download fails
→ Check browser download settings

## 📝 License

MIT License - Based on LAME encoder
