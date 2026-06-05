const fs = require('fs');
const glob = require('glob');
const path = require('path');

const files = glob.sync('app/skill/pronunciation/**/*.{tsx,jsx}', { cwd: __dirname });
let changedFiles = 0;

files.forEach((file) => {
  const fullPath = path.join(__dirname, file);
  let content = fs.readFileSync(fullPath, 'utf-8');

  // Skip if already has topControls or bottomControls
  if (content.includes('topControls=') || content.includes('bottomControls=')) {
    return;
  }

  const regex = /<ControlCenter>([\s\S]*?)<\/ControlCenter>/g;
  let changed = false;

  const newContent = content.replace(regex, (match, childrenStr) => {
    // If it's empty, leave it
    if (!childrenStr.trim()) return match;

    // We will find the boundary. Usually we have a div wrap, but sometimes it's direct.
    // Actually, many files wrap children in `<div className="flex flex-col gap-3">...</div>`
    // If we can just move the contents... wait, we need to split it by `IpaVisibilityToggle`, `Toggle` vs `PlayStopButton`.
    
    // Instead of parsing, let's just use `<ControlCenter topControls={<>...toggles...</>} bottomControls={<>...play buttons...</>}>`
    
    // It's safer to just let me manually update the files or use a simpler split:
    // we can split by `<PlayStopButton`
    return match; // Disabled replacement in script for now
  });

  if (changed) {
    fs.writeFileSync(fullPath, newContent);
    changedFiles++;
  }
});

console.log('Changed', changedFiles, 'files.');
