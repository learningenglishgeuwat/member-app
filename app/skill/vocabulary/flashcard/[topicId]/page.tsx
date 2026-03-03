import { notFound } from 'next/navigation';
import VocabularyFlashcardViewer from '../components/VocabularyFlashcardViewer';
import {
  getVocabularyTopicById,
  isVocabularyTopicId,
} from '../../topic/data/topics';
import { getVocabularyWordsByTopic } from '../../topic/data/words';

type FlashcardTopicParams = { topicId: string };
type FlashcardTopicPageProps = { params: FlashcardTopicParams | Promise<FlashcardTopicParams> };

export default async function VocabularyTopicFlashcardPage({
  params,
}: FlashcardTopicPageProps) {
  const resolvedParams = await Promise.resolve(params);
  const topicParam = resolvedParams.topicId;

  if (!isVocabularyTopicId(topicParam)) {
    notFound();
  }

  const topic = getVocabularyTopicById(topicParam);
  const words = getVocabularyWordsByTopic(topicParam);

  if (!words.length) {
    notFound();
  }

  return (
    <VocabularyFlashcardViewer
      topicId={topicParam}
      topicTitle={topic.title}
      words={words}
    />
  );
}
