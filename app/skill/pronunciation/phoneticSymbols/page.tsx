'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './styles/portal.css';
import '../../../styles/scrollbar.css';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';

interface PhoneticSymbol {
  symbol: string;
  category: 'vowel' | 'consonant' | 'diphthong';
  subcategory?: 'lax' | 'tense' | 'voiced' | 'voiceless';
}

const phoneticSymbols: PhoneticSymbol[] = [
  // Vowels - Lax
  { symbol: '\u028c', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u026a', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u028a', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u025b', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u0259', category: 'vowel', subcategory: 'lax' }, // ?
  { symbol: '\u025a', category: 'vowel', subcategory: 'lax' }, // ?

  // Vowels - Tense
  { symbol: '\u0251', category: 'vowel', subcategory: 'tense' }, // ?
  { symbol: 'i', category: 'vowel', subcategory: 'tense' },
  { symbol: 'u', category: 'vowel', subcategory: 'tense' },
  { symbol: '\u00e6', category: 'vowel', subcategory: 'tense' }, // æ
  { symbol: '\u0254', category: 'vowel', subcategory: 'tense' }, // ?

  // Consonants - Voiceless
  { symbol: 'p', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 't', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 'k', category: 'consonant', subcategory: 'voiceless' },
  { symbol: 'f', category: 'consonant', subcategory: 'voiceless' },
  { symbol: '\u03b8', category: 'consonant', subcategory: 'voiceless' }, // ?
  { symbol: 's', category: 'consonant', subcategory: 'voiceless' },
  { symbol: '\u0283', category: 'consonant', subcategory: 'voiceless' }, // ?
  { symbol: '\u02a7', category: 'consonant', subcategory: 'voiceless' }, // ?
  { symbol: 'h', category: 'consonant', subcategory: 'voiceless' },

  // Consonants - Voiced
  { symbol: 'b', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'd', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'g', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'v', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u00f0', category: 'consonant', subcategory: 'voiced' }, // ð
  { symbol: 'z', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u0292', category: 'consonant', subcategory: 'voiced' }, // ?
  { symbol: '\u02a4', category: 'consonant', subcategory: 'voiced' }, // ?
  { symbol: 'l', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'm', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'n', category: 'consonant', subcategory: 'voiced' },
  { symbol: '\u014b', category: 'consonant', subcategory: 'voiced' }, // ?
  { symbol: 'r', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'w', category: 'consonant', subcategory: 'voiced' },
  { symbol: 'y', category: 'consonant', subcategory: 'voiced' },

  // Diphthongs
  { symbol: 'a\u026a', category: 'diphthong' }, // a?
  { symbol: 'e\u026a', category: 'diphthong' }, // e?
  { symbol: '\u0254\u026a', category: 'diphthong' }, // ??
  { symbol: '\u026a\u0259', category: 'diphthong' }, // ??
  { symbol: 'e\u0259', category: 'diphthong' }, // e?
  { symbol: '\u028a\u0259', category: 'diphthong' }, // ??
  { symbol: 'o\u028a', category: 'diphthong' }, // o?
  { symbol: 'a\u028a', category: 'diphthong' }, // a?
];

const PhoneticPortal: React.FC = () => {
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [spinningCard, setSpinningCard] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const togglePortal = (portalId: string) => {
    if (activePortal === portalId) {
      setActivePortal(null);
      setSpinningCard(null);
      return;
    }

    setSpinningCard(portalId);
    window.setTimeout(() => {
      setActivePortal(portalId);
      setSpinningCard(null);
    }, 3000);
  };

  const handleSymbolClick = (symbol: PhoneticSymbol) => {
    const path = `/skill/pronunciation/phoneticSymbols/${encodeURIComponent(symbol.symbol)}`;
    router.push(path);
  };

  const handleMinimalPairsClick = () => {
    router.push('/skill/pronunciation/phoneticSymbols/MinimalPairs');
  };

  const handleSummaryClick = () => {
    router.push('/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols');
  };

  const handleTongueTwisterClick = () => {
    router.push('/skill/pronunciation/phoneticSymbols/tongue-twister');
  };

  const getSymbolsByCategory = (category: string, subcategory?: string) =>
    phoneticSymbols.filter((symbol) => symbol.category === category && (!subcategory || symbol.subcategory === subcategory));

  return (
    <div className="pronunciation-layout futuristic-portal-container">
      <div className="cyber-grid" />
      <div className="cyber-particles" />
      <div className="glow-overlay" />

      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="futuristic-portal-main">
        <div className="portal-title">
          <h1 className="title-text">PHONETIC PORTAL</h1>
          <div className="title-underline" />
        </div>

        <div className="portal-grid">
          <div className={`portal-card ${activePortal === 'vowel' ? 'active' : ''}`} onClick={() => togglePortal('vowel')}>
            <div className="card-content">
              <div className="card-icon">
                <div className={`icon-circle ${spinningCard === 'vowel' ? 'spinning' : ''}`}>
                  <span className="icon-text">V</span>
                </div>
              </div>
              <h2 className="card-title">VOWELS</h2>
              <p className="card-description">Explore vowel sounds</p>
            </div>
          </div>

          <div className={`portal-card ${activePortal === 'diphthong' ? 'active' : ''}`} onClick={() => togglePortal('diphthong')}>
            <div className="card-content">
              <div className="card-icon">
                <div className={`icon-circle ${spinningCard === 'diphthong' ? 'spinning' : ''}`}>
                  <span className="icon-text">D</span>
                </div>
              </div>
              <h2 className="card-title">DIPHTHONGS</h2>
              <p className="card-description">Explore diphthong sounds</p>
            </div>
          </div>

          <div className={`portal-card ${activePortal === 'consonant' ? 'active' : ''}`} onClick={() => togglePortal('consonant')}>
            <div className="card-content">
              <div className="card-icon">
                <div className={`icon-circle ${spinningCard === 'consonant' ? 'spinning' : ''}`}>
                  <span className="icon-text">C</span>
                </div>
              </div>
              <h2 className="card-title">CONSONANTS</h2>
              <p className="card-description">Explore consonant sounds</p>
            </div>
          </div>
        </div>

        <div className="common-mistakes-wrap">
          <button
            type="button"
            onClick={handleMinimalPairsClick}
            className="common-mistakes-btn"
          >
            COMMON MISTAKES
          </button>
          <button
            type="button"
            onClick={handleSummaryClick}
            className="common-mistakes-btn"
          >
            SUMMARY
          </button>
          <button
            type="button"
            onClick={handleTongueTwisterClick}
            className="common-mistakes-btn"
          >
            TONGUE TWISTER
          </button>
        </div>

        {activePortal && (
          <div className="symbol-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                {activePortal === 'vowel' && 'VOWEL SYMBOLS'}
                {activePortal === 'consonant' && 'CONSONANT SYMBOLS'}
                {activePortal === 'diphthong' && 'DIPHTHONG SYMBOLS'}
              </h3>
              <button className="close-panel" onClick={() => setActivePortal(null)}>
                ×
              </button>
            </div>

            <div className="symbol-content">
              {activePortal === 'vowel' && (
                <>
                  <div className="symbol-group">
                    <h4 className="group-title">Lax Vowels</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('vowel', 'lax').map((symbol) => (
                        <button key={symbol.symbol} className="symbol-btn" onClick={() => handleSymbolClick(symbol)}>
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="symbol-group">
                    <h4 className="group-title">Tense Vowels</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('vowel', 'tense').map((symbol) => (
                        <button key={symbol.symbol} className="symbol-btn" onClick={() => handleSymbolClick(symbol)}>
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePortal === 'consonant' && (
                <>
                  <div className="symbol-group">
                    <h4 className="group-title">Voiceless</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('consonant', 'voiceless').map((symbol) => (
                        <button key={symbol.symbol} className="symbol-btn" onClick={() => handleSymbolClick(symbol)}>
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="symbol-group">
                    <h4 className="group-title">Voiced</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('consonant', 'voiced').map((symbol) => (
                        <button key={symbol.symbol} className="symbol-btn" onClick={() => handleSymbolClick(symbol)}>
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {activePortal === 'diphthong' && (
                <div className="symbol-group">
                  <h4 className="group-title">Diphthongs</h4>
                  <div className="symbol-grid">
                    {getSymbolsByCategory('diphthong').map((symbol) => (
                      <button key={symbol.symbol} className="symbol-btn" onClick={() => handleSymbolClick(symbol)}>
                        {symbol.symbol}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PhoneticPortal;
