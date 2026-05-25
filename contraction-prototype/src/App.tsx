import React, { useState, useRef } from "react";
import { Volume2, Play } from "lucide-react";

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
          {i < parts.length - 1 && (
            <span className="text-[#ffb800]">{target}</span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState(0);
  const [showIpa, setShowIpa] = useState(true);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  // Helper dictionary arrays
  const tabs = [
    "00 · Dasar",
    "01 · To Be",
    "02 · Aux Verbs",
    "03 · Negatif",
    "04 · Informal",
  ];

  // American English TTS function
  const playIdRef = useRef(0);

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      playIdRef.current += 1;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9; // Slightly slower for better clarity in phonetics

      // Attempt to find a distinctly American voice (e.g. Google's if available)
      const voices = window.speechSynthesis.getVoices();
      const usVoice = voices.find(
        (v) =>
          v.lang === "en-US" &&
          (v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Microsoft Zira")),
      );
      if (usVoice) {
        utterance.voice = usVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const playSequence = async (items: { id: string; texts: string[] }[]) => {
    if (!("speechSynthesis" in window)) return;

    playIdRef.current += 1;
    const currentId = playIdRef.current;

    window.speechSynthesis.cancel();
    await new Promise((r) => setTimeout(r, 50));

    for (const item of items) {
      if (playIdRef.current !== currentId) break;

      setActiveRowId(item.id);
      setTimeout(() => {
        const el = document.getElementById(item.id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 50);

      for (const text of item.texts) {
        if (playIdRef.current !== currentId) break;

        await new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          utterance.rate = 0.9;

          const voices = window.speechSynthesis.getVoices();
          const usVoice = voices.find(
            (v) =>
              v.lang === "en-US" &&
              (v.name.includes("Google") ||
                v.name.includes("Samantha") ||
                v.name.includes("Microsoft Zira")),
          );
          if (usVoice) utterance.voice = usVoice;

          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();

          window.speechSynthesis.speak(utterance);
        });

        if (playIdRef.current !== currentId) break;
        // Small pause between each part
        await new Promise((r) => setTimeout(r, 600));
      }
    }

    if (playIdRef.current === currentId) {
      setActiveRowId(null);
    }
  };

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

  const patternAm = [{ word: "I'm", ipa: "/aɪm/" }];

  const sec1Examples = [
    {
      en: "She is in the class",
      enTarget: "She is",
      contract: "She's",
      after: "She's in the class",
      ipaContract: "/ʃiːz/",
      ipa: "/ʃiːz ɪn ðə klæs/",
      ipaEn: "/ʃiː ɪz ɪn ðə klæs/",
      ipaEnTarget: "ʃiː ɪz",
    },
    {
      en: "He is my dad",
      enTarget: "He is",
      contract: "He's",
      after: "He's my dad",
      ipaContract: "/hiːz/",
      ipa: "/hiːz maɪ dæd/",
      ipaEn: "/hiː ɪz maɪ dæd/",
      ipaEnTarget: "hiː ɪz",
    },
    {
      en: "It is not a big deal",
      enTarget: "It is",
      contract: "It's",
      after: "It's not a big deal",
      ipaContract: "/ɪts/",
      ipa: "/ɪts nɑːt ə bɪɡ diːl/",
      ipaEn: "/ɪt ɪz nɑːt ə bɪɡ diːl/",
      ipaEnTarget: "ɪt ɪz",
    },
    {
      en: "What is up!",
      enTarget: "What is",
      contract: "What's",
      after: "What's up!",
      ipaContract: "/wʌts/",
      ipa: "/wʌts ʌp/",
      ipaEn: "/wʌt ɪz ʌp/",
      ipaEnTarget: "wʌt ɪz",
    },
    {
      en: "How is it going?",
      enTarget: "How is",
      contract: "How's",
      after: "How's it going?",
      ipaContract: "/haʊz/",
      ipa: "/haʊz ɪt ˈɡoʊɪŋ/",
      ipaEn: "/haʊ ɪz ɪt ˈɡoʊɪŋ/",
      ipaEnTarget: "haʊ ɪz",
    },
    {
      en: "You are my friend",
      enTarget: "You are",
      contract: "You're",
      after: "You're my friend",
      ipaContract: "/jʊr/",
      ipa: "/jʊr maɪ frɛnd/",
      ipaEn: "/juː ɑːr maɪ frɛnd/",
      ipaEnTarget: "juː ɑːr",
    },
    {
      en: "They are not here",
      enTarget: "They are",
      contract: "They're",
      after: "They're not here",
      ipaContract: "/ðɛr/",
      ipa: "/ðɛr nɑːt hɪr/",
      ipaEn: "/ðeɪ ɑːr nɑːt hɪr/",
      ipaEnTarget: "ðeɪ ɑːr",
    },
    {
      en: "We are at the bank",
      enTarget: "We are",
      contract: "We're",
      after: "We're at the bank",
      ipaContract: "/wɪr/",
      ipa: "/wɪr æt ðə bæŋk/",
      ipaEn: "/wiː ɑːr æt ðə bæŋk/",
      ipaEnTarget: "wiː ɑːr",
    },
    {
      en: "I am a teacher",
      enTarget: "I am",
      contract: "I'm",
      after: "I'm a teacher",
      ipaContract: "/aɪm/",
      ipa: "/aɪm ə ˈtiːtʃər/",
      ipaEn: "/aɪ æm ə ˈtiːtʃər/",
      ipaEnTarget: "aɪ æm",
    },
    {
      en: "I am an American",
      enTarget: "I am",
      contract: "I'm",
      after: "I'm an American",
      ipaContract: "/aɪm/",
      ipa: "/aɪm ən əˈmɛrɪkən/",
      ipaEn: "/aɪ æm ən əˈmɛrɪkən/",
      ipaEnTarget: "aɪ æm",
    },
  ];

  const sec2Examples = [
    {
      en: "I will open it soon",
      enTarget: "I will",
      contract: "I'll",
      after: "I'll open it soon",
      ipaContract: "/aɪl/",
      ipa: "/aɪl ˈoʊpən ɪt suːn/",
      ipaEn: "/aɪ wɪl ˈoʊpən ɪt suːn/",
      ipaEnTarget: "aɪ wɪl",
    },
    {
      en: "You will like it",
      enTarget: "You will",
      contract: "You'll",
      after: "You'll like it",
      ipaContract: "/juːl/",
      ipa: "/juːl laɪk ɪt/",
      ipaEn: "/juː wɪl laɪk ɪt/",
      ipaEnTarget: "juː wɪl",
    },
    {
      en: "She will understand",
      enTarget: "She will",
      contract: "She'll",
      after: "She'll understand",
      ipaContract: "/ʃiːl/",
      ipa: "/ʃiːl ˌʌndərˈstænd/",
      ipaEn: "/ʃiː wɪl ˌʌndərˈstænd/",
      ipaEnTarget: "ʃiː wɪl",
    },
    {
      en: "I have told you before",
      enTarget: "I have",
      contract: "I've",
      after: "I've told you before",
      ipaContract: "/aɪv/",
      ipa: "/aɪv toʊld juː bɪˈfɔːr/",
      ipaEn: "/aɪ hæv toʊld juː bɪˈfɔːr/",
      ipaEnTarget: "aɪ hæv",
    },
    {
      en: "They have published it",
      enTarget: "They have",
      contract: "They've",
      after: "They've published it",
      ipaContract: "/ðeɪv/",
      ipa: "/ðeɪv ˈpʌblɪʃt ɪt/",
      ipaEn: "/ðeɪ hæv ˈpʌblɪʃt ɪt/",
      ipaEnTarget: "ðeɪ hæv",
    },
    {
      en: "She has gone many years",
      enTarget: "She has",
      contract: "She's",
      after: "She's gone many years",
      ipaContract: "/ʃiːz/",
      ipa: "/ʃiːz ɡɑːn ˈmɛni jɪrz/",
      ipaEn: "/ʃiː hæz ɡɑːn ˈmɛni jɪrz/",
      ipaEnTarget: "ʃiː hæz",
    },
    {
      en: "I would be there",
      enTarget: "I would",
      contract: "I'd",
      after: "I'd be there",
      ipaContract: "/aɪd/",
      ipa: "/aɪd biː ðɛr/",
      ipaEn: "/aɪ wʊd biː ðɛr/",
      ipaEnTarget: "aɪ wʊd",
    },
    {
      en: "I had been there before",
      enTarget: "I had",
      contract: "I'd",
      after: "I'd been there before",
      ipaContract: "/aɪd/",
      ipa: "/aɪd bɪn ðɛr bɪˈfɔːr/",
      ipaEn: "/aɪ hæd bɪn ðɛr bɪˈfɔːr/",
      ipaEnTarget: "aɪ hæd",
    },
  ];

  const sec3Examples = [
    {
      en: "I can not do it",
      enTarget: "can not",
      contract: "can't",
      after: "I can't do it",
      ipaContract: "/kænt/",
      ipa: "/aɪ kænt duː ɪt/",
      ipaEn: "/aɪ kæn nɑːt duː ɪt/",
      ipaEnTarget: "kæn nɑːt",
    },
    {
      en: "She does not know",
      enTarget: "does not",
      contract: "doesn't",
      after: "She doesn't know",
      ipaContract: "/ˈdʌzənt/",
      ipa: "/ʃiː ˈdʌzənt noʊ/",
      ipaEn: "/ʃiː dʌz nɑːt noʊ/",
      ipaEnTarget: "dʌz nɑːt",
    },
    {
      en: "They were not here",
      enTarget: "were not",
      contract: "weren't",
      after: "They weren't here",
      ipaContract: "/wɚrnt/",
      ipa: "/ðeɪ wɚrnt hɪr/",
      ipaEn: "/ðeɪ wɚr nɑːt hɪr/",
      ipaEnTarget: "wɚr nɑːt",
    },
    {
      en: "You should not go",
      enTarget: "should not",
      contract: "shouldn't",
      after: "You shouldn't go",
      ipaContract: "/ˈʃʊdənt/",
      ipa: "/juː ˈʃʊdənt ɡoʊ/",
      ipaEn: "/juː ʃʊd nɑːt ɡoʊ/",
      ipaEnTarget: "ʃʊd nɑːt",
    },
    {
      en: "I will not do that",
      enTarget: "will not",
      contract: "won't",
      after: "I won't do that",
      ipaContract: "/woʊnt/",
      ipa: "/aɪ woʊnt duː ðæt/",
      ipaEn: "/aɪ wɪl nɑːt duː ðæt/",
      ipaEnTarget: "wɪl nɑːt",
    },
  ];

  const informalWords = [
    { word: "Gimme", full: "give me", ipa: "/ˈɡɪmi/", id: "kasih aku" },
    { word: "Lemme", full: "let me", ipa: "/ˈlɛmi/", id: "biarkan aku" },
    { word: "Wanna", full: "want to", ipa: "/ˈwɑːnə/", id: "mau / ingin" },
    { word: "Gonna", full: "going to", ipa: "/ˈɡʌnə/", id: "akan / mau" },
    { word: "Tryna", full: "trying to", ipa: "/ˈtraɪnə/", id: "mencoba untuk" },
    { word: "Hafta", full: "have to", ipa: "/ˈhæftə/", id: "harus" },
    { word: "Hasta", full: "has to", ipa: "/ˈhæstə/", id: "harus (dia)" },
    { word: "Y'all", full: "you all", ipa: "/jɔːl/", id: "kalian semua" },
    {
      word: "Woulda",
      full: "would have",
      ipa: "/ˈwʊdə/",
      id: "seharusnya sudah",
    },
    {
      word: "Shoulda",
      full: "should have",
      ipa: "/ˈʃʊdə/",
      id: "seharusnya sudah",
    },
    {
      word: "Coulda",
      full: "could have",
      ipa: "/ˈkʊdə/",
      id: "bisa saja sudah",
    },
    { word: "Dunno", full: "don't know", ipa: "/dəˈnoʊ/", id: "nggak tahu" },
    { word: "D'yu", full: "do you", ipa: "/djuː/", id: "apakah kamu" },
    {
      word: "Imma",
      full: "I'm going to",
      ipa: "/ˈɪmə/",
      id: "aku mau / aku akan",
    },
  ];

  const informalSentences = [
    {
      formal: "I'm going to tell you",
      formalTarget: "going to",
      contract: "gonna",
      informal: "I'm gonna tell you",
      ipaContract: "/ˈɡʌnə/",
      ipa: "/aɪm ˈɡʌnə tɛl juː/",
      ipaEn: "/aɪm ˈɡoʊɪŋ tuː tɛl juː/",
      ipaEnTarget: "ˈɡoʊɪŋ tuː",
    },
    {
      formal: "Give me your pen",
      formalTarget: "Give me",
      contract: "Gimme",
      informal: "Gimme your pen",
      ipaContract: "/ˈɡɪmi/",
      ipa: "/ˈɡɪmi jʊr pɛn/",
      ipaEn: "/ɡɪv miː jʊr pɛn/",
      ipaEnTarget: "ɡɪv miː",
    },
    {
      formal: "I don't know the answer",
      formalTarget: "don't know the answer",
      contract: "dunno",
      informal: "I dunno",
      ipaContract: "/dəˈnoʊ/",
      ipa: "/aɪ dəˈnoʊ/",
      ipaEn: "/aɪ doʊnt noʊ ði ˈænsər/",
      ipaEnTarget: "doʊnt noʊ ði ˈænsər",
    },
    {
      formal: "I'm going to do it now",
      formalTarget: "I'm going to",
      contract: "Imma",
      informal: "Imma do it now",
      ipaContract: "/ˈɪmə/",
      ipa: "/ˈɪmə duː ɪt naʊ/",
      ipaEn: "/aɪm ˈɡoʊɪŋ tuː duː ɪt naʊ/",
      ipaEnTarget: "aɪm ˈɡoʊɪŋ tuː",
    },
    {
      formal: "I want to meet you",
      formalTarget: "want to",
      contract: "wanna",
      informal: "I wanna meet you",
      ipaContract: "/ˈwɑːnə/",
      ipa: "/aɪ ˈwɑːnə miːt juː/",
      ipaEn: "/aɪ wɑːnt tuː miːt juː/",
      ipaEnTarget: "wɑːnt tuː",
    },
    {
      formal: "Let me sleep",
      formalTarget: "Let me",
      contract: "Lemme",
      informal: "Lemme sleep",
      ipaContract: "/ˈlɛmi/",
      ipa: "/ˈlɛmi sliːp/",
      ipaEn: "/lɛt miː sliːp/",
      ipaEnTarget: "lɛt miː",
    },
    {
      formal: "I should have gone",
      formalTarget: "should have",
      contract: "shoulda",
      informal: "I shoulda gone",
      ipaContract: "/ˈʃʊdə/",
      ipa: "/aɪ ˈʃʊdə ɡɑːn/",
      ipaEn: "/aɪ ʃʊd hæv ɡɑːn/",
      ipaEnTarget: "ʃʊd hæv",
    },
  ];

  const negPresent = [
    { word: "Don't", ipa: "/doʊnt/" },
    { word: "Doesn't", ipa: "/ˈdʌzənt/" },
    { word: "Isn't", ipa: "/ˈɪzənt/" },
    { word: "Aren't", ipa: "/ɑːrnt/" },
    { word: "Can't", ipa: "/kænt/" },
  ];
  const negPast = [
    { word: "Didn't", ipa: "/ˈdɪdənt/" },
    { word: "Wasn't", ipa: "/ˈwɑːzənt/" },
    { word: "Weren't", ipa: "/wɚrnt/" },
    { word: "Hadn't", ipa: "/ˈhædənt/" },
  ];
  const negModal = [
    { word: "Won't", ipa: "/woʊnt/" },
    { word: "Wouldn't", ipa: "/ˈwʊdənt/" },
    { word: "Couldn't", ipa: "/ˈkʊdənt/" },
    { word: "Shouldn't", ipa: "/ˈʃʊdənt/" },
    { word: "Mustn't", ipa: "/ˈmʌsənt/" },
  ];
  const negHave = [
    { word: "Haven't", ipa: "/ˈhævənt/" },
    { word: "Hasn't", ipa: "/ˈhæzənt/" },
  ];

  return (
    <>
      {/* HERO */}
      <header className="hero">
        <div className="hero-glow"></div>
        <div className="hero-tag">// ENG PHONETICS MODULE_13 //</div>
        <h1 className="hero-title">
          CON<span>TRAC</span>TIONS
        </h1>
        <div className="hero-ipa">/kənˈtrækʃənz/</div>
        <div className="hero-ipa-label">General American English · IPA</div>
        <p className="hero-desc">
          Bentuk pendek dari satu kata atau kelompok kata dengan menghilangkan
          huruf dan bunyi di tengah, diganti dengan apostrof ({" "}
          <strong style={{ color: "var(--cyan)" }}>'</strong> ).
        </p>
      </header>

      {/* NAV */}
      <nav className="nav-bar flex-col md:flex-row items-center justify-between gap-4 py-4 px-6 bg-black/40 border-b border-[#2d5560]/30 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex overflow-x-auto w-full md:w-auto gap-2 pb-2 md:pb-0 hide-scrollbar">
          {tabs.map((tab, idx) => (
            <button
              key={idx}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === idx ? "bg-[#00b8c4] text-[#0d2028]" : "bg-[#00f5ff]/5 text-[#a5d8df] hover:bg-[#00f5ff]/10 hover:text-[#f0fdfa]"}`}
              onClick={() => {
                setActiveTab(idx);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* MAIN */}
      <main className="main-content relative">
        {/* ═══ SECTION 0: DASAR ════════════════════════════════ */}
        <section className={`section ${activeTab === 0 ? "active" : ""}`}>
          <div className="sec-header">
            <div className="sec-num">00</div>
            <div className="sec-info">
              <div className="sec-title">Definisi & Konsep Dasar</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">/ˌdɛfɪˈnɪʃən/</span>
                <span className="ipa-dialect">General American</span>
              </div>
              <div className="sec-subtitle">
                Memahami apa itu kontraksi dan bagaimana cara kerjanya dalam
                bahasa Inggris.
              </div>
            </div>
          </div>

          <div className="def-block">
            <p className="def-text">
              A <span className="highlight">contraction</span> is a{" "}
              <span className="highlight">shortened version</span> of the
              written and spoken forms of a word, syllable, or word group,
              created by{" "}
              <span className="highlight">
                omission of internal letters and sounds
              </span>
              . Ditandai dengan tanda apostrof{" "}
              <span className="highlight">( ' )</span> sebagai pengganti huruf
              yang dihilangkan.
            </p>
          </div>

          <div className="ipa-legend">
            <div className="ipa-legend-title">
              Simbol IPA yang sering muncul
            </div>
            <div className="ipa-grid">
              <div className="ipa-item">
                <span className="ipa-sym">ə</span>
                <div>
                  <div className="ipa-desc">schwa — bunyi "e" lemah</div>
                  <div className="ipa-ex">I'm /aɪm/ → /əm/</div>
                </div>
              </div>
              <div className="ipa-item">
                <span className="ipa-sym">ɪ</span>
                <div>
                  <div className="ipa-desc">short "i" — "i" pendek</div>
                  <div className="ipa-ex">it's /ɪts/</div>
                </div>
              </div>
              <div className="ipa-item">
                <span className="ipa-sym">æ</span>
                <div>
                  <div className="ipa-desc">short "a" — "a" terbuka</div>
                  <div className="ipa-ex">can't /kænt/</div>
                </div>
              </div>
              <div className="ipa-item">
                <span className="ipa-sym">ʌ</span>
                <div>
                  <div className="ipa-desc">"u" terbuka</div>
                  <div className="ipa-ex">won't /woʊnt/</div>
                </div>
              </div>
              <div className="ipa-item">
                <span className="ipa-sym">ŋ</span>
                <div>
                  <div className="ipa-desc">nasal "ng"</div>
                  <div className="ipa-ex">going /ˈɡoʊɪŋ/</div>
                </div>
              </div>
              <div className="ipa-item">
                <span className="ipa-sym">ð</span>
                <div>
                  <div className="ipa-desc">voiced "th"</div>
                  <div className="ipa-ex">they're /ðɛr/</div>
                </div>
              </div>
              <div className="ipa-item">
                <span className="ipa-sym">aɪ</span>
                <div>
                  <div className="ipa-desc">diftong "ai"</div>
                  <div className="ipa-ex">I'd /aɪd/</div>
                </div>
              </div>
              <div className="ipa-item">
                <span className="ipa-sym">oʊ</span>
                <div>
                  <div className="ipa-desc">diftong "ou"</div>
                  <div className="ipa-ex">don't /doʊnt/</div>
                </div>
              </div>
            </div>
          </div>

          <div className="tip-box">
            <div className="tip-label">Catatan untuk pelajar Indonesia</div>
            <div className="tip-text">
              Kontraksi mirip seperti kita bilang <strong>"nggak"</strong>{" "}
              daripada <strong>"tidak"</strong>, atau <strong>"gimana"</strong>{" "}
              daripada <strong>"bagaimana"</strong>. Bedanya: dalam bahasa
              Inggris, apostrof <strong>( ' )</strong> selalu ditulis untuk
              menandai huruf yang hilang.
              <span className="ok"> Boleh</span> dipakai dalam tulisan informal
              dan percakapan.
              <span className="warn"> Hindari</span> dalam tulisan akademik atau
              bisnis formal.
            </div>
          </div>
        </section>

        {/* ═══ SECTION 1: TO BE ════════════════════════════════ */}
        <section className={`section ${activeTab === 1 ? "active" : ""}`}>
          <div className="sec-header">
            <div className="sec-num">01</div>
            <div className="sec-info">
              <div className="sec-title">Kontraksi "To Be"</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">/tuː biː/</span>
                <span className="ipa-chip">/ɪz/ · /ɑːr/ · /æm/</span>
                <span className="ipa-dialect">General American</span>
              </div>
              <div className="sec-subtitle">
                Kata kerja is / are / am dipersingkat ke 's / 're / 'm —
                kategori paling sering dipakai sehari-hari.
              </div>
            </div>
          </div>

          <div className="level-row">
            <span className="badge badge-formal">Formal tulis</span>
            <span className="badge badge-informal">Informal</span>
          </div>

          <div className="pattern-grid">
            <div className="pattern-cell">
              <div className="p-label">'s = is — orang ke-3 tunggal</div>
              <div className="pill-wrap">
                {patternIs.map((item, i) => (
                  <button
                    key={i}
                    className="pill"
                    onClick={() => speak(item.word)}
                  >
                    <span>{item.word}</span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="pattern-cell">
              <div className="p-label">'re = are — jamak / you</div>
              <div className="pill-wrap">
                {patternAre.map((item, i) => (
                  <button
                    key={i}
                    className="pill"
                    onClick={() => speak(item.word)}
                  >
                    <span>{item.word}</span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="pattern-cell">
              <div className="p-label">'m = am — hanya I</div>
              <div className="pill-wrap">
                {patternAm.map((item, i) => (
                  <button
                    key={i}
                    className="pill"
                    onClick={() => speak(item.word)}
                  >
                    <span>{item.word}</span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setShowIpa(!showIpa)}
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              {showIpa ? "Hide IPA / Phonetics" : "Show IPA / Phonetics"}
            </button>
            <button
              onClick={() =>
                playSequence(
                  sec1Examples.map((item: any, idx: number) => ({
                    id: `sec1-${idx}`,
                    texts: [item.en, item.contract, item.after],
                  })),
                )
              }
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              <Play size={14} /> Play All
            </button>
          </div>
          <table className="ex-table">
            <thead>
              <tr>
                <th>Formal Sentence</th>
                <th>Contraction</th>
                <th>Contracted Sentence</th>
              </tr>
            </thead>
            <tbody>
              {sec1Examples.map((item, idx) => (
                <tr
                  key={idx}
                  id={`sec1-${idx}`}
                  className={
                    activeRowId === `sec1-${idx}`
                      ? "bg-[rgba(0,245,255,0.15)] transition-colors"
                      : "transition-colors"
                  }
                >
                  <td className="td-en">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight text={item.en} target={item.enTarget} />
                        <button
                          onClick={() => speak(item.en)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.en}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipaEn}
                              target={item.ipaEnTarget}
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-contract">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#ffb800]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight text={item.after} target={item.contract} />
                        <button
                          onClick={() => speak(item.after)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.after}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipa}
                              target={
                                item.ipaContract
                                  ? item.ipaContract.replace(/\//g, "")
                                  : undefined
                              }
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tip-box">
            <div className="tip-label">Jebakan umum — It's vs Its</div>
            <div className="tip-text">
              <span className="warn">It's</span> = <strong>It is</strong>{" "}
              (kontraksi). Contoh: <strong>"It's a cat"</strong>
              <br />
              <span className="ok">Its</span> = <strong>kepemilikan</strong>{" "}
              (tanpa apostrof). Contoh: <strong>"Its tail is long"</strong>
              <br />
              Ini salah satu kesalahan paling umum, bahkan di kalangan native
              speaker!
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: AUX VERBS ════════════════════════════ */}
        <section className={`section ${activeTab === 2 ? "active" : ""}`}>
          <div className="sec-header">
            <div className="sec-num">02</div>
            <div className="sec-info">
              <div className="sec-title">Kata Kerja Bantu</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">
                  /wɪl/ · /hæv/ · /hæz/ · /hæd/ · /wʊd/
                </span>
                <span className="ipa-dialect">General American</span>
              </div>
              <div className="sec-subtitle">
                Pemendekan will, have, has, had, would — mengekspresikan waktu
                dan pengalaman.
              </div>
            </div>
          </div>

          <div className="level-row">
            <span className="badge badge-formal">Formal</span>
            <span className="badge badge-informal">Informal</span>
          </div>

          <div className="pattern-grid">
            <div className="pattern-cell">
              <div className="p-label">'ll = will (masa depan)</div>
              <div className="pill-wrap">
                {patternWill.map((item, i) => (
                  <button
                    key={i}
                    className="pill"
                    onClick={() => speak(item.word)}
                  >
                    <span>
                      {item.word} {item.suffix}
                    </span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="pattern-cell">
              <div className="p-label">'ve / 's = have / has</div>
              <div className="pill-wrap">
                {patternHave.map((item, i) => (
                  <button
                    key={i}
                    className="pill"
                    onClick={() => speak(item.word)}
                  >
                    <span>
                      {item.word} {item.suffix}
                    </span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>
            </div>
            <div className="pattern-cell">
              <div className="p-label">'d = would atau had</div>
              <div className="pill-wrap">
                {patternWould.map((item, i) => (
                  <button
                    key={i}
                    className="pill"
                    onClick={() => speak(item.word)}
                  >
                    <span>
                      {item.word} {item.suffix}
                    </span>
                    {showIpa && <span className="pill-ipa">{item.ipa}</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setShowIpa(!showIpa)}
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              {showIpa ? "Hide IPA / Phonetics" : "Show IPA / Phonetics"}
            </button>
            <button
              onClick={() =>
                playSequence(
                  sec2Examples.map((item: any, idx: number) => ({
                    id: `sec2-${idx}`,
                    texts: [item.en, item.contract, item.after],
                  })),
                )
              }
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              <Play size={14} /> Play All
            </button>
          </div>
          <table className="ex-table">
            <thead>
              <tr>
                <th>Formal Sentence</th>
                <th>Contraction</th>
                <th>Contracted Sentence</th>
              </tr>
            </thead>
            <tbody>
              {sec2Examples.map((item, idx) => (
                <tr
                  key={idx}
                  id={`sec2-${idx}`}
                  className={
                    activeRowId === `sec2-${idx}`
                      ? "bg-[rgba(0,245,255,0.15)] transition-colors"
                      : "transition-colors"
                  }
                >
                  <td className="td-en">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight text={item.en} target={item.enTarget} />
                        <button
                          onClick={() => speak(item.en)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.en}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipaEn}
                              target={item.ipaEnTarget}
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-contract">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#ffb800]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight text={item.after} target={item.contract} />
                        <button
                          onClick={() => speak(item.after)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.after}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipa}
                              target={
                                item.ipaContract
                                  ? item.ipaContract.replace(/\//g, "")
                                  : undefined
                              }
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tip-box">
            <div className="tip-label">Cara Bedakan I'd = would vs had</div>
            <div className="tip-text">
              Lihat kata kerja setelahnya:
              <br />
              <strong className="ok">I'd go</strong> = <strong>would go</strong>{" "}
              (would + base verb / infinitive)
              <br />
              <strong className="ok">I'd gone</strong> ={" "}
              <strong>had gone</strong> (had + past participle)
              <br />
              <span className="warn">She's gone</span> bisa ={" "}
              <strong>has gone</strong> (present perfect), bukan "is gone" dalam
              konteks ini!
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: NEGATIF ══════════════════════════════ */}
        <section className={`section ${activeTab === 3 ? "active" : ""}`}>
          <div className="sec-header">
            <div className="sec-num">03</div>
            <div className="sec-info">
              <div className="sec-title">Kontraksi Negatif (not)</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">/nɑːt/ → /nt/</span>
                <span className="ipa-dialect">General American</span>
              </div>
              <div className="sec-subtitle">
                Semua bentuk n't — penyangkalan, larangan, dan ketidakmampuan.
              </div>
            </div>
          </div>

          <div className="level-row">
            <span className="badge badge-formal">Formal</span>
            <span className="badge badge-informal">Informal</span>
          </div>

          <div className="neg-cols">
            <div className="neg-group">
              <div className="neg-group-title">Present</div>
              {negPresent.map((item) => (
                <div key={item.word} className="neg-item">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="neg-word">{item.word}</span>
                      <button
                        onClick={() => speak(item.word)}
                        className="text-[#00b8c4] hover:text-[#00f5ff] cursor-pointer block"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    {showIpa && (
                      <div className="font-mono text-[0.75rem] text-[#00f5ff]">
                        <Highlight
                          text={item.ipa}
                          target={
                            item.ipaContract
                              ? item.ipaContract.replace(/\//g, "")
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="neg-group">
              <div className="neg-group-title">Past</div>
              {negPast.map((item) => (
                <div key={item.word} className="neg-item">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="neg-word">{item.word}</span>
                      <button
                        onClick={() => speak(item.word)}
                        className="text-[#00b8c4] hover:text-[#00f5ff] cursor-pointer block"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    {showIpa && (
                      <div className="font-mono text-[0.75rem] text-[#00f5ff]">
                        <Highlight
                          text={item.ipa}
                          target={
                            item.ipaContract
                              ? item.ipaContract.replace(/\//g, "")
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="neg-group">
              <div className="neg-group-title">Modal</div>
              {negModal.map((item) => (
                <div key={item.word} className="neg-item">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="neg-word">{item.word}</span>
                      <button
                        onClick={() => speak(item.word)}
                        className="text-[#00b8c4] hover:text-[#00f5ff] cursor-pointer block"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    {showIpa && (
                      <div className="font-mono text-[0.75rem] text-[#00f5ff]">
                        <Highlight
                          text={item.ipa}
                          target={
                            item.ipaContract
                              ? item.ipaContract.replace(/\//g, "")
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="neg-group">
              <div className="neg-group-title">Have / Has</div>
              {negHave.map((item) => (
                <div key={item.word} className="neg-item">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <span className="neg-word">{item.word}</span>
                      <button
                        onClick={() => speak(item.word)}
                        className="text-[#00b8c4] hover:text-[#00f5ff] cursor-pointer block"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>
                    {showIpa && (
                      <div className="font-mono text-[0.75rem] text-[#00f5ff]">
                        <Highlight
                          text={item.ipa}
                          target={
                            item.ipaContract
                              ? item.ipaContract.replace(/\//g, "")
                              : undefined
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setShowIpa(!showIpa)}
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              {showIpa ? "Hide IPA / Phonetics" : "Show IPA / Phonetics"}
            </button>
            <button
              onClick={() =>
                playSequence(
                  sec3Examples.map((item: any, idx: number) => ({
                    id: `sec3-${idx}`,
                    texts: [item.en, item.contract, item.after],
                  })),
                )
              }
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              <Play size={14} /> Play All
            </button>
          </div>
          <table className="ex-table">
            <thead>
              <tr>
                <th>Formal Sentence</th>
                <th>Contraction</th>
                <th>Contracted Sentence</th>
              </tr>
            </thead>
            <tbody>
              {sec3Examples.map((item, idx) => (
                <tr
                  key={idx}
                  id={`sec3-${idx}`}
                  className={
                    activeRowId === `sec3-${idx}`
                      ? "bg-[rgba(0,245,255,0.15)] transition-colors"
                      : "transition-colors"
                  }
                >
                  <td className="td-en">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight text={item.en} target={item.enTarget} />
                        <button
                          onClick={() => speak(item.en)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.en}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipaEn}
                              target={item.ipaEnTarget}
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-contract">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#ffb800]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight text={item.after} target={item.contract} />
                        <button
                          onClick={() => speak(item.after)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.after}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipa}
                              target={
                                item.ipaContract
                                  ? item.ipaContract.replace(/\//g, "")
                                  : undefined
                              }
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tip-box">
            <div className="tip-label">Ain't — informal wildcard</div>
            <div className="tip-text">
              <strong>Ain't</strong>{" "}
              <span
                className="ipa-chip"
                style={{ fontSize: "0.78rem", padding: "2px 8px" }}
              >
                /eɪnt/
              </span>{" "}
              adalah kontraksi informal yang bisa menggantikan:
              <strong>am not, aren't, isn't, haven't, hasn't, didn't</strong>.
              <br />
              <br />
              <span className="warn">JANGAN</span> pakai dalam tulisan akademik
              atau bisnis.
              <span className="ok">Aman</span> dipakai dalam percakapan santai,
              lagu, atau dialog fiksi.
              <br />
              Contoh: <strong>"I ain't done yet"</strong> = I haven't done yet /
              I'm not done yet.
            </div>
          </div>

          <div className="tip-box">
            <div className="tip-label">Won't = will not — irregular!</div>
            <div className="tip-text">
              <span className="warn">Bukan</span> <strong>"willn't"</strong> —
              melainkan <strong className="ok">won't</strong>{" "}
              <span
                className="ipa-chip"
                style={{ fontSize: "0.78rem", padding: "2px 8px" }}
              >
                /woʊnt/
              </span>
              . Satu-satunya negatif tidak regular. Hafalkan sebagai unit
              tersendiri.
            </div>
          </div>
        </section>

        {/* ═══ SECTION 4: INFORMAL ═════════════════════════════ */}
        <section className={`section ${activeTab === 4 ? "active" : ""}`}>
          <div className="sec-header">
            <div className="sec-num">04</div>
            <div className="sec-info">
              <div className="sec-title">Kontraksi Informal / Spoken</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">/ˈɪnfɔːrməl/ /ˈspoʊkən/</span>
                <span className="ipa-dialect">General American</span>
              </div>
              <div className="sec-subtitle">
                Hanya dalam bahasa lisan sehari-hari. Sering muncul di film,
                lagu, dan percakapan native speaker.
              </div>
            </div>
          </div>

          <div className="level-row">
            <span className="badge badge-spoken">
              Hanya lisan / spoken only
            </span>
          </div>

          <div className="informal-grid">
            {informalWords.map((item, idx) => (
              <div key={idx} className="informal-cell group">
                <div className="flex justify-between items-start">
                  <div className="inf-word">{item.word}</div>
                  <button
                    onClick={() => speak(item.word)}
                    className="p-1 rounded-full text-[#00b8c4] hover:text-[#00f5ff] hover:bg-[rgba(0,245,255,0.1)] transition-colors cursor-pointer block"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                <div className="inf-arrow">→</div>
                <div className="inf-full">{item.full}</div>
                {showIpa && (
                  <div className="inf-ipa border-0 pt-0 mt-0">
                    <Highlight
                      text={item.ipa}
                      target={
                        item.ipaContract
                          ? item.ipaContract.replace(/\//g, "")
                          : undefined
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => setShowIpa(!showIpa)}
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              {showIpa ? "Hide IPA / Phonetics" : "Show IPA / Phonetics"}
            </button>
            <button
              onClick={() =>
                playSequence(
                  informalSentences.map((item: any, idx: number) => ({
                    id: `inf-${idx}`,
                    texts: [item.formal, item.contract, item.informal],
                  })),
                )
              }
              className="flex items-center gap-2 px-3 py-1 rounded border border-[#00f5ff]/20 text-[#00f5ff] text-xs hover:bg-[#00f5ff]/20 transition-colors bg-[#00f5ff]/10"
            >
              <Play size={14} /> Play All
            </button>
          </div>
          <table className="ex-table">
            <thead>
              <tr>
                <th>Formal Sentence</th>
                <th>Contraction</th>
                <th>Contracted Sentence (Informal)</th>
              </tr>
            </thead>
            <tbody>
              {informalSentences.map((item, idx) => (
                <tr
                  key={idx}
                  id={`inf-${idx}`}
                  className={
                    activeRowId === `inf-${idx}`
                      ? "bg-[rgba(0,245,255,0.15)] transition-colors"
                      : "transition-colors"
                  }
                >
                  <td className="td-en">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight
                          text={item.formal}
                          target={item.formalTarget}
                        />
                        <button
                          onClick={() => speak(item.formal)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.formal}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipaEn}
                              target={item.ipaEnTarget}
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-contract">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#ffb800]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight
                          text={item.informal}
                          target={item.contract}
                        />
                        <button
                          onClick={() => speak(item.informal)}
                          className="text-[#00b8c4] hover:text-[#00f5ff] transition-colors cursor-pointer shrink-0"
                          title={`Play "${item.informal}"`}
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-mono text-[0.85rem] text-[#00f5ff]">
                            <Highlight
                              text={item.ipa}
                              target={
                                item.ipaContract
                                  ? item.ipaContract.replace(/\//g, "")
                                  : undefined
                              }
                            />
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="tip-box">
            <div className="tip-label">Tips Belajar — Latih Telinga Dulu</div>
            <div className="tip-text">
              Kontraksi informal ini sering muncul di{" "}
              <strong>film, serial TV, dan lagu</strong> berbahasa Inggris. Coba
              nonton tanpa subtitle — dengarkan apakah terdengar{" "}
              <strong className="ok">"gonna"</strong> atau{" "}
              <strong>"going to"</strong>.<br />
              <br />
              <span className="warn">JANGAN</span> pakai dalam{" "}
              <strong>tulisan formal, email bisnis, atau karya akademik</strong>
              . Cukup untuk percakapan santai dan pemahaman mendengar (listening
              comprehension).
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span style={{ color: "var(--cyan)" }}>
          // CONTRACTIONS MODULE_13 //
        </span>{" "}
        · General American English · IPA Transcription
      </footer>
    </>
  );
}
