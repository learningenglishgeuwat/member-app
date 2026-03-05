'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VocabularyLegacyAlias() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/skill/vocabulary');
  }, [router]);

  return null;
}
