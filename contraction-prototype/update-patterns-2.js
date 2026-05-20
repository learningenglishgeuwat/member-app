import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const replacement1 = \`{patternIs.map((item, i) => (
                <button key={i} className="pill" onClick={() => speak(item.word)}>
                  <span>{item.word} {item.suffix}</span>
                  {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                </button>
              ))}\`;

const replacement2 = \`{patternAre.map((item, i) => (
                <button key={i} className="pill" onClick={() => speak(item.word)}>
                  <span>{item.word} {item.suffix}</span>
                  {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                </button>
              ))}\`;

const replacement3 = \`{patternAm.map((item, i) => (
                <button key={i} className="pill" onClick={() => speak(item.word)}>
                  <span>{item.word} {item.suffix}</span>
                  {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                </button>
              ))}\`;

const arrays = \`
  const patternIs = [
    { word: "She's", ipa: "/ʃiːz/" },
    { word: "He's", ipa: "/hiːz/" },
    { word: "It's", ipa: "/ɪts/" },
    { word: "What's", ipa: "/wɑts/" },
    { word: "How's", ipa: "/haʊz/" },
    { word: "When's", ipa: "/wɛnz/" },
    { word: "That's", ipa: "/ðæts/" },
  ];

  const patternAre = [
    { word: "You're", ipa: "/jʊr/" },
    { word: "They're", ipa: "/ðɛr/" },
    { word: "We're", ipa: "/wɪr/" },
    { word: "What're", ipa: "/ˈwɑtər/" },
    { word: "When're", ipa: "/ˈwɛnər/" },
    { word: "Where're", ipa: "/ˈwɛrər/" },
    { word: "How're", ipa: "/ˈhaʊ.ər/" },
  ];

  const patternAm = [
    { word: "I'm", ipa: "/aɪm/" },
  ];
\`;

if (!code.includes('const patternIs =')) {
    code = code.replace('const sec1Examples =', arrays + '\\n  const sec1Examples =');
}

code = code.replace(
  /<div className="pill-wrap">\\s*<span className="pill">She's<\\/span>\\s*<span className="pill">He's<\\/span>\\s*<span className="pill">It's<\\/span>\\s*<span className="pill">What's<\\/span>\\s*<span className="pill">How's<\\/span>\\s*<span className="pill">When's<\\/span>\\s*<span className="pill">That's<\\/span>\\s*<\\/div>/,
  '<div className="pill-wrap">\\n                ' + replacement1 + '\\n              </div>'
);

code = code.replace(
  /<div className="pill-wrap">\\s*<span className="pill">You're<\\/span>\\s*<span className="pill">They're<\\/span>\\s*<span className="pill">We're<\\/span>\\s*<span className="pill">What're<\\/span>\\s*<span className="pill">When're<\\/span>\\s*<span className="pill">Where're<\\/span>\\s*<span className="pill">How're<\\/span>\\s*<\\/div>/,
  '<div className="pill-wrap">\\n                ' + replacement2 + '\\n              </div>'
);

code = code.replace(
  /<div className="pill-wrap">\\s*<span className="pill">I\\'m<\\/span>\\s*<\\/div>/,
  '<div className="pill-wrap">\\n                ' + replacement3 + '\\n              </div>'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Done');
