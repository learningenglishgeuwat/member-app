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
  isLoading: boolean
  error: string | null
  onRetry: () => void
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
    sectionWrap: 'border-yellow-400/35 bg-yellow-500/5',
    sectionTitle: 'text-yellow-300',
    itemWrap: 'bg-yellow-500/10 border-yellow-400/25',
    ipa: 'text-yellow-300',
    letter: 'text-yellow-100',
    description: 'text-yellow-50/90',
    example: 'text-yellow-100/85',
  },
  diphthong: {
    sectionWrap: 'border-green-400/35 bg-green-500/5',
    sectionTitle: 'text-green-300',
    itemWrap: 'bg-green-500/10 border-green-400/25',
    ipa: 'text-green-300',
    letter: 'text-green-100',
    description: 'text-green-50/90',
    example: 'text-green-100/85',
  },
  consonant: {
    sectionWrap: 'border-blue-400/35 bg-blue-500/5',
    sectionTitle: 'text-blue-300',
    itemWrap: 'bg-blue-500/10 border-blue-400/25',
    ipa: 'text-blue-300',
    letter: 'text-blue-100',
    description: 'text-blue-50/90',
    example: 'text-blue-100/85',
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
  isLoading,
  error,
  onRetry,
}) => {
  const [expandedSubSections, setExpandedSubSections] = useState<Record<string, boolean>>({})

  const groupedLetters = useMemo(() => {
    if (!letters?.length) return []

    const normalizedLetters: NormalizedCommonLetter[] = letters.map((letter) => ({
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
  }, [letters])

  const toggleSubSection = (category: string) => {
    setExpandedSubSections((prev) => ({
      ...prev,
      [category]: !(prev[category] ?? false),
    }))
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div
        className="symbol-detail-collapsible-panel bg-black/85 border border-cyber-cyan/40 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(6,182,212,0.15)]"
        style={{ '--panel-glow-rgb': '6, 182, 212' } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={onToggle}
          data-tour="symbol-common-letters-section-toggle"
          className="w-full bg-cyber-cyan/10 px-4 py-2 border-b border-cyber-cyan/30 flex items-center justify-between gap-2 text-left hover:bg-cyber-cyan/15 transition-colors"
          aria-expanded={isOpen}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="text-cyber-cyan" size={16} />
            <span className="ml-2 font-display text-[10px] md:text-xs text-cyber-cyan tracking-wider">COMMON_LETTERS</span>
          </div>
          <span className="symbol-detail-chevron-toggle text-cyber-cyan">
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
                {groupedLetters.map((category) => {
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
                          className={`text-cyber-cyan transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="space-y-3">
                          {category.letters.map((letter, idx) => (
                            <div key={idx} className={`border rounded p-3 ${theme.itemWrap}`}>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                  <span className={`text-lg md:text-xl font-bold ${theme.letter}`}>
                                    {letter.letter}
                                  </span>
                                  <span className={`text-sm md:text-base font-mono ${theme.ipa}`}>
                                    /{letter.ipaSymbol}/
                                  </span>
                                </div>
                              </div>
                              {letter.description && (
                                <p className={`text-[11px] md:text-sm mb-2 ${theme.description}`}>
                                  {letter.description}
                                </p>
                              )}
                              {letter.pronunciationTip && (
                                <p className={`text-[10px] md:text-xs font-mono mb-2 ${theme.example}`}>
                                  <strong>Tip:</strong> {letter.pronunciationTip}
                                </p>
                              )}
                              {letter.examples && letter.examples.length > 0 && (
                                <p className={`text-[10px] md:text-xs font-mono ${theme.example}`}>
                                  <strong>Examples:</strong> {letter.examples.join(', ')}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
