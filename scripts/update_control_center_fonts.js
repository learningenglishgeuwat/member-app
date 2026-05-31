const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Belajar/sample1/learning_english_geuwat/member-app/app/skill/pronunciation');
files.push('c:/Belajar/sample1/learning_english_geuwat/member-app/app/skill/vocabulary/components/VocabularyTopicDetailPage.tsx');

const searchBtn = 'px-4 py-3 font-mono text-xs uppercase rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group mb-3';
const replaceBtn = 'px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group mb-2 sm:mb-3';

const searchIcon = 'w-4 h-4 transition-colors';
const replaceIcon = 'w-3 h-3 sm:w-4 sm:h-4 transition-colors';

const searchLabel = 'text-[10px] tracking-widest text-cyan-400/80 block mb-2 uppercase';
const replaceLabel = 'text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block mb-1.5 sm:mb-2 uppercase';

let updatedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (content.includes(searchBtn)) {
    content = content.split(searchBtn).join(replaceBtn);
  }
  if (content.includes(searchIcon)) {
    content = content.split(searchIcon).join(replaceIcon);
  }
  if (content.includes(searchLabel)) {
    content = content.split(searchLabel).join(replaceLabel);
  }

  // Some files have text-[10px] tracking-widest text-cyan-400/80 block uppercase without mb-2
  const searchLabel2 = 'text-[10px] tracking-widest text-cyan-400/80 block uppercase';
  const replaceLabel2 = 'text-[9px] sm:text-[10px] tracking-widest text-cyan-400/80 block uppercase';
  if (content.includes(searchLabel2)) {
    content = content.split(searchLabel2).join(replaceLabel2);
  }

  // Find any w-full flex justify-between and append text sizes if not already there
  // This might be tricky via string replace. Let's do regex for IpaVisibilityToggle
  const toggleRegex = /<IpaVisibilityToggle([^>]*?)className="w-full flex justify-between"([^>]*?)>/g;
  content = content.replace(toggleRegex, '<IpaVisibilityToggle$1className="w-full flex justify-between text-[10px] sm:text-xs"$2>');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
    updatedFiles++;
  }
});

console.log('Done. Updated ' + updatedFiles + ' files.');
