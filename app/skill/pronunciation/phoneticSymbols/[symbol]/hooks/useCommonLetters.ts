import React, { useCallback, useEffect, useState } from 'react';
import { type CommonLetter, getAllCommonLetters } from '../../data/commonLetters/CommonLetters';

export interface UseCommonLettersParams {
  initialCommonLetters?: CommonLetter[] | null;
}

export interface UseCommonLettersResult {
  commonLetters: CommonLetter[] | null;
  commonLettersLoading: boolean;
  commonLettersError: string | null;
  showCommonLettersPopup: boolean;
  openCommonLettersModal: () => Promise<void>;
  closeCommonLettersModal: () => void;
}

export const useCommonLetters = ({ initialCommonLetters }: UseCommonLettersParams): UseCommonLettersResult => {
  const [commonLetters, setCommonLetters] = useState<CommonLetter[] | null>(initialCommonLetters ?? null);
  const [commonLettersLoading, setCommonLettersLoading] = useState(false);
  const [commonLettersError, setCommonLettersError] = useState<string | null>(null);
  const [showCommonLettersPopup, setShowCommonLettersPopup] = useState(false);

  useEffect(() => {
    if (initialCommonLetters && commonLetters === null) {
      setCommonLetters(initialCommonLetters);
    }
  }, [initialCommonLetters, commonLetters]);

  const openCommonLettersModal = useCallback(async () => {
    setShowCommonLettersPopup(true);

    if (commonLetters || commonLettersLoading) {
      return;
    }

    setCommonLettersLoading(true);
    setCommonLettersError(null);

    try {
      const commonLettersModule = await import('../../data/commonLetters/CommonLetters');
      setCommonLetters(commonLettersModule.getAllCommonLetters());
    } catch (error) {
      console.error('Failed to load common letters:', error);
      setCommonLettersError('Gagal memuat data common letters. Silakan coba lagi.');
    } finally {
      setCommonLettersLoading(false);
    }
  }, [commonLetters, commonLettersLoading]);

  const closeCommonLettersModal = useCallback(() => {
    setShowCommonLettersPopup(false);
  }, []);

  return {
    commonLetters,
    commonLettersLoading,
    commonLettersError,
    showCommonLettersPopup,
    openCommonLettersModal,
    closeCommonLettersModal,
  };
};
