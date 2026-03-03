'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isVocabularyTopicId } from '../topic/data/topics';

const LAST_TOPIC_KEY = 'vocab_flashcard_last_topic_v1';
const DEFAULT_TOPIC = 'body-parts';

export default function VocabularyFlashcardEntryPage() {
  const router = useRouter();

  useEffect(() => {
    const savedTopic = window.localStorage.getItem(LAST_TOPIC_KEY);
    const topicId =
      savedTopic && isVocabularyTopicId(savedTopic) ? savedTopic : DEFAULT_TOPIC;
    router.replace(`/skill/vocabulary/flashcard/${topicId}`);
  }, [router]);

  return (
    <main
      style={{
        minHeight: '100dvh',
        background: '#06110b',
        color: '#f7fff9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <p style={{ margin: 0, opacity: 0.86 }}>Memuat flashcard...</p>
    </main>
  );
}
