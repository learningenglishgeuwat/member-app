const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return filelist;
      }
    }
  });
  return filelist;
};

const files = walkSync('./app').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

let totalCleaned = 0;

for (const file of files) {
  // Ignore the actual haptic library files
  if (file.includes('useHaptic') || file.includes('GlobalHaptic')) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Remove `onKeyDown={() => triggerHaptic('input')}` completely
  content = content.replace(/\s*onKeyDown=\{\(\) => triggerHaptic\('input'\)\}/g, '');
  content = content.replace(/\s*onClick=\{\(\) => triggerHaptic\('tap'\)\}/g, '');
  
  // Remove standalone `triggerHaptic('tap')` and `triggerHaptic('input')`
  // Like `triggerHaptic('tap');` or `triggerHaptic('tap')`
  content = content.replace(/\s*triggerHaptic\('tap'\)[;]?/g, '');
  content = content.replace(/\s*triggerHaptic\('input'\)[;]?/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Cleaned:', file);
    totalCleaned++;
  }
}

console.log('Total files cleaned:', totalCleaned);
