import fs from 'fs';

let code = fs.readFileSync('src/App.tsx', 'utf-8');

const transformMatch = (match, isInformal) => {
    return match.replace(/{([\s\S]*?)}/g, (objMatch, inner) => {
        let objStr = "{" + inner + "}";
        try {
            // Evaluatable object string
            let obj = eval('(' + objStr + ')');
            
            const original = isInformal ? obj.formal : obj.en;
            const contracted = isInformal ? obj.informal : obj.after;
            const targetContract = obj.contract;
            
            const idx = contracted.indexOf(targetContract);
            let prefix = "", suffix = "";
            let origHighlight = original;
            if (idx !== -1) {
                prefix = contracted.substring(0, idx);
                suffix = contracted.substring(idx + targetContract.length);
                if (original.startsWith(prefix) && original.endsWith(suffix)) {
                    origHighlight = original.substring(prefix.length, original.length - suffix.length);
                }
            }
            
            let ipaContractRaw = obj.ipaContract.replace(/\//g, '');
            let ipaRaw = obj.ipa.replace(/\//g, '');
            let ipaEnRaw = (obj.ipaEn || obj.ipaFormal || "").replace(/\//g, '');
            
            let ipaOrigHighlight = ipaEnRaw;
            const ipaIdx = ipaRaw.indexOf(ipaContractRaw);
            if (ipaIdx !== -1) {
                let ipaPrefix = ipaRaw.substring(0, ipaIdx);
                let ipaSuffix = ipaRaw.substring(ipaIdx + ipaContractRaw.length);
                if (ipaEnRaw.startsWith(ipaPrefix) && ipaEnRaw.endsWith(ipaSuffix)) {
                    ipaOrigHighlight = ipaEnRaw.substring(ipaPrefix.length, ipaEnRaw.length - ipaSuffix.length);
                }
            }

            // Return string representation
            if (!isInformal) {
                return `{
      en: "${obj.en}",
      enTarget: "${origHighlight}",
      contract: "${obj.contract}",
      after: "${obj.after}",
      ipaContract: "${obj.ipaContract}",
      ipa: "${obj.ipa}",
      ipaEn: "${obj.ipaEn}",
      ipaEnTarget: "${ipaOrigHighlight}"
    }`;
            } else {
                return `{
      formal: "${obj.formal}",
      formalTarget: "${origHighlight}",
      contract: "${obj.contract}",
      informal: "${obj.informal}",
      ipaContract: "${obj.ipaContract}",
      ipa: "${obj.ipa}",
      ipaEn: "${obj.ipaEn}",
      ipaEnTarget: "${ipaOrigHighlight}"
    }`;
            }
        } catch (e) {
            console.log("Failed to process", objStr, e);
            return objMatch;
        }
    });
};

const arrays = ['sec1Examples', 'sec2Examples', 'sec3Examples', 'negPresent', 'negPast', 'negModal', 'negHave'];
arrays.forEach(arr => {
    const rx = new RegExp(`const ${arr} = \\[(\\s*\\{[\\s\\S]*?\\}\\s*,?\\s*)+\\];`);
    code = code.replace(rx, match => {
        return transformMatch(match, false);
    });
});

const arrInformal = ['informalSentences'];
arrInformal.forEach(arr => {
    const rx = new RegExp(`const ${arr} = \\[(\\s*\\{[\\s\\S]*?\\}\\s*,?\\s*)+\\];`);
    code = code.replace(rx, match => {
        return transformMatch(match, true);
    });
});

fs.writeFileSync('src/App.tsx', code);
console.log("Updated data with targets");
