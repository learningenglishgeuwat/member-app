import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_NUMBER_WORDS } from '../../data/words/number';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('number');

export default function VocabularyNumberPage() {
  return (
    <VocabularyTopicDetailPage
      topic={topic}
      topicWords={VOCAB_TOPIC_NUMBER_WORDS}
      showCardinalNumber
    />
  );
}
