# TTS (Text-to-Speech) Module

Modular Text-to-Speech engine for English learning with cross-browser and cross-device support.

## 📁 Structure

```
lib/tts/
├── speech.ts              # Main entry point (backward compatibility)
├── index.ts               # Barrel export (alternative entry)
├── types.ts               # TypeScript type definitions
├── device-detection.ts    # Browser & device detection utilities
├── rate-config.ts         # Speech rate configuration per content type
├── preprocessing.ts       # Text preprocessing before synthesis
├── voice-selection.ts     # Voice picker with quality prioritization
├── voice-loading.ts       # Voice initialization & loading
├── utterance.ts           # SpeechSynthesisUtterance creation
├── speak.ts               # Main speech synthesis functions
├── debug.ts               # Debug & diagnostic utilities
└── speech.backup.ts       # Original monolithic file (for reference)
```

## 🚀 Usage

### Basic Usage

```typescript
import { speakText, speakWord, speakSentence } from '@/lib/tts/speech';

// Speak with default settings
await speakText('Hello world');

// Speak with content type
await speakWord('pronunciation');
await speakSentence('This is a complete sentence.');
```

### Content Types

The module supports specialized speech rates for different content types:

```typescript
import { 
  speakLetter,      // Single character (slowest)
  speakWord,        // Single word
  speakSuffix,      // -s/es, -d/ed endings
  speakAmericanT,   // American T (flap/tap)
  speakLinking,     // Linking words
  speakContraction, // don't, I'm, etc.
  speakPhrase,      // Short phrase
  speakSentence,    // Full sentence
  speakStressing,   // Word with stress emphasis
  speakIntonation   // Sentence with intonation pattern
} from '@/lib/tts/speech';

await speakLetter('T');
await speakAmericanT('water');
await speakContraction("don't");
```

### Advanced Options

```typescript
import { speakText } from '@/lib/tts/speech';
import type { SpeakOptions } from '@/lib/tts/speech';

const options: SpeakOptions = {
  lang: 'en-US',
  preferredEnglish: 'en-US', // or 'en-GB'
  contentType: 'word',
  rate: 0.8,
  pitch: 1.0,
  volume: 1.0,
  cancelBeforeSpeak: true
};

await speakText('Hello', options);
```

### Voice Management

```typescript
import { 
  waitForVoices, 
  initializeTTS, 
  isTTSInitialized,
  pickPreferredEnglishVoice
} from '@/lib/tts/speech';

// Wait for voices to load
await waitForVoices();

// Initialize TTS (required on some Android devices)
const initialized = await initializeTTS();

// Check initialization status
if (isTTSInitialized()) {
  console.log('TTS is ready');
}

// Pick best English voice
const voices = window.speechSynthesis.getVoices();
const voice = pickPreferredEnglishVoice(voices, 'en-US');
```

### Global Playback Speed

```typescript
import { 
  getGlobalPlaybackSpeed, 
  setGlobalPlaybackSpeed 
} from '@/lib/tts/speech';

// Get current speed (default: 1.0)
const speed = getGlobalPlaybackSpeed();

// Set global speed multiplier (affects all content types)
setGlobalPlaybackSpeed(1.5); // 1.5x speed
```

### Device Detection

```typescript
import { 
  isXiaomi, 
  isIOS, 
  isSafari,
  isSpeechSynthesisSupported 
} from '@/lib/tts/speech';

if (isXiaomi()) {
  console.log('Running on Xiaomi device - using retry logic');
}

if (!isSpeechSynthesisSupported()) {
  console.log('Speech synthesis not supported');
}
```

### Debug Information

```typescript
import { getDebugInfo } from '@/lib/tts/speech';

const info = await getDebugInfo();
console.log('User Agent:', info.userAgent);
console.log('Available voices:', info.voicesCount);
console.log('Is Xiaomi:', info.isXiaomi);
console.log('Voices:', info.voices);
```

### Stop Speech

```typescript
import { stopSpeech } from '@/lib/tts/speech';

// Stop all ongoing speech
stopSpeech();
```

## 📋 Content Type Rates

Default speech rates per content type (can be overridden with global speed):

| Content Type   | Rate | Use Case                        |
|---------------|------|---------------------------------|
| letter        | 0.7  | Single character                |
| suffix        | 0.75 | -s/es, -d/ed endings            |
| americanT     | 0.75 | American T (flap/tap)           |
| stressing     | 0.78 | Stress pattern emphasis         |
| word          | 0.82 | Single word                     |
| linking       | 0.82 | Linking sounds                  |
| contraction   | 0.85 | Contractions (don't, I'm)       |
| phrase        | 0.88 | Short phrase                    |
| intonation    | 0.9  | Intonation pattern              |
| sentence      | 0.95 | Full sentence                   |

## 🔧 Device-Specific Handling

### Xiaomi/MIUI
- Auto-initialization on first use
- Retry mechanism for failed speech
- Force resume for paused speech
- Aggressive voice loading polling (150ms intervals)

### iOS/Safari
- 150ms safe cancel delay
- Polling fallback for voice loading
- Special handling for async cancel behavior

### Chrome/Edge
- Async voice loading with `voiceschanged` event
- 20ms cancel delay (minimal)

## 🛠️ Development

### Adding New Content Types

1. Add type to `types.ts`:
```typescript
export type ContentType = 
  | 'existing'
  | 'newType';
```

2. Add rate to `rate-config.ts`:
```typescript
export const CONTENT_TYPE_RATE: Record<ContentType, number> = {
  // ...
  newType: 0.85,
};
```

3. Add preprocessing if needed in `preprocessing.ts`

4. Add convenience function in `speak.ts`:
```typescript
export const speakNewType = createSpeaker('newType');
```

### Testing

```bash
# Type check
npm run typecheck

# Run tests
npm test lib/tts
```

## 📝 Migration from Old Code

The refactored structure maintains **100% backward compatibility**. All existing imports from `@/lib/tts/speech` continue to work:

```typescript
// ✅ Still works - no changes needed
import { speakText, createUtterance, waitForVoices } from '@/lib/tts/speech';
```

Optionally, you can import from specific modules:

```typescript
// ✅ Also works - more explicit
import { speakText } from '@/lib/tts/speak';
import { createUtterance } from '@/lib/tts/utterance';
import { waitForVoices } from '@/lib/tts/voice-loading';
```

## 🎯 Benefits of Modular Structure

1. **Maintainability**: Each file has single responsibility (900 lines → 7 files ~100-150 lines each)
2. **Testability**: Isolated functions easier to unit test
3. **Reusability**: Import only what you need
4. **Readability**: Clear separation of concerns
5. **Backward Compatible**: No breaking changes to existing code

## 📦 Exports Summary

### Types
- `PreferredEnglishLang`, `ContentType`, `SpeakOptions`, `DebugInfo`

### Functions
- **Speech**: `speakText`, `speakLetter`, `speakWord`, `speakSuffix`, `speakAmericanT`, `speakLinking`, `speakContraction`, `speakPhrase`, `speakSentence`, `speakStressing`, `speakIntonation`, `stopSpeech`
- **Voice**: `waitForVoices`, `initializeTTS`, `isTTSInitialized`, `forceResumeSpeech`, `pickVoiceByLang`, `pickPreferredEnglishVoice`
- **Utterance**: `createUtterance`
- **Rate**: `getGlobalPlaybackSpeed`, `setGlobalPlaybackSpeed`, `CONTENT_TYPE_RATE`
- **Device**: `isIOS`, `isSafari`, `isXiaomi`, `isSpeechSynthesisSupported`
- **Preprocessing**: `preprocessTextForSpeech`
- **Debug**: `getDebugInfo`

---

**Original monolithic file**: `speech.backup.ts` (900+ lines)  
**Refactored structure**: 8 modular files (~100-150 lines each)
