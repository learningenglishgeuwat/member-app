import VocabularyTopicDetailPage from '../../../components/VocabularyTopicDetailPage';
import { getVocabularyTopicById } from '../../data/topics';
import { VOCAB_TOPIC_KITCHEN_WORDS } from '../../data/words/kitchen';
import '../../shared/vocabulary.css';

const topic = getVocabularyTopicById('kitchen');

export default function VocabularyKitchenPage() {
  return <VocabularyTopicDetailPage topic={topic} topicWords={VOCAB_TOPIC_KITCHEN_WORDS} />;
}
