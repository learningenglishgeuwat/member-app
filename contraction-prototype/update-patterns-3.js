import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const sIs = `  const patternIs = [
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
`;

if (!code.includes('const patternIs = [')) {
    code = code.replace('const sec1Examples =', sIs + '\n  const sec1Examples =');
}

const pill1 = `<div className="pill-wrap">
                {patternIs.map((item, i) => (
                  <button key={i} className="pill" onClick={() => speak(item.word)}>
                    <span>{item.word}</span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>`;

const pill2 = `<div className="pill-wrap">
                {patternAre.map((item, i) => (
                  <button key={i} className="pill" onClick={() => speak(item.word)}>
                    <span>{item.word}</span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>`;

const pill3 = `<div className="pill-wrap">
                {patternAm.map((item, i) => (
                  <button key={i} className="pill" onClick={() => speak(item.word)}>
                    <span>{item.word}</span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>`;

const regex1 = /<div className="pill-wrap">\s*<span className="pill">She's<\/span>[\s\S]*?<span className="pill">That's<\/span>\s*<\/div>/;
const regex2 = /<div className="pill-wrap">\s*<span className="pill">You're<\/span>[\s\S]*?<span className="pill">How're<\/span>\s*<\/div>/;
const regex3 = /<div className="pill-wrap">\s*<span className="pill">I'm<\/span>\s*<\/div>/;

code = code.replace(regex1, pill1);
code = code.replace(regex2, pill2);
code = code.replace(regex3, pill3);

fs.writeFileSync('src/App.tsx', code);
