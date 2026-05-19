'use client'

import { useCallback, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import BackButton from '../../../components/BackButton';
import { TONGUE_TWISTERS } from './data/tongueTwisters';
import { speakText, stopSpeech, isSpeechSynthesisSupported } from '@/lib/tts/speech';
import { TwisterCard, TwisterLine } from './components/TwisterCard';
import { Highlight } from './components/Highlight';

export default function TongueTwisterPage() {
  const [selectedFocus, setSelectedFocus] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>(TONGUE_TWISTERS[0]?.id || '');
  const [focusDropdownOpen, setFocusDropdownOpen] = useState(false);
  const [twisterDropdownOpen, setTwisterDropdownOpen] = useState(false);
  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showIpa, setShowIpa] = useState(true);
  
  const focusDropdownRef = useRef<HTMLDivElement | null>(null);
  const twisterDropdownRef = useRef<HTMLDivElement | null>(null);

  // Extract unique focus options
  const focusOptions = useMemo(() => {
    const unique = new Set<string>(TONGUE_TWISTERS.map((item) => item.focus).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  // Filter twisters by focus
  const filteredTwisters = useMemo(() => {
    if (selectedFocus === 'all') return TONGUE_TWISTERS;
    return TONGUE_TWISTERS.filter((item) => item.focus === selectedFocus);
  }, [selectedFocus]);

  // Auto-select first item if current not in filtered list
  useEffect(() => {
    if (filteredTwisters.some((item) => item.id === selectedId)) return;
    const next = filteredTwisters[0]?.id ?? TONGUE_TWISTERS[0]?.id;
    if (next) {
      stopSpeech();
      setSelectedId(next);
      setActiveLineId(null);
      setIsPlaying(false);
    }
  }, [filteredTwisters, selectedId]);

  // Get active twister
  const activeTwister = useMemo(
    () => filteredTwisters.find((item) => item.id === selectedId) ?? filteredTwisters[0] ?? TONGUE_TWISTERS[0],
    [filteredTwisters, selectedId],
  );

  // Parse text to lines with intelligent highlighting based on IPA alignment
  const parseTextToLines = useCallback((twister: typeof activeTwister): TwisterLine[] => {
    if (!twister || !twister.text) return [];
    
    // Split by sentences
    const lines = twister.text.split(/(?<=[.!?])\s+/).filter(line => line.trim());
    
    // Extract IPA symbols from focus (e.g., "/θ/ and /t/" -> ["/θ/", "/t/"])
    const focusIPASymbols = (twister.focus.match(/\/[^/]+\//g) || []);
    
    return lines.map((line, index) => {
      let textNode: ReactNode = <>{line}</>;
      let ipaNode: ReactNode = <span className="text-gray-500">IPA not available</span>;
      
      // Get IPA line for this text line
      const ipaLine = twister.ipaLines?.[index] || '';
      
      // Highlight IPA with orange on focus symbols (IPA base color is cyan from TwisterCard)
      if (ipaLine && focusIPASymbols.length > 0) {
        // Extract just the IPA characters (without slashes) for matching
        const ipaChars = focusIPASymbols.map(s => s.replace(/\//g, ''));
        const ipaRegex = new RegExp(`(${ipaChars.join('|')})`, 'g');
        
        const ipaParts: ReactNode[] = [];
        const ipaSegments = ipaLine.split(ipaRegex);
        
        // Track which IPA symbols are highlighted and their positions
        const highlightedIPAPositions: Array<{char: string, index: number}> = [];
        let currentIPAPos = 0;
        
        ipaSegments.forEach((segment, i) => {
          if (!segment) return;
          
          const isMatch = ipaChars.some(char => segment === char);
          
          if (isMatch) {
            // Record the position of this highlighted IPA symbol
            highlightedIPAPositions.push({
              char: segment,
              index: currentIPAPos
            });
            // Highlight focus IPA symbols with orange
            ipaParts.push(<Highlight key={`ipa-${index}-${i}`}>{segment}</Highlight>);
          } else {
            ipaParts.push(segment);
          }
          
          currentIPAPos += segment.length;
        });
        
        ipaNode = <>{ipaParts}</>;
        
        // Now try to highlight text based on IPA alignment
        // Use letterMappings if available for accurate highlighting
        const letterMappings = twister.letterMappings?.[index];
        try {
          textNode = highlightTextBasedOnIPA(line, ipaLine, highlightedIPAPositions, index, letterMappings);
        } catch (error) {
          // If alignment fails, just show plain text
          console.warn('Text-IPA alignment failed:', error);
          textNode = <>{line}</>;
        }
      } else if (ipaLine) {
        ipaNode = <>{ipaLine}</>;
      }
      
      return {
        id: index + 1,
        text: textNode,
        ipa: ipaNode,
        rawText: line
      };
    });
  }, []);

  // Helper function to highlight text based on IPA alignment
  const highlightTextBasedOnIPA = useCallback((
    text: string,
    ipa: string,
    highlightedPositions: Array<{char: string, index: number}>,
    lineIndex: number,
    letterMappings?: Array<{letters: string, positions: number[], ipa: string}>
  ): ReactNode => {
    // If we have letter mappings, use them for accurate highlighting
    if (letterMappings && letterMappings.length > 0) {
      const parts: ReactNode[] = [];
      let lastPos = 0;
      
      // Extract IPA symbols that should be highlighted (without slashes)
      const focusIPASymbols = highlightedPositions.map(p => p.char);
      
      letterMappings.forEach((mapping, idx) => {
        const { letters, positions, ipa } = mapping;
        
        if (positions.length === 0) return;
        
        const startPos = positions[0];
        const endPos = positions[positions.length - 1] + 1;
        
        // Add any text between last position and this mapping
        if (startPos > lastPos) {
          parts.push(text.substring(lastPos, startPos));
        }
        
        // Check if this mapping's IPA matches any focus symbol
        const shouldHighlight = focusIPASymbols.some(focusIPA => ipa === focusIPA);
        
        const segment = text.substring(startPos, endPos);
        
        if (shouldHighlight && segment.trim()) {
          parts.push(<Highlight key={`text-${lineIndex}-${idx}`}>{segment}</Highlight>);
        } else {
          parts.push(segment);
        }
        
        lastPos = endPos;
      });
      
      // Add any remaining text
      if (lastPos < text.length) {
        parts.push(text.substring(lastPos));
      }
      
      return <>{parts}</>;
    }
    
    // If no mapping data, return plain text
    // This is safer than guessing with pattern matching
    return <>{text}</>;
  }, []);

  // Get lines for active twister
  const twisterLines = useMemo(() => parseTextToLines(activeTwister), [activeTwister, parseTextToLines]);

  // Handle focus selection
  const handleSelectFocus = useCallback(
    (nextFocus: string) => {
      if (nextFocus !== selectedFocus) {
        stopSpeech();
        setSelectedFocus(nextFocus);
        setActiveLineId(null);
        setIsPlaying(false);
      }
      setFocusDropdownOpen(false);
    },
    [selectedFocus],
  );

  // Handle twister selection
  const handleSelectTwister = useCallback(
    (nextId: string) => {
      if (nextId !== selectedId) {
        stopSpeech();
        setSelectedId(nextId);
        setActiveLineId(null);
        setIsPlaying(false);
      }
      setTwisterDropdownOpen(false);
    },
    [selectedId],
  );

  // Handle play line
  const handlePlayLine = useCallback(async (lineId: number, rawText: string) => {
    if (!isSpeechSynthesisSupported() || !rawText.trim()) return;

    // If same line is playing, stop it
    if (isPlaying && activeLineId === lineId) {
      stopSpeech();
      setIsPlaying(false);
      setActiveLineId(null);
      return;
    }

    // Stop any current playback
    stopSpeech();
    setActiveLineId(lineId);
    setIsPlaying(true);

    try {
      await speakText(rawText, {
        preferredEnglish: 'en-US',
        rate: 0.86,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak: false,
      });
      
      // Clear active state after playback ends
      setIsPlaying(false);
      setActiveLineId(null);
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      setActiveLineId(null);
    }
  }, [isPlaying, activeLineId]);

  // Click outside and Escape key handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      if (focusDropdownRef.current && !focusDropdownRef.current.contains(target)) {
        setFocusDropdownOpen(false);
      }
      
      if (twisterDropdownRef.current && !twisterDropdownRef.current.contains(target)) {
        setTwisterDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocusDropdownOpen(false);
        setTwisterDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      stopSpeech();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-[#e3e2e8] pb-24 md:pb-32">
      {/* Back Button */}
      <div className="fixed top-4 left-4 z-30">
        <BackButton to="/skill/pronunciation/reading-text" />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center pt-20 px-4 md:px-8">
        <div className="w-full max-w-[1200px] mx-auto">
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-[#00f3ff] mb-8 text-center" style={{ fontFamily: 'Space Grotesk, sans-serif', textShadow: '0 0 20px rgba(0, 243, 255, 0.5)' }}>
            TONGUE TWISTER
          </h1>

          {/* Dropdowns Container */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            
            {/* Focus Sound Filter */}
            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                Focus Sound
              </label>
              <div className="relative" ref={focusDropdownRef}>
                <button
                  type="button"
                  className="w-full min-h-[44px] bg-[#121317] border border-[rgba(0,243,255,0.3)] rounded-lg px-4 py-2 flex items-center justify-between text-left hover:border-[#00f3ff] transition-all"
                  onClick={() => {
                    setFocusDropdownOpen(!focusDropdownOpen);
                    setTwisterDropdownOpen(false);
                  }}
                >
                  <span className="text-[#e3e2e8]">
                    {selectedFocus === 'all' ? 'All Focus Sounds' : selectedFocus}
                  </span>
                  <ChevronDown 
                    size={20} 
                    className={`text-[#00f3ff] transition-transform duration-300 ${focusDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {focusDropdownOpen && (
                  <ul className="absolute top-full left-0 right-0 mt-2 bg-[#121317] border border-[rgba(0,243,255,0.3)] rounded-lg max-h-[280px] overflow-y-auto z-40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    <li>
                      <button
                        type="button"
                        className={`w-full px-4 py-2 text-left hover:bg-[rgba(0,243,255,0.1)] transition-colors ${selectedFocus === 'all' ? 'bg-[rgba(0,243,255,0.2)] text-[#00f3ff]' : 'text-[#e3e2e8]'}`}
                        onClick={() => handleSelectFocus('all')}
                      >
                        All Focus Sounds
                      </button>
                    </li>
                    {focusOptions.map((focus) => (
                      <li key={focus}>
                        <button
                          type="button"
                          className={`w-full px-4 py-2 text-left hover:bg-[rgba(0,243,255,0.1)] transition-colors ${focus === selectedFocus ? 'bg-[rgba(0,243,255,0.2)] text-[#00f3ff]' : 'text-[#e3e2e8]'}`}
                          onClick={() => handleSelectFocus(focus)}
                        >
                          {focus}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Twister Selector */}
            <div className="flex-1">
              <label className="block mb-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                Select Tongue Twister
              </label>
              <div className="relative" ref={twisterDropdownRef}>
                <button
                  type="button"
                  className="w-full min-h-[44px] bg-[#121317] border border-[rgba(0,243,255,0.3)] rounded-lg px-4 py-2 flex items-center justify-between text-left hover:border-[#00f3ff] transition-all"
                  onClick={() => {
                    setTwisterDropdownOpen(!twisterDropdownOpen);
                    setFocusDropdownOpen(false);
                  }}
                >
                  <span className="text-[#e3e2e8]">{activeTwister.label}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-[#00f3ff] transition-transform duration-300 ${twisterDropdownOpen ? 'rotate-180' : ''}`} 
                  />
                </button>

                {twisterDropdownOpen && (
                  <ul className="absolute top-full left-0 right-0 mt-2 bg-[#121317] border border-[rgba(0,243,255,0.3)] rounded-lg max-h-[280px] overflow-y-auto z-40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                    {filteredTwisters.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          className={`w-full px-4 py-2 text-left hover:bg-[rgba(0,243,255,0.1)] transition-colors ${item.id === selectedId ? 'bg-[rgba(0,243,255,0.2)] text-[#00f3ff]' : 'text-[#e3e2e8]'}`}
                          onClick={() => handleSelectTwister(item.id)}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 gap-6">
            {twisterLines.map((line) => (
              <TwisterCard
                key={line.id}
                line={line}
                isActive={activeLineId === line.id}
                isPlaying={isPlaying && activeLineId === line.id}
                onPlay={() => handlePlayLine(line.id, line.rawText)}
                showIpa={showIpa}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
