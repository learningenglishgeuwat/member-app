'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SpeakingLegacyAlias() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/skill/speaking');
  }, [router]);

  return null;
}
