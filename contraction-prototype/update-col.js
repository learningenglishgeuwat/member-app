import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The specific snippets:
// <span className="font-semibold text-[#00f5ff]">
//   {item.contract}
// </span>
code = code.replace(
  /<span className="font-semibold text-\[#00f5ff\]">\s*\{item.contract\}\s*<\/span>/g,
  '<span className="font-semibold text-[#ffb800]">{item.contract}</span>'
);

// <span className="font-mono text-[0.85rem] text-[#00f5ff]">
//   {item.ipaContract}
// </span>
code = code.replace(
  /<span className="font-mono text-\[0.85rem\] text-\[#00f5ff\]">\s*\{item.ipaContract\}\s*<\/span>/g,
  '<span className="font-mono text-[0.85rem] text-[#ffb800]">{item.ipaContract}</span>'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Updated middle column color");
