import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const highlightComponent = `
const Highlight = ({ text, target }: { text?: string; target?: string }) => {
  if (!text) return null;
  if (!target || !text.includes(target)) return <span>{text}</span>;
  // highlight first occurrence or all, let's replace all
  const parts = text.split(target);
  return (
    <span>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="text-[#ffb800]">{target}</span>}
        </React.Fragment>
      ))}
    </span>
  );
};
`;

if (!code.includes('const Highlight =')) {
    code = code.replace('export default function App() {', highlightComponent + '\nexport default function App() {');
}

// Helper for replacement
const replaceInString = (str, search, replacement) => {
    return str.split(search).join(replacement);
};

// sec1Examples
code = replaceInString(code, '<span>{item.en}</span>', '<Highlight text={item.en} target={item.enTarget} />');
code = replaceInString(code, '<span>{item.ipaEn}</span>', '<Highlight text={item.ipaEn} target={item.ipaEnTarget} />');
code = replaceInString(code, '<span>{item.after}</span>', '<Highlight text={item.after} target={item.contract} />');
code = replaceInString(code, '{item.ipaEn}', '<Highlight text={item.ipaEn} target={item.ipaEnTarget} />');
code = replaceInString(code, '{item.ipa}', '<Highlight text={item.ipa} target={item.ipaContract ? item.ipaContract.replace(/\\//g, "") : undefined} />');

// informalSentences
code = replaceInString(code, '<span>{item.formal}</span>', '<Highlight text={item.formal} target={item.formalTarget} />');
code = replaceInString(code, '<span>{item.informal}</span>', '<Highlight text={item.informal} target={item.contract} />');

fs.writeFileSync('src/App.tsx', code);
console.log("Updated App.tsx UI with Highlight component");
