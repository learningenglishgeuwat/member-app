const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'lib', 'dictionary');
const files = fs.readdirSync(dir).filter(f => /^[a-z]\.ts$/.test(f));

files.forEach(file => {
  const p = path.join(dir, file);
  let s = fs.readFileSync(p, 'utf8');
  const before = s;
  // Remove `, category: 'something'` occurrences
  s = s.replace(/,\s*category:\s*'[^']*'/g, '');
  if (s !== before) {
    fs.writeFileSync(p, s, 'utf8');
    console.log('Updated', file);
  }
});
console.log('Done');
