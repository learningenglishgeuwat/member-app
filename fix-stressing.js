const fs = require('fs');
const file = 'app/skill/pronunciation/stressing/components/StressingLesson.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// Update INITIAL_IPA_TOGGLE_STATE
for(let i=0; i<lines.length; i++) {
  if(lines[i].includes('INITIAL_IPA_TOGGLE_STATE')) {
    let j = i;
    while(!lines[j].includes('}')) {
      lines[j] = lines[j].replace('false', 'true');
      j++;
    }
    break;
  }
}

// Map of line numbers to their respective section keys
const replacements = {
  1043: 'dasarSukuKata', // 1044 is 0-indexed 1043
  1126: 'aturanCepat',
  1179: 'tekananKata',
  1244: 'kontrasNounVerb',
  1278: 'kontrasNounVerb',
  1343: 'bankKata',
  1569: 'practice',
  1608: 'practice'
};

for (const [lineIdxStr, section] of Object.entries(replacements)) {
  const idx = parseInt(lineIdxStr);
  if (lines[idx] && lines[idx].includes('{showIpa ? (')) {
    lines[idx] = lines[idx].replace('{showIpa ? (', '{showIpaBySection.' + section + ' ? (');
  } else if (lines[idx] && lines[idx].includes('{showIpa && ipaText ? (')) {
    lines[idx] = lines[idx].replace('{showIpa && ipaText ? (', '{showIpaBySection.' + section + ' && ipaText ? (');
  }
}

// Add imports for Play and Square if missing
for(let i=0; i<lines.length; i++) {
  if(lines[i].startsWith('import { Copy') && lines[i].includes('lucide-react')) {
    if (!lines[i].includes('Square')) {
      lines[i] = lines[i].replace('Copy', 'Copy, Square, Play');
    }
    break;
  }
}

// Now replace ControlCenter
let controlCenterStart = -1;
let controlCenterEnd = -1;
for(let i=lines.length-1; i>=0; i--) {
  if (lines[i].includes('</ControlCenter>')) {
    controlCenterEnd = i;
  }
  if (lines[i].includes('<ControlCenter>')) {
    controlCenterStart = i;
    break;
  }
}

if (controlCenterStart !== -1) {
  const newControlCenter = `      <ControlCenter>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block uppercase">Actions</span>
            {isWord && (
              <>
                <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                  <button onClick={() => void playAllBySection('dasarSukuKata')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY DASAR SUKU KATA</span>
                    {activePlayAllSection === 'dasarSukuKata' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                  <IpaVisibilityToggle checked={showIpaBySection.dasarSukuKata} onChange={() => toggleIpaBySection('dasarSukuKata')} className="w-full flex justify-between text-[10px] sm:text-xs" label="IPA Dasar Suku Kata" />
                </div>
                <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                  <button onClick={() => void playAllBySection('aturanCepat')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY ATURAN CEPAT</span>
                    {activePlayAllSection === 'aturanCepat' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                  <IpaVisibilityToggle checked={showIpaBySection.aturanCepat} onChange={() => toggleIpaBySection('aturanCepat')} className="w-full flex justify-between text-[10px] sm:text-xs" label="IPA Aturan Cepat" />
                </div>
                <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                  <button onClick={() => void playAllBySection('tekananKata')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY TEKANAN KATA</span>
                    {activePlayAllSection === 'tekananKata' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                  <IpaVisibilityToggle checked={showIpaBySection.tekananKata} onChange={() => toggleIpaBySection('tekananKata')} className="w-full flex justify-between text-[10px] sm:text-xs" label="IPA Tekanan Kata" />
                </div>
                <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                  <button onClick={() => void playAllBySection('kontrasNounVerb')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY KONTRAS N & V</span>
                    {activePlayAllSection === 'kontrasNounVerb' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                  <IpaVisibilityToggle checked={showIpaBySection.kontrasNounVerb} onChange={() => toggleIpaBySection('kontrasNounVerb')} className="w-full flex justify-between text-[10px] sm:text-xs" label="IPA Kontras Noun and Verb" />
                </div>
                <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                  <button onClick={() => void playAllBySection('bankKata')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY BANK KATA</span>
                    {activePlayAllSection === 'bankKata' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                  <IpaVisibilityToggle checked={showIpaBySection.bankKata} onChange={() => toggleIpaBySection('bankKata')} className="w-full flex justify-between text-[10px] sm:text-xs" label="IPA Bank Kata" />
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => void playAllBySection('practice')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY PRACTICE</span>
                    {activePlayAllSection === 'practice' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                  <IpaVisibilityToggle checked={showIpaBySection.practice} onChange={() => toggleIpaBySection('practice')} className="w-full flex justify-between text-[10px] sm:text-xs" label="IPA Practice" />
                </div>
              </>
            )}
            {!isWord && (
              <>
                <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                  <button onClick={() => void playAllBySection('tekananKalimat')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY TEKANAN KALIMAT</span>
                    {activePlayAllSection === 'tekananKalimat' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                </div>
                <div className="flex flex-col gap-2 border-b border-white/5 pb-3">
                  <button onClick={() => void playAllBySection('kataKontenFungsi')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY KATA KONTEN & FUNGSI</span>
                    {activePlayAllSection === 'kataKontenFungsi' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => void playAllBySection('practice')} className="w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group">
                    <span className="tracking-widest font-bold">PLAY PRACTICE</span>
                    {activePlayAllSection === 'practice' ? <Square className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-cyan-400 stroke-cyan-400 text-cyan-400" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5 transition-colors fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400" />}
                  </button>
                  <IpaVisibilityToggle checked={showIpaBySection.practice} onChange={() => toggleIpaBySection('practice')} className="w-full flex justify-between text-[10px] sm:text-xs" label="IPA Practice" />
                </div>
              </>
            )}
          </div>
        </div>
      </ControlCenter>`;
  lines.splice(controlCenterStart, controlCenterEnd - controlCenterStart + 1, newControlCenter);
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Done!');
