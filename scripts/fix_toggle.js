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

  // Match the toggleIpaBySection function exactly
  // Note: It's usually `  const toggleIpaBySection = ... { \n    setShowIpaBySection(...); \n  };`
  content = content.replace(/[\s\n]*const toggleIpaBySection = \([^)]+\) => \{[\s\S]*?setShowIpaBySection[\s\S]*?\}\);\s*\};/g, '');

  fs.writeFileSync(filePath, content);
  console.log('Fixed', path.basename(filePath));
}
