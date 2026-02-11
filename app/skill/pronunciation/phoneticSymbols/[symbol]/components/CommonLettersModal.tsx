'use client'

import React, { useMemo } from 'react'
import type { CommonLetter } from '../../data/commonLetters/CommonLetters'

type GroupedCommonLetters = {
  category: string
  letters: CommonLetter[]
}

type CommonLettersModalProps = {
  isOpen: boolean
  onClose: () => void
  letters: CommonLetter[] | null
  isLoading: boolean
  error: string | null
  onRetry: () => void
}

function toCategoryName(category: CommonLetter['category']) {
  if (category === 'vowel') return 'VOWEL'
  if (category === 'tense_vowel') return 'TENSE VOWEL'
  if (category === 'diphthong') return 'DIPHTHONG'
  return 'CONSONANT'
}

export default function CommonLettersModal({
  isOpen,
  onClose,
  letters,
  isLoading,
  error,
  onRetry,
}: CommonLettersModalProps) {
  const groupedLetters = useMemo(() => {
    if (!letters?.length) return []

    return letters.reduce((acc: GroupedCommonLetters[], letter) => {
      const categoryName = toCategoryName(letter.category)
      let category = acc.find((item) => item.category === categoryName)
      if (!category) {
        category = { category: categoryName, letters: [] }
        acc.push(category)
      }
      category.letters.push(letter)
      return acc
    }, [])
  }, [letters])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-[#0a0f1c] border border-cyber-pink/40 rounded-2xl p-4 sm:p-6 max-w-[95vw] sm:max-w-4xl max-h-[85vh] overflow-y-auto w-full shadow-[0_0_50px_rgba(255,0,255,0.3)] mx-4 sm:mx-auto">
        <button
          onClick={onClose}
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
            {groupedLetters.map((category) => (
              <div key={category.category} className="border border-cyber-pink/20 rounded-lg p-4 bg-black/40">
                <h4 className="text-lg font-bold text-cyber-pink mb-4 font-mono">{category.category}</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {category.letters.map((letter, index) => (
                    <div key={index} className="bg-cyber-slate/20 rounded-lg p-3 border border-cyber-pink/10">
                      <div className="flex items-center mb-2">
                        <span className="text-cyber-cyan font-bold text-lg mr-2">{letter.ipaSymbol}</span>
                        <span className="text-white font-mono text-sm">{letter.letter}</span>
                      </div>
                      {letter.description && <p className="text-gray-300 text-xs mb-2">{letter.description}</p>}
                      <div className="space-y-1">
                        {letter.examples.map((example, exampleIndex) => (
                          <div key={exampleIndex} className="text-gray-400 text-xs font-mono">
                            {example}
                          </div>
                        ))}
                      </div>
                      {letter.pronunciationTip && (
                        <div className="mt-2 p-2 bg-cyber-pink/10 rounded border border-cyber-pink/20">
                          <p className="text-cyber-pink text-xs font-mono">{letter.pronunciationTip}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
