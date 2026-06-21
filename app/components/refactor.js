const fs = require('fs');

const path = 'c:\\Belajar\\sample1\\learning_english_geuwat\\member-app\\app\\components\\MediaPipeProvider.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove from const PUBLIC_PATHS to the end of drawHandLandmarks
const topStart = content.indexOf("const PUBLIC_PATHS");
const searchStr = "    context.arc(point.x, point.y, index === 8 ? 6 : 4, 0, Math.PI * 2)\n    context.fill()\n  }\n}\n";
const topEnd = content.indexOf(searchStr);

if (topStart !== -1 && topEnd !== -1) {
  content = content.substring(0, topStart) + content.substring(topEnd + searchStr.length);
} else {
  console.log('Failed to find topStart or topEnd', topStart, topEnd);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully refactored MediaPipeProvider.tsx top part');
