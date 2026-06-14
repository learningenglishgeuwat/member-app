'use client'

import React, { useMemo, useState } from 'react'
import { ChevronDown, BookOpen } from 'lucide-react'
import type { CommonLetter } from '../../data/commonLetters/CommonLetters'

type CanonicalCategory = CommonLetter['category']
type LegacyCategory = 'vowel' | 'tense_vowel' | 'consonant'
type CategoryFamily = 'vowel' | 'diphthong' | 'consonant'
type CategoryLabel = 'LAX VOWEL' | 'TENSE VOWEL' | 'DIPHTHONG' | 'VOICELESS CONSONANT' | 'VOICED CONSONANT'

type NormalizedCommonLetter = Omit<CommonLetter, 'category'> & {
  category: CanonicalCategory
}

type GroupedCommonLetters = {
  category: CategoryLabel
  family: CategoryFamily
  letters: NormalizedCommonLetter[]
}

interface CommonLettersSectionProps {
  isOpen: boolean
  onToggle: () => void
  letters: CommonLetter[] | null
  symbolIPA?: string
  isLoading: boolean
  error: string | null
  onRetry: () => void
  aliasMap?: Record<string, string[]>
}

const CATEGORY_THEME: Record<
  CategoryFamily,
  {
    sectionWrap: string
    sectionTitle: string
    itemWrap: string
    ipa: string
    letter: string
    description: string
    example: string
  }
> = {
  vowel: {
    sectionWrap: 'border-purple-500/40 bg-black/80',
    sectionTitle: 'text-purple-300',
    itemWrap: 'border-purple-500/30 bg-black/80',
    ipa: 'text-purple-300',
    letter: 'text-white',
    description: 'text-gray-200',
    example: 'text-gray-200/80',
  },
  diphthong: {
    sectionWrap: 'border-purple-500/40 bg-black/80',
    sectionTitle: 'text-purple-300',
    itemWrap: 'border-purple-500/30 bg-black/80',
    ipa: 'text-purple-300',
    letter: 'text-white',
    description: 'text-gray-200',
    example: 'text-gray-200/80',
  },
  consonant: {
    sectionWrap: 'border-purple-500/40 bg-black/80',
    sectionTitle: 'text-purple-300',
    itemWrap: 'border-purple-500/30 bg-black/80',
    ipa: 'text-purple-300',
    letter: 'text-white',
    description: 'text-gray-200',
    example: 'text-gray-200/80',
  },
}

function normalizeCommonLetterCategory(category: CanonicalCategory | LegacyCategory | string): CanonicalCategory {
  if (category === 'vowel' || category === 'vowel_lax') return 'vowel_lax'
  if (category === 'tense_vowel' || category === 'vowel_tense') return 'vowel_tense'
  if (category === 'diphthong') return 'diphthong'
  if (category === 'consonant_voiceless') return 'consonant_voiceless'
  return 'consonant_voiced'
}

function toCategoryName(category: CanonicalCategory): CategoryLabel {
  if (category === 'vowel_lax') return 'LAX VOWEL'
  if (category === 'vowel_tense') return 'TENSE VOWEL'
  if (category === 'diphthong') return 'DIPHTHONG'
  if (category === 'consonant_voiceless') return 'VOICELESS CONSONANT'
  return 'VOICED CONSONANT'
}

function toCategoryFamily(category: CanonicalCategory): CategoryFamily {
  if (category === 'vowel_lax' || category === 'vowel_tense') return 'vowel'
  if (category === 'diphthong') return 'diphthong'
  return 'consonant'
}

export const CommonLettersSection: React.FC<CommonLettersSectionProps> = ({
  isOpen,
  onToggle,
  letters,
  symbolIPA,
  isLoading,
  error,
  onRetry,
  aliasMap,
}) => {
  const [expandedSubSections, setExpandedSubSections] = useState<Record<string, boolean>>({})

  // Filter letters based on symbol IPA (considering aliases)
  const filteredLetters = useMemo(() => {
    if (!letters || !symbolIPA) {
      console.log('[CommonLettersSection] No filtering: letters=', letters, 'symbolIPA=', symbolIPA)
      return []
    }
    const allowed = new Set<string>([symbolIPA])
    if (typeof aliasMap !== 'undefined' && aliasMap?.[symbolIPA]) {
      aliasMap[symbolIPA].forEach((a) => allowed.add(a))
    }

    // Remove slashes from ipaSymbol in data and compare
    const matched = letters.filter((letter) => {
      const cleanedIpaSymbol = letter.ipaSymbol.replace(/\//g, '').trim()

      if (cleanedIpaSymbol.includes(' or ')) {
        const symbols = cleanedIpaSymbol.split(' or ').map((s) => s.trim())
        return symbols.some((s) => allowed.has(s))
      }

      return allowed.has(cleanedIpaSymbol)
    })
    
    console.log('[CommonLettersSection] Filtering:', {
      symbolIPA,
      totalLetters: letters.length,
      matchedCount: matched.length,
      sampleData: letters.slice(0, 3).map(l => ({ ipaSymbol: l.ipaSymbol, letter: l.letter })),
    })
    
    return matched.length > 0 ? matched : []
  }, [letters, symbolIPA, aliasMap])

  const groupedLetters = useMemo(() => {
    if (!filteredLetters?.length) return []

    const normalizedLetters: NormalizedCommonLetter[] = filteredLetters.map((letter) => ({
      ...letter,
      category: normalizeCommonLetterCategory(letter.category),
    }))

    return normalizedLetters.reduce((acc: GroupedCommonLetters[], letter) => {
      const categoryName = toCategoryName(letter.category)
      const categoryFamily = toCategoryFamily(letter.category)

      let category = acc.find((item) => item.category === categoryName)
      if (!category) {
        category = { category: categoryName, family: categoryFamily, letters: [] }
        acc.push(category)
      }

      category.letters.push(letter)
      return acc
    }, [])
  }, [filteredLetters])

  const toggleSubSection = (category: string) => {
    setExpandedSubSections((prev) => ({
      ...prev,
      [category]: !(prev[category] ?? false),
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div
        className="symbol-detail-collapsible-panel bg-black/90 border border-white/60 hover:border-purple-500 transition-colors rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"
        style={{ '--panel-glow-rgb': '168, 85, 247' } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={onToggle}
          data-tour="symbol-common-letters-section-toggle"
          className="w-full bg-white/5 px-4 py-2 border-b border-white/40 hover:border-purple-500 flex items-center justify-between gap-2 text-left hover:bg-white/10 transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="text-white" size={16} />
            <span className="ml-2 font-display text-[10px] md:text-xs text-white tracking-wider">COMMON_LETTERS</span>
          </div>
          <span className="symbol-detail-chevron-toggle text-white">
            <ChevronDown
              size={14}
              className={`symbol-detail-chevron-icon ${isOpen ? 'is-open' : ''}`}
            />
          </span>
        </button>

        {isOpen && (
          <div className="p-3 md:p-5">
            {isLoading && (
              <div className="text-sm text-cyber-cyan">Memuat data common letters...</div>
            )}

            {error && (
              <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-200 text-sm">
                <div>{error}</div>
                <button
                  type="button"
                  onClick={onRetry}
                  className="mt-3 inline-flex items-center justify-center rounded-full border border-red-400/60 px-4 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/10"
                >
                  Coba lagi
                </button>
              </div>
            )}

            {!isLoading && !error && (
              <div className="space-y-4">
                {groupedLetters.length > 0 ? (
                  groupedLetters.map((category) => {
                    const theme = CATEGORY_THEME[category.family]
                    const isExpanded = expandedSubSections[category.category] ?? false

                    return (
                      <div key={category.category} className={`border rounded-lg p-4 ${theme.sectionWrap}`}>
                        <button
                          type="button"
                          onClick={() => toggleSubSection(category.category)}
                          className="w-full flex items-center justify-between text-left mb-4"
                          aria-expanded={isExpanded}
                        >
                          <h4 className={`text-sm md:text-base font-bold font-mono ${theme.sectionTitle}`}>
                            {category.category}
                          </h4>
                          <ChevronDown
                            size={16}
                            className={`text-white/70 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>

                        {isExpanded && (
                          <div className="space-y-3">
                            {category.letters.map((letter, idx) => (
                              <div key={idx} className={`border rounded p-3 ${theme.itemWrap}`}>
                                <div className="flex flex-col mb-2">
                                  <span className={`font-bold text-lg mb-1 ${theme.ipa}`}>
                                    /{letter.ipaSymbol}/
                                  </span>
                                  <span className={`font-mono text-sm ${theme.letter}`}>
                                    {letter.letter}
                                  </span>
                                </div>

                                {letter.description && (
                                  <p className={`text-[11px] md:text-sm mb-2 ${theme.description}`}>
                                    {letter.description}
                                  </p>
                                )}

                                {letter.examples && letter.examples.length > 0 && (
                                  <div className="mt-2">
                                    <div className={`text-[11px] font-mono mb-1 ${theme.example}`}>
                                      <strong>Examples:</strong>
                                    </div>
                                    <div className="space-y-1">
                                      {letter.examples.map((ex, exIdx) => (
                                        <div key={exIdx} className={`text-[10px] font-mono ${theme.example}`}>
                                          {ex}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {letter.pronunciationTip && (
                                  <p className={`text-[10px] md:text-xs font-mono mt-2 ${theme.example}`}>
                                    <strong>Tip:</strong> {letter.pronunciationTip}
                                  </p>
                                )}

                                {letter.traps && letter.traps.length > 0 && (
                                  <div className={`mt-2 p-2 rounded bg-red-500/10 border border-red-400/30`}>
                                    <p className={`text-xs font-mono text-red-200`}>
                                      <strong>⚠️ Traps:</strong> {letter.traps.join(', ')}
                                    </p>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )
                })
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 text-sm">
                      No common letters available for this symbol category.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
