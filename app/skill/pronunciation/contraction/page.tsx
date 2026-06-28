'use client';

/* eslint-disable react/no-unescaped-entities, react/jsx-no-comment-textnodes, @typescript-eslint/no-explicit-any */

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Volume2 } from "lucide-react";
import BackButton from "../../components/BackButton";
import Sidebar from "../../components/skillSidebar/SkillSidebar";
import { IpaVisibilityToggle, HighlightVisibilityToggle, ControlCenter, PlayStopButton } from "@/app/components";
import ButtonSavedProgress from "../../components/buttonSavedProgress/ButtonSavedProgress";
import { speakText, stopSpeech, waitForVoices } from "@/lib/tts/speech";
import "./contraction.css";

const Highlight = ({ text, target, active = true }: { text?: string; target?: string; active?: boolean }) => {
  if (!text) return null;
  if (!active || !target || !text.includes(target)) return <span>{text}</span>;
  // highlight first occurrence or all, let's replace all
  const parts = text.split(target);
  return (
    <span>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span 
              className="text-[#fb923c] font-black"
              style={{ textShadow: "0 0 8px rgba(251, 146, 60, 0.95), 0 0 16px rgba(251, 146, 60, 0.6)" }}
            >
              {target}
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
};

type PatternItem = {
  before?: string;
  beforeIpa?: string;
  word: string;
  ipa: string;
  suffix?: string;
};

type NegativeItem = {
  before?: string;
  beforeIpa?: string;
  word: string;
  ipa: string;
  ipaContract?: string;
};

type InformalWord = {
  word: string;
  full: string;
  ipa: string;
  ipaFull?: string;
  id: string;
  ipaContract?: string;
};

export default function ContractionPage() {
  const [isHighlightEnabled, setIsHighlightEnabled] = useState(true);
  const highlightTargetEnabled = true;
  const [activeTab, setActiveTab] = useState(0);
  const [showIpa, setShowIpa] = useState(true);
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePillGroup, setActivePillGroup] = useState<string | null>(null);
  const [activeSequence, setActiveSequence] = useState<string | null>(null);
  const [activePillId, setActivePillId] = useState<string | null>(null);
  const [savedProgress, setSavedProgress] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle hydration
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
      setSavedProgress(currentProgress.contraction != null);
      setIsClient(true);
    }
  }, []);

  const handleSaveProgress = async (percentage: number) => {
    if (typeof window === 'undefined') return;
    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem('pronunciationProgress') || '{}',
    ) as Record<string, number>;
    pronunciationProgress.contraction = percentage;
    window.localStorage.setItem('pronunciationProgress', JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem('dashboardProgress') || '{}',
    ) as Record<string, number>;
    const allProgress = Object.values(pronunciationProgress);
    dashboardProgress.pronunciation = Math.round(
      allProgress.reduce((sum, val) => sum + val, 0) / allProgress.length,
    );
    window.localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
    setSavedProgress(true);
  };

  const handleUnsaveProgress = async () => {
    if (typeof window === 'undefined') return;
    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem('pronunciationProgress') || '{}',
    ) as Record<string, number>;
    delete pronunciationProgress.contraction;
    window.localStorage.setItem('pronunciationProgress', JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem('dashboardProgress') || '{}',
    ) as Record<string, number>;
    if (Object.keys(pronunciationProgress).length > 0) {
      const allProgress = Object.values(pronunciationProgress);
      dashboardProgress.pronunciation = Math.round(
        allProgress.reduce((sum, val) => sum + val, 0) / allProgress.length,
      );
    } else {
      delete dashboardProgress.pronunciation;
    }
    window.localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
    setSavedProgress(false);
  };

  // Helper dictionary arrays
  const tabs = [
    "00 · Dasar",
    "01 · To Be",
    "02 · Aux Verbs",
    "03 · Negatif",
    "04 · Informal",
  ];

  // ============================================================
  // TTS functions untuk ContractionPage
  // Menggunakan speech.ts dengan contentType support
  // ============================================================
  const playIdRef = useRef(0);

  // ── SPEAK SINGLE (pill, tabel individual) ──────────────────
  // Auto-detect contentType berdasarkan jumlah kata:
  // - 1 kata → 'contraction' (rate 0.85, apostrophe fix)
  // - >1 kata → 'sentence' (rate 0.95)
  const speak = async (text: string) => {
    // Stop any running Play All sequence
    playIdRef.current += 1;
    setActiveRowId(null);
    setActivePillGroup(null);
    setActivePillId(null);
    stopSpeech();

    const wordCount = text.trim().split(/\s+/).length;
    const contentType = wordCount === 1 ? 'contraction' : 'sentence';

    await speakText(text, {
      preferredEnglish: 'en-US',
      contentType, // ✅ Auto rate + preprocessing
      cancelBeforeSpeak: true,
    });
  };

  // ── PLAY SEQUENCE (Play All) ────────────────────────────────
  // Perbaikan utama:
  // 1. cancelBeforeSpeak: true — AMAN dalam sequence karena await
  // 2. Auto contentType detection per item
  // 3. Tidak ada overlap utterance
  const playSequence = async (sequenceId: string, items: { id: string; texts: string[] }[]) => {
    playIdRef.current += 1;
    setActivePillGroup(null);
    setActivePillId(null);
    
    if (activeSequence === sequenceId) {
      setActiveSequence(null);
      stopSpeech();
      return;
    }
    
    const currentId = playIdRef.current;
    setActiveSequence(sequenceId);

    stopSpeech();
    await new Promise((r) => setTimeout(r, 150));

    if (playIdRef.current !== currentId) return;

    for (const item of items) {
      if (playIdRef.current !== currentId) return;

      setActiveRowId(item.id);

      setTimeout(() => {
        const el = document.getElementById(item.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);

      for (const text of item.texts) {
        if (playIdRef.current !== currentId) return;

        const wordCount = text.trim().split(/\s+/).length;
        const contentType = wordCount === 1 ? 'contraction' : 'sentence';

        await speakText(text, {
          preferredEnglish: 'en-US',
          contentType, // ✅ Auto rate + preprocessing
          cancelBeforeSpeak: true, // ✅ AMAN karena await
        });

        if (playIdRef.current !== currentId) return;
        await new Promise((r) => setTimeout(r, 600));
      }

      if (playIdRef.current !== currentId) return;
      await new Promise((r) => setTimeout(r, 300));
    }

    if (playIdRef.current === currentId) {
      setActiveRowId(null);
      setActiveSequence(null);
    }
  };

  // ── PLAY PILL GROUP (Play All for pattern pills) ────────────
  const playPillGroup = async (groupId: string, items: { id: string; before?: string; word: string }[]) => {
    playIdRef.current += 1;
    setActiveSequence(null);

    if (activePillGroup === groupId) {
      // Stop if same group clicked again
      playIdRef.current += 1;
      setActivePillGroup(null);
      setActivePillId(null);
      setActiveRowId(null);
      stopSpeech();
      return;
    }

    playIdRef.current += 1;
    const currentId = playIdRef.current;
    setActivePillGroup(groupId);
    setActivePillId(null);
    setActiveRowId(null);
    stopSpeech();
    await new Promise((r) => setTimeout(r, 100));

    for (let i = 0; i < items.length; i++) {
      if (playIdRef.current !== currentId) return;
      const pillId = items[i].id;
      setActivePillId(pillId);
      setTimeout(() => {
        const el = document.getElementById(pillId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);

      if (items[i].before) {
        await speakText(items[i].before || "", {
          preferredEnglish: 'en-US',
          contentType: 'sentence', // treat as a standard phrase
          cancelBeforeSpeak: true,
        });
        if (playIdRef.current !== currentId) return;
        await new Promise((r) => setTimeout(r, 400));
      }

      await speakText(items[i].word, {
        preferredEnglish: 'en-US',
        contentType: 'contraction',
        cancelBeforeSpeak: true,
      });
      if (playIdRef.current !== currentId) return;
      await new Promise((r) => setTimeout(r, 600));
    }

    if (playIdRef.current === currentId) {
      setActivePillGroup(null);
      setActivePillId(null);
    }
  };


  // ── USE EFFECT ──────────────────────────────────────────────
  useEffect(() => {
    void waitForVoices();

    return () => {
      playIdRef.current += 1;
      stopSpeech();
      setActiveRowId(null);
    };
  }, []);

  const patternWill: PatternItem[] = [
    { before: "I will", beforeIpa: "/aɪ wɪl/", word: "I'll", ipa: "/aɪl/" },
    { before: "You will", beforeIpa: "/ju wɪl/", word: "You'll", ipa: "/juːl/" },
    { before: "They will", beforeIpa: "/ðeɪ wɪl/", word: "They'll", ipa: "/ðeɪl/" },
    { before: "She will", beforeIpa: "/ʃi wɪl/", word: "She'll", ipa: "/ʃiːl/" },
    { before: "What will", beforeIpa: "/wɑt wɪl/", word: "What'll", ipa: "/ˈwɑːtəl/" },
    { before: "This will", beforeIpa: "/ðɪs wɪl/", word: "This'll", ipa: "/ˈðɪsəl/" },
    { before: "That will", beforeIpa: "/ðæt wɪl/", word: "That'll", ipa: "/ˈðætəl/" },
  ];

  const patternHave: PatternItem[] = [
    { before: "I have", beforeIpa: "/aɪ hæv/", word: "I've", ipa: "/aɪv/" },
    { before: "They have", beforeIpa: "/ðeɪ hæv/", word: "They've", ipa: "/ðeɪv/" },
    { before: "She has", beforeIpa: "/ʃi hæz/", word: "She's", suffix: "(has)", ipa: "/ʃiːz/" },
    { before: "It has", beforeIpa: "/ɪt hæz/", word: "It's", suffix: "(has)", ipa: "/ɪts/" },
    { before: "What have", beforeIpa: "/wɑt hæv/", word: "What've", ipa: "/ˈwɑːtəv/" },
  ];

  const patternWould: PatternItem[] = [
    { before: "I would", beforeIpa: "/aɪ wʊd/", word: "I'd", suffix: "(would)", ipa: "/aɪd/" },
    { before: "I had", beforeIpa: "/aɪ hæd/", word: "I'd", suffix: "(had)", ipa: "/aɪd/" },
    { before: "She would", beforeIpa: "/ʃi wʊd/", word: "She'd", suffix: "(would)", ipa: "/ʃiːd/" },
    { before: "She had", beforeIpa: "/ʃi hæd/", word: "She'd", suffix: "(had)", ipa: "/ʃiːd/" },
  ];

  const patternIs: PatternItem[] = [
    { before: "She is", beforeIpa: "/ʃi ɪz/", word: "She's", ipa: "/ʃiːz/" },
    { before: "He is", beforeIpa: "/hi ɪz/", word: "He's", ipa: "/hiːz/" },
    { before: "It is", beforeIpa: "/ɪt ɪz/", word: "It's", ipa: "/ɪts/" },
    { before: "What is", beforeIpa: "/wɑt ɪz/", word: "What's", ipa: "/wɑts/" },
    { before: "How is", beforeIpa: "/haʊ ɪz/", word: "How's", ipa: "/haʊz/" },
    { before: "When is", beforeIpa: "/wɛn ɪz/", word: "When's", ipa: "/wɛnz/" },
    { before: "That is", beforeIpa: "/ðæt ɪz/", word: "That's", ipa: "/ðæts/" },
  ];

  const patternAre: PatternItem[] = [
    { before: "You are", beforeIpa: "/ju ɑr/", word: "You're", ipa: "/jʊr/" },
    { before: "They are", beforeIpa: "/ðeɪ ɑr/", word: "They're", ipa: "/ðɛr/" },
    { before: "We are", beforeIpa: "/wi ɑr/", word: "We're", ipa: "/wɪr/" },
    { before: "What are", beforeIpa: "/wɑt ɑr/", word: "What're", ipa: "/ˈwɑtər/" },
    { before: "When are", beforeIpa: "/wɛn ɑr/", word: "When're", ipa: "/ˈwɛnər/" },
    { before: "Where are", beforeIpa: "/wɛr ɑr/", word: "Where're", ipa: "/ˈwɛrər/" },
    { before: "How are", beforeIpa: "/haʊ ɑr/", word: "How're", ipa: "/ˈhaʊ.ər/" },
  ];

  const patternAm: PatternItem[] = [{ before: "I am", beforeIpa: "/aɪ æm/", word: "I'm", ipa: "/aɪm/" }];

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

  const informalWords: InformalWord[] = [
    { word: "Gimme", full: "give me", ipaFull: "/ɡɪv mi/", ipa: "/ˈɡɪmi/", id: "kasih aku" },
    { word: "Lemme", full: "let me", ipaFull: "/lɛt mi/", ipa: "/ˈlɛmi/", id: "biarkan aku" },
    { word: "Wanna", full: "want to", ipaFull: "/wɑnt tʊ/", ipa: "/ˈwɑːnə/", id: "mau / ingin" },
    { word: "Gonna", full: "going to", ipaFull: "/ˈɡoʊɪŋ tʊ/", ipa: "/ˈɡʌnə/", id: "akan / mau" },
    { word: "Tryna", full: "trying to", ipaFull: "/ˈtraɪɪŋ tʊ/", ipa: "/ˈtraɪnə/", id: "mencoba untuk" },
    { word: "Hafta", full: "have to", ipaFull: "/hæv tʊ/", ipa: "/ˈhæftə/", id: "harus" },
    { word: "Hasta", full: "has to", ipaFull: "/hæz tʊ/", ipa: "/ˈhæstə/", id: "harus (dia)" },
    { word: "Y'all", full: "you all", ipaFull: "/juː ɔːl/", ipa: "/jɔːl/", id: "kalian semua" },
    {
      word: "Woulda",
      full: "would have",
      ipaFull: "/wʊd hæv/",
      ipa: "/ˈwʊdə/",
      id: "seharusnya sudah",
    },
    {
      word: "Shoulda",
      full: "should have",
      ipaFull: "/ʃʊd hæv/",
      ipa: "/ˈʃʊdə/",
      id: "seharusnya sudah",
    },
    {
      word: "Coulda",
      full: "could have",
      ipaFull: "/kʊd hæv/",
      ipa: "/ˈkʊdə/",
      id: "bisa saja sudah",
    },
    { word: "Dunno", full: "don't know", ipaFull: "/doʊnt noʊ/", ipa: "/dəˈnoʊ/", id: "nggak tahu" },
    { word: "D'yu", full: "do you", ipaFull: "/duː juː/", ipa: "/djuː/", id: "apakah kamu" },
    {
      word: "Imma",
      full: "I'm going to",
      ipaFull: "/aɪm ˈɡoʊɪŋ tʊ/",
      ipa: "/ˈaɪmə/",
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
      informal: "I dunno the answer",
      ipaContract: "/dəˈnoʊ/",
      ipa: "/aɪ dəˈnoʊ ði ˈænsər/",
      ipaEn: "/aɪ doʊnt noʊ ði ˈænsər/",
      ipaEnTarget: "doʊnt noʊ ði ˈænsər",
    },
    {
      formal: "I'm going to do it now",
      formalTarget: "I'm going to",
      contract: "Imma",
      informal: "Imma do it now",
      ipaContract: "/ˈaɪmə/",
      ipa: "/ˈaɪmə duː ɪt naʊ/",
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

  const negPresent: NegativeItem[] = [
    { before: "do not", beforeIpa: "/du nɑt/", word: "Don't", ipa: "/doʊnt/" },
    { before: "does not", beforeIpa: "/dʌz nɑt/", word: "Doesn't", ipa: "/ˈdʌzənt/" },
    { before: "is not", beforeIpa: "/ɪz nɑt/", word: "Isn't", ipa: "/ˈɪzənt/" },
    { before: "are not", beforeIpa: "/ɑr nɑt/", word: "Aren't", ipa: "/ɑːrnt/" },
    { before: "can not", beforeIpa: "/kæn nɑt/", word: "Can't", ipa: "/kænt/" },
  ];
  const negPast: NegativeItem[] = [
    { before: "did not", beforeIpa: "/dɪd nɑt/", word: "Didn't", ipa: "/ˈdɪdənt/" },
    { before: "was not", beforeIpa: "/wɑz nɑt/", word: "Wasn't", ipa: "/ˈwɑːzənt/" },
    { before: "were not", beforeIpa: "/wɝ nɑt/", word: "Weren't", ipa: "/wɚrnt/" },
    { before: "had not", beforeIpa: "/hæd nɑt/", word: "Hadn't", ipa: "/ˈhædənt/" },
  ];
  const negModal: NegativeItem[] = [
    { before: "will not", beforeIpa: "/wɪl nɑt/", word: "Won't", ipa: "/woʊnt/" },
    { before: "would not", beforeIpa: "/wʊd nɑt/", word: "Wouldn't", ipa: "/ˈwʊdənt/" },
    { before: "could not", beforeIpa: "/kʊd nɑt/", word: "Couldn't", ipa: "/ˈkʊdənt/" },
    { before: "should not", beforeIpa: "/ʃʊd nɑt/", word: "Shouldn't", ipa: "/ˈʃʊdənt/" },
    { before: "must not", beforeIpa: "/mʌst nɑt/", word: "Mustn't", ipa: "/ˈmʌsənt/" },
  ];
  const negHave: NegativeItem[] = [
    { before: "have not", beforeIpa: "/hæv nɑt/", word: "Haven't", ipa: "/ˈhævənt/" },
    { before: "has not", beforeIpa: "/hæz nɑt/", word: "Hasn't", ipa: "/ˈhæzənt/" },
  ];

  const renderPatternList = (items: (PatternItem | NegativeItem)[], prefixId: string) => (
    <div className="flex flex-col gap-3 mt-3 w-full md:max-w-xl">
      {items.map((item, i) => {
        const id = `pill-${prefixId}-${i}`;
        const isActive = activePillId === id;
        return (
          <div
            key={i}
            id={id}
            className={`flex flex-col p-3 rounded-xl border transition-all ${
              isActive 
                ? 'bg-[#fb923c]/10 border-[#fb923c]/40 shadow-[0_0_15px_rgba(251,146,60,0.1)]' 
                : 'bg-black/20 border-white/10 hover:border-white/20'
            }`}
          >
            {/* Before (Original) */}
            <div className="flex flex-col mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white/70 font-medium text-sm">{item.before}</span>
                  <span className="text-[9px] uppercase font-bold text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Before</span>
                </div>
                <button
                  onClick={() => speak(item.before || "")}
                  className={`p-1.5 rounded-full transition-colors shrink-0 ${
                    isActive ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                  }`}
                  aria-label={`Play ${item.before}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {showIpa && item.beforeIpa && (
                <span className="text-[#00f5ff] opacity-80 font-mono text-[11px] mt-0.5">{item.beforeIpa}</span>
              )}
            </div>

            {/* After (Contraction) */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[#fb923c] font-bold text-base">{item.word}</span>
                    {('suffix' in item && item.suffix) && <span className="text-white/40 text-xs ml-1">{item.suffix}</span>}
                  </div>
                  <span className="text-[9px] uppercase font-bold text-[#fb923c]/60 bg-[#fb923c]/10 px-1.5 py-0.5 rounded">After</span>
                </div>
                <button
                  onClick={() => speak(item.word)}
                  className={`p-1.5 rounded-full transition-colors shrink-0 ${
                    isActive ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                  }`}
                  aria-label={`Play ${item.word}`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
              {showIpa && <span className="text-[#00f5ff] font-mono text-sm">{item.ipa}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="contraction-page min-h-screen">
      <div className="fixed top-4 left-4 z-[120]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <ControlCenter
        topControls={
          <div className="flex flex-col gap-4">
            <IpaVisibilityToggle checked={showIpa} onChange={setShowIpa} className="w-full flex justify-between text-[10px] sm:text-xs" />
            <HighlightVisibilityToggle
              checked={isHighlightEnabled}
              onChange={setIsHighlightEnabled}
              color="orange"
              label="Highlight Contraction"
            />
          </div>
        }
        bottomControls={
          activeTab !== 0 && (
            <div className="flex flex-col gap-2">

              {activeTab === 1 && (
                <>
                  <PlayStopButton
                    isActive={activePillGroup === 'allToBe'}
                    label="ALL TO BE"
                    onClick={() => void playPillGroup('allToBe', [
                      ...patternIs.map((i, idx) => ({ id: `pill-patternIs-${idx}`, before: i.before, word: i.word })),
                      ...patternAre.map((i, idx) => ({ id: `pill-patternAre-${idx}`, before: i.before, word: i.word })),
                      ...patternAm.map((i, idx) => ({ id: `pill-patternAm-${idx}`, before: i.before, word: i.word }))
                    ])}
                    size="sm"
                    sectionId=""
                  />
                  <PlayStopButton
                    isActive={activeSequence === 'sec1'}
                    label="SENTENCES"
                    onClick={() => playSequence('sec1', sec1Examples.map((item: any, idx: number) => ({ id: `sec1-${idx}`, texts: [item.en, item.contract, item.after] })))}
                    size="sm"
                    sectionId=""
                  />
                </>
              )}
              {activeTab === 2 && (
                <>
                  <PlayStopButton
                    isActive={activePillGroup === 'allWillHaveWould'}
                    label="ALL (WILL, HAVE, WOULD)"
                    onClick={() => void playPillGroup('allWillHaveWould', [
                      ...patternWill.map((i, idx) => ({ id: `pill-patternWill-${idx}`, before: i.before, word: i.word })),
                      ...patternHave.map((i, idx) => ({ id: `pill-patternHave-${idx}`, before: i.before, word: i.word })),
                      ...patternWould.map((i, idx) => ({ id: `pill-patternWould-${idx}`, before: i.before, word: i.word }))
                    ])}
                    size="sm"
                    sectionId=""
                  />
                  <PlayStopButton
                    isActive={activeSequence === 'sec2'}
                    label="SENTENCES"
                    onClick={() => playSequence('sec2', sec2Examples.map((item: any, idx: number) => ({ id: `sec2-${idx}`, texts: [item.en, item.contract, item.after] })))}
                    size="sm"
                    sectionId=""
                  />
                </>
              )}
              {activeTab === 3 && (
                <>
                  <PlayStopButton
                    isActive={activePillGroup === 'allNegatives'}
                    label="ALL NEGATIVES"
                    onClick={() => void playPillGroup('allNegatives', [
                      ...negPresent.map((i, idx) => ({ id: `pill-negPresent-${idx}`, before: i.before, word: i.word })),
                      ...negPast.map((i, idx) => ({ id: `pill-negPast-${idx}`, before: i.before, word: i.word })),
                      ...negModal.map((i, idx) => ({ id: `pill-negModal-${idx}`, before: i.before, word: i.word })),
                      ...negHave.map((i, idx) => ({ id: `pill-negHave-${idx}`, before: i.before, word: i.word }))
                    ])}
                    size="sm"
                    sectionId=""
                  />
                  <PlayStopButton
                    isActive={activeSequence === 'sec3'}
                    label="SENTENCES"
                    onClick={() => playSequence('sec3', sec3Examples.map((item: any, idx: number) => ({ id: `sec3-${idx}`, texts: [item.en, item.contract, item.after] })))}
                    size="sm"
                    sectionId=""
                  />
                </>
              )}
              {activeTab === 4 && (
                <>
                  <PlayStopButton
                    isActive={activePillGroup === 'informalWords'}
                    label="WORDS"
                    onClick={() => void playPillGroup('informalWords', informalWords.map((i, idx) => ({ id: `pill-informalWords-${idx}`, before: i.full, word: i.word })))}
                    size="sm"
                  />
                  <PlayStopButton
                    isActive={activeSequence === 'informal'}
                    label="SENTENCES"
                    onClick={() => playSequence('informal', informalSentences.map((item: any, idx: number) => ({ id: `inf-${idx}`, texts: [item.formal, item.contract, item.informal] })))}
                    size="sm"
                  />
                </>
              )}
            </div>
          )
        }
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      {/* HERO */}
      <header className="hero">
        <div className="hero-glow"></div>
        <h1 className="hero-title">
          CON<span>TRAC</span>TIONS
        </h1>
        <div className="hero-ipa">/kənˈtrækʃənz/</div>

      </header>

      {/* NAV */}
      <nav className="nav-bar items-center gap-2 py-2 px-3 bg-black/40 border-b border-[#2d5560]/30 sticky top-0 z-40 backdrop-blur-md overflow-x-auto hide-scrollbar">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${activeTab === idx ? "bg-[#00b8c4] text-[#0d2028]" : "bg-[#00f5ff]/5 text-[#a5d8df] hover:bg-[#00f5ff]/10 hover:text-[#f0fdfa]"}`}
            onClick={() => {
              setActiveTab(idx);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* SAVE PROGRESS BUTTON */}
      <div className="flex justify-center py-4 px-3">
        {isClient && (
          <ButtonSavedProgress
            isSaved={savedProgress}
            onSave={(percentage) => handleSaveProgress(percentage)}
            onUnsave={handleUnsaveProgress}
            size="small"
            variant="primary"
            topicName="Contraction"
          />
        )}
      </div>

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

              </div>
              <div className="sec-subtitle">
                Memahami apa itu kontraksi dan bagaimana cara kerjanya dalam
                bahasa Inggris.
              </div>
            </div>
          </div>



          <div className="mt-8 mb-6 p-4 sm:p-6 bg-black/40 border border-[#00f5ff]/20 rounded-xl max-w-4xl">
            <h2 className="text-xl font-bold text-[#00f5ff] mb-4 border-b border-[#00f5ff]/20 pb-2">
              ABBREVIATION (Pemendekan Kata)
            </h2>
            
            <div className="mb-6">
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Ini adalah istilah umum untuk semua bentuk kata atau frasa yang dipendekkan. Apapun jenis pemendekannya, bahasa Inggris menyebutnya sebagai <span className="text-[#00f5ff] font-medium">abbreviation</span>.
              </p>
              <p className="text-white/80 text-sm sm:text-base mt-2">Di bawah Abbreviation, terbagi menjadi 4 kategori utama:</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="bg-[#00f5ff]/5 p-4 rounded-lg border border-[#00f5ff]/10">
                <h4 className="font-bold text-[#fb923c] mb-2 flex items-center gap-2">
                  <span className="bg-[#fb923c]/20 text-[#fb923c] w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">A</span>
                  Initialism (Singkatan Huruf)
                </h4>
                <div className="text-sm text-white/70 space-y-2">
                  <p><strong className="text-white/90">Konsep:</strong> Mengambil huruf pertama dari serangkaian kata, dan cara membacanya <strong className="text-white">dieja per huruf</strong>.</p>
                  <p><strong className="text-white/90">Padanan di Indonesia:</strong> Singkatan (seperti KTP, PP, DPR).</p>
                  <div>
                    <strong className="text-white/90">Contoh Inggris:</strong>
                    <ul className="list-disc pl-5 mt-1 text-white/60 space-y-1">
                      <li>FBI (dibaca F-B-I, bukan "Febi")</li>
                      <li>VIP (dibaca V-I-P)</li>
                      <li>ATM (dibaca A-T-M)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#00f5ff]/5 p-4 rounded-lg border border-[#00f5ff]/10">
                <h4 className="font-bold text-[#fb923c] mb-2 flex items-center gap-2">
                  <span className="bg-[#fb923c]/20 text-[#fb923c] w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">B</span>
                  Acronym (Akronim)
                </h4>
                <div className="text-sm text-white/70 space-y-2">
                  <p><strong className="text-white/90">Konsep:</strong> Mengambil huruf pertama dari serangkaian kata, tapi cara membacanya <strong className="text-white">digabung menjadi satu kata baru yang utuh</strong>.</p>
                  <p><strong className="text-white/90">Padanan di Indonesia:</strong> Akronim (seperti Pemkab, Sinetron).</p>
                  <div>
                    <strong className="text-white/90">Contoh Inggris:</strong>
                    <ul className="list-disc pl-5 mt-1 text-white/60 space-y-1">
                      <li>NASA (dibaca "Nasa", bukan N-A-S-A)</li>
                      <li>FOMO (Fear Of Missing Out - dibaca "Fomo")</li>
                      <li>SCUBA (Self-Contained Underwater Breathing Apparatus - dibaca "Skuba")</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#00b8c4]/15 p-4 rounded-lg border border-[#00b8c4]/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#00b8c4] text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">Fokus Kita</div>
                <h4 className="font-bold text-[#00f5ff] mb-2 flex items-center gap-2">
                  <span className="bg-[#00f5ff]/20 text-[#00f5ff] w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">C</span>
                  Contraction (Peleburan Lisan)
                </h4>
                <div className="text-sm text-white/80 space-y-2">
                  <p><strong className="text-white">Konsep:</strong> Menggabungkan dua kata atau memendekkan satu kata dengan membuang (melesapkan) huruf/bunyi tertentu di tengah. Dalam teks formal ditandai dengan apostrof ( ' ). Tujuannya murni untuk <strong className="text-[#00f5ff]">mempercepat dan memuluskan aliran bicara</strong> (spoken English).</p>
                  <p><strong className="text-white">Padanan di Indonesia:</strong> Bahasa lisan sehari-hari (tidak ada → tiada, bagaimana → gimana).</p>
                  <div>
                    <strong className="text-white">Contoh Inggris:</strong>
                    <ul className="list-disc pl-5 mt-1 text-white/70 space-y-1">
                      <li>Do not → Don't</li>
                      <li>Going to → Gonna</li>
                      <li>Let me → Lemme</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-[#00f5ff]/5 p-4 rounded-lg border border-[#00f5ff]/10">
                <h4 className="font-bold text-[#fb923c] mb-2 flex items-center gap-2">
                  <span className="bg-[#fb923c]/20 text-[#fb923c] w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0">D</span>
                  Clipping (Pemotongan)
                </h4>
                <div className="text-sm text-white/70 space-y-2">
                  <p><strong className="text-white/90">Konsep:</strong> Memotong bagian depan, belakang, atau tengah dari satu kata yang panjang agar lebih ringkas digunakan sehari-hari, <strong className="text-white">tanpa mengubah maknanya</strong>.</p>
                  <div>
                    <strong className="text-white/90">Contoh Inggris:</strong>
                    <ul className="list-disc pl-5 mt-1 text-white/60 space-y-1">
                      <li>Advertisement dipotong menjadi Ad</li>
                      <li>Influenza dipotong menjadi Flu</li>
                      <li>Application dipotong menjadi App</li>
                      <li>Gymnasium dipotong menjadi Gym</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-lg border-l-4 border-[#00f5ff]">
              <h4 className="font-bold text-white mb-2">Kesimpulan Workflow</h4>
              <p className="text-sm text-white/80 mb-3">
                <strong>Abbreviation</strong> adalah "rumah besar"nya. Saat Anda masuk ke dalam rumah tersebut, Anda bisa memilih cara memendekkan kata sesuai kebutuhan:
              </p>
              <ul className="text-sm text-white/70 space-y-2 pl-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#fb923c] font-bold mt-0.5">▶</span>
                  <span>Mau dieja per huruf? Gunakan <strong className="text-white">Initialism</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#fb923c] font-bold mt-0.5">▶</span>
                  <span>Mau dibaca jadi kata baru? Gunakan <strong className="text-white">Acronym</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#fb923c] font-bold mt-0.5">▶</span>
                  <span>Mau memotong kata yang terlalu panjang? Gunakan <strong className="text-white">Clipping</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00f5ff] font-bold mt-0.5">▶</span>
                  <span>Mau bicara lebih cepat layaknya native speaker? Gunakan <strong className="text-white">Contraction</strong>.</span>
                </li>
              </ul>
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
              <div className="sec-title">Bentuk Pendek "To Be"</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">/tuː biː/</span>
                <span className="ipa-chip">/ɪz/ · /ɑːr/ · /æm/</span>

              </div>
              <div className="sec-subtitle">
                Kata kerja is / are / am dipersingkat ke 's / 're / 'm <br />
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
              <div className="flex items-center justify-between mb-2">
                <div className="p-label" style={{marginBottom: 0}}>'s = is — orang ke-3 tunggal</div>
              </div>
              {renderPatternList(patternIs, 'patternIs')}
            </div>
            <div className="pattern-cell">
              <div className="flex items-center justify-between mb-2">
                <div className="p-label" style={{marginBottom: 0}}>'re = are — jamak / you</div>
              </div>
              {renderPatternList(patternAre, 'patternAre')}
            </div>
            <div className="pattern-cell">
              <div className="flex items-center justify-between mb-2">
                <div className="p-label" style={{marginBottom: 0}}>'m = am — hanya I</div>
              </div>
              {renderPatternList(patternAm, 'patternAm')}
            </div>
          </div>

          {/* sec1Examples Play All moved to ControlCenter */}
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
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled} text={item.en} target={item.enTarget} />
                        <button
                          onClick={() => speak(item.en)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec1-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.en}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
                        <span className="font-semibold text-[#fb923c]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec1-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled} text={item.after} target={item.contract} />
                        <button
                          onClick={() => speak(item.after)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec1-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.after}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
              <div className="sec-title">Bentuk Pendek Kata Kerja Bantu</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">
                  /wɪl/ · /hæv/ · /hæz/ · /hæd/ · /wʊd/
                </span>

              </div>
              <div className="sec-subtitle">
                Pemendekan will, have, has, had, would <br /> mengekspresikan waktu
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
              <div className="flex items-center justify-between mb-2">
                <div className="p-label" style={{marginBottom: 0}}>'ll = will (masa depan)</div>
              </div>
              {renderPatternList(patternWill, 'patternWill')}
            </div>
            <div className="pattern-cell">
              <div className="flex items-center justify-between mb-2">
                <div className="p-label" style={{marginBottom: 0}}>'ve / 's = have / has</div>
              </div>
              {renderPatternList(patternHave, 'patternHave')}
            </div>
            <div className="pattern-cell">
              <div className="flex items-center justify-between mb-2">
                <div className="p-label" style={{marginBottom: 0}}>'d = would atau had</div>
              </div>
              {renderPatternList(patternWould, 'patternWould')}
            </div>
          </div>

          {/* sec2Examples Play All moved to ControlCenter */}
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
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled} text={item.en} target={item.enTarget} />
                        <button
                          onClick={() => speak(item.en)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec2-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.en}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
                        <span className="font-semibold text-[#fb923c]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec2-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled} text={item.after} target={item.contract} />
                        <button
                          onClick={() => speak(item.after)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec2-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.after}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
              <div className="sec-title">Bentuk Pendek Negatif (not)</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">/nɑːt/ → /nt/</span>

              </div>
              <div className="sec-subtitle">
                Semua bentuk n't <br /> penyangkalan, larangan, dan ketidakmampuan.
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
              {renderPatternList(negPresent, 'negPresent')}
            </div>
            <div className="neg-group">
              <div className="neg-group-title">Past</div>
              {renderPatternList(negPast, 'negPast')}
            </div>
            <div className="neg-group">
              <div className="neg-group-title">Modal</div>
              {renderPatternList(negModal, 'negModal')}
            </div>
            <div className="neg-group">
              <div className="neg-group-title">Have / Has</div>
              {renderPatternList(negHave, 'negHave')}
            </div>
          </div>

          {/* sec3Examples Play All moved to ControlCenter */}
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
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled} text={item.en} target={item.enTarget} />
                        <button
                          onClick={() => speak(item.en)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec3-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.en}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
                        <span className="font-semibold text-[#fb923c]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec3-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled} text={item.after} target={item.contract} />
                        <button
                          onClick={() => speak(item.after)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `sec3-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.after}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
              <div className="sec-title">Bentuk Pendek Informal / Spoken</div>
              <div className="sec-ipa-row">
                <span className="ipa-chip">/ˈɪnfɔːrməl/ /ˈspoʊkən/</span>

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {informalWords.map((item, idx) => {
              const isActive = activePillId === `pill-informalWords-${idx}`;
              return (
                <div
                  key={idx}
                  id={`pill-informalWords-${idx}`}
                  className={`flex flex-col gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    isActive 
                      ? 'border-[#00f5ff]/40 bg-[#00f5ff]/10 shadow-[0_0_15px_rgba(0,245,255,0.15)]' 
                      : 'border-white/10 bg-[#1a1a24]/80 hover:bg-[#1a1a24] hover:border-white/20'
                  }`}
                >
                  {/* Before */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="font-medium text-[1.1rem] text-white">
                        {item.full}
                      </span>
                      {showIpa && item.ipaFull && (
                        <span className="font-ipa text-[0.9rem] text-[#00f5ff] opacity-80">
                          {item.ipaFull}
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0">
                      <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-medium">Before</div>
                    </div>
                    <div className="flex shrink-0">
                      <button
                        onClick={() => speak(item.full)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isActive ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                        }`}
                        title={`Play "${item.full}"`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  {/* After */}
                  <div className="flex items-center justify-between gap-2 w-full">
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="font-bold text-[1.1rem] text-[#fb923c]">
                        {item.word}
                      </span>
                      {showIpa && (
                        <span className="font-ipa text-[0.9rem] text-[#00f5ff]">
                          {item.ipa}
                        </span>
                      )}
                    </div>
                    <div className="flex shrink-0">
                      <div className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#fb923c]/20 text-[#fb923c] font-medium">After</div>
                    </div>
                    <div className="flex shrink-0">
                      <button
                        onClick={() => speak(item.word)}
                        className={`p-1.5 rounded-full transition-colors ${
                          isActive ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                        }`}
                        title={`Play "${item.word}"`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* informalSentences Play All moved to ControlCenter */}
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
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled}
                          text={item.formal}
                          target={item.formalTarget}
                        />
                        <button
                          onClick={() => speak(item.formal)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `inf-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.formal}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
                        <span className="font-semibold text-[#fb923c]">
                          {item.contract}
                        </span>
                        <button
                          onClick={() => speak(item.contract)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `inf-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.contract}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            {item.ipaContract}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-after">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <Highlight active={isHighlightEnabled && highlightTargetEnabled}
                          text={item.informal}
                          target={item.contract}
                        />
                        <button
                          onClick={() => speak(item.informal)}
                          className={`p-1.5 rounded-full transition-colors shrink-0 ${
                            activeRowId === `inf-${idx}` ? 'bg-[#00f5ff]/10 text-[#00f5ff]' : 'bg-white/5 text-white hover:bg-[#00f5ff]/10 hover:text-[#00f5ff]'
                          }`}
                          title={`Play "${item.informal}"`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {showIpa && (
                        <div className="flex items-center gap-2 opacity-90 mt-1">
                          <span className="font-ipa text-[0.85rem] text-[#00f5ff]">
                            <Highlight active={isHighlightEnabled && highlightTargetEnabled}
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
    </div>
  );
}
