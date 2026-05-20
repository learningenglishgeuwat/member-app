import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement1 = `{patternWill.map((item, i) => (
                <button key={i} className="pill" onClick={() => speak(item.word)}>
                  <span>{item.word} {item.suffix}</span>
                  {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                </button>
              ))}`;

const replacement2 = `{patternHave.map((item, i) => (
                <button key={i} className="pill" onClick={() => speak(item.word)}>
                  <span>{item.word} {item.suffix}</span>
                  {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                </button>
              ))}`;

const replacement3 = `{patternWould.map((item, i) => (
                <button key={i} className="pill" onClick={() => speak(item.word)}>
                  <span>{item.word} {item.suffix}</span>
                  {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                </button>
              ))}`;

const arrays = `
  const patternWill = [
    { word: "I'll", ipa: "/aɪl/" },
    { word: "You'll", ipa: "/juːl/" },
    { word: "They'll", ipa: "/ðeɪl/" },
    { word: "She'll", ipa: "/ʃiːl/" },
    { word: "What'll", ipa: "/ˈwɑːtəl/" },
    { word: "This'll", ipa: "/ˈðɪsəl/" },
    { word: "That'll", ipa: "/ˈðætəl/" },
  ];

  const patternHave = [
    { word: "I've", ipa: "/aɪv/" },
    { word: "They've", ipa: "/ðeɪv/" },
    { word: "She's", suffix: "(has)", ipa: "/ʃiːz/" },
    { word: "It's", suffix: "(has)", ipa: "/ɪts/" },
    { word: "What've", ipa: "/ˈwɑːtəv/" },
  ];

  const patternWould = [
    { word: "I'd", suffix: "(would)", ipa: "/aɪd/" },
    { word: "I'd", suffix: "(had)", ipa: "/aɪd/" },
    { word: "She'd", suffix: "(would)", ipa: "/ʃiːd/" },
    { word: "She'd", suffix: "(had)", ipa: "/ʃiːd/" },
  ];
`;

if (!code.includes('const patternWill =')) {
    code = code.replace('const sec1Examples =', arrays + '\n  const sec1Examples =');
}

code = code.replace(
  /<div className="pill-wrap">\s*<span className="pill">I'll<\/span>\s*<span className="pill">You'll<\/span>\s*<span className="pill">They'll<\/span>\s*<span className="pill">She'll<\/span>\s*<span className="pill">What'll<\/span>\s*<span className="pill">This'll<\/span>\s*<span className="pill">That'll<\/span>\s*<\/div>/,
  '<div className="pill-wrap">\n                ' + replacement1 + '\n              </div>'
);

code = code.replace(
  /<div className="pill-wrap">\s*<span className="pill">I've<\/span>\s*<span className="pill">They've<\/span>\s*<span className="pill">She's \(has\)<\/span>\s*<span className="pill">It's \(has\)<\/span>\s*<span className="pill">What've<\/span>\s*<\/div>/,
  '<div className="pill-wrap">\n                ' + replacement2 + '\n              </div>'
);

code = code.replace(
  /<div className="pill-wrap">\s*<span className="pill">I'd \(would\)<\/span>\s*<span className="pill">I'd \(had\)<\/span>\s*<span className="pill">She'd \(would\)<\/span>\s*<span className="pill">She'd \(had\)<\/span>\s*<\/div>/,
  '<div className="pill-wrap">\n                ' + replacement3 + '\n              </div>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Done');
