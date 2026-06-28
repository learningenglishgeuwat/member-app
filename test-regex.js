
const digraphs = ['t?', 'd?', 'a?', 'e?', 'a?', 'o?', '??', '??', 'e?', '??', '?r', '?r', '?r', '?r', '?r', '?r'];
const stressMarks = [''', '?'];

function getHighlightedIpaBefore(ipaBefore) {
  if (!ipaBefore) return '';
  const inner = ipaBefore.replace(/\//g, '');
  const words = inner.split(' ');
  if (words.length <= 1) return ipaBefore;

  const hOpen = '<span class=\'text-fuchsia-500 font-bold\'>';
  const hClose = '</span>';

  const formattedWords = words.map((word, idx) => {
    let newWord = word;
    let prefix = '';
    if (idx > 0) {
      let stress = '';
      if (stressMarks.includes(newWord[0])) {
        stress = newWord[0];
        newWord = newWord.slice(1);
      }
      let rightSound = '';
      let rightIndex = 1;
      for (const d of digraphs) {
        if (newWord.startsWith(d)) {
          rightSound = d;
          rightIndex = d.length;
          break;
        }
      }
      if (!rightSound && newWord.length > 0) {
        rightSound = newWord.slice(0, 1);
        rightIndex = 1;
      }
      if (rightSound) {
         prefix = stress + hOpen + rightSound + hClose;
         newWord = newWord.slice(rightIndex);
      }
    }

    let suffix = '';
    if (idx < words.length - 1) {
      let leftSound = '';
      let leftIndex = newWord.length - 1;
      for (const d of digraphs) {
        if (newWord.endsWith(d)) {
          leftSound = d;
          leftIndex = newWord.length - d.length;
          break;
        }
      }
      if (!leftSound && newWord.length > 0) {
        leftSound = newWord.slice(-1);
        leftIndex = newWord.length - 1;
      }
      if (leftSound) {
        suffix = hOpen + leftSound + hClose;
        newWord = newWord.slice(0, leftIndex);
      }
    }
    return prefix + newWord + suffix;
  });

  return '/' + formattedWords.join(' ') + '/';
}

console.log(getHighlightedIpaBefore('/k?m ?n/'));
console.log(getHighlightedIpaBefore('/t??k ?t a?t/'));
console.log(getHighlightedIpaBefore('/fa?nd a?t/'));
console.log(getHighlightedIpaBefore('/t?k e? b?k/'));
console.log(getHighlightedIpaBefore('/'p?t ?t ?n/'));

