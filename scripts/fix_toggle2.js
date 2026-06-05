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

  const lines = content.split('\\n');
  const newLines = [];
  let inToggle = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('const toggleIpaBySection = ')) {
      inToggle = true;
      continue;
    }
    if (inToggle && line.trim() === '};' && lines[i-1] && lines[i-1].includes('}));')) {
      inToggle = false;
      continue;
    }
    if (inToggle) {
      continue;
    }
    newLines.push(line);
  }

  fs.writeFileSync(filePath, newLines.join('\\n'));
  console.log('Fixed', path.basename(filePath));
}
