import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_ORDINAL_NUMBER_WORDS } from '../../data/words/ordinal-number';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('ordinal-number');

export default function VocabularyOrdinalNumberPage() {
  return (
    <VocabularyTopicDetailPage
      topic={topic}
      topicWords={VOCAB_TOPIC_ORDINAL_NUMBER_WORDS}
    />
  );
}

