import VocabularyFlashcardViewer from '../components/VocabularyFlashcardViewer';
import { getVocabularyTopicById } from '../../topic/data/topics';
import { getVocabularyWordsByTopic } from '../../topic/data/words';

const topic = getVocabularyTopicById('body-parts');

export default function VocabularyBodyPartsFlashcardPage() {
  const words = getVocabularyWordsByTopic('body-parts');

  return (
    <VocabularyFlashcardViewer
      topicId="body-parts"
      topicTitle={topic.title}
      words={words}
    />
  );
}
