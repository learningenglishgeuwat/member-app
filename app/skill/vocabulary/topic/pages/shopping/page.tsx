import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_SHOPPING_WORDS } from '../../data/words/shopping';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('shopping');

export default function VocabularyShoppingPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_SHOPPING_WORDS} />;
}
