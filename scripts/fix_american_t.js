const fs = require('fs');
const path = require('path');

const files = [
  'c:\\Belajar\\sample1\\learning_english_geuwat\\member-app\\app\\skill\\pronunciation\\american-t\\beginning\\clear-t\\page.tsx',
  'c:\\Belajar\\sample1\\learning_english_geuwat\\member-app\\app\\skill\\pronunciation\\american-t\\ending\\clear-t-ending\\page.tsx',
  'c:\\Belajar\\sample1\\learning_english_geuwat\\member-app\\app\\skill\\pronunciation\\american-t\\ending\\final-t\\page.tsx',
  'c:\\Belajar\\sample1\\learning_english_geuwat\\member-app\\app\\skill\\pronunciation\\american-t\\middle\\flap\\page.tsx',
  'c:\\Belajar\\sample1\\learning_english_geuwat\\member-app\\app\\skill\\pronunciation\\american-t\\middle\\glottal\\page.tsx',
  'c:\\Belajar\\sample1\\learning_english_geuwat\\member-app\\app\\skill\\pronunciation\\american-t\\middle\\silent-t\\page.tsx',
];

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace state
  const stateRegex = /const \[showIpaBySection, setShowIpaBySection\] = useState<Record<IpaSectionId, boolean>>\(\{[\s\S]*?\}\);/;
  content = content.replace(stateRegex, 'const [showIpa, setShowIpa] = useState(true);');

  // 2. Remove toggle function
  const toggleRegex1 = /const toggleIpaBySection = \(section: IpaSectionId\) => \{[\s\S]*?\}\);[\s\n]*\};/;
  const toggleRegex2 = /const toggleIpaBySection = \(sectionId: IpaSectionId\) => \{[\s\S]*?\}\);[\s\n]*\};/;
  content = content.replace(toggleRegex1, '');
  content = content.replace(toggleRegex2, '');

  // 3. Replace variable usage
  content = content.replace(/showIpaBySection\.([a-zA-Z0-9_]+)/g, 'showIpa');
  content = content.replace(/showIpaBySection\['([^']+)'\]/g, 'showIpa');
  // Handle some formatting edge cases like `showIpaBySection['word-bank-50']` etc
  content = content.replace(/showIpaBySection\["([^"]+)"\]/g, 'showIpa');

  // 4. Reconstruct ControlCenter
  const controlCenterRegex = /<ControlCenter>([\s\S]*?)<\/ControlCenter>/;
  const controlCenterMatch = content.match(controlCenterRegex);

  if (controlCenterMatch) {
    const ccBody = controlCenterMatch[1];
    
    // Extract PlayStopButton components using regex
    const playButtonMatches = [...ccBody.matchAll(/<PlayStopButton[\s\S]*?\/>/g)];
    
    let modifiedPlayButtons = playButtonMatches.map(m => {
        let btn = m[0];
        // Remove size="sm"
        btn = btn.replace(/[\s\n]*size="sm"/, '');
        // Remove className="mb-2 sm:mb-3"
        btn = btn.replace(/[\s\n]*className="mb-2 sm:mb-3"/, '');
        // format nicely (4 spaces)
        return btn.replace(/^/gm, '            ');
    }).join('\n');
    modifiedPlayButtons = modifiedPlayButtons.replace(/^\s+/, '            ');

    const newControlCenter = `<ControlCenter>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block uppercase">Actions</span>
            <IpaVisibilityToggle
              checked={showIpa}
              onChange={setShowIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
            />
            <HighlightVisibilityToggle
              checked={isHighlightEnabled}
              onChange={setIsHighlightEnabled}
              color="orange"
              label="Highlight American T"
            />
          </div>

          <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
${modifiedPlayButtons}
          </div>
        </div>
      </ControlCenter>`;
    
    content = content.replace(controlCenterRegex, newControlCenter);
  }

  fs.writeFileSync(filePath, content);
  console.log('Modified', path.basename(filePath));
}
