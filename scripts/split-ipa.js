const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'lib', 'dictionary');
const files = fs.readdirSync(dir).filter(f => /^[a-z]\.ts$/.test(f));

files.forEach(file => {
  const p = path.join(dir, file);
  let s = fs.readFileSync(p, 'utf8');
  const before = s;
  // Replace ipa: '...'
  s = s.replace(/ipa:\s*('(?:\\'|[^'])*')/g, "ipa_us: $1, ipa_uk: $1");
  if (s !== before) {
    fs.writeFileSync(p, s, 'utf8');
    console.log('Updated', file);
  }
});
console.log('Done');
