const examples = [
  {
    en: "She is in the class",
    contract: "She's",
    after: "She's in the class",
    ipaContract: "/ʃiːz/",
    ipa: "/ʃiːz ɪn ðə klæs/",
    ipaEn: "/ʃiː ɪz ɪn ðə klæs/",
  },
  {
    formal: "I'm going to tell you",
    contract: "gonna",
    informal: "I'm gonna tell you",
    ipaContract: "/ˈɡʌnə/",
    ipa: "/aɪm ˈɡʌnə tɛl juː/",
    ipaEn: "/aɪm ˈɡoʊɪŋ tuː tɛl juː/",
  }
];

function getHighlights(item) {
  const isInformal = !!item.formal;
  const original = isInformal ? item.formal : item.en;
  const contracted = isInformal ? item.informal : item.after;
  const targetContract = item.contract;
  
  // Find where targetContract is in contracted
  const idx = contracted.indexOf(targetContract);
  if (idx === -1) return { origHighlight: "", origRest: original };
  
  const prefix = contracted.substring(0, idx);
  const suffix = contracted.substring(idx + targetContract.length);
  
  // original should start with prefix and end with suffix
  let origHighlight = original;
  if (original.startsWith(prefix) && original.endsWith(suffix)) {
      origHighlight = original.substring(prefix.length, original.length - suffix.length);
  } else {
      console.log("Mismatched:", original, prefix, suffix);
  }

  // IPA highlight
  const ipaIdx = item.ipa.indexOf(item.ipaContract);
  let ipaOrigHighlight = item.ipaEn;
  let ipaPrefix = "", ipaSuffix = "";
  if (ipaIdx !== -1) {
      ipaPrefix = item.ipa.substring(0, ipaIdx);
      ipaSuffix = item.ipa.substring(ipaIdx + item.ipaContract.length);
      if (item.ipaEn.startsWith(ipaPrefix) && item.ipaEn.endsWith(ipaSuffix)) {
          ipaOrigHighlight = item.ipaEn.substring(ipaPrefix.length, item.ipaEn.length - ipaSuffix.length);
      } else {
          console.log("IPA Mismatched:", item.ipaEn, ipaPrefix, ipaSuffix);
      }
  }

  return { origHighlight, ipaOrigHighlight, prefix, suffix, ipaPrefix, ipaSuffix };
}

examples.forEach(ex => console.log(getHighlights(ex)));
