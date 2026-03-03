import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_FRUIT_WORDS } from '../../data/words/fruit';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('fruit');

export default function VocabularyFruitPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_FRUIT_WORDS} />;
}

