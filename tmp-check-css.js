const fs = require('fs');
const path = require('path');
const css = fs.readFileSync(path.join('app','skill','pronunciation','alphabet','alphabet.css'),'utf8');
const files = ['app/skill/pronunciation/alphabet/page.tsx','app/skill/pronunciation/alphabet/LetterCard.tsx'];
const text = files.map(f => fs.readFileSync(path.join(...f.split('/')), 'utf8')).join('\n');
const re = /\.([a-zA-Z0-9_-]+)/g;
const cssClasses = new Set();
let m;
while ((m = re.exec(css))) {
  cssClasses.add(m[1]);
}
const used = new Set();
for (const cls of cssClasses) {
  if (text.includes(cls)) used.add(cls);
}
const unused = [...cssClasses].filter(c => !used.has(c));
console.log('classes count', cssClasses.size);
console.log('unused');
unused.sort().forEach(c => console.log(c));
