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

const PhoneticPortal: React.FC = () => {
  const [activePortal, setActivePortal] = useState<string | null>(null);
  const [spinningCard, setSpinningCard] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Phonetic symbols organized by category and subcategory
  const phoneticSymbols: PhoneticSymbol[] = [
    // Vowels - Lax (reordered according to user specification)
    { symbol: 'ʌ', category: 'vowel', subcategory: 'lax' },
    { symbol: 'ɪ', category: 'vowel', subcategory: 'lax' },
    { symbol: 'ʊ', category: 'vowel', subcategory: 'lax' },
    { symbol: 'ɛ', category: 'vowel', subcategory: 'lax' },
    { symbol: 'ə', category: 'vowel', subcategory: 'lax' },
    { symbol: 'ɚ', category: 'vowel', subcategory: 'lax' },
    
    // Vowels - Tense (reordered according to user specification)
    { symbol: 'ɑ', category: 'vowel', subcategory: 'tense' },
    { symbol: 'i', category: 'vowel', subcategory: 'tense' },
    { symbol: 'u', category: 'vowel', subcategory: 'tense' },
    { symbol: 'æ', category: 'vowel', subcategory: 'tense' },
    { symbol: 'ɔ', category: 'vowel', subcategory: 'tense' },
    
    // Consonants - Voiceless
    { symbol: 'p', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 't', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 'k', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 'f', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 'θ', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 's', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 'ʃ', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 'ʧ', category: 'consonant', subcategory: 'voiceless' },
    { symbol: 'h', category: 'consonant', subcategory: 'voiceless' },
    
    // Consonants - Voiced
    { symbol: 'b', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'd', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'g', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'v', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'ð', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'z', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'ʒ', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'ʤ', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'l', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'm', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'n', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'ŋ', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'r', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'w', category: 'consonant', subcategory: 'voiced' },
    { symbol: 'y', category: 'consonant', subcategory: 'voiced' },
    
    // Diphthongs (reordered according to user specification)
    { symbol: 'aɪ', category: 'diphthong' },
    { symbol: 'eɪ', category: 'diphthong' },
    { symbol: 'ɔɪ', category: 'diphthong' },
    { symbol: 'ɪə', category: 'diphthong' },
    { symbol: 'eə', category: 'diphthong' },
    { symbol: 'ʊə', category: 'diphthong' },
    { symbol: 'oʊ', category: 'diphthong' },
    { symbol: 'aʊ', category: 'diphthong' }
  ];

  const togglePortal = (portalId: string) => {
    if (activePortal === portalId) {
      setActivePortal(null);
      setSpinningCard(null);
    } else {
      // Start spinning animation
      setSpinningCard(portalId);
      
      // Show panel after spinning completes (3 seconds total: 0.5s fast + 1.5s ultra-fast + 1s reverse)
      setTimeout(() => {
        setActivePortal(portalId);
        setSpinningCard(null);
      }, 3000);
    }
  };

  const handleSymbolClick = (symbol: PhoneticSymbol) => {
    // Navigate to dynamic route with symbol parameter
    const path = `/skill/pronunciation/phoneticSymbols/${encodeURIComponent(symbol.symbol)}`;
    router.push(path);
  };

  const getSymbolsByCategory = (category: string, subcategory?: string) => {
    return phoneticSymbols.filter(symbol => 
      symbol.category === category && 
      (!subcategory || symbol.subcategory === subcategory)
    );
  };

  return (
    <div className="pronunciation-layout futuristic-portal-container">
      {/* Background Effects */}
      <div className="cyber-grid"></div>
      <div className="cyber-particles"></div>
      <div className="glow-overlay"></div>
      
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      {/* Main Portal Container */}
      <main className="futuristic-portal-main">
        <div className="portal-title">
          <h1 className="title-text">PHONETIC PORTAL</h1>
          <div className="title-underline"></div>
        </div>
        
        <div className="portal-grid">
          {/* Vowel Portal */}
          <div 
            className={`portal-card ${activePortal === 'vowel' ? 'active' : ''}`}
            onClick={() => togglePortal('vowel')}
          >
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

          {/* Diphthong Portal */}
          <div 
            className={`portal-card ${activePortal === 'diphthong' ? 'active' : ''}`}
            onClick={() => togglePortal('diphthong')}
          >
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

          {/* Consonant Portal */}
          <div 
            className={`portal-card ${activePortal === 'consonant' ? 'active' : ''}`}
            onClick={() => togglePortal('consonant')}
          >
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

        {/* Symbol Display Panel */}
        {activePortal && (
          <div className="symbol-panel">
            <div className="panel-header">
              <h3 className="panel-title">
                {activePortal === 'vowel' && 'VOWEL SYMBOLS'}
                {activePortal === 'consonant' && 'CONSONANT SYMBOLS'}
                {activePortal === 'diphthong' && 'DIPHTHONG SYMBOLS'}
              </h3>
              <button 
                className="close-panel"
                onClick={() => setActivePortal(null)}
              >
                ✕
              </button>
            </div>
            
            <div className="symbol-content">
              {/* Vowel Symbols */}
              {activePortal === 'vowel' && (
                <>
                  <div className="symbol-group">
                    <h4 className="group-title">Lax Vowels</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('vowel', 'lax').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="symbol-group">
                    <h4 className="group-title">Tense Vowels</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('vowel', 'tense').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Consonant Symbols */}
              {activePortal === 'consonant' && (
                <>
                  <div className="symbol-group">
                    <h4 className="group-title">Voiceless</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('consonant', 'voiceless').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="symbol-group">
                    <h4 className="group-title">Voiced</h4>
                    <div className="symbol-grid">
                      {getSymbolsByCategory('consonant', 'voiced').map((symbol) => (
                        <button
                          key={symbol.symbol}
                          className="symbol-btn"
                          onClick={() => handleSymbolClick(symbol)}
                        >
                          {symbol.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Diphthong Symbols */}
              {activePortal === 'diphthong' && (
                <div className="symbol-group">
                  <h4 className="group-title">Diphthongs</h4>
                  <div className="symbol-grid">
                    {getSymbolsByCategory('diphthong').map((symbol) => (
                      <button
                        key={symbol.symbol}
                        className="symbol-btn"
                        onClick={() => handleSymbolClick(symbol)}
                      >
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
