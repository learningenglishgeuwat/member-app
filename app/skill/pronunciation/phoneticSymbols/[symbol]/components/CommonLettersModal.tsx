'use client'

import React, { useMemo, useState } from 'react'
import type { CommonLetter } from '../../data/commonLetters/CommonLetters'

type CanonicalCategory = CommonLetter['category']
type LegacyCategory = 'vowel' | 'tense_vowel' | 'consonant'
type CategoryFamily = 'vowel' | 'diphthong' | 'consonant'
type CategoryLabel = 'VOWEL' | 'TENSE VOWEL' | 'DIPHTHONG' | 'CONSONANT'

type NormalizedCommonLetter = Omit<CommonLetter, 'category'> & {
  category: CanonicalCategory
}

type GroupedCommonLetters = {
  category: CategoryLabel
  family: CategoryFamily
  letters: NormalizedCommonLetter[]
}

type CommonLettersModalProps = {
  isOpen: boolean
  onClose: () => void
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
    toggle: string
    itemWrap: string
    ipa: string
    letter: string
    description: string
    example: string
    tipWrap: string
    tipText: string
  }
> = {
  vowel: {
    sectionWrap: 'border-yellow-400/35 bg-yellow-500/5',
    sectionTitle: 'text-yellow-300',
    toggle: 'text-yellow-300',
    itemWrap: 'bg-yellow-500/10 border-yellow-400/25',
    ipa: 'text-yellow-300',
    letter: 'text-yellow-100',
    description: 'text-yellow-50/90',
    example: 'text-yellow-100/85',
    tipWrap: 'bg-yellow-500/10 border border-yellow-400/30',
    tipText: 'text-yellow-200',
  },
  diphthong: {
    sectionWrap: 'border-green-400/35 bg-green-500/5',
    sectionTitle: 'text-green-300',
    toggle: 'text-green-300',
    itemWrap: 'bg-green-500/10 border-green-400/25',
    ipa: 'text-green-300',
    letter: 'text-green-100',
    description: 'text-green-50/90',
    example: 'text-green-100/85',
    tipWrap: 'bg-green-500/10 border border-green-400/30',
    tipText: 'text-green-200',
  },
  consonant: {
    sectionWrap: 'border-blue-400/35 bg-blue-500/5',
    sectionTitle: 'text-blue-300',
    toggle: 'text-blue-300',
    itemWrap: 'bg-blue-500/10 border-blue-400/25',
    ipa: 'text-blue-300',
    letter: 'text-blue-100',
    description: 'text-blue-50/90',
    example: 'text-blue-100/85',
    tipWrap: 'bg-blue-500/10 border border-blue-400/30',
    tipText: 'text-blue-200',
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
  if (category === 'vowel_lax') return 'VOWEL'
  if (category === 'vowel_tense') return 'TENSE VOWEL'
  if (category === 'diphthong') return 'DIPHTHONG'
  return 'CONSONANT'
}

function toCategoryFamily(category: CanonicalCategory): CategoryFamily {
  if (category === 'vowel_lax' || category === 'vowel_tense') return 'vowel'
  if (category === 'diphthong') return 'diphthong'
  return 'consonant'
}

export default function CommonLettersModal({
  isOpen,
  onClose,
  letters,
  isLoading,
  error,
  onRetry,
}: CommonLettersModalProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

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

  const toggleSection = (category: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [category]: !(prev[category] ?? false),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0a0f1c] border border-cyber-pink/40 rounded-2xl p-4 sm:p-6 max-w-[95vw] sm:max-w-4xl max-h-[85vh] overflow-y-auto w-full shadow-[0_0_50px_rgba(255,0,255,0.3)] mx-4 sm:mx-auto">
        <button
          onClick={onClose}
          data-tour="common-letters-modal-close"
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-red-500/20 p-2 rounded-lg transition-all duration-200"
          title="Tutup popup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex items-center mb-6">
          <h3 className="text-xl font-bold text-white">Common Letters</h3>
        </div>

        {isLoading && <div className="text-sm text-cyber-cyan">Memuat data common letters...</div>}

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-red-200">
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
          <div className="space-y-6">
            {groupedLetters.map((category) => {
              const theme = CATEGORY_THEME[category.family]

              return (
                <div key={category.category} className={`border rounded-lg p-4 ${theme.sectionWrap}`}>
                  <button
                    type="button"
                    onClick={() => toggleSection(category.category)}
                    data-tour={
                      category.category === 'VOWEL'
                        ? 'common-letters-toggle-vowel'
                        : undefined
                    }
                    className="common-letters-section-toggle w-full flex items-center justify-between text-left mb-4"
                    aria-expanded={expandedSections[category.category] ?? false}
                  >
                    <h4 className={`text-lg font-bold font-mono ${theme.sectionTitle}`}>{category.category}</h4>
                    <span
                      className={`common-letters-chevron ${theme.toggle} ${(expandedSections[category.category] ?? false) ? 'is-open' : ''}`}
                      aria-hidden="true"
                    />
                  </button>

                  {(expandedSections[category.category] ?? false) && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {category.letters.map((letter, index) => (
                        <div key={index} className={`rounded-lg p-3 border ${theme.itemWrap}`}>
                          <div className="flex items-center mb-2">
                            <span className={`font-bold text-lg mr-2 ${theme.ipa}`}>{letter.ipaSymbol}</span>
                            <span className={`font-mono text-sm ${theme.letter}`}>{letter.letter}</span>
                          </div>

                          {letter.description && <p className={`text-xs mb-2 ${theme.description}`}>{letter.description}</p>}

                          <div className="space-y-1">
                            {letter.examples.map((example, exampleIndex) => (
                              <div key={exampleIndex} className={`text-xs font-mono ${theme.example}`}>
                                {example}
                              </div>
                            ))}
                          </div>

                          {letter.pronunciationTip && (
                            <div className={`mt-2 p-2 rounded ${theme.tipWrap}`}>
                              <p className={`text-xs font-mono ${theme.tipText}`}>{letter.pronunciationTip}</p>
                            </div>
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

        <div className="mt-6 p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg">
          <p className="text-sm text-cyber-cyan">
            <strong>Inti Logi (WAJIB PAHAM):</strong> Huruf tidak menentukan bunyi - Simbol IPA = hasil pola huruf - Belajar dari simbol ke huruf jauh lebih efektif untuk reading & listening
          </p>
        </div>
      </div>
    </div>
  )
}
